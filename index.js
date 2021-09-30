const express = require('express')
var cors = require('cors')
var nodemailer = require('nodemailer');
const mysql = require('mysql2');
var generator = require('generate-password');

const app = express()
app.use(cors())
const port = process.env.PORT || 5000;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your email',
    pass: 'password for your email'
  }
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'ceremony'
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/send-email/:email',(req,res)=>{

  const email = req.params.email
  var password = generator.generate({
    length: 10,
    numbers: true
  });

  connection.query('INSERT INTO users (email, password) VALUES (?,?)', 
  [email, password],(error, 
  results) => {
     if (error) return res.json({ error: error });
    //  res.send(results).sendStatus(200); 

    const data = {
      from : 'prasadchathuranga9710@gmail.com',
      to : email,
      subject : 'Invitation for the Ceremony',
      html: `
      <h3>You're Invited !</h3>
      <p> You have invited for the ceremony </p>
      <p>Password for the Stream : teststream </p>
      <p>Date : 2021/09/30 08.30 AM </p>
      <p>Login for the Live Stream using below Link - </p>
      <a>http:/localhost:3000/login-stream</a>
      <p>Email Address - <b>`+ email +`</b></p>
      <p>Password - <b>`+ password +`</b></p>
      <p>Sent at : `+ new Date().toLocaleString() + `</p>`
  
    }
  
    transporter.sendMail(data, (err, result)=>{
      if (err) {
        res.send(err)
      }
      else{
        res.sendStatus(200);
      } 
      
    })

     });

});


app.post('/login/:email/:password',(req,res)=>{

  const email = req.params.email
  const password =  req.params.password

  connection.query(
    'SELECT * FROM `users` WHERE `email` = ? AND `password` = ?',
    [email, password],
    function(err, results) {
      if (err) return res.json({ err: err });
      res.send(results)
    }
  );
  

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})