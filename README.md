# Stripe Payment Component Snippet

### Deployed on Netlify and accessible via the following link:
https://al-stripe-demo.netlify.app  

Build using: React, Stripe Card Elements, Stripe API, Bootstrap

### API used for this app deployed on Heroku accessible via the following link:
https://al-stripe-demo-api.herokuapp.com  
GitHub repo: https://github.com/AngelineLukmanova/stripe-api 

Build using: NodeJS, Express, Stripe API

## Description
This payment snippet is not for the customer but rather for the internal admin/manager usage. It is designed to make the operation like refunds and extra charges faster and easier by integrating them into the admin panel type application. For the simplicity of demonstration, a database is not being used. Instead, a new customer is being created for every new user and the customer id is being saved to the local storage. All saved information about transactions and payment methods is being fetched directly from Stripe using stripe API. 


![Screen Shot 2022-10-20 at 7 16 13 PM](https://user-images.githubusercontent.com/64429543/197076650-6be120f7-2b0c-43ad-8013-eecfad44c912.png)
