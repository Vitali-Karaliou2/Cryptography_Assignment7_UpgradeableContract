const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Upgrading with account:", deployer.address);

  const proxyAddress = "0x956395F876bFE823f7Ac78877fC2271bA2f04f50";
  
  // Деплой V2
  const MyTokenV2 = await hre.ethers.getContractFactory("MyTokenV2");
  console.log("Deploying MyTokenV2...");
  
  // Апгрейд прокси до V2
  const upgraded = await hre.upgrades.upgradeProxy(proxyAddress, MyTokenV2);
  await upgraded.waitForDeployment();
  
  console.log("Proxy upgraded to V2");
  
  // Проверяем версию через прокси
  const version = await upgraded.getVersion();
  console.log("New version:", version);
  
  // Проверяем, что балансы не изменились
  const balance = await upgraded.balanceOf(deployer.address);
  console.log("Deployer balance after upgrade:", hre.ethers.formatEther(balance));
}

main().catch(console.error);