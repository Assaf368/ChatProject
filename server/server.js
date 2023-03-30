require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const routesHandler = require('./routes/handler');



mongoose.connect('mongodb://127.0.0.1/chatDb', {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log("mongo connection is open!")
})
.catch(err => {
    console.log(err);
})


app.use(cors({
    origin: 'http://localhost:3000',
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/', routesHandler);


app.listen(5000, ()=>{
    console.log("running server on 5000...")
});