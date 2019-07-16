
[![Build Status](https://travis-ci.org/King-Success/Auto-Mart.svg?branch=develop)](https://travis-ci.org/King-Success/Auto-Mart)
[![Coverage Status](https://coveralls.io/repos/github/King-Success/Auto-Mart/badge.svg?branch=develop)](https://coveralls.io/github/King-Success/Auto-Mart?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/4f7fa4349776d125ea8c/maintainability)](https://codeclimate.com/github/King-Success/Auto-Mart/maintainability)
# AUTO MART
Auto Mart is an online marketplace for automobiles of diverse makes, model or body type. With
Auto Mart, users can sell their cars or buy from trusted dealerships or private sellers.

### This branch/version is actively being consumed by the frontend app
Adjustment were made on the response and request specifications after frontend app has been built, the branch contains response and request specs as used by the frontend app. The frontend app will be updated to use the lastest API version in the future

### UI Templates
My UI templates can be found here: [ UI ](https://king-success.github.io/Auto-Mart)

### Pivotal Tracker
My Pivotal Tracker board can be found [ here ](https://www.pivotaltracker.com/n/projects/2348962)

### API Documentation
My API documentation can be found [ here ](https://andela-auto-mart.herokuapp.com/api/docs)

### Heroku Link
My Heroku Link can be found [ here ](https://andela-auto-mart.herokuapp.com)

### Key Application Features
1. User can sign up.
2. User can sign in.
3. User (seller) can post a car sale advertisement.
4. User (buyer) can make a purchase order.
5. User (buyer) can update the price of his/her purchase order.
6. User (seller) can mark his/her posted AD as sold.
7. User (seller) can update the price of his/her posted AD.
8. User can view a specific car.
9. User can view all unsold cars.
10. User can view all unsold cars within a price range.
11. Admin can delete a posted AD record.
12. Admin can view all posted ADs whether sold or unsold.

### Additional Features
1. User can reset password.
2. User can view all cars of a specific body type.
3. User can flag/report a car sale advertisement.
4. User can view all used unsold cars.
5. User can view all new unsold cars.
6. User can view all unsold cars of a specific make (manufacturer).
7. User can view his Ads history.

### Prerequisites
- [Node.js](nodejs.org) must be installed 

### Installing
- Clone this repository `https://github.com/King-Success/Auto-Mart.git`
- Run `npm install` on the root directory to install all the application's dependencies
- Set the following environment variables in your `.env` file:

    - `PORT` - A random number on which the application is going to listen on.
  
    - `SECRET` - A random string for generating auth tokens.
  
    - `DB_URL` - A database URL provided by [Elephant](https://elephant.com).
  
    - `MAIL_HOST` - A mail host e.g [Gmail - smtp.gmail.com](https://gmail.com).
  
    - `MAIL_PORT` - A  mail port e.g [Gmail - 465](https://gmail.com).
  
    - `MAIL_ENCRYPTION` - Should be set to true or false

    - `MAIL_USERNAME` - Your email username

    - `MAIL_PASSWORD` - Your email password

    
#### Testing Locally
- Run `npm test`

#### Testing With Postman
- Install [Postman](https://getpostman.com).
- View the API documentation [here](https://andela-auto-mart.herokuapp.com/api/docs).
   
	 
## Built With
- [Node.Js](https://nodejs.org)
- [ExpressJs](https://expressjs.com)

### Coding Style
- [AirBnB](https://github.com/airbnb/javascript)

### Testing Tools
- [Mocha](https://www.npmjs.com/package/mocha)
- [Chai](https://www.npmjs.com/package/chai)
- [nyc](https://www.npmjs.com/package/nyc)
- [Istanbul](https://www.npmjs.com/package/istanbul)

## Acknowledgements 
- README Format - [Billie Thompson](https://github.com/PurpleBooth).
