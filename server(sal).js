// start of section 1 Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

// //added from tae's code 
const qs=require('querystring'); 

// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL). Sends message to the server console for troubleshooting 
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });

 // Route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

//sets up the product array from the json file
const products = require(__dirname + "/products.json");

// Define a route for handling a GET request to a path that matches "./products.js"
app.get("/products.js", function (request, response, next) {
    // this is the response to a js file 
    response.type('.js');

    //create a JS string that has data from the products.json fileand convert the js string and embed it within the variable products
    let products_str = `let products = ${JSON.stringify(products)};`;

    //send the string in response to the request. This will send a string of data and break it up into pieces to see the quantity entered into your products
    response.send(products_str);
});

//middlewear 
app.use(express.urlencoded({extended: true}));

//do I need this avain here??
const product = require(__dirname + '/products.json');

// add qty_sold variable for each product. For every item in products, I want to add a quantity sold parameter
for (let i in products){
products.forEach((prod,i)=> {prod.qty_sold = 0});
}

//respond to the POST method on the html and then use it to do the process_purchase. It will handle the post request 
app.post("/process_form", function (request, response) {
     let POST = request.body;

    //boxes are all empty
    let has_qty = false; 
    //create an object to store the errors for each of quantity input 
    for (let i in products){
        let qty = POST [`qty${[i]}`];
        has_qty || (qty > 0 )
    }

    //validate using the validateQuantity function
    let errorMessages= validateQuantity(qty, products[i].qty_available);

    //store the error messages 
    if (errorMessage.length > 0 ){
        errorObject[`qty${[i]}_error`] = errorMessage.join(', ');
    }
});

    //if all input boxes are empty there will be no errors detectd
// if (has_qty == false && Object.keys(errorObject).length == 0){
//     //redirect to the products page with an 'error parameter in the url
//     response.redirect('./products.html?error');
// }

//if there is an input and there are no errors
else if (has_qty == true && Object.keys(errorObject).length == 0){
    //update the product quantities and redirect to invoice page
    for (let i in products) {
        let qty = POST[`qty${[i]}_error`];

        //update quantity sold for current product
        products[i].qty_sold += Number(qty);
        products[i].qty_available +=  products[i].qty_available - qty;
    }

    //redirect the invoice page with valid data in the url 
    response.redirect("./invoice.html?valid&" + qs.stringify(POST));
}

//if there is an input error 
else if (Object.keys(errorObject).length>0){
    //redirect to the products page
    response.redirect("./products.html?" + qs.stringify(POST) + `&inputErr`);
};

//funvtion to validate the quantity entered by the user against available quantity 
function validateQuantity(quantity, availableQuantity){
    let errors = [];

    quantity = Number(quantity);

    switch (true) {
        case isNaN(quantity) || quantity === '':
        errors.push("Not a number, Please enter a non-negative quantity to order.");
        break; 
    case quantity < 0 && !Number.isInteger(quantity):
        errors.push("Negative inventory.");
     case quantity != 0 &&  !Number.isInteger(quantity):
    errors.push("Not an integer");
    break; 
    case quantity > availableQuantity:
        errors.push("We do not have ${quantity} availableQuantity.");
        break; 
    }

    return errors;
}

//         case isNaN(quantity):
//             errorMessage = "Not a number. Please enter a non-negative quantity to order.";
//             break;
//         case quantity < 0 && !Number.isInteger(quantity):
//             errorMessage = "Negative inventory and not an Integer. Please enter a non-negative quantity to order.";
//             break;
//         case quantity < 0:
//             errorMessage = "Negative inventory. Please enter a non-negative quantity to order.";
//             break;
//         case !Number.isInteger(quantity):
//             errorMessage = "Not an Integer. Please enter a non-negative quantity to order.";
//             break;
//         default:
//             errorMessage = ""; // No errors
//             break;
//     }
  
//     return errorMessage;
// }
