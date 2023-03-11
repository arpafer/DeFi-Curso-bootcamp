import React, { Component } from 'react';

import JamToken from '../abis/JamToken.json';
import StellartToken from '../abis/StellartToken.json';
import TokenFarm from '../abis/TokenFarm.json';

import Web3 from 'web3';

import Navigation from './Navbar';
import MyCarousel from './Carousel';
import Main from './Main';

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
      if (tokenName === "jamToken")
         this.setState({jamToken: tokenContract});
      else if (tokenName === "stellartToken")
         this.setState({stellartToken: tokenContract});
      else 
         this.setState({tokenFarm: tokenContract});

      let tokenBalance = {};
      if (tokenName.indexOf("Farm") > 0) {
         tokenBalance = await tokenContract.methods.stakingBalance(this.state.account).call();
      } else {
          tokenBalance = await tokenContract.methods.balanceOf(this.state.account).call();      
      }      
      if (tokenName === "jamToken")
         this.setState({jamTokenBalance: tokenBalance.toString()});
      else if (tokenName === "stellartToken") 
         this.setState({stellartTokenBalance: tokenBalance.toString()});
      else 
         this.setState({tokenFarmBalance: tokenBalance.toString()});
      // console.log("Balance " + tokenName + ": " + tokenBalance);

      console.log(this.state);
    } else {
      window.alert("El " + tokenName + " no se ha desplegado en la red");
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      loading: false,
      jamToken: {},
      jamTokenBalance: '0',
      stellartToken: {},
      stellartTokenBalance: '0',
      tokenFarm: {},
      tokenFarmBalance: '0'
    }
  }

  stakeTokens = (amount) => {
    this.setState({loading: true});
    console.log(this.state);
    this.state.jamToken.methods.approve(this.state.tokenFarm._address, amount).send({from: this.state.account})
    .on('transactionHash', (hash) => {
       this.state.tokenFarm.methods.stateTokens(amount).send({from: this.state.account})
       .on('transactionHash', (hash) => {
         this.setState({loading: false});
       });
    });
  }

  unstakeTokens = (amount) => {
    this.setState({loading: true});
    this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account})
      .on("transactionHash", (hash) => {
        this.setState({loading: false});
      })
  }

  render() {        
    let content = <p id="loader" className='text-center'>Loading...</p>;
    if (!this.state.loading) {
      content = <Main 
         jamTokenBalance={this.state.jamTokenBalance}
         stellartTokenBalance={this.state.stellartTokenBalance}
         tokenFarmBalance={this.state.tokenFarmBalance}
         stakeTokens={this.stakeTokens}
         unstakeTokens={this.unstakeTokens}
      />
    }
    return (
      <div>
        <Navigation account={this.state.account} />
        <MyCarousel />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                  {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
