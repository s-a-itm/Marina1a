//server.js

// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

const qs = require('querystring');

// Route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

/* Import data from a JSON file containing information about products
__dirname represents the directory of the current module (where server.js is located)
__dirname + "./products.json" specifies the location of products.json
*/
let products = require(__dirname + '/products.json');

for (i in products) {
  products.forEach( (prod,i) => {prod.total_sold = 0});
}

    
// Define a route for handling a GET request to a path that matches "./products.js"
app.get('/products.js', function(request, response, next) {
	// Send the response as JS
	response.type('.js');
	// Create a JS string (products_str) that contains data loaded from the products.json file
	// Convert the JS string into a JSON string and embed it within variable products
	const products_str = `let products = ${JSON.stringify(products)};`;
	// Send the string in response to the GET request
	response.send(products_str);
});

app.use(express.urlencoded({ extended: true }));



// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
app.all('*', function (request, response, next) {
	console.log(request.method + ' to ' + request.path);
	next();
 });


/////////////////////////////////////////////////////////////////////////////Process Form Stuff////////////////////////////////////////////////////////////////////////////////////
 app.post("/process_form", function (request, response) {
        console.log("Processing form...");
  let POST = request.body;

    // Loop through the products
    for (let i in products) {
      let qty = POST[`quantity_textbox${i}`];
      console.log(qty);
      let validationMessage = validateQuantity(qty);
  
      // Validate quantity
      if (validationMessage === "") {
        // Update the quantities array
        quantities.push(qty);
        
        // Append information to the URL string
        url += `&prod${i}=${qty}`;
      } else {
        hasValidationErrors = true;
        break; // Break the loop if there is an error
      }
    }
  
    // If there are validation errors, redirect to the store with an error parameter
    if (hasValidationErrors) {
    response.redirect("./products_display.html?"+qs.stringify(request.body) + "&validationMessage");
    } else {
      // If there are no errors, update quantities in the products array
      for (let i in products) {
        // Assuming products is an array of items with a corresponding index
        products[i]['qty_available'] -= quantities[i];
        products[i]['total_sold'] += Number(quantities[i]);
      }
  
      // Redirect to invoice.html with relevant data
      response.redirect("/invoice.html?valid&"+qs.stringify(request.body));
    }
  });



// Validate Quantity
function validateQuantity(quantity, maxQuantity) {
    let errorMessage = "";

    switch (true) {
        case isNaN(quantity):
            errorMessage = "Not a number. Please enter a non-negative quantity to order.";
            break;
        case quantity <= 0 && !Number.isInteger(quantity):
            errorMessage = "Negative inventory and not an Integer. Please enter a non-negative quantity to order.";
            break;
        case quantity <= 0:
            errorMessage = "Negative inventory. Please enter a non-negative quantity to order.";
            break;
        case !Number.isInteger(quantity):
            errorMessage = "Not an Integer. Please enter a non-negative quantity to order.";
            break;
        case quantity > maxQuantity:
            errorMessage = `Quantity exceeds the available stock (${maxQuantity}). Please enter a valid quantity.`;
            break;
        default:
            errorMessage = ""; // No errors
            break;
    }

    return errorMessage;
}

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));