//Necessary modules
const express = require('express'); //To run a server
const mysql = require("mysql2"); //MySQL database
const bodyParser = require('body-parser'); //to Contact with files
const {connection} = require('./db-connection.js') //MySQL database connection info

const app = express();

const db = mysql.createConnection(connection) //Create DB connection
db.connect((err)=>{
    if(err) throw err;
    console.log('Connected!');
})

let initialPath = __dirname;

app.use(bodyParser.json());
app.use(express.static(initialPath));

//Sending HTML files to specific links/paths
app.get('/',(req,res)=>{
    res.sendFile(initialPath + "/index.html")
});
app.get('/login/',(req,res)=>{
    res.sendFile(initialPath + "/login.html")
});
app.get('/register/',(req,res)=>{
    res.sendFile(initialPath + '/register.html')
});

//Getting register form info and sending data back
app.post('/register-user/', (req,res) => {
    const { name,email,password } = req.body;
    if(!name.length || !email.length || !password.length){
        return res.json("Fill out all the fields")
    }
    db.query("INSERT INTO `users`(`Name`, `Email`, `Password`) VALUES (?,?,?)",[`${name}`, `${email}`.toLowerCase(), `${password}`], (err,result) => {
        if(`${err}`.includes("Duplicate entry")) return res.json("Email already exists")
        else if(result.affectedRows === 1){
            return res.json({name: name,email:email.toLowerCase()}) //Sending an object with name key
        } else {
            console.log(`${err}\n\n${result}`)
        }
    })
})

//Getting login form info, checking and sending data back
app.post('/login-user/', (req,res) => {
    const { email,password } = req.body;

    db.query("SELECT * FROM users WHERE `Email` = ?",[email.toLowerCase()], (err,result) => {
        if(err) return res.json(err)
        else if(result[0] === undefined) return res.json("Email is not registered")
        else {
            if(result[0].Password == password){
                return res.json({name:result[0].Name, email: result[0].Email}) //Sending an object with name and email to store
            } else {
                return res.json("Incorrect Password");
            }
        }

    })
})

app.post('/delete-user',(req,res)=>{
    const {email,password} = req.body;

    db.query("SELECT * FROM users WHERE `Email`=?",[email.toLowerCase()], (err,results) => {
        // console.log(email);
        if(results[0].Password == password){
            db.query("DELETE FROM users WHERE `Password`=?",[results[0].Password],(err,result)=>{
                return res.json({msg:"Deleted"});
            })
        } else {
            return res.json("Password didn't match")
        }
    })
})

//Running server on port 432
app.listen(432, (req,res)=>{
    console.log('Listening...');
});