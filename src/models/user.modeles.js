import mongoose from "mongoose";
const { Schema, model } = mongoose;


const userSchema = new Schema({
    nombre: String,
    apellido: String,
    edad: Number,
    email: {
        type: String,
        required: true
    },
    password: String
});
userSchema.index({ email: 1 }, { unique: true });
//Parámerto 1: Nombre Colección / Parámetro 2: Schema
export const userModel = model('users', userSchema)