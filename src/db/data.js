const { text } = require("express")
const mongoose=require("mongoose")

mongoose.connect('mongodb://127.0.0.1:27017/Chel')


const cfc = mongoose.model('cfc',{
    name:{
        type:String
    },
    age:{
        type:Number
    },
    position:{
        type:String
    },
    nationality:{
        type:String
    }

})

const pass = mongoose.model('pass',{
    username:{
            type:String
        },
    password:{
            type:String
        },
    email:{
            type:String
        }
})

module.exports={
    pass: pass,
    cfc: cfc   
}
