// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Leaderboard {
    // Maps userId to highest score
    mapping(string => uint256) public scores;

    // Stores all unique userIds
    string[] public players;

    // To prevent duplicates in players[]
    mapping(string => bool) public playerExists;

    function updateScore(string calldata userId, uint256 newScore) external {
        if (!playerExists[userId]) {
            players.push(userId);
            playerExists[userId] = true;
        }

        // Only update if the new score is higher
        if (newScore > scores[userId]) {
            scores[userId] = newScore;
        }
    }

    function getScore(string calldata userId) external view returns (uint256) {
        return scores[userId];
    }

    function getLeaderboard() external view returns (string[] memory, uint256[] memory) {
        uint256[] memory allScores = new uint256[](players.length);
        for (uint256 i = 0; i < players.length; i++) {
            allScores[i] = scores[players[i]];
        }
        return (players, allScores);
    }
}
