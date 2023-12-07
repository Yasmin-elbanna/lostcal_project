const  mongoose  = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const utli = require('util');
const asyncsign = utli.promisify(jwt.sign)

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength:4
    },
    email: {
        type: String,
        required: true,
    unique:true,
   
         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        match:[/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,15}$/,'Please fill a valid password']  //special/number/capital 
    },
  
    passwordChangedAt: Date,


},{ timestamps: true });
schema.pre("save",async function(){
    if (this.isModified('password')) {
        const saltpass=15;
        const hashpass= await bcrypt.hash(this.password, saltpass)
        this.password = hashpass
    }
})
schema.methods.generateToken = function () {
    const token = asyncsign({
      id: this.id,
      email: this.email,
   
    }, process.env.secretkey)
    return token
  }
  userShema=mongoose.model('users',schema);
module.exports=userShema;
