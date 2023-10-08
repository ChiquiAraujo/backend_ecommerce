import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2'

const { Schema, model } = mongoose;


const userSchema = new Schema({
    first_name:{
       type: String,
       required: true
    },
    last_name:{
        type: String,
        required: true,
        index: true
     },
    age: {
        type: Number,
        required: true
     },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
     },
     rol:{
        type: String,
        default: 'user'
     }
});
userSchema.index({ email: 1 }, { unique: true });
userSchema.plugin(paginate)
export const userModel = model('users', userSchema)