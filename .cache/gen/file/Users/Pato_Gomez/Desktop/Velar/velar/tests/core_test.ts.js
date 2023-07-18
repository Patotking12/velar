import { Clarinet, Tx, types } from 'https://deno.land/x/clarinet@v1.5.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { addresses, deployer, tokens, swap_fee, protocol_fee, rev_share } from './contants.ts';
import { mintToken, createTestPair, createWSTXPair, depositTestPair, depositWSTXPair, createTestPairWithProtocolFee, initRevShare, fee } from './util.ts';
const err_auth = 100;
const err_check_owner = 101;
const err_no_such_pool = 102;
const err_create_preconditions = 103;
const err_create_postconditions = 104;
const err_mint_preconditions = 105;
const err_mint_postconditions = 106;
const err_burn_preconditions = 107;
const err_burn_postconditons = 108;
const err_swap_preconditions = 109;
const err_swap_postconditions = 110;
const err_collect_preconditions = 111;
const err_collect_postconditions = 112;
const err_anti_rug = 113;
const err_ft_transter = 1;
const { core , token_x , token_y , token_z , lp_token , lp_token_not_ft , wstx , rev_too ,  } = addresses;
const { token_x_id , token_y_id , lp_token_id  } = tokens;
// setters
const setOwner = (owner, sender)=>Tx.contractCall('core', 'set-owner', [
        types.principal(owner)
    ], sender);
const setFeeToo = (feeToo, sender)=>Tx.contractCall('core', 'set-fee-to', [
        types.principal(feeToo)
    ], sender);
const setRevShare = (revShare, sender)=>Tx.contractCall('core', 'set-rev-share', [
        types.principal(revShare)
    ], sender);
const updateSwapFee = (pool, fee0, sender)=>Tx.contractCall('core', 'update-swap-fee', [
        types.uint(pool),
        fee(fee0[0], fee0[1]), 
    ], sender);
const updateProtocolFee = (pool, fee0, sender)=>Tx.contractCall('core', 'update-protocol-fee', [
        types.uint(pool),
        fee(fee0[0], fee0[1]), 
    ], sender);
const updateShareFee = (pool, fee0, sender)=>Tx.contractCall('core', 'update-share-fee', [
        types.uint(pool),
        fee(fee0[0], fee0[1]), 
    ], sender);
// read-only
const getRevenue = (chain, pool)=>chain.callReadOnlyFn('core', 'do-get-revenue', [
        types.uint(pool)
    ], deployer).result.expectTuple();
// public
export const swapXY = (amtIn, amtOut, from)=>Tx.contractCall('core', 'swap', [
        types.uint(1),
        types.principal(token_x),
        types.principal(token_y),
        types.principal(rev_too),
        types.uint(amtIn),
        types.uint(amtOut), 
    ], from);
export const swapYX = (amtIn, amtOut, from)=>Tx.contractCall('core', 'swap', [
        types.uint(1),
        types.principal(token_y),
        types.principal(token_x),
        types.principal(rev_too),
        types.uint(amtIn),
        types.uint(amtOut), 
    ], from);
export const mint = (amt0, amt1, from)=>Tx.contractCall('core', 'mint', [
        types.uint(1),
        types.principal(token_x),
        types.principal(token_y),
        types.principal(lp_token),
        types.uint(amt0),
        types.uint(amt1), 
    ], from);
export const burn = (amt, from)=>Tx.contractCall('core', 'burn', [
        types.uint(1),
        types.principal(token_x),
        types.principal(token_y),
        types.principal(lp_token),
        types.uint(amt), 
    ], from);
export const collect = ()=>Tx.contractCall('core', 'collect', [
        types.uint(1),
        types.principal(token_x),
        types.principal(token_y), 
    ], deployer);
// --------
Clarinet.test({
    name: 'ensure owner is deployer',
    async fn (chain, accounts) {
        let deployer = accounts.get('deployer').address;
        let contractOwner = chain.callReadOnlyFn('core', 'get-owner', [], deployer);
        contractOwner.result.expectPrincipal(deployer);
    }
});
Clarinet.test({
    name: 'create fails on not owner',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        initRevShare(chain);
        let block = chain.mineBlock([
            Tx.contractCall('core', 'create', [
                types.principal(token_x),
                types.principal(token_y),
                types.principal(lp_token),
                swap_fee,
                protocol_fee,
                rev_share, 
            ], wallet_1)
        ]);
        block.receipts[0].result.expectErr().expectUint(err_check_owner);
    }
});
Clarinet.test({
    name: 'create fails on same x/y-token',
    async fn (chain, accounts) {
        let deployer = accounts.get('deployer').address;
        let block = chain.mineBlock([
            Tx.contractCall('core', 'create', [
                types.principal(token_x),
                types.principal(token_x),
                types.principal(lp_token),
                swap_fee,
                protocol_fee,
                rev_share, 
            ], deployer)
        ]);
        block.receipts[0].result.expectErr().expectUint(err_create_preconditions);
    }
});
Clarinet.test({
    name: 'create fails on existing lp-token',
    async fn (chain, accounts) {
        let deployer = accounts.get('deployer').address;
        initRevShare(chain);
        // setup
        let block = chain.mineBlock([
            createTestPair(), 
        ]);
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
        ]);
        block.receipts[0].result.expectErr().expectUint(err_create_preconditions);
    }
});
Clarinet.test({
    name: 'create: fails on wrong trait',
    async fn (chain, accounts) {
        let deployer = accounts.get('deployer').address;
        initRevShare(chain);
        let block = chain.mineBlock([
            Tx.contractCall('core', 'create', [
                types.principal(token_x),
                types.principal(token_z),
                types.principal(lp_token_not_ft),
                swap_fee,
                protocol_fee,
                rev_share, 
            ], deployer)
        ]);
        assertEquals(block.receipts.length, 0);
    }
});
Clarinet.test({
    name: 'create: adds entries to pools, revenue & index maps',
    async fn (chain, accounts) {
        let deployer = accounts.get('deployer').address;
        initRevShare(chain);
        let block = chain.mineBlock([
            createTestPair(), 
        ]);
        let revenue = getRevenue(chain, 1);
        revenue['token0'].expectUint(0);
        revenue['token1'].expectUint(0);
        chain.callReadOnlyFn('core', 'get-pool-id', [
            types.principal(token_x),
            types.principal(token_y)
        ], deployer).result.expectSome().expectUint(1);
        let pair = chain.callReadOnlyFn('core', 'get-pool', [
            types.uint(1)
        ], deployer).result.expectSome().expectTuple();
        pair['token0'].expectPrincipal(token_x);
        pair['token1'].expectPrincipal(token_y);
        pair['symbol'].expectAscii('X-Y');
        let pair1 = chain.callReadOnlyFn('core', 'lookup-pool', [
            types.principal(token_x),
            types.principal(token_y)
        ], deployer).result.expectSome().expectTuple();
        pair1['flipped'].expectBool(false);
        pair1['pool'].expectTuple()['token0'].expectPrincipal(token_x);
        pair1['pool'].expectTuple()['token1'].expectPrincipal(token_y);
        pair1['pool'].expectTuple()['lp-token'].expectPrincipal(lp_token);
        pair1['pool'].expectTuple()['reserve0'].expectUint(0);
        pair1['pool'].expectTuple()['reserve1'].expectUint(0);
    }
});
// ===== Setters
Clarinet.test({
    name: 'setters: can only be called by owner',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        // setup
        let block = chain.mineBlock([
            createTestPair(), 
        ]);
        block = chain.mineBlock([
            // addresses
            setOwner(wallet_1, wallet_1),
            setRevShare(wallet_1, wallet_1),
            setFeeToo(wallet_1, wallet_1),
            // fees
            updateSwapFee(1, [
                998,
                1000
            ], wallet_1),
            updateProtocolFee(1, [
                998,
                1000
            ], wallet_1),
            updateShareFee(1, [
                998,
                1000
            ], wallet_1)
        ]);
        block.receipts.forEach((r)=>r.result.expectErr().expectUint(err_check_owner));
    }
});
// TODO: mint postcondition
Clarinet.test({
    name: 'setters: fees can only be reasonable values',
    async fn (chain) {
        // setup
        let block = chain.mineBlock([
            createTestPair(), 
        ]);
        // swap fee
        block = chain.mineBlock([
            updateSwapFee(1, [
                994,
                1_000
            ], deployer),
            updateSwapFee(1, [
                99,
                100
            ], deployer),
            updateSwapFee(1, [
                9,
                10
            ], deployer), 
        ]);
        block.receipts.forEach((r)=>r.result.expectErr().expectUint(err_anti_rug));
        block = chain.mineBlock([
            updateSwapFee(1, [
                995,
                1_000
            ], deployer),
            updateSwapFee(1, [
                100,
                100
            ], deployer),
            updateSwapFee(1, [
                9_995,
                10_000
            ], deployer), 
        ]);
        block.receipts.forEach((r)=>r.result.expectOk());
        // NOTE: no limitation on protocol/share
        block = chain.mineBlock([
            updateProtocolFee(1, [
                1,
                0
            ], deployer),
            updateShareFee(1, [
                1,
                0
            ], deployer)
        ]);
        block.receipts.forEach((r)=>r.result.expectOk());
    }
});
// ===== Mint
Clarinet.test({
    name: 'mint fails when recipient has insufficient balance',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let wallet_2 = accounts.get('wallet_2').address;
        wallet_1.expectPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5');
        wallet_2.expectPrincipal('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
        initRevShare(chain);
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
        assertEquals(block.receipts.length, 2);
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectErr().expectUint(err_ft_transter);
    }
});
Clarinet.test({
    name: 'mint fails on nonexistant pair',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
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
        assertEquals(block.receipts.length, 0);
    }
});
Clarinet.test({
    name: 'mint: postconditions (overflow in burn)',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let wallet_2 = accounts.get('wallet_2').address;
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
        block.receipts[0].result.expectOk().expectTuple().liquidity.expectUint(n(18));
        block.receipts[1].result.expectOk();
        block = chain.mineBlock([
            depositTestPair(n(19), n(19), wallet_2),
            burn(n(19), wallet_2), 
        ]);
        block.receipts[0].result.expectOk();
        block.receipts[1].result.expectOk();
        block = chain.mineBlock([
            depositTestPair(n(19), n(19), wallet_2), 
        ]);
        // NOTE: error == overflow..
        block = chain.mineBlock([
            depositTestPair(n(20), n(20), wallet_2), 
        ]);
        assertEquals(block.receipts.length, 0);
    }
});
Clarinet.test({
    name: 'mint mints lp-tokens to sender & transfers deposit amounts',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
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
        block.receipts[0].result.expectOk().expectTuple();
        block.receipts[0].events.expectFungibleTokenMintEvent(10, wallet_1, `${lp_token}::lp-token`);
        block.receipts[0].events.expectFungibleTokenTransferEvent(10, wallet_1, `${deployer}.core`, `${token_x}::token-x`);
        block.receipts[0].events.expectFungibleTokenTransferEvent(10, wallet_1, `${deployer}.core`, `${token_y}::token-y`);
        let assets = chain.getAssetsMaps().assets;
        assertEquals(assets[token_x_id][wallet_1], 990);
        assertEquals(assets[token_y_id][wallet_1], 1990);
        assertEquals(assets[token_x_id][core], 10);
        assertEquals(assets[token_y_id][core], 10);
        assertEquals(assets[lp_token_id][wallet_1], 10);
    }
});
// ===== Burn
Clarinet.test({
    name: 'burn fails on non-existant pair',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let block = chain.mineBlock([
            Tx.contractCall('core', 'burn', [
                types.uint(1),
                types.principal(token_x),
                types.principal(token_y),
                types.principal(lp_token),
                types.uint(100), 
            ], wallet_1)
        ]);
        assertEquals(block.receipts.length, 0);
    // assertEquals(block.receipts.length, 1)
    // block.receipts[0].result.expectErr().expectErr(err_no_such_pool)
    }
});
Clarinet.test({
    name: 'withdraw fails on lp-balance < amt',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let block = chain.mineBlock([
            mintToken(token_x, 50, wallet_1),
            mintToken(token_y, 50, wallet_1),
            mintToken(lp_token, 100, wallet_1),
            createTestPair(), 
        ]);
        block = chain.mineBlock([
            Tx.contractCall('core', 'burn', [
                types.uint(1),
                types.principal(token_x),
                types.principal(token_y),
                types.principal(lp_token),
                types.uint(100), 
            ], wallet_1)
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr().expectUint(err_burn_preconditions);
    }
});
Clarinet.test({
    name: 'burn fails on wrong token trait',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let block = chain.mineBlock([
            mintToken(lp_token, 100, wallet_1),
            createTestPair(), 
        ]);
        block = chain.mineBlock([
            Tx.contractCall('core', 'burn', [
                types.uint(1),
                types.principal(token_y),
                types.principal(token_x),
                types.principal(lp_token),
                types.uint(100), 
            ], wallet_1)
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr().expectUint(err_burn_preconditions);
    }
});
Clarinet.test({
    name: 'burn burns lp balance == amt from sender & increases token-x/token-y balances',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let block = chain.mineBlock([
            mintToken(token_x, 50, wallet_1),
            mintToken(token_y, 50, wallet_1),
            createTestPair(),
            depositTestPair(10, 10, wallet_1), 
        ]);
        assertEquals(block.receipts.length, 4);
        block.receipts.map((r)=>r.result.expectOk());
        let assets = chain.getAssetsMaps().assets;
        assertEquals(assets[token_x_id][wallet_1], 40);
        assertEquals(assets[token_y_id][wallet_1], 40);
        assertEquals(assets[lp_token_id][wallet_1], 10);
        assertEquals(assets[token_x_id][core], 10);
        assertEquals(assets[token_y_id][core], 10);
        block = chain.mineBlock([
            Tx.contractCall('core', 'burn', [
                types.uint(1),
                types.principal(token_x),
                types.principal(token_y),
                types.principal(lp_token),
                types.uint(2), 
            ], wallet_1)
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk();
        assets = chain.getAssetsMaps().assets;
        assertEquals(assets[token_x_id][wallet_1], 42);
        assertEquals(assets[token_y_id][wallet_1], 42);
        assertEquals(assets[token_x_id][core], 8);
        assertEquals(assets[token_y_id][core], 8);
        assertEquals(assets[lp_token_id][wallet_1], 8);
    }
});
Clarinet.test({
    name: 'burn withdraws last of reserves',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let block = chain.mineBlock([
            mintToken(token_x, 50, wallet_1),
            mintToken(token_y, 50, wallet_1),
            createTestPair(),
            depositTestPair(10, 10, wallet_1), 
        ]);
        let assets = chain.getAssetsMaps().assets;
        assertEquals(block.receipts.length, 4);
        assertEquals(assets[lp_token_id][wallet_1], 10);
        block = chain.mineBlock([
            burn(10, wallet_1), 
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk();
        assets = chain.getAssetsMaps().assets;
        assertEquals(assets[token_x_id][wallet_1], 50);
        assertEquals(assets[token_y_id][wallet_1], 50);
        assertEquals(assets[token_x_id][core], 0);
        assertEquals(assets[token_y_id][core], 0);
        assertEquals(assets[lp_token_id][wallet_1], 0);
    }
});
const n = (zeros)=>`1${'0'.repeat(zeros)}`;
Clarinet.test({
    name: 'burn with large reserves works...',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let wallet_2 = accounts.get('wallet_2').address;
        let block = chain.mineBlock([
            mintToken(token_x, n(37), wallet_1),
            mintToken(token_y, n(37), wallet_1),
            mintToken(token_x, n(37), wallet_2),
            mintToken(token_y, n(37), wallet_2),
            createTestPair(), 
        ]);
        // large deposits (amt0 * amt1 on first mint)
        let tests = [
            n(21),
            n(18)
        ];
        block = chain.mineBlock(tests.map((v)=>depositTestPair(v, v, wallet_1)));
        // let assets = chain.getAssetsMaps().assets // NOTE: crashes here
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk();
        // big swap...
        block = chain.mineBlock([
            swapXY(n(18), 1, wallet_1), 
        ]);
        assertEquals(block.receipts.length, 1);
        let pair = chain.callReadOnlyFn('core', 'get-pool', [
            types.uint(1)
        ], deployer).result.expectSome();
        // 2nd deposit (max(amt0 * totalSupply, amt1 * totalSupply))
        block = chain.mineBlock([
            depositTestPair(n(18), n(18), wallet_2), 
        ]);
        pair = chain.callReadOnlyFn('core', 'get-pool', [
            types.uint(1)
        ], deployer).result.expectSome();
        block = chain.mineBlock([
            depositTestPair(n(18), n(18), wallet_2), 
        ]);
    }
});
// ====== Swap
Clarinet.test({
    name: 'swap: ...',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let wallet_2 = accounts.get('wallet_2').address;
        initRevShare(chain);
        // setup
        let block = chain.mineBlock([
            mintToken(token_x, 10_000, wallet_1),
            mintToken(token_y, 10_000, wallet_1),
            mintToken(token_x, 10_000, wallet_2),
            createTestPair(),
            depositTestPair(10_000, 10_000, wallet_1), 
        ]);
        assertEquals(block.receipts.length, 5);
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
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr().expectUint(err_swap_postconditions);
        // balances still the same
        let pair = chain.callReadOnlyFn('core', 'get-pool', [
            types.uint(1)
        ], deployer);
        let res = pair.result.expectSome().expectTuple();
        res['reserve0'].expectUint(10_000);
        res['reserve1'].expectUint(10_000);
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
        ]);
        assertEquals(block.receipts.length, 1);
        res = block.receipts[0].result.expectOk().expectTuple();
        res['amt-in'].expectUint(1_000);
        res['amt-fee-lps'].expectUint(3);
        res['amt-in-adjusted'].expectUint(997);
        res['amt-out'].expectUint(900);
        pair = chain.callReadOnlyFn('core', 'get-pool', [
            types.uint(1)
        ], deployer).result.expectSome().expectTuple();
        pair.reserve0.expectUint(11_000);
        pair.reserve1.expectUint(9_100);
        let assets = chain.getAssetsMaps().assets;
        assertEquals(assets[token_x_id][wallet_2], 9_000);
        assertEquals(assets[token_y_id][wallet_2], 900);
    // core balances == reserves
    // assertEquals(assets[token_x_id][core], r0)
    // assertEquals(assets[token_y_id][core], r1)
    }
});
Clarinet.test({
    name: 'swap x for wstx',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let wallet_2 = accounts.get('wallet_2').address;
        const initialSTX = 10 ** 14;
        // setup
        initRevShare(chain);
        let block = chain.mineBlock([
            mintToken(token_x, 10_000, wallet_1),
            mintToken(token_x, 10_000, wallet_2),
            createWSTXPair(),
            depositWSTXPair(10_000, 10_000, wallet_1), 
        ]);
        assertEquals(block.receipts.length, 4);
        let assets = chain.getAssetsMaps().assets;
        assertEquals(assets[token_x_id][wallet_1], 0);
        assertEquals(assets[token_x_id][wallet_2], 10_000);
        assertEquals(assets[token_x_id][core], 10_000);
        assertEquals(assets['STX'][wallet_1], initialSTX - 10_000);
        assertEquals(assets['STX'][core], 10_000);
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
        ]);
        assertEquals(block.receipts.length, 1);
        let res = block.receipts[0].result.expectOk().expectTuple();
        res['amt-in'].expectUint(1_000);
        res['amt-out'].expectUint(900);
        assets = chain.getAssetsMaps().assets;
        assertEquals(assets[token_x_id][wallet_2], 9_000);
        assertEquals(assets[token_x_id][core], 11_000);
        assertEquals(assets['STX'][wallet_2], initialSTX + 900);
        assertEquals(assets['STX'][core], 9_100);
    }
});
Clarinet.test({
    name: 'swap : large swap empties reserve, user can still burn',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let wallet_2 = accounts.get('wallet_2').address;
        initRevShare(chain);
        let block = chain.mineBlock([
            mintToken(token_x, 50, wallet_1),
            mintToken(token_x, 50, wallet_2),
            mintToken(token_y, 50, wallet_1),
            createTestPair(),
            depositTestPair(10, 10, wallet_1),
            swapXY(50, 1, wallet_2), 
        ]);
        assertEquals(block.receipts.length, 6);
        block.receipts.map((r)=>r.result.expectOk());
        let assets = chain.getAssetsMaps().assets;
        assertEquals(assets[lp_token_id][wallet_1], 10);
        assertEquals(assets[token_x_id][wallet_2], 0);
        assertEquals(assets[token_y_id][wallet_2], 1);
        assertEquals(assets[token_x_id][core], 60) // + 50
        ;
        assertEquals(assets[token_y_id][core], 9) // - 1
        ;
        block = chain.mineBlock([
            burn(10, wallet_1), 
        ]);
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk();
        assets = chain.getAssetsMaps().assets;
        // TODO: used to get 99 token-x and one left in core?
        assertEquals(assets[token_x_id][wallet_1], 100);
        assertEquals(assets[token_y_id][wallet_1], 49);
        assertEquals(assets[token_x_id][core], 0);
        assertEquals(assets[token_y_id][core], 0);
        assertEquals(assets[lp_token_id][wallet_1], 0);
    // TODO: underflow, would be nice with a proper error instead
    // block = chain.mineBlock([
    //   swapXY(50, 1, wallet_1),
    // ])
    // block.receipts[0].result.expectErr()
    }
});
Clarinet.test({
    name: 'collect : owner can collect fees',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let wallet_2 = accounts.get('wallet_2').address;
        initRevShare(chain);
        let block = chain.mineBlock([
            mintToken(token_x, 10_000_000, wallet_1),
            mintToken(token_x, 10_000_000, wallet_2),
            mintToken(token_y, 10_000_000, wallet_1),
            createTestPairWithProtocolFee([
                30,
                1_000
            ]),
            depositTestPair(10_000_000, 10_000_000, wallet_1),
            swapXY(100_000, 98_710, wallet_2), 
        ]);
        block.receipts.map((r)=>r.result.expectOk());
        let assets = chain.getAssetsMaps().assets;
        assertEquals(block.receipts.length, 6);
        assertEquals(assets[token_y_id][wallet_2], 98_710);
        let pair = chain.callReadOnlyFn('core', 'get-pool', [
            types.uint(1)
        ], deployer).result.expectSome().expectTuple();
        let revenue = getRevenue(chain, 1);
        revenue.token0.expectUint(9);
        revenue.token1.expectUint(0);
        pair.reserve0.expectUint(10_000_000 + 100_000 - 9);
        pair.reserve1.expectUint(10_000_000 - 98_710);
        // only one token fails
        block = chain.mineBlock([
            collect(), 
        ]);
        block.receipts[0].result.expectErr(err_collect_preconditions);
        block = chain.mineBlock([
            swapYX(50_000, 40_000, wallet_2),
            collect(), 
        ]);
        assets = chain.getAssetsMaps().assets;
        assertEquals(assets[token_x_id][deployer], 9);
        assertEquals(assets[token_y_id][deployer], 4);
        revenue = getRevenue(chain, 1);
        revenue.token0.expectUint(0);
        revenue.token1.expectUint(0);
    }
}); // ========== mint/burn max reserves
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL2NvcmVfdGVzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IENsYXJpbmV0LCBUeCwgQ2hhaW4sIEFjY291bnQsIENvbnRyYWN0LCB0eXBlcyB9IGZyb20gJ2h0dHBzOi8vZGVuby5sYW5kL3gvY2xhcmluZXRAdjEuNS40L2luZGV4LnRzJztcbmltcG9ydCB7IGFzc2VydEVxdWFscyB9IGZyb20gJ2h0dHBzOi8vZGVuby5sYW5kL3N0ZEAwLjkwLjAvdGVzdGluZy9hc3NlcnRzLnRzJztcbmltcG9ydCB7IGFkZHJlc3NlcywgZGVwbG95ZXIsIHRva2Vucywgc3dhcF9mZWUsIHByb3RvY29sX2ZlZSwgcmV2X3NoYXJlIH0gZnJvbSAnLi9jb250YW50cy50cydcbmltcG9ydCB7XG4gIG1pbnRUb2tlbixcbiAgY3JlYXRlVGVzdFBhaXIsXG4gIGNyZWF0ZVdTVFhQYWlyLFxuICBkZXBvc2l0VGVzdFBhaXIsXG4gIGRlcG9zaXRXU1RYUGFpcixcbiAgY3JlYXRlVGVzdFBhaXJXaXRoUHJvdG9jb2xGZWUsXG4gIGluaXRSZXZTaGFyZSxcbiAgZmVlLFxufSBmcm9tICcuL3V0aWwudHMnO1xuXG50eXBlIEJpZyA9IG51bWJlcnxzdHJpbmdcblxuY29uc3QgZXJyX2F1dGggICAgICAgICAgICAgICAgICAgPSAxMDBcbmNvbnN0IGVycl9jaGVja19vd25lciAgICAgICAgICAgID0gMTAxXG5jb25zdCBlcnJfbm9fc3VjaF9wb29sICAgICAgICAgICA9IDEwMlxuY29uc3QgZXJyX2NyZWF0ZV9wcmVjb25kaXRpb25zICAgPSAxMDNcbmNvbnN0IGVycl9jcmVhdGVfcG9zdGNvbmRpdGlvbnMgID0gMTA0XG5jb25zdCBlcnJfbWludF9wcmVjb25kaXRpb25zICAgICA9IDEwNVxuY29uc3QgZXJyX21pbnRfcG9zdGNvbmRpdGlvbnMgICAgPSAxMDZcbmNvbnN0IGVycl9idXJuX3ByZWNvbmRpdGlvbnMgICAgID0gMTA3XG5jb25zdCBlcnJfYnVybl9wb3N0Y29uZGl0b25zICAgICA9IDEwOFxuY29uc3QgZXJyX3N3YXBfcHJlY29uZGl0aW9ucyAgICAgPSAxMDlcbmNvbnN0IGVycl9zd2FwX3Bvc3Rjb25kaXRpb25zICAgID0gMTEwXG5jb25zdCBlcnJfY29sbGVjdF9wcmVjb25kaXRpb25zICA9IDExMVxuY29uc3QgZXJyX2NvbGxlY3RfcG9zdGNvbmRpdGlvbnMgPSAxMTJcbmNvbnN0IGVycl9hbnRpX3J1ZyAgICAgICAgICAgICAgID0gMTEzXG5cbmNvbnN0IGVycl9mdF90cmFuc3RlciAgICAgICAgICAgID0gMVxuXG5jb25zdCB7XG4gIGNvcmUsXG4gIHRva2VuX3gsXG4gIHRva2VuX3ksXG4gIHRva2VuX3osXG4gIGxwX3Rva2VuLFxuICBscF90b2tlbl9ub3RfZnQsXG4gIHdzdHgsXG4gIHJldl90b28sXG59ID0gYWRkcmVzc2VzIFxuXG5jb25zdCB7XG4gIHRva2VuX3hfaWQsXG4gIHRva2VuX3lfaWQsXG4gIGxwX3Rva2VuX2lkXG59ID0gdG9rZW5zXG5cbi8vIHNldHRlcnNcbmNvbnN0IHNldE93bmVyID0gKG93bmVyOiBzdHJpbmcsIHNlbmRlcjogc3RyaW5nKSA9PlxuICBUeC5jb250cmFjdENhbGwoJ2NvcmUnLCAnc2V0LW93bmVyJywgW1xuICAgIHR5cGVzLnByaW5jaXBhbChvd25lcilcbiAgXSwgc2VuZGVyKVxuXG5jb25zdCBzZXRGZWVUb28gPSAoZmVlVG9vOiBzdHJpbmcsIHNlbmRlcjogc3RyaW5nKSA9PlxuICBUeC5jb250cmFjdENhbGwoJ2NvcmUnLCAnc2V0LWZlZS10bycsIFtcbiAgICB0eXBlcy5wcmluY2lwYWwoZmVlVG9vKVxuICBdLCBzZW5kZXIpXG5cbmNvbnN0IHNldFJldlNoYXJlID0gKHJldlNoYXJlOiBzdHJpbmcsIHNlbmRlcjogc3RyaW5nKSA9PlxuICBUeC5jb250cmFjdENhbGwoJ2NvcmUnLCAnc2V0LXJldi1zaGFyZScsIFtcbiAgICB0eXBlcy5wcmluY2lwYWwocmV2U2hhcmUpXG4gIF0sIHNlbmRlcilcblxuY29uc3QgdXBkYXRlU3dhcEZlZSA9IChwb29sOiBudW1iZXIsIGZlZTA6IG51bWJlcltdLCBzZW5kZXI6IHN0cmluZykgPT5cbiAgVHguY29udHJhY3RDYWxsKCdjb3JlJywgJ3VwZGF0ZS1zd2FwLWZlZScsIFtcbiAgICB0eXBlcy51aW50KHBvb2wpLFxuICAgIGZlZShmZWUwWzBdLCBmZWUwWzFdKSxcbiAgXSwgc2VuZGVyKVxuXG5jb25zdCB1cGRhdGVQcm90b2NvbEZlZSA9IChwb29sOiBudW1iZXIsIGZlZTA6IG51bWJlcltdLCBzZW5kZXI6IHN0cmluZykgPT5cbiAgVHguY29udHJhY3RDYWxsKCdjb3JlJywgJ3VwZGF0ZS1wcm90b2NvbC1mZWUnLCBbXG4gICAgdHlwZXMudWludChwb29sKSxcbiAgICBmZWUoZmVlMFswXSwgZmVlMFsxXSksXG4gIF0sIHNlbmRlcilcblxuY29uc3QgdXBkYXRlU2hhcmVGZWUgPSAocG9vbDogbnVtYmVyLCBmZWUwOiBudW1iZXJbXSwgc2VuZGVyOiBzdHJpbmcpID0+XG4gIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICd1cGRhdGUtc2hhcmUtZmVlJywgW1xuICAgIHR5cGVzLnVpbnQocG9vbCksXG4gICAgZmVlKGZlZTBbMF0sIGZlZTBbMV0pLFxuICBdLCBzZW5kZXIpXG5cbi8vIHJlYWQtb25seVxuY29uc3QgZ2V0UmV2ZW51ZSA9IChjaGFpbjogQ2hhaW4sIHBvb2w6IG51bWJlcikgPT5cbiAgICBjaGFpbi5jYWxsUmVhZE9ubHlGbignY29yZScsICdkby1nZXQtcmV2ZW51ZScsIFt0eXBlcy51aW50KHBvb2wpXSwgZGVwbG95ZXIpXG4gICAgICAgICAgLnJlc3VsdC5leHBlY3RUdXBsZSgpXG5cbi8vIHB1YmxpY1xuZXhwb3J0IGNvbnN0IHN3YXBYWSA9IChhbXRJbjogQmlnLCBhbXRPdXQ6IEJpZywgZnJvbTogc3RyaW5nKSA9PlxuICBUeC5jb250cmFjdENhbGwoJ2NvcmUnLCAnc3dhcCcsIFtcbiAgICB0eXBlcy51aW50KDEpLFxuICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl94KSxcbiAgICB0eXBlcy5wcmluY2lwYWwodG9rZW5feSksXG4gICAgdHlwZXMucHJpbmNpcGFsKHJldl90b28pLFxuICAgIHR5cGVzLnVpbnQoYW10SW4pLFxuICAgIHR5cGVzLnVpbnQoYW10T3V0KSwgXG5dLCBmcm9tKVxuXG5leHBvcnQgY29uc3Qgc3dhcFlYID0gKGFtdEluOiBCaWcsIGFtdE91dDogQmlnLCBmcm9tOiBzdHJpbmcpID0+XG4gIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdzd2FwJywgW1xuICAgIHR5cGVzLnVpbnQoMSksXG4gICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3kpLFxuICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl94KSxcbiAgICB0eXBlcy5wcmluY2lwYWwocmV2X3RvbyksXG4gICAgdHlwZXMudWludChhbXRJbiksXG4gICAgdHlwZXMudWludChhbXRPdXQpLCBcbl0sIGZyb20pXG5cbmV4cG9ydCBjb25zdCBtaW50ID0gKGFtdDA6IEJpZywgYW10MTogQmlnLCBmcm9tOiBzdHJpbmcpID0+XG4gIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdtaW50JywgW1xuICAgIHR5cGVzLnVpbnQoMSksXG4gICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3gpLFxuICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl95KSxcbiAgICB0eXBlcy5wcmluY2lwYWwobHBfdG9rZW4pLFxuICAgIHR5cGVzLnVpbnQoYW10MCksXG4gICAgdHlwZXMudWludChhbXQxKSxcbl0sIGZyb20pXG5cbmV4cG9ydCBjb25zdCBidXJuID0gKGFtdDogQmlnLCBmcm9tOiBzdHJpbmcpID0+XG4gIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdidXJuJywgW1xuICAgIHR5cGVzLnVpbnQoMSksXG4gICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3gpLFxuICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl95KSxcbiAgICB0eXBlcy5wcmluY2lwYWwobHBfdG9rZW4pLFxuICAgIHR5cGVzLnVpbnQoYW10KSxcbl0sIGZyb20pXG5cbmV4cG9ydCBjb25zdCBjb2xsZWN0ID0gKCkgPT5cbiAgVHguY29udHJhY3RDYWxsKCdjb3JlJywgJ2NvbGxlY3QnLCBbXG4gICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3gpLFxuICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3kpLFxuICBdLCBkZXBsb3llcilcblxuLy8gLS0tLS0tLS1cblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6ICdlbnN1cmUgb3duZXIgaXMgZGVwbG95ZXInLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KCdkZXBsb3llcicpIS5hZGRyZXNzXG5cbiAgICAgIGxldCBjb250cmFjdE93bmVyID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oJ2NvcmUnLCAnZ2V0LW93bmVyJywgW10sIGRlcGxveWVyKVxuICAgICAgY29udHJhY3RPd25lci5yZXN1bHQuZXhwZWN0UHJpbmNpcGFsKGRlcGxveWVyKVxuICAgICAgfSxcbn0pO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ2NyZWF0ZSBmYWlscyBvbiBub3Qgb3duZXInLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG5cbiAgICAgIGluaXRSZXZTaGFyZShjaGFpbilcblxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKCdjb3JlJywgJ2NyZWF0ZScsIFtcbiAgICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW5feCksXG4gICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3kpLFxuICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChscF90b2tlbiksXG4gICAgICAgICAgc3dhcF9mZWUsXG4gICAgICAgICAgcHJvdG9jb2xfZmVlLFxuICAgICAgICAgIHJldl9zaGFyZSxcbiAgICAgICAgXSwgd2FsbGV0XzEpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHRcbiAgICAgICAgLmV4cGVjdEVycigpXG4gICAgICAgIC5leHBlY3RVaW50KGVycl9jaGVja19vd25lcilcbiAgICB9XG59KTtcblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6ICdjcmVhdGUgZmFpbHMgb24gc2FtZSB4L3ktdG9rZW4nLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KCdkZXBsb3llcicpIS5hZGRyZXNzXG5cbiAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdjcmVhdGUnLCBbXG4gICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3gpLFxuICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl94KSxcbiAgICAgICAgICB0eXBlcy5wcmluY2lwYWwobHBfdG9rZW4pLFxuICAgICAgICAgIHN3YXBfZmVlLFxuICAgICAgICAgIHByb3RvY29sX2ZlZSxcbiAgICAgICAgICByZXZfc2hhcmUsXG4gICAgICAgIF0sIGRlcGxveWVyKVxuICAgICAgXSlcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0XG4gICAgICAgICAgLmV4cGVjdEVycigpXG4gICAgICAgICAgLmV4cGVjdFVpbnQoZXJyX2NyZWF0ZV9wcmVjb25kaXRpb25zKVxuICAgIH1cbn0pO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ2NyZWF0ZSBmYWlscyBvbiBleGlzdGluZyBscC10b2tlbicsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBsZXQgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoJ2RlcGxveWVyJykhLmFkZHJlc3NcbiAgICAgIGluaXRSZXZTaGFyZShjaGFpbilcblxuICAgICAgLy8gc2V0dXBcbiAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIGNyZWF0ZVRlc3RQYWlyKCksXG4gICAgICBdKVxuXG4gICAgICAvLyB0ZXN0XG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdjcmVhdGUnLCBbXG4gICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3gpLFxuICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl96KSxcbiAgICAgICAgICB0eXBlcy5wcmluY2lwYWwobHBfdG9rZW4pLFxuICAgICAgICAgIHN3YXBfZmVlLFxuICAgICAgICAgIHByb3RvY29sX2ZlZSxcbiAgICAgICAgICByZXZfc2hhcmUsXG4gICAgICAgIF0sIGRlcGxveWVyKVxuICAgICAgXSlcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0XG4gICAgICAgICAgLmV4cGVjdEVycigpXG4gICAgICAgICAgLmV4cGVjdFVpbnQoZXJyX2NyZWF0ZV9wcmVjb25kaXRpb25zKVxuICAgIH1cbn0pO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ2NyZWF0ZTogZmFpbHMgb24gd3JvbmcgdHJhaXQnLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KCdkZXBsb3llcicpIS5hZGRyZXNzXG5cbiAgICAgIGluaXRSZXZTaGFyZShjaGFpbilcblxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKCdjb3JlJywgJ2NyZWF0ZScsIFtcbiAgICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW5feCksXG4gICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3opLFxuICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChscF90b2tlbl9ub3RfZnQpLFxuICAgICAgICAgIHN3YXBfZmVlLFxuICAgICAgICAgIHByb3RvY29sX2ZlZSxcbiAgICAgICAgICByZXZfc2hhcmUsXG4gICAgICAgIF0sIGRlcGxveWVyKVxuICAgICAgXSlcblxuICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgMClcbiAgICB9XG59KTtcblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6ICdjcmVhdGU6IGFkZHMgZW50cmllcyB0byBwb29scywgcmV2ZW51ZSAmIGluZGV4IG1hcHMnLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KCdkZXBsb3llcicpIS5hZGRyZXNzXG5cbiAgICAgIGluaXRSZXZTaGFyZShjaGFpbilcblxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgY3JlYXRlVGVzdFBhaXIoKSxcbiAgICAgIF0pXG5cbiAgICAgIGxldCByZXZlbnVlID0gZ2V0UmV2ZW51ZShjaGFpbiwgMSlcblxuICAgICAgcmV2ZW51ZVsndG9rZW4wJ10uZXhwZWN0VWludCgwKVxuICAgICAgcmV2ZW51ZVsndG9rZW4xJ10uZXhwZWN0VWludCgwKVxuXG4gICAgICBjaGFpbi5jYWxsUmVhZE9ubHlGbignY29yZScsICdnZXQtcG9vbC1pZCcsIFt0eXBlcy5wcmluY2lwYWwodG9rZW5feCksIHR5cGVzLnByaW5jaXBhbCh0b2tlbl95KV0sIGRlcGxveWVyKVxuICAgICAgICAgIC5yZXN1bHRcbiAgICAgICAgICAuZXhwZWN0U29tZSgpXG4gICAgICAgICAgLmV4cGVjdFVpbnQoMSlcblxuICAgICAgbGV0IHBhaXIgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbignY29yZScsICdnZXQtcG9vbCcsIFt0eXBlcy51aW50KDEpXSwgZGVwbG95ZXIpXG4gICAgICAgICAgLnJlc3VsdFxuICAgICAgICAgIC5leHBlY3RTb21lKClcbiAgICAgICAgICAuZXhwZWN0VHVwbGUoKVxuXG4gICAgICBwYWlyWyd0b2tlbjAnXS5leHBlY3RQcmluY2lwYWwodG9rZW5feClcbiAgICAgIHBhaXJbJ3Rva2VuMSddLmV4cGVjdFByaW5jaXBhbCh0b2tlbl95KVxuICAgICAgcGFpclsnc3ltYm9sJ10uZXhwZWN0QXNjaWkoJ1gtWScpXG5cbiAgICAgIGxldCBwYWlyMSA9IGNoYWluLmNhbGxSZWFkT25seUZuKCdjb3JlJywgJ2xvb2t1cC1wb29sJywgW3R5cGVzLnByaW5jaXBhbCh0b2tlbl94KSwgdHlwZXMucHJpbmNpcGFsKHRva2VuX3kpXSwgZGVwbG95ZXIpXG4gICAgICAgICAgLnJlc3VsdFxuICAgICAgICAgIC5leHBlY3RTb21lKClcbiAgICAgICAgICAuZXhwZWN0VHVwbGUoKVxuXG4gICAgICBwYWlyMVsnZmxpcHBlZCddLmV4cGVjdEJvb2woZmFsc2UpXG4gICAgICBwYWlyMVsncG9vbCddLmV4cGVjdFR1cGxlKClbJ3Rva2VuMCddLmV4cGVjdFByaW5jaXBhbCh0b2tlbl94KVxuICAgICAgcGFpcjFbJ3Bvb2wnXS5leHBlY3RUdXBsZSgpWyd0b2tlbjEnXS5leHBlY3RQcmluY2lwYWwodG9rZW5feSlcbiAgICAgIHBhaXIxWydwb29sJ10uZXhwZWN0VHVwbGUoKVsnbHAtdG9rZW4nXS5leHBlY3RQcmluY2lwYWwobHBfdG9rZW4pXG4gICAgICBwYWlyMVsncG9vbCddLmV4cGVjdFR1cGxlKClbJ3Jlc2VydmUwJ10uZXhwZWN0VWludCgwKVxuICAgICAgcGFpcjFbJ3Bvb2wnXS5leHBlY3RUdXBsZSgpWydyZXNlcnZlMSddLmV4cGVjdFVpbnQoMClcbiAgICB9XG59KTtcblxuLy8gPT09PT0gU2V0dGVyc1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiAnc2V0dGVyczogY2FuIG9ubHkgYmUgY2FsbGVkIGJ5IG93bmVyJyxcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBsZXQgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3NcblxuICAgICAgICAvLyBzZXR1cFxuICAgICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgY3JlYXRlVGVzdFBhaXIoKSxcbiAgICAgICAgXSlcblxuICAgICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICAvLyBhZGRyZXNzZXNcbiAgICAgICAgICAgIHNldE93bmVyKHdhbGxldF8xLCB3YWxsZXRfMSksXG4gICAgICAgICAgICBzZXRSZXZTaGFyZSh3YWxsZXRfMSwgd2FsbGV0XzEpLFxuICAgICAgICAgICAgc2V0RmVlVG9vKHdhbGxldF8xLCB3YWxsZXRfMSksXG4gICAgICAgICAgICAvLyBmZWVzXG4gICAgICAgICAgICB1cGRhdGVTd2FwRmVlKDEsIFs5OTgsIDEwMDBdLCB3YWxsZXRfMSksXG4gICAgICAgICAgICB1cGRhdGVQcm90b2NvbEZlZSgxLCBbOTk4LCAxMDAwXSwgd2FsbGV0XzEpLFxuICAgICAgICAgICAgdXBkYXRlU2hhcmVGZWUoMSwgWzk5OCwgMTAwMF0sIHdhbGxldF8xKVxuICAgICAgICBdKVxuXG4gICAgICAgIGJsb2NrLnJlY2VpcHRzLmZvckVhY2gociA9PiByLnJlc3VsdC5leHBlY3RFcnIoKS5leHBlY3RVaW50KGVycl9jaGVja19vd25lcikpXG4gICAgfVxufSlcblxuXG4vLyBUT0RPOiBtaW50IHBvc3Rjb25kaXRpb25cbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6ICdzZXR0ZXJzOiBmZWVzIGNhbiBvbmx5IGJlIHJlYXNvbmFibGUgdmFsdWVzJyxcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4pIHtcbiAgICAgICAgLy8gc2V0dXBcbiAgICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIGNyZWF0ZVRlc3RQYWlyKCksXG4gICAgICAgIF0pXG5cbiAgICAgICAgLy8gc3dhcCBmZWVcbiAgICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgdXBkYXRlU3dhcEZlZSgxLCBbOTk0LCAxXzAwMF0sIGRlcGxveWVyKSxcbiAgICAgICAgICAgIHVwZGF0ZVN3YXBGZWUoMSwgWzk5LCAxMDBdLCBkZXBsb3llciksXG4gICAgICAgICAgICB1cGRhdGVTd2FwRmVlKDEsIFs5LCAxMF0sIGRlcGxveWVyKSxcbiAgICAgICAgXSlcbiAgICAgICAgYmxvY2sucmVjZWlwdHMuZm9yRWFjaChyID0+IHIucmVzdWx0LmV4cGVjdEVycigpLmV4cGVjdFVpbnQoZXJyX2FudGlfcnVnKSlcblxuICAgICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICB1cGRhdGVTd2FwRmVlKDEsIFs5OTUsIDFfMDAwXSwgZGVwbG95ZXIpLFxuICAgICAgICAgICAgdXBkYXRlU3dhcEZlZSgxLCBbMTAwLCAxMDBdLCBkZXBsb3llciksXG4gICAgICAgICAgICB1cGRhdGVTd2FwRmVlKDEsIFs5Xzk5NSwgMTBfMDAwXSwgZGVwbG95ZXIpLFxuICAgICAgICBdKVxuICAgICAgICBibG9jay5yZWNlaXB0cy5mb3JFYWNoKHIgPT4gci5yZXN1bHQuZXhwZWN0T2soKSlcblxuICAgICAgICAvLyBOT1RFOiBubyBsaW1pdGF0aW9uIG9uIHByb3RvY29sL3NoYXJlXG4gICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIHVwZGF0ZVByb3RvY29sRmVlKDEsIFsxLCAwXSwgZGVwbG95ZXIpLFxuICAgICAgICAgICAgdXBkYXRlU2hhcmVGZWUoMSwgWzEsIDBdLCBkZXBsb3llcilcbiAgICAgICAgXSlcbiAgICAgICAgYmxvY2sucmVjZWlwdHMuZm9yRWFjaChyID0+IHIucmVzdWx0LmV4cGVjdE9rKCkpXG4gICAgfVxufSlcblxuLy8gPT09PT0gTWludFxuXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiAnbWludCBmYWlscyB3aGVuIHJlY2lwaWVudCBoYXMgaW5zdWZmaWNpZW50IGJhbGFuY2UnLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGxldCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuICAgICAgICBsZXQgd2FsbGV0XzIgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8yJykhLmFkZHJlc3NcbiAgICAgICAgd2FsbGV0XzEuZXhwZWN0UHJpbmNpcGFsKCdTVDFTSjNEVEU1RE43WDU0WURINUQ2NFIzQkNCNkEyQUcyWlE4WVBENScpXG4gICAgICAgIHdhbGxldF8yLmV4cGVjdFByaW5jaXBhbCgnU1QyQ1k1VjM5TkhEUFdTWE1XOVFEVDNIQzNHRDZRNlhYNENGUks5QUcnKVxuXG4gICAgICAgIGluaXRSZXZTaGFyZShjaGFpbilcblxuICAgICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgY3JlYXRlVGVzdFBhaXIoKSxcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdtaW50JywgW1xuICAgICAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3gpLFxuICAgICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl95KSxcbiAgICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwobHBfdG9rZW4pLFxuICAgICAgICAgICAgICAgIHR5cGVzLnVpbnQoMTApLFxuICAgICAgICAgICAgICAgIHR5cGVzLnVpbnQoMTApLFxuICAgICAgICAgICAgXSwgd2FsbGV0XzEpLFxuICAgICAgICBdKTtcblxuICAgICAgICBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCAyKVxuICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHRcbiAgICAgICAgICAuZXhwZWN0T2soKVxuICAgICAgICBibG9jay5yZWNlaXB0c1sxXS5yZXN1bHRcbiAgICAgICAgICAuZXhwZWN0RXJyKClcbiAgICAgICAgICAuZXhwZWN0VWludChlcnJfZnRfdHJhbnN0ZXIpXG4gICAgfSxcbn0pO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ21pbnQgZmFpbHMgb24gbm9uZXhpc3RhbnQgcGFpcicsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBsZXQgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3NcblxuICAgICAgLy8gc2V0dXBcbiAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgbWludFRva2VuKCd0b2tlbi14JywgMTAwMCwgd2FsbGV0XzEpLFxuICAgICAgICAgIG1pbnRUb2tlbigndG9rZW4teScsIDIwMDAsIHdhbGxldF8xKSxcbiAgICAgIF0pO1xuXG4gICAgICAvLyB0ZXN0XG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKCdjb3JlJywgJ21pbnQnLCBbXG4gICAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl94KSxcbiAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3kpLFxuICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwobHBfdG9rZW4pLFxuICAgICAgICAgICAgICB0eXBlcy51aW50KDEwKSxcbiAgICAgICAgICAgICAgdHlwZXMudWludCgxMCksXG4gICAgICAgICAgXSwgd2FsbGV0XzEpLFxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDApXG4gICAgfVxufSlcblxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogJ21pbnQ6IHBvc3Rjb25kaXRpb25zIChvdmVyZmxvdyBpbiBidXJuKScsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG4gICAgICAgIGxldCB3YWxsZXRfMiA9IGFjY291bnRzLmdldCgnd2FsbGV0XzInKSEuYWRkcmVzc1xuXG4gICAgICAgIC8vIHNldHVwXG4gICAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBtaW50VG9rZW4oJ3Rva2VuLXgnLCBuKDM4KSwgd2FsbGV0XzEpLFxuICAgICAgICAgICAgbWludFRva2VuKCd0b2tlbi15JywgbigzOCksIHdhbGxldF8xKSxcbiAgICAgICAgICAgIG1pbnRUb2tlbigndG9rZW4teCcsIG4oMzgpLCB3YWxsZXRfMiksXG4gICAgICAgICAgICBtaW50VG9rZW4oJ3Rva2VuLXknLCBuKDM4KSwgd2FsbGV0XzIpLFxuICAgICAgICAgICAgY3JlYXRlVGVzdFBhaXIoKSxcbiAgICAgICAgICAgIGRlcG9zaXRUZXN0UGFpcihuKDI4KSwgbigyOCksIHdhbGxldF8xKVxuICAgICAgICBdKTtcblxuICAgICAgICAvLyB0ZXN0XG4gICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIGRlcG9zaXRUZXN0UGFpcihuKDE4KSwgbigxOCksIHdhbGxldF8yKSxcbiAgICAgICAgICAgIGJ1cm4obigxOCksIHdhbGxldF8yKSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdE9rKCkuZXhwZWN0VHVwbGUoKS5saXF1aWRpdHkuZXhwZWN0VWludChuKDE4KSlcbiAgICAgICAgYmxvY2sucmVjZWlwdHNbMV0ucmVzdWx0LmV4cGVjdE9rKClcblxuICAgICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBkZXBvc2l0VGVzdFBhaXIobigxOSksIG4oMTkpLCB3YWxsZXRfMiksXG4gICAgICAgICAgICBidXJuKG4oMTkpLCB3YWxsZXRfMiksXG4gICAgICAgIF0pO1xuICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgICAgICBibG9jay5yZWNlaXB0c1sxXS5yZXN1bHQuZXhwZWN0T2soKVxuXG4gICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIGRlcG9zaXRUZXN0UGFpcihuKDE5KSwgbigxOSksIHdhbGxldF8yKSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgLy8gTk9URTogZXJyb3IgPT0gb3ZlcmZsb3cuLlxuICAgICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBkZXBvc2l0VGVzdFBhaXIobigyMCksIG4oMjApLCB3YWxsZXRfMiksXG4gICAgICAgIF0pO1xuICAgICAgICBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCAwKVxuICAgIH1cbn0pXG5cbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6ICdtaW50IG1pbnRzIGxwLXRva2VucyB0byBzZW5kZXIgJiB0cmFuc2ZlcnMgZGVwb3NpdCBhbW91bnRzJyxcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBsZXQgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3NcbiAgXG4gICAgICAgIC8vIHNldHVwXG4gICAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBtaW50VG9rZW4oJ3Rva2VuLXgnLCAxMDAwLCB3YWxsZXRfMSksXG4gICAgICAgICAgICBtaW50VG9rZW4oJ3Rva2VuLXknLCAyMDAwLCB3YWxsZXRfMSksXG4gICAgICAgICAgICBjcmVhdGVUZXN0UGFpcigpLFxuICAgICAgICBdKTsgIFxuXG4gICAgICAgIC8vIHRlc3RcbiAgICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKCdjb3JlJywgJ21pbnQnLCBbXG4gICAgICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW5feCksXG4gICAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3kpLFxuICAgICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChscF90b2tlbiksXG4gICAgICAgICAgICAgICAgdHlwZXMudWludCgxMCksXG4gICAgICAgICAgICAgICAgdHlwZXMudWludCgxMCksXG4gICAgICAgICAgXSwgd2FsbGV0XzEpLFxuICAgICAgICBdKTtcblxuICAgICAgICBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCAxKTtcbiAgICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0XG4gICAgICAgICAgICAuZXhwZWN0T2soKVxuICAgICAgICAgICAgLmV4cGVjdFR1cGxlKClcblxuICAgICAgICBibG9jay5yZWNlaXB0c1swXS5ldmVudHNcbiAgICAgICAgICAgIC5leHBlY3RGdW5naWJsZVRva2VuTWludEV2ZW50KDEwLCB3YWxsZXRfMSwgYCR7bHBfdG9rZW59OjpscC10b2tlbmApXG4gICAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLmV2ZW50c1xuICAgICAgICAgICAgLmV4cGVjdEZ1bmdpYmxlVG9rZW5UcmFuc2ZlckV2ZW50KDEwLCB3YWxsZXRfMSwgYCR7ZGVwbG95ZXJ9LmNvcmVgLCBgJHt0b2tlbl94fTo6dG9rZW4teGApXG4gICAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLmV2ZW50c1xuICAgICAgICAgICAgLmV4cGVjdEZ1bmdpYmxlVG9rZW5UcmFuc2ZlckV2ZW50KDEwLCB3YWxsZXRfMSwgYCR7ZGVwbG95ZXJ9LmNvcmVgLCBgJHt0b2tlbl95fTo6dG9rZW4teWApXG5cbiAgICAgICAgbGV0IGFzc2V0cyA9IGNoYWluLmdldEFzc2V0c01hcHMoKS5hc3NldHNcbiAgICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl94X2lkXVt3YWxsZXRfMV0sIDk5MClcbiAgICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl95X2lkXVt3YWxsZXRfMV0sIDE5OTApXG4gICAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feF9pZF1bY29yZV0sIDEwKVxuICAgICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW2NvcmVdLCAxMClcbiAgICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1tscF90b2tlbl9pZF1bd2FsbGV0XzFdLCAxMClcbiAgICB9XG59KTtcblxuXG4vLyA9PT09PSBCdXJuXG5cbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiAnYnVybiBmYWlscyBvbiBub24tZXhpc3RhbnQgcGFpcicsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBsZXQgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3NcblxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBUeC5jb250cmFjdENhbGwoJ2NvcmUnLCAnYnVybicsIFtcbiAgICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3gpLFxuICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW5feSksXG4gICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChscF90b2tlbiksXG4gICAgICAgICAgICAgIHR5cGVzLnVpbnQoMTAwKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMSlcbiAgICAgIF0pXG5cbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDApXG4gICAgICAvLyBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCAxKVxuICAgICAgLy8gYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpLmV4cGVjdEVycihlcnJfbm9fc3VjaF9wb29sKVxuICB9XG59KTtcblxuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ3dpdGhkcmF3IGZhaWxzIG9uIGxwLWJhbGFuY2UgPCBhbXQnLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG5cbiAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgbWludFRva2VuKHRva2VuX3gsIDUwLCB3YWxsZXRfMSksXG4gICAgICAgICAgbWludFRva2VuKHRva2VuX3ksIDUwLCB3YWxsZXRfMSksXG4gICAgICAgICAgbWludFRva2VuKGxwX3Rva2VuLCAxMDAsIHdhbGxldF8xKSxcbiAgICAgICAgICBjcmVhdGVUZXN0UGFpcigpLFxuICAgICAgXSlcblxuICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdidXJuJywgW1xuICAgICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW5feCksXG4gICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl95KSxcbiAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKGxwX3Rva2VuKSxcbiAgICAgICAgICAgICAgdHlwZXMudWludCgxMDApLFxuICAgICAgICAgIF0sIHdhbGxldF8xKVxuICAgICAgXSlcblxuICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgMSlcbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdXG4gICAgICAgICAgLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgICAgICAgIC5leHBlY3RVaW50KGVycl9idXJuX3ByZWNvbmRpdGlvbnMpXG4gIH1cbn0pO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ2J1cm4gZmFpbHMgb24gd3JvbmcgdG9rZW4gdHJhaXQnLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG5cbiAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgbWludFRva2VuKGxwX3Rva2VuLCAxMDAsIHdhbGxldF8xKSxcbiAgICAgICAgICBjcmVhdGVUZXN0UGFpcigpLFxuICAgICAgXSlcblxuICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdidXJuJywgW1xuICAgICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW5feSksXG4gICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl94KSxcbiAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKGxwX3Rva2VuKSxcbiAgICAgICAgICAgICAgdHlwZXMudWludCgxMDApLFxuICAgICAgICAgIF0sIHdhbGxldF8xKVxuICAgICAgXSlcblxuICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgMSlcbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdXG4gICAgICAgICAgLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgICAgICAgIC5leHBlY3RVaW50KGVycl9idXJuX3ByZWNvbmRpdGlvbnMpXG4gIH1cbn0pO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ2J1cm4gYnVybnMgbHAgYmFsYW5jZSA9PSBhbXQgZnJvbSBzZW5kZXIgJiBpbmNyZWFzZXMgdG9rZW4teC90b2tlbi15IGJhbGFuY2VzJyxcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGxldCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuXG4gICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCA1MCwgd2FsbGV0XzEpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl95LCA1MCwgd2FsbGV0XzEpLFxuICAgICAgICAgIGNyZWF0ZVRlc3RQYWlyKCksXG4gICAgICAgICAgZGVwb3NpdFRlc3RQYWlyKDEwLCAxMCwgd2FsbGV0XzEpLFxuICAgICAgXSlcblxuICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgNClcbiAgICAgIGJsb2NrLnJlY2VpcHRzLm1hcChyID0+IHIucmVzdWx0LmV4cGVjdE9rKCkpXG5cbiAgICAgIGxldCBhc3NldHMgPSBjaGFpbi5nZXRBc3NldHNNYXBzKCkuYXNzZXRzXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3hfaWRdW3dhbGxldF8xXSwgNDApXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW3dhbGxldF8xXSwgNDApXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW2xwX3Rva2VuX2lkXVt3YWxsZXRfMV0sIDEwKVxuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl94X2lkXVtjb3JlXSwgMTApXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW2NvcmVdLCAxMClcblxuICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdidXJuJywgW1xuICAgICAgICAgICAgICB0eXBlcy51aW50KDEpLFxuICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwodG9rZW5feCksXG4gICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl95KSxcbiAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKGxwX3Rva2VuKSxcbiAgICAgICAgICAgICAgdHlwZXMudWludCgyKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMSlcbiAgICAgIF0pXG5cbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDEpXG4gICAgICBibG9jay5yZWNlaXB0c1swXVxuICAgICAgICAgIC5yZXN1bHQuZXhwZWN0T2soKVxuXG4gICAgICBhc3NldHMgPSBjaGFpbi5nZXRBc3NldHNNYXBzKCkuYXNzZXRzXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3hfaWRdW3dhbGxldF8xXSwgNDIpXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW3dhbGxldF8xXSwgNDIpXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3hfaWRdW2NvcmVdLCA4KVxuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl95X2lkXVtjb3JlXSwgOClcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbbHBfdG9rZW5faWRdW3dhbGxldF8xXSwgOClcbiAgICB9XG59KTtcblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6ICdidXJuIHdpdGhkcmF3cyBsYXN0IG9mIHJlc2VydmVzJyxcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGxldCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuXG4gICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCA1MCwgd2FsbGV0XzEpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl95LCA1MCwgd2FsbGV0XzEpLFxuICAgICAgICAgIGNyZWF0ZVRlc3RQYWlyKCksXG4gICAgICAgICAgZGVwb3NpdFRlc3RQYWlyKDEwLCAxMCwgd2FsbGV0XzEpLFxuICAgICAgXSlcblxuICAgICAgbGV0IGFzc2V0cyA9IGNoYWluLmdldEFzc2V0c01hcHMoKS5hc3NldHNcbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDQpXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW2xwX3Rva2VuX2lkXVt3YWxsZXRfMV0sIDEwKVxuXG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIGJ1cm4oMTAsIHdhbGxldF8xKSxcbiAgICAgIF0pXG5cbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDEpXG4gICAgICBibG9jay5yZWNlaXB0c1swXVxuICAgICAgICAgIC5yZXN1bHQuZXhwZWN0T2soKVxuXG4gICAgICBhc3NldHMgPSBjaGFpbi5nZXRBc3NldHNNYXBzKCkuYXNzZXRzXG5cbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feF9pZF1bd2FsbGV0XzFdLCA1MClcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feV9pZF1bd2FsbGV0XzFdLCA1MClcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feF9pZF1bY29yZV0sIDApXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW2NvcmVdLCAwKVxuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1tscF90b2tlbl9pZF1bd2FsbGV0XzFdLCAwKVxuICAgIH1cbn0pO1xuXG5jb25zdCBuID0gKHplcm9zKSA9PiBgMSR7JzAnLnJlcGVhdCh6ZXJvcyl9YFxuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ2J1cm4gd2l0aCBsYXJnZSByZXNlcnZlcyB3b3Jrcy4uLicsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBsZXQgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3NcbiAgICAgIGxldCB3YWxsZXRfMiA9IGFjY291bnRzLmdldCgnd2FsbGV0XzInKSEuYWRkcmVzc1xuXG4gICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCBuKDM3KSwgd2FsbGV0XzEpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl95LCBuKDM3KSwgd2FsbGV0XzEpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCBuKDM3KSwgd2FsbGV0XzIpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl95LCBuKDM3KSwgd2FsbGV0XzIpLFxuICAgICAgICAgIGNyZWF0ZVRlc3RQYWlyKCksXG4gICAgICBdKVxuXG4gICAgICAvLyBsYXJnZSBkZXBvc2l0cyAoYW10MCAqIGFtdDEgb24gZmlyc3QgbWludClcbiAgICAgIGxldCB0ZXN0cyA9IFtuKDIxKSwgbigxOCldXG4gICAgICBcbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFxuICAgICAgICB0ZXN0cy5tYXAodiA9PiBkZXBvc2l0VGVzdFBhaXIodiwgdiwgd2FsbGV0XzEpKVxuICAgICAgKVxuXG4gICAgICAvLyBsZXQgYXNzZXRzID0gY2hhaW4uZ2V0QXNzZXRzTWFwcygpLmFzc2V0cyAvLyBOT1RFOiBjcmFzaGVzIGhlcmVcbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDEpXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuXG4gICAgICAvLyBiaWcgc3dhcC4uLlxuICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBzd2FwWFkobigxOCksIDEsIHdhbGxldF8xKSxcbiAgICAgIF0pXG5cbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDEpXG5cbiAgICAgIGxldCBwYWlyID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oJ2NvcmUnLCAnZ2V0LXBvb2wnLCBbdHlwZXMudWludCgxKV0sIGRlcGxveWVyKVxuICAgICAgICAgIC5yZXN1bHQuZXhwZWN0U29tZSgpXG5cbiAgICAgIC8vIDJuZCBkZXBvc2l0IChtYXgoYW10MCAqIHRvdGFsU3VwcGx5LCBhbXQxICogdG90YWxTdXBwbHkpKVxuICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBkZXBvc2l0VGVzdFBhaXIobigxOCksIG4oMTgpLCB3YWxsZXRfMiksXG4gICAgICBdKVxuICAgICAgXG4gICAgICBwYWlyID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oJ2NvcmUnLCAnZ2V0LXBvb2wnLCBbdHlwZXMudWludCgxKV0sIGRlcGxveWVyKVxuICAgICAgICAucmVzdWx0LmV4cGVjdFNvbWUoKVxuXG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgZGVwb3NpdFRlc3RQYWlyKG4oMTgpLCBuKDE4KSwgd2FsbGV0XzIpLFxuICAgICAgXSkgICAgICBcbiAgICB9XG59KTtcblxuLy8gPT09PT09IFN3YXBcblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6ICdzd2FwOiAuLi4nLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG4gICAgICBsZXQgd2FsbGV0XzIgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8yJykhLmFkZHJlc3NcblxuICAgICAgaW5pdFJldlNoYXJlKGNoYWluKVxuXG4gICAgICAvLyBzZXR1cFxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBtaW50VG9rZW4odG9rZW5feCwgMTBfMDAwLCB3YWxsZXRfMSksXG4gICAgICAgICAgbWludFRva2VuKHRva2VuX3ksIDEwXzAwMCwgd2FsbGV0XzEpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCAxMF8wMDAsIHdhbGxldF8yKSxcbiAgICAgICAgICBjcmVhdGVUZXN0UGFpcigpLFxuICAgICAgICAgIGRlcG9zaXRUZXN0UGFpcigxMF8wMDAsIDEwXzAwMCwgd2FsbGV0XzEpLFxuICAgICAgICBdKVxuXG4gICAgICBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCA1KVxuXG4gICAgICAvLyBmYWlsXG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKCdjb3JlJywgJ3N3YXAnLCBbXG4gICAgICAgICAgICAgIHR5cGVzLnVpbnQoMSksXG4gICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl94KSxcbiAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3kpLFxuICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwocmV2X3RvbyksXG4gICAgICAgICAgICAgIHR5cGVzLnVpbnQoMV8wMDApLFxuICAgICAgICAgICAgICB0eXBlcy51aW50KDFfMDAwKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMilcbiAgICAgIF0pXG5cbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDEpXG4gICAgICBibG9jay5yZWNlaXB0c1swXVxuICAgICAgICAgIC5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICAgICAgICAuZXhwZWN0VWludChlcnJfc3dhcF9wb3N0Y29uZGl0aW9ucylcblxuICAgICAgLy8gYmFsYW5jZXMgc3RpbGwgdGhlIHNhbWVcbiAgICAgIGxldCBwYWlyID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oJ2NvcmUnLCAnZ2V0LXBvb2wnLCBbdHlwZXMudWludCgxKV0sIGRlcGxveWVyKVxuICAgICAgbGV0IHJlcyA9IHBhaXIucmVzdWx0LmV4cGVjdFNvbWUoKS5leHBlY3RUdXBsZSgpXG4gICAgICByZXNbJ3Jlc2VydmUwJ10uZXhwZWN0VWludCgxMF8wMDApXG4gICAgICByZXNbJ3Jlc2VydmUxJ10uZXhwZWN0VWludCgxMF8wMDApXG5cbiAgICAgIC8vIHN1Y2NjZXNzXG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnY29yZScsICdzd2FwJywgW1xuICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl94KSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbCh0b2tlbl95KSxcbiAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChyZXZfdG9vKSxcbiAgICAgICAgICAgIHR5cGVzLnVpbnQoMV8wMDApLFxuICAgICAgICAgICAgdHlwZXMudWludCg5MDApLFxuICAgICAgICBdLCB3YWxsZXRfMilcbiAgICAgIF0pXG5cbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDEpXG4gICAgICByZXMgPSBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKS5leHBlY3RUdXBsZSgpXG4gICAgICByZXNbJ2FtdC1pbiddLmV4cGVjdFVpbnQoMV8wMDApXG4gICAgICByZXNbJ2FtdC1mZWUtbHBzJ10uZXhwZWN0VWludCgzKVxuICAgICAgcmVzWydhbXQtaW4tYWRqdXN0ZWQnXS5leHBlY3RVaW50KDk5NylcbiAgICAgIHJlc1snYW10LW91dCddLmV4cGVjdFVpbnQoOTAwKVxuXG4gICAgICBwYWlyID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oJ2NvcmUnLCAnZ2V0LXBvb2wnLCBbdHlwZXMudWludCgxKV0sIGRlcGxveWVyKVxuICAgICAgICAgIC5yZXN1bHQuZXhwZWN0U29tZSgpLmV4cGVjdFR1cGxlKClcbiAgICAgIHBhaXIucmVzZXJ2ZTAuZXhwZWN0VWludCgxMV8wMDApXG4gICAgICBwYWlyLnJlc2VydmUxLmV4cGVjdFVpbnQoOV8xMDApXG5cbiAgICAgIGxldCBhc3NldHMgPSBjaGFpbi5nZXRBc3NldHNNYXBzKCkuYXNzZXRzXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3hfaWRdW3dhbGxldF8yXSwgOV8wMDApXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW3dhbGxldF8yXSwgOTAwKVxuXG4gICAgICAvLyBjb3JlIGJhbGFuY2VzID09IHJlc2VydmVzXG4gICAgICAvLyBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3hfaWRdW2NvcmVdLCByMClcbiAgICAgIC8vIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feV9pZF1bY29yZV0sIHIxKVxuICB9XG59KTtcblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6ICdzd2FwIHggZm9yIHdzdHgnLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG4gICAgICBsZXQgd2FsbGV0XzIgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8yJykhLmFkZHJlc3NcbiAgICAgIGNvbnN0IGluaXRpYWxTVFggPSAxMCoqMTRcblxuICAgICAgLy8gc2V0dXBcbiAgICAgIGluaXRSZXZTaGFyZShjaGFpbilcblxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBtaW50VG9rZW4odG9rZW5feCwgMTBfMDAwLCB3YWxsZXRfMSksXG4gICAgICAgICAgbWludFRva2VuKHRva2VuX3gsIDEwXzAwMCwgd2FsbGV0XzIpLFxuICAgICAgICAgIGNyZWF0ZVdTVFhQYWlyKCksXG4gICAgICAgICAgZGVwb3NpdFdTVFhQYWlyKDEwXzAwMCwgMTBfMDAwLCB3YWxsZXRfMSksXG4gICAgICBdKVxuXG4gICAgICBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCA0KVxuXG4gICAgICBsZXQgYXNzZXRzID0gY2hhaW4uZ2V0QXNzZXRzTWFwcygpLmFzc2V0c1xuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl94X2lkXVt3YWxsZXRfMV0sIDApXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3hfaWRdW3dhbGxldF8yXSwgMTBfMDAwKVxuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl94X2lkXVtjb3JlXSwgMTBfMDAwKVxuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1snU1RYJ11bd2FsbGV0XzFdLCBpbml0aWFsU1RYIC0gMTBfMDAwKVxuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1snU1RYJ11bY29yZV0sIDEwXzAwMClcbiAgICBcbiAgICAgIC8vIHRlc3RcbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBUeC5jb250cmFjdENhbGwoJ2NvcmUnLCAnc3dhcCcsIFtcbiAgICAgICAgICAgICAgdHlwZXMudWludCgxKSxcbiAgICAgICAgICAgICAgdHlwZXMucHJpbmNpcGFsKHRva2VuX3gpLFxuICAgICAgICAgICAgICB0eXBlcy5wcmluY2lwYWwod3N0eCksXG4gICAgICAgICAgICAgIHR5cGVzLnByaW5jaXBhbChyZXZfdG9vKSxcbiAgICAgICAgICAgICAgdHlwZXMudWludCgxXzAwMCksXG4gICAgICAgICAgICAgIHR5cGVzLnVpbnQoOTAwKSxcbiAgICAgICAgICBdLCB3YWxsZXRfMilcbiAgICAgIF0pXG5cbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDEpXG4gICAgICBsZXQgcmVzID0gYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdE9rKCkuZXhwZWN0VHVwbGUoKVxuICAgICAgcmVzWydhbXQtaW4nXS5leHBlY3RVaW50KDFfMDAwKVxuICAgICAgcmVzWydhbXQtb3V0J10uZXhwZWN0VWludCg5MDApXG5cbiAgICAgIGFzc2V0cyA9IGNoYWluLmdldEFzc2V0c01hcHMoKS5hc3NldHNcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feF9pZF1bd2FsbGV0XzJdLCA5XzAwMClcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feF9pZF1bY29yZV0sIDExXzAwMClcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbJ1NUWCddW3dhbGxldF8yXSwgaW5pdGlhbFNUWCArIDkwMClcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbJ1NUWCddW2NvcmVdLCA5XzEwMClcbiAgfVxufSk7XG5cblxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6ICdzd2FwIDogbGFyZ2Ugc3dhcCBlbXB0aWVzIHJlc2VydmUsIHVzZXIgY2FuIHN0aWxsIGJ1cm4nLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG4gICAgICBsZXQgd2FsbGV0XzIgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8yJykhLmFkZHJlc3NcblxuICAgICAgaW5pdFJldlNoYXJlKGNoYWluKVxuXG4gICAgICBsZXQgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCA1MCwgd2FsbGV0XzEpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCA1MCwgd2FsbGV0XzIpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl95LCA1MCwgd2FsbGV0XzEpLFxuICAgICAgICAgIGNyZWF0ZVRlc3RQYWlyKCksXG4gICAgICAgICAgZGVwb3NpdFRlc3RQYWlyKDEwLCAxMCwgd2FsbGV0XzEpLFxuICAgICAgICAgIHN3YXBYWSg1MCwgMSwgd2FsbGV0XzIpLFxuICAgICAgXSlcblxuICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgNilcbiAgICAgIGJsb2NrLnJlY2VpcHRzLm1hcChyID0+IHIucmVzdWx0LmV4cGVjdE9rKCkpXG4gICAgICBsZXQgYXNzZXRzID0gY2hhaW4uZ2V0QXNzZXRzTWFwcygpLmFzc2V0c1xuXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW2xwX3Rva2VuX2lkXVt3YWxsZXRfMV0sIDEwKVxuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl94X2lkXVt3YWxsZXRfMl0sIDApXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW3dhbGxldF8yXSwgMSlcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feF9pZF1bY29yZV0sIDYwKSAvLyArIDUwXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW2NvcmVdLCA5KSAgLy8gLSAxXG5cbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgYnVybigxMCwgd2FsbGV0XzEpLFxuICAgICAgXSlcblxuICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgMSlcbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RPaygpXG5cbiAgICAgIGFzc2V0cyA9IGNoYWluLmdldEFzc2V0c01hcHMoKS5hc3NldHNcblxuICAgICAgLy8gVE9ETzogdXNlZCB0byBnZXQgOTkgdG9rZW4teCBhbmQgb25lIGxlZnQgaW4gY29yZT9cbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbdG9rZW5feF9pZF1bd2FsbGV0XzFdLCAxMDApXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW3dhbGxldF8xXSwgNDkpXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3hfaWRdW2NvcmVdLCAwKVxuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl95X2lkXVtjb3JlXSwgMClcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbbHBfdG9rZW5faWRdW3dhbGxldF8xXSwgMClcblxuICAgICAgLy8gVE9ETzogdW5kZXJmbG93LCB3b3VsZCBiZSBuaWNlIHdpdGggYSBwcm9wZXIgZXJyb3IgaW5zdGVhZFxuICAgICAgLy8gYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgLy8gICBzd2FwWFkoNTAsIDEsIHdhbGxldF8xKSxcbiAgICAgIC8vIF0pXG5cbiAgICAgIC8vIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgIH1cbn0pO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ2NvbGxlY3QgOiBvd25lciBjYW4gY29sbGVjdCBmZWVzJyxcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGxldCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuICAgICAgbGV0IHdhbGxldF8yID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMicpIS5hZGRyZXNzXG5cbiAgICAgIGluaXRSZXZTaGFyZShjaGFpbilcblxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBtaW50VG9rZW4odG9rZW5feCwgMTBfMDAwXzAwMCwgd2FsbGV0XzEpLFxuICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCAxMF8wMDBfMDAwLCB3YWxsZXRfMiksXG4gICAgICAgICAgbWludFRva2VuKHRva2VuX3ksIDEwXzAwMF8wMDAsIHdhbGxldF8xKSxcbiAgICAgICAgICBjcmVhdGVUZXN0UGFpcldpdGhQcm90b2NvbEZlZShbMzAsIDFfMDAwXSksXG4gICAgICAgICAgZGVwb3NpdFRlc3RQYWlyKDEwXzAwMF8wMDAsIDEwXzAwMF8wMDAsIHdhbGxldF8xKSxcbiAgICAgICAgICBzd2FwWFkoMTAwXzAwMCwgOThfNzEwLCB3YWxsZXRfMiksXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0cy5tYXAociA9PiByLnJlc3VsdC5leHBlY3RPaygpKVxuICAgICAgbGV0IGFzc2V0cyA9IGNoYWluLmdldEFzc2V0c01hcHMoKS5hc3NldHNcbiAgICAgIGFzc2VydEVxdWFscyhibG9jay5yZWNlaXB0cy5sZW5ndGgsIDYpXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW3dhbGxldF8yXSwgOThfNzEwKVxuICAgICAgbGV0IHBhaXIgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbignY29yZScsICdnZXQtcG9vbCcsIFt0eXBlcy51aW50KDEpXSwgZGVwbG95ZXIpXG4gICAgICAgICAgLnJlc3VsdC5leHBlY3RTb21lKCkuZXhwZWN0VHVwbGUoKVxuXG4gICAgICBsZXQgcmV2ZW51ZSA9IGdldFJldmVudWUoY2hhaW4sIDEpXG4gICAgICByZXZlbnVlLnRva2VuMC5leHBlY3RVaW50KDkpXG4gICAgICByZXZlbnVlLnRva2VuMS5leHBlY3RVaW50KDApXG4gICAgICBwYWlyLnJlc2VydmUwLmV4cGVjdFVpbnQoMTBfMDAwXzAwMCArIDEwMF8wMDAgLSA5KVxuICAgICAgcGFpci5yZXNlcnZlMS5leHBlY3RVaW50KDEwXzAwMF8wMDAgLSA5OF83MTApXG5cbiAgICAgIC8vIG9ubHkgb25lIHRva2VuIGZhaWxzXG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIGNvbGxlY3QoKSxcbiAgICAgIF0pXG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoZXJyX2NvbGxlY3RfcHJlY29uZGl0aW9ucylcblxuICAgICAgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBzd2FwWVgoNTBfMDAwLCA0MF8wMDAsIHdhbGxldF8yKSxcbiAgICAgICAgY29sbGVjdCgpLFxuICAgICAgXSlcblxuICAgICAgYXNzZXRzID0gY2hhaW4uZ2V0QXNzZXRzTWFwcygpLmFzc2V0c1xuICAgICAgYXNzZXJ0RXF1YWxzKGFzc2V0c1t0b2tlbl94X2lkXVtkZXBsb3llcl0sIDkpXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW3Rva2VuX3lfaWRdW2RlcGxveWVyXSwgNClcblxuICAgICAgcmV2ZW51ZSA9IGdldFJldmVudWUoY2hhaW4sIDEpXG4gICAgICByZXZlbnVlLnRva2VuMC5leHBlY3RVaW50KDApXG4gICAgICByZXZlbnVlLnRva2VuMS5leHBlY3RVaW50KDApXG4gICAgfVxufSk7XG5cbi8vID09PT09PT09PT0gbWludC9idXJuIG1heCByZXNlcnZlc1xuXG4vLyBjYWxjLW1pbnQ6IGFtdC0wICogYW10LTFcbi8vIHRoZW46IHIwL3IxICogc3VwcGx5XG5cbi8vIENsYXJpbmV0LnRlc3Qoe1xuLy8gICAgIG5hbWU6ICdtaW50IDogbWF4IHVudGlsIG93ZXJmbG93Jyxcbi8vICAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuLy8gICAgICAgICBsZXQgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8xJykhLmFkZHJlc3Ncbi8vICAgICAgICAgbGV0IHdhbGxldF8yID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMicpIS5hZGRyZXNzXG5cbi8vICAgICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbi8vICAgICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl94LCBuKDM0KSwgd2FsbGV0XzEpLFxuLy8gICAgICAgICAgICAgbWludFRva2VuKHRva2VuX3gsIG4oMzQpLCB3YWxsZXRfMiksXG4vLyAgICAgICAgICAgICBtaW50VG9rZW4odG9rZW5feSwgbigzNCksIHdhbGxldF8xKSxcbi8vICAgICAgICAgICAgIG1pbnRUb2tlbih0b2tlbl95LCBuKDM0KSwgd2FsbGV0XzIpLFxuLy8gICAgICAgICAgICAgY3JlYXRlVGVzdFBhaXIoKSxcbi8vICAgICAgICAgICAgIC8vIGFtdC0wICogYW10LTFcbi8vICAgICAgICAgICAgIGRlcG9zaXRUZXN0UGFpcihuKDE5KSwgbigxOSksIHdhbGxldF8xKSxcbi8vICAgICAgICAgXSlcblxuLy8gICAgICAgICBjb25zb2xlLmxvZyhibG9jaylcbi8vICAgICAgICAgYXNzZXJ0RXF1YWxzKGJsb2NrLnJlY2VpcHRzLmxlbmd0aCwgNilcbiAgICAgICAgXG4vLyAgICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbi8vICAgICAgICAgICAgIC8vIGFtdC0wLzEgKiB0b3RhbC1zdXBwbHlcbi8vICAgICAgICAgICAgIGRlcG9zaXRUZXN0UGFpcihkKDksIDE5KSwgZCg5LCAxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgICAgIGRlcG9zaXRUZXN0UGFpcihkKDksIDE5KSwgZCg5LCAxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgICAgIGRlcG9zaXRUZXN0UGFpcihkKDksIDE5KSwgZCg5LCAxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgICAgIC8vIGRlcG9zaXRUZXN0UGFpcihuKDE5KSwgbigxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgICAgIC8vIGRlcG9zaXRUZXN0UGFpcihuKDE5KSwgbigxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgICAgIC8vIGRlcG9zaXRUZXN0UGFpcihuKDE5KSwgbigxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgICAgIC8vIGRlcG9zaXRUZXN0UGFpcihuKDE5KSwgbigxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgICAgIC8vIGRlcG9zaXRUZXN0UGFpcihuKDE5KSwgbigxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgICAgIC8vIGRlcG9zaXRUZXN0UGFpcihuKDE5KSwgbigxOSksIHdhbGxldF8yKSxcbi8vICAgICAgICAgXSlcblxuLy8gICAgICAgICAvLyBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCAwKVxuLy8gICAgICAgICAvLyBjb25zb2xlLmxvZyhibG9jaylcbi8vICAgICAgICAgbGV0IHBvb2wgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbignY29yZScsICdnZXQtcG9vbCcsIFt0eXBlcy51aW50KDEpXSwgZGVwbG95ZXIpLnJlc3VsdC5leHBlY3RTb21lKCkuZXhwZWN0VHVwbGUoKVxuLy8gICAgICAgICAvLyByZXNlcnZlczogNCoxMF4xOSB1NDAwMDAwMDAwMDAwMDAwMDAwMDBcbi8vICAgICAgICAgY29uc29sZS5sb2cocG9vbClcbi8vICAgICB9XG4vLyB9KVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLFNBQVMsUUFBUSxFQUFFLEVBQUUsRUFBNEIsS0FBSyxRQUFRLDhDQUE4QyxDQUFDO0FBQzdHLFNBQVMsWUFBWSxRQUFRLGlEQUFpRCxDQUFDO0FBQy9FLFNBQVMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxTQUFTLFFBQVEsZUFBZSxDQUFBO0FBQzlGLFNBQ0UsU0FBUyxFQUNULGNBQWMsRUFDZCxjQUFjLEVBQ2QsZUFBZSxFQUNmLGVBQWUsRUFDZiw2QkFBNkIsRUFDN0IsWUFBWSxFQUNaLEdBQUcsUUFDRSxXQUFXLENBQUM7QUFJbkIsTUFBTSxRQUFRLEdBQXFCLEdBQUc7QUFDdEMsTUFBTSxlQUFlLEdBQWMsR0FBRztBQUN0QyxNQUFNLGdCQUFnQixHQUFhLEdBQUc7QUFDdEMsTUFBTSx3QkFBd0IsR0FBSyxHQUFHO0FBQ3RDLE1BQU0seUJBQXlCLEdBQUksR0FBRztBQUN0QyxNQUFNLHNCQUFzQixHQUFPLEdBQUc7QUFDdEMsTUFBTSx1QkFBdUIsR0FBTSxHQUFHO0FBQ3RDLE1BQU0sc0JBQXNCLEdBQU8sR0FBRztBQUN0QyxNQUFNLHNCQUFzQixHQUFPLEdBQUc7QUFDdEMsTUFBTSxzQkFBc0IsR0FBTyxHQUFHO0FBQ3RDLE1BQU0sdUJBQXVCLEdBQU0sR0FBRztBQUN0QyxNQUFNLHlCQUF5QixHQUFJLEdBQUc7QUFDdEMsTUFBTSwwQkFBMEIsR0FBRyxHQUFHO0FBQ3RDLE1BQU0sWUFBWSxHQUFpQixHQUFHO0FBRXRDLE1BQU0sZUFBZSxHQUFjLENBQUM7QUFFcEMsTUFBTSxFQUNKLElBQUksQ0FBQSxFQUNKLE9BQU8sQ0FBQSxFQUNQLE9BQU8sQ0FBQSxFQUNQLE9BQU8sQ0FBQSxFQUNQLFFBQVEsQ0FBQSxFQUNSLGVBQWUsQ0FBQSxFQUNmLElBQUksQ0FBQSxFQUNKLE9BQU8sQ0FBQSxJQUNSLEdBQUcsU0FBUztBQUViLE1BQU0sRUFDSixVQUFVLENBQUEsRUFDVixVQUFVLENBQUEsRUFDVixXQUFXLENBQUEsRUFDWixHQUFHLE1BQU07QUFFVixVQUFVO0FBQ1YsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFhLEVBQUUsTUFBYyxHQUM3QyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUU7UUFDbkMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7S0FDdkIsRUFBRSxNQUFNLENBQUM7QUFFWixNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQWMsRUFBRSxNQUFjLEdBQy9DLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRTtRQUNwQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztLQUN4QixFQUFFLE1BQU0sQ0FBQztBQUVaLE1BQU0sV0FBVyxHQUFHLENBQUMsUUFBZ0IsRUFBRSxNQUFjLEdBQ25ELEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRTtRQUN2QyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztLQUMxQixFQUFFLE1BQU0sQ0FBQztBQUVaLE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBWSxFQUFFLElBQWMsRUFBRSxNQUFjLEdBQ2pFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFO1FBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCLEVBQUUsTUFBTSxDQUFDO0FBRVosTUFBTSxpQkFBaUIsR0FBRyxDQUFDLElBQVksRUFBRSxJQUFjLEVBQUUsTUFBYyxHQUNyRSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsRUFBRTtRQUM3QyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0QixFQUFFLE1BQU0sQ0FBQztBQUVaLE1BQU0sY0FBYyxHQUFHLENBQUMsSUFBWSxFQUFFLElBQWMsRUFBRSxNQUFjLEdBQ2xFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFO1FBQzFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3RCLEVBQUUsTUFBTSxDQUFDO0FBRVosWUFBWTtBQUNaLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBWSxFQUFFLElBQVksR0FDMUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUU7UUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztLQUFDLEVBQUUsUUFBUSxDQUFDLENBQ3JFLE1BQU0sQ0FBQyxXQUFXLEVBQUU7QUFFL0IsU0FBUztBQUNULE9BQU8sTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFVLEVBQUUsTUFBVyxFQUFFLElBQVksR0FDMUQsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO1FBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDckIsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUVSLE9BQU8sTUFBTSxNQUFNLEdBQUcsQ0FBQyxLQUFVLEVBQUUsTUFBVyxFQUFFLElBQVksR0FDMUQsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO1FBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDckIsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUVSLE9BQU8sTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFTLEVBQUUsSUFBUyxFQUFFLElBQVksR0FDckQsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO1FBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDbkIsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUVSLE9BQU8sTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFRLEVBQUUsSUFBWSxHQUN6QyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7UUFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDYixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNsQixFQUFFLElBQUksQ0FBQyxDQUFBO0FBRVIsT0FBTyxNQUFNLE9BQU8sR0FBRyxJQUNyQixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUU7UUFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDYixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztLQUMzQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBRWQsV0FBVztBQUVYLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsMEJBQTBCO0lBQ2hDLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUVoRCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQztRQUMzRSxhQUFhLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7S0FDN0M7Q0FDTixDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLDJCQUEyQjtJQUNqQyxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFFaEQsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUVuQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtnQkFDaEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDekIsUUFBUTtnQkFDUixZQUFZO2dCQUNaLFNBQVM7YUFDVixFQUFFLFFBQVEsQ0FBQztTQUNiLENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FDckIsU0FBUyxFQUFFLENBQ1gsVUFBVSxDQUFDLGVBQWUsQ0FBQztLQUMvQjtDQUNKLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsZ0NBQWdDO0lBQ3RDLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUVoRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtnQkFDaEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDekIsUUFBUTtnQkFDUixZQUFZO2dCQUNaLFNBQVM7YUFDVixFQUFFLFFBQVEsQ0FBQztTQUNiLENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FDbkIsU0FBUyxFQUFFLENBQ1gsVUFBVSxDQUFDLHdCQUF3QixDQUFDO0tBQzFDO0NBQ0osQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxtQ0FBbUM7SUFDekMsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBQ2hELFlBQVksQ0FBQyxLQUFLLENBQUM7UUFFbkIsUUFBUTtRQUNSLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDMUIsY0FBYyxFQUFFO1NBQ2pCLENBQUM7UUFFRixPQUFPO1FBQ1AsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDdEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO2dCQUNoQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2dCQUN6QixRQUFRO2dCQUNSLFlBQVk7Z0JBQ1osU0FBUzthQUNWLEVBQUUsUUFBUSxDQUFDO1NBQ2IsQ0FBQztRQUVGLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUNuQixTQUFTLEVBQUUsQ0FDWCxVQUFVLENBQUMsd0JBQXdCLENBQUM7S0FDMUM7Q0FDSixDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLDhCQUE4QjtJQUNwQyxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFFaEQsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUVuQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtnQkFDaEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQztnQkFDaEMsUUFBUTtnQkFDUixZQUFZO2dCQUNaLFNBQVM7YUFDVixFQUFFLFFBQVEsQ0FBQztTQUNiLENBQUM7UUFFRixZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZDO0NBQ0osQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxxREFBcUQ7SUFDM0QsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBRWhELFlBQVksQ0FBQyxLQUFLLENBQUM7UUFFbkIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUMxQixjQUFjLEVBQUU7U0FDakIsQ0FBQztRQUVGLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRWxDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRS9CLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRTtZQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1lBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUN0RyxNQUFNLENBQ04sVUFBVSxFQUFFLENBQ1osVUFBVSxDQUFDLENBQUMsQ0FBQztRQUVsQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7WUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUFDLEVBQUUsUUFBUSxDQUFDLENBQ3pFLE1BQU0sQ0FDTixVQUFVLEVBQUUsQ0FDWixXQUFXLEVBQUU7UUFFbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7UUFFakMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFO1lBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7WUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUFDLEVBQUUsUUFBUSxDQUFDLENBQ2xILE1BQU0sQ0FDTixVQUFVLEVBQUUsQ0FDWixXQUFXLEVBQUU7UUFFbEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDbEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFDOUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFDOUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7UUFDakUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDckQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7S0FDdEQ7Q0FDSixDQUFDLENBQUM7QUFFSCxnQkFBZ0I7QUFFaEIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNWLElBQUksRUFBRSxzQ0FBc0M7SUFDNUMsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBRWhELFFBQVE7UUFDUixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3hCLGNBQWMsRUFBRTtTQUNuQixDQUFDO1FBRUYsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEIsWUFBWTtZQUNaLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1lBQzVCLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1lBQy9CLFNBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO1lBQzdCLE9BQU87WUFDUCxhQUFhLENBQUMsQ0FBQyxFQUFFO0FBQUMsbUJBQUc7QUFBRSxvQkFBSTthQUFDLEVBQUUsUUFBUSxDQUFDO1lBQ3ZDLGlCQUFpQixDQUFDLENBQUMsRUFBRTtBQUFDLG1CQUFHO0FBQUUsb0JBQUk7YUFBQyxFQUFFLFFBQVEsQ0FBQztZQUMzQyxjQUFjLENBQUMsQ0FBQyxFQUFFO0FBQUMsbUJBQUc7QUFBRSxvQkFBSTthQUFDLEVBQUUsUUFBUSxDQUFDO1NBQzNDLENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUNoRjtDQUNKLENBQUM7QUFHRiwyQkFBMkI7QUFDM0IsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNWLElBQUksRUFBRSw2Q0FBNkM7SUFDbkQsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFO1FBQ25CLFFBQVE7UUFDUixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3hCLGNBQWMsRUFBRTtTQUNuQixDQUFDO1FBRUYsV0FBVztRQUNYLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3BCLGFBQWEsQ0FBQyxDQUFDLEVBQUU7QUFBQyxtQkFBRztBQUFFLHFCQUFLO2FBQUMsRUFBRSxRQUFRLENBQUM7WUFDeEMsYUFBYSxDQUFDLENBQUMsRUFBRTtBQUFDLGtCQUFFO0FBQUUsbUJBQUc7YUFBQyxFQUFFLFFBQVEsQ0FBQztZQUNyQyxhQUFhLENBQUMsQ0FBQyxFQUFFO0FBQUMsaUJBQUM7QUFBRSxrQkFBRTthQUFDLEVBQUUsUUFBUSxDQUFDO1NBQ3RDLENBQUM7UUFDRixLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUxRSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNwQixhQUFhLENBQUMsQ0FBQyxFQUFFO0FBQUMsbUJBQUc7QUFBRSxxQkFBSzthQUFDLEVBQUUsUUFBUSxDQUFDO1lBQ3hDLGFBQWEsQ0FBQyxDQUFDLEVBQUU7QUFBQyxtQkFBRztBQUFFLG1CQUFHO2FBQUMsRUFBRSxRQUFRLENBQUM7WUFDdEMsYUFBYSxDQUFDLENBQUMsRUFBRTtBQUFDLHFCQUFLO0FBQUUsc0JBQU07YUFBQyxFQUFFLFFBQVEsQ0FBQztTQUM5QyxDQUFDO1FBQ0YsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQSxDQUFDLEdBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoRCx3Q0FBd0M7UUFDeEMsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEIsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO0FBQUMsaUJBQUM7QUFBRSxpQkFBQzthQUFDLEVBQUUsUUFBUSxDQUFDO1lBQ3RDLGNBQWMsQ0FBQyxDQUFDLEVBQUU7QUFBQyxpQkFBQztBQUFFLGlCQUFDO2FBQUMsRUFBRSxRQUFRLENBQUM7U0FDdEMsQ0FBQztRQUNGLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQyxHQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDbkQ7Q0FDSixDQUFDO0FBRUYsYUFBYTtBQUViLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDVixJQUFJLEVBQUUsb0RBQW9EO0lBQzFELE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUNoRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFDaEQsUUFBUSxDQUFDLGVBQWUsQ0FBQywyQ0FBMkMsQ0FBQztRQUNyRSxRQUFRLENBQUMsZUFBZSxDQUFDLDJDQUEyQyxDQUFDO1FBRXJFLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFFbkIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN4QixjQUFjLEVBQUU7WUFDaEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDYixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2dCQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzthQUNqQixFQUFFLFFBQVEsQ0FBQztTQUNmLENBQUMsQUFBQztRQUVILFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQ3JCLFFBQVEsRUFBRTtRQUNiLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUNyQixTQUFTLEVBQUUsQ0FDWCxVQUFVLENBQUMsZUFBZSxDQUFDO0tBQ2pDO0NBQ0osQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxnQ0FBZ0M7SUFDdEMsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBRWhELFFBQVE7UUFDUixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3hCLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQztZQUNwQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUM7U0FDdkMsQ0FBQyxBQUFDO1FBRUgsT0FBTztRQUNQLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7YUFDakIsRUFBRSxRQUFRLENBQUM7U0FDZixDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZDO0NBQ0osQ0FBQztBQUVGLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDVixJQUFJLEVBQUUseUNBQXlDO0lBQy9DLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUNoRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFFaEQsUUFBUTtRQUNSLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDeEIsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO1lBQ3JDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQztZQUNyQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7WUFDckMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO1lBQ3JDLGNBQWMsRUFBRTtZQUNoQixlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7U0FDMUMsQ0FBQyxBQUFDO1FBRUgsT0FBTztRQUNQLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3BCLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQztZQUN2QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQztTQUN4QixDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3RSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFFbkMsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEIsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO1NBQ3hCLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNuQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFFbkMsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEIsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO1NBQzFDLENBQUMsQ0FBQztRQUVILDRCQUE0QjtRQUM1QixLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNwQixlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7U0FDMUMsQ0FBQyxDQUFDO1FBQ0gsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztLQUN6QztDQUNKLENBQUM7QUFFRixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1YsSUFBSSxFQUFFLDREQUE0RDtJQUNsRSxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFFaEQsUUFBUTtRQUNSLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDeEIsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDO1lBQ3BDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQztZQUNwQyxjQUFjLEVBQUU7U0FDbkIsQ0FBQyxBQUFDO1FBRUgsT0FBTztRQUNQLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7YUFDbkIsRUFBRSxRQUFRLENBQUM7U0FDYixDQUFDLENBQUM7UUFFSCxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQ25CLFFBQVEsRUFBRSxDQUNWLFdBQVcsRUFBRTtRQUVsQixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FDbkIsNEJBQTRCLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUNuQixnQ0FBZ0MsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5RixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FDbkIsZ0NBQWdDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFOUYsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU07UUFDekMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDL0MsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUM7UUFDaEQsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDMUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDMUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUM7S0FDbEQ7Q0FDSixDQUFDLENBQUM7QUFHSCxhQUFhO0FBRWIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxpQ0FBaUM7SUFDdkMsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBRWhELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDeEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDYixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2dCQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUNsQixFQUFFLFFBQVEsQ0FBQztTQUNmLENBQUM7UUFFRixZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLHlDQUF5QztJQUN6QyxtRUFBbUU7S0FDdEU7Q0FDRixDQUFDLENBQUM7QUFHSCxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLG9DQUFvQztJQUMxQyxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFFaEQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN4QixTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUM7WUFDaEMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ2hDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQztZQUNsQyxjQUFjLEVBQUU7U0FDbkIsQ0FBQztRQUVGLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7YUFDbEIsRUFBRSxRQUFRLENBQUM7U0FDZixDQUFDO1FBRUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUNaLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FDbEIsVUFBVSxDQUFDLHNCQUFzQixDQUFDO0tBQzFDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxpQ0FBaUM7SUFDdkMsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBRWhELElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDeEIsU0FBUyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDO1lBQ2xDLGNBQWMsRUFBRTtTQUNuQixDQUFDO1FBRUYsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDYixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2dCQUN6QixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUNsQixFQUFFLFFBQVEsQ0FBQztTQUNmLENBQUM7UUFFRixZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQ1osTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUNsQixVQUFVLENBQUMsc0JBQXNCLENBQUM7S0FDMUM7Q0FDRixDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLCtFQUErRTtJQUNyRixNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFFaEQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN4QixTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUM7WUFDaEMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ2hDLGNBQWMsRUFBRTtZQUNoQixlQUFlLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUM7U0FDcEMsQ0FBQztRQUVGLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDLEdBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU1QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTTtRQUN6QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMvQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMxQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUUxQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNwQixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7Z0JBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7Z0JBQ3pCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2hCLEVBQUUsUUFBUSxDQUFDO1NBQ2YsQ0FBQztRQUVGLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixNQUFNLENBQUMsUUFBUSxFQUFFO1FBRXRCLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTTtRQUNyQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUMvQztDQUNKLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsaUNBQWlDO0lBQ3ZDLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUVoRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3hCLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQztZQUNoQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUM7WUFDaEMsY0FBYyxFQUFFO1lBQ2hCLGVBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQztTQUNwQyxDQUFDO1FBRUYsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU07UUFDekMsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0QyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUUvQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN0QixJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQztTQUNuQixDQUFDO1FBRUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUNaLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFFdEIsTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNO1FBRXJDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzlDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQy9DO0NBQ0osQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBRTVDLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsbUNBQW1DO0lBQ3pDLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUNoRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFFaEQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN4QixTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7WUFDbkMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO1lBQ25DLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQztZQUNuQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7WUFDbkMsY0FBYyxFQUFFO1NBQ25CLENBQUM7UUFFRiw2Q0FBNkM7UUFDN0MsSUFBSSxLQUFLLEdBQUc7WUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUFDO1FBRTFCLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUNyQixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQyxHQUFJLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQ2hEO1FBRUQsa0VBQWtFO1FBQ2xFLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1FBRW5DLGNBQWM7UUFDZCxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7U0FDM0IsQ0FBQztRQUVGLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFFdEMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO1lBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUN6RSxNQUFNLENBQUMsVUFBVSxFQUFFO1FBRXhCLDREQUE0RDtRQUM1RCxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN0QixlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7U0FDeEMsQ0FBQztRQUVGLElBQUksR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUU7WUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUFDLEVBQUUsUUFBUSxDQUFDLENBQ3ZFLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFFdEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEIsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO1NBQzFDLENBQUM7S0FDSDtDQUNKLENBQUMsQ0FBQztBQUVILGNBQWM7QUFFZCxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLFdBQVc7SUFDakIsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBQ2hELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUVoRCxZQUFZLENBQUMsS0FBSyxDQUFDO1FBRW5CLFFBQVE7UUFDUixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3hCLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQztZQUNwQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7WUFDcEMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDO1lBQ3BDLGNBQWMsRUFBRTtZQUNoQixlQUFlLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7U0FDMUMsQ0FBQztRQUVKLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFFdEMsT0FBTztRQUNQLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ3BCLEVBQUUsUUFBUSxDQUFDO1NBQ2YsQ0FBQztRQUVGLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixNQUFNLENBQUMsU0FBUyxFQUFFLENBQ2xCLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQztRQUV4QywwQkFBMEI7UUFDMUIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO1lBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FBQyxFQUFFLFFBQVEsQ0FBQztRQUM5RSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLFdBQVcsRUFBRTtRQUNoRCxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNsQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUVsQyxXQUFXO1FBQ1gsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDdEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO2dCQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDYixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN4QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7YUFDbEIsRUFBRSxRQUFRLENBQUM7U0FDYixDQUFDO1FBRUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0QyxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFO1FBQ3ZELEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7UUFDdEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7UUFFOUIsSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtZQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQUMsRUFBRSxRQUFRLENBQUMsQ0FDckUsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLFdBQVcsRUFBRTtRQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBRS9CLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNO1FBQ3pDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2pELFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBRS9DLDRCQUE0QjtJQUM1Qiw2Q0FBNkM7SUFDN0MsNkNBQTZDO0tBQ2hEO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBQ2hELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUNoRCxNQUFNLFVBQVUsR0FBRyxFQUFFLElBQUUsRUFBRTtRQUV6QixRQUFRO1FBQ1IsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUVuQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3hCLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQztZQUNwQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7WUFDcEMsY0FBYyxFQUFFO1lBQ2hCLGVBQWUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQztTQUM1QyxDQUFDO1FBRUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUV0QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTTtRQUN6QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQztRQUNsRCxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQztRQUM5QyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsR0FBRyxNQUFNLENBQUM7UUFDMUQsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUM7UUFFekMsT0FBTztRQUNQLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtnQkFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNyQixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ2xCLEVBQUUsUUFBUSxDQUFDO1NBQ2YsQ0FBQztRQUVGLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsV0FBVyxFQUFFO1FBQzNELEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1FBRTlCLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTTtRQUNyQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNqRCxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQztRQUM5QyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFDdkQsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUM7S0FDM0M7Q0FDRixDQUFDLENBQUM7QUFHSCxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLHdEQUF3RDtJQUM5RCxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFFLE9BQU87UUFDaEQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBRWhELFlBQVksQ0FBQyxLQUFLLENBQUM7UUFFbkIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN4QixTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUM7WUFDaEMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ2hDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQztZQUNoQyxjQUFjLEVBQUU7WUFDaEIsZUFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQztTQUMxQixDQUFDO1FBRUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVDLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNO1FBRXpDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQy9DLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTzs7UUFDbEQsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBRSxNQUFNOztRQUVqRCxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN0QixJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQztTQUNuQixDQUFDO1FBRUYsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFFbkMsTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNO1FBRXJDLHFEQUFxRDtRQUNyRCxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUMvQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUU5Qyw2REFBNkQ7SUFDN0QsNEJBQTRCO0lBQzVCLDZCQUE2QjtJQUM3QixLQUFLO0lBRUwsdUNBQXVDO0tBQ3hDO0NBQ0osQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxrQ0FBa0M7SUFDeEMsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBRSxPQUFPO1FBQ2hELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUUsT0FBTztRQUVoRCxZQUFZLENBQUMsS0FBSyxDQUFDO1FBRW5CLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDeEIsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDO1lBQ3hDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQztZQUN4QyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7WUFDeEMsNkJBQTZCLENBQUM7QUFBQyxrQkFBRTtBQUFFLHFCQUFLO2FBQUMsQ0FBQztZQUMxQyxlQUFlLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUM7WUFDakQsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDO1NBQ3BDLENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUMsR0FBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVDLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFNO1FBQ3pDLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDdEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUM7UUFDbEQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO1lBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUN6RSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsV0FBVyxFQUFFO1FBRXRDLElBQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUU3Qyx1QkFBdUI7UUFDdkIsS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDdEIsT0FBTyxFQUFFO1NBQ1YsQ0FBQztRQUVGLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQztRQUU3RCxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUN0QixNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7WUFDaEMsT0FBTyxFQUFFO1NBQ1YsQ0FBQztRQUVGLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTTtRQUNyQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3QyxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztLQUM3QjtDQUNKLENBQUMsQ0FBQyxDQUVILG9DQUFvQztDQUVwQywyQkFBMkI7Q0FDM0IsdUJBQXVCO0NBRXZCLGtCQUFrQjtDQUNsQix5Q0FBeUM7Q0FDekMsK0RBQStEO0NBQy9ELDJEQUEyRDtDQUMzRCwyREFBMkQ7Q0FFM0Qsd0NBQXdDO0NBQ3hDLG1EQUFtRDtDQUNuRCxtREFBbUQ7Q0FDbkQsbURBQW1EO0NBQ25ELG1EQUFtRDtDQUNuRCxnQ0FBZ0M7Q0FDaEMsK0JBQStCO0NBQy9CLHVEQUF1RDtDQUN2RCxhQUFhO0NBRWIsNkJBQTZCO0NBQzdCLGlEQUFpRDtDQUVqRCxvQ0FBb0M7Q0FDcEMsd0NBQXdDO0NBQ3hDLDZEQUE2RDtDQUM3RCw2REFBNkQ7Q0FDN0QsNkRBQTZEO0NBQzdELDBEQUEwRDtDQUMxRCwwREFBMEQ7Q0FDMUQsMERBQTBEO0NBQzFELDBEQUEwRDtDQUMxRCwwREFBMEQ7Q0FDMUQsMERBQTBEO0NBQzFELGFBQWE7Q0FFYixvREFBb0Q7Q0FDcEQsZ0NBQWdDO0NBQ2hDLDJIQUEySDtDQUMzSCxxREFBcUQ7Q0FDckQsNEJBQTRCO0NBQzVCLFFBQVE7Q0FDUixLQUFLIn0=