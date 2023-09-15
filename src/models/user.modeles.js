import mongoose from "mongoose";
const { Schema, model } = mongoose;


const userSchema = new Schema({
    nombre:{
       type: String,
       required: true
    },
    apellido:{
        type: String,
        required: true,
        index: true
     },
    edad: {
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
     }
});
userSchema.index({ email: 1 }, { unique: true });
export const userModel = model('users', userSchema)