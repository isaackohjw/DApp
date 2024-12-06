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

    mapping(address => bool) public admins; // Map admin addresses
    VotingSession[] public votingSessions; // Store all voting sessions

    mapping(uint256 => mapping(address => VoteOption)) public voteOptions; // sessionId -> user -> vote option
    mapping(uint256 => mapping(address => bool)) public hasVoted; // sessionId -> user -> has voted
    mapping(uint256 => mapping(VoteOption => uint256)) public totalVotesByOption; // sessionId -> vote option -> total votes
    mapping(uint256 => uint256) public totalVotes; // sessionId -> total votes
    mapping(uint256 => mapping(address => uint256)) public userVotes; // sessionId -> user -> number of votes

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);

    event VotingSessionCreated(uint256 indexed sessionId, string description, uint256 deadline, bool oneVotePerUser, uint256 creationTime);

    struct VotingSession {
        string description;
        uint256 deadline;
        bool oneVotePerUser;
        uint256 creationTime;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    constructor(
        string memory _name,
        address _owner,
        address _token
    ) {
        name = _name;
        owner = _owner;
        token = _token;
        admins[_owner] = true;
    }

    function addAdmin(address admin) public onlyAdmin {
        require(!admins[admin], "Already an admin");
        admins[admin] = true;
        emit AdminAdded(admin);
    }
    function removeAdmin(address admin) public onlyAdmin {
        require(admin != owner, "Cannot remove owner");
        require(admins[admin], "Not an admin");
        admins[admin] = false;
        emit AdminRemoved(admin);
    }

    function createVotingSession(
        string memory description,
        uint256 deadline,
        bool oneVotePerUser
    ) public onlyAdmin {
        require(deadline > block.timestamp, "Invalid deadline");
        votingSessions.push(VotingSession(description, deadline, oneVotePerUser, block.timestamp));
        emit VotingSessionCreated(votingSessions.length - 1, description, deadline, oneVotePerUser, block.timestamp);
    }

    function vote(uint256 sessionId, VoteOption option) public {
        require(sessionId < votingSessions.length, "Invalid session ID");
        VotingSession storage session = votingSessions[sessionId];
        require(block.timestamp < session.deadline, "Voting closed");
        uint256 balance = IERC20(token).balanceOf(msg.sender);
        require(balance > 0, "Insufficient token balance");

        require(!hasVoted[sessionId][msg.sender], "Already voted");
        hasVoted[sessionId][msg.sender] = true;
        voteOptions[sessionId][msg.sender] = option;

        uint256 voteWeight = session.oneVotePerUser ? 1 : balance;
        userVotes[sessionId][msg.sender] = voteWeight;
        totalVotesByOption[sessionId][option] += voteWeight;
        totalVotes[sessionId] += voteWeight;
    }

    function getTotalVotesByOption(uint256 sessionId, VoteOption option)
        public
        view
        returns (uint256)
    {
        return totalVotesByOption[sessionId][option];
    }

    function getUserHasVoted(uint256 sessionId, address user)
        public
        view
        returns (bool)
    {
        return hasVoted[sessionId][user];
    }

    function getUserVoteOption(uint256 sessionId, address user)
        public
        view
        returns (VoteOption)
    {
        require(hasVoted[sessionId][user], "User has not voted in this session");
        return voteOptions[sessionId][user];
    }

    function getUserVotes(uint256 sessionId, address user)
        public
        view
        returns (uint256)
    {
        return userVotes[sessionId][user];
    }
}
