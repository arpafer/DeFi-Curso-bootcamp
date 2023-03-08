// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./JamToken.sol";
import "./StellartToken.sol";

// Owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// Usuario: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

contract TokenFarm {
    // Declaraciones iniciales
    string public name = "Stellart Token Farm";
    address public owner;
    JamToken public jamToken;
    StellartToken public stellartToken;

    // Estructuras de datos
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(StellartToken _stellartToken, JamToken _jamToken) {
       stellartToken = _stellartToken;
       jamToken = _jamToken;
       owner = msg.sender;
    }

    // Stake de tokens
    function stateTokens(uint _amount) public {
        // Se requiere una cantidad superior a 0
        require(_amount > 0, "La cantidad no puede ser un menor a 0");
        // Transferir tokens JAM al Smart contract principal
        jamToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);            
        }
        // actualizar los valores del staking
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Quitar el staking de los tokens
    function unstakeTokens() public {
        // Saldo del staking de un usuario
        uint balance = stakingBalance[msg.sender];
        // Se requiere una cantidad superior a 0
        require(balance > 0, "El balance del staking es 0");
        // Transferencia de los tokens al usuario
        jamToken.transfer(msg.sender, balance);
        // resetea el balance de staking del usuario
        stakingBalance[msg.sender] = 0;
        // Actualizar el estado del staking
        isStaking[msg.sender] = false;        
    }

    // emisión de Tokens (recompensas)
    function issueTokens() public {
        // unicamente ejecutable por el owner
        require(msg.sender == owner, "No eres el owner");
        // Emitir tokens a todos los stakers
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                stellartToken.transfer(recipient, balance);
            }
        }
    }
}