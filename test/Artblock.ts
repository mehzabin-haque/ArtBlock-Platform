import { ethers } from 'hardhat';
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from 'chai';
import { ArtBlockPlatform__factory, ArtBlockPlatform } from '../frontend/typechain'




describe('greeter', () => {

  async function deployOnceFixture() {
    const [owner, ...otherAccounts] = await ethers.getSigners();
    const greeter: ArtBlockPlatform = await new ArtBlockPlatform__factory(owner).deploy("0x51c19A7118f19daacb72c940CDAd53Ae9fCD9046");
    return { greeter, owner, otherAccounts };
  }

  it("Check ABX Balance", async function () {
    const { greeter, owner } = await loadFixture(deployOnceFixture);
    const balance = await greeter.getAbxBalance();
    console.log('Your ABX balance:', balance.toString());
    expect(await greeter.getAbxBalance()).to.equal("0");
  });

  it("Test Suite 4", async function () {
    const { greeter, owner } = await loadFixture(deployOnceFixture);
    const reserve = await greeter.getReserve();
    console.log('Your reserve balance:', reserve.toString());
    expect(await greeter.getReserve()).to.equal("100000000000000000000000000000000000000");
  });

  it("Checking if abx purchase is successful", async function () {
    const { greeter, owner } = await loadFixture(deployOnceFixture);
    const payMeTx = await greeter.purchaseABX({
      value: ethers.utils.parseEther("0.1") 
    });
    await payMeTx.wait();
    const balance = Number(await greeter.connect(owner).provider.getBalance(greeter.address))
    expect(ethers.utils.formatEther(balance+"") == "0.1");
  });

  it("should transfer the community token to the artist and update the artwork owner", async function () 
  { const { greeter, owner, otherAccounts } = await loadFixture(deployOnceFixture); 
  const artist = otherAccounts[0];
   const auctionId = 1; 
   const auction = { start: 0, interval: 100, decrement: 1, artwork: { nftTokenId: 1, artworkTokenId: 1, artist: artist.address, }, };
    await greeter.createDutchAuction(auctionId, auction); 
    const initialABXBalance = await greeter.getAbxBalance(artist.address);



});