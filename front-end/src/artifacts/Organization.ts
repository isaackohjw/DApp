export const Organization =
	[
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "address",
					"name": "_owner",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "_token",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "admin",
					"type": "address"
				}
			],
			"name": "AdminAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "admin",
					"type": "address"
				}
			],
			"name": "AdminRemoved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "sessionId",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "deadline",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "bool",
					"name": "oneVotePerUser",
					"type": "bool"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "creationTime",
					"type": "uint256"
				}
			],
			"name": "VotingSessionCreated",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "admin",
					"type": "address"
				}
			],
			"name": "addAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "admins",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "deadline",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "oneVotePerUser",
					"type": "bool"
				}
			],
			"name": "createVotingSession",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "sessionId",
					"type": "uint256"
				},
				{
					"internalType": "enum Organization.VoteOption",
					"name": "option",
					"type": "uint8"
				}
			],
			"name": "getTotalVotesByOption",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "sessionId",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "user",
					"type": "address"
				}
			],
			"name": "getUserHasVoted",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "sessionId",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "user",
					"type": "address"
				}
			],
			"name": "getUserVoteOption",
			"outputs": [
				{
					"internalType": "enum Organization.VoteOption",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "sessionId",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "user",
					"type": "address"
				}
			],
			"name": "getUserVotes",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "hasVoted",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "name",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "admin",
					"type": "address"
				}
			],
			"name": "removeAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "token",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "totalVotes",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "enum Organization.VoteOption",
					"name": "",
					"type": "uint8"
				}
			],
			"name": "totalVotesByOption",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "userVotes",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "sessionId",
					"type": "uint256"
				},
				{
					"internalType": "enum Organization.VoteOption",
					"name": "option",
					"type": "uint8"
				}
			],
			"name": "vote",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "voteOptions",
			"outputs": [
				{
					"internalType": "enum Organization.VoteOption",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "votingSessions",
			"outputs": [
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "deadline",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "oneVotePerUser",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "creationTime",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	] as const;