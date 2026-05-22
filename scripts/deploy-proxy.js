const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Деплой V1 и прокси
  const MyTokenV1 = await hre.ethers.getContractFactory("MyTokenV1");
  console.log("Deploying MyTokenV1...");
  
  const proxy = await hre.upgrades.deployProxy(
    MyTokenV1,
    [hre.ethers.parseEther("1000000")],
    { initializer: "initialize" }
  );
  
  await proxy.waitForDeployment();
  
  const proxyAddress = await proxy.getAddress();
  console.log("Proxy deployed to:", proxyAddress);
  
  // Получаем адрес implementation
  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Implementation deployed to:", implementationAddress);
  
  // Проверяем версию
  const version = await proxy.getVersion();
  console.log("Current version:", version);
  
  // Проверяем баланс
  const balance = await proxy.balanceOf(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "MTK");
}

main().catch(console.error);