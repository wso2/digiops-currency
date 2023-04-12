To create a Docker container that automates the creation of a private Ethereum blockchain using the Proof of Authority consensus algorithm, follow these steps:

1. Install Docker on your system if you haven't already. You can find the installation guide for different platforms on the Docker website: https://docs.docker.com/get-docker/

2. Create a new directory for your project, and navigate to it:

```bash
mkdir <infra-blockchain-dir>
cd <infra-blockchain-dir>
```

3. Create a `Dockerfile` in the `<infra-blockchain-dir>` directory:

```bash
touch Dockerfile
```

4. Open `Dockerfile` in your favorite text editor and add the following lines:

```docker
FROM ethereum/client-go:stable

# Install required packages
RUN apk add --no-cache curl jq

# Set the working directory
WORKDIR /root

# Copy the genesis file
COPY genesis.json /root/genesis.json

# Copy the startup script
COPY start.sh /root/start.sh

# Expose the required ports
EXPOSE 30301
EXPOSE 30310 30311
EXPOSE 8040 8041
EXPOSE 8551 8552

# Set the entry point to the startup script
ENTRYPOINT ["/bin/sh", "/root/start.sh"]
```

5. Create a `genesis.json` file in the `<infra-blockchain-dir>` directory using the template provided in the previous answer. Make sure to replace the placeholders with your desired values.

6. Create a `start.sh` script in the `<infra-blockchain-dir>` directory. This script will automate the steps to create the private Ethereum network:

```bash
#!/bin/sh

# Generate bootnode key
bootnode --genkey boot.key

# Start bootnode
bootnode --nodekey boot.key --verbosity 7 --addr 127.0.0.1:30301 &

# Generate node1 account
geth account new --datadir node1
NODE1_ADDRESS=$(geth --datadir node1 account list | head -1 | awk -F'[{}]' '{print $2}')

# Generate node2 account
geth account new --datadir node2
NODE2_ADDRESS=$(geth --datadir node2 account list | head -1 | awk -F'[{}]' '{print $2}')

# Replace node addresses in the genesis file
sed -i "s/<node1_address>/$NODE1_ADDRESS/g" genesis.json
sed -i "s/<node2_address>/$NODE2_ADDRESS/g" genesis.json

# Initialize nodes
geth --datadir node1 init genesis.json
geth --datadir node2 init genesis.json

# Start node1
geth --datadir "node1" \
  --syncmode "full" \
  --port 30310 \
  --http \
  --http.addr "localhost" \
  --http.port 8040 \
  --authrpc.port 8551 \
  --http.api "personal,eth,net,web3,txpool,miner,admin" \
  --bootnodes "enode://$(bootnode --nodekeyhex "$(cat boot.key)" --writeaddress)@127.0.0.1:30301" \
  --http.corsdomain "*" \
  --networkid 1338 \
  --unlock "$NODE1_ADDRESS" \
  --allow-insecure-unlock \
  --miner.etherbase "$NODE1_ADDRESS" \
  --mine &

# Start node2
geth --datadir "node2" \
  --syncmode "full" \
  --port 30311 \
  --http \
  --http.addr "localhost" \
  --http.port 8041 \
  --authrpc.port 8552 \
  --http.api "personal,eth,net,web3,txpool,miner,admin" \
  --bootnodes "enode://$(bootnode --nodekeyhex "$(cat boot.key)" --writeaddress)@127.0.0.1:30301" \
  --http.corsdomain "*" \
  --networkid 1338 \
  --unlock "$NODE2_ADDRESS" \
  --allow-insecure-unlock

# Keep the script running
tail -f /dev/null
```

Make sure to add executable permissions to the `start.sh` script:

```bash
chmod +x start.sh
```

7. Now you can build your Docker image using the following command:

```bash
docker build -t <infra-blockchain-dir> .
```

8. Once the image is built, you can run a container using the following command:

```bash
docker run -it -p 30301:30301 -p 30310:30310 -p 8040:8040 -p 8551:8551 -p 30311:30311 -p
```

9. Once the image is built, you can run a container using the following command:

```bash
docker run -it -p 30301:30301 -p 30310:30310 -p 8040:8040 -p 8551:8551 -p 30311:30311 -p 8041:8041 -p 8552:8552 <infra-blockchain-dir>
```

This command will map the container ports to the host ports. If you want to use dynamic ports, you can replace the specific port mappings with `-P`:

```bash
docker run -it -P <infra-blockchain-dir>
```

To see the dynamically mapped ports, you can use the following command:

```bash
docker ps
```

This will show the running containers, and you can see the port mappings in the "PORTS" column.

Now you have a Docker container that automates the creation of a private Ethereum blockchain using the Proof of Authority consensus algorithm. The user only needs to provide the desired values for the chain ID, block time, and port mappings (if not using dynamic ports).
