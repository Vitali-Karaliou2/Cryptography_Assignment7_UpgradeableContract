// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyTokenV1.sol";

contract MyTokenV2 is MyTokenV1 {
    function getVersion() public pure override returns (string memory) {
        return "V2";
    }
    
    // Дополнительная функция для демонстрации новой версии
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}