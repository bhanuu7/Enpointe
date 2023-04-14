import Cookies from 'js-cookie'
import Axios from 'axios'
import { Component } from 'react'
import {Link } from 'react-router-dom'
import Record from '../Record'
import './index.css'

class Accounts extends Component {
    state = { transactions: [] }

    transactionRecord = (each) => (
        {
            username: each.username,
            balance: each.balance,
            transactionType: each.transaction_type,
            transferredAmount: each.transferred_amount,
            time: each.time
        }
    )
    componentDidMount = async () => {
        const token = Cookies.get("jwtToken")
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        try {
            const response = await Axios.get("http://localhost:3000/accounts", { headers })
            const updatedRecords = response.data
            const newRecords = updatedRecords.map((each) => this.transactionRecord(each))
            this.setState({ transactions: newRecords })
        }
        catch (error) {
            console.log(error)
        }
    }

    render() {
        const { transactions } = this.state
       console.log(transactions)
        return (
            <div className="account-bg">
                <Link to="/login"><button className="logout-button">LOGOUT</button></Link>
                {transactions.map(each => (
                    // <p>{each.username}</p>
                    <Record props={each} />
                ))}
              <Link to="/login"><button clasName="button">LOGOUT</button></Link>
            </div>
        )
    }
}

export default Accounts