
import { Clarinet, Tx, Chain, Account, Contract, types } from 'https://deno.land/x/clarinet@v1.5.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { addresses, deployer, tokens, swap_fee, protocol_fee, rev_share } from './contants.ts'
import {
  mintToken,
  createTestPair,
  createWSTXPair,
  depositTestPair,
  depositWSTXPair,
  createTestPairWithProtocolFee,
  initRevShare,
  fee,
} from './util.ts';

type Big = number|string

const err_auth                   = 100
const err_check_owner            = 101
const err_no_such_pool           = 102
const err_create_preconditions   = 103
const err_create_postconditions  = 104
const err_mint_preconditions     = 105
const err_mint_postconditions    = 106
const err_burn_preconditions     = 107
const err_burn_postconditons     = 108
const err_swap_preconditions     = 109
const err_swap_postconditions    = 110
const err_collect_preconditions  = 111
const err_collect_postconditions = 112
const err_anti_rug               = 113

const err_ft_transter            = 1

const {
  core,
  token_x,
  token_y,
  token_z,
  lp_token,
  lp_token_not_ft,
  wstx,
  rev_too,
} = addresses 

const {
  token_x_id,
  token_y_id,
  lp_token_id
} = tokens

// setters
const setOwner = (owner: string, sender: string) =>
  Tx.contractCall('core', 'set-owner', [
    types.principal(owner)
  ], sender)

const setFeeToo = (feeToo: string, sender: string) =>
  Tx.contractCall('core', 'set-fee-to', [
    types.principal(feeToo)
  ], sender)

const setRevShare = (revShare: string, sender: string) =>
  Tx.contractCall('core', 'set-rev-share', [
    types.principal(revShare)
  ], sender)

const updateSwapFee = (pool: number, fee0: number[], sender: string) =>
  Tx.contractCall('core', 'update-swap-fee', [
    types.uint(pool),
    fee(fee0[0], fee0[1]),
  ], sender)

const updateProtocolFee = (pool: number, fee0: number[], sender: string) =>
  Tx.contractCall('core', 'update-protocol-fee', [
    types.uint(pool),
    fee(fee0[0], fee0[1]),
  ], sender)

const updateShareFee = (pool: number, fee0: number[], sender: string) =>
  Tx.contractCall('core', 'update-share-fee', [
    types.uint(pool),
    fee(fee0[0], fee0[1]),
  ], sender)

// read-only
const getRevenue = (chain: Chain, pool: number) =>
    chain.callReadOnlyFn('core', 'do-get-revenue', [types.uint(pool)], deployer)
          .result.expectTuple()

// public
export const swapXY = (amtIn: Big, amtOut: Big, from: string) =>
  Tx.contractCall('core', 'swap', [
    types.uint(1),
    types.principal(token_x),
    types.principal(token_y),
    types.principal(rev_too),
    types.uint(amtIn),
    types.uint(amtOut), 
], from)

export const swapYX = (amtIn: Big, amtOut: Big, from: string) =>
  Tx.contractCall('core', 'swap', [
    types.uint(1),
    types.principal(token_y),
    types.principal(token_x),
    types.principal(rev_too),
    types.uint(amtIn),
    types.uint(amtOut), 
], from)

export const mint = (amt0: Big, amt1: Big, from: string) =>
  Tx.contractCall('core', 'mint', [
    types.uint(1),
    types.principal(token_x),
    types.principal(token_y),
    types.principal(lp_token),
    types.uint(amt0),
    types.uint(amt1),
], from)

export const burn = (amt: Big, from: string) =>
  Tx.contractCall('core', 'burn', [
    types.uint(1),
    types.principal(token_x),
    types.principal(token_y),
    types.principal(lp_token),
    types.uint(amt),
], from)

export const collect = () =>
  Tx.contractCall('core', 'collect', [
      types.uint(1),
      types.principal(token_x),
      types.principal(token_y),
  ], deployer)

// --------

Clarinet.test({
  name: 'ensure owner is deployer',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let deployer = accounts.get('deployer')!.address

      let contractOwner = chain.callReadOnlyFn('core', 'get-owner', [], deployer)
      contractOwner.result.expectPrincipal(deployer)
      },
});

Clarinet.test({
  name: 'create fails on not owner',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      initRevShare(chain)

      let block = chain.mineBlock([
        Tx.contractCall('core', 'create', [
          types.principal(token_x),
          types.principal(token_y),
          types.principal(lp_token),
          swap_fee,
          protocol_fee,
          rev_share,
        ], wallet_1)
      ])

      block.receipts[0].result
        .expectErr()
        .expectUint(err_check_owner)
    }
});

Clarinet.test({
  name: 'create fails on same x/y-token',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let deployer = accounts.get('deployer')!.address

      let block = chain.mineBlock([
        Tx.contractCall('core', 'create', [
          types.principal(token_x),
          types.principal(token_x),
          types.principal(lp_token),
          swap_fee,
          protocol_fee,
          rev_share,
        ], deployer)
      ])

      block.receipts[0].result
          .expectErr()
          .expectUint(err_create_preconditions)
    }
});

Clarinet.test({
  name: 'create fails on existing lp-token',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let deployer = accounts.get('deployer')!.address
      initRevShare(chain)

      // setup
      let block = chain.mineBlock([
        createTestPair(),
      ])

      // test
      block = chain.mineBlock([
        Tx.contractCall('core', 'create', [
          types.principal(token_x),
          types.principal(token_z),
          types.principal(lp_token),
          swap_fee,
          protocol_fee,
          rev_share,
        ], deployer)
      ])

      block.receipts[0].result
          .expectErr()
          .expectUint(err_create_preconditions)
    }
});

Clarinet.test({
  name: 'create: fails on wrong trait',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let deployer = accounts.get('deployer')!.address

      initRevShare(chain)

      let block = chain.mineBlock([
        Tx.contractCall('core', 'create', [
          types.principal(token_x),
          types.principal(token_z),
          types.principal(lp_token_not_ft),
          swap_fee,
          protocol_fee,
          rev_share,
        ], deployer)
      ])

      assertEquals(block.receipts.length, 0)
    }
});

Clarinet.test({
  name: 'create: adds entries to pools, revenue & index maps',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let deployer = accounts.get('deployer')!.address

      initRevShare(chain)

      let block = chain.mineBlock([
        createTestPair(),
      ])

      let revenue = getRevenue(chain, 1)

      revenue['token0'].expectUint(0)
      revenue['token1'].expectUint(0)

      chain.callReadOnlyFn('core', 'get-pool-id', [types.principal(token_x), types.principal(token_y)], deployer)
          .result
          .expectSome()
          .expectUint(1)

      let pair = chain.callReadOnlyFn('core', 'get-pool', [types.uint(1)], deployer)
          .result
          .expectSome()
          .expectTuple()

      pair['token0'].expectPrincipal(token_x)
      pair['token1'].expectPrincipal(token_y)
      pair['symbol'].expectAscii('X-Y')

      let pair1 = chain.callReadOnlyFn('core', 'lookup-pool', [types.principal(token_x), types.principal(token_y)], deployer)
          .result
          .expectSome()
          .expectTuple()

      pair1['flipped'].expectBool(false)
      pair1['pool'].expectTuple()['token0'].expectPrincipal(token_x)
      pair1['pool'].expectTuple()['token1'].expectPrincipal(token_y)
      pair1['pool'].expectTuple()['lp-token'].expectPrincipal(lp_token)
      pair1['pool'].expectTuple()['reserve0'].expectUint(0)
      pair1['pool'].expectTuple()['reserve1'].expectUint(0)
    }
});

// ===== Setters

Clarinet.test({
    name: 'setters: can only be called by owner',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get('wallet_1')!.address

        // setup
        let block = chain.mineBlock([
            createTestPair(),
        ])

        block = chain.mineBlock([
            // addresses
            setOwner(wallet_1, wallet_1),
            setRevShare(wallet_1, wallet_1),
            setFeeToo(wallet_1, wallet_1),
            // fees
            updateSwapFee(1, [998, 1000], wallet_1),
            updateProtocolFee(1, [998, 1000], wallet_1),
            updateShareFee(1, [998, 1000], wallet_1)
        ])

        block.receipts.forEach(r => r.result.expectErr().expectUint(err_check_owner))
    }
})


// TODO: mint postcondition
Clarinet.test({
    name: 'setters: fees can only be reasonable values',
    async fn(chain: Chain) {
        // setup
        let block = chain.mineBlock([
            createTestPair(),
        ])

        // swap fee
        block = chain.mineBlock([
            updateSwapFee(1, [994, 1_000], deployer),
            updateSwapFee(1, [99, 100], deployer),
            updateSwapFee(1, [9, 10], deployer),
        ])
        block.receipts.forEach(r => r.result.expectErr().expectUint(err_anti_rug))

        block = chain.mineBlock([
            updateSwapFee(1, [995, 1_000], deployer),
            updateSwapFee(1, [100, 100], deployer),
            updateSwapFee(1, [9_995, 10_000], deployer),
        ])
        block.receipts.forEach(r => r.result.expectOk())

        // NOTE: no limitation on protocol/share
        block = chain.mineBlock([
            updateProtocolFee(1, [1, 0], deployer),
            updateShareFee(1, [1, 0], deployer)
        ])
        block.receipts.forEach(r => r.result.expectOk())
    }
})

// ===== Mint

Clarinet.test({
    name: 'mint fails when recipient has insufficient balance',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get('wallet_1')!.address
        let wallet_2 = accounts.get('wallet_2')!.address
        wallet_1.expectPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5')
        wallet_2.expectPrincipal('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')

        initRevShare(chain)

        let block = chain.mineBlock([
            createTestPair(),
            Tx.contractCall('core', 'mint', [
                types.uint(1),
                types.principal(token_x),
                types.principal(token_y),
                types.principal(lp_token),
                types.uint(10),
                types.uint(10),
            ], wallet_1),
        ]);

        assertEquals(block.receipts.length, 2)
        block.receipts[0].result
          .expectOk()
        block.receipts[1].result
          .expectErr()
          .expectUint(err_ft_transter)
    },
});

Clarinet.test({
  name: 'mint fails on nonexistant pair',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      // setup
      let block = chain.mineBlock([
          mintToken('token-x', 1000, wallet_1),
          mintToken('token-y', 2000, wallet_1),
      ]);

      // test
      block = chain.mineBlock([
          Tx.contractCall('core', 'mint', [
              types.uint(1),
              types.principal(token_x),
              types.principal(token_y),
              types.principal(lp_token),
              types.uint(10),
              types.uint(10),
          ], wallet_1),
      ]);

      assertEquals(block.receipts.length, 0)
    }
})

Clarinet.test({
    name: 'mint: postconditions (overflow in burn)',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get('wallet_1')!.address
        let wallet_2 = accounts.get('wallet_2')!.address

        // setup
        let block = chain.mineBlock([
            mintToken('token-x', n(38), wallet_1),
            mintToken('token-y', n(38), wallet_1),
            mintToken('token-x', n(38), wallet_2),
            mintToken('token-y', n(38), wallet_2),
            createTestPair(),
            depositTestPair(n(28), n(28), wallet_1)
        ]);

        // test
        block = chain.mineBlock([
            depositTestPair(n(18), n(18), wallet_2),
            burn(n(18), wallet_2),
        ]);

        block.receipts[0].result.expectOk().expectTuple().liquidity.expectUint(n(18))
        block.receipts[1].result.expectOk()

        block = chain.mineBlock([
            depositTestPair(n(19), n(19), wallet_2),
            burn(n(19), wallet_2),
        ]);
        block.receipts[0].result.expectOk()
        block.receipts[1].result.expectOk()

        block = chain.mineBlock([
            depositTestPair(n(19), n(19), wallet_2),
        ]);

        // NOTE: error == overflow..
        block = chain.mineBlock([
            depositTestPair(n(20), n(20), wallet_2),
        ]);
        assertEquals(block.receipts.length, 0)
    }
})

Clarinet.test({
    name: 'mint mints lp-tokens to sender & transfers deposit amounts',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get('wallet_1')!.address
  
        // setup
        let block = chain.mineBlock([
            mintToken('token-x', 1000, wallet_1),
            mintToken('token-y', 2000, wallet_1),
            createTestPair(),
        ]);  

        // test
        block = chain.mineBlock([
            Tx.contractCall('core', 'mint', [
                types.uint(1),
                types.principal(token_x),
                types.principal(token_y),
                types.principal(lp_token),
                types.uint(10),
                types.uint(10),
          ], wallet_1),
        ]);

        assertEquals(block.receipts.length, 1);
        block.receipts[0].result
            .expectOk()
            .expectTuple()

        block.receipts[0].events
            .expectFungibleTokenMintEvent(10, wallet_1, `${lp_token}::lp-token`)
        block.receipts[0].events
            .expectFungibleTokenTransferEvent(10, wallet_1, `${deployer}.core`, `${token_x}::token-x`)
        block.receipts[0].events
            .expectFungibleTokenTransferEvent(10, wallet_1, `${deployer}.core`, `${token_y}::token-y`)

        let assets = chain.getAssetsMaps().assets
        assertEquals(assets[token_x_id][wallet_1], 990)
        assertEquals(assets[token_y_id][wallet_1], 1990)
        assertEquals(assets[token_x_id][core], 10)
        assertEquals(assets[token_y_id][core], 10)
        assertEquals(assets[lp_token_id][wallet_1], 10)
    }
});


// ===== Burn

Clarinet.test({
  name: 'burn fails on non-existant pair',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      let block = chain.mineBlock([
          Tx.contractCall('core', 'burn', [
              types.uint(1),
              types.principal(token_x),
              types.principal(token_y),
              types.principal(lp_token),
              types.uint(100),
          ], wallet_1)
      ])

      assertEquals(block.receipts.length, 0)
      // assertEquals(block.receipts.length, 1)
      // block.receipts[0].result.expectErr().expectErr(err_no_such_pool)
  }
});


Clarinet.test({
  name: 'withdraw fails on lp-balance < amt',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      let block = chain.mineBlock([
          mintToken(token_x, 50, wallet_1),
          mintToken(token_y, 50, wallet_1),
          mintToken(lp_token, 100, wallet_1),
          createTestPair(),
      ])

      block = chain.mineBlock([
          Tx.contractCall('core', 'burn', [
              types.uint(1),
              types.principal(token_x),
              types.principal(token_y),
              types.principal(lp_token),
              types.uint(100),
          ], wallet_1)
      ])

      assertEquals(block.receipts.length, 1)
      block.receipts[0]
          .result.expectErr()
          .expectUint(err_burn_preconditions)
  }
});

Clarinet.test({
  name: 'burn fails on wrong token trait',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      let block = chain.mineBlock([
          mintToken(lp_token, 100, wallet_1),
          createTestPair(),
      ])

      block = chain.mineBlock([
          Tx.contractCall('core', 'burn', [
              types.uint(1),
              types.principal(token_y),
              types.principal(token_x),
              types.principal(lp_token),
              types.uint(100),
          ], wallet_1)
      ])

      assertEquals(block.receipts.length, 1)
      block.receipts[0]
          .result.expectErr()
          .expectUint(err_burn_preconditions)
  }
});

Clarinet.test({
  name: 'burn burns lp balance == amt from sender & increases token-x/token-y balances',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      let block = chain.mineBlock([
          mintToken(token_x, 50, wallet_1),
          mintToken(token_y, 50, wallet_1),
          createTestPair(),
          depositTestPair(10, 10, wallet_1),
      ])

      assertEquals(block.receipts.length, 4)
      block.receipts.map(r => r.result.expectOk())

      let assets = chain.getAssetsMaps().assets
      assertEquals(assets[token_x_id][wallet_1], 40)
      assertEquals(assets[token_y_id][wallet_1], 40)
      assertEquals(assets[lp_token_id][wallet_1], 10)
      assertEquals(assets[token_x_id][core], 10)
      assertEquals(assets[token_y_id][core], 10)

      block = chain.mineBlock([
          Tx.contractCall('core', 'burn', [
              types.uint(1),
              types.principal(token_x),
              types.principal(token_y),
              types.principal(lp_token),
              types.uint(2),
          ], wallet_1)
      ])

      assertEquals(block.receipts.length, 1)
      block.receipts[0]
          .result.expectOk()

      assets = chain.getAssetsMaps().assets
      assertEquals(assets[token_x_id][wallet_1], 42)
      assertEquals(assets[token_y_id][wallet_1], 42)
      assertEquals(assets[token_x_id][core], 8)
      assertEquals(assets[token_y_id][core], 8)
      assertEquals(assets[lp_token_id][wallet_1], 8)
    }
});

Clarinet.test({
  name: 'burn withdraws last of reserves',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      let block = chain.mineBlock([
          mintToken(token_x, 50, wallet_1),
          mintToken(token_y, 50, wallet_1),
          createTestPair(),
          depositTestPair(10, 10, wallet_1),
      ])

      let assets = chain.getAssetsMaps().assets
      assertEquals(block.receipts.length, 4)
      assertEquals(assets[lp_token_id][wallet_1], 10)

      block = chain.mineBlock([
        burn(10, wallet_1),
      ])

      assertEquals(block.receipts.length, 1)
      block.receipts[0]
          .result.expectOk()

      assets = chain.getAssetsMaps().assets

      assertEquals(assets[token_x_id][wallet_1], 50)
      assertEquals(assets[token_y_id][wallet_1], 50)
      assertEquals(assets[token_x_id][core], 0)
      assertEquals(assets[token_y_id][core], 0)
      assertEquals(assets[lp_token_id][wallet_1], 0)
    }
});

const n = (zeros) => `1${'0'.repeat(zeros)}`

Clarinet.test({
  name: 'burn with large reserves works...',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address
      let wallet_2 = accounts.get('wallet_2')!.address

      let block = chain.mineBlock([
          mintToken(token_x, n(37), wallet_1),
          mintToken(token_y, n(37), wallet_1),
          mintToken(token_x, n(37), wallet_2),
          mintToken(token_y, n(37), wallet_2),
          createTestPair(),
      ])

      // large deposits (amt0 * amt1 on first mint)
      let tests = [n(21), n(18)]
      
      block = chain.mineBlock(
        tests.map(v => depositTestPair(v, v, wallet_1))
      )

      // let assets = chain.getAssetsMaps().assets // NOTE: crashes here
      assertEquals(block.receipts.length, 1)
      block.receipts[0].result.expectOk()

      // big swap...
      block = chain.mineBlock([
        swapXY(n(18), 1, wallet_1),
      ])

      assertEquals(block.receipts.length, 1)

      let pair = chain.callReadOnlyFn('core', 'get-pool', [types.uint(1)], deployer)
          .result.expectSome()

      // 2nd deposit (max(amt0 * totalSupply, amt1 * totalSupply))
      block = chain.mineBlock([
        depositTestPair(n(18), n(18), wallet_2),
      ])
      
      pair = chain.callReadOnlyFn('core', 'get-pool', [types.uint(1)], deployer)
        .result.expectSome()

      block = chain.mineBlock([
          depositTestPair(n(18), n(18), wallet_2),
      ])      
    }
});

// ====== Swap

Clarinet.test({
  name: 'swap: ...',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address
      let wallet_2 = accounts.get('wallet_2')!.address

      initRevShare(chain)

      // setup
      let block = chain.mineBlock([
          mintToken(token_x, 10_000, wallet_1),
          mintToken(token_y, 10_000, wallet_1),
          mintToken(token_x, 10_000, wallet_2),
          createTestPair(),
          depositTestPair(10_000, 10_000, wallet_1),
        ])

      assertEquals(block.receipts.length, 5)

      // fail
      block = chain.mineBlock([
          Tx.contractCall('core', 'swap', [
              types.uint(1),
              types.principal(token_x),
              types.principal(token_y),
              types.principal(rev_too),
              types.uint(1_000),
              types.uint(1_000),
          ], wallet_2)
      ])

      assertEquals(block.receipts.length, 1)
      block.receipts[0]
          .result.expectErr()
          .expectUint(err_swap_postconditions)

      // balances still the same
      let pair = chain.callReadOnlyFn('core', 'get-pool', [types.uint(1)], deployer)
      let res = pair.result.expectSome().expectTuple()
      res['reserve0'].expectUint(10_000)
      res['reserve1'].expectUint(10_000)

      // succcess
      block = chain.mineBlock([
        Tx.contractCall('core', 'swap', [
            types.uint(1),
            types.principal(token_x),
            types.principal(token_y),
            types.principal(rev_too),
            types.uint(1_000),
            types.uint(900),
        ], wallet_2)
      ])

      assertEquals(block.receipts.length, 1)
      res = block.receipts[0].result.expectOk().expectTuple()
      res['amt-in'].expectUint(1_000)
      res['amt-fee-lps'].expectUint(3)
      res['amt-in-adjusted'].expectUint(997)
      res['amt-out'].expectUint(900)

      pair = chain.callReadOnlyFn('core', 'get-pool', [types.uint(1)], deployer)
          .result.expectSome().expectTuple()
      pair.reserve0.expectUint(11_000)
      pair.reserve1.expectUint(9_100)

      let assets = chain.getAssetsMaps().assets
      assertEquals(assets[token_x_id][wallet_2], 9_000)
      assertEquals(assets[token_y_id][wallet_2], 900)

      // core balances == reserves
      // assertEquals(assets[token_x_id][core], r0)
      // assertEquals(assets[token_y_id][core], r1)
  }
});

Clarinet.test({
  name: 'swap x for wstx',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address
      let wallet_2 = accounts.get('wallet_2')!.address
      const initialSTX = 10**14

      // setup
      initRevShare(chain)

      let block = chain.mineBlock([
          mintToken(token_x, 10_000, wallet_1),
          mintToken(token_x, 10_000, wallet_2),
          createWSTXPair(),
          depositWSTXPair(10_000, 10_000, wallet_1),
      ])

      assertEquals(block.receipts.length, 4)

      let assets = chain.getAssetsMaps().assets
      assertEquals(assets[token_x_id][wallet_1], 0)
      assertEquals(assets[token_x_id][wallet_2], 10_000)
      assertEquals(assets[token_x_id][core], 10_000)
      assertEquals(assets['STX'][wallet_1], initialSTX - 10_000)
      assertEquals(assets['STX'][core], 10_000)
    
      // test
      block = chain.mineBlock([
          Tx.contractCall('core', 'swap', [
              types.uint(1),
              types.principal(token_x),
              types.principal(wstx),
              types.principal(rev_too),
              types.uint(1_000),
              types.uint(900),
          ], wallet_2)
      ])

      assertEquals(block.receipts.length, 1)
      let res = block.receipts[0].result.expectOk().expectTuple()
      res['amt-in'].expectUint(1_000)
      res['amt-out'].expectUint(900)

      assets = chain.getAssetsMaps().assets
      assertEquals(assets[token_x_id][wallet_2], 9_000)
      assertEquals(assets[token_x_id][core], 11_000)
      assertEquals(assets['STX'][wallet_2], initialSTX + 900)
      assertEquals(assets['STX'][core], 9_100)
  }
});


Clarinet.test({
  name: 'swap : large swap empties reserve, user can still burn',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address
      let wallet_2 = accounts.get('wallet_2')!.address

      initRevShare(chain)

      let block = chain.mineBlock([
          mintToken(token_x, 50, wallet_1),
          mintToken(token_x, 50, wallet_2),
          mintToken(token_y, 50, wallet_1),
          createTestPair(),
          depositTestPair(10, 10, wallet_1),
          swapXY(50, 1, wallet_2),
      ])

      assertEquals(block.receipts.length, 6)
      block.receipts.map(r => r.result.expectOk())
      let assets = chain.getAssetsMaps().assets

      assertEquals(assets[lp_token_id][wallet_1], 10)
      assertEquals(assets[token_x_id][wallet_2], 0)
      assertEquals(assets[token_y_id][wallet_2], 1)
      assertEquals(assets[token_x_id][core], 60) // + 50
      assertEquals(assets[token_y_id][core], 9)  // - 1

      block = chain.mineBlock([
        burn(10, wallet_1),
      ])

      assertEquals(block.receipts.length, 1)
      block.receipts[0].result.expectOk()

      assets = chain.getAssetsMaps().assets

      // TODO: used to get 99 token-x and one left in core?
      assertEquals(assets[token_x_id][wallet_1], 100)
      assertEquals(assets[token_y_id][wallet_1], 49)
      assertEquals(assets[token_x_id][core], 0)
      assertEquals(assets[token_y_id][core], 0)
      assertEquals(assets[lp_token_id][wallet_1], 0)

      // TODO: underflow, would be nice with a proper error instead
      // block = chain.mineBlock([
      //   swapXY(50, 1, wallet_1),
      // ])

      // block.receipts[0].result.expectErr()
    }
});

Clarinet.test({
  name: 'collect : owner can collect fees',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address
      let wallet_2 = accounts.get('wallet_2')!.address

      initRevShare(chain)

      let block = chain.mineBlock([
          mintToken(token_x, 10_000_000, wallet_1),
          mintToken(token_x, 10_000_000, wallet_2),
          mintToken(token_y, 10_000_000, wallet_1),
          createTestPairWithProtocolFee([30, 1_000]),
          depositTestPair(10_000_000, 10_000_000, wallet_1),
          swapXY(100_000, 98_710, wallet_2),
      ])

      block.receipts.map(r => r.result.expectOk())
      let assets = chain.getAssetsMaps().assets
      assertEquals(block.receipts.length, 6)
      assertEquals(assets[token_y_id][wallet_2], 98_710)
      let pair = chain.callReadOnlyFn('core', 'get-pool', [types.uint(1)], deployer)
          .result.expectSome().expectTuple()

      let revenue = getRevenue(chain, 1)
      revenue.token0.expectUint(9)
      revenue.token1.expectUint(0)
      pair.reserve0.expectUint(10_000_000 + 100_000 - 9)
      pair.reserve1.expectUint(10_000_000 - 98_710)

      // only one token fails
      block = chain.mineBlock([
        collect(),
      ])

      block.receipts[0].result.expectErr(err_collect_preconditions)

      block = chain.mineBlock([
        swapYX(50_000, 40_000, wallet_2),
        collect(),
      ])

      assets = chain.getAssetsMaps().assets
      assertEquals(assets[token_x_id][deployer], 9)
      assertEquals(assets[token_y_id][deployer], 4)

      revenue = getRevenue(chain, 1)
      revenue.token0.expectUint(0)
      revenue.token1.expectUint(0)
    }
});

// ========== mint/burn max reserves

// calc-mint: amt-0 * amt-1
// then: r0/r1 * supply

// Clarinet.test({
//     name: 'mint : max until owerflow',
//     async fn(chain: Chain, accounts: Map<string, Account>) {
//         let wallet_1 = accounts.get('wallet_1')!.address
//         let wallet_2 = accounts.get('wallet_2')!.address

//         let block = chain.mineBlock([
//             mintToken(token_x, n(34), wallet_1),
//             mintToken(token_x, n(34), wallet_2),
//             mintToken(token_y, n(34), wallet_1),
//             mintToken(token_y, n(34), wallet_2),
//             createTestPair(),
//             // amt-0 * amt-1
//             depositTestPair(n(19), n(19), wallet_1),
//         ])

//         console.log(block)
//         assertEquals(block.receipts.length, 6)
        
//         block = chain.mineBlock([
//             // amt-0/1 * total-supply
//             depositTestPair(d(9, 19), d(9, 19), wallet_2),
//             depositTestPair(d(9, 19), d(9, 19), wallet_2),
//             depositTestPair(d(9, 19), d(9, 19), wallet_2),
//             // depositTestPair(n(19), n(19), wallet_2),
//             // depositTestPair(n(19), n(19), wallet_2),
//             // depositTestPair(n(19), n(19), wallet_2),
//             // depositTestPair(n(19), n(19), wallet_2),
//             // depositTestPair(n(19), n(19), wallet_2),
//             // depositTestPair(n(19), n(19), wallet_2),
//         ])

//         // assertEquals(block.receipts.length, 0)
//         // console.log(block)
//         let pool = chain.callReadOnlyFn('core', 'get-pool', [types.uint(1)], deployer).result.expectSome().expectTuple()
//         // reserves: 4*10^19 u40000000000000000000
//         console.log(pool)
//     }
// })
