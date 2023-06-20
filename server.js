const express = require ('express');
const app = express();
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected', () =>{
    console.log("connected to mongo yeah")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting", err)
})

require('./models/user')
require('./post')

app.use(express.json())
app.use(require('./auth')) 
const adminPostsRoutes = require('./adminposts')
app.use(adminPostsRoutes)


const port = 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});