// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/**
@title TrustFund
@author Jonathan Emig
*/
contract TrustFund {
    struct Beneficiary {
        address beneficiaryAddress;
        uint256 withdrawalDate;
        uint256 amount;
    }

    mapping(address => Beneficiary) public beneficiaries;

    event FundsDeposited(address indexed depositor, uint256 indexed amount, uint256 indexed withdrawalDate);
    event FundsWithdrawn(address indexed beneficiary, uint256 indexed amount);

    function getTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    function getFundsAmount() external view returns (uint256) {
        return beneficiaries[msg.sender].amount;
    }

    function getFundsWithdrawalDate() external view returns (uint256) {
        return beneficiaries[msg.sender].withdrawalDate;
    }

    function depositFunds(address beneficiaryAddress, uint256 withdrawalDate) external payable {
        require(beneficiaryAddress != address(0), "Invalid beneficiary address");
        require(withdrawalDate > block.timestamp, "Withdrawal date must be in the future");
        require(msg.value > 0, "Amount must be greater than zero");

        if (beneficiaries[beneficiaryAddress].amount == 0) {
            beneficiaries[beneficiaryAddress] = Beneficiary(beneficiaryAddress, withdrawalDate, msg.value);
        } else {
            beneficiaries[beneficiaryAddress].amount += msg.value;
        }

        emit FundsDeposited(msg.sender, msg.value, withdrawalDate);
    }

    function withdrawFunds() external {
        Beneficiary storage beneficiary = beneficiaries[msg.sender];
        require(beneficiary.amount != 0, "No funds available for withdrawal");
        require(block.timestamp >= beneficiary.withdrawalDate, "Withdrawal date has not yet passed");
        require(msg.sender == beneficiary.beneficiaryAddress, "Only the beneficiary can withdraw funds");

        payable(msg.sender).transfer(beneficiary.amount);

        emit FundsWithdrawn(msg.sender, beneficiary.amount);
    }
}
