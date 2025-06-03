const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Leaderboard Contract", function () {
  let leaderboard;
  let owner, addr1, addr2;

  beforeEach(async () => {
    const Leaderboard = await ethers.getContractFactory("Leaderboard");
    [owner, addr1, addr2] = await ethers.getSigners();

    leaderboard = await Leaderboard.deploy(); // FIXED: await deployment
    // No .deployed() needed in recent Hardhat versions
  });

  it("Should allow a user to set their score", async () => {
    await leaderboard.connect(addr1).updateScore(1500);
    const score = await leaderboard.getScore(addr1.address);
    expect(score).to.equal(1500);
  });

  it("Should update score if a user submits a new one", async () => {
    await leaderboard.connect(addr1).updateScore(1000);
    await leaderboard.connect(addr1).updateScore(1800);
    const score = await leaderboard.getScore(addr1.address);
    expect(score).to.equal(1800);
  });

  it("Should return leaderboard with correct players and scores", async () => {
    await leaderboard.connect(addr1).updateScore(1200);
    await leaderboard.connect(addr2).updateScore(1300);

    const [players, scores] = await leaderboard.getLeaderboard();
    expect(players).to.include(addr1.address);
    expect(players).to.include(addr2.address);
    expect(scores.length).to.equal(2);
    expect(scores[0]).to.be.a("BigInt");
  });
});
