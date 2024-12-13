# Decentralized Voting DApp 

![Screenshot 2024-12-10 014732](https://github.com/user-attachments/assets/8849440a-80ee-4c8a-864b-bbbbe3e9f071)

## Description

The Voting DApp is a decentralized application that allows participants to vote using tokenized votes, with different voting structures like equal and weighted voting. It utilizes smart contracts for governance, ensuring transparency, security, and decentralization. Participants can cast their votes based on the number of tokens they hold, where each token represents voting power in weighted voting sessions. The DApp is built using Next.js, React.js, and Tailwind CSS for the frontend, and Solidity smart contracts for the backend, enabling seamless interactions between the frontend and the blockchain.

## Tech Stack

- **Frontend**: Next.js, React.js, Tailwind CSS
- **Backend (Smart Contracts)**: Solidity, Hardhat for development and deployment
- **Blockchain**: Ethereum-based (ERC-20 tokens for voting power)
- **Smart Contract Interaction**: Viem (TypeScript library)
- **Wallet Integration**: MetaMask for secure wallet access
- **Hosting**: Vercel for frontend deployment

## System Architecture

The DApp's backend relies on Solidity smart contracts to facilitate the voting process. It employs the **Factory Design Pattern** with two key contracts: **Organization** and **OrganizationFactory**. The **OrganizationFactory** contract deploys a new **Organization** contract whenever a new organization is created, ensuring modularity and scalability.

### Smart Contract Design

- **Organization Contract**: Each instance of the **Organization** contract represents an independent organization, including its unique voting session.
- **OrganizationFactory Contract**: The **createOrganization** method dynamically deploys new **Organization** contracts, each with its own ERC-20 token representing shareholder ownership.
  
The system does not consume tokens during the voting process; instead, tokens represent voting power. In **weighted voting**, the number of tokens held dictates the number of votes a participant can cast. For **equal voting**, participants only need to hold at least one token to vote.

The DApp uses **Hardhat** for smart contract deployment and testing, ensuring reliability and smooth interaction with the blockchain.

## Pages and Features

**Home Page**: This page allows users to connect their wallets and browse available voting sessions.

**Voting Session Page**: Displays active voting sessions and allows users to cast their votes based on their token holdings.

**Admin Dashboard**: This section is reserved for organization owners and administrators to create and manage voting sessions.

**Voting Confirmation Page**: Users can review their selections and confirm their votes before submission.

**Results Page**: Displays voting results once the session is closed.

## Installation

### 1. Clone the Repository:

```bash
git clone https://github.com/yourusername/voting-dapp.git
cd voting-dapp
```

### 2. Install Dependencies:

Install the necessary frontend and backend dependencies:

```bash
npm install
```

### 3. Set Up the Smart Contracts:

1. Install **Hardhat** for contract development and testing:

   ```bash
   npm install --save-dev hardhat
   ```

2. Deploy the smart contracts using Hardhat:

   ```bash
   npx hardhat run scripts/deploy.js --network <your-network>
   ```

3. Configure **Viem** to interact with the smart contracts and **MetaMask** for secure wallet access.

### 4. Frontend Setup:

To configure the frontend:

1. Set up **Next.js**:

   ```bash
   npx create-next-app@latest voting-dapp-frontend
   cd voting-dapp-frontend
   ```

2. Install **Tailwind CSS** for styling:

   ```bash
   npm install tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

3. Set up **Viem** to connect the frontend to the blockchain:

   ```bash
   npm install viem
   ```

### 5. Start the Application:

Run the frontend application:

```bash
npm run dev
```

Visit `http://localhost:3000` to interact with the DApp.

## Usage

- **Connect your wallet**: Users can connect their Ethereum wallet (e.g., MetaMask) to the DApp for secure access and verification.
- **Vote on Proposals**: Users can participate in voting sessions depending on the token balance they hold. Each token represents voting power.
- **Admin Functions**: Admins can create and manage voting sessions, ensuring proper governance.
- **Results**: View the results after voting sessions conclude.

## Support

For any issues, please contact [Your Support Email] or visit the [GitHub Issues Page](https://github.com/yourusername/voting-dapp/issues).

## Roadmap

- Implement and test additional voting structures.
- Add user profiles and customization features.
- Optimize frontend for enhanced user experience.

## Authors and Acknowledgements

Voting DApp is developed by the following team members:

- Bundhoo Simriti
- Darren Teo Yiqian
- Tan Hao Yi
- Mahima Sharma
- Issac Koh Jun Wei

Special thanks to:

- Ethereum Community for its open-source tools and libraries.
- Hardhat for providing an efficient development framework.
- Tailwind CSS for easy and flexible styling.

## Project Status

The project is currently functional with key features like wallet integration, voting, and proposal creation. Future updates will focus on UI enhancements, testing, and additional features.
