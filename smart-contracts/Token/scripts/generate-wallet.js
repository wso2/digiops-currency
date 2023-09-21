const { ethers } = require("hardhat");

async function main() {
  // Generate a new random account
  const wallet = ethers.Wallet.createRandom();

  console.log("Wallet Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
