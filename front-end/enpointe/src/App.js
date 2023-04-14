import {   useRoutes } from 'react-router-dom'
import Login from '../src/components/Login'
import Register from '../src/components/Register'
import Transactions from '../src/components/Transactions'
import Accounts from '../src/components/Accounts'
import './App.css';

const App=()=> {
    const routes = useRoutes([
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'transactions', element: <Transactions /> },
        { path: 'accounts', element: <Accounts /> }
    ])
    return routes;
}

export default App;
