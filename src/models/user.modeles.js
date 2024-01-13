import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    first_name: {
       type: String,
       required: true
    },
    last_name: {
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
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium']
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    documents: [{
        name: String,
        reference: String,
    }],
    last_connection: Date,
});
userSchema.plugin(paginate);
export const userModel = model('User', userSchema);