import { Clarinet, Tx, types } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
import { mintVelar } from './util.ts';
import { deployer, addresses } from './contants.ts';
const { staking ,  } = addresses;
const err_stake_preconditions = 701;
const err_stake_postconditions = 702;
const err_unstake_preconditions = 703;
const err_unstake_postconditions = 704;
// read-only
const getLastBlock = (chain)=>chain.callReadOnlyFn('staking', 'get-last-block', [], deployer).result;
export const share = (chain, user)=>chain.callReadOnlyFn('staking', 'get-share', [
        types.principal(user)
    ], deployer).result.expectTuple();
export const shareAt = (chain, user, block)=>chain.callReadOnlyFn('staking', 'get-share-at', [
        types.principal(user),
        types.uint(block)
    ], deployer).result.expectTuple();
// public
export const stake = (user, amt)=>Tx.contractCall('staking', 'stake', [
        types.uint(amt)
    ], user);
export const unstake = (user, amt)=>Tx.contractCall('staking', 'unstake', [
        types.uint(amt)
    ], user);
// ===== read-only functions
Clarinet.test({
    name: 'get-share: not staked',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let res = chain.callReadOnlyFn('staking', 'get-share', [
            types.principal(wallet_1)
        ], deployer).result.expectTuple();
        res.staked.expectUint(0);
        res.total.expectUint(0);
    }
});
Clarinet.test({
    name: 'get-share: staked',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let res = getLastBlock(chain);
        res.expectUint(1);
        // (2)
        let block = chain.mineBlock([
            mintVelar(wallet_1, 500_000),
            Tx.contractCall('staking', 'stake', [
                types.uint(5_000)
            ], wallet_1)
        ]);
        assertEquals(block.receipts.length, 2);
        // TODO: why is total none for block 0?
        res = chain.callReadOnlyFn('staking', 'get-share-at', [
            types.principal(wallet_1),
            types.uint(1)
        ], deployer).result.expectTuple();
        res.staked.expectUint(0);
        res.total.expectUint(0);
        res = chain.callReadOnlyFn('staking', 'get-share-at', [
            types.principal(wallet_1),
            types.uint(2)
        ], deployer).result.expectTuple();
        res.staked.expectUint(5_000);
        res.total.expectUint(5_000);
    }
});
// ============= stake/unstake
Clarinet.test({
    name: 'stake: amt >= MIN_STAKE & amt >= balance',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        // no velar balance
        let block = chain.mineBlock([
            stake(wallet_1, 10_000), 
        ]);
        block.receipts[0].result.expectErr().expectUint(1) // transfer fail?
        ;
        // < MIN_STAKE
        block = chain.mineBlock([
            mintVelar(wallet_1, 10_000),
            stake(wallet_1, 100), 
        ]);
        block.receipts[1].result.expectErr().expectUint(err_stake_preconditions);
    }
});
Clarinet.test({
    name: 'stake-unstake: 1 user',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let res = getLastBlock(chain);
        res.expectUint(1);
        // block 2
        let block = chain.mineBlock([
            mintVelar(wallet_1, 500_000),
            Tx.contractCall('staking', 'stake', [
                types.uint(5_000)
            ], wallet_1)
        ]);
        res = getLastBlock(chain);
        res.expectUint(2);
        // unstake partial (3)
        block = chain.mineBlock([
            Tx.contractCall('staking', 'unstake', [
                types.uint(2_000)
            ], wallet_1)
        ]);
        res = getLastBlock(chain);
        res.expectUint(3);
        // res = share(chain, wallet_1)
        // res = shareAt(chain, wallet_1, 2)
        let assets = chain.getAssetsMaps().assets;
        assertEquals(assets[`.velar.velar`][wallet_1], 500_000 - 3_000);
        assertEquals(assets[`.velar.velar`][staking], 3_000);
        // unstake all (4)
        block = chain.mineBlock([
            Tx.contractCall('staking', 'unstake', [
                types.uint(3_000)
            ], wallet_1)
        ]);
        let res2 = shareAt(chain, wallet_1, 2);
        let res3 = shareAt(chain, wallet_1, 3);
        let res4 = shareAt(chain, wallet_1, 4);
        res2.staked.expectUint(5_000);
        res2.total.expectUint(5_000);
        res3.staked.expectUint(3_000);
        res3.total.expectUint(3_000);
        res4.staked.expectUint(0);
        res4.total.expectUint(0);
        assets = chain.getAssetsMaps().assets;
        assertEquals(assets[`.velar.velar`][wallet_1], 500_000);
    }
});
Clarinet.test({
    name: 'stake-unstake: 3 users',
    async fn (chain, accounts) {
        let wallet_1 = accounts.get('wallet_1').address;
        let wallet_2 = accounts.get('wallet_2').address;
        let wallet_3 = accounts.get('wallet_3').address;
        let res = getLastBlock(chain);
        res.expectUint(1);
        // block 2
        let block = chain.mineBlock([
            mintVelar(wallet_1, 500_000),
            mintVelar(wallet_2, 500_000),
            mintVelar(wallet_3, 500_000),
            stake(wallet_1, 100_000),
            stake(wallet_2, 50_000), 
        ]);
        // (3)
        block = chain.mineBlock([
            stake(wallet_3, 100_000)
        ]);
        let res1 = shareAt(chain, wallet_1, 2);
        let res2 = shareAt(chain, wallet_2, 2);
        res1.staked.expectUint(100_000);
        res1.total.expectUint(150_000);
        res2.staked.expectUint(50_000);
        // (4)
        block = chain.mineBlock([
            unstake(wallet_1, 100_000)
        ]);
        res1 = shareAt(chain, wallet_1, 4);
        res1.staked.expectUint(0);
        // (4 -> 15)
        block = chain.mineEmptyBlock(10);
    // (15)
    // TODO: add some revenue...
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL3N0YWtpbmdfdGVzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IENsYXJpbmV0LCBUeCwgQ2hhaW4sIEFjY291bnQsIHR5cGVzLCBFbXB0eUJsb2NrIH0gZnJvbSAnaHR0cHM6Ly9kZW5vLmxhbmQveC9jbGFyaW5ldEB2MS42LjAvaW5kZXgudHMnO1xuaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSAnaHR0cHM6Ly9kZW5vLmxhbmQvc3RkQDAuOTAuMC90ZXN0aW5nL2Fzc2VydHMudHMnO1xuaW1wb3J0IHsgbWludFZlbGFyIH0gZnJvbSAnLi91dGlsLnRzJztcbmltcG9ydCB7IGRlcGxveWVyLCBhZGRyZXNzZXMgfSBmcm9tICcuL2NvbnRhbnRzLnRzJztcblxuY29uc3QgeyBcbiAgc3Rha2luZyxcbn0gPSBhZGRyZXNzZXNcblxuY29uc3QgZXJyX3N0YWtlX3ByZWNvbmRpdGlvbnMgICAgPSA3MDFcbmNvbnN0IGVycl9zdGFrZV9wb3N0Y29uZGl0aW9ucyAgID0gNzAyXG5jb25zdCBlcnJfdW5zdGFrZV9wcmVjb25kaXRpb25zICA9IDcwM1xuY29uc3QgZXJyX3Vuc3Rha2VfcG9zdGNvbmRpdGlvbnMgPSA3MDRcblxuLy8gcmVhZC1vbmx5XG5jb25zdCBnZXRMYXN0QmxvY2sgPSAoY2hhaW46IENoYWluKSA9PlxuICAgIGNoYWluLmNhbGxSZWFkT25seUZuKCdzdGFraW5nJywgJ2dldC1sYXN0LWJsb2NrJywgW10sIGRlcGxveWVyKVxuICAgICAgICAucmVzdWx0XG5cbmV4cG9ydCBjb25zdCBzaGFyZSA9IChjaGFpbjogQ2hhaW4sIHVzZXI6IHN0cmluZykgPT5cbiAgICBjaGFpbi5jYWxsUmVhZE9ubHlGbignc3Rha2luZycsICdnZXQtc2hhcmUnLCBbdHlwZXMucHJpbmNpcGFsKHVzZXIpXSwgZGVwbG95ZXIpXG4gICAgICAgIC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuXG5leHBvcnQgY29uc3Qgc2hhcmVBdCA9IChjaGFpbjogQ2hhaW4sIHVzZXI6IHN0cmluZywgYmxvY2s6IG51bWJlcikgPT5cbiAgICBjaGFpbi5jYWxsUmVhZE9ubHlGbignc3Rha2luZycsICdnZXQtc2hhcmUtYXQnLCBbdHlwZXMucHJpbmNpcGFsKHVzZXIpLCB0eXBlcy51aW50KGJsb2NrKV0sIGRlcGxveWVyKVxuICAgICAgICAucmVzdWx0LmV4cGVjdFR1cGxlKClcblxuLy8gcHVibGljXG5leHBvcnQgY29uc3Qgc3Rha2UgICA9ICh1c2VyOiBzdHJpbmcsIGFtdDogbnVtYmVyKSA9PlxuICAgIFR4LmNvbnRyYWN0Q2FsbCgnc3Rha2luZycsICdzdGFrZScsIFt0eXBlcy51aW50KGFtdCldLCB1c2VyKVxuZXhwb3J0IGNvbnN0IHVuc3Rha2UgPSAodXNlcjogc3RyaW5nLCBhbXQ6IG51bWJlcikgPT5cbiAgICBUeC5jb250cmFjdENhbGwoJ3N0YWtpbmcnLCAndW5zdGFrZScsIFt0eXBlcy51aW50KGFtdCldLCB1c2VyKVxuXG4vLyA9PT09PSByZWFkLW9ubHkgZnVuY3Rpb25zXG5cbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiAnZ2V0LXNoYXJlOiBub3Qgc3Rha2VkJyxcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGxldCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuXG4gICAgICBsZXQgcmVzID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oJ3N0YWtpbmcnLCAnZ2V0LXNoYXJlJywgW3R5cGVzLnByaW5jaXBhbCh3YWxsZXRfMSldLCBkZXBsb3llcilcbiAgICAgICAgICAucmVzdWx0LmV4cGVjdFR1cGxlKClcblxuICAgICAgcmVzLnN0YWtlZC5leHBlY3RVaW50KDApXG4gICAgICByZXMudG90YWwuZXhwZWN0VWludCgwKVxuICB9LFxufSk7XG5cbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiAnZ2V0LXNoYXJlOiBzdGFrZWQnLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG5cbiAgICAgIGxldCByZXMgPSBnZXRMYXN0QmxvY2soY2hhaW4pXG4gICAgICByZXMuZXhwZWN0VWludCgxKVxuXG4gICAgICAvLyAoMilcbiAgICAgIGxldCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIG1pbnRWZWxhcih3YWxsZXRfMSwgNTAwXzAwMCksXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnc3Rha2luZycsICdzdGFrZScsIFtcbiAgICAgICAgICB0eXBlcy51aW50KDVfMDAwKVxuICAgICAgICBdLCB3YWxsZXRfMSlcbiAgICAgIF0pXG4gICAgICBhc3NlcnRFcXVhbHMoYmxvY2sucmVjZWlwdHMubGVuZ3RoLCAyKVxuXG4gICAgICAvLyBUT0RPOiB3aHkgaXMgdG90YWwgbm9uZSBmb3IgYmxvY2sgMD9cbiAgICAgIHJlcyA9IGNoYWluLmNhbGxSZWFkT25seUZuKCdzdGFraW5nJywgJ2dldC1zaGFyZS1hdCcsIFtcbiAgICAgICAgICB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEpLFxuICAgICAgICAgIHR5cGVzLnVpbnQoMSlcbiAgICAgIF0sIGRlcGxveWVyKVxuICAgICAgICAgIC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuXG4gICAgICByZXMuc3Rha2VkLmV4cGVjdFVpbnQoMClcbiAgICAgIHJlcy50b3RhbC5leHBlY3RVaW50KDApXG5cbiAgICAgIHJlcyA9IGNoYWluLmNhbGxSZWFkT25seUZuKCdzdGFraW5nJywgJ2dldC1zaGFyZS1hdCcsIFtcbiAgICAgICAgICB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEpLFxuICAgICAgICAgIHR5cGVzLnVpbnQoMilcbiAgICAgIF0sIGRlcGxveWVyKVxuICAgICAgICAgIC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuXG4gICAgICByZXMuc3Rha2VkLmV4cGVjdFVpbnQoNV8wMDApXG4gICAgICByZXMudG90YWwuZXhwZWN0VWludCg1XzAwMClcbiAgfSxcbn0pO1xuXG4vLyA9PT09PT09PT09PT09IHN0YWtlL3Vuc3Rha2VcblxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogJ3N0YWtlOiBhbXQgPj0gTUlOX1NUQUtFICYgYW10ID49IGJhbGFuY2UnLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGxldCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuXG4gICAgICAgIC8vIG5vIHZlbGFyIGJhbGFuY2VcbiAgICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIHN0YWtlKHdhbGxldF8xLCAxMF8wMDApLFxuICAgICAgICBdKVxuICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKCkuZXhwZWN0VWludCgxKSAvLyB0cmFuc2ZlciBmYWlsP1xuXG4gICAgICAgIC8vIDwgTUlOX1NUQUtFXG4gICAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIG1pbnRWZWxhcih3YWxsZXRfMSwgMTBfMDAwKSxcbiAgICAgICAgICAgIHN0YWtlKHdhbGxldF8xLCAxMDApLFxuICAgICAgICBdKVxuICAgICAgICBibG9jay5yZWNlaXB0c1sxXS5yZXN1bHQuZXhwZWN0RXJyKCkuZXhwZWN0VWludChlcnJfc3Rha2VfcHJlY29uZGl0aW9ucylcbiAgICB9XG59KVxuXG5cbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiAnc3Rha2UtdW5zdGFrZTogMSB1c2VyJyxcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGxldCB3YWxsZXRfMSA9IGFjY291bnRzLmdldCgnd2FsbGV0XzEnKSEuYWRkcmVzc1xuXG4gICAgICBsZXQgcmVzID0gZ2V0TGFzdEJsb2NrKGNoYWluKVxuICAgICAgcmVzLmV4cGVjdFVpbnQoMSlcblxuICAgICAgLy8gYmxvY2sgMlxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBtaW50VmVsYXIod2FsbGV0XzEsIDUwMF8wMDApLFxuICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbCgnc3Rha2luZycsICdzdGFrZScsIFtcbiAgICAgICAgICAgICAgdHlwZXMudWludCg1XzAwMClcbiAgICAgICAgICBdLCB3YWxsZXRfMSlcbiAgICAgIF0pXG5cbiAgICAgIHJlcyA9IGdldExhc3RCbG9jayhjaGFpbilcbiAgICAgIHJlcy5leHBlY3RVaW50KDIpXG5cbiAgICAgIC8vIHVuc3Rha2UgcGFydGlhbCAoMylcbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBUeC5jb250cmFjdENhbGwoJ3N0YWtpbmcnLCAndW5zdGFrZScsIFt0eXBlcy51aW50KDJfMDAwKV0sIHdhbGxldF8xKVxuICAgICAgXSlcblxuICAgICAgcmVzID0gZ2V0TGFzdEJsb2NrKGNoYWluKVxuICAgICAgcmVzLmV4cGVjdFVpbnQoMylcblxuICAgICAgLy8gcmVzID0gc2hhcmUoY2hhaW4sIHdhbGxldF8xKVxuICAgICAgLy8gcmVzID0gc2hhcmVBdChjaGFpbiwgd2FsbGV0XzEsIDIpXG5cbiAgICAgIGxldCBhc3NldHMgPSBjaGFpbi5nZXRBc3NldHNNYXBzKCkuYXNzZXRzXG4gICAgICBhc3NlcnRFcXVhbHMoYXNzZXRzW2AudmVsYXIudmVsYXJgXVt3YWxsZXRfMV0sIDUwMF8wMDAgLSAzXzAwMClcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbYC52ZWxhci52ZWxhcmBdW3N0YWtpbmddLCAzXzAwMClcblxuICAgICAgLy8gdW5zdGFrZSBhbGwgKDQpXG4gICAgICBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKCdzdGFraW5nJywgJ3Vuc3Rha2UnLCBbdHlwZXMudWludCgzXzAwMCldLCB3YWxsZXRfMSlcbiAgICAgIF0pXG4gIFxuICAgICAgbGV0IHJlczIgPSBzaGFyZUF0KGNoYWluLCB3YWxsZXRfMSwgMilcbiAgICAgIGxldCByZXMzID0gc2hhcmVBdChjaGFpbiwgd2FsbGV0XzEsIDMpXG4gICAgICBsZXQgcmVzNCA9IHNoYXJlQXQoY2hhaW4sIHdhbGxldF8xLCA0KVxuICBcbiAgICAgIHJlczIuc3Rha2VkLmV4cGVjdFVpbnQoNV8wMDApXG4gICAgICByZXMyLnRvdGFsLmV4cGVjdFVpbnQoNV8wMDApXG4gICAgICByZXMzLnN0YWtlZC5leHBlY3RVaW50KDNfMDAwKVxuICAgICAgcmVzMy50b3RhbC5leHBlY3RVaW50KDNfMDAwKVxuICAgICAgcmVzNC5zdGFrZWQuZXhwZWN0VWludCgwKVxuICAgICAgcmVzNC50b3RhbC5leHBlY3RVaW50KDApXG5cbiAgICAgIGFzc2V0cyA9IGNoYWluLmdldEFzc2V0c01hcHMoKS5hc3NldHNcbiAgICAgIGFzc2VydEVxdWFscyhhc3NldHNbYC52ZWxhci52ZWxhcmBdW3dhbGxldF8xXSwgNTAwXzAwMClcbiAgfSxcbn0pO1xuXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogJ3N0YWtlLXVuc3Rha2U6IDMgdXNlcnMnLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgbGV0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KCd3YWxsZXRfMScpIS5hZGRyZXNzXG4gICAgICBsZXQgd2FsbGV0XzIgPSBhY2NvdW50cy5nZXQoJ3dhbGxldF8yJykhLmFkZHJlc3NcbiAgICAgIGxldCB3YWxsZXRfMyA9IGFjY291bnRzLmdldCgnd2FsbGV0XzMnKSEuYWRkcmVzc1xuXG4gICAgICBsZXQgcmVzID0gZ2V0TGFzdEJsb2NrKGNoYWluKVxuICAgICAgcmVzLmV4cGVjdFVpbnQoMSlcblxuICAgICAgLy8gYmxvY2sgMlxuICAgICAgbGV0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBtaW50VmVsYXIod2FsbGV0XzEsIDUwMF8wMDApLFxuICAgICAgICAgIG1pbnRWZWxhcih3YWxsZXRfMiwgNTAwXzAwMCksXG4gICAgICAgICAgbWludFZlbGFyKHdhbGxldF8zLCA1MDBfMDAwKSxcbiAgICAgICAgICBzdGFrZSh3YWxsZXRfMSwgMTAwXzAwMCksXG4gICAgICAgICAgc3Rha2Uod2FsbGV0XzIsIDUwXzAwMCksXG4gICAgICBdKVxuXG4gICAgICAvLyAoMylcbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICBzdGFrZSh3YWxsZXRfMywgMTAwXzAwMClcbiAgICAgIF0pXG5cbiAgICAgIGxldCByZXMxID0gc2hhcmVBdChjaGFpbiwgd2FsbGV0XzEsIDIpXG4gICAgICBsZXQgcmVzMiA9IHNoYXJlQXQoY2hhaW4sIHdhbGxldF8yLCAyKVxuXG4gICAgICByZXMxLnN0YWtlZC5leHBlY3RVaW50KDEwMF8wMDApXG4gICAgICByZXMxLnRvdGFsLmV4cGVjdFVpbnQoMTUwXzAwMClcbiAgICAgIHJlczIuc3Rha2VkLmV4cGVjdFVpbnQoNTBfMDAwKVxuXG4gICAgICAvLyAoNClcbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICB1bnN0YWtlKHdhbGxldF8xLCAxMDBfMDAwKVxuICAgICAgXSlcblxuICAgICAgcmVzMSA9IHNoYXJlQXQoY2hhaW4sIHdhbGxldF8xLCA0KVxuICAgICAgcmVzMS5zdGFrZWQuZXhwZWN0VWludCgwKVxuXG4gICAgICAvLyAoNCAtPiAxNSlcbiAgICAgIGJsb2NrID0gY2hhaW4ubWluZUVtcHR5QmxvY2soMTApXG5cbiAgICAgIC8vICgxNSlcbiAgICAgIC8vIFRP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