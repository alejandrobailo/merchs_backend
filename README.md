# merchs_back
Side project. 2020

# MERCHS

Beginning of the development of the commercial platform "MERCHS" as part of the final bootcam project in Neoland, the collaborators are @antxon-eguiguren, @alejandrobailo and @hamada-j. This document will serve as a guide to understand the programming and code assets of the BackEnd part of the platform.

## First Steps

1º`$ mkdir RestAPI`

2º`$ npm init`

3º `% npm install -- express`

### Creat a basic server with EXPRESS server

`$ express --view = pug merchs`

### add and start NODEMON

`sudo npm install -g nodemon`
`npm run startdev`

### Generate a firs route

creat in route folder

```javascript
var express = require("express");
var router = express.Router();
// get Method
router.get("/", function(req, res, next) {
  res.send("from products url");
});
module.exports = router;
```

expot to app.js

```javascript
const productsRouter = require("./routes/products");
```

run

```javascript
app.use("/products", productsRouter
```

### TESTING IN POSTMAN

### DATABASE: MySQL /// test ///

- Creata and Connect to MySql

- install mysql package: `$ npm install --save msql`
- in app.js added

### Securty: nodemon.json file /// test ///
