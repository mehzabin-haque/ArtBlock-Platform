import { ethers } from 'hardhat';
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from 'chai';
import { ArtBlockPlatform__factory, ArtBlockPlatform } from '../frontend/typechain'
import { Community__factory, Community } from '../frontend/typechain'
import { ABXToken__factory, ABXToken } from '../frontend/typechain'
import { ExclusiveArt__factory, ExclusiveArt } from '../frontend/typechain'
import { DEX__factory, DEX } from '../frontend/typechain'
import { CommunityToken__factory, CommunityToken } from '../frontend/typechain'

describe('artBlock', () => {

  async function deployOnceFixture() {
    const [owner, ...otherAccounts] = await ethers.getSigners();
    const greeter: ArtBlockPlatform = await new ArtBlockPlatform__factory(owner).deploy("0x51c19A7118f19daacb72c940CDAd53Ae9fCD9046");
    const abxToken: ABXToken = await new ABXToken__factory(owner).deploy();
    const comToken: CommunityToken = await new ABXToken__factory(owner).deploy();
    const exclusiveArt: ExclusiveArt = await new ExclusiveArt__factory(owner).deploy();
    const community: Community = await new Community__factory(owner).deploy("0x9fC355b1efD00795Ef1fc03afe8b66684026a65C", "Art Block", "token", "syntax", "description", abxToken.address, exclusiveArt.address);
    const dex: DEX = await new DEX__factory(owner).deploy(abxToken.address, comToken.address);
    return { greeter, community, owner, otherAccounts };
  }

//   it("Check ABX Balance", async function () {
//     const { greeter, owner } = await loadFixture(deployOnceFixture);
//     const balance = await greeter.getAbxBalance();
//     console.log('Your ABX balance:', balance.toString());
//     expect(await greeter.getAbxBalance()).to.equal("0");
//   });

//   it("Check ABX Balance", async function () {
//     const { greeter, owner } = await loadFixture(deployOnceFixture);
//     const reserve = await greeter.getReserve();
//     console.log('Your reserve balance:', reserve.toString());
//     expect(await greeter.getReserve()).to.equal("100000000000000000000000000000000000000");
//   });

//   it("Checking if abx purchase is successful", async function () {
//     const { greeter, owner } = await loadFixture(deployOnceFixture);
//     const payMeTx = await greeter.purchaseABX({
//       value: ethers.utils.parseEther("0.1") 
//     });
//     await payMeTx.wait();
//     const balance = Number(await greeter.connect(owner).provider.getBalance(greeter.address))
//     expect(ethers.utils.formatEther(balance+"") == "0.1");
//   });

  it("Propose Art", async function () {
    const { community, owner } = await loadFixture(deployOnceFixture);
    const artProposal = await community.artProposals(0);
    console.log(artProposal);
    const artName = "Test Art";
    const isExclusive = true;
    await community.proposeArt(artName, isExclusive);

    
    expect(artProposal.name).to.equal(artName);
    expect(artProposal.isExclusive).to.equal(isExclusive);
});
  

});