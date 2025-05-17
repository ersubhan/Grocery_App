import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

//add product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)
        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item)=> {
                let result = await cloudinary.uploader.upload(item.path, 
                    {resource_type: 'image'});
                    return result.secure_url
            })
        )

        // stores in database 
        await Product.create({...productData, image: imagesUrl})
        res.json({success: true, message: "Product Added"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//get product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//get product by id (single product) : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


//change product stock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        console.log(`Attempting to update product ${id} with inStock: ${inStock}`);
        
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { inStock }, 
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            console.log(`No product found with ID: ${id}`);
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        console.log(`Product updated successfully: ${updatedProduct._id}, inStock: ${updatedProduct.inStock}`);
        res.json({ success: true, message: "Stock Updated...", product: updatedProduct });
    } catch (error) {
        console.error("Error updating stock:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}