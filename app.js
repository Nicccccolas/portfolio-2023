const express = require('express')
const app = express()

const PORT = process.env.PORT || 8000
const bodyParser = require('body-parser')
const cors = require('cors')
const nodemailer = require('nodemailer')
const sendGridTransporter = require('nodemailer-sendgrid-transport')


require('dotenv').config()


app.get('/test', (request, response) => {
  response.send('Hello react and node js')
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const transporter = nodemailer.createTransport(
  sendGridTransporter({
    auth: {
      api_key: process.env.API_SENDGRID
    }
  })
)

app.post('/sendmail', (request, response) => {

  const { name, email, jobTypes, message } = request.body

  if(!name){
    return response.status(400).json({error: 'Please add your name'})
  }
  
  if(!email){
    return response.status(400).json({error: 'Please add your email'})
  }
  
  if(!jobTypes){
    return response.status(400).json({error: 'Please add job type'})
  }
  
  if(!message){
    return response.status(400).json({error: 'Please add your message'})
  }

  transporter.sendMail({
    to: 'nicolaspantojadi@gmail.com',
    from: 'nicolaspantojadi@gmail.com',
    subject: 'Alert! Job Offert!',
    html: `
    
    <h5>Details Information: </h5>

    <ul>
    <li>
    <p>Select Type</p>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Job Types: ${jobTypes}</p>
    <p>Message: ${message}</p>
    </li>
    </ul>
    
    `

  })

  response.json({ success: 'Your e-mail has been sent'})
})


app.listen(PORT, (require, response) => {
  console.log(`Server port ${PORT} connected.`)
})