#!/bin/bash

# Set log file
LOG_FILE="/debug/debug.log"

# Clear log file content if it exists
> $LOG_FILE

# Set network ID, block time, and ports
NETWORK_ID=10000
BLOCK_TIME=2

BOOTNODE_PORT=30301

# Create directories for the network, nodes, and bootnode
mkdir -p /debug/bootnode

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
  "extradata": $NODE_EXTRA_DATA,
  "alloc": $NODE_ALLOC,
  "coinbase": "0x0000000000000000000000000000000000000000",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "0x00"
}
EOF


# Start bootnode
bootnode --nodekey /secrets/boot.key --verbosity 7 --addr 127.0.0.1:$BOOTNODE_PORT >> $LOG_FILE 2>&1 &
BOOTNODE_PID=$!
BOOTNODE_ENODE="enode://$(bootnode --nodekeyhex "$(cat /secrets/boot.key)" --writeaddress)@127.0.0.1:$BOOTNODE_PORT"

# Keep the script running
tail -f /dev/null