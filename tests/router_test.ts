
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { deployer, addresses, tokens } from './contants.ts';
import {
  mintToken,
  createTestPair,
  checkTuple,
  createWSTXPair,
  checkTupleResult,
  checkTupleOk,
  initRevShare,
} from './util.ts';

type Big = number|string

const err_swap_postconditions   = 110

const err_router_preconditions  = 200
const err_router_postconditions = 201

const { 
  core,
  token_x,
  token_y,
  wstx,
  lp_token,
  rev_too,
} = addresses

const {
  token_x_id,
  token_y_id,
  lp_token_id,
} = tokens

const testPool = [
  types.uint(1),
  types.principal(token_x),
  types.principal(token_y),
  types.principal(lp_token),
]

// read-only
const addLiquidityCalc = (chain: Chain, amt0desired: Big, amt1desired: Big, amt0Min: Big, amt1min: Big) =>
    chain.callReadOnlyFn('router', 'add-liquidity-calc', [
        types.uint(1),
        types.uint(amt0desired),
        types.uint(amt1desired),
        types.uint(amt0Min),
        types.uint(amt1min),
    ], deployer)

// public
const addLiquidity = (amt0desired: Big, amt1desired: Big, amt0Min: Big, amt1min: Big, from: string) =>
    Tx.contractCall('router', 'add-liquidity', [
        ...testPool,
        types.uint(amt0desired),
        types.uint(amt1desired),
        types.uint(amt0Min),
        types.uint(amt1min),
    ], from)

const removeLiquidity = (liquidity: Big, amt0Min: Big, amt1min: Big, from: string) =>
    Tx.contractCall('router', 'remove-liquidity', [
        ...testPool,
        types.uint(liquidity),
        types.uint(amt0Min),
        types.uint(amt1min),
    ], from)

const swapExactTokensForTokens = (tokenIn: 'x'|'y', tokenOut: 'x'|'y', amtIn: Big, amtOutMin: Big, from: string) =>
    Tx.contractCall('router', 'swap-exact-tokens-for-tokens', [
        types.uint(1),
        types.principal(token_x),
        types.principal(token_y),
        tokenIn === 'x' ? types.principal(token_x): types.principal(token_y),
        tokenOut === 'x' ? types.principal(token_x): types.principal(token_y),
        types.principal(rev_too),
        types.uint(amtIn),
        types.uint(amtOutMin),
    ], from)

const swapTokensForExactTokens = (tokenIn: 'x'|'y', tokenOut: 'x'|'y', amtInMax: Big, amtOut: Big, from: string) =>
    Tx.contractCall('router', 'swap-tokens-for-exact-tokens', [
        types.uint(1),
        types.principal(token_x),
        types.principal(token_y),
        tokenIn === 'x' ? types.principal(token_x): types.principal(token_y),
        tokenOut === 'x' ? types.principal(token_x): types.principal(token_y),
        types.principal(rev_too),
        types.uint(amtInMax),
        types.uint(amtOut),
    ], from)

// uint: 128 bits (~10**38)

Clarinet.test({
    name: 'add-liquidity-calc : 0 reserves',
    async fn(chain: Chain, accounts: Map<string, Account>) {
      const wallet_1 = accounts.get('wallet_1')!.address

      // setup
      // reserves 0
      let block = chain.mineBlock([
          mintToken('token-x', 100, wallet_1),
          mintToken('token-y', 100, wallet_1),
          createTestPair(),
      ])

      assertEquals(block.receipts.length, 3)

      const tests = [
        [[10, 10, 10, 11], { amt0: 10, amt1: 10}],
        [[100, 100, 200, 200], { amt0: 100, amt1: 100}],
      ]

      const res = tests.map(([inputs]) => addLiquidityCalc(chain, ...inputs))
      tests.map(([, exp], i) => checkTupleOk(res[i], exp))
    }
})

Clarinet.test({
  name: 'add-liquidity : fails on min > desired',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get('wallet_1')!.address

    // setup
    let block = chain.mineBlock([
        mintToken('token-x', 1_000_000, wallet_1),
        mintToken('token-y', 1_000_000, wallet_1),
        createTestPair(),
    ])
    assertEquals(block.receipts.length, 3)

    // test
    block = chain.mineBlock([
        addLiquidity(10, 12, 10, 100, wallet_1)
    ])

    block.receipts[0].result.expectErr(err_router_preconditions)
  }
})

Clarinet.test({
    name: 'add-liquidity : returns same value with equal pool',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet_1 = accounts.get('wallet_1')!.address

        // setup
        let block = chain.mineBlock([
            mintToken('token-x', 10_000_000, wallet_1),
            mintToken('token-y', 10_000_000, wallet_1),
            createTestPair(),
            addLiquidity(1_000_000, 1_000_000, 1_000_000, 1_000_000, wallet_1),
        ])
        assertEquals(block.receipts.length, 4)

        // amt-desired/amt-min
        const tests = [
            [[100, 100, 80, 80, wallet_1], { amt0: 100, amt1: 100 }],
            [[1_000, 1_000, 800, 1_000, wallet_1], { amt0: 1_000, amt1: 1_000 }],
            [[10_000, 10_000, 8_000, 10_000, wallet_1], { amt0: 10_000, amt1: 10_000 }],
        ]

        block = chain.mineBlock(
            tests.map(([inputs]) => addLiquidity(...inputs))
        )
        tests.map(([, exp], i) => checkTupleOk(block.receipts[i], exp))
    }
})

Clarinet.test({
    name: 'add-liquidity : unequal pool',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet_1 = accounts.get('wallet_1')!.address

        // setup
        let block = chain.mineBlock([
            mintToken('token-x', 10_000_000, wallet_1),
            mintToken('token-y', 10_000_000, wallet_1),
            createTestPair(),
            addLiquidity(1_000_000, 5_000_000, 1_000_000, 5_000_000, wallet_1)
        ])
        assertEquals(block.receipts.length, 4)

        // amt-desired/amt-min
        const tests = [
            [[100, 100, 20, 80, wallet_1], { amt0: 20, amt1: 100 }],
            [[1_000, 1_000, 200, 1_000, wallet_1], { amt0: 200, amt1: 1_000 }],
            [[10_000, 10_000, 2_000, 10_000, wallet_1], { amt0: 2_000, amt1: 10_000 }],
        ]

        block = chain.mineBlock(
            tests.map(([inputs]) => addLiquidity(...inputs))
        )
        tests.map(([, exp], i) => checkTupleOk(block.receipts[i], exp))
    }
})

Clarinet.test({
  name: 'removeLiquidity',
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get('wallet_1')!.address

    // setup
    let block = chain.mineBlock([
        mintToken('token-x', 1_000_000, wallet_1),
        mintToken('token-y', 1_000_000, wallet_1),
        createTestPair(),
        addLiquidity(1_000, 1_000, 1_000, 1_000, wallet_1),
    ])

    assertEquals(block.receipts.length, 4)
    let assets = chain.getAssetsMaps().assets

    // liquidity, amts-min
    block = chain.mineBlock([
        removeLiquidity(1_000, 1_000, 1_000, wallet_1),
        addLiquidity(1_000, 1_000, 1_000, 1_000, wallet_1),
    ])

    checkTupleOk(block.receipts[0], { amt0: 1_000, amt1: 1_000 })

    const tests = [
        [[10, 10, 10, wallet_1], { amt0: 10, amt1: 10 }],
        [[20, 20, 20, wallet_1], { amt0: 20, amt1: 20 }],
        [[100, 10, 10, wallet_1], { amt0: 100, amt1: 100 }],
    ]

    block = chain.mineBlock(
        tests.map(([inputs]) => removeLiquidity(...inputs))
    )

    assets = chain.getAssetsMaps().assets

    tests.map(([, exp], i) => checkTupleOk(block.receipts[i], exp))
  }
})

Clarinet.test({
    name: 'swap-exact-tokens-for-tokens ....',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet_1 = accounts.get('wallet_1')!.address
        const wallet_2 = accounts.get('wallet_2')!.address
        
        // setup
        initRevShare(chain)

        let block = chain.mineBlock([
            mintToken('token-x', 1_000_000, wallet_1),
            mintToken('token-y', 1_000_000, wallet_1),
            mintToken('token-x', 1_000_000, wallet_2),
            createTestPair(),
            addLiquidity(1_000, 500, 1_000, 500, wallet_1),
        ])
    
        let assets = chain.getAssetsMaps().assets

        // tokenOut, tokenOut, in, minOut
        block = chain.mineBlock([
            swapExactTokensForTokens('x', 'y', 500, 1, wallet_2)
        ])

        assets = chain.getAssetsMaps().assets
        assertEquals(assets[token_x_id][wallet_1], 1_000_000 - 1_000)
        assertEquals(assets[token_y_id][wallet_1], 1_000_000 - 500)
        assertEquals(assets[token_x_id][wallet_2], 1_000_000 - 500)
        assertEquals(assets[token_y_id][wallet_2], 166)
        assertEquals(assets[token_x_id][core], 1_500)
        assertEquals(assets[token_y_id][core], 500 - 166)

        block = chain.mineBlock([
            swapExactTokensForTokens('y', 'x', 166, 400, wallet_2)
        ])

        assets = chain.getAssetsMaps().assets
        assertEquals(assets[token_x_id][wallet_2], 1_000_000 - 500 + 495)
        assertEquals(assets[token_y_id][wallet_2], 0)
        assertEquals(assets[token_x_id][core], 1_500 - 495)
        assertEquals(assets[token_y_id][core], 500)
    }
})

Clarinet.test({
    name: 'swap-tokens-for-exact-tokens ....',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet_1 = accounts.get('wallet_1')!.address
        const wallet_2 = accounts.get('wallet_2')!.address
        
        // setup
        initRevShare(chain)

        let block = chain.mineBlock([
            mintToken('token-x', 1_000_000, wallet_1),
            mintToken('token-y', 1_000_000, wallet_1),
            mintToken('token-x', 1_000_000, wallet_2),
            createTestPair(),
            addLiquidity(1_000, 500, 1_000, 500, wallet_1),
        ])
    
        let assets = chain.getAssetsMaps().assets

        // tokenIn, tokenOut, maxIn, out
        // NOTE: division by zero error when swapping out all
        block = chain.mineBlock([
          swapTokensForExactTokens('x', 'y', 1_000, 10, wallet_2),
        ])

        // TODO: check wrong token-0/token-1
        assets = chain.getAssetsMaps().assets

        block.receipts[0].result.expectErr().expectUint(err_swap_postconditions)
    }
})
