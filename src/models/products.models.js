import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const productSchema = new Schema ({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    thumbnail:[],
    code:{
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: String,
        required: true
    }
});

const productModel = mongoose.model('products', productSchema);
export { productModel };