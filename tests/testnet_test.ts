
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { addresses, deployer } from './contants.ts'
import { mintToken, fee, initRevShare, } from './util.ts';

const {
  token_x,
  wstx,
  lp_token,
  rev_too,
} = addresses

const err_router_preconditions = 0

// Testnet transactions
// ========================
// https://explorer.hiro.so/txid/0x8b56e624585fdd932b94e602cd1b5e877a5713c7b8cfb7a0bdf7dfdf12f72810?chain=testnet
// 107596
// swap-exact-tokens-for-tokens(1, .velar, .wstx, .velar, .wstx, 10, 8)
// b0: u99999994, b1: u100000012 in prev. block
// (err u10)
// https://explorer.hiro.so/txid/0xaff948960d396710eed9b7a7e2eef4f317d569f57f0306144802ca6acf5ee3b3?chain=testnet
// 107597
// r0: u99999994, r1: u100000012
// router:swap-exact-tokens-for-tokens(1, .velar, .wstx, .velar, .wstx, 10_000, 9_969)
// success
// https://explorer.hiro.so/txid/0x305294294f0bac95e2aee5536154afe598c1e131ce5fb0474464fa3fbb657341?chain=testnet
// 107625
// router:swap-tokens-for-exact-tokens(1, .wstx, .velar, .wstx, .velar, 4_000_000, 4)
// (err u10)
// https://explorer.hiro.so/txid/0xe000921fd573d26e3f43b9f175fdbe2105ed86e1afbe944561cc8c7ba4f7d8f1?chain=testnet
// 107679
// add-liquidity(50_000_000, 41, 50_000_000, 41)
// (err u0)

Clarinet.test({
  name: 'swap-exact-tokens-for-tokens : reproduce testnet txns',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const wallet_1 = accounts.get('wallet_1')!.address
      const wallet_2 = accounts.get('wallet_2')!.address
      
      initRevShare(chain)

      let block = chain.mineBlock([
          mintToken('token-x', 500_000_000, wallet_1),
          mintToken('token-x', 10_000_000, wallet_2),
          Tx.contractCall("core", "create", [
              types.principal(wstx),
              types.principal(token_x),
              types.principal(lp_token),
              fee(997, 1_000),
              fee(30, 10_000),
              fee(0, 1),
          ], deployer),
          // https://explorer.hiro.so/txid/0x4bf47dddff80fc50cbe6cda06c3d9a4a09cc0c28bc63405cf8eb0ac4a8fa9441?chain=testnet
          // block height: 107596
          Tx.contractCall("core", "mint", [
              types.uint(1),
              types.principal(wstx),
              types.principal(token_x),
              types.principal(lp_token),
              types.uint(99_999_994),
              types.uint(100_000_012),
          ], wallet_1)
      ])
  
      block = chain.mineBlock([
          // https://explorer.hiro.so/txid/0x8b56e624585fdd932b94e602cd1b5e877a5713c7b8cfb7a0bdf7dfdf12f72810?chain=testnet
          // block height: 107596
          Tx.contractCall('router', 'swap-exact-tokens-for-tokens', [
              types.uint(1),
              types.principal(token_x),
              types.principal(wstx),
              types.principal(token_x),
              types.principal(wstx),
              types.principal(rev_too),
              types.uint(10),
              types.uint(8),
          ], wallet_2),
        ])

        // NOTE: token-0/token-1 wapped in call
        block.receipts[0].result.expectErr(err_router_preconditions)

        // https://explorer.hiro.so/txid/0xaff948960d396710eed9b7a7e2eef4f317d569f57f0306144802ca6acf5ee3b3?chain=testnet
        // 107597
        block = chain.mineBlock([
          Tx.contractCall('router', 'swap-exact-tokens-for-tokens', [
              types.uint(1),
              types.principal(token_x),
              types.principal(wstx),
              types.principal(token_x),
              types.principal(wstx),
              types.principal(rev_too),
              types.uint(10_000),
              types.uint(9_969),
          ], wallet_2)
      ])

      // NOTE: token-0/token-1 wapped in call
      block.receipts[0].result.expectErr(err_router_preconditions)
  }
})

// https://explorer.hiro.so/txid/0x305294294f0bac95e2aee5536154afe598c1e131ce5fb0474464fa3fbb657341?chain=testnet
// 107625
// router:swap-tokens-for-exact-tokens(1, .wstx, .velar, .wstx, .velar, 4_000_000, 4)
// (err u10)
Clarinet.test({
  name: 'swap-tokens-for-exact-tokens : reproduce testnet txns',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const wallet_1 = accounts.get('wallet_1')!.address
      const wallet_2 = accounts.get('wallet_2')!.address

      initRevShare(chain)

      // NOTE: returns (ok u4..)
      let res = chain.callReadOnlyFn('library', 'get-amount-in', [
          types.uint(4),
          types.uint(99_990_135),
          types.uint(100_010_103),
          fee(997, 1_000),
      ], deployer)

      let block = chain.mineBlock([
          mintToken('token-x', 500_000_000, wallet_1),
          mintToken('token-x', 10_000_000, wallet_2),
          Tx.contractCall("core", "create", [
            types.principal(wstx),
            types.principal(token_x),
            types.principal(lp_token),
            fee(997, 1_000),
            fee(30, 10_000),
            fee(0, 1),
        ], deployer),
        // https://explorer.hiro.so/txid/0xfbc6f66db84fc3f8c2964e9dfed175abc5c51b09eec10acfb2fc728c00f29e78?chain=testnet
        // block height: 107612 (b0, b1)
        Tx.contractCall("core", "mint", [
            types.uint(1),
            types.principal(wstx),
            types.principal(token_x),
            types.principal(lp_token),
            types.uint(99_990_135),
            types.uint(100_010_103),
        ], wallet_1)
      ])

      // NOTE: token0 is wrong.
      block = chain.mineBlock([
          Tx.contractCall('router', 'swap-tokens-for-exact-tokens', [
              types.uint(1),
              types.principal(wstx),
              types.principal(token_x),
              types.principal(wstx),
              types.principal(token_x),
              types.principal(rev_too),
              types.uint(4_000_000),
              types.uint(4),
          ], wallet_2),
      ])

      block.receipts[0].result.expectOk() // err-swap-postconditions
  }
})


// https://explorer.hiro.so/txid/0xe000921fd573d26e3f43b9f175fdbe2105ed86e1afbe944561cc8c7ba4f7d8f1?chain=testnet
// 107679
// add-liquidity(50_000_000, 41, 50_000_000, 41)
// (err u0)
Clarinet.test({
  name: 'add-liquidity : reproduce testnet txns',
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const wallet_1 = accounts.get('wallet_1')!.address
      const wallet_2 = accounts.get('wallet_2')!.address
      
      initRevShare(chain)

      let block = chain.mineBlock([
          mintToken('token-x', 500_000_000, wallet_1),
          mintToken('token-x', 500_000_000, wallet_2),
          Tx.contractCall("core", "create", [
            types.principal(wstx),
            types.principal(token_x),
            types.principal(lp_token),
            fee(997, 1_000),
            fee(30, 10_000),
            fee(0, 1),
        ], deployer),
        // block height: 107596 (b0, b1)
        Tx.contractCall("core", "mint", [
            types.uint(1),
            types.principal(wstx),
            types.principal(token_x),
            types.principal(lp_token),
            types.uint(99_999_994),
            types.uint(100_000_012),
        ], wallet_1)
      ])

      // amt-1-optimal
      let res = chain.callReadOnlyFn('library', 'quote', [
          types.uint(50_000_000),
          types.uint(99_999_994),
          types.uint(100_000_012),
      ], deployer)

      res.result.expectOk().expectUint(50_000_009)

      // amt-0-optimal
      res = chain.callReadOnlyFn('library', 'quote', [
          types.uint(41),
          types.uint(100_000_012),
          types.uint(99_999_994),
      ], deployer)

      res.result.expectOk().expectUint(40)

      res = chain.callReadOnlyFn('router', 'add-liquidity-calc', [
          types.uint(1),
          types.uint(50_000_000),
          types.uint(41),
          types.uint(50_000_000),
          types.uint(41),
      ], deployer)

      res.result.expectErr(err_router_preconditions)

      // NOTE: this input makes no sense with ~equal reserves,
      // what is the expected outcome?
      block = chain.mineBlock([
          Tx.contractCall('router', 'add-liquidity', [
              types.uint(1),
              types.principal(wstx),
              types.principal(token_x),
              types.principal(lp_token),
              types.uint(50_000_000),
              types.uint(41),
              types.uint(50_000_000),
              types.uint(41),
          ], wallet_2)
      ])

      block.receipts[0].result.expectErr(err_router_preconditions)
  }
})
