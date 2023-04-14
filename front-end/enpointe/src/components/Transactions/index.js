import { Component } from 'react'
import Axios from "axios"
import { AiFillCloseCircle } from 'react-icons/ai'
import Cookies from "js-cookie"
import Record from '../Record'
import './index.css'

class Transactions extends Component {
    state = { showPopup: false, amount: 0, transactionType: '', balance: 0, transactions: []}

    componentDidMount = async () => {
        const token = Cookies.get("jwtToken")
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        try {
            const response = await Axios.get("http://localhost:3000/history", { headers })
            const updatedRecords = response.data
            const newRecords = updatedRecords.map((each) => this.transactionRecord(each))
            this.setState({ transactions: newRecords, balance: newRecords[0].balance })
          //  console.log(newRecords[0].balance)
        }
        catch (error) {
            console.log(error)
        }
    }

    closePopup = () => {
        this.setState({ showPopup: false, transactionType:'' })
    }

    updateAmount = (event) => {
        this.setState({amount:event.target.value})
    }

    transfer = async () => {
        const { amount, transactionType } = this.state
        const token = Cookies.get("jwtToken")
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type':'application/json'
        }
        try {
            const response = await Axios.post("http://localhost:3000/transfer", {
                amount,
                transactionType

            }, { headers })
            if (response.data === "Success") {
                alert("Transaction success")
                try {
                    const response = await Axios.get("http://localhost:3000/history", { headers })
                    const updatedRecords = response.data
                    const newRecords = updatedRecords.map((each) => this.transactionRecord(each))
                    this.setState({ transactions: newRecords, amount: 0, showPopup:false })
                }
                catch (error) {
                    console.log(error)
                }
                
            }
            else {
                alert(response.data)
            }
        }
        catch(error) {
            console.log(error)
        }
    }

    deposit = () => {
        this.setState({showPopup:true,transactionType:'Deposit'})
    }

    withdraw = () => {
        this.setState({ showPopup: true, transactionType: 'Withdraw' })
    }
    
    transactionRecord = (each) => (
         {
            username: each.username,
            balance: each.balance,
            transactionType: each.transaction_type,
            transferredAmount: each.transferred_amount,
            time: each.time
        }
    )

    render() {
        const { showPopup, transactions,balance } = this.state
        return (
            <div className="transactions-bg">
                <h2>Hi user, welcome to Enpointe online banking services</h2>
                
                <div className="buttons-container">
                    <button className="button" onClick={ this.deposit}>Deposit</button>
                    <button className="button" onClick={this.withdraw}>Withdraw</button>
                </div>
                {showPopup ? (
                    <div className="popup-container">
                        <AiFillCloseCircle className="icon" onClick={this.closePopup} />
                        <p>Available balance:{ balance}</p>
                        <p>Enter the amount you want to transfer</p>
                        <input type="number" className="input-field" onChange={ this.updateAmount} />
                        <button className="button" onClick={ this.transfer}>TRANSFER</button>
                    </div>
                ) : null}
                {transactions.length === 0 ?
                    (<p>You don't have any transactions in your account, please make your first deposit</p>) :
                    (   <div className="container">
                        <div className="record">
                        <p className="item">User</p>
                        <p className="item">Balance</p>
                        <p className="item">Transaction Type</p>
                        <p className="item">Transferred Amount</p>
                        <p className="item">Time</p>
                        </div>
                        <ul className="transaction-history">
                            {transactions.map(each => (
                               // <p>{each.username}</p>
                                <Record props={each}/>
                            )) }
                        </ul>   
                    </div>
                    )
                 }
                
            </div>

        )
    }
}

export default Transactions