import { ethers } from "hardhat";
import fs from 'fs';
import path from 'path';

const contractDetailsDataPath = path.join(__dirname, "../", "frontend", "src", "info", "contractDetails.json");


const jsonData = fs.readFileSync(contractDetailsDataPath, 'utf8');
const jsonObject = JSON.parse(jsonData);


async function main() {
  // const lockedAmount = ethers.utils.parseEther("1");

  // const ExclusiveArt = await ethers.getContractFactory("ExclusiveArt");
  // const exclusiveArt = await ExclusiveArt.deploy();
  
  // await exclusiveArt.deployed();
  // console.log("ExclusiveArt contract deployed to: ", exclusiveArt.address);

  const ArtBlockPlatform = await ethers.getContractFactory("ArtBlockPlatform");
  const artBlockPlatform = await ArtBlockPlatform.deploy("0x51c19A7118f19daacb72c940CDAd53Ae9fCD9046");

  console.log("ArtBlockPlatform contract deployed to: ", artBlockPlatform.address);

  // jsonObject.exclusiveArtContractAddress = exclusiveArt.address;
  jsonObject.artBlockPlatformContractAddress = artBlockPlatform.address;
  const updatedJsonData = JSON.stringify(jsonObject, null, 2);
  fs.writeFileSync(contractDetailsDataPath, updatedJsonData, 'utf8');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
