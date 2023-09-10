import { Schema, model } from "mongoose";

const userSchema = new Schema({
    products: {
        type: [
            {
                id_prod:{
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity:{
                    type : Number ,
                    required: true
                }
            }
        ],
        default: []
    }
});
export const cartModel = model('carts', cartSchema);