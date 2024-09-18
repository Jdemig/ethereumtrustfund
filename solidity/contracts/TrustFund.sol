// SPDX-License-Identifier: No-license

pragma solidity 0.8.24;

/**
@title TrustFund
@author Jonathan Emig
*/
contract TrustFund {
    struct Deposit {
        uint256 depositId;
        address depositor;
        address beneficiary;
        uint256 amount;
        uint256 withdrawalDate;
    }

    uint256 public depositCounter; // Counter for unique deposit IDs
    mapping(uint256 => Deposit) private depositsById; // Mapping deposit ID to Deposit
    mapping(address => uint256[]) private depositIdsByAddress; // Mapping beneficiary & depositor to an array of deposit IDs

    event FundsDeposited(uint256 depositId, address indexed depositor, address indexed beneficiary, uint256 amount, uint256 withdrawalDate);
    event FundsWithdrawn(uint256 depositId, address indexed beneficiary, uint256 amount);

    // Function to deposit funds
    function depositFunds(address beneficiary, uint256 withdrawalDate) external payable {
        require(beneficiary != address(0), "Invalid beneficiary address");
        require(withdrawalDate > block.timestamp, "Withdrawal date must be in the future");
        require(msg.value > 0, "Amount must be greater than zero");

        depositCounter++; // Increment the deposit ID counter

        // Create a new deposit and store it by ID
        depositsById[depositCounter] = Deposit({
            depositId: depositCounter,
            depositor: msg.sender,
            beneficiary: beneficiary,
            amount: msg.value,
            withdrawalDate: withdrawalDate
        });

        // Store the deposit ID for both the depositor and the beneficiary
        if (beneficiary == msg.sender) {
            depositIdsByAddress[msg.sender].push(depositCounter);
        } else {
            depositIdsByAddress[beneficiary].push(depositCounter);
            depositIdsByAddress[msg.sender].push(depositCounter);
        }

        emit FundsDeposited(depositCounter, msg.sender, beneficiary, msg.value, withdrawalDate);
    }

    // Function for beneficiaries to withdraw funds
    function withdrawFunds(uint256 depositId) external {
        Deposit storage deposit = depositsById[depositId];
        require(deposit.amount > 0, "No funds available for withdrawal");
        require(msg.sender == deposit.beneficiary || msg.sender == deposit.depositor, "You must either be the depositor or the beneficiary to withdraw funds");

        if (msg.sender == deposit.beneficiary) {
            require(block.timestamp >= deposit.withdrawalDate, "Withdrawal date has not yet passed");
        }

        uint256 amount = deposit.amount;
        deposit.amount = 0; // Set the deposit amount to 0 to prevent re-entrancy

        payable(msg.sender).transfer(amount);

        emit FundsWithdrawn(depositId, msg.sender, amount);
    }

    // Function to return all the deposits of whoever is calling it
    function getMyDeposits() external view returns (Deposit[] memory) {
        uint256[] memory depositIds = depositIdsByAddress[msg.sender];
        Deposit[] memory myDeposits = new Deposit[](depositIds.length);

        for (uint256 i = 0; i < depositIds.length; i++) {
            myDeposits[i] = depositsById[depositIds[i]];
        }

        return myDeposits;
    }

    // Function to retrieve the deposits for a specific address (beneficiary or depositor)
    function getDepositsForAddress(address addr) external view returns (uint256[] memory) {
        return depositIdsByAddress[addr];
    }

    // Function to get details for a specific deposit
    function getDepositDetails(uint256 depositId) external view returns (Deposit memory) {
        Deposit storage deposit = depositsById[depositId];

        require(msg.sender == deposit.beneficiary || msg.sender == deposit.depositor, "You must be the beneficiary or the depositor to see these funds");

        return depositsById[depositId];
    }
}