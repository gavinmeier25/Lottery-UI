import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3'
import lottery from './lottery'

class App extends Component {
    state= {
      balance: '',
      manager: '',
      players: [],
      value: '',
      message: '',
    }
  
  async componentDidMount(){
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({ manager, players, balance})
  }

  onClick = async (e) => {
    const accounts = await web3.eth.getAccounts()
    
    this.setState({ message: 'Picking a Winner'})

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    })

    this.setState({ message: 'A winner has been picked '})

  }

  onSubmit = async (e) => {
    e.preventDefault()

    const accounts = await web3.eth.getAccounts()

    this.setState({message: 'Waiting on transaction success...'})

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    })
    this.setState({ message: 'You have been entered'})
  }

  render() {
    web3.eth.getAccounts().then(console.log)
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This is managed by {this.state.manager}, 
          there are {this.state.players.length} in it to win!
          The prize is {web3.utils.fromWei(this.state.balance, 'ether')} ether minus gas, good luck!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div> 
            <label>Amount of ether to enter: </label>
            <input 
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Pick a Winner</h4>
        <button onClick={this.onClick}>Pick Winner</button>
        <hr /> 
        <h3>{this.state.message}</h3>
      </div>
    );
  }
}

export default App;
