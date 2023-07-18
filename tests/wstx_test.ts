
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
const initalBalance = 10**14

Clarinet.test({
  name: "WSTX: transfer ...",
  async fn(chain: Chain, accounts: Map<String, Account>) {
      let wallet_1 = accounts.get('wallet_1')!.address
      let wallet_2 = accounts.get('wallet_2')!.address
      const transferAmt = 2000000

      let block = chain.mineBlock([
        Tx.contractCall('wstx', 'transfer', [
          types.uint(transferAmt),
          types.principal(wallet_1),
          types.principal(wallet_2),
          types.none(),
        ], wallet_1),
      ]);

      assertEquals(block.receipts.length, 1)
      let assets = chain.getAssetsMaps()
      // NOTE: why is balance unchanged?
      // assertEquals(wallet_1.balance, initalBalance - transferAmt)
      assertEquals(assets.assets["STX"][wallet_1], initalBalance - transferAmt)
      assertEquals(assets.assets["STX"][wallet_2], initalBalance + transferAmt)
  }
})

Clarinet.test({
  name: "WSTX: get-total supply ...",
  async fn(chain: Chain, accounts: Map<String, Account>) {
      let supply = chain.callReadOnlyFn('wstx', 'get-total-supply', [], deployer)

      supply.result
        .expectOk()
        .expectUint(10**15)
  }
})
