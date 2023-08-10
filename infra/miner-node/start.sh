#!/bin/bash

# Set log file
LOG_FILE="/debug/debug.log"

# Clear log file content if it exists
> $LOG_FILE

# Set network ID, block time, and ports
#NETWORK_ID=10000

BOOTNODE_PORT=30301
NODE1_PORT=30310
NODE1_HTTP_PORT=8040
NODE1_AUTH_PORT=8551

# Create directories for the network, nodes, and bootnode
mkdir -p /debug/node1

# Generate genesis.json file
# Provide this from file mount
#/configs/genesis.json

# Generate node1 account
NODE1_PASSWORD=$(cat /configs/root-password.txt)
echo $NODE1_PASSWORD > /configs/root-password.txt
geth account new --datadir /debug/node1 --password /configs/root-password.txt >> $LOG_FILE 2>&1
NODE1_ADDRESS=$(geth --datadir /debug/node1 account list | head -1 | awk -F'[{}]' '{print $2}')

echo "Node1 address: $NODE1_ADDRESS"


# Initialize node1 and node2 with the genesis.json file
geth --datadir /debug/node1 init /configs/genesis.json >> $LOG_FILE 2>&1

# Generate bootnode key
bootnode --genkey /debug/bootnode/boot.key >> $LOG_FILE 2>&1

# Provide this from an env variable
# BOOTNODE_ENODE="enode://$(bootnode --nodekeyhex "$(cat /debug/bootnode/boot.key)" --writeaddress)@127.0.0.1:$BOOTNODE_PORT"

# Start node1
geth --datadir /debug/node1 \
  --syncmode "full" \
  --port $NODE1_PORT \
  --http \
  --http.addr "0.0.0.0" \
  --http.vhosts=* \
  --http.port $NODE1_HTTP_PORT \
  --authrpc.port $NODE1_AUTH_PORT \
  --http.api "personal,eth,net,web3,txpool,miner,admin" \
  --bootnodes "$BOOTNODE_ENODE" \
  --http.corsdomain "*" \
  --networkid $NETWORK_ID \
  --unlock "$NODE1_ADDRESS" \
  --password /configs/root-password.txt \
  --allow-insecure-unlock \
  --miner.etherbase "$NODE1_ADDRESS" \
  --mine &
NODE1_PID=$!

# Keep the script running
tail -f /dev/null