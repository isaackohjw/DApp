// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Organization {
    string public name; // name of org
    address public token; // address of org ERC token
    address public owner; // org creator address

    mapping(address => bool) public admins; // map admin addresses
    VotingSession[] public votingSessions; // store all voting session

    event AdminAdded(address indexed admin);
    event VotingSessionCreated(uint256 indexed sessionId, string description);

    struct VotingSession {
        string description;
        uint256 deadline;
        bool oneVotePerUser;
        mapping(address => bool) hasVoted; // check if user had voted
        mapping(address => uint256) votes; // mapping of user addresses to votes casted
        uint256 totalVotes;
    }

    // restrict access to admin only 
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    // initialize org contract
    constructor(string memory _name, address _owner, address _token) {
        name = _name;
        owner = _owner;
        token = _token;
        admins[_owner] = true;
    }

    // add admin by address
    function addAdmin(address admin) public onlyAdmin {
        admins[admin] = true;
        emit AdminAdded(admin);
    }

    // create voting session
    function createVotingSession(
        string memory description,
        uint256 deadline,
        bool oneVotePerUser
        // modify so only admins can call createVotingSession
    ) public onlyAdmin {
        VotingSession storage session = votingSessions.push(); // store all voting sessions of org
        session.description = description;
        session.deadline = deadline;
        session.oneVotePerUser = oneVotePerUser;
        emit VotingSessionCreated(votingSessions.length - 1, description);
    }

    function vote(uint256 sessionId, uint256 amount) public {
        VotingSession storage session = votingSessions[sessionId];
        require(block.timestamp < session.deadline, "Voting closed");

        if (session.oneVotePerUser) {
            require(!session.hasVoted[msg.sender], "Already voted");
            session.hasVoted[msg.sender] = true;
            session.totalVotes += 1;
        } else {
            uint256 balance = IERC20(token).balanceOf(msg.sender);
            require(balance >= amount, "Insufficient token balance");
            session.votes[msg.sender] += amount;
            session.totalVotes += amount;
        }
    }
}
