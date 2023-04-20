# Running a Private Ethereum Blockchain with PoA Consensus Using Docker

This guide will help you set up and run a private Ethereum blockchain with Proof of Authority (PoA) consensus using a Docker container.

## Prerequisites

1. Install Docker on your system if you haven't already. You can find the installation guide for different platforms on the Docker website: https://docs.docker.com/get-docker/

## Running the Private Ethereum Blockchain

1. Clone the repository and change directory to the `infra/docker-evm-blockhain` directory:

```bash
git clone https://github.com/wso2/digiops-currency.git
cd infra/docker-evm-blockhain
```

2. Add your root password to `root-password.txt` file

3. Build the Docker image:

```bash
docker build -t private-poa-blockchain .
```

4. Run the Docker container:

```bash
docker run -it -p 30301:30301 -p 30310:30310 -p 8040:8040 -p 8551:8551 -p 30311:30311 -p 8041:8041 -p 8552:8552 infra-blockchain

```

This command will map the container ports to the host ports. If you want to use dynamic ports, you can replace the specific port mappings with -P:

```bash
docker run -it -P infra-blockchain
```

To see the dynamically mapped ports, you can use the following command:

```bash
docker ps
```

This will show the running containers, and you can see the port mappings in the "PORTS" column.

Now you have a Docker container running a private Ethereum blockchain using the Proof of Authority consensus algorithm.

## Interacting with the Blockchain

You can interact with the blockchain using the exposed JSON-RPC endpoints on the host machine. The default ports are:

- Node 1 HTTP RPC: 8040
- Node 1 WebSocket RPC: 8551
- Node 2 HTTP RPC: 8041
- Node 2 WebSocket RPC: 8552

You can use tools like [Metamask](https://metamask.io/), or [Remix](https://remix.ethereum.org/) to interact with the blockchain. Make sure to configure the tools to use the appropriate RPC endpoints.

Additionally, you can use the [Geth console](https://geth.ethereum.org/docs/interacting-with-geth/javascript-console) to interact with the blockchain directly. To attach the Geth console to a running node, use the following command:

```bash
geth attach http://localhost:<http_rpc_port>
```

Replace `<http_rpc_port>` with the appropriate port number (e.g., 8040 or 8041).
