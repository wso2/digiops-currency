#!/bin/bash

# Set log file
LOG_FILE="/debug/debug.log"

# Clear log file content if it exists
> $LOG_FILE

# Set network ID, block time, and ports
NETWORK_ID=10000
BLOCK_TIME=2

BOOTNODE_PORT=30301
NODE1_PORT=30310
NODE1_HTTP_PORT=8040
NODE1_AUTH_PORT=8551
NODE2_PORT=30311
NODE2_HTTP_PORT=8041
NODE2_AUTH_PORT=8552

# Create directories for the network, nodes, and bootnode
mkdir -p /debug/bootnode
mkdir -p /debug/node1
mkdir -p /debug/node2

# Generate genesis.json file
cat << EOF > /debug/genesis.json
{
  "config": {
    "chainId": $NETWORK_ID,
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
      "period": $BLOCK_TIME,
      "epoch": 30000
    }
  },
  "difficulty": "1",
  "gasLimit": "8000000",
  "extradata": "0x0000000000000000000000000000000000000000000000000000000000000000<node1_address>0000000000000000000000000000000000000000<node2_address>0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "alloc": {
    "<node1_address>": {
      "balance": "100000000000000000000000"
    },
    "<node2_address>": {
      "balance": "100000000000000000000000"
    }
  },
  "coinbase": "0x0000000000000000000000000000000000000000",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "0x00"
}
EOF

# Generate node1 account
NODE1_PASSWORD=$(cat /debug/root-password.txt)
echo $NODE1_PASSWORD > /debug/node1/password.txt
geth account new --datadir /debug/node1 --password /debug/node1/password.txt >> $LOG_FILE 2>&1
NODE1_ADDRESS=$(geth --datadir /debug/node1 account list | head -1 | awk -F'[{}]' '{print $2}')

# Generate node2 account
NODE2_PASSWORD=$(cat /debug/root-password.txt)
echo $NODE2_PASSWORD > /debug/node2/password.txt
geth account new --datadir /debug/node2 --password /debug/node2/password.txt >> $LOG_FILE 2>&1
NODE2_ADDRESS=$(geth --datadir /debug/node2 account list | head -1 | awk -F'[{}]' '{print $2}')

# Replace node addresses in the genesis.json file
sed -i "s/<node1_address>/$NODE1_ADDRESS/g" /debug/genesis.json
sed -i "s/<node2_address>/$NODE2_ADDRESS/g" /debug/genesis.json

# Initialize node1 and node2 with the genesis.json file
geth --datadir /debug/node1 init /debug/genesis.json >> $LOG_FILE 2>&1
geth --datadir /debug/node2 init /debug/genesis.json >> $LOG_FILE 2>&1

# Generate bootnode key
bootnode --genkey /debug/bootnode/boot.key >> $LOG_FILE 2>&1

# Start bootnode
bootnode --nodekey /debug/bootnode/boot.key --verbosity 7 --addr 127.0.0.1:$BOOTNODE_PORT >> $LOG_FILE 2>&1 &
BOOTNODE_PID=$!
BOOTNODE_ENODE="enode://$(bootnode --nodekeyhex "$(cat /debug/bootnode/boot.key)" --writeaddress)@127.0.0.1:$BOOTNODE_PORT"

# Start node1
geth --datadir /debug/node1 \
  --syncmode "full" \
  --port $NODE1_PORT \
  --http \
  --http.addr "0.0.0.0" \
  --http.port $NODE1_HTTP_PORT \
  --authrpc.port $NODE1_AUTH_PORT \
  --http.api "personal,eth,net,web3,txpool,miner,admin" \
  --bootnodes "$BOOTNODE_ENODE" \
  --http.corsdomain "*" \
  --networkid $NETWORK_ID \
  --unlock "$NODE1_ADDRESS" \
  --password /debug/node1/password.txt \
  --allow-insecure-unlock \
  --miner.etherbase "$NODE1_ADDRESS" \
  --mine &
NODE1_PID=$!

# Start node2
geth --datadir /debug/node2 \
  --syncmode "full" \
  --port $NODE2_PORT \
  --http \
  --http.addr "0.0.0.0" \
  --http.port $NODE2_HTTP_PORT \
  --authrpc.port $NODE2_AUTH_PORT \
  --http.api "personal,eth,net,web3,txpool,miner,admin" \
  --bootnodes "$BOOTNODE_ENODE" \
  --http.corsdomain "*" \
  --networkid $NETWORK_ID \
  --unlock "$NODE2_ADDRESS" \
  --password /debug/node2/password.txt \
  --allow-insecure-unlock &
NODE2_PID=$!

# Keep the script running
tail -f /dev/null