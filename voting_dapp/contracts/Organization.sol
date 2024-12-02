// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Organization {
    string public name; // name of org
    address public token; // address of org ERC token
    address public owner; // org creator address

    enum VoteOption {
        ABSTAIN,
        YES,
        NO
    }

    mapping(address => bool) public admins; // map admin addresses
    VotingSession[] public votingSessions; // store all voting session

    event AdminAdded(address indexed admin);
    event VotingSessionCreated(uint256 indexed sessionId, string description);

    struct VotingSession {
        string description;
        uint256 deadline;
        bool oneVotePerUser;
        mapping(address => VoteOption) voteOption;
        mapping(address => bool) hasVoted; // check if user had voted
        mapping(address => uint256) votes; // mapping of user addresses to votes casted
        mapping(VoteOption => uint256) totalVotesByOption;
        uint256 totalVotes;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    constructor(string memory _name, address _owner, address _token) {
        name = _name;
        owner = _owner;
        token = _token;
        admins[_owner] = true;
    }

    function addAdmin(address admin) public onlyAdmin {
        admins[admin] = true;
        emit AdminAdded(admin);
    }

    function removeAdmin(address admin) public onlyAdmin {
        require(admin != owner, "Cannot remove owner");
        admins[admin] = false;
    }

    function createVotingSession(
        string memory description,
        uint256 deadline,
        bool oneVotePerUser
    ) public onlyAdmin {
        require(deadline > block.timestamp, "Invalid deadline");
        VotingSession storage session = votingSessions.push(); // store all voting sessions of org
        session.description = description;
        session.deadline = deadline;
        session.oneVotePerUser = oneVotePerUser;
        emit VotingSessionCreated(votingSessions.length - 1, description);
    }

    function vote(uint256 sessionId, VoteOption option) public {
        require(sessionId < votingSessions.length, "Invalid session ID");
        VotingSession storage session = votingSessions[sessionId];
        require(block.timestamp < session.deadline, "Voting closed");
        uint256 balance = IERC20(token).balanceOf(msg.sender);
        require(balance > 0, "Insufficient token balance");

        require(!session.hasVoted[msg.sender], "Already voted");
        session.hasVoted[msg.sender] = true;
        session.voteOption[msg.sender] = option;

        if (session.oneVotePerUser) {
            session.votes[msg.sender] += 1;
            session.totalVotesByOption[option] += 1;
            session.totalVotes += 1;
        } else {
            session.votes[msg.sender] += balance;
            session.totalVotesByOption[option] += balance;
            session.totalVotes += balance;
        }
    }

    function getTotalVotesByOption(
        uint256 sessionId,
        VoteOption option
    ) public view returns (uint256) {
        require(sessionId < votingSessions.length, "Invalid session ID");
        VotingSession storage session = votingSessions[sessionId];
        return session.totalVotesByOption[option];
    }

    function getUserHasVoted(
        uint256 sessionId,
        address user
    ) public view returns (bool) {
        require(sessionId < votingSessions.length, "Invalid session ID");
        VotingSession storage session = votingSessions[sessionId];
        return session.hasVoted[user];
    }

    function getUserVoteOption(
        uint256 sessionId,
        address user
    ) public view returns (VoteOption) {
        require(sessionId < votingSessions.length, "Invalid session ID");
        VotingSession storage session = votingSessions[sessionId];
        require(session.hasVoted[user], "User has not voted in this session");
        return session.voteOption[user];
    }

    function getUserVotes(
        uint256 sessionId,
        address user
    ) public view returns (uint256) {
        require(sessionId < votingSessions.length, "Invalid session ID");
        VotingSession storage session = votingSessions[sessionId];
        return session.votes[user];
    }
}
