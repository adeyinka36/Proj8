const sequelize = require('./models').sequelize;
const express = require('express');
const router= require('./router.js');
const bodyParser = require('body-parser');
const cookieParser= require('cookie-parser');

const app = express();




app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());



app.set("view engine","pug");

app.use("/static",express.static("public"))

app.use(router);



app.use((err,req,res,next)=>{
 err.statusCode= 404
return res.render("page-not-found",{err})
});



sequelize.sync().then(() => {
    app.listen(3000);
    
  });