const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const{JWT_SECRET } = require('./keys')


 

router.post('/signup',(req,res)=>{
    const {name, email,password} = req.body
    if(!email || !password || !name){
        return res.json({error: "please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const newUser = new User({
                email,
                password:hashedpassword,
                name
            })
    
            newUser.save()
            .then(user=>{
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
   .catch(err=>{
     console.log(err)
   })
})

router.post('/signin', (req,res)=>{
    const {email,password} = req.body
    console.log('Received email:', email)
    console.log('Received password:', password)
    console.log(email,password)
    if (!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        console.log('Saved User:', savedUser);
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            console.log('Password Match:', doMatch);
            if(doMatch){
                //res.json({message:"successfully signed in"})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id,name,email} = savedUser
                res.json({token, user:{_id,name,email}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


module.exports = router