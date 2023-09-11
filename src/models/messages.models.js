import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const messageSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    message: {
        type: String,
        required :true
    },
    // postTime: {
    //     type: Date,
    //     default: Date.now // Me devuelve la fecha actual
    // }
});
const Message = model('Message', messageSchema);
export default Message;