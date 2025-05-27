//import dtenv file
const dotenv=require('dotenv')
dotenv.config()//load envirnment variables

//import express library
const express = require('express')

//import cors
const cors = require('cors')
//import route
const route = require('./routes')

//import db connection file
require('./databaseconnection')


//create the server using express ()
const bookstoreServer = express()

//server using cors
bookstoreServer.use(cors())

//parse json data from frontend.its middleware(it break request response cycle).
bookstoreServer.use(express.json())
bookstoreServer.use(route)

//export the uploads folder from the server side
bookstoreServer.use('/upload',express.static('./uploads'))

bookstoreServer.use('/pdfuploads',express.static('./pdfuploads'))





//port creation
PORT = 4000 || process.env.PORT

bookstoreServer.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})



