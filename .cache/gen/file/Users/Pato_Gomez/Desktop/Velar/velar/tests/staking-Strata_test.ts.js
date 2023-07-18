import { Clarinet, Tx, types } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
// Test to get staked
Clarinet.test({
    name: "Ensure we can get the staked by user this should return 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const call = chain.callReadOnlyFn("staking", "get-user-staked", [
            types.principal(deployer.address)
        ], deployer.address);
        call.result.expectUint(0);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get staked
Clarinet.test({
    name: "Ensure we can get the staked by user after staking once, this should return 1000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking", "get-user-staked", [
            types.principal(wallet_1.address)
        ], deployer.address);
        call.result.expectUint(1000);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get staked
Clarinet.test({
    name: "Ensure we can get the staked by user after staking 2 in different blocks, this should return 3000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlock(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking", "get-user-staked", [
            types.principal(wallet_1.address)
        ], deployer.address);
        call.result.expectUint(3000);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get staked
Clarinet.test({
    name: "Ensure we can get the staked by user after staking 2 and unstaking once in different blocks, this should return 2000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlock(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlock(10);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const call = chain.callReadOnlyFn("staking", "get-user-staked", [
            types.principal(wallet_1.address)
        ], deployer.address);
        call.result.expectUint(2000);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test get staked by all
Clarinet.test({
    name: "Ensure we can get staked by all users this should return 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-total-staked", [], deployer.address)
        ]);
        block.receipts[0].result.expectUint(0);
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test to get staked by all
Clarinet.test({
    name: "Ensure we can get the staked by all after staking once, this should return 2000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        const call = chain.callReadOnlyFn("staking", "get-total-staked", [], deployer.address);
        call.result.expectUint(2000);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get staked by all
Clarinet.test({
    name: "Ensure we can get the staked by all after staking 2 in different blocks, this should return 6000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlock(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], deployer.address)
        ]);
        const call = chain.callReadOnlyFn("staking", "get-total-staked", [], deployer.address);
        call.result.expectUint(6000);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test to get staked by all
Clarinet.test({
    name: "Ensure we can get the staked by all after staking 2 and unstaking once in different blocks, this should return 4000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlock(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlock(10);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        const call = chain.callReadOnlyFn("staking", "get-total-staked", [], deployer.address);
        call.result.expectUint(4000);
        console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
    }
});
// Test get last block
Clarinet.test({
    name: "Ensure we can get last block",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-last-block", [], deployer.address)
        ]);
        block.receipts[0].result.expectUint(0);
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test stake
Clarinet.test({
    name: "Ensure we can stake",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test stake
Clarinet.test({
    name: "Ensure we can not stake if MIN-STAKE not met",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(499)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test stake
Clarinet.test({
    name: "Ensure we can not stake if MIN-STAKE not met",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(499)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test stake
Clarinet.test({
    name: "Ensure we can not stake if not enough balance to stake",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(100),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(600)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test unstake
Clarinet.test({
    name: "Ensure we can unstake",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(1000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(200)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test unstake
Clarinet.test({
    name: "Ensure we can not unstake if we try to unstake more than what we have",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(1000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1001)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test unstake
Clarinet.test({
    name: "Ensure we can not unstake if MIN-STAKE not left in staking",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(1000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(600)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectErr();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test unstake
Clarinet.test({
    name: "Ensure we can unstake if MIN-STAKE not left in staking but we are unstaking everything",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(1000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectOk();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 0",
    async fn (chain, accounts) {
        const deployer = accounts.get("deployer");
        const wallet_1 = accounts.get("wallet_1");
        chain.mineEmptyBlockUntil(100);
        chain.mineBlock([
            Tx.contractCall("velar", "mint", [
                types.uint(10000000000),
                types.principal(wallet_1.address)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(wallet_1.address),
                types.uint(10)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 2000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(wallet_1.address),
                types.uint(8)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 4000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(wallet_1.address),
                types.uint(15)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 6000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(wallet_1.address),
                types.uint(25)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 1000-3000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(deployer.address),
                types.uint(8)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 2000-6000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(deployer.address),
                types.uint(15)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 3000-9000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(deployer.address),
                types.uint(25)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 500-1500",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(deployer.address),
                types.uint(6)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 1000-3000",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(deployer.address),
                types.uint(16)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
// Test get-share
Clarinet.test({
    name: "Ensure we can get-share-at a specific block this should return 1500-4500",
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
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(5);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(10);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(15);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(20);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(2000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "stake", [
                types.uint(1000)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(25);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(1000)
            ], wallet_1.address)
        ]);
        chain.mineBlock([
            Tx.contractCall("staking", "unstake", [
                types.uint(500)
            ], deployer.address)
        ]);
        chain.mineEmptyBlockUntil(30);
        const block = chain.mineBlock([
            Tx.contractCall("staking", "get-share-at", [
                types.principal(deployer.address),
                types.uint(26)
            ], wallet_1.address)
        ]);
        block.receipts[0].result.expectTuple();
        console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vVXNlcnMvUGF0b19Hb21lei9EZXNrdG9wL1ZlbGFyL3ZlbGFyL3Rlc3RzL3N0YWtpbmctU3RyYXRhX3Rlc3QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xhcmluZXQsIFR4LCBDaGFpbiwgQWNjb3VudCwgdHlwZXMsIEVtcHR5QmxvY2sgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC94L2NsYXJpbmV0QHYxLjYuMC9pbmRleC50cyc7XG5pbXBvcnQgeyBhc3NlcnRFcXVhbHMgfSBmcm9tICdodHRwczovL2Rlbm8ubGFuZC9zdGRAMC45MC4wL3Rlc3RpbmcvYXNzZXJ0cy50cyc7XG5cbi8vIFRlc3QgdG8gZ2V0IHN0YWtlZFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQgdGhlIHN0YWtlZCBieSB1c2VyIHRoaXMgc2hvdWxkIHJldHVybiAwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJzdGFraW5nXCIsIFwiZ2V0LXVzZXItc3Rha2VkXCIsIFt0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuXG4gICAgICBjYWxsLnJlc3VsdC5leHBlY3RVaW50KDApXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHN0YWtlZFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQgdGhlIHN0YWtlZCBieSB1c2VyIGFmdGVyIHN0YWtpbmcgb25jZSwgdGhpcyBzaG91bGQgcmV0dXJuIDEwMDBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY29uc3QgY2FsbCA9IGNoYWluLmNhbGxSZWFkT25seUZuKFwic3Rha2luZ1wiLCBcImdldC11c2VyLXN0YWtlZFwiLCBbdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcblxuICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VWludCgxMDAwKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShjYWxsLnJlc3VsdCkgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHRvIGdldCBzdGFrZWRcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHRoZSBzdGFrZWQgYnkgdXNlciBhZnRlciBzdGFraW5nIDIgaW4gZGlmZmVyZW50IGJsb2NrcywgdGhpcyBzaG91bGQgcmV0dXJuIDMwMDBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2soMTApXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjb25zdCBjYWxsID0gY2hhaW4uY2FsbFJlYWRPbmx5Rm4oXCJzdGFraW5nXCIsIFwiZ2V0LXVzZXItc3Rha2VkXCIsIFt0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuXG4gICAgICBjYWxsLnJlc3VsdC5leHBlY3RVaW50KDMwMDApXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHN0YWtlZFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQgdGhlIHN0YWtlZCBieSB1c2VyIGFmdGVyIHN0YWtpbmcgMiBhbmQgdW5zdGFraW5nIG9uY2UgaW4gZGlmZmVyZW50IGJsb2NrcywgdGhpcyBzaG91bGQgcmV0dXJuIDIwMDBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2soMTApXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9jaygxMClcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInVuc3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY29uc3QgY2FsbCA9IGNoYWluLmNhbGxSZWFkT25seUZuKFwic3Rha2luZ1wiLCBcImdldC11c2VyLXN0YWtlZFwiLCBbdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcblxuICAgICAgY2FsbC5yZXN1bHQuZXhwZWN0VWludCgyMDAwKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShjYWxsLnJlc3VsdCkgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldCBzdGFrZWQgYnkgYWxsXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCBzdGFrZWQgYnkgYWxsIHVzZXJzIHRoaXMgc2hvdWxkIHJldHVybiAwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcImdldC10b3RhbC1zdGFrZWRcIiwgW10sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKTtcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdFVpbnQoMClcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB0byBnZXQgc3Rha2VkIGJ5IGFsbFxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQgdGhlIHN0YWtlZCBieSBhbGwgYWZ0ZXIgc3Rha2luZyBvbmNlLCB0aGlzIHNob3VsZCByZXR1cm4gMjAwMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcInN0YWtpbmdcIiwgXCJnZXQtdG90YWwtc3Rha2VkXCIsIFtdLCBkZXBsb3llci5hZGRyZXNzKVxuXG4gICAgICBjYWxsLnJlc3VsdC5leHBlY3RVaW50KDIwMDApXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHN0YWtlZCBieSBhbGxcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHRoZSBzdGFrZWQgYnkgYWxsIGFmdGVyIHN0YWtpbmcgMiBpbiBkaWZmZXJlbnQgYmxvY2tzLCB0aGlzIHNob3VsZCByZXR1cm4gNjAwMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrKDEwKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNvbnN0IGNhbGwgPSBjaGFpbi5jYWxsUmVhZE9ubHlGbihcInN0YWtpbmdcIiwgXCJnZXQtdG90YWwtc3Rha2VkXCIsIFtdLCBkZXBsb3llci5hZGRyZXNzKVxuXG4gICAgICBjYWxsLnJlc3VsdC5leHBlY3RVaW50KDYwMDApXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGNhbGwucmVzdWx0KSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdG8gZ2V0IHN0YWtlZCBieSBhbGxcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0IHRoZSBzdGFrZWQgYnkgYWxsIGFmdGVyIHN0YWtpbmcgMiBhbmQgdW5zdGFraW5nIG9uY2UgaW4gZGlmZmVyZW50IGJsb2NrcywgdGhpcyBzaG91bGQgcmV0dXJuIDQwMDBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9jaygxMClcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9jaygxMClcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInVuc3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInVuc3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY29uc3QgY2FsbCA9IGNoYWluLmNhbGxSZWFkT25seUZuKFwic3Rha2luZ1wiLCBcImdldC10b3RhbC1zdGFrZWRcIiwgW10sIGRlcGxveWVyLmFkZHJlc3MpXG5cbiAgICAgIGNhbGwucmVzdWx0LmV4cGVjdFVpbnQoNDAwMClcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoY2FsbC5yZXN1bHQpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuXG4vLyBUZXN0IGdldCBsYXN0IGJsb2NrXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldCBsYXN0IGJsb2NrXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcImdldC1sYXN0LWJsb2NrXCIsIFtdLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSk7XG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RVaW50KDApXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3Qgc3Rha2VcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gc3Rha2VcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHN0YWtlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG5vdCBzdGFrZSBpZiBNSU4tU1RBS0Ugbm90IG1ldFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDQ5OSldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3Qgc3Rha2VcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gbm90IHN0YWtlIGlmIE1JTi1TVEFLRSBub3QgbWV0XCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoNDk5KV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCBzdGFrZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3Qgc3Rha2UgaWYgbm90IGVub3VnaCBiYWxhbmNlIHRvIHN0YWtlXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDYwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdEVycigpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdW5zdGFrZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiB1bnN0YWtlXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgyMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RPaygpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgdW5zdGFrZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBub3QgdW5zdGFrZSBpZiB3ZSB0cnkgdG8gdW5zdGFrZSBtb3JlIHRoYW4gd2hhdCB3ZSBoYXZlXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAxKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0RXJyKClcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCB1bnN0YWtlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIG5vdCB1bnN0YWtlIGlmIE1JTi1TVEFLRSBub3QgbGVmdCBpbiBzdGFraW5nXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCg2MDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RFcnIoKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IHVuc3Rha2VcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gdW5zdGFrZSBpZiBNSU4tU1RBS0Ugbm90IGxlZnQgaW4gc3Rha2luZyBidXQgd2UgYXJlIHVuc3Rha2luZyBldmVyeXRoaW5nXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0T2soKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldC1zaGFyZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQtc2hhcmUtYXQgYSBzcGVjaWZpYyBibG9jayB0aGlzIHNob3VsZCByZXR1cm4gMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgxMDApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcImdldC1zaGFyZS1hdFwiLCBbdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpLHR5cGVzLnVpbnQoMTApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RUdXBsZSgpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgZ2V0LXNoYXJlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldC1zaGFyZS1hdCBhIHNwZWNpZmljIGJsb2NrIHRoaXMgc2hvdWxkIHJldHVybiAyMDAwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMTApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMCk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDMwKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwiZ2V0LXNoYXJlLWF0XCIsIFt0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyksdHlwZXMudWludCg4KV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldC1zaGFyZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQtc2hhcmUtYXQgYSBzcGVjaWZpYyBibG9jayB0aGlzIHNob3VsZCByZXR1cm4gNDAwMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDEwKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMjApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgzMCk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcImdldC1zaGFyZS1hdFwiLCBbdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpLHR5cGVzLnVpbnQoMTUpXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RUdXBsZSgpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgZ2V0LXNoYXJlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldC1zaGFyZS1hdCBhIHNwZWNpZmljIGJsb2NrIHRoaXMgc2hvdWxkIHJldHVybiA2MDAwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMTApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMCk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDMwKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwiZ2V0LXNoYXJlLWF0XCIsIFt0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyksdHlwZXMudWludCgyNSldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdFR1cGxlKClcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCBnZXQtc2hhcmVcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0LXNoYXJlLWF0IGEgc3BlY2lmaWMgYmxvY2sgdGhpcyBzaG91bGQgcmV0dXJuIDEwMDAtMzAwMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMTApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMCk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDMwKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwiZ2V0LXNoYXJlLWF0XCIsIFt0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyksdHlwZXMudWludCg4KV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldC1zaGFyZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQtc2hhcmUtYXQgYSBzcGVjaWZpYyBibG9jayB0aGlzIHNob3VsZCByZXR1cm4gMjAwMC02MDAwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgxMCk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMCk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDMwKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwiZ2V0LXNoYXJlLWF0XCIsIFt0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyksdHlwZXMudWludCgxNSldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgYmxvY2sucmVjZWlwdHNbMF0ucmVzdWx0LmV4cGVjdFR1cGxlKClcbiAgICAgIGNvbnNvbGUubG9nKCdcXHgxYlszMm0nICsgSlNPTi5zdHJpbmdpZnkoYmxvY2sucmVjZWlwdHMpICsgJ1xceDFiWzBtJyk7XG4gIH0sXG59KTtcblxuLy8gVGVzdCBnZXQtc2hhcmVcbkNsYXJpbmV0LnRlc3Qoe1xuICBuYW1lOiBcIkVuc3VyZSB3ZSBjYW4gZ2V0LXNoYXJlLWF0IGEgc3BlY2lmaWMgYmxvY2sgdGhpcyBzaG91bGQgcmV0dXJuIDMwMDAtOTAwMFwiLFxuICBhc3luYyBmbihjaGFpbjogQ2hhaW4sIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50Pikge1xuICAgICAgY29uc3QgZGVwbG95ZXIgPSBhY2NvdW50cy5nZXQoXCJkZXBsb3llclwiKSE7XG4gICAgICBjb25zdCB3YWxsZXRfMSA9IGFjY291bnRzLmdldChcIndhbGxldF8xXCIpITtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKHdhbGxldF8xLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMTApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMjApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMzApO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJnZXQtc2hhcmUtYXRcIiwgW3R5cGVzLnByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKSx0eXBlcy51aW50KDI1KV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldC1zaGFyZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQtc2hhcmUtYXQgYSBzcGVjaWZpYyBibG9jayB0aGlzIHNob3VsZCByZXR1cm4gNTAwLTE1MDBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCg1MDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMTApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJ1bnN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJ1bnN0YWtlXCIsIFt0eXBlcy51aW50KDUwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgyMCk7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInVuc3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInVuc3Rha2VcIiwgW3R5cGVzLnVpbnQoNTAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDMwKTtcblxuICAgICAgY29uc3QgYmxvY2sgPSBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwiZ2V0LXNoYXJlLWF0XCIsIFt0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyksdHlwZXMudWludCg2KV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pO1xuXG4vLyBUZXN0IGdldC1zaGFyZVxuQ2xhcmluZXQudGVzdCh7XG4gIG5hbWU6IFwiRW5zdXJlIHdlIGNhbiBnZXQtc2hhcmUtYXQgYSBzcGVjaWZpYyBibG9jayB0aGlzIHNob3VsZCByZXR1cm4gMTAwMC0zMDAwXCIsXG4gIGFzeW5jIGZuKGNoYWluOiBDaGFpbiwgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+KSB7XG4gICAgICBjb25zdCBkZXBsb3llciA9IGFjY291bnRzLmdldChcImRlcGxveWVyXCIpITtcbiAgICAgIGNvbnN0IHdhbGxldF8xID0gYWNjb3VudHMuZ2V0KFwid2FsbGV0XzFcIikhO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwod2FsbGV0XzEuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwidmVsYXJcIiwgXCJtaW50XCIsIFt0eXBlcy51aW50KDEwMDAwMDAwMDAwKSwgdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgyMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInVuc3Rha2VcIiwgW3R5cGVzLnVpbnQoMTAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInVuc3Rha2VcIiwgW3R5cGVzLnVpbnQoNTAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDEwKTtcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCg1MDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMjApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJ1bnN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJ1bnN0YWtlXCIsIFt0eXBlcy51aW50KDUwMCldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUVtcHR5QmxvY2tVbnRpbCgzMCk7XG5cbiAgICAgIGNvbnN0IGJsb2NrID0gY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcImdldC1zaGFyZS1hdFwiLCBbdHlwZXMucHJpbmNpcGFsKGRlcGxveWVyLmFkZHJlc3MpLHR5cGVzLnVpbnQoMTYpXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGJsb2NrLnJlY2VpcHRzWzBdLnJlc3VsdC5leHBlY3RUdXBsZSgpXG4gICAgICBjb25zb2xlLmxvZygnXFx4MWJbMzJtJyArIEpTT04uc3RyaW5naWZ5KGJsb2NrLnJlY2VpcHRzKSArICdcXHgxYlswbScpO1xuICB9LFxufSk7XG5cbi8vIFRlc3QgZ2V0LXNoYXJlXG5DbGFyaW5ldC50ZXN0KHtcbiAgbmFtZTogXCJFbnN1cmUgd2UgY2FuIGdldC1zaGFyZS1hdCBhIHNwZWNpZmljIGJsb2NrIHRoaXMgc2hvdWxkIHJldHVybiAxNTAwLTQ1MDBcIixcbiAgYXN5bmMgZm4oY2hhaW46IENoYWluLCBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4pIHtcbiAgICAgIGNvbnN0IGRlcGxveWVyID0gYWNjb3VudHMuZ2V0KFwiZGVwbG95ZXJcIikhO1xuICAgICAgY29uc3Qgd2FsbGV0XzEgPSBhY2NvdW50cy5nZXQoXCJ3YWxsZXRfMVwiKSE7XG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInZlbGFyXCIsIFwibWludFwiLCBbdHlwZXMudWludCgxMDAwMDAwMDAwMCksIHR5cGVzLnByaW5jaXBhbCh3YWxsZXRfMS5hZGRyZXNzKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJ2ZWxhclwiLCBcIm1pbnRcIiwgW3R5cGVzLnVpbnQoMTAwMDAwMDAwMDApLCB0eXBlcy5wcmluY2lwYWwoZGVwbG95ZXIuYWRkcmVzcyldLCBkZXBsb3llci5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDIwMDApXSwgd2FsbGV0XzEuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJzdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIGRlcGxveWVyLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lRW1wdHlCbG9ja1VudGlsKDUpO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCg1MDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMTApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMTUpO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCg1MDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMjApO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwic3Rha2VcIiwgW3R5cGVzLnVpbnQoMjAwMCldLCB3YWxsZXRfMS5hZGRyZXNzKVxuICAgICAgXSlcblxuICAgICAgY2hhaW4ubWluZUJsb2NrKFtcbiAgICAgICAgVHguY29udHJhY3RDYWxsKFwic3Rha2luZ1wiLCBcInN0YWtlXCIsIFt0eXBlcy51aW50KDEwMDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMjUpO1xuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCgxMDAwKV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBjaGFpbi5taW5lQmxvY2soW1xuICAgICAgICBUeC5jb250cmFjdENhbGwoXCJzdGFraW5nXCIsIFwidW5zdGFrZVwiLCBbdHlwZXMudWludCg1MDApXSwgZGVwbG95ZXIuYWRkcmVzcylcbiAgICAgIF0pXG5cbiAgICAgIGNoYWluLm1pbmVFbXB0eUJsb2NrVW50aWwoMzApO1xuXG4gICAgICBjb25zdCBibG9jayA9IGNoYWluLm1pbmVCbG9jayhbXG4gICAgICAgIFR4LmNvbnRyYWN0Q2FsbChcInN0YWtpbmdcIiwgXCJnZXQtc2hhcmUtYXRcIiwgW3R5cGVzLnByaW5jaXBhbChkZXBsb3llci5hZGRyZXNzKSx0eXBlcy51aW50KDI2KV0sIHdhbGxldF8xLmFkZHJlc3MpXG4gICAgICBdKVxuXG4gICAgICBibG9jay5yZWNlaXB0c1swXS5yZXN1bHQuZXhwZWN0VHVwbGUoKVxuICAgICAgY29uc29sZS5sb2coJ1xceDFiWzMybScgKyBKU09OLnN0cmluZ2lmeShibG9jay5yZWNlaXB0cykgKyAnXFx4MWJbMG0nKTtcbiAgfSxcbn0pOyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLFFBQVEsRUFBRSxFQUFFLEVBQWtCLEtBQUssUUFBb0IsOENBQThDLENBQUM7QUFHL0cscUJBQXFCO0FBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsMkRBQTJEO0lBQ2pFLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUU7WUFBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFFdEgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3JFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgscUJBQXFCO0FBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsa0ZBQWtGO0lBQ3hGLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDakgsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFO1lBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1FBRXRILElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUNyRTtDQUNGLENBQUMsQ0FBQztBQUVILHFCQUFxQjtBQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLG1HQUFtRztJQUN6RyxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBRTNDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztRQUV4QixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRTtZQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUV0SCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDckU7Q0FDRixDQUFDLENBQUM7QUFFSCxxQkFBcUI7QUFDckIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxzSEFBc0g7SUFDNUgsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7UUFFeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7UUFFeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUM1RSxDQUFDO1FBRUYsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUU7WUFBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFFdEgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3JFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgseUJBQXlCO0FBQ3pCLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsNERBQTREO0lBQ2xFLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUMxQixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUN2RSxDQUFDLEFBQUM7UUFFSCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3hFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsNEJBQTRCO0FBQzVCLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsaUZBQWlGO0lBQ3ZGLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDakgsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUV0RixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDckU7Q0FDRixDQUFDLENBQUM7QUFFSCw0QkFBNEI7QUFDNUIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxrR0FBa0c7SUFDeEcsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDakgsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1FBRXhCLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1FBRXRGLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUNyRTtDQUNGLENBQUMsQ0FBQztBQUVILDRCQUE0QjtBQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLHFIQUFxSDtJQUMzSCxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBRTNDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7UUFFeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7UUFFeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUM1RSxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUM1RSxDQUFDO1FBRUYsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFFdEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3JFO0NBQ0YsQ0FBQyxDQUFDO0FBR0gsc0JBQXNCO0FBQ3RCLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsOEJBQThCO0lBQ3BDLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUMxQixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNyRSxDQUFDLEFBQUM7UUFFSCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3hFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsYUFBYTtBQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUscUJBQXFCO0lBQzNCLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDakgsQ0FBQztRQUVGLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDNUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDeEU7Q0FDRixDQUFDLENBQUM7QUFFSCxhQUFhO0FBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSw4Q0FBOEM7SUFDcEQsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDekUsQ0FBQztRQUVGLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUN4RTtDQUNGLENBQUMsQ0FBQztBQUVILGFBQWE7QUFDYixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLDhDQUE4QztJQUNwRCxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBRTNDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUN6RSxDQUFDO1FBRUYsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1FBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3hFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsYUFBYTtBQUNiLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsd0RBQXdEO0lBQzlELE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDekcsQ0FBQztRQUVGLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDNUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ3pFLENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDeEU7Q0FDRixDQUFDLENBQUM7QUFFSCxlQUFlO0FBQ2YsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSx1QkFBdUI7SUFDN0IsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRyxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDM0UsQ0FBQztRQUVGLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUN4RTtDQUNGLENBQUMsQ0FBQztBQUVILGVBQWU7QUFDZixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLHVFQUF1RTtJQUM3RSxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBRTNDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFHLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUM1RSxDQUFDO1FBRUYsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1FBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3hFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsZUFBZTtBQUNmLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsNERBQTREO0lBQ2xFLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUcsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDNUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzNFLENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDeEU7Q0FDRixDQUFDLENBQUM7QUFFSCxlQUFlO0FBQ2YsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSx3RkFBd0Y7SUFDOUYsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRyxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDNUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUN4RTtDQUNGLENBQUMsQ0FBQztBQUVILGlCQUFpQjtBQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLGtFQUFrRTtJQUN4RSxNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBRTNDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUvQixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDeEU7Q0FDRixDQUFDLENBQUM7QUFFSCxpQkFBaUI7QUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxxRUFBcUU7SUFDM0UsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5QixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2hILENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDeEU7Q0FDRixDQUFDLENBQUM7QUFFSCxpQkFBaUI7QUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxxRUFBcUU7SUFDM0UsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5QixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDeEU7Q0FDRixDQUFDLENBQUM7QUFFSCxpQkFBaUI7QUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSxxRUFBcUU7SUFDM0UsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5QixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDeEU7Q0FDRixDQUFDLENBQUM7QUFFSCxpQkFBaUI7QUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSwwRUFBMEU7SUFDaEYsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDakgsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5QixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDNUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNoSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQ3hFO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsaUJBQWlCO0FBQ2pCLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDWixJQUFJLEVBQUUsMEVBQTBFO0lBQ2hGLE1BQU0sRUFBRSxFQUFDLEtBQVksRUFBRSxRQUE4QixFQUFFO1FBQ25ELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUMzQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFFM0MsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDakgsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRTtnQkFBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDakgsQ0FBQztRQUVGLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUN4RTtDQUNGLENBQUMsQ0FBQztBQUVILGlCQUFpQjtBQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ1osSUFBSSxFQUFFLDBFQUEwRTtJQUNoRixNQUFNLEVBQUUsRUFBQyxLQUFZLEVBQUUsUUFBOEIsRUFBRTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxBQUFDLEFBQUM7UUFDM0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBRTNDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5QixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQ2pILENBQUM7UUFFRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUM7S0FDeEU7Q0FDRixDQUFDLENBQUM7QUFFSCxpQkFBaUI7QUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNaLElBQUksRUFBRSx5RUFBeUU7SUFDL0UsTUFBTSxFQUFFLEVBQUMsS0FBWSxFQUFFLFFBQThCLEVBQUU7UUFDbkQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQUFBQyxBQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEFBQUMsQUFBQztRQUUzQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUNqSCxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDakgsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDMUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDNUUsQ0FBQztRQUVGLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDZCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUU7Z0JBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7YUFBQyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUM7U0FDM0UsQ0FBQztRQUVGLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU5QixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzVFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FB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Q0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzFFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzVFLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2QsRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO2dCQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQUMsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQzNFLENBQUM7UUFFRixLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtnQkFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQztTQUMxRSxDQUFDO1FBRUYsS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNkLEVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxF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