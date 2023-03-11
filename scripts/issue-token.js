const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(callback) {
    let tokenFarm = await TokenFarm.deployed();
    await tokenFarm.issueTokens();
    // El código va aquí
    console.log('Tokens emitidos!');
    callback();
}