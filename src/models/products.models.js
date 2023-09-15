import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
    },
    category: { 
        type: String,
        required: true,
        index: true
    }
});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model('products', productSchema);
export { productModel };