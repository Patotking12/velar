import { Clarinet, Tx, Chain, Account, types, EmptyBlock } from 'https://deno.land/x/clarinet@v1.6.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

// Test to get owner
Clarinet.test({
  name: "Ensure we can get the owner of the contract initially set to deployer",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const call = chain.callReadOnlyFn("core", "get-owner", [], deployer.address)

      call.result.expectPrincipal(deployer.address)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test change owner
Clarinet.test({
  name: "Ensure current owner can change the owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("core", "set-owner", [types.principal(wallet_1.address)], deployer.address)
      ]);

      block.receipts[0].result.expectOk()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test change owner
Clarinet.test({
  name: "Ensure that not owner can't change the owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("core", "set-owner", [types.principal(wallet_1.address)], wallet_1.address)
      ]);

      block.receipts[0].result.expectErr()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to get fee-to address
Clarinet.test({
  name: "Ensure we can get the fee-to of the contract initially set to deployer",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const call = chain.callReadOnlyFn("core", "get-fee-to", [], deployer.address)

      call.result.expectPrincipal(deployer.address)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test change fee-to
Clarinet.test({
  name: "Ensure current owner can change the fee-to address",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("core", "set-fee-to", [types.principal(wallet_1.address)], deployer.address)
      ]);

      block.receipts[0].result.expectOk()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test change fee-to
Clarinet.test({
  name: "Ensure that not owner can't change the fee-to address",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("core", "set-fee-to", [types.principal(wallet_1.address)], wallet_1.address)
      ]);

      block.receipts[0].result.expectErr()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to get rev-share address
Clarinet.test({
  name: "Ensure we can get the rev-share of the contract initially set to deployer",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const call = chain.callReadOnlyFn("core", "get-rev-share", [], deployer.address)

      call.result.expectPrincipal(deployer.address)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test change rev-share
Clarinet.test({
  name: "Ensure current owner can change the rev-share address",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("core", "set-rev-share", [types.principal(wallet_1.address)], deployer.address)
      ]);

      block.receipts[0].result.expectOk()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test change rev-share
Clarinet.test({
  name: "Ensure that not owner can't change the rev-share address",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("core", "set-rev-share", [types.principal(wallet_1.address)], wallet_1.address)
      ]);

      block.receipts[0].result.expectErr()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get nr-pools
Clarinet.test({
  name: "Ensure that nr-pools returns u0 if no pools have been created",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("core", "get-nr-pools", [], wallet_1.address)
      ]);

      block.receipts[0].result.expectUint(0)
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get nr-pools
Clarinet.test({
  name: "Ensure that nr-pools returns u1 if 1 pool has been created",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
          Tx.contractCall("core", "get-nr-pools", [], wallet_1.address)
      ]);

      block.receipts[0].result.expectUint(1)
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get pool information
Clarinet.test({
  name: "Ensure that we get none from a non existing pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
          Tx.contractCall("core", "get-pool", [types.uint(1)], wallet_1.address)
      ]);

      block.receipts[0].result.expectNone()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get pool information
Clarinet.test({
  name: "Ensure that we get pool information from an existing pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
          Tx.contractCall("core", "get-pool", [types.uint(1)], wallet_1.address)
      ]);

      block.receipts[0].result.expectSome()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get pool information
Clarinet.test({
  name: "Ensure that we get pool information from an existing pool with do-get-pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
          Tx.contractCall("core", "do-get-pool", [types.uint(1)], wallet_1.address)
      ]);

      block.receipts[0].result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get pool id
Clarinet.test({
  name: "Ensure that we get pool id from an existing pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
          Tx.contractCall("core", "get-pool-id", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"), types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar")], wallet_1.address)
      ]);

      block.receipts[0].result.expectSome().expectUint(1)
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get pool id
Clarinet.test({
  name: "Ensure that we get pool id from an existing pool with lookup-pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
          Tx.contractCall("core", "lookup-pool", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"), types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar")], wallet_1.address)
      ]);

      block.receipts[0].result.expectSome().expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test get pool id
Clarinet.test({
  name: "Ensure that we get pool id from an existing pool with lookup-pool flipped",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
          Tx.contractCall("core", "lookup-pool", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"), types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI")], wallet_1.address)
      ]);

      block.receipts[0].result.expectSome().expectTuple()
      console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to get revenue from a pool
Clarinet.test({
  name: "Ensure we get the revenue of an existing pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const call = chain.callReadOnlyFn("core", "do-get-revenue", [types.uint(1)], deployer.address)

      call.result.expectTuple()
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test to check-fee
Clarinet.test({
  name: "Ensure we get FALSE if fee is not bigger than guard",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const call = chain.callReadOnlyFn("core", "check-fee", [types.tuple({ num: types.uint(994), den: types.uint(1000) }), types.tuple({ num: types.uint(995), den: types.uint(1000) }),], deployer.address)

      call.result.expectBool(false)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test to check-fee
Clarinet.test({
  name: "Ensure we get TRUE if fee is bigger than guard",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const call = chain.callReadOnlyFn("core", "check-fee", [types.tuple({ num: types.uint(996), den: types.uint(1000) }), types.tuple({ num: types.uint(995), den: types.uint(1000) }),], deployer.address)

      call.result.expectBool(true)
      console.log('\x1b[32m' + JSON.stringify(call.result) + '\x1b[0m');
  },
});

// Test to update-swap-fee
Clarinet.test({
  name: "Ensure we can update the swap-fee if owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "update-swap-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], deployer.address)
    ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-swap-fee
Clarinet.test({
  name: "Ensure we can update the swap-fee if owner get information back",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "update-swap-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], deployer.address)
    ]);

    const block = chain.mineBlock([
      Tx.contractCall("core", "get-pool", [types.uint(1)], wallet_1.address)
    ]);

    block.receipts[0].result.expectSome()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-swap-fee
Clarinet.test({
  name: "Ensure we can not update the swap-fee if not owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "update-swap-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], wallet_1.address)
    ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-swap-fee
Clarinet.test({
  name: "Ensure we can not update the swap-fee if it is not bigger than MAX-SWAP-FEE",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "update-swap-fee", [types.uint(1),types.tuple({ num: types.uint(994), den: types.uint(1000) })], deployer.address)
    ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-protocol-fee
Clarinet.test({
  name: "Ensure we can update the protocol-fee if owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "update-protocol-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], deployer.address)
    ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-protocol-fee
Clarinet.test({
  name: "Ensure we can update the protocol-fee if owner get information back",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "update-protocol-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], deployer.address)
    ]);

    const block = chain.mineBlock([
      Tx.contractCall("core", "get-pool", [types.uint(1)], wallet_1.address)
    ]);

    block.receipts[0].result.expectSome()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-protocol-fee
Clarinet.test({
  name: "Ensure we can not update the protocol-fee if not owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "update-protocol-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], wallet_1.address)
    ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-share-fee
Clarinet.test({
  name: "Ensure we can update the share-fee if owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "update-share-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], deployer.address)
    ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-share-fee
Clarinet.test({
  name: "Ensure we can update the share-fee if owner get information back",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "update-share-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], deployer.address)
    ]);

    const block = chain.mineBlock([
      Tx.contractCall("core", "get-pool", [types.uint(1)], wallet_1.address)
    ]);

    block.receipts[0].result.expectSome()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to update-share-fee
Clarinet.test({
  name: "Ensure we can not update the share-fee if not owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "update-share-fee", [types.uint(1),types.tuple({ num: types.uint(998), den: types.uint(1000) })], wallet_1.address)
    ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can create a pool if owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create a pool if not owner",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create a pool even if tokens flipped",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create pool if same tokens",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create a pool if same tokens for second pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create a pool if same lp-token for second pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH-2"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create pool if swap-fee num bigger than den",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(1001), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create pool if protocol-fee num bigger than den",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(1001), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create pool if share-fee num bigger than den",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(1001), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to create a pool
Clarinet.test({
  name: "Ensure we can not create pool if swap-fee is smaller than MAX-SWAP-FEE",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      const block = chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(994), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to mint 
Clarinet.test({
  name: "Ensure we can mint to an existing pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to mint 
Clarinet.test({
  name: "Ensure we can mint twice to an existing pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000),
            types.uint(1000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(200000),
            types.uint(1)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to mint 
Clarinet.test({
  name: "Ensure we can mint twice to an existing pool and reserves are updated",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000),
            types.uint(1000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(200000),
            types.uint(1)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "get-pool", [types.uint(1)], wallet_1.address)
    ]);

    block.receipts[0].result.expectSome().expectTuple()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

////////////////////////////
////////////////////////////
////////// Failed //////////
////////////////////////////
////////////////////////////

// // Test to mint 
// Clarinet.test({
//   name: "Ensure we can mint to an existing pool even if tokens flipped",
//   async fn(chain: Chain, accounts: Map<string, Account>) {
//       const deployer = accounts.get("deployer")!;
//       const wallet_1 = accounts.get("wallet_1")!;

//       chain.mineBlock([
//         Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
//       ])

//       chain.mineBlock([
//         Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
//       ])

//       chain.mineBlock([
//         Tx.contractCall("core", "create", 
//           [
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
//             types.tuple({ num: types.uint(996), den: types.uint(1000) }),
//             types.tuple({ num: types.uint(996), den: types.uint(1000) }),
//             types.tuple({ num: types.uint(996), den: types.uint(1000) }),
//           ], deployer.address)
//       ]);

//       const block = chain.mineBlock([
//         Tx.contractCall("core", "mint", 
//           [
//             types.uint(1),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
//             types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
//             types.uint(100000),
//             types.uint(100000)
//           ], wallet_1.address)
//       ]);

//     block.receipts[0].result.expectOk()
//     console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
//   },
// });

// Test to mint 
Clarinet.test({
  name: "Ensure we can not mint to an existing pool if not the correct lp-token",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to mint 
Clarinet.test({
  name: "Ensure we can not mint to an existing pool if not the correct token-0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to mint 
Clarinet.test({
  name: "Ensure we can not mint to an existing pool if not the correct token-1",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to mint 
Clarinet.test({
  name: "Ensure we can not mint to an existing pool if token-0 is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(0),
            types.uint(100000)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to mint 
Clarinet.test({
  name: "Ensure we can not mint to an existing pool if token-1 is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(0)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can burn",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can burn when minting different amounts",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint",
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(1)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(316),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can burn when minting different amounts and we burn the total of our liquidity we receive back the total we added",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint",
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint",
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(1)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100001),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can burn when minting different amounts and we burn only 1 and then 1 again and again",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint",
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint",
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(1)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1),
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1),
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can burn when minting different amounts and we burn and reserves are updated",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint",
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint",
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(1)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1),
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "get-pool", [types.uint(1)], wallet_1.address)
    ]);

    block.receipts[0].result.expectSome().expectTuple()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can not burn if lp-token not the same as pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("ETH", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("ETH-2", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH-2"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(2),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH-2"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token-2"),
            types.uint(100000),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can not burn if token-0 not the same as pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can not burn if token-1 not the same as pool",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can not burn if liquidity is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(0),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can not burn if amt0 is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1),
            types.uint(100000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can not burn if amt1 is 1",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(100000),
            types.uint(1)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to burn 
Clarinet.test({
  name: "Ensure we can not burn if not enough balance to burn",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "burn", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000001),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can swap",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if token-in is not token-0 or token-1",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if token-out is not token-0 or token-1",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.ETH"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if token-in is equal to token-out",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if rev-share wrong",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if token-in is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(0),
            types.uint(995)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if token-in is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(0)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if token-out is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1),
            types.uint(1)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if not enought amount to transfer token-in",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(1000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(1000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can't swap if token-in is 0",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(996)
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we update revenue",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "do-get-revenue", 
          [
            types.uint(1)
          ], deployer.address)
      ]);

    block.receipts[0].result.expectTuple()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can collect",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "collect", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can not collect if tokens mixed",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "collect", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can not collect if not fee-to address",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "collect", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
          ], wallet_1.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can not collect if no revenue",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "collect", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can not collect if no revenue on token0 ",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000),
            types.uint(1000000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000),
            types.uint(995)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "collect", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Ensure we can not collect if no revenue on token1",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000000000),
            types.uint(1000000000000)
          ], wallet_1.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000000000),
            types.uint(995000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "collect", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
          ], deployer.address)
      ]);

    block.receipts[0].result.expectErr()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});

// Test to swap 
Clarinet.test({
  name: "Testing swap",
  async fn(chain: Chain, accounts: Map<string, Account>) {
      const deployer = accounts.get("deployer")!;
      const wallet_1 = accounts.get("wallet_1")!;

      chain.mineBlock([
        Tx.contractCall("DAI", "mint", [types.uint(10000000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("velar", "mint", [types.uint(10000000000000), types.principal(wallet_1.address)], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "set-rev-share", [types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor")], deployer.address)
      ])

      chain.mineBlock([
        Tx.contractCall("core", "create", 
          [
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
            types.tuple({ num: types.uint(996), den: types.uint(1000) }),
          ], deployer.address)
      ]);

      chain.mineBlock([
        Tx.contractCall("core", "mint", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lp-token"),
            types.uint(1000000000000),
            types.uint(1000000000000)
          ], wallet_1.address)
      ]);

      const block = chain.mineBlock([
        Tx.contractCall("core", "swap", 
          [
            types.uint(1),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.DAI"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.velar"),
            types.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.distributor"),
            types.uint(1000000000),
            types.uint(995008971)
          ], wallet_1.address)
      ]); 

    block.receipts[0].result.expectOk()
    console.log('\x1b[32m' + JSON.stringify(block.receipts) + '\x1b[0m');
  },
});