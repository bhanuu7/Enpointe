import './index.css'

const Record = (each) => {
    const { username, balance, transactionType, transferredAmount, time } = each.props
    return (
        <div className="record">
            <p className="item">{username}</p>
            <p className="item">{balance}</p>
            <p className="item">{transactionType}</p>
            <p className="item">{transferredAmount}</p>
            <p className="item">{time}</p>
        </div>
    )
}

export default Record