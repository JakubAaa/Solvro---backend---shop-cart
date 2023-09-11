# Shopping Cart

## Overview

Welcome to the Shopping Cart Server-side project! This application is designed to manage a user's shopping cart with
various features to enhance their shopping experience. Users can effortlessly add products to their cart, remove items
as needed, and view their cart's contents, making shopping efficient and user-friendly.

## Features

- Effortless Shopping: Easily add and delete products in your cart.
- User-Centric Cart Management: View and customize your cart, change quantities, and choose shipping methods.
- Smart Discounts: Apply discount codes to save on your purchases.
- Shareable Carts: Share your cart via a convenient link for collaborative shopping.

## Tech Stack

This project is built using Node.js, Express.js, TypeScript, MongoDb and tested using Jest.

## How to Run

1. Clone this repository to your local machine.
2. Ensure you have Node.js and npm (Node Package Manager) installed.
3. Create .env file in the project root directory to store your environment variables.
4. Open the .env file and add necessary environment variables:

   `MONGO_URL=your_mongo_db_url_here`  
   `PORT=your_port_here`  
   `URL_DOMAIN=your_url_domain_here`  
   `SHARE_LINK_DOMAIN=your_share_link_domain_here`

5. Navigate to the project directory in your terminal.
6. Install the necessary dependencies using npm:

   `npm install`

7. Run the application:

   `npm run dev`

The server should now be running at the specified port (as set in your environment variables) or on the default
port &rarr; 3000.
