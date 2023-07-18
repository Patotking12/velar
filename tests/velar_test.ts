
import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { deployer } from './contants.ts';
import { n } from './util.ts';

const microVelar = n(15) // 1B * 10^6 decimals

Clarinet.test({
    name: 'mint : mints 1B * 10^6 tokens',
    fn: (chain: Chain, accounts: Map<String, Account>) => {
        const wallet_1 = accounts.get('wallet_1')!.address

        let block = chain.mineBlock([
            Tx.contractCall('velar', 'mint', [
                types.uint(microVelar),
                types.principal(wallet_1)
            ], deployer),
        ])

        assertEquals(block.receipts.length, 1)
        block.receipts[0].result.expectOk()
    }
})

Clarinet.test({
    name: 'mint : fails on not-owner',
    fn: (chain: Chain, accounts: Map<String, Account>) => {
        const wallet_1 = accounts.get('wallet_1')!.address

        let block = chain.mineBlock([
            Tx.contractCall('velar', 'mint', [
                types.uint(microVelar),
                types.principal(wallet_1)
            ], wallet_1),
        ])

        assertEquals(block.receipts.length, 1)
        block.receipts[0].result.expectErr()
    }
})

Clarinet.test({
    name: 'mint : throws on > 1B',
    fn: (chain: Chain, accounts: Map<String, Account>) => {
        const wallet_1 = accounts.get('wallet_1')!.address

        let block = chain.mineBlock([
            Tx.contractCall('velar', 'mint', [
              types.uint(microVelar + 1),
              types.principal(wallet_1)
          ], deployer),
          Tx.contractCall('velar', 'mint', [
              types.uint(microVelar),
              types.principal(wallet_1)
          ], deployer),
          Tx.contractCall('velar', 'mint', [
                types.uint(1),
                types.principal(wallet_1)
           ], deployer)
        ])

        assertEquals(block.receipts.length, 1)
        block.receipts[0].result.expectOk()
    }
})
