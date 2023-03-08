import React, { Component } from 'react';

import JamToken from '../abis/JamToken.json';
import StellartToken from '../abis/StellartToken.json';
import TokenFarm from '../abis/TokenFarm.json';

import Web3 from 'web3';

import Navigation from './Navbar';
import MyCarousel from './Carousel';

class App extends Component {

  async componentDidMount() {
    // 1. Carga de Web3
    await this.loadWeb3()
    // 2. Carga de datos de la Blockchain
    await this.loadBlockchainData()
  }

  // 1. Carga de Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts: ', accounts)
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('¡Deberías considerar usar Metamask!')
    }
  }

  // 2. Carga de datos de la Blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] });    
    // Ganache -> 5777, Rinkeby -> 4, BSC -> 97
    const networkId = await web3.eth.net.getId()     
    this.loadToken(JamToken, "jamToken");
    this.loadToken(StellartToken, "stellartToken");
    this.loadToken(TokenFarm, "tokenFarm");
    this.setState({loading: false});    
  }

  async loadToken(tokenAbi, tokenName) {
    const web3 = window.web3    
    const networkId = await web3.eth.net.getId();
    const tokenData = tokenAbi.networks[networkId];
    if (tokenData) {
      const tokenContract = new web3.eth.Contract(tokenAbi.abi, tokenData.address);
      this.setState({tokenName: tokenContract});
      let tokenBalance = {};
      if (tokenName.indexOf("Farm") > 0) {
         tokenBalance = await tokenContract.methods.stakingBalance(this.state.account).call();
      } else {
          tokenBalance = await tokenContract.methods.balanceOf(this.state.account).call();      
      }
      let tokenBalanceProp = tokenName + "Balance";
      this.setState({tokenBalanceProp: tokenBalance.toString()});
      // console.log("Balance " + tokenName + ": " + tokenBalance);
    } else {
      window.alert("El " + tokenName + " no se ha desplegado en la red");
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loading: true,
      jamToken: {},
      jamTokenBalance: '0',
      stellartToken: {},
      stellarTokenBalance: '0',
      tokenFarm: {},
      tokenFarmBalance: '0'
    }
  }

  render() {
    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                 
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
