
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { deployer } from './contants.ts';

const err_check_owner  = 1
const err_mint         = 2
const err_burn         = 3
const err_transfer     = 4

const lpTokens = [
  'wstx-velar',
  'wstx-xbtc',
  'wstx-xusd',
  'xbtc-velar',
  'xbtc-xusd',
  'xusd-velar',
]

// read-only
const getSymbol = (chain: Chain, t: string) =>
    chain.callReadOnlyFn(t, 'get-symbol', [], deployer)
        .result
const getName = (chain: Chain, t: string) =>
    chain.callReadOnlyFn(t, 'get-name', [], deployer)
        .result
    
Clarinet.test({
    name: "mint fails when not owner or core contract",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get("wallet_1")!.address

        let block = chain.mineBlock([
            Tx.contractCall("template", "mint", [
              types.uint(1000),
              types.principal(wallet_1)
            ], wallet_1)
        ]);

        assertEquals(block.receipts.length, 1)
        block.receipts[0].result
          .expectErr()
          .expectUint(err_check_owner)
    },
});

Clarinet.test({
  name: "mint increases lp token balance for principal & total supply of lp",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get("wallet_1")!.address
      const mintAmt = 50000

      let block = chain.mineBlock([
          Tx.contractCall("template", "mint", [types.uint(mintAmt), types.principal(wallet_1)], deployer)
      ]);

      assertEquals(block.receipts.length, 1)
      block.receipts[0].result.expectOk()

      let assets = chain.getAssetsMaps()
      assertEquals(assets.assets[".template.lp-token"][wallet_1], mintAmt)

      let supply = chain.callReadOnlyFn('template', 'get-total-supply', [], wallet_1)
      supply.result
        .expectOk()
        .expectUint(mintAmt)
  },
});

// NOTE: shold anyone be able to burn their own tokens?
Clarinet.test({
  name: "burn fails on sender != token owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get("wallet_1")!.address;
      const mintAmt = 50000
      const burnAmt = 10000

      let block = chain.mineBlock([
          Tx.contractCall("template", "mint", [types.uint(mintAmt), types.principal(wallet_1)], deployer)
      ]);

      block = chain.mineBlock([
          Tx.contractCall("template", "burn", [types.uint(burnAmt), types.principal(wallet_1)], wallet_1)
      ]);

      assertEquals(block.receipts.length, 1)
      block.receipts[0].result
          .expectErr()
          .expectUint(err_check_owner)
  },
});

Clarinet.test({
  name: "burn decreases lp token balance for principal & total supply of lp",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get("wallet_1")!.address;
      const mintAmt = 50000
      const burnAmt = 10000

      let block = chain.mineBlock([
          Tx.contractCall("template", "mint", [types.uint(mintAmt), types.principal(wallet_1)], deployer)
      ]);
      assertEquals(block.receipts.length, 1)

      block = chain.mineBlock([
          Tx.contractCall("template", "burn", [types.uint(burnAmt), types.principal(wallet_1)], deployer)
      ]);

      assertEquals(block.receipts.length, 1)
      block.receipts[0].result.expectOk()

      let assets = chain.getAssetsMaps()
      assertEquals(assets.assets[".template.lp-token"][wallet_1], mintAmt - burnAmt)

      let supply = chain.callReadOnlyFn('template', 'get-total-supply', [], wallet_1)
      supply.result
        .expectOk()
        .expectUint(mintAmt - burnAmt)
  },
});

Clarinet.test({
  name: "transfer fails on non-token-owenr",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get("wallet_1")!.address
      let wallet_2 = accounts.get("wallet_2")!.address
      const mintAmt = 50000
      const transferAmt = 1000

      let block = chain.mineBlock([
          Tx.contractCall("template", "mint", [types.uint(mintAmt), types.principal(wallet_1)], deployer),
          Tx.contractCall("template", "transfer", [
            types.uint(transferAmt),
            types.principal(wallet_1),
            types.principal(wallet_2),
            types.none(),
          ], deployer),
      ]);

      assertEquals(block.receipts.length, 2)
      block.receipts[0].result.expectOk()
      block.receipts[1].result.expectErr()

      let assets = chain.getAssetsMaps()
      assertEquals(assets.assets[".template.lp-token"][wallet_1], mintAmt)

      let supply = chain.callReadOnlyFn('template', 'get-total-supply', [], wallet_1)
      supply.result
        .expectOk()
        .expectUint(mintAmt)
  },
});

Clarinet.test({
  name: "transfer moves balance from sender to recipient",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      let wallet_1 = accounts.get("wallet_1")!.address
      let wallet_2 = accounts.get("wallet_2")!.address
      const mintAmt = 50000
      const transferAmt = 1000

      let block = chain.mineBlock([
          Tx.contractCall("template", "mint", [types.uint(mintAmt), types.principal(wallet_1)], deployer),
          Tx.contractCall("template", "transfer", [
              types.uint(transferAmt),
              types.principal(wallet_1),
              types.principal(wallet_2),
              types.none(),
          ], wallet_1)
      ]);

      assertEquals(block.receipts.length, 2)
      block.receipts[0].result.expectOk()
      block.receipts[1].result.expectOk()

      let assets = chain.getAssetsMaps()
      assertEquals(assets.assets[".template.lp-token"][wallet_1], mintAmt - transferAmt)
      assertEquals(assets.assets[".template.lp-token"][wallet_2], transferAmt)

      let supply = chain.callReadOnlyFn('template', 'get-total-supply', [], wallet_1)
        supply.result
          .expectOk()
          .expectUint(mintAmt)
  },
});

Clarinet.test({
    name: 'LP-tokens',
    async fn(chain: Chain) {
        lpTokens.forEach(t => getSymbol(chain, t).expectOk().expectAscii(t))
        lpTokens.forEach(t => getName(chain, t).expectOk().expectAscii(t))
    }
})
