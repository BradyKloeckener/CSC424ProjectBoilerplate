const mongoose = require('mongoose')
const User = require('./user.model')


const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({

    _id: Schema.Types.ObjectId,
 
    name:{
        type: String,
        required: true,
        trim:true
    },
    location:{
        type:String,
        trim: true
    },
    about:{
        type:String,
        trim: true
    },
    members:[

        {
            
            user_email: {
                type: String,
                required:true,

            },
            status:{
                type: String,
                required: true,
                trim: true
            }
            
        }
    ],
    events:[
        {

            _id: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            name:{
                type: String,
                required: true,
                trim: true
            },
            address:{
                type: String,
                trim: true
            },
            date:{
                type: Date,
            },
            time:{
                type: String,
            },
            description:{
                type: String,
                trim: true
            }
        
        }
    ],
    announcements:[
        {
            _id:{
                type: Schema.Types.ObjectId,
                required: true,
                //unique: true
            },
            title:{
                type: String,
                required: true,
                trim: true
            },
            content:{
                type: String,
               // required: true,
                trim: true
            }

        }
    ],

    chat:[
        {
            
            sender:{
                type: Schema.Types.ObjectId,
                required: true
            },
            message:{
                type: String,
                required: true,
                trim: true
            },
        },
        {timestamps: true}
    ]
})

const Organization = mongoose.model('Organization', OrganizationSchema)

module.exports = Organization