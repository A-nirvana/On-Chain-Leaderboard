// ignition/modules/LeaderboardModule.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LeaderboardModule", (m) => {
  const leaderboard = m.contract("Leaderboard", []);
  return { leaderboard };
});
