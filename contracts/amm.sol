// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";

contract AMMPlatform {
    // Fee percentages 
    uint256 public constant LP_FEE_PERCENTAGE = 10; // LP fee percentage
    uint256 public constant AMM_FEE_PERCENTAGE = 30; // AMM fee percentage

    ERC20 public tokenA; // ERC20 token A contract
    ERC20 public tokenB; // ERC20 token B contract
    ERC20 public lpToken; // ERC20 LP token contract

    constructor(address _tokenA, address _tokenB) {
        tokenA = ERC20(_tokenA);
        tokenB = ERC20(_tokenB);

        // Deploy ERC20 LP token contract
        lpToken = new ERC20("LP Token", "LPT");
    }

    function swap(address fromToken, uint256 amount) external {
        require(fromToken == address(tokenA) || fromToken == address(tokenB), "Invalid token");

        // Transfer tokens from the sender
        ERC20(fromToken).transferFrom(msg.sender, address(this), amount);

        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));

        // Calculate amountOut based on constant product formula
        uint256 amountOut = getAmountOut(amount, reserveA, reserveB);

        // Calculate fees
        uint256 lpFee = (amount * LP_FEE_PERCENTAGE) / 10000;
        uint256 ammFee = (amount * AMM_FEE_PERCENTAGE) / 10000;

        // Transfer tokens and fees
        if (fromToken == address(tokenA)) {
            tokenA.transfer(msg.sender, amount - lpFee - ammFee);
            tokenB.transfer(msg.sender, amountOut);
            tokenA.transfer(address(lpToken), lpFee);
            tokenB.transfer(address(lpToken), amountOut + ammFee);
        } else {
            tokenB.transfer(msg.sender, amount - lpFee - ammFee);
            tokenA.transfer(msg.sender, amountOut);
            tokenB.transfer(address(lpToken), lpFee);
            tokenA.transfer(address(lpToken), amountOut + ammFee);
        }
    }

    function getAmountOut(uint256 amountIn, uint256 reserveA, uint256 reserveB) internal pure returns (uint256) {
        require(amountIn > 0, "Amount must be greater than zero");
        require(reserveA > 0 && reserveB > 0, "Reserves must be greater than zero");

        return (amountIn * reserveB) / reserveA;
    }
}
