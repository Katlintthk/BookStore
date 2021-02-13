const fs = require('fs');
const path = require('path'); 
const filePath = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice){
        fs.readFile(filePath, (error, fileContent) =>{
            let cart = {
                products: [], 
                totalPrice: 0 
            };
            if(!error){
                cart = JSON.parse(fileContent);
            } else {
                console.log('error reading the cart file');
            }

            //analyse the cart to find existing products
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1; //update quantity of product
                cart.products = [...cart.products];//copy the old array
                cart.products[existingProductIndex] = updatedProduct; //replace existing product 

            }else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + productPrice;

            fs.writeFile(filePath, JSON.stringify(cart), error => {
                if (error) {
                    console.log('failed to write cart');
                }
                

            });
            
        });

    }
    static getCart(cb){
        //to access the file and get products id
        fs.readFile(filePath,(error,fileContent) => {
            const cart = JSON.parse(fileContent);
            if(error){
                cb(null);
            } else {
                cb(cart);
            }

        });
    }
}