import { Clarinet, Tx, types } from 'https://deno.land/x/clarinet@v1.7.0/index.ts';
// Test to get epoch
Clarinet.test({
    name: "Ensure we can get the epoch this should return 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking-core", "current-epoch", [], deployer.address);
        call.result.expectUint(0);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get epoch
Clarinet.test({
    name: "Ensure we can get the epoch this should return 1",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineEmptyBlockUntil(205);
        const call = chain.callReadOnlyFn("staking-core", "current-epoch", [], deployer.address);
        call.result.expectUint(1);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get calc epoch
Clarinet.test({
    name: "Ensure we can get the epoch on different hights this should return 1",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch", [
            types.uint(250)
        ], deployer.address);
        call.result.expectUint(1);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get calc epoch
Clarinet.test({
    name: "Ensure we can get the epoch on different hights this should return 10",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch", [
            types.uint(2050)
        ], deployer.address);
        call.result.expectUint(10);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get calc epoch start
Clarinet.test({
    name: "Ensure we can get the start of an epoch this should return 201",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch-start", [
            types.uint(1)
        ], deployer.address);
        call.result.expectUint(201);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get calc epoch start
Clarinet.test({
    name: "Ensure we can get the start of an epoch this should return 2001",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch-start", [
            types.uint(10)
        ], deployer.address);
        call.result.expectUint(2001);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get calc epoch end
Clarinet.test({
    name: "Ensure we can get the end of an epoch this should return 400",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch-end", [
            types.uint(1)
        ], deployer.address);
        call.result.expectUint(400);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get calc epoch end
Clarinet.test({
    name: "Ensure we can get the end of an epoch this should return 2200",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking-core", "calc-epoch-end", [
            types.uint(10)
        ], deployer.address);
        call.result.expectUint(2200);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:0 epoch:0 min:0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address);
        call.result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:2000 epoch:0 min:0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address);
        call.result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:2000 epoch:1 min:1000",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(201);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address);
        call.result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:1000 epoch:2 min:1000",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(201);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlock(200);
        chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address);
        call.result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked this should return end:3000 epoch:2 min:2000",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(201);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlock(200);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking-core", "get-total-staked", [], deployer.address);
        call.result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked by user this should return end:2000 epoch:2 min:1000",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(201);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlock(200);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking-core", "get-user-staked", [
            types.principal(wallet_1.address)
        ], deployer.address);
        call.result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get total staked
Clarinet.test({
    name: "Ensure we can get total staked by user this should return end:1000 epoch:0 min:0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(201);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlock(200);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking-core", "get-user-staked", [
            types.principal(deployer.address)
        ], deployer.address);
        call.result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to stake
Clarinet.test({
    name: "Ensure we can stake",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to stake
Clarinet.test({
    name: "Ensure we can not stake 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(0)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to stake
Clarinet.test({
    name: "Ensure we can not stake less than 500",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(499)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to stake
Clarinet.test({
    name: "Ensure we can not stake if not enough balance",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(1000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1001)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to unstake
Clarinet.test({
    name: "Ensure we can unstake",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to unstake
Clarinet.test({
    name: "Ensure we can not unstake 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [
                types.uint(0)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// // Test to unstake
// Clarinet.test({
//     name: "Ensure we can not unstake more than what we have staked",
//     async fn(chain: Chain, accounts: Map<string, Account>) {
//         const deployer = accounts.get("deployer")!;
//         const wallet_1 = accounts.get("wallet_1")!;
//         chain.mineBlock([
//             Tx.contractCall("velar", "mint", [types.uint(10000000), types.principal(deployer.address)], deployer.address)
//             ])
//         chain.mineBlock([
//             Tx.contractCall("staking-core", "stake", [types.uint(1000)], deployer.address)
//             ])
//         chain.mineEmptyBlock(200)
//         const block = chain.mineBlock([
//             Tx.contractCall("staking-core", "unstake", [types.uint(1001)], deployer.address)
//             ])
//         block.receipts[0].result.expectErr()
//         console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
//     },
//     });
// Test to unstake
Clarinet.test({
    name: "Ensure we can not unstake and leave less than MIN STAKE",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlock(200);
        const block = chain.mineBlock([
            Tx.contractCall("staking-core", "unstake", [
                types.uint(501)
            ], deployer.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to get share-at
Clarinet.test({
    name: "Ensure we can get share at this should return staked:u0 and total:u0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(201);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(401);
        const call = chain.callReadOnlyFn("staking-core", "get-share-at", [
            types.principal(wallet_1.address),
            types.uint(0)
        ], deployer.address);
        call.result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get share-at
Clarinet.test({
    name: "Ensure we can get share at this should return staked:1000 and total:2000",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(deployer.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking-core", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(401);
        const call = chain.callReadOnlyFn("staking-core", "get-share-at", [
            types.principal(wallet_1.address),
            types.uint(1)
        ], deployer.address);
        call.result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL3N0YWtpbmctY29yZV90ZXN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgQ2xhcmluZXQsIFR4LCBDaGFpbiwgQWNjb3VudCwgdHlwZXMgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC94L2NsYXJpbmV0QHYxLjcuMC9pbmRleC50cyc7XG5pbXBvcnQgeyBhc3NlcnRFcXVhbHMgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC9zdGRAMC4xNzAuMC90ZXN0aW5nL2Fzc2VydHMudHMnO1xuXG4vLyBUZXN0IHRvIGdldCBlcG9jaFxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0aGUgZXBvY2ggdGhpcyBzaG91bGQgcmV0dXJuIDBcIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG4gIFxuICAgICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJzdGFraW5nLWNvcmVcIiwgXCJjdXJyZW50LWVwb2NoXCIsIFtdLCBkZXBsb3llci5hZGRyZXNzKVxuICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VWludCgwKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gIH0pO1xuXG4vLyBUZXN0IHRvIGdldCBlcG9jaFxuQ2xhcmluZXQudGVzdCh7XG5uYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHRoZSBlcG9jaCB0aGlzIHNob3VsZCByZXR1cm4gMVwiLFxuYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwgKDIwNSlcblxuICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcInN0YWtpbmctY29yZVwiLCBcImN1cnJlbnQtZXBvY2hcIiwgW10sIGRlcGxveWVyLmFkZHJlc3MpXG5cbiAgICBjYWxsLnJlc3VsdC5leHBlY3RVaW50KDEpXG4gICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShjYWxsLnJlc3VsdCkgKyAnXFx4MWJbMG0nKTtcbn0sXG59KTtcblxuLy8gVGVzdCB0byBnZXQgY2FsYyBlcG9jaFxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0aGUgZXBvY2ggb24gZGlmZmVyZW50IGhpZ2h0cyB0aGlzIHNob3VsZCByZXR1cm4gMVwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcbiAgICBcbiAgICAgICAgY29uc3QgY2FsbCA9IGNoYWluLmNhbGxSZWFkT25seUZuKFwic3Rha2luZy1jb3JlXCIsIFwiY2FsYy1lcG9jaFwiLCBbdHlwZXMudWludCgyNTApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VWludCgxKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gZ2V0IGNhbGMgZXBvY2hcbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQgdGhlIGVwb2NoIG9uIGRpZmZlcmVudCBoaWdodHMgdGhpcyBzaG91bGQgcmV0dXJuIDEwXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuICAgIFxuICAgICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJzdGFraW5nLWNvcmVcIiwgXCJjYWxjLWVwb2NoXCIsIFt0eXBlcy51aW50KDIwNTApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VWludCgxMClcbiAgICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShjYWxsLnJlc3VsdCkgKyAnXFx4MWJbMG0nKTtcbiAgICB9LFxuICAgIH0pO1xuXG4vLyBUZXN0IHRvIGdldCBjYWxjIGVwb2NoIHN0YXJ0XG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHRoZSBzdGFydCBvZiBhbiBlcG9jaCB0aGlzIHNob3VsZCByZXR1cm4gMjAxXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuICAgIFxuICAgICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJzdGFraW5nLWNvcmVcIiwgXCJjYWxjLWVwb2NoLXN0YXJ0XCIsIFt0eXBlcy51aW50KDEpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VWludCgyMDEpXG4gICAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoY2FsbC5yZXN1bHQpICsgJ1xceDFiWzBtJyk7XG4gICAgfSxcbiAgICB9KTtcblxuLy8gVGVzdCB0byBnZXQgY2FsYyBlcG9jaCBzdGFydFxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0aGUgc3RhcnQgb2YgYW4gZXBvY2ggdGhpcyBzaG91bGQgcmV0dXJuIDIwMDFcIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG4gICAgXG4gICAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcInN0YWtpbmctY29yZVwiLCBcImNhbGMtZXBvY2gtc3RhcnRcIiwgW3R5cGVzLnVpbnQoMTApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VWludCgyMDAxKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gZ2V0IGNhbGMgZXBvY2ggZW5kXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHRoZSBlbmQgb2YgYW4gZXBvY2ggdGhpcyBzaG91bGQgcmV0dXJuIDQwMFwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcbiAgICBcbiAgICAgICAgY29uc3QgY2FsbCA9IGNoYWluLmNhbGxSZWFkT25seUZuKFwic3Rha2luZy1jb3JlXCIsIFwiY2FsYy1lcG9jaC1lbmRcIiwgW3R5cGVzLnVpbnQoMSldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgIFxuICAgICAgICBjYWxsLnJlc3VsdC5leHBlY3RVaW50KDQwMClcbiAgICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShjYWxsLnJlc3VsdCkgKyAnXFx4MWJbMG0nKTtcbiAgICB9LFxuICAgIH0pO1xuXG4vLyBUZXN0IHRvIGdldCBjYWxjIGVwb2NoIGVuZFxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0aGUgZW5kIG9mIGFuIGVwb2NoIHRoaXMgc2hvdWxkIHJldHVybiAyMjAwXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuICAgIFxuICAgICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJzdGFraW5nLWNvcmVcIiwgXCJjYWxjLWVwb2NoLWVuZFwiLCBbdHlwZXMudWludCgxMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgIFxuICAgICAgICBjYWxsLnJlc3VsdC5leHBlY3RVaW50KDIyMDApXG4gICAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoY2FsbC5yZXN1bHQpICsgJ1xceDFiWzBtJyk7XG4gICAgfSxcbiAgICB9KTtcblxuLy8gVGVzdCB0byBnZXQgdG90YWwgc3Rha2VkXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHRvdGFsIHN0YWtlZCB0aGlzIHNob3VsZCByZXR1cm4gZW5kOjAgZXBvY2g6MCBtaW46MFwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcbiAgICBcbiAgICAgICAgY29uc3QgY2FsbCA9IGNoYWluLmNhbGxSZWFkT25seUZuKFwic3Rha2luZy1jb3JlXCIsIFwiZ2V0LXRvdGFsLXN0YWtlZFwiLCBbXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHRvdGFsIHN0YWtlZFxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0b3RhbCBzdGFrZWQgdGhpcyBzaG91bGQgcmV0dXJuIGVuZDoyMDAwIGVwb2NoOjAgbWluOjBcIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuICAgICAgICBcbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuICAgICAgICBcbiAgICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgICAgIF0pXG5cbiAgICAgICAgY29uc3QgY2FsbCA9IGNoYWluLmNhbGxSZWFkT25seUZuKFwic3Rha2luZy1jb3JlXCIsIFwiZ2V0LXRvdGFsLXN0YWtlZFwiLCBbXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHRvdGFsIHN0YWtlZFxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0b3RhbCBzdGFrZWQgdGhpcyBzaG91bGQgcmV0dXJuIGVuZDoyMDAwIGVwb2NoOjEgbWluOjEwMDBcIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuICAgICAgICBcbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMDEpXG4gICAgICAgIFxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJzdGFraW5nLWNvcmVcIiwgXCJnZXQtdG90YWwtc3Rha2VkXCIsIFtdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgIFxuICAgICAgICBjYWxsLnJlc3VsdC5leHBlY3RUdXBsZSgpXG4gICAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoY2FsbC5yZXN1bHQpICsgJ1xceDFiWzBtJyk7XG4gICAgfSxcbiAgICB9KTtcblxuLy8gVGVzdCB0byBnZXQgdG90YWwgc3Rha2VkXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHRvdGFsIHN0YWtlZCB0aGlzIHNob3VsZCByZXR1cm4gZW5kOjEwMDAgZXBvY2g6MiBtaW46MTAwMFwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgIF0pXG4gICAgICAgIFxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgIF0pXG5cbiAgICAgICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDIwMSlcbiAgICAgICAgXG4gICAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2soMjAwKVxuXG4gICAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInVuc3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgICAgIF0pXG5cbiAgICAgICAgY29uc3QgY2FsbCA9IGNoYWluLmNhbGxSZWFkT25seUZuKFwic3Rha2luZy1jb3JlXCIsIFwiZ2V0LXRvdGFsLXN0YWtlZFwiLCBbXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHRvdGFsIHN0YWtlZFxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCB0b3RhbCBzdGFrZWQgdGhpcyBzaG91bGQgcmV0dXJuIGVuZDozMDAwIGVwb2NoOjIgbWluOjIwMDBcIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuICAgICAgICBcbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMDEpXG4gICAgICAgIFxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrKDIwMClcblxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJ1bnN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcInN0YWtpbmctY29yZVwiLCBcImdldC10b3RhbC1zdGFrZWRcIiwgW10sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgXG4gICAgICAgIGNhbGwucmVzdWx0LmV4cGVjdFR1cGxlKClcbiAgICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShjYWxsLnJlc3VsdCkgKyAnXFx4MWJbMG0nKTtcbiAgICB9LFxuICAgIH0pO1xuXG4vLyBUZXN0IHRvIGdldCB0b3RhbCBzdGFrZWRcbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQgdG90YWwgc3Rha2VkIGJ5IHVzZXIgdGhpcyBzaG91bGQgcmV0dXJuIGVuZDoyMDAwIGVwb2NoOjIgbWluOjEwMDBcIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuICAgICAgICBcbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMDEpXG4gICAgICAgIFxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrKDIwMClcblxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJ1bnN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcInN0YWtpbmctY29yZVwiLCBcImdldC11c2VyLXN0YWtlZFwiLCBbdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUZXN0IHRvIGdldCB0b3RhbCBzdGFrZWRcbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQgdG90YWwgc3Rha2VkIGJ5IHVzZXIgdGhpcyBzaG91bGQgcmV0dXJuIGVuZDoxMDAwIGVwb2NoOjAgbWluOjBcIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuICAgICAgICBcbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMDEpXG4gICAgICAgIFxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrKDIwMClcblxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJ1bnN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcInN0YWtpbmctY29yZVwiLCBcImdldC11c2VyLXN0YWtlZFwiLCBbdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gc3Rha2VcbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBzdGFrZVwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICAgIF0pXG4gICAgICAgIFxuXG4gICAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICAgIF0pXG4gICAgXG4gICAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RPaygpXG4gICAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gICAgfSxcbiAgICB9KTtcblxuLy8gVGVzdCB0byBzdGFrZVxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG5vdCBzdGFrZSAwXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgICAgXSlcbiAgICBcbiAgICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gICAgfSxcbiAgICB9KTtcblxuLy8gVGVzdCB0byBzdGFrZVxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG5vdCBzdGFrZSBsZXNzIHRoYW4gNTAwXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoNDk5KV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgICBdKVxuICAgIFxuICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgICB9LFxuICAgIH0pO1xuXG4vLyBUZXN0IHRvIHN0YWtlXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IHN0YWtlIGlmIG5vdCBlbm91Z2ggYmFsYW5jZVwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDApLCB0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMSldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgICAgXSlcbiAgICBcbiAgICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gICAgfSxcbiAgICB9KTtcblxuLy8gVGVzdCB0byB1bnN0YWtlXG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gdW5zdGFrZVwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICAgIF0pXG4gICAgICAgIFxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgICBdKVxuICAgIFxuICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gdW5zdGFrZVxuQ2xhcmluZXQudGVzdCh7XG4gICAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG5vdCB1bnN0YWtlIDBcIixcbiAgICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgICBdKVxuICAgICAgICBcbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICAgIF0pXG5cbiAgICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgICBdKVxuICAgIFxuICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgICB9LFxuICAgIH0pO1xuXG4vLyAvLyBUZXN0IHRvIHVuc3Rha2Vcbi8vIENsYXJpbmV0LnRlc3Qoe1xuLy8gICAgIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgdW5zdGFrZSBtb3JlIHRoYW4gd2hhdCB3ZSBoYXZlIHN0YWtlZFwiLFxuLy8gICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4vLyAgICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuLy8gICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuLy8gICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbi8vICAgICAgICAgICAgIF0pXG4gICAgICAgIFxuLy8gICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuLy8gICAgICAgICAgICAgXSlcblxuLy8gICAgICAgICBjaGFpbi5taW5lRW1wdHlCbG9jaygyMDApXG5cbi8vICAgICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuLy8gICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAxKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4vLyAgICAgICAgICAgICBdKVxuICAgIFxuLy8gICAgICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbi8vICAgICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbi8vICAgICB9LFxuLy8gICAgIH0pO1xuXG4vLyBUZXN0IHRvIHVuc3Rha2VcbkNsYXJpbmV0LnRlc3Qoe1xuICAgIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgdW5zdGFrZSBhbmQgbGVhdmUgbGVzcyB0aGFuIE1JTiBTVEFLRVwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICAgIF0pXG4gICAgICAgIFxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgICAgXSlcblxuICAgICAgICBjaGFpbi5taW5lRW1wdHlCbG9jaygyMDApXG5cbiAgICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCg1MDEpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICAgIF0pXG4gICAgXG4gICAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHNoYXJlLWF0XG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHNoYXJlIGF0IHRoaXMgc2hvdWxkIHJldHVybiBzdGFrZWQ6dTAgYW5kIHRvdGFsOnUwXCIsXG4gICAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgIF0pXG5cbiAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDIwMSlcbiAgICAgICAgXG4gICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICAgICAgXSlcbiAgICAgICAgXG4gICAgICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmctY29yZVwiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoNDAxKVxuXG4gICAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcInN0YWtpbmctY29yZVwiLCBcImdldC1zaGFyZS1hdFwiLCBbdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpLCB0eXBlcy51aW50KDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICBcbiAgICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0T2soKVxuICAgICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICAgIH0sXG4gICAgfSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHNoYXJlLWF0XG5DbGFyaW5ldC50ZXN0KHtcbiAgICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHNoYXJlIGF0IHRoaXMgc2hvdWxkIHJldHVybiBzdGFrZWQ6MTAwMCBhbmQgdG90YWw6MjAwMFwiLFxuICAgIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgICAgICBdKVxuXG4gICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgIF0pXG4gICAgICAgIFxuICAgICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZy1jb3JlXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgICAgIF0pXG4gICAgICAgIFxuICAgICAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nLWNvcmVcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICAgICAgXSlcblxuICAgICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDQwMSlcblxuICAgICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJzdGFraW5nLWNvcmVcIiwgXCJnZXQtc2hhcmUtYXRcIiwgW3R5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKSwgdHlwZXMudWludCgxKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgXG4gICAgICAgIGNhbGwucmVzdWx0LmV4cGVjdE9rKClcbiAgICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShjYWxsLnJlc3VsdCkgKyAnXFx4MWJbMG0nKTtcbiAgICB9LFxuICAgIH0pOyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxTQUFTLFFBQVEsRUFBRSxFQUFFLEVBQWtCLEtBQUssUUFBUSw4Q0FBOEMsQ0FBQztBQUduRyxvQkFBb0I7QUFDcEIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNWLElBQUksRUFBRSxrREFBa0Q7SUFDeEQsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxV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