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
        
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].hash !== this.chain[i].calculateHash()) {
              
                return false;
            }
            console.log(this.chain[i].previousHash);
            console.log(this.chain[i - 1].hash);
            if (this.chain[i].previousHash !== this.chain[i - 1].hash) {

               return false;
            }
        }
        return true;
    }
}

let ButtCoin = new Blockchain();
ButtCoin.createTransaction(new Transaction("Buttface", "Fanus", 150));
ButtCoin.createTransaction(new Transaction("Fanus", "Cakewell", 75));
ButtCoin.createTransaction(new Transaction("Cakewell", "Buttface", 50));

console.log('Mining...');
ButtCoin.minePendingTransactions("DanTheMan");

console.log("Buttface's balance: " + ButtCoin.getBalanceOfAddress("Buttface"));
console.log("Fanus's balance: " + ButtCoin.getBalanceOfAddress("Fanus"));
console.log("Cakewell's balance: " + ButtCoin.getBalanceOfAddress("Cakewell"));
console.log("DanTheMan's balance: " + ButtCoin.getBalanceOfAddress("DanTheMan"));

console.log('Mining...');
ButtCoin.minePendingTransactions("DanTheMan");

console.log("DanTheMan's balance: " + ButtCoin.getBalanceOfAddress("DanTheMan"));

console.log("Is Chain Valid?: " + ButtCoin.isChainValid());
console.log(ButtCoin.chain.length);
/*
ButtCoin.chain[ButtCoin.chain.length - 2].transactions[0].amount = 1000;
ButtCoin.chain[ButtCoin.chain.length - 2].hash = ButtCoin.chain[ButtCoin.chain.length - 2].calculateHash();
*/

ButtCoin.chain[ButtCoin.chain.length - 1].transactions[0].amount = 1000;
ButtCoin.chain[ButtCoin.chain.length - 1].hash = ButtCoin.chain[ButtCoin.chain.length - 1].calculateHash();

console.log("Is Chain Valid?: " + ButtCoin.isChainValid());

console.log('Mining...');
ButtCoin.minePendingTransactions("DanTheMan");

console.log("Is Chain Valid?: " + ButtCoin.isChainValid());



