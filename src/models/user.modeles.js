import mongoose from "mongoose";
const { Schema, model } = mongoose;


const userSchema = new Schema({
    nombre:{
       type: String,
       required: true
    },
    apellido:{
        type: String,
        required: true
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
//Parámerto 1: Nombre Colección / Parámetro 2: Schema
export const userModel = model('users', userSchema)