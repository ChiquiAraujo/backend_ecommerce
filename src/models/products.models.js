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
        type: Number,
        required: true
    }, 
    category: { 
        type: String,
        required: true,
        index: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        default: 'admin'
    }
});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model('Product', productSchema);
export { productModel };