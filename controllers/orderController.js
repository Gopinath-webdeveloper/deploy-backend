const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

//Create Order - /api/v1/order 
exports.createOrder = async (req, res, next) => {
    const cartItems = req.body;
    //  console.log(cartItems);
    const amount = Number(cartItems.reduce((acc, item) => (acc + item.product.price * item.qty), 0)).toFixed(2);
    // console.log("amount ",amount)
    const status = 'pending';
    const order = await orderModel.create({cartItems, amount, status})
    // console.log(order);


    //  updating product stock 
    cartItems.forEach(async (item)=>{
        // console.log(item.product);
        const product = await productModel.findById(item.product._id);
        // console.log(product.stock);
        // console.log(item.qty);
        // console.log(product)
        product.stock = product.stock - item.qty ;
       await product.save();
    })


    res.json(
        {
            success:true,
            order
        }
    )
}