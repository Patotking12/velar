
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { mintVelar } from './util.ts';
import { deployer, addresses } from './contants.ts';

const { 
  staking,
} = addresses

const err_stake_preconditions    = 701
const err_stake_postconditions   = 702
const err_unstake_preconditions  = 703
const err_unstake_postconditions = 704

// read-only
const getLastBlock = (chain: Chain) =>
    chain.callReadOnlyFn('staking', 'get-last-block', [], deployer)
        .result

export const share = (chain: Chain, user: string) =>
    chain.callReadOnlyFn('staking', 'get-share', [types.principal(user)], deployer)
        .result.expectTuple()

export const shareAt = (chain: Chain, user: string, block: number) =>
    chain.callReadOnlyFn('staking', 'get-share-at', [types.principal(user), types.uint(block)], deployer)
        .result.expectTuple()

// public
export const stake   = (user: string, amt: number) =>
    Tx.contractCall('staking', 'stake', [types.uint(amt)], user)
export const unstake = (user: string, amt: number) =>
    Tx.contractCall('staking', 'unstake', [types.uint(amt)], user)

// ===== read-only functions

Clarinet.test({
  name: 'get-share: not staked',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      let res = chain.callReadOnlyFn('staking', 'get-share', [types.principal(wallet_1)], deployer)
          .result.expectTuple()

      res.staked.expectUint(0)
      res.total.expectUint(0)
  },
});

Clarinet.test({
  name: 'get-share: staked',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      let res = getLastBlock(chain)
      res.expectUint(1)

      // (2)
      let block = chain.mineBlock([
        mintVelar(wallet_1, 500_000),
        Tx.contractCall('staking', 'stake', [
          types.uint(5_000)
        ], wallet_1)
      ])
      assertEquals(block.receipts.length, 2)

      // TODO: why is total none for block 0?
      res = chain.callReadOnlyFn('staking', 'get-share-at', [
          types.principal(wallet_1),
          types.uint(1)
      ], deployer)
          .result.expectTuple()

      res.staked.expectUint(0)
      res.total.expectUint(0)

      res = chain.callReadOnlyFn('staking', 'get-share-at', [
          types.principal(wallet_1),
          types.uint(2)
      ], deployer)
          .result.expectTuple()

      res.staked.expectUint(5_000)
      res.total.expectUint(5_000)
  },
});

// ============= stake/unstake

Clarinet.test({
    name: 'stake: amt >= MIN_STAKE & amt >= balance',
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get('wallet_1')!.address

        // no velar balance
        let block = chain.mineBlock([
            stake(wallet_1, 10_000),
        ])
        block.receipts[0].result.expectErr().expectUint(1) // transfer fail?

        // < MIN_STAKE
        block = chain.mineBlock([
            mintVelar(wallet_1, 10_000),
            stake(wallet_1, 100),
        ])
        block.receipts[1].result.expectErr().expectUint(err_stake_preconditions)
    }
})


Clarinet.test({
  name: 'stake-unstake: 1 user',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address

      let res = getLastBlock(chain)
      res.expectUint(1)

      // block 2
      let block = chain.mineBlock([
          mintVelar(wallet_1, 500_000),
          Tx.contractCall('staking', 'stake', [
              types.uint(5_000)
          ], wallet_1)
      ])

      res = getLastBlock(chain)
      res.expectUint(2)

      // unstake partial (3)
      block = chain.mineBlock([
          Tx.contractCall('staking', 'unstake', [types.uint(2_000)], wallet_1)
      ])

      res = getLastBlock(chain)
      res.expectUint(3)

      // res = share(chain, wallet_1)
      // res = shareAt(chain, wallet_1, 2)

      let assets = chain.getAssetsMaps().assets
      assertEquals(assets[`.velar.velar`][wallet_1], 500_000 - 3_000)
      assertEquals(assets[`.velar.velar`][staking], 3_000)

      // unstake all (4)
      block = chain.mineBlock([
          Tx.contractCall('staking', 'unstake', [types.uint(3_000)], wallet_1)
      ])
  
      let res2 = shareAt(chain, wallet_1, 2)
      let res3 = shareAt(chain, wallet_1, 3)
      let res4 = shareAt(chain, wallet_1, 4)
  
      res2.staked.expectUint(5_000)
      res2.total.expectUint(5_000)
      res3.staked.expectUint(3_000)
      res3.total.expectUint(3_000)
      res4.staked.expectUint(0)
      res4.total.expectUint(0)

      assets = chain.getAssetsMaps().assets
      assertEquals(assets[`.velar.velar`][wallet_1], 500_000)
  },
});

Clarinet.test({
  name: 'stake-unstake: 3 users',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address
      let wallet_2 = accounts.get('wallet_2')!.address
      let wallet_3 = accounts.get('wallet_3')!.address

      let res = getLastBlock(chain)
      res.expectUint(1)

      // block 2
      let block = chain.mineBlock([
          mintVelar(wallet_1, 500_000),
          mintVelar(wallet_2, 500_000),
          mintVelar(wallet_3, 500_000),
          stake(wallet_1, 100_000),
          stake(wallet_2, 50_000),
      ])

      // (3)
      block = chain.mineBlock([
          stake(wallet_3, 100_000)
      ])

      let res1 = shareAt(chain, wallet_1, 2)
      let res2 = shareAt(chain, wallet_2, 2)

      res1.staked.expectUint(100_000)
      res1.total.expectUint(150_000)
      res2.staked.expectUint(50_000)

      // (4)
      block = chain.mineBlock([
          unstake(wallet_1, 100_000)
      ])

      res1 = shareAt(chain, wallet_1, 4)
      res1.staked.expectUint(0)

      // (4 -> 15)
      block = chain.mineEmptyBlock(10)

      // (15)
      // TODO: add some revenue...
  },
});
