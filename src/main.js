const SHA256 = require("crypto-js/sha256");

// The Transaction class contains all of the relevent data for each transaction
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

// The Block class has a time stamp, an array of transactions and the hash of the previous block
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        // Used to iterate over mining
        this.nonce = 0;
    }

    // Calculates the hash for the block
    calculateHash() {
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }

    // Mines the block interating over a nonce until the difficulty check is passed
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined... " + this.hash);
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenisisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 1;
    }

    createGenisisBlock() {
        return new Block(Date.now(), []);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Create a new Block containing the pending transactions, mine the block, then push the block into the chain
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);

        block.mineBlock(this.difficulty);

        console.log("Completed Block mining...");

        this.chain.push(block);

        // Empty pending transactions and send mining reward to miner
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    // Add a transaction to the pending transactions
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // Return the balance of an address by iterating over all transactions involving the address
    getBalanceOfAddress(address) {

        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                } 

                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    // Checks if each hash is valid and each chain is linked via hashes
    isChainValid() {

    }
}

let GitCoin = new Blockchain();
GitCoin.createTransaction(new Transaction("Buttface", "Fanus", 150));
GitCoin.createTransaction(new Transaction("Fanus", "Cakewell", 75));
GitCoin.createTransaction(new Transaction("Cakewell", "Buttface", 50));

console.log('Mining...');
GitCoin.minePendingTransactions("DanTheMan");

console.log("Buttface's balance: " + GitCoin.getBalanceOfAddress("Buttface"));
console.log("Fanus's balance: " + GitCoin.getBalanceOfAddress("Fanus"));
console.log("Cakewell's balance: " + GitCoin.getBalanceOfAddress("Cakewell"));
console.log("DanTheMan's balance: " + GitCoin.getBalanceOfAddress("DanTheMan"));

console.log('Mining...');
GitCoin.minePendingTransactions("DanTheMan");

console.log("DanTheMan's balance: " + GitCoin.getBalanceOfAddress("DanTheMan"));


