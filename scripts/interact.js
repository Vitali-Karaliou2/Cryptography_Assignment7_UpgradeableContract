const hre = require("hardhat");

async function main() {
    
  const [deployer, user] = await hre.ethers.getSigners();
  const proxyAddress = "0x956395F876bFE823f7Ac78877fC2271bA2f04f50"; 
  
  const MyTokenV1 = await hre.ethers.getContractFactory("MyTokenV1");
  const token = await MyTokenV1.attach(proxyAddress);
  
  console.log("Deployer address:", deployer.address);
  console.log("User address:", user.address);
  
  // Проверяем начальные балансы
  let deployerBalance = await token.balanceOf(deployer.address);
  let userBalance = await token.balanceOf(user.address);
  console.log(`\nInitial balances:`);
  console.log(`  Deployer: ${hre.ethers.formatEther(deployerBalance)} MTK`);
  console.log(`  User: ${hre.ethers.formatEther(userBalance)} MTK`);
  
  // Mint новых токенов пользователю
  console.log(`\nMinting 1000 MTK to user...`);
  await token.mint(user.address, hre.ethers.parseEther("1000"));
  
  // Проверяем балансы после mint
  deployerBalance = await token.balanceOf(deployer.address);
  userBalance = await token.balanceOf(user.address);
  console.log(`\nBalances after mint:`);
  console.log(`  Deployer: ${hre.ethers.formatEther(deployerBalance)} MTK`);
  console.log(`  User: ${hre.ethers.formatEther(userBalance)} MTK`);
  
  // Transfer токенов от пользователя обратно деплоеру
  console.log(`\nTransferring 500 MTK from user to deployer...`);
  await token.connect(user).transfer(deployer.address, hre.ethers.parseEther("500"));
  
  // Проверяем финальные балансы
  deployerBalance = await token.balanceOf(deployer.address);
  userBalance = await token.balanceOf(user.address);
  console.log(`\nFinal balances:`);
  console.log(`  Deployer: ${hre.ethers.formatEther(deployerBalance)} MTK`);
  console.log(`  User: ${hre.ethers.formatEther(userBalance)} MTK`);
}

main().catch(console.error);