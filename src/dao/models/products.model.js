import { Schema, model } from "mongoose";

const collection = "products";
const schema = new Schema(
    {
        title: { type: String, required: true, index: true },
        description: { type: String },
        category: { type:String, default: "Laptops", enum:["Tablets", "Smartphones", "Headphones", "Laptopsl", "Smartwatches"] },
        image: { type:String, default:"https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=" },
        price: { type: Number, default: 10 },
        stock: { type: Number, default: 10 },
        onsale: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Product = model(collection, schema);
export default Product;