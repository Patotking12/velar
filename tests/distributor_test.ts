
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { shareAt, stake, unstake } from './staking_test.ts';
import { checkTuple, mintVelar, mintWSTX,  } from './util.ts';
import { deployer, addresses, swap_fee, protocol_fee, rev_share } from './contants.ts';

const {
  distributor,
  core,
  wstx,
  velar,
} = addresses

const token0 = wstx
const token1 = velar

const INITAIL_STX = 100000000000000
const EPOCH_LENGTH = 600

const err_check_owner               = 801
const err_check_core                = 802
const err_distribute_preconditions  = 803
const err_distribute_postconditions = 804

// helpers
// const range = (start: number, end: number) =>
//     Array(end).fill(1).map((_, i) => start + i)

// const checkClaimed = (chain: Chain, user: string, pool: number, blocks: number[], expect: boolean) =>
//     blocks.forEach(b => {
//         let res = hasClaimedBlock(chain, user, pool, b)
//         try {
//           res.result.expectBool(expect)
//         } catch (e) {
//           console.log(user, b)
//         }
//     })

const createPair = () =>
  Tx.contractCall("core", "create", [
    types.principal(token0),
    types.principal(token1),
    types.principal(addresses.lp_token),
    swap_fee,
    protocol_fee,
    rev_share,
], deployer)

const init  = (chain: Chain) => chain.mineEmptyBlock(EPOCH_LENGTH)
const setup = (chain: Chain, wallets: string[]) =>
    chain.mineBlock([
        // shortcut
        mintWSTX(distributor, 10_000),
        mintVelar(distributor, 10_000),
        ...wallets.map(w => mintVelar(w, 500_000)),
        createPair(),
    ])

// TODO: how to send revenue
const sendReveueAsCore = (chain: Chain, pool: number, isToken0: boolean, amt: number) =>
    chain.mineBlock([
        setCore(deployer, deployer),
        sendRevenue(pool, isToken0, amt, deployer),
    ])

// ===== API

// setters
const setOwner = (owner: string, sender: string) =>
    Tx.contractCall('distributor', 'set-owner', [
        types.principal(owner)
    ], sender)

const setCore = (newCore: string, sender: string) =>
    Tx.contractCall('distributor', 'set-core', [
        types.principal(newCore)
    ], sender)

// read-only
const mkepoch = (chain: Chain, startBlock: number) =>
    chain.callReadOnlyFn('distributor', 'mkepoch', [
        types.uint(startBlock)
    ], deployer)

const getRevenueAt = (chain: Chain, pool: number, block: number) =>
    chain.callReadOnlyFn('distributor', 'get-revenue-at', [
        types.uint(pool),
        types.uint(block),
    ], deployer)

const hasClaimedBlock = (chain: Chain, user: string, pool: number, block: number) =>
    chain.callReadOnlyFn('distributor', 'has-claimed-block', [
        types.principal(user),
        types.uint(pool),
        types.uint(block),
    ], deployer)

const calcDistribute = (
  chain: Chain,
  staked: number,
  total: number,
  revenue0: number,
  revenue1: number
) =>
    chain.callReadOnlyFn('distributor', 'calc-distribute', [
        types.tuple({
            staked: types.uint(staked),
            total : types.uint(total),
        }),
        types.tuple({
            token0: types.uint(revenue0),
            token1: types.uint(revenue1),
        })
    ], deployer)

const getRewards = (chain: Chain, user: string, pool: number, startBlock: number) =>
    chain.callReadOnlyFn('distributor', 'get-rewards', [
        types.principal(user),
        types.uint(pool),
        types.uint(startBlock)
    ], deployer)
        .result.expectTuple()

const getReward = (chain: Chain, user: string, pool: number, startBlock: number) =>
    chain.callReadOnlyFn('distributor', 'get-reward', [
        types.principal(user),
        types.uint(pool),
        types.uint(startBlock)
    ], deployer)

// NOTE: just looks at rewards..
const hasReward = (chain: Chain, user: string, pool: number, block: number, amts: number[]) =>
    chain.callReadOnlyFn('distributor', 'has-reward', [
        types.tuple({
          user: types.principal(user),
          pool: types.uint(pool),
          block: types.uint(block),
          reward: types.tuple({
            token0: types.uint(amts[0]),
            token1: types.uint(amts[1])
          }),
        })
      ], deployer)

// public
const sendRevenue = (pool: number, isToken0: boolean, amt: number, sender: string) =>
    Tx.contractCall('distributor', 'send-revenue', [
        types.uint(pool),
        types.bool(isToken0),
        types.uint(amt),
    ], sender)

const distributeBlock = (user: string, pool: number, block: number) =>
    Tx.contractCall('distributor', 'distribute-block', [
        types.principal(user),
        types.uint(pool),
        types.principal(token0),
        types.principal(token1),
        types.uint(block),
    ], deployer)

// TODO: test
const distributeBlocks = (user: string, pool: number, blocks: string[]) =>
    Tx.contractCall('distributor', 'distribute-blocks', [
        types.principal(user),
        types.uint(pool),
        types.principal(token0),
        types.principal(token1),
        types.list(blocks),
    ], deployer)

// const unstakeAndClaim = (user: string, pool: number, amt: number) =>
//     Tx.contractCall('distributor', 'unstake-and-claim', [
//         types.principal(user),
//         types.uint(pool),
//         types.principal(token0),
//         types.principal(token1),
//         types.uint(amt),
//     ], user)

// const claim = (user: string, pool: number, amt: number) =>
//     Tx.contractCall('distributor', 'claim', [
//         types.principal(user),
//         types.uint(pool),
//         types.principal(token0),
//         types.principal(token1),
//         types.uint(amt),
//     ], user)

// ===== read-only functions

// NOTE: is it necessary to have a tuple? why not just uint (blocknr)
Clarinet.test({
  name: "mkepoch: ...",
  async fn(chain: Chain) {

      let START_BLOCK = 1
      let res = mkepoch(chain, START_BLOCK).result.expectList()

      assertEquals(res.length, EPOCH_LENGTH)
      res[0].expectUint(START_BLOCK)
      res[res.length - 1].expectUint(EPOCH_LENGTH + START_BLOCK - 1)

      START_BLOCK = EPOCH_LENGTH
      res = mkepoch(chain, START_BLOCK).result.expectList()

      assertEquals(res.length, EPOCH_LENGTH)
      res[0].expectUint(EPOCH_LENGTH)
      res[res.length - 1].expectUint(EPOCH_LENGTH + START_BLOCK - 1)
  },
});

Clarinet.test({
    name: "calc-distribute: ...",
    async fn(chain: Chain) {

        // staked, total, rev0, rev1
        let tests = [
          [[100, 1_000, 1_000, 0]  , [100, 0]],
          [[900, 1_000, 100, 100]  , [90, 90]],
          [[1_000, 1_000, 100, 100], [100, 100]],
          [[1_000, 1_000, 0, 0]    , [0, 0]],
          [[0, 1_000, 1_000, 1_000], [0, 0]],
          // [[1_000, 0, 1_000, 1_000], [0, 0]], // shouldn't happen
          [[500, 1_000_000, 1_000, 1_000], [0, 0]],
          [[500, 1_000_000, 10_000, 10_000], [5, 5]],
          [[500, 1_000_000, 100_000, 100_000], [50, 50]],
          [[500, 1_000_000, 1_000_000, 1_000_000], [500, 500]],
        ]

        let res = tests.map(([input]) => calcDistribute(chain, ...input))

        res.map(({ result }, i) => {
          let tuple = result.expectTuple()
          tuple.token0.expectUint(tests[i][1][0])
          tuple.token1.expectUint(tests[i][1][1])
        })
    }
})


Clarinet.test({
    name: 'send-revenue: can only be called by core contract',
    async fn(chain: Chain, accounts: Map<String, Account>) {
        const wallet_1 = accounts.get('wallet_1')!.address
        let block = setup(chain, [])

        let res = chain.callReadOnlyFn('distributor', 'get-core', [], deployer)
        res.result.expectPrincipal(core)

        block = chain.mineBlock([
            sendRevenue(1, true, 100_000, deployer),
            sendRevenue(1, true, 100_000, wallet_1),
        ])
        block.receipts[0].result.expectErr().expectUint(err_check_core)
        block.receipts[1].result.expectErr().expectUint(err_check_core)
    }
})


Clarinet.test({
    name: "get-rewards: ...",
    async fn(chain: Chain, accounts: Map<String, Account>) {
        const wallet_1 = accounts.get('wallet_1')!.address
        const POOL = 1

        let block = setup(chain, [wallet_1])

        // stake
        block = chain.mineBlock([
            stake(wallet_1, 500_000),
        ])

        sendReveueAsCore(chain, POOL, false, 10_000),
        chain.mineEmptyBlock(EPOCH_LENGTH / 3)

        // rewards
        sendReveueAsCore(chain, POOL, false, 5_000)

        block = chain.mineEmptyBlock(EPOCH_LENGTH / 3)
        assertEquals(block.block_height, 406)

        let res = getRewards(chain, wallet_1, POOL, 1)
        res['end-block'].expectUint(601)
        let list = res['reward-blocks'].expectList()
 
        let r1 = list[0].expectTuple()
        let r2 = list[1].expectTuple()
        r1.block.expectUint(4)
        checkTuple(r1.reward, { token0: 0, token1: 10_000 })
        r2.block.expectUint(205)
        checkTuple(r2.reward, { token0: 0, token1: 5_000 })
    }
})

// distribution

Clarinet.test({
    name: "distribute-block: precondition (block < height)",
    async fn(chain: Chain, accounts: Map<String, Account>) {
        const wallet_1 = accounts.get('wallet_1')!.address
        const POOL = 1

        setup(chain, [])

        let block = chain.mineBlock([
            distributeBlock(wallet_1, POOL, 3)
        ])
        block.receipts[0].result
            .expectErr()
            .expectUint(err_distribute_preconditions)
    }
})

Clarinet.test({
  name: "distribute-block: precondition (already claimed)",
  async fn(chain: Chain, accounts: Map<String, Account>) {
      const wallet_1 = accounts.get('wallet_1')!.address
      const wallet_2 = accounts.get('wallet_2')!.address
      const POOL = 1

      setup(chain, [wallet_1, wallet_2])

      // stake & add revenue
      let block = chain.mineBlock([
          stake(wallet_1, 500_000),
          stake(wallet_2, 500_000),
      ])
      assertEquals(block.height, 4)
      // 4
      sendReveueAsCore(chain, POOL, true, 1_000)

      // let pool1 = chain.callReadOnlyFn('core', 'do-get-pool', [types.uint(POOL)], deployer)

      let BLOCK_NR = 4
      // distribute staked block for wallet 1
      block = chain.mineBlock([
          distributeBlock(wallet_1, POOL, BLOCK_NR)
      ])

      // let res = getRewards(chain, wallet_1, POOL, 1)
      // console.log(block, res)

      // claimed
      let claimed1 = hasClaimedBlock(chain, wallet_1, POOL, BLOCK_NR).result
      let claimed2 = hasClaimedBlock(chain, wallet_2, POOL, BLOCK_NR).result
      claimed1.expectBool(true)
      claimed2.expectBool(false)

      // already claimed block
      block = chain.mineBlock([
          distributeBlock(wallet_1, POOL, BLOCK_NR)
      ])
      block.receipts[0].result.expectErr().expectUint(err_distribute_preconditions)
  }
})

Clarinet.test({
    name: "distribute-block: precondition (wrong token)",
    async fn(chain: Chain, accounts: Map<String, Account>) {
        const wallet_1 = accounts.get('wallet_1')!.address
        setup(chain, [wallet_1])
        let block = chain.mineBlock([
            stake(wallet_1, 500_000)
        ])

        block = chain.mineBlock([
            Tx.contractCall('distributor', 'distribute-block', [
                types.principal(wallet_1),
                types.uint(1),
                types.principal(velar),
                types.principal(wstx),
                types.uint(1),
            ], wallet_1)
        ])
        block.receipts[0].result.expectErr().expectUint(err_distribute_preconditions)
    }
})

Clarinet.test({
    name: 'distribute-blocks: ...',
    async fn(chain: Chain, accounts: Map<String, Account>) {
      const wallet_1 = accounts.get('wallet_1')!.address
      const POOL = 1

      setup(chain, [wallet_1])

      let block = chain.mineBlock([
          stake(wallet_1, 500_000)
      ])

      sendReveueAsCore(chain, POOL, true, 1_000)
      chain.mineEmptyBlock(10)
      sendReveueAsCore(chain, POOL, true, 1_000)
      chain.mineEmptyBlock(5)
      sendReveueAsCore(chain, POOL, true, 1_000)
      chain.mineEmptyBlock(5)

      // get reward blocks
      let res = getRewards(chain, wallet_1, POOL, 1)
      let list = res['reward-blocks'].expectList()
      let blocks = list.map(b => b.expectTuple().block)

      // claim blocks
      block = chain.mineBlock([
          distributeBlocks(wallet_1, POOL, blocks)
      ])
      block.receipts[0].result.expectOk()
    }
})

// TEST: distribute-blocks

// Clarinet.test({
//   name: "claim: ...",
//   async fn(chain: Chain, accounts: Map<String, Account>) {
//       const wallet_1 = accounts.get('wallet_1')!.address
//       const wallet_2 = accounts.get('wallet_2')!.address
//       const POOL = 1
 
//       // NOTE: can only unstake once we've passed this..
//       chain.mineEmptyBlock(EPOCH_LENGTH)
//       setup(chain, [wallet_1, wallet_2])

//       // stake & add revenue
//       let block = chain.mineBlock([
//           stake(wallet_1, 500_000),
//           stake(wallet_2, 500_000),
//       ])
//       sendReveueAsCore(chain, POOL, true, 1_000),
//       sendReveueAsCore(chain, POOL, false, 2_000),
    
//       let BLOCK_NR = 605
//       assertEquals(block.height, BLOCK_NR)

//       let reward1 = getRewards(chain, wallet_1, POOL, 10)
//       let reward2 = getRewards(chain, wallet_2, POOL, 10)
//       console.log(reward1, reward2)

//       block = chain.mineBlock([
//           claim(wallet_1, POOL, 500_000)
//       ])

//       block.receipts[0].result.expectOk()

//       // after claim
//       let staked1 = shareAt(chain, wallet_1, BLOCK_NR + 1)
//       let staked2 = shareAt(chain, wallet_2, BLOCK_NR + 1)
//       staked1.staked.expectUint(500_000)
//       staked2.staked.expectUint(500_000)
//       staked2.total.expectUint(1_000_000)

//       let assets = chain.getAssetsMaps().assets
//       console.log(assets)
//       assertEquals(assets['.velar.velar'][wallet_1], 1_000) // reward
//       assertEquals(assets['STX'][wallet_1], INITAIL_STX + 500)  // reward
//   }
// })

// TEST: unstake part
// TEST: unstake > stake
// TEST: unstake + restake
// TEST: failed tx of amt -> should fail
// TEST: has-claimed-epoch

// Clarinet.test({
//   name: "unstake-and-claim: unstake all",
//   async fn(chain: Chain, accounts: Map<String, Account>) {
//       const wallet_1 = accounts.get('wallet_1')!.address
//       const wallet_2 = accounts.get('wallet_2')!.address
//       const POOL = 1

//       // NOTE: can only unstake once we've passed this..
//       chain.mineEmptyBlock(EPOCH_LENGTH)

//       let block = chain.mineBlock([
//           // shortcut
//           mintWSTX(distributor, 10_000),
//           mintVelar(distributor, 10_000),
//           mintVelar(wallet_1, 500_000),
//           mintVelar(wallet_2, 500_000),
//       ])

//       // stake & add revenue
//       block = chain.mineBlock([
//           stake(wallet_1, 500_000),
//           stake(wallet_2, 500_000),
//       ])

//       sendReveueAsCore(chain, POOL, true, 1_000),
    
//       assertEquals(block.height, 605)

//       let blocks = getRewards(chain, wallet_1, POOL, 10)
//       let BLOCK_NR = 605

//       block = chain.mineBlock([
//           unstakeAndClaim(wallet_1, POOL, 500_000)
//       ])

//       // console.log(block.receipts[0].events)
//       // console.log('block height', block.height)
//       block.receipts[0].result.expectOk()

//       // before unstake
//       let staked1 = shareAt(chain, wallet_1, BLOCK_NR)
//       let staked2 = shareAt(chain, wallet_2, BLOCK_NR)
//       staked1.staked.expectUint(500_000)
//       staked2.staked.expectUint(500_000)
//       staked2.total.expectUint(1_000_000)
//       // after unstake
//       staked1 = shareAt(chain, wallet_1, BLOCK_NR + 1)
//       staked2 = shareAt(chain, wallet_2, BLOCK_NR + 1)
//       staked1.staked.expectUint(0)
//       staked2.staked.expectUint(500_000)
//       staked2.total.expectUint(500_000)

//       let assets = chain.getAssetsMaps().assets
//       assertEquals(assets['.velar.velar'][wallet_1], 500_000)
//       assertEquals(assets['STX'][wallet_1], INITAIL_STX + 500)
//   }
// })

// // NOTE: lots of small transfers, is that a problem?
// Clarinet.test({
//     name: "unstake-and-claim: unstake part, then all",
//     async fn(chain: Chain, accounts: Map<String, Account>) {
//         const wallet_1 = accounts.get('wallet_1')!.address
//         const POOL = 1
//         const INITAIL_STX = 100000000000000

//         // NOTE: can only unstake once we've passed this..
//         chain.mineEmptyBlock(EPOCH_LENGTH)

//         let block = chain.mineBlock([
//             // shortcut
//             mintWSTX(distributor, 10_000),
//             mintVelar(distributor, 10_000),
//             mintVelar(wallet_1, 500_000),
//         ])

//         // stake & add revenue
//         block = chain.mineBlock([
//             stake(wallet_1, 500_000),
//         ])

//         sendReveueAsCore(chain, POOL, false, 1_000),
      
//         assertEquals(block.height, 605)
//         let BLOCK_NR = 605

//         // unstake some
//         block = chain.mineBlock([
//             unstakeAndClaim(wallet_1, POOL, 200_000)
//         ])
//         block.receipts[0].result.expectOk()

//         // more rewards
//         sendReveueAsCore(chain, POOL, false, 1_000),
//         block.receipts[0].result.expectOk()

//         // unstake rest
//         // NOTE: this fails UnwrapFailure distribute-epoch
//         // assertion: (not has-claimed-block fails?) without map it succeeds, but unstake doesn't happen
//         block = chain.mineBlock([
//             unstakeAndClaim(wallet_1, POOL, 300_000)
//         ])

//         let rewards = getRewards(chain, wallet_1, POOL, 100)
//         console.log('reward-blocks', rewards['reward-blocks'])

//         // console.log(block.receipts[0].events)
//         // console.log('block height', block.height)
//         block.receipts[0].result.expectOk()

//         // before unstake
//         let staked1 = shareAt(chain, wallet_1, BLOCK_NR)
//         staked1.staked.expectUint(500_000)
//         // after unstake part
//         staked1 = shareAt(chain, wallet_1, BLOCK_NR + 1)
//         staked1.staked.expectUint(0)
//         let assets = chain.getAssetsMaps().assets
//         assertEquals(assets['.velar.velar'][wallet_1], 200_000)
//         assertEquals(assets['STX'][wallet_1], INITAIL_STX + 1_000)
//         // after unstake all
//     }
// })

// TEST: stake/unstake/claim at different times, multiple users..
