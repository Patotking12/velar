import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// Test to get staked
Clarinet.test({
  name: "Ensure we can get the staked by user this should return 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const call = chain.callReadOnlyFn("staking", "get-user-staked", [types.principal(deployer.address)], deployer.address)

      call.result.expectUint(0)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test to get staked
Clarinet.test({
  name: "Ensure we can get the staked by user after staking once, this should return 1000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      const call = chain.callReadOnlyFn("staking", "get-user-staked", [types.principal(wallet_1.address)], deployer.address)

      call.result.expectUint(1000)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test to get staked
Clarinet.test({
  name: "Ensure we can get the staked by user after staking 2 in different blocks, this should return 3000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineEmptyBlock(10)

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      const call = chain.callReadOnlyFn("staking", "get-user-staked", [types.principal(wallet_1.address)], deployer.address)

      call.result.expectUint(3000)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test to get staked
Clarinet.test({
  name: "Ensure we can get the staked by user after staking 2 and unstaking once in different blocks, this should return 2000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineEmptyBlock(10)

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlock(10)

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      const call = chain.callReadOnlyFn("staking", "get-user-staked", [types.principal(wallet_1.address)], deployer.address)

      call.result.expectUint(2000)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test get staked by all
Clarinet.test({
  name: "Ensure we can get staked by all users this should return 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("staking", "get-total-staked", [], deployer.address)
      ]);

      block.receipts[0].result.expectUint(0)
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to get staked by all
Clarinet.test({
  name: "Ensure we can get the staked by all after staking once, this should return 2000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      const call = chain.callReadOnlyFn("staking", "get-total-staked", [], deployer.address)

      call.result.expectUint(2000)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test to get staked by all
Clarinet.test({
  name: "Ensure we can get the staked by all after staking 2 in different blocks, this should return 6000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlock(10)

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], deployer.address)
      ])

      const call = chain.callReadOnlyFn("staking", "get-total-staked", [], deployer.address)

      call.result.expectUint(6000)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test to get staked by all
Clarinet.test({
  name: "Ensure we can get the staked by all after staking 2 and unstaking once in different blocks, this should return 4000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlock(10)

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], deployer.address)
      ])

      chain.mineEmptyBlock(10)

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], deployer.address)
      ])

      const call = chain.callReadOnlyFn("staking", "get-total-staked", [], deployer.address)

      call.result.expectUint(4000)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});


// Test get last block
Clarinet.test({
  name: "Ensure we can get last block",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("staking", "get-last-block", [], deployer.address)
      ]);

      block.receipts[0].result.expectUint(0)
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test stake
Clarinet.test({
  name: "Ensure we can stake",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      block.receipts[0].result.expectOk()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test stake
Clarinet.test({
  name: "Ensure we can not stake if MIN-STAKE not met",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(499)], wallet_1.address)
      ])

      block.receipts[0].result.expectErr()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test stake
Clarinet.test({
  name: "Ensure we can not stake if MIN-STAKE not met",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(499)], wallet_1.address)
      ])

      block.receipts[0].result.expectErr()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test stake
Clarinet.test({
  name: "Ensure we can not stake if not enough balance to stake",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(100), types.principal(wallet_1.address)], deployer.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(600)], wallet_1.address)
      ])

      block.receipts[0].result.expectErr()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test unstake
Clarinet.test({
  name: "Ensure we can unstake",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(1000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(200)], wallet_1.address)
      ])

      block.receipts[0].result.expectOk()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test unstake
Clarinet.test({
  name: "Ensure we can not unstake if we try to unstake more than what we have",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(1000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1001)], wallet_1.address)
      ])

      block.receipts[0].result.expectErr()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test unstake
Clarinet.test({
  name: "Ensure we can not unstake if MIN-STAKE not left in staking",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(1000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(600)], wallet_1.address)
      ])

      block.receipts[0].result.expectErr()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test unstake
Clarinet.test({
  name: "Ensure we can unstake if MIN-STAKE not left in staking but we are unstaking everything",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(1000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], wallet_1.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      block.receipts[0].result.expectOk()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineEmptyBlockUntil(100);

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(wallet_1.address),types.uint(10)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 2000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(wallet_1.address),types.uint(8)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 4000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(wallet_1.address),types.uint(15)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 6000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(wallet_1.address),types.uint(25)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 1000-3000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(deployer.address),types.uint(8)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 2000-6000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(deployer.address),types.uint(15)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 3000-9000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(deployer.address),types.uint(25)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 500-1500",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(deployer.address),types.uint(6)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 1000-3000",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(deployer.address),types.uint(16)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get-share
Clarinet.test({
  name: "Ensure we can get-share-at a specific block this should return 1500-4500",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(deployer.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(5);

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(10);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(15);

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(20);

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(2000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "stake", [types.uint(1000)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(25);

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(1000)], wallet_1.address)
      ])

      chain.mineBlock([
        Tx.contractCall("staking", "unstake", [types.uint(500)], deployer.address)
      ])

      chain.mineEmptyBlockUntil(30);

      const block = chain.mineBlock([
        Tx.contractCall("staking", "get-share-at", [types.principal(deployer.address),types.uint(26)], wallet_1.address)
      ])

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});