import React, {Component} from 'react';
import jam from '../jam.png';

class Main extends Component {
   render() {
      return(
        <div id="content" className="mt-3">
            <table className='table table-borderless text-muted text-center'>
                <thead>
                    <tr>
                        <th scope="col">Balance de Staking</th>
                        <th scope="col">Balance de recompensas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{window.web3.utils.fromWei(this.props.tokenFarmBalance, "Ether")} JAM</td>
                        <td>{window.web3.utils.fromWei(this.props.stellartTokenBalance, "Ether")} STE</td>
                    </tr>
                </tbody>
            </table>

            <div className='card mb-4'>
                <div className='card-body'>
                    <form className='mb-3' onSubmit={(event) => {
                        event.preventDefault();
                        let amount = this.input.value.toString()
                        amount = window.web3.utils.toWei(amount, "Ether")
                        this.props.stakeTokens(amount)
                    }}>
                        <div>
                            <label className='float-left'>
                                <b>Stake Tokens</b>
                            </label>
                            <span className='float-right text-muted'>
                                Balance: {window.web3.utils.fromWei(this.props.jamTokenBalance, "Ether")}
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      );
   }
}

export default Main;