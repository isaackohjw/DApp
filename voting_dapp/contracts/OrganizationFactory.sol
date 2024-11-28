// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// import Organization
import "./Organization.sol";  

contract OrganizationFactory{

    address[] public organizations; // array of created orgs
    event OrganizationCreated(address indexed organization, string name); // event emitted when new org is created

    function createOrganization(string memory name, address ercToken) public {

        Organization org = new Organization(name, msg.sender, ercToken); // deploy new org contract
        organizations.push(address(org)); // add address of new org to organizations array

        emit OrganizationCreated(address(org), name); // emit when new org created
    }

    function getOrganizations() public view returns (address[] memory){
        return organizations;
    }
}
