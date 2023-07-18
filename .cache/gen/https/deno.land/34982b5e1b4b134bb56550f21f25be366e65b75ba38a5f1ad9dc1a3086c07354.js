export class Tx {
    type;
    sender;
    contractCall;
    transferStx;
    deployContract;
    constructor(type, sender){
        this.type = type;
        this.sender = sender;
    }
    static transferSTX(amount, recipient, sender) {
        let tx = new Tx(1, sender);
        tx.transferStx = {
            recipient,
            amount
        };
        return tx;
    }
    static contractCall(contract, method, args, sender) {
        let tx = new Tx(2, sender);
        tx.contractCall = {
            contract,
            method,
            args
        };
        return tx;
    }
    static deployContract(name, code, sender) {
        let tx = new Tx(3, sender);
        tx.deployContract = {
            name,
            code
        };
        return tx;
    }
}
export class Chain {
    sessionId;
    blockHeight = 1;
    constructor(sessionId){
        this.sessionId = sessionId;
    }
    mineBlock(transactions) {
        let result = JSON.parse(Deno.core.opSync("api/v1/mine_block", {
            sessionId: this.sessionId,
            transactions: transactions
        }));
        this.blockHeight = result.block_height;
        let block = {
            height: result.block_height,
            receipts: result.receipts
        };
        return block;
    }
    mineEmptyBlock(count) {
        let result = JSON.parse(Deno.core.opSync("api/v1/mine_empty_blocks", {
            sessionId: this.sessionId,
            count: count
        }));
        this.blockHeight = result.block_height;
        let emptyBlock = {
            session_id: result.session_id,
            block_height: result.block_height
        };
        return emptyBlock;
    }
    mineEmptyBlockUntil(targetBlockHeight) {
        let count = targetBlockHeight - this.blockHeight;
        if (count < 0) {
            throw new Error(`Chain tip cannot be moved from ${this.blockHeight} to ${targetBlockHeight}`);
        }
        return this.mineEmptyBlock(count);
    }
    callReadOnlyFn(contract, method, args, sender) {
        let result = JSON.parse(Deno.core.opSync("api/v1/call_read_only_fn", {
            sessionId: this.sessionId,
            contract: contract,
            method: method,
            args: args,
            sender: sender
        }));
        let readOnlyFn = {
            session_id: result.session_id,
            result: result.result,
            events: result.events
        };
        return readOnlyFn;
    }
    getAssetsMaps() {
        let result = JSON.parse(Deno.core.opSync("api/v1/get_assets_maps", {
            sessionId: this.sessionId
        }));
        let assetsMaps = {
            session_id: result.session_id,
            assets: result.assets
        };
        return assetsMaps;
    }
}
export class Clarinet {
    static test(options) {
        Deno.test({
            name: options.name,
            only: options.only,
            ignore: options.ignore,
            async fn () {
                Deno.core.ops();
                let hasPreDeploymentSteps = options.preDeployment !== undefined;
                let result = JSON.parse(Deno.core.opSync("api/v1/new_session", {
                    name: options.name,
                    loadDeployment: !hasPreDeploymentSteps,
                    deploymentPath: options.deploymentPath
                }));
                if (options.preDeployment) {
                    let chain = new Chain(result["session_id"]);
                    let accounts = new Map();
                    for (let account of result["accounts"]){
                        accounts.set(account.name, account);
                    }
                    await options.preDeployment(chain, accounts);
                    result = JSON.parse(Deno.core.opSync("api/v1/load_deployment", {
                        sessionId: chain.sessionId,
                        deploymentPath: options.deploymentPath
                    }));
                }
                let chain1 = new Chain(result["session_id"]);
                let accounts1 = new Map();
                for (let account1 of result["accounts"]){
                    accounts1.set(account1.name, account1);
                }
                let contracts = new Map();
                for (let contract of result["contracts"]){
                    contracts.set(contract.contract_id, contract);
                }
                await options.fn(chain1, accounts1, contracts);
                JSON.parse(Deno.core.opSync("api/v1/terminate_session", {
                    sessionId: chain1.sessionId
                }));
            }
        });
    }
    static run(options) {
        Deno.test({
            name: "running script",
            async fn () {
                Deno.core.ops();
                let result = JSON.parse(Deno.core.opSync("api/v1/new_session", {
                    name: "running script",
                    loadDeployment: true,
                    deploymentPath: undefined
                }));
                let accounts = new Map();
                for (let account of result["accounts"]){
                    accounts.set(account.name, account);
                }
                let contracts = new Map();
                for (let contract of result["contracts"]){
                    contracts.set(contract.contract_id, contract);
                }
                let stacks_node = {
                    url: result["stacks_node_url"]
                };
                await options.fn(accounts, contracts, stacks_node);
            }
        });
    }
}
export var types;
(function(types) {
    const byteToHex = [];
    for(let n = 0; n <= 0xff; ++n){
        const hexOctet = n.toString(16).padStart(2, "0");
        byteToHex.push(hexOctet);
    }
    function serializeTuple(input) {
        let items = [];
        for (var [key, value] of Object.entries(input)){
            if (typeof value === "object") {
                items.push(`${key}: { ${serializeTuple(value)} }`);
            } else if (Array.isArray(value)) {
            // todo(ludo): not supported, should panic
            } else {
                items.push(`${key}: ${value}`);
            }
        }
        return items.join(", ");
    }
    function isObject(obj) {
        return typeof obj === "object" && !Array.isArray(obj);
    }
    function ok(val) {
        return `(ok ${val})`;
    }
    types.ok = ok;
    function err(val) {
        return `(err ${val})`;
    }
    types.err = err;
    function some(val) {
        return `(some ${val})`;
    }
    types.some = some;
    function none() {
        return `none`;
    }
    types.none = none;
    function bool(val) {
        return `${val}`;
    }
    types.bool = bool;
    function int(val) {
        return `${val}`;
    }
    types.int = int;
    function uint(val) {
        return `u${val}`;
    }
    types.uint = uint;
    function ascii(val) {
        return `"${val}"`;
    }
    types.ascii = ascii;
    function utf8(val) {
        return `u"${val}"`;
    }
    types.utf8 = utf8;
    function buff(val) {
        const buff = typeof val == "string" ? new TextEncoder().encode(val) : new Uint8Array(val);
        const hexOctets = new Array(buff.length);
        for(let i = 0; i < buff.length; ++i){
            hexOctets[i] = byteToHex[buff[i]];
        }
        return `0x${hexOctets.join("")}`;
    }
    types.buff = buff;
    function list(val) {
        return `(list ${val.join(" ")})`;
    }
    types.list = list;
    function principal(val) {
        return `'${val}`;
    }
    types.principal = principal;
    function tuple(val) {
        return `{ ${serializeTuple(val)} }`;
    }
    types.tuple = tuple;
})(types || (types = {}));
function consume(src, expectation, wrapped) {
    let dst = (" " + src).slice(1);
    let size = expectation.length;
    if (!wrapped && src !== expectation) {
        throw new Error(`Expected ${green(expectation.toString())}, got ${red(src.toString())}`);
    }
    if (wrapped) {
        size += 2;
    }
    if (dst.length < size) {
        throw new Error(`Expected ${green(expectation.toString())}, got ${red(src.toString())}`);
    }
    if (wrapped) {
        dst = dst.substring(1, dst.length - 1);
    }
    let res = dst.slice(0, expectation.length);
    if (res !== expectation) {
        throw new Error(`Expected ${green(expectation.toString())}, got ${red(src.toString())}`);
    }
    let leftPad = 0;
    if (dst.charAt(expectation.length) === " ") {
        leftPad = 1;
    }
    let remainder = dst.substring(expectation.length + leftPad);
    return remainder;
}
String.prototype.expectOk = function() {
    return consume(this, "ok", true);
};
String.prototype.expectErr = function() {
    return consume(this, "err", true);
};
String.prototype.expectSome = function() {
    return consume(this, "some", true);
};
String.prototype.expectNone = function() {
    return consume(this, "none", false);
};
String.prototype.expectBool = function(value) {
    try {
        consume(this, `${value}`, false);
    } catch (error) {
        throw error;
    }
    return value;
};
String.prototype.expectUint = function(value) {
    try {
        consume(this, `u${value}`, false);
    } catch (error) {
        throw error;
    }
    return BigInt(value);
};
String.prototype.expectInt = function(value) {
    try {
        consume(this, `${value}`, false);
    } catch (error) {
        throw error;
    }
    return BigInt(value);
};
String.prototype.expectBuff = function(value) {
    let buffer = types.buff(value);
    if (this !== buffer) {
        throw new Error(`Expected ${green(buffer)}, got ${red(this.toString())}`);
    }
    return value;
};
String.prototype.expectAscii = function(value) {
    try {
        consume(this, `"${value}"`, false);
    } catch (error) {
        throw error;
    }
    return value;
};
String.prototype.expectUtf8 = function(value) {
    try {
        consume(this, `u"${value}"`, false);
    } catch (error) {
        throw error;
    }
    return value;
};
String.prototype.expectPrincipal = function(value) {
    try {
        consume(this, `${value}`, false);
    } catch (error) {
        throw error;
    }
    return value;
};
String.prototype.expectList = function() {
    if (this.charAt(0) !== "[" || this.charAt(this.length - 1) !== "]") {
        throw new Error(`Expected ${green("(list ...)")}, got ${red(this.toString())}`);
    }
    let stack = [];
    let elements = [];
    let start = 1;
    for(var i = 0; i < this.length; i++){
        if (this.charAt(i) === "," && stack.length == 1) {
            elements.push(this.substring(start, i));
            start = i + 2;
        }
        if ([
            "(",
            "[",
            "{"
        ].includes(this.charAt(i))) {
            stack.push(this.charAt(i));
        }
        if (this.charAt(i) === ")" && stack[stack.length - 1] === "(") {
            stack.pop();
        }
        if (this.charAt(i) === "}" && stack[stack.length - 1] === "{") {
            stack.pop();
        }
        if (this.charAt(i) === "]" && stack[stack.length - 1] === "[") {
            stack.pop();
        }
    }
    let remainder = this.substring(start, this.length - 1);
    if (remainder.length > 0) {
        elements.push(remainder);
    }
    return elements;
};
String.prototype.expectTuple = function() {
    if (this.charAt(0) !== "{" || this.charAt(this.length - 1) !== "}") {
        throw new Error(`Expected ${green("(tuple ...)")}, got ${red(this.toString())}`);
    }
    let start = 1;
    let stack = [];
    let elements = [];
    for(var i = 0; i < this.length; i++){
        if (this.charAt(i) === "," && stack.length == 1) {
            elements.push(this.substring(start, i));
            start = i + 2;
        }
        if ([
            "(",
            "[",
            "{"
        ].includes(this.charAt(i))) {
            stack.push(this.charAt(i));
        }
        if (this.charAt(i) === ")" && stack[stack.length - 1] === "(") {
            stack.pop();
        }
        if (this.charAt(i) === "}" && stack[stack.length - 1] === "{") {
            stack.pop();
        }
        if (this.charAt(i) === "]" && stack[stack.length - 1] === "[") {
            stack.pop();
        }
    }
    let remainder = this.substring(start, this.length - 1);
    if (remainder.length > 0) {
        elements.push(remainder);
    }
    let tuple = {};
    for (let element of elements){
        for(var i = 0; i < element.length; i++){
            if (element.charAt(i) === ":") {
                let key = element.substring(0, i);
                let value = element.substring(i + 2, element.length);
                tuple[key] = value;
                break;
            }
        }
    }
    return tuple;
};
Array.prototype.expectSTXTransferEvent = function(amount, sender, recipient) {
    for (let event of this){
        try {
            let e = {};
            e["amount"] = event.stx_transfer_event.amount.expectInt(amount);
            e["sender"] = event.stx_transfer_event.sender.expectPrincipal(sender);
            e["recipient"] = event.stx_transfer_event.recipient.expectPrincipal(recipient);
            return e;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`Unable to retrieve expected STXTransferEvent`);
};
Array.prototype.expectFungibleTokenTransferEvent = function(amount, sender, recipient, assetId) {
    for (let event of this){
        try {
            let e = {};
            e["amount"] = event.ft_transfer_event.amount.expectInt(amount);
            e["sender"] = event.ft_transfer_event.sender.expectPrincipal(sender);
            e["recipient"] = event.ft_transfer_event.recipient.expectPrincipal(recipient);
            if (event.ft_transfer_event.asset_identifier.endsWith(assetId)) {
                e["assetId"] = event.ft_transfer_event.asset_identifier;
            } else {
                continue;
            }
            return e;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`Unable to retrieve expected FungibleTokenTransferEvent(${amount}, ${sender}, ${recipient}, ${assetId})\n${JSON.stringify(this)}`);
};
Array.prototype.expectFungibleTokenMintEvent = function(amount, recipient, assetId) {
    for (let event of this){
        try {
            let e = {};
            e["amount"] = event.ft_mint_event.amount.expectInt(amount);
            e["recipient"] = event.ft_mint_event.recipient.expectPrincipal(recipient);
            if (event.ft_mint_event.asset_identifier.endsWith(assetId)) {
                e["assetId"] = event.ft_mint_event.asset_identifier;
            } else {
                continue;
            }
            return e;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`Unable to retrieve expected FungibleTokenMintEvent`);
};
Array.prototype.expectFungibleTokenBurnEvent = function(amount, sender, assetId) {
    for (let event of this){
        try {
            let e = {};
            e["amount"] = event.ft_burn_event.amount.expectInt(amount);
            e["sender"] = event.ft_burn_event.sender.expectPrincipal(sender);
            if (event.ft_burn_event.asset_identifier.endsWith(assetId)) {
                e["assetId"] = event.ft_burn_event.asset_identifier;
            } else {
                continue;
            }
            return e;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`Unable to retrieve expected FungibleTokenBurnEvent`);
};
Array.prototype.expectPrintEvent = function(contract_identifier, value) {
    for (let event of this){
        try {
            let e = {};
            e["contract_identifier"] = event.contract_event.contract_identifier.expectPrincipal(contract_identifier);
            if (event.contract_event.topic.endsWith("print")) {
                e["topic"] = event.contract_event.topic;
            } else {
                continue;
            }
            if (event.contract_event.value.endsWith(value)) {
                e["value"] = event.contract_event.value;
            } else {
                continue;
            }
            return e;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`Unable to retrieve expected PrintEvent`);
};
// Array.prototype.expectEvent = function(sel: (e: Object) => Object) {
//     for (let event of this) {
//         try {
//             sel(event);
//             return event as Object;
//         } catch (error) {
//             continue;
//         }
//     }
//     throw new Error(`Unable to retrieve expected PrintEvent`);
// }
Array.prototype.expectNonFungibleTokenTransferEvent = function(tokenId, sender, recipient, assetAddress, assetId) {
    for (let event of this){
        try {
            let e = {};
            if (event.nft_transfer_event.value === tokenId) {
                e["tokenId"] = event.nft_transfer_event.value;
            } else {
                continue;
            }
            e["sender"] = event.nft_transfer_event.sender.expectPrincipal(sender);
            e["recipient"] = event.nft_transfer_event.recipient.expectPrincipal(recipient);
            if (event.nft_transfer_event.asset_identifier === `${assetAddress}::${assetId}`) {
                e["assetId"] = event.nft_transfer_event.asset_identifier;
            } else {
                continue;
            }
            return e;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`Unable to retrieve expected NonFungibleTokenTransferEvent`);
};
Array.prototype.expectNonFungibleTokenMintEvent = function(tokenId, recipient, assetAddress, assetId) {
    for (let event of this){
        try {
            let e = {};
            if (event.nft_mint_event.value === tokenId) {
                e["tokenId"] = event.nft_mint_event.value;
            } else {
                continue;
            }
            e["recipient"] = event.nft_mint_event.recipient.expectPrincipal(recipient);
            if (event.nft_mint_event.asset_identifier === `${assetAddress}::${assetId}`) {
                e["assetId"] = event.nft_mint_event.asset_identifier;
            } else {
                continue;
            }
            return e;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`Unable to retrieve expected NonFungibleTokenMintEvent`);
};
Array.prototype.expectNonFungibleTokenBurnEvent = function(tokenId, sender, assetAddress, assetId) {
    for (let event of this){
        try {
            let e = {};
            if (event.nft_burn_event.value === tokenId) {
                e["tokenId"] = event.nft_burn_event.value;
            } else {
                continue;
            }
            e["sender"] = event.nft_burn_event.sender.expectPrincipal(sender);
            if (event.nft_burn_event.asset_identifier === `${assetAddress}::${assetId}`) {
                e["assetId"] = event.nft_burn_event.asset_identifier;
            } else {
                continue;
            }
            return e;
        } catch (error) {
            continue;
        }
    }
    throw new Error(`Unable to retrieve expected NonFungibleTokenBurnEvent`);
};
const noColor = globalThis.Deno?.noColor ?? true;
let enabled = !noColor;
function code(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str, code) {
    return enabled ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}` : str;
}
export function red(str) {
    return run(str, code([
        31
    ], 39));
}
export function green(str) {
    return run(str, code([
        32
    ], 39));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vZGVuby5sYW5kL3gvY2xhcmluZXRAdjAuMzEuMC9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgVHgge1xuICB0eXBlOiBudW1iZXI7XG4gIHNlbmRlcjogc3RyaW5nO1xuICBjb250cmFjdENhbGw/OiBUeENvbnRyYWN0Q2FsbDtcbiAgdHJhbnNmZXJTdHg/OiBUeFRyYW5zZmVyO1xuICBkZXBsb3lDb250cmFjdD86IFR4RGVwbG95Q29udHJhY3Q7XG5cbiAgY29uc3RydWN0b3IodHlwZTogbnVtYmVyLCBzZW5kZXI6IHN0cmluZykge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5zZW5kZXIgPSBzZW5kZXI7XG4gIH1cblxuICBzdGF0aWMgdHJhbnNmZXJTVFgoYW1vdW50OiBudW1iZXIsIHJlY2lwaWVudDogc3RyaW5nLCBzZW5kZXI6IHN0cmluZykge1xuICAgIGxldCB0eCA9IG5ldyBUeCgxLCBzZW5kZXIpO1xuICAgIHR4LnRyYW5zZmVyU3R4ID0ge1xuICAgICAgcmVjaXBpZW50LFxuICAgICAgYW1vdW50LFxuICAgIH07XG4gICAgcmV0dXJuIHR4O1xuICB9XG5cbiAgc3RhdGljIGNvbnRyYWN0Q2FsbChcbiAgICBjb250cmFjdDogc3RyaW5nLFxuICAgIG1ldGhvZDogc3RyaW5nLFxuICAgIGFyZ3M6IEFycmF5PHN0cmluZz4sXG4gICAgc2VuZGVyOiBzdHJpbmcsXG4gICkge1xuICAgIGxldCB0eCA9IG5ldyBUeCgyLCBzZW5kZXIpO1xuICAgIHR4LmNvbnRyYWN0Q2FsbCA9IHtcbiAgICAgIGNvbnRyYWN0LFxuICAgICAgbWV0aG9kLFxuICAgICAgYXJncyxcbiAgICB9O1xuICAgIHJldHVybiB0eDtcbiAgfVxuXG4gIHN0YXRpYyBkZXBsb3lDb250cmFjdChuYW1lOiBzdHJpbmcsIGNvZGU6IHN0cmluZywgc2VuZGVyOiBzdHJpbmcpIHtcbiAgICBsZXQgdHggPSBuZXcgVHgoMywgc2VuZGVyKTtcbiAgICB0eC5kZXBsb3lDb250cmFjdCA9IHtcbiAgICAgIG5hbWUsXG4gICAgICBjb2RlLFxuICAgIH07XG4gICAgcmV0dXJuIHR4O1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHhDb250cmFjdENhbGwge1xuICBjb250cmFjdDogc3RyaW5nO1xuICBtZXRob2Q6IHN0cmluZztcbiAgYXJnczogQXJyYXk8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUeERlcGxveUNvbnRyYWN0IHtcbiAgY29kZTogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHhUcmFuc2ZlciB7XG4gIGFtb3VudDogbnVtYmVyO1xuICByZWNpcGllbnQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUeFJlY2VpcHQge1xuICByZXN1bHQ6IHN0cmluZztcbiAgZXZlbnRzOiBBcnJheTxhbnk+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrIHtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHJlY2VpcHRzOiBBcnJheTxUeFJlY2VpcHQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjY291bnQge1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGJhbGFuY2U6IG51bWJlcjtcbiAgbmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYWluIHtcbiAgc2Vzc2lvbklkOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVhZE9ubHlGbiB7XG4gIHNlc3Npb25faWQ6IG51bWJlcjtcbiAgcmVzdWx0OiBzdHJpbmc7XG4gIGV2ZW50czogQXJyYXk8YW55Pjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbXB0eUJsb2NrIHtcbiAgc2Vzc2lvbl9pZDogbnVtYmVyO1xuICBibG9ja19oZWlnaHQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3NldHNNYXBzIHtcbiAgc2Vzc2lvbl9pZDogbnVtYmVyO1xuICBhc3NldHM6IHtcbiAgICBbbmFtZTogc3RyaW5nXToge1xuICAgICAgW293bmVyOiBzdHJpbmddOiBudW1iZXI7XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIENoYWluIHtcbiAgc2Vzc2lvbklkOiBudW1iZXI7XG4gIGJsb2NrSGVpZ2h0OiBudW1iZXIgPSAxO1xuXG4gIGNvbnN0cnVjdG9yKHNlc3Npb25JZDogbnVtYmVyKSB7XG4gICAgdGhpcy5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XG4gIH1cblxuICBtaW5lQmxvY2sodHJhbnNhY3Rpb25zOiBBcnJheTxUeD4pOiBCbG9jayB7XG4gICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoKERlbm8gYXMgYW55KS5jb3JlLm9wU3luYyhcImFwaS92MS9taW5lX2Jsb2NrXCIsIHtcbiAgICAgIHNlc3Npb25JZDogdGhpcy5zZXNzaW9uSWQsXG4gICAgICB0cmFuc2FjdGlvbnM6IHRyYW5zYWN0aW9ucyxcbiAgICB9KSk7XG4gICAgdGhpcy5ibG9ja0hlaWdodCA9IHJlc3VsdC5ibG9ja19oZWlnaHQ7XG4gICAgbGV0IGJsb2NrOiBCbG9jayA9IHtcbiAgICAgIGhlaWdodDogcmVzdWx0LmJsb2NrX2hlaWdodCxcbiAgICAgIHJlY2VpcHRzOiByZXN1bHQucmVjZWlwdHMsXG4gICAgfTtcbiAgICByZXR1cm4gYmxvY2s7XG4gIH1cblxuICBtaW5lRW1wdHlCbG9jayhjb3VudDogbnVtYmVyKTogRW1wdHlCbG9jayB7XG4gICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoXG4gICAgICAoRGVubyBhcyBhbnkpLmNvcmUub3BTeW5jKFwiYXBpL3YxL21pbmVfZW1wdHlfYmxvY2tzXCIsIHtcbiAgICAgICAgc2Vzc2lvbklkOiB0aGlzLnNlc3Npb25JZCxcbiAgICAgICAgY291bnQ6IGNvdW50LFxuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLmJsb2NrSGVpZ2h0ID0gcmVzdWx0LmJsb2NrX2hlaWdodDtcbiAgICBsZXQgZW1wdHlCbG9jazogRW1wdHlCbG9jayA9IHtcbiAgICAgIHNlc3Npb25faWQ6IHJlc3VsdC5zZXNzaW9uX2lkLFxuICAgICAgYmxvY2tfaGVpZ2h0OiByZXN1bHQuYmxvY2tfaGVpZ2h0LFxuICAgIH07XG4gICAgcmV0dXJuIGVtcHR5QmxvY2s7XG4gIH1cblxuICBtaW5lRW1wdHlCbG9ja1VudGlsKHRhcmdldEJsb2NrSGVpZ2h0OiBudW1iZXIpOiBFbXB0eUJsb2NrIHtcbiAgICBsZXQgY291bnQgPSB0YXJnZXRCbG9ja0hlaWdodCAtIHRoaXMuYmxvY2tIZWlnaHQ7XG4gICAgaWYgKGNvdW50IDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQ2hhaW4gdGlwIGNhbm5vdCBiZSBtb3ZlZCBmcm9tICR7dGhpcy5ibG9ja0hlaWdodH0gdG8gJHt0YXJnZXRCbG9ja0hlaWdodH1gLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMubWluZUVtcHR5QmxvY2soY291bnQpO1xuICB9XG5cbiAgY2FsbFJlYWRPbmx5Rm4oXG4gICAgY29udHJhY3Q6IHN0cmluZyxcbiAgICBtZXRob2Q6IHN0cmluZyxcbiAgICBhcmdzOiBBcnJheTxhbnk+LFxuICAgIHNlbmRlcjogc3RyaW5nLFxuICApOiBSZWFkT25seUZuIHtcbiAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZShcbiAgICAgIChEZW5vIGFzIGFueSkuY29yZS5vcFN5bmMoXCJhcGkvdjEvY2FsbF9yZWFkX29ubHlfZm5cIiwge1xuICAgICAgICBzZXNzaW9uSWQ6IHRoaXMuc2Vzc2lvbklkLFxuICAgICAgICBjb250cmFjdDogY29udHJhY3QsXG4gICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICBzZW5kZXI6IHNlbmRlcixcbiAgICAgIH0pLFxuICAgICk7XG4gICAgbGV0IHJlYWRPbmx5Rm46IFJlYWRPbmx5Rm4gPSB7XG4gICAgICBzZXNzaW9uX2lkOiByZXN1bHQuc2Vzc2lvbl9pZCxcbiAgICAgIHJlc3VsdDogcmVzdWx0LnJlc3VsdCxcbiAgICAgIGV2ZW50czogcmVzdWx0LmV2ZW50cyxcbiAgICB9O1xuICAgIHJldHVybiByZWFkT25seUZuO1xuICB9XG5cbiAgZ2V0QXNzZXRzTWFwcygpOiBBc3NldHNNYXBzIHtcbiAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZShcbiAgICAgIChEZW5vIGFzIGFueSkuY29yZS5vcFN5bmMoXCJhcGkvdjEvZ2V0X2Fzc2V0c19tYXBzXCIsIHtcbiAgICAgICAgc2Vzc2lvbklkOiB0aGlzLnNlc3Npb25JZCxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgbGV0IGFzc2V0c01hcHM6IEFzc2V0c01hcHMgPSB7XG4gICAgICBzZXNzaW9uX2lkOiByZXN1bHQuc2Vzc2lvbl9pZCxcbiAgICAgIGFzc2V0czogcmVzdWx0LmFzc2V0cyxcbiAgICB9O1xuICAgIHJldHVybiBhc3NldHNNYXBzO1xuICB9XG59XG5cbnR5cGUgUHJlRGVwbG95bWVudEZ1bmN0aW9uID0gKFxuICBjaGFpbjogQ2hhaW4sXG4gIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50PixcbikgPT4gdm9pZCB8IFByb21pc2U8dm9pZD47XG5cbnR5cGUgVGVzdEZ1bmN0aW9uID0gKFxuICBjaGFpbjogQ2hhaW4sXG4gIGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50PixcbiAgY29udHJhY3RzOiBNYXA8c3RyaW5nLCBDb250cmFjdD4sXG4pID0+IHZvaWQgfCBQcm9taXNlPHZvaWQ+O1xudHlwZSBQcmVTZXR1cEZ1bmN0aW9uID0gKCkgPT4gQXJyYXk8VHg+O1xuXG5pbnRlcmZhY2UgVW5pdFRlc3RPcHRpb25zIHtcbiAgbmFtZTogc3RyaW5nO1xuICBvbmx5PzogdHJ1ZTtcbiAgaWdub3JlPzogdHJ1ZTtcbiAgZGVwbG95bWVudFBhdGg/OiBzdHJpbmc7XG4gIHByZURlcGxveW1lbnQ/OiBQcmVEZXBsb3ltZW50RnVuY3Rpb247XG4gIGZuOiBUZXN0RnVuY3Rpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udHJhY3Qge1xuICBjb250cmFjdF9pZDogc3RyaW5nO1xuICBzb3VyY2U6IHN0cmluZztcbiAgY29udHJhY3RfaW50ZXJmYWNlOiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhY2tzTm9kZSB7XG4gIHVybDogc3RyaW5nO1xufVxuXG50eXBlIFNjcmlwdEZ1bmN0aW9uID0gKFxuICBhY2NvdW50czogTWFwPHN0cmluZywgQWNjb3VudD4sXG4gIGNvbnRyYWN0czogTWFwPHN0cmluZywgQ29udHJhY3Q+LFxuICBub2RlOiBTdGFja3NOb2RlLFxuKSA9PiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcblxuaW50ZXJmYWNlIFNjcmlwdE9wdGlvbnMge1xuICBmbjogU2NyaXB0RnVuY3Rpb247XG59XG5cbmV4cG9ydCBjbGFzcyBDbGFyaW5ldCB7XG4gIHN0YXRpYyB0ZXN0KG9wdGlvbnM6IFVuaXRUZXN0T3B0aW9ucykge1xuICAgIERlbm8udGVzdCh7XG4gICAgICBuYW1lOiBvcHRpb25zLm5hbWUsXG4gICAgICBvbmx5OiBvcHRpb25zLm9ubHksXG4gICAgICBpZ25vcmU6IG9wdGlvbnMuaWdub3JlLFxuICAgICAgYXN5bmMgZm4oKSB7XG4gICAgICAgIChEZW5vIGFzIGFueSkuY29yZS5vcHMoKTtcblxuICAgICAgICBsZXQgaGFzUHJlRGVwbG95bWVudFN0ZXBzID0gb3B0aW9ucy5wcmVEZXBsb3ltZW50ICE9PSB1bmRlZmluZWQ7XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgKERlbm8gYXMgYW55KS5jb3JlLm9wU3luYyhcImFwaS92MS9uZXdfc2Vzc2lvblwiLCB7XG4gICAgICAgICAgICBuYW1lOiBvcHRpb25zLm5hbWUsXG4gICAgICAgICAgICBsb2FkRGVwbG95bWVudDogIWhhc1ByZURlcGxveW1lbnRTdGVwcyxcbiAgICAgICAgICAgIGRlcGxveW1lbnRQYXRoOiBvcHRpb25zLmRlcGxveW1lbnRQYXRoLFxuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnByZURlcGxveW1lbnQpIHtcbiAgICAgICAgICBsZXQgY2hhaW4gPSBuZXcgQ2hhaW4ocmVzdWx0W1wic2Vzc2lvbl9pZFwiXSk7XG4gICAgICAgICAgbGV0IGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50PiA9IG5ldyBNYXAoKTtcbiAgICAgICAgICBmb3IgKGxldCBhY2NvdW50IG9mIHJlc3VsdFtcImFjY291bnRzXCJdKSB7XG4gICAgICAgICAgICBhY2NvdW50cy5zZXQoYWNjb3VudC5uYW1lLCBhY2NvdW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYXdhaXQgb3B0aW9ucy5wcmVEZXBsb3ltZW50KGNoYWluLCBhY2NvdW50cyk7XG5cbiAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgKERlbm8gYXMgYW55KS5jb3JlLm9wU3luYyhcImFwaS92MS9sb2FkX2RlcGxveW1lbnRcIiwge1xuICAgICAgICAgICAgICBzZXNzaW9uSWQ6IGNoYWluLnNlc3Npb25JZCxcbiAgICAgICAgICAgICAgZGVwbG95bWVudFBhdGg6IG9wdGlvbnMuZGVwbG95bWVudFBhdGgsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoYWluID0gbmV3IENoYWluKHJlc3VsdFtcInNlc3Npb25faWRcIl0pO1xuICAgICAgICBsZXQgYWNjb3VudHM6IE1hcDxzdHJpbmcsIEFjY291bnQ+ID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IgKGxldCBhY2NvdW50IG9mIHJlc3VsdFtcImFjY291bnRzXCJdKSB7XG4gICAgICAgICAgYWNjb3VudHMuc2V0KGFjY291bnQubmFtZSwgYWNjb3VudCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbnRyYWN0czogTWFwPHN0cmluZywgQ29udHJhY3Q+ID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IgKGxldCBjb250cmFjdCBvZiByZXN1bHRbXCJjb250cmFjdHNcIl0pIHtcbiAgICAgICAgICBjb250cmFjdHMuc2V0KGNvbnRyYWN0LmNvbnRyYWN0X2lkLCBjb250cmFjdCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgb3B0aW9ucy5mbihjaGFpbiwgYWNjb3VudHMsIGNvbnRyYWN0cyk7XG5cbiAgICAgICAgSlNPTi5wYXJzZSgoRGVubyBhcyBhbnkpLmNvcmUub3BTeW5jKFwiYXBpL3YxL3Rlcm1pbmF0ZV9zZXNzaW9uXCIsIHtcbiAgICAgICAgICBzZXNzaW9uSWQ6IGNoYWluLnNlc3Npb25JZCxcbiAgICAgICAgfSkpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBydW4ob3B0aW9uczogU2NyaXB0T3B0aW9ucykge1xuICAgIERlbm8udGVzdCh7XG4gICAgICBuYW1lOiBcInJ1bm5pbmcgc2NyaXB0XCIsXG4gICAgICBhc3luYyBmbigpIHtcbiAgICAgICAgKERlbm8gYXMgYW55KS5jb3JlLm9wcygpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZShcbiAgICAgICAgICAoRGVubyBhcyBhbnkpLmNvcmUub3BTeW5jKFwiYXBpL3YxL25ld19zZXNzaW9uXCIsIHtcbiAgICAgICAgICAgIG5hbWU6IFwicnVubmluZyBzY3JpcHRcIixcbiAgICAgICAgICAgIGxvYWREZXBsb3ltZW50OiB0cnVlLFxuICAgICAgICAgICAgZGVwbG95bWVudFBhdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IGFjY291bnRzOiBNYXA8c3RyaW5nLCBBY2NvdW50PiA9IG5ldyBNYXAoKTtcbiAgICAgICAgZm9yIChsZXQgYWNjb3VudCBvZiByZXN1bHRbXCJhY2NvdW50c1wiXSkge1xuICAgICAgICAgIGFjY291bnRzLnNldChhY2NvdW50Lm5hbWUsIGFjY291bnQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb250cmFjdHM6IE1hcDxzdHJpbmcsIENvbnRyYWN0PiA9IG5ldyBNYXAoKTtcbiAgICAgICAgZm9yIChsZXQgY29udHJhY3Qgb2YgcmVzdWx0W1wiY29udHJhY3RzXCJdKSB7XG4gICAgICAgICAgY29udHJhY3RzLnNldChjb250cmFjdC5jb250cmFjdF9pZCwgY29udHJhY3QpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFja3Nfbm9kZTogU3RhY2tzTm9kZSA9IHtcbiAgICAgICAgICB1cmw6IHJlc3VsdFtcInN0YWNrc19ub2RlX3VybFwiXSxcbiAgICAgICAgfTtcbiAgICAgICAgYXdhaXQgb3B0aW9ucy5mbihhY2NvdW50cywgY29udHJhY3RzLCBzdGFja3Nfbm9kZSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgdHlwZXMge1xuICBjb25zdCBieXRlVG9IZXg6IGFueSA9IFtdO1xuICBmb3IgKGxldCBuID0gMDsgbiA8PSAweGZmOyArK24pIHtcbiAgICBjb25zdCBoZXhPY3RldCA9IG4udG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKTtcbiAgICBieXRlVG9IZXgucHVzaChoZXhPY3RldCk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXJpYWxpemVUdXBsZShpbnB1dDogT2JqZWN0KSB7XG4gICAgbGV0IGl0ZW1zOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgZm9yICh2YXIgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGlucHV0KSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBpdGVtcy5wdXNoKGAke2tleX06IHsgJHtzZXJpYWxpemVUdXBsZSh2YWx1ZSl9IH1gKTtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgLy8gdG9kbyhsdWRvKTogbm90IHN1cHBvcnRlZCwgc2hvdWxkIHBhbmljXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtcy5wdXNoKGAke2tleX06ICR7dmFsdWV9YCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpdGVtcy5qb2luKFwiLCBcIik7XG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChvYmo6IGFueSkge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KG9iaik7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gb2sodmFsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYChvayAke3ZhbH0pYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBlcnIodmFsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYChlcnIgJHt2YWx9KWA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gc29tZSh2YWw6IHN0cmluZykge1xuICAgIHJldHVybiBgKHNvbWUgJHt2YWx9KWA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gbm9uZSgpIHtcbiAgICByZXR1cm4gYG5vbmVgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJvb2wodmFsOiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGAke3ZhbH1gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGludCh2YWw6IG51bWJlciB8IGJpZ2ludCkge1xuICAgIHJldHVybiBgJHt2YWx9YDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiB1aW50KHZhbDogbnVtYmVyIHwgYmlnaW50KSB7XG4gICAgcmV0dXJuIGB1JHt2YWx9YDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBhc2NpaSh2YWw6IHN0cmluZykge1xuICAgIHJldHVybiBgXCIke3ZhbH1cImA7XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gdXRmOCh2YWw6IHN0cmluZykge1xuICAgIHJldHVybiBgdVwiJHt2YWx9XCJgO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGJ1ZmYodmFsOiBBcnJheUJ1ZmZlciB8IHN0cmluZykge1xuICAgIGNvbnN0IGJ1ZmYgPSB0eXBlb2YgdmFsID09IFwic3RyaW5nXCJcbiAgICAgID8gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHZhbClcbiAgICAgIDogbmV3IFVpbnQ4QXJyYXkodmFsKTtcblxuICAgIGNvbnN0IGhleE9jdGV0cyA9IG5ldyBBcnJheShidWZmLmxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmYubGVuZ3RoOyArK2kpIHtcbiAgICAgIGhleE9jdGV0c1tpXSA9IGJ5dGVUb0hleFtidWZmW2ldXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYDB4JHtoZXhPY3RldHMuam9pbihcIlwiKX1gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGxpc3QodmFsOiBBcnJheTxhbnk+KSB7XG4gICAgcmV0dXJuIGAobGlzdCAke3ZhbC5qb2luKFwiIFwiKX0pYDtcbiAgfVxuXG4gIGV4cG9ydCBmdW5jdGlvbiBwcmluY2lwYWwodmFsOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCcke3ZhbH1gO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHR1cGxlKHZhbDogT2JqZWN0KSB7XG4gICAgcmV0dXJuIGB7ICR7c2VyaWFsaXplVHVwbGUodmFsKX0gfWA7XG4gIH1cbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgU3RyaW5nIHtcbiAgICBleHBlY3RPaygpOiBTdHJpbmc7XG4gICAgZXhwZWN0RXJyKCk6IFN0cmluZztcbiAgICBleHBlY3RTb21lKCk6IFN0cmluZztcbiAgICBleHBlY3ROb25lKCk6IHZvaWQ7XG4gICAgZXhwZWN0Qm9vbCh2YWx1ZTogYm9vbGVhbik6IGJvb2xlYW47XG4gICAgZXhwZWN0VWludCh2YWx1ZTogbnVtYmVyIHwgYmlnaW50KTogYmlnaW50O1xuICAgIGV4cGVjdEludCh2YWx1ZTogbnVtYmVyIHwgYmlnaW50KTogYmlnaW50O1xuICAgIGV4cGVjdEJ1ZmYodmFsdWU6IEFycmF5QnVmZmVyKTogQXJyYXlCdWZmZXI7XG4gICAgZXhwZWN0QXNjaWkodmFsdWU6IFN0cmluZyk6IFN0cmluZztcbiAgICBleHBlY3RVdGY4KHZhbHVlOiBTdHJpbmcpOiBTdHJpbmc7XG4gICAgZXhwZWN0UHJpbmNpcGFsKHZhbHVlOiBTdHJpbmcpOiBTdHJpbmc7XG4gICAgZXhwZWN0TGlzdCgpOiBBcnJheTxTdHJpbmc+O1xuICAgIGV4cGVjdFR1cGxlKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIH1cblxuICBpbnRlcmZhY2UgQXJyYXk8VD4ge1xuICAgIGV4cGVjdFNUWFRyYW5zZmVyRXZlbnQoXG4gICAgICBhbW91bnQ6IE51bWJlciB8IGJpZ2ludCxcbiAgICAgIHNlbmRlcjogU3RyaW5nLFxuICAgICAgcmVjaXBpZW50OiBTdHJpbmcsXG4gICAgKTogT2JqZWN0O1xuICAgIGV4cGVjdEZ1bmdpYmxlVG9rZW5UcmFuc2ZlckV2ZW50KFxuICAgICAgYW1vdW50OiBOdW1iZXIgfCBiaWdpbnQsXG4gICAgICBzZW5kZXI6IFN0cmluZyxcbiAgICAgIHJlY2lwaWVudDogU3RyaW5nLFxuICAgICAgYXNzZXRJZDogU3RyaW5nLFxuICAgICk6IE9iamVjdDtcbiAgICBleHBlY3RGdW5naWJsZVRva2VuTWludEV2ZW50KFxuICAgICAgYW1vdW50OiBOdW1iZXIgfCBiaWdpbnQsXG4gICAgICByZWNpcGllbnQ6IFN0cmluZyxcbiAgICAgIGFzc2V0SWQ6IFN0cmluZyxcbiAgICApOiBPYmplY3Q7XG4gICAgZXhwZWN0RnVuZ2libGVUb2tlbkJ1cm5FdmVudChcbiAgICAgIGFtb3VudDogTnVtYmVyIHwgYmlnaW50LFxuICAgICAgc2VuZGVyOiBTdHJpbmcsXG4gICAgICBhc3NldElkOiBTdHJpbmcsXG4gICAgKTogT2JqZWN0O1xuICAgIGV4cGVjdFByaW50RXZlbnQoXG4gICAgICBjb250cmFjdF9pZGVudGlmaWVyOiBzdHJpbmcsXG4gICAgICB2YWx1ZTogc3RyaW5nLFxuICAgICk6IE9iamVjdDtcbiAgICBleHBlY3ROb25GdW5naWJsZVRva2VuVHJhbnNmZXJFdmVudChcbiAgICAgIHRva2VuSWQ6IFN0cmluZyxcbiAgICAgIHNlbmRlcjogU3RyaW5nLFxuICAgICAgcmVjaXBpZW50OiBTdHJpbmcsXG4gICAgICBhc3NldEFkZHJlc3M6IFN0cmluZyxcbiAgICAgIGFzc2V0SWQ6IFN0cmluZyxcbiAgICApOiBPYmplY3Q7XG4gICAgZXhwZWN0Tm9uRnVuZ2libGVUb2tlbk1pbnRFdmVudChcbiAgICAgIHRva2VuSWQ6IFN0cmluZyxcbiAgICAgIHJlY2lwaWVudDogU3RyaW5nLFxuICAgICAgYXNzZXRBZGRyZXNzOiBTdHJpbmcsXG4gICAgICBhc3NldElkOiBTdHJpbmcsXG4gICAgKTogT2JqZWN0O1xuICAgIGV4cGVjdE5vbkZ1bmdpYmxlVG9rZW5CdXJuRXZlbnQoXG4gICAgICB0b2tlbklkOiBTdHJpbmcsXG4gICAgICBzZW5kZXI6IFN0cmluZyxcbiAgICAgIGFzc2V0QWRkcmVzczogU3RyaW5nLFxuICAgICAgYXNzZXRJZDogU3RyaW5nLFxuICAgICk6IE9iamVjdDtcbiAgICAvLyBleHBlY3RFdmVudChzZWw6IChlOiBPYmplY3QpID0+IE9iamVjdCk6IE9iamVjdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25zdW1lKHNyYzogU3RyaW5nLCBleHBlY3RhdGlvbjogU3RyaW5nLCB3cmFwcGVkOiBib29sZWFuKSB7XG4gIGxldCBkc3QgPSAoXCIgXCIgKyBzcmMpLnNsaWNlKDEpO1xuICBsZXQgc2l6ZSA9IGV4cGVjdGF0aW9uLmxlbmd0aDtcbiAgaWYgKCF3cmFwcGVkICYmIHNyYyAhPT0gZXhwZWN0YXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRXhwZWN0ZWQgJHtncmVlbihleHBlY3RhdGlvbi50b1N0cmluZygpKX0sIGdvdCAke3JlZChzcmMudG9TdHJpbmcoKSl9YCxcbiAgICApO1xuICB9XG4gIGlmICh3cmFwcGVkKSB7XG4gICAgc2l6ZSArPSAyO1xuICB9XG4gIGlmIChkc3QubGVuZ3RoIDwgc2l6ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBFeHBlY3RlZCAke2dyZWVuKGV4cGVjdGF0aW9uLnRvU3RyaW5nKCkpfSwgZ290ICR7cmVkKHNyYy50b1N0cmluZygpKX1gLFxuICAgICk7XG4gIH1cbiAgaWYgKHdyYXBwZWQpIHtcbiAgICBkc3QgPSBkc3Quc3Vic3RyaW5nKDEsIGRzdC5sZW5ndGggLSAxKTtcbiAgfVxuICBsZXQgcmVzID0gZHN0LnNsaWNlKDAsIGV4cGVjdGF0aW9uLmxlbmd0aCk7XG4gIGlmIChyZXMgIT09IGV4cGVjdGF0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgYEV4cGVjdGVkICR7Z3JlZW4oZXhwZWN0YXRpb24udG9TdHJpbmcoKSl9LCBnb3QgJHtyZWQoc3JjLnRvU3RyaW5nKCkpfWAsXG4gICAgKTtcbiAgfVxuICBsZXQgbGVmdFBhZCA9IDA7XG4gIGlmIChkc3QuY2hhckF0KGV4cGVjdGF0aW9uLmxlbmd0aCkgPT09IFwiIFwiKSB7XG4gICAgbGVmdFBhZCA9IDE7XG4gIH1cbiAgbGV0IHJlbWFpbmRlciA9IGRzdC5zdWJzdHJpbmcoZXhwZWN0YXRpb24ubGVuZ3RoICsgbGVmdFBhZCk7XG4gIHJldHVybiByZW1haW5kZXI7XG59XG5cblN0cmluZy5wcm90b3R5cGUuZXhwZWN0T2sgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBjb25zdW1lKHRoaXMsIFwib2tcIiwgdHJ1ZSk7XG59O1xuXG5TdHJpbmcucHJvdG90eXBlLmV4cGVjdEVyciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGNvbnN1bWUodGhpcywgXCJlcnJcIiwgdHJ1ZSk7XG59O1xuXG5TdHJpbmcucHJvdG90eXBlLmV4cGVjdFNvbWUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBjb25zdW1lKHRoaXMsIFwic29tZVwiLCB0cnVlKTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUuZXhwZWN0Tm9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGNvbnN1bWUodGhpcywgXCJub25lXCIsIGZhbHNlKTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUuZXhwZWN0Qm9vbCA9IGZ1bmN0aW9uICh2YWx1ZTogYm9vbGVhbikge1xuICB0cnkge1xuICAgIGNvbnN1bWUodGhpcywgYCR7dmFsdWV9YCwgZmFsc2UpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IGVycm9yO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUuZXhwZWN0VWludCA9IGZ1bmN0aW9uICh2YWx1ZTogbnVtYmVyIHwgYmlnaW50KTogYmlnaW50IHtcbiAgdHJ5IHtcbiAgICBjb25zdW1lKHRoaXMsIGB1JHt2YWx1ZX1gLCBmYWxzZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbiAgcmV0dXJuIEJpZ0ludCh2YWx1ZSk7XG59O1xuXG5TdHJpbmcucHJvdG90eXBlLmV4cGVjdEludCA9IGZ1bmN0aW9uICh2YWx1ZTogbnVtYmVyIHwgYmlnaW50KTogYmlnaW50IHtcbiAgdHJ5IHtcbiAgICBjb25zdW1lKHRoaXMsIGAke3ZhbHVlfWAsIGZhbHNlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuICByZXR1cm4gQmlnSW50KHZhbHVlKTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUuZXhwZWN0QnVmZiA9IGZ1bmN0aW9uICh2YWx1ZTogQXJyYXlCdWZmZXIpIHtcbiAgbGV0IGJ1ZmZlciA9IHR5cGVzLmJ1ZmYodmFsdWUpO1xuICBpZiAodGhpcyAhPT0gYnVmZmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCAke2dyZWVuKGJ1ZmZlcil9LCBnb3QgJHtyZWQodGhpcy50b1N0cmluZygpKX1gKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG5TdHJpbmcucHJvdG90eXBlLmV4cGVjdEFzY2lpID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdW1lKHRoaXMsIGBcIiR7dmFsdWV9XCJgLCBmYWxzZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS5leHBlY3RVdGY4ID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdW1lKHRoaXMsIGB1XCIke3ZhbHVlfVwiYCwgZmFsc2UpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IGVycm9yO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUuZXhwZWN0UHJpbmNpcGFsID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdW1lKHRoaXMsIGAke3ZhbHVlfWAsIGZhbHNlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG5TdHJpbmcucHJvdG90eXBlLmV4cGVjdExpc3QgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmNoYXJBdCgwKSAhPT0gXCJbXCIgfHwgdGhpcy5jaGFyQXQodGhpcy5sZW5ndGggLSAxKSAhPT0gXCJdXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgRXhwZWN0ZWQgJHtncmVlbihcIihsaXN0IC4uLilcIil9LCBnb3QgJHtyZWQodGhpcy50b1N0cmluZygpKX1gLFxuICAgICk7XG4gIH1cblxuICBsZXQgc3RhY2sgPSBbXTtcbiAgbGV0IGVsZW1lbnRzID0gW107XG4gIGxldCBzdGFydCA9IDE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aGlzLmNoYXJBdChpKSA9PT0gXCIsXCIgJiYgc3RhY2subGVuZ3RoID09IDEpIHtcbiAgICAgIGVsZW1lbnRzLnB1c2godGhpcy5zdWJzdHJpbmcoc3RhcnQsIGkpKTtcbiAgICAgIHN0YXJ0ID0gaSArIDI7XG4gICAgfVxuICAgIGlmIChbXCIoXCIsIFwiW1wiLCBcIntcIl0uaW5jbHVkZXModGhpcy5jaGFyQXQoaSkpKSB7XG4gICAgICBzdGFjay5wdXNoKHRoaXMuY2hhckF0KGkpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hhckF0KGkpID09PSBcIilcIiAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXSA9PT0gXCIoXCIpIHtcbiAgICAgIHN0YWNrLnBvcCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGFyQXQoaSkgPT09IFwifVwiICYmIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdID09PSBcIntcIikge1xuICAgICAgc3RhY2sucG9wKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoYXJBdChpKSA9PT0gXCJdXCIgJiYgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0gPT09IFwiW1wiKSB7XG4gICAgICBzdGFjay5wb3AoKTtcbiAgICB9XG4gIH1cbiAgbGV0IHJlbWFpbmRlciA9IHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCB0aGlzLmxlbmd0aCAtIDEpO1xuICBpZiAocmVtYWluZGVyLmxlbmd0aCA+IDApIHtcbiAgICBlbGVtZW50cy5wdXNoKHJlbWFpbmRlcik7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRzO1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS5leHBlY3RUdXBsZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuY2hhckF0KDApICE9PSBcIntcIiB8fCB0aGlzLmNoYXJBdCh0aGlzLmxlbmd0aCAtIDEpICE9PSBcIn1cIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBFeHBlY3RlZCAke2dyZWVuKFwiKHR1cGxlIC4uLilcIil9LCBnb3QgJHtyZWQodGhpcy50b1N0cmluZygpKX1gLFxuICAgICk7XG4gIH1cblxuICBsZXQgc3RhcnQgPSAxO1xuICBsZXQgc3RhY2sgPSBbXTtcbiAgbGV0IGVsZW1lbnRzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0aGlzLmNoYXJBdChpKSA9PT0gXCIsXCIgJiYgc3RhY2subGVuZ3RoID09IDEpIHtcbiAgICAgIGVsZW1lbnRzLnB1c2godGhpcy5zdWJzdHJpbmcoc3RhcnQsIGkpKTtcbiAgICAgIHN0YXJ0ID0gaSArIDI7XG4gICAgfVxuICAgIGlmIChbXCIoXCIsIFwiW1wiLCBcIntcIl0uaW5jbHVkZXModGhpcy5jaGFyQXQoaSkpKSB7XG4gICAgICBzdGFjay5wdXNoKHRoaXMuY2hhckF0KGkpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hhckF0KGkpID09PSBcIilcIiAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXSA9PT0gXCIoXCIpIHtcbiAgICAgIHN0YWNrLnBvcCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jaGFyQXQoaSkgPT09IFwifVwiICYmIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdID09PSBcIntcIikge1xuICAgICAgc3RhY2sucG9wKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNoYXJBdChpKSA9PT0gXCJdXCIgJiYgc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0gPT09IFwiW1wiKSB7XG4gICAgICBzdGFjay5wb3AoKTtcbiAgICB9XG4gIH1cbiAgbGV0IHJlbWFpbmRlciA9IHRoaXMuc3Vic3RyaW5nKHN0YXJ0LCB0aGlzLmxlbmd0aCAtIDEpO1xuICBpZiAocmVtYWluZGVyLmxlbmd0aCA+IDApIHtcbiAgICBlbGVtZW50cy5wdXNoKHJlbWFpbmRlcik7XG4gIH1cblxuICBsZXQgdHVwbGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGVsZW1lbnQuY2hhckF0KGkpID09PSBcIjpcIikge1xuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBlbGVtZW50LnN1YnN0cmluZygwLCBpKTtcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgPSBlbGVtZW50LnN1YnN0cmluZyhpICsgMiwgZWxlbWVudC5sZW5ndGgpO1xuICAgICAgICB0dXBsZVtrZXldID0gdmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0dXBsZTtcbn07XG5cbkFycmF5LnByb3RvdHlwZS5leHBlY3RTVFhUcmFuc2ZlckV2ZW50ID0gZnVuY3Rpb24gKFxuICBhbW91bnQ6IE51bWJlciB8IGJpZ2ludCxcbiAgc2VuZGVyOiBTdHJpbmcsXG4gIHJlY2lwaWVudDogU3RyaW5nLFxuKSB7XG4gIGZvciAobGV0IGV2ZW50IG9mIHRoaXMpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IGU6IGFueSA9IHt9O1xuICAgICAgZVtcImFtb3VudFwiXSA9IGV2ZW50LnN0eF90cmFuc2Zlcl9ldmVudC5hbW91bnQuZXhwZWN0SW50KGFtb3VudCk7XG4gICAgICBlW1wic2VuZGVyXCJdID0gZXZlbnQuc3R4X3RyYW5zZmVyX2V2ZW50LnNlbmRlci5leHBlY3RQcmluY2lwYWwoc2VuZGVyKTtcbiAgICAgIGVbXCJyZWNpcGllbnRcIl0gPSBldmVudC5zdHhfdHJhbnNmZXJfZXZlbnQucmVjaXBpZW50LmV4cGVjdFByaW5jaXBhbChcbiAgICAgICAgcmVjaXBpZW50LFxuICAgICAgKTtcbiAgICAgIHJldHVybiBlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmV0cmlldmUgZXhwZWN0ZWQgU1RYVHJhbnNmZXJFdmVudGApO1xufTtcblxuQXJyYXkucHJvdG90eXBlLmV4cGVjdEZ1bmdpYmxlVG9rZW5UcmFuc2ZlckV2ZW50ID0gZnVuY3Rpb24gKFxuICBhbW91bnQ6IE51bWJlcixcbiAgc2VuZGVyOiBTdHJpbmcsXG4gIHJlY2lwaWVudDogU3RyaW5nLFxuICBhc3NldElkOiBTdHJpbmcsXG4pIHtcbiAgZm9yIChsZXQgZXZlbnQgb2YgdGhpcykge1xuICAgIHRyeSB7XG4gICAgICBsZXQgZTogYW55ID0ge307XG4gICAgICBlW1wiYW1vdW50XCJdID0gZXZlbnQuZnRfdHJhbnNmZXJfZXZlbnQuYW1vdW50LmV4cGVjdEludChhbW91bnQpO1xuICAgICAgZVtcInNlbmRlclwiXSA9IGV2ZW50LmZ0X3RyYW5zZmVyX2V2ZW50LnNlbmRlci5leHBlY3RQcmluY2lwYWwoc2VuZGVyKTtcbiAgICAgIGVbXCJyZWNpcGllbnRcIl0gPSBldmVudC5mdF90cmFuc2Zlcl9ldmVudC5yZWNpcGllbnQuZXhwZWN0UHJpbmNpcGFsKFxuICAgICAgICByZWNpcGllbnQsXG4gICAgICApO1xuICAgICAgaWYgKGV2ZW50LmZ0X3RyYW5zZmVyX2V2ZW50LmFzc2V0X2lkZW50aWZpZXIuZW5kc1dpdGgoYXNzZXRJZCkpIHtcbiAgICAgICAgZVtcImFzc2V0SWRcIl0gPSBldmVudC5mdF90cmFuc2Zlcl9ldmVudC5hc3NldF9pZGVudGlmaWVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICBgVW5hYmxlIHRvIHJldHJpZXZlIGV4cGVjdGVkIEZ1bmdpYmxlVG9rZW5UcmFuc2ZlckV2ZW50KCR7YW1vdW50fSwgJHtzZW5kZXJ9LCAke3JlY2lwaWVudH0sICR7YXNzZXRJZH0pXFxuJHtcbiAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMpXG4gICAgfWAsXG4gICk7XG59O1xuXG5BcnJheS5wcm90b3R5cGUuZXhwZWN0RnVuZ2libGVUb2tlbk1pbnRFdmVudCA9IGZ1bmN0aW9uIChcbiAgYW1vdW50OiBOdW1iZXIgfCBiaWdpbnQsXG4gIHJlY2lwaWVudDogU3RyaW5nLFxuICBhc3NldElkOiBTdHJpbmcsXG4pIHtcbiAgZm9yIChsZXQgZXZlbnQgb2YgdGhpcykge1xuICAgIHRyeSB7XG4gICAgICBsZXQgZTogYW55ID0ge307XG4gICAgICBlW1wiYW1vdW50XCJdID0gZXZlbnQuZnRfbWludF9ldmVudC5hbW91bnQuZXhwZWN0SW50KGFtb3VudCk7XG4gICAgICBlW1wicmVjaXBpZW50XCJdID0gZXZlbnQuZnRfbWludF9ldmVudC5yZWNpcGllbnQuZXhwZWN0UHJpbmNpcGFsKHJlY2lwaWVudCk7XG4gICAgICBpZiAoZXZlbnQuZnRfbWludF9ldmVudC5hc3NldF9pZGVudGlmaWVyLmVuZHNXaXRoKGFzc2V0SWQpKSB7XG4gICAgICAgIGVbXCJhc3NldElkXCJdID0gZXZlbnQuZnRfbWludF9ldmVudC5hc3NldF9pZGVudGlmaWVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHJldHJpZXZlIGV4cGVjdGVkIEZ1bmdpYmxlVG9rZW5NaW50RXZlbnRgKTtcbn07XG5cbkFycmF5LnByb3RvdHlwZS5leHBlY3RGdW5naWJsZVRva2VuQnVybkV2ZW50ID0gZnVuY3Rpb24gKFxuICBhbW91bnQ6IE51bWJlciB8IGJpZ2ludCxcbiAgc2VuZGVyOiBTdHJpbmcsXG4gIGFzc2V0SWQ6IFN0cmluZyxcbikge1xuICBmb3IgKGxldCBldmVudCBvZiB0aGlzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBlOiBhbnkgPSB7fTtcbiAgICAgIGVbXCJhbW91bnRcIl0gPSBldmVudC5mdF9idXJuX2V2ZW50LmFtb3VudC5leHBlY3RJbnQoYW1vdW50KTtcbiAgICAgIGVbXCJzZW5kZXJcIl0gPSBldmVudC5mdF9idXJuX2V2ZW50LnNlbmRlci5leHBlY3RQcmluY2lwYWwoc2VuZGVyKTtcbiAgICAgIGlmIChldmVudC5mdF9idXJuX2V2ZW50LmFzc2V0X2lkZW50aWZpZXIuZW5kc1dpdGgoYXNzZXRJZCkpIHtcbiAgICAgICAgZVtcImFzc2V0SWRcIl0gPSBldmVudC5mdF9idXJuX2V2ZW50LmFzc2V0X2lkZW50aWZpZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmV0cmlldmUgZXhwZWN0ZWQgRnVuZ2libGVUb2tlbkJ1cm5FdmVudGApO1xufTtcblxuQXJyYXkucHJvdG90eXBlLmV4cGVjdFByaW50RXZlbnQgPSBmdW5jdGlvbiAoXG4gIGNvbnRyYWN0X2lkZW50aWZpZXI6IHN0cmluZyxcbiAgdmFsdWU6IHN0cmluZyxcbikge1xuICBmb3IgKGxldCBldmVudCBvZiB0aGlzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBlOiBhbnkgPSB7fTtcbiAgICAgIGVbXCJjb250cmFjdF9pZGVudGlmaWVyXCJdID0gZXZlbnQuY29udHJhY3RfZXZlbnQuY29udHJhY3RfaWRlbnRpZmllclxuICAgICAgICAuZXhwZWN0UHJpbmNpcGFsKFxuICAgICAgICAgIGNvbnRyYWN0X2lkZW50aWZpZXIsXG4gICAgICAgICk7XG5cbiAgICAgIGlmIChldmVudC5jb250cmFjdF9ldmVudC50b3BpYy5lbmRzV2l0aChcInByaW50XCIpKSB7XG4gICAgICAgIGVbXCJ0b3BpY1wiXSA9IGV2ZW50LmNvbnRyYWN0X2V2ZW50LnRvcGljO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudC5jb250cmFjdF9ldmVudC52YWx1ZS5lbmRzV2l0aCh2YWx1ZSkpIHtcbiAgICAgICAgZVtcInZhbHVlXCJdID0gZXZlbnQuY29udHJhY3RfZXZlbnQudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gcmV0cmlldmUgZXhwZWN0ZWQgUHJpbnRFdmVudGApO1xufTtcbi8vIEFycmF5LnByb3RvdHlwZS5leHBlY3RFdmVudCA9IGZ1bmN0aW9uKHNlbDogKGU6IE9iamVjdCkgPT4gT2JqZWN0KSB7XG4vLyAgICAgZm9yIChsZXQgZXZlbnQgb2YgdGhpcykge1xuLy8gICAgICAgICB0cnkge1xuLy8gICAgICAgICAgICAgc2VsKGV2ZW50KTtcbi8vICAgICAgICAgICAgIHJldHVybiBldmVudCBhcyBPYmplY3Q7XG4vLyAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4vLyAgICAgICAgICAgICBjb250aW51ZTtcbi8vICAgICAgICAgfVxuLy8gICAgIH1cbi8vICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZXRyaWV2ZSBleHBlY3RlZCBQcmludEV2ZW50YCk7XG4vLyB9XG5BcnJheS5wcm90b3R5cGUuZXhwZWN0Tm9uRnVuZ2libGVUb2tlblRyYW5zZmVyRXZlbnQgPSBmdW5jdGlvbiAoXG4gIHRva2VuSWQ6IFN0cmluZyxcbiAgc2VuZGVyOiBTdHJpbmcsXG4gIHJlY2lwaWVudDogU3RyaW5nLFxuICBhc3NldEFkZHJlc3M6IFN0cmluZyxcbiAgYXNzZXRJZDogU3RyaW5nLFxuKSB7XG4gIGZvciAobGV0IGV2ZW50IG9mIHRoaXMpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IGU6IGFueSA9IHt9O1xuICAgICAgaWYgKGV2ZW50Lm5mdF90cmFuc2Zlcl9ldmVudC52YWx1ZSA9PT0gdG9rZW5JZCkge1xuICAgICAgICBlW1widG9rZW5JZFwiXSA9IGV2ZW50Lm5mdF90cmFuc2Zlcl9ldmVudC52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZVtcInNlbmRlclwiXSA9IGV2ZW50Lm5mdF90cmFuc2Zlcl9ldmVudC5zZW5kZXIuZXhwZWN0UHJpbmNpcGFsKHNlbmRlcik7XG4gICAgICBlW1wicmVjaXBpZW50XCJdID0gZXZlbnQubmZ0X3RyYW5zZmVyX2V2ZW50LnJlY2lwaWVudC5leHBlY3RQcmluY2lwYWwoXG4gICAgICAgIHJlY2lwaWVudCxcbiAgICAgICk7XG4gICAgICBpZiAoXG4gICAgICAgIGV2ZW50Lm5mdF90cmFuc2Zlcl9ldmVudC5hc3NldF9pZGVudGlmaWVyID09PVxuICAgICAgICAgIGAke2Fzc2V0QWRkcmVzc306OiR7YXNzZXRJZH1gXG4gICAgICApIHtcbiAgICAgICAgZVtcImFzc2V0SWRcIl0gPSBldmVudC5uZnRfdHJhbnNmZXJfZXZlbnQuYXNzZXRfaWRlbnRpZmllcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byByZXRyaWV2ZSBleHBlY3RlZCBOb25GdW5naWJsZVRva2VuVHJhbnNmZXJFdmVudGApO1xufTtcblxuQXJyYXkucHJvdG90eXBlLmV4cGVjdE5vbkZ1bmdpYmxlVG9rZW5NaW50RXZlbnQgPSBmdW5jdGlvbiAoXG4gIHRva2VuSWQ6IFN0cmluZyxcbiAgcmVjaXBpZW50OiBTdHJpbmcsXG4gIGFzc2V0QWRkcmVzczogU3RyaW5nLFxuICBhc3NldElkOiBTdHJpbmcsXG4pIHtcbiAgZm9yIChsZXQgZXZlbnQgb2YgdGhpcykge1xuICAgIHRyeSB7XG4gICAgICBsZXQgZTogYW55ID0ge307XG4gICAgICBpZiAoZXZlbnQubmZ0X21pbnRfZXZlbnQudmFsdWUgPT09IHRva2VuSWQpIHtcbiAgICAgICAgZVtcInRva2VuSWRcIl0gPSBldmVudC5uZnRfbWludF9ldmVudC52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZVtcInJlY2lwaWVudFwiXSA9IGV2ZW50Lm5mdF9taW50X2V2ZW50LnJlY2lwaWVudC5leHBlY3RQcmluY2lwYWwoXG4gICAgICAgIHJlY2lwaWVudCxcbiAgICAgICk7XG4gICAgICBpZiAoXG4gICAgICAgIGV2ZW50Lm5mdF9taW50X2V2ZW50LmFzc2V0X2lkZW50aWZpZXIgPT09IGAke2Fzc2V0QWRkcmVzc306OiR7YXNzZXRJZH1gXG4gICAgICApIHtcbiAgICAgICAgZVtcImFzc2V0SWRcIl0gPSBldmVudC5uZnRfbWludF9ldmVudC5hc3NldF9pZGVudGlmaWVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHJldHJpZXZlIGV4cGVjdGVkIE5vbkZ1bmdpYmxlVG9rZW5NaW50RXZlbnRgKTtcbn07XG5cbkFycmF5LnByb3RvdHlwZS5leHBlY3ROb25GdW5naWJsZVRva2VuQnVybkV2ZW50ID0gZnVuY3Rpb24gKFxuICB0b2tlbklkOiBTdHJpbmcsXG4gIHNlbmRlcjogU3RyaW5nLFxuICBhc3NldEFkZHJlc3M6IFN0cmluZyxcbiAgYXNzZXRJZDogU3RyaW5nLFxuKSB7XG4gIGZvciAobGV0IGV2ZW50IG9mIHRoaXMpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IGU6IGFueSA9IHt9O1xuICAgICAgaWYgKGV2ZW50Lm5mdF9idXJuX2V2ZW50LnZhbHVlID09PSB0b2tlbklkKSB7XG4gICAgICAgIGVbXCJ0b2tlbklkXCJdID0gZXZlbnQubmZ0X2J1cm5fZXZlbnQudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGVbXCJzZW5kZXJcIl0gPSBldmVudC5uZnRfYnVybl9ldmVudC5zZW5kZXIuZXhwZWN0UHJpbmNpcGFsKHNlbmRlcik7XG4gICAgICBpZiAoXG4gICAgICAgIGV2ZW50Lm5mdF9idXJuX2V2ZW50LmFzc2V0X2lkZW50aWZpZXIgPT09IGAke2Fzc2V0QWRkcmVzc306OiR7YXNzZXRJZH1gXG4gICAgICApIHtcbiAgICAgICAgZVtcImFzc2V0SWRcIl0gPSBldmVudC5uZnRfYnVybl9ldmVudC5hc3NldF9pZGVudGlmaWVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIHJldHJpZXZlIGV4cGVjdGVkIE5vbkZ1bmdpYmxlVG9rZW5CdXJuRXZlbnRgKTtcbn07XG5cbmNvbnN0IG5vQ29sb3IgPSBnbG9iYWxUaGlzLkRlbm8/Lm5vQ29sb3IgPz8gdHJ1ZTtcblxuaW50ZXJmYWNlIENvZGUge1xuICBvcGVuOiBzdHJpbmc7XG4gIGNsb3NlOiBzdHJpbmc7XG4gIHJlZ2V4cDogUmVnRXhwO1xufVxuXG5sZXQgZW5hYmxlZCA9ICFub0NvbG9yO1xuXG5mdW5jdGlvbiBjb2RlKG9wZW46IG51bWJlcltdLCBjbG9zZTogbnVtYmVyKTogQ29kZSB7XG4gIHJldHVybiB7XG4gICAgb3BlbjogYFxceDFiWyR7b3Blbi5qb2luKFwiO1wiKX1tYCxcbiAgICBjbG9zZTogYFxceDFiWyR7Y2xvc2V9bWAsXG4gICAgcmVnZXhwOiBuZXcgUmVnRXhwKGBcXFxceDFiXFxcXFske2Nsb3NlfW1gLCBcImdcIiksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJ1bihzdHI6IHN0cmluZywgY29kZTogQ29kZSk6IHN0cmluZyB7XG4gIHJldHVybiBlbmFibGVkXG4gICAgPyBgJHtjb2RlLm9wZW59JHtzdHIucmVwbGFjZShjb2RlLnJlZ2V4cCwgY29kZS5vcGVuKX0ke2NvZGUuY2xvc2V9YFxuICAgIDogc3RyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJ1bihzdHIsIGNvZGUoWzMxXSwgMzkpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdyZWVuKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJ1bihzdHIsIGNvZGUoWzMyXSwgMzkpKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE1BQU0sRUFBRTtJQUNiLElBQUksQ0FBUztJQUNiLE1BQU0sQ0FBUztJQUNmLFlBQVksQ0FBa0I7SUFDOUIsV0FBVyxDQUFjO0lBQ3pCLGNBQWMsQ0FBb0I7SUFFbEMsWUFBWSxJQUFZLEVBQUUsTUFBYyxDQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3RCO0lBRUQsT0FBTyxXQUFXLENBQUMsTUFBYyxFQUFFLFNBQWlCLEVBQUUsTUFBYyxFQUFFO1FBQ3BFLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQUFBQztRQUMzQixFQUFFLENBQUMsV0FBVyxHQUFHO1lBQ2YsU0FBUztZQUNULE1BQU07U0FDUCxDQUFDO1FBQ0YsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sWUFBWSxDQUNqQixRQUFnQixFQUNoQixNQUFjLEVBQ2QsSUFBbUIsRUFDbkIsTUFBYyxFQUNkO1FBQ0EsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxBQUFDO1FBQzNCLEVBQUUsQ0FBQyxZQUFZLEdBQUc7WUFDaEIsUUFBUTtZQUNSLE1BQU07WUFDTixJQUFJO1NBQ0wsQ0FBQztRQUNGLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCxPQUFPLGNBQWMsQ0FBQyxJQUFZLEVBQUUs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QUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUMvQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDZjtRQUNELElBQUk7WUFBQyxHQUFHO1lBQUUsR0FBRztZQUFFLEdBQUc7U0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUM3RCxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDYjtRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQzdELEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNiO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDN0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2I7S0FDRjtJQUNELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEFBQUM7SUFDdkQsSUFBSSxTQUFTLENBQUMsTUFB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