const express = require("express")
const app = express()
const sqlite3 = require("sqlite3").verbose()
app.use(express.json())
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cors = require("cors")
app.use(cors())
 app.listen(3000)        
 const db = new sqlite3.Database("./Bank.db", sqlite3.OPEN_READWRITE, (err) => {
     if (err) return console.error(err.message) 
           console.log("Database Connected")
  })

//const query = 'drop table accounts'
//db.run(query, [], (err) => {
//    if (err) return console.error(err.message)
//    console.log("table droppped")
//})

//const query = `create table accounts(username varchar, balance decimal(10,2), transaction_type varchar, transferred_amount decimal(10,2),time time)`
//db.run(query, [], (err) => {
//    if (err) return console.error(err.message)
//    console.log("table created")
//})

    //const a = `insert into users values(?,?,?)`
    //db.run(a, ["Bhanu411",], (err) => {
    //    if (err) return console.error(err.message)
    //console.log("recorded")
    //})


//const query = `delete from accounts where username='Bhanu411'`
//db.run(query, [], (err) => {
//    if (err) return console.error(err.message)
//    console.log("deleted")
//})

    //const query = `update users set role='banker' where username='Bhanu411'`
    //db.run(query, [], (err, res) => {
    //    if (err) return console.error(err.message)
    //    console.log(res)
    //})



  // Login API
app.post("/login", async (request, response) => {
    const { username, password } = request.body
    const checkQuery = `select * from users where username = '${username}'`
    await db.get(checkQuery, [], async(err,rows) => {
        if (err) return console.error(err.message)
        if (rows !== undefined) {
            const comparePassword = await bcrypt.compare(password, rows.password)
            if (comparePassword === true) { 
                const payload = {
                    username
                }
                const secret = "Bhanu"
                const token = await jwt.sign(payload, secret)
                console.log(token)
            if (rows.role === "customer") {
                response.send({role:"customer",token})
            }
            else {
                response.send({role:"banker",token})
            }
             
                
        }
        else {
            response.send("Wrong Password")
        }
    }
    else {
        response.send("User don't exist")
        }
    })
})

//Register API
app.post("/register", async (request, response) => {
    const { username, password } = request.body
    
    const checkUserQuery = `select * from users where username='${username}'`
    db.get(checkUserQuery, [], async(err,rows) => {
        if (rows!==undefined) {
            response.send("Username already Exists")
        }
        else {
            const hashedPassword = await bcrypt.hash(password,10)
            const insertQuery = `Insert into users values (?,?,?)`
            db.run(insertQuery, [username, hashedPassword,`customer`],async (err, res) => {
                if (err) return console.error(err.message)
                else {
                    const payload = {
                        username
                    }
                    const secret = "Bhanu"
                    const token = await jwt.sign(payload, secret)
                    response.send(token)
                }               
            })
        }
    })
})

//Transfer API
app.post("/transfer", (request, response) => { 
    const authorizationHeader = request.headers.authorization.split(' ')[1]
    const {transactionType,amount } = request.body
     const secret= "Bhanu"
    if (authorizationHeader === undefined) {
        response.send("Invalid Access Token")
    }
    else {
        try {
            jwt.verify(authorizationHeader, secret, async (error, payload) => {
                if (error) {
                    console.log(error)
                }
                else {
                    const checkQuery = `select balance from accounts where username = '${payload.username}' order by time desc limit 1`
                    db.get(checkQuery, [], (err, res) => {
                        if (err) return console.error(err.message)
                        if (transactionType === "Deposit") {
                            if (res !== undefined) {
                                const query = `insert into accounts values(?,?,?,?,current_timestamp)`
                                db.run(query, [payload.username, parseInt(res.balance) + parseInt(amount), transactionType, parseInt(amount)], (err) => {
                                    if (err) {
                                        response.send(err.message)
                                    }
                                    else {
                                        response.send("Success")
                                    }
                                })
                            }
                            else {
                                const query = `insert into accounts values(?,?,?,?,current_timestamp)`
                                db.run(query, [payload.username, parseInt(amount), transactionType, parseInt(amount)], (err) => {
                                    if (err) {
                                        response.send(err.message)
                                    }
                                    else {
                                        response.send("Success")
                                    }
                                })
                            }
                        }
                        else {
                            if (res !== undefined) {
                                const checkQuery = `select balance from accounts where username = '${payload.username}' order by time desc limit 1`
                                db.get(checkQuery, [], (err, res) => {
                                    if (err) return console.error(err.message)
                                    if (amount > res.balance) {
                                        response.send("Cannont perform the withdrawal as you don't have enough balance")
                                    }
                                    else {
                                        const query = `insert into accounts values(?,?,?,?,current_timestamp)`
                                        db.run(query, [payload.username,  parseInt(res.balance)-parseInt(amount) , transactionType, parseInt(amount)], (err) => {
                                            if (err) {
                                                response.send(err.message)
                                            }
                                            else {
                                                response.send("Success")
                                            }
                                        })
                                    }

                                })
                            }
                            else {
                                response.send("Cannont perform the withdrawal as you don't have enough balance")
                            }
                        }
                    })
                    //const Insertquery = `Insert into accounts values (?,?,?,?)`
                    //db.run(insertquery,[payload.username,])
                }
            })

        }
        catch (error) {
            console.log(error)
        }
        
    }

})

//Account history
app.get("/history", (request, response) => {
    const authorizationHeader = request.headers.authorization.split(' ')[1]
    const secret = "Bhanu"
    if (authorizationHeader === undefined) {
        response.send("Invalid Access Token")
    }
    else {
        try {
            jwt.verify(authorizationHeader, secret, async (error, payload) => {
                if (error) {
                    console.log(error)
                }
                else {
                    const query = `select * from accounts where username='${payload.username}' order by time desc`
                    db.all(query, [], (err,res) => {
                        if (err) return console.error(err.message)
                        response.send(res)
                    })
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }
})

// All bank account details API

app.get("/accounts", (request, response) => {
    const authorizationHeader = request.headers.authorization.split(' ')[1]
    const secret = "Bhanu"
    if (authorizationHeader === undefined) {
        response.send("Invalid Access Token")
    }
    else {
        try {
            jwt.verify(authorizationHeader, secret, async (error, payload) => {
                if (error) {
                    console.log(error)
                }
                else {
                    const query = `select * from accounts order by time desc`
                    db.all(query, [], (err, res) => {
                        if (err) return console.error(err.message)
                        response.send(res)
                    })
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }
})

module.exports=app