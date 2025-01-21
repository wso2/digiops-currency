create disk mount at /envs/data
create a disk mount at /envs

create a file mount at /envs/data/keystore/key with following content

{"address":"<value>","crypto":{"cipher":"aes-128-ctr","ciphertext":"<value>","cipherparams":{"iv":"<value>"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"<value>"},"mac":"<value>"},"id":"<value>","version":3}

create a file mount at /envs/password.txt and put the node password.

create a file mount at /envs/genesis.json with following content

{
  "config": {
    "chainId": 10000,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "clique": {
      "period": 3,
      "epoch": 30000
    }
  },
  "nonce": "0x0",
  "timestamp": "0x5cdec502",
  "extraData": "<value>",
  "gasLimit": "9000000000000",
  "difficulty": "",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {},
  "number": "0x0",
  "gasUsed": "0x0",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000"
}

create a file mount at /envs/node.sh and put following content

#!/bin/bash
# Set log file
LOG_FILE="/envs/debug.log"

# Initialize node1 and node2 with the genesis.json file
geth --datadir /envs/data init /envs/genesis.json >> $LOG_FILE 2>&1

geth --datadir /envs/data \
 --syncmode "full" \
 --port 30311 \
 --http \
 --http.addr "0.0.0.0" \
 --http.vhosts=* \
 --http.port 8040 \
 --authrpc.port 8551 \
 --http.api "personal,eth,net,web3,txpool,miner,admin" \
 --bootnodes "enode://<boot node secret>@<boot node access url : port>" \
 --http.corsdomain "\*" \
 --networkid 10000 \
 --unlock "<value>" \
 --password "/envs/password.txt" \
 --allow-insecure-unlock \
 --miner.etherbase "<value>" \
 --mine