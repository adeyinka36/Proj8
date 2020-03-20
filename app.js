const sequelize = require('./models').sequelize;
const express = require('express');
const router= require('./router.js');
const bodyParser = require('body-parser');
const cookieParser= require('cookie-parser');

const app = express()




app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());



app.set("view engine","pug");

app.use("/static",express.static("public"))

app.use(router);

app.use("/books",(err,req,res,next)=>{
    console.log(`the app encountered this error: ${err}`)
    res.render("error")
})

app.use((err,req,res,next)=>{
 err.statusCode= 404
res.render ("pageNotFound")
})



sequelize.sync().then(() => {
    app.listen(3000);
  });