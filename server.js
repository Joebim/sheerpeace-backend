const express = require("express");
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const users_router = require("./routes/user.routes.js");
const auth_router = require("./routes/auth.routes.js");
const categoryRouter = require('./routes/category.routes');
const brandRouter = require('./routes/brand.routes.js');
const sizeRouter = require('./routes/size.routes.js');
const colorRouter = require('./routes/color.routes.js');
const wishlistRouter = require('./routes/wishlist.routes.js');
const productRouter = require('./routes/product.routes.js');
const reviewRouter = require('./routes/review.routes.js');
const uploadRouter = require('./routes/upload.routes.js');
const materialRouter = require('./routes/material.routes');
const shippingOptionRouter = require('./routes/shippingOption.routes');
const subcategoryRouter = require('./routes/subcategory.routes');
const collectionRouter = require('./routes/collection.routes');
const cartRouter = require('./routes/cart.routes.js');
const shippingAddressRouter = require('./routes/shippingAddress.routes.js');
const orderRouter = require('./routes/order.routes.js');
const messageRouter = require('./routes/message.routes.js');




const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/", express.static(__dirname + "/public"));
app.use("/api/users", users_router);
app.use("/api/auth", auth_router);
app.use('/api/categories', categoryRouter);
app.use('/api/brands', brandRouter);
app.use('/api/sizes', sizeRouter);
app.use('/api/colors', colorRouter);
app.use('/api/wishlists', wishlistRouter);
app.use('/api/products', productRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/materials', materialRouter);
app.use('/api/shipping-options', shippingOptionRouter);
app.use('/api/subcategories', subcategoryRouter);
app.use('/api/collections', collectionRouter);
app.use('/api/carts', cartRouter);
app.use('/api/shipping-addresses', shippingAddressRouter);
app.use('/api/orders', orderRouter);
app.use('/api/messages', messageRouter);


app.listen(process.env.PORT, () => {
    `Welcome to Sheerpeace Api`
    console.log(`running on port ${process.env.PORT}`);
});
