const express = require('express');
const router = express.Router();
const {Book}= require ("./models");
const {sequelize} = require ('./models');


router.get("/",(req,res)=>{
    console.log("yes")
try{
(async ()=>{
    console.log("no")
    await sequelize.sync({ force: true })
    const booksnew= await Book.build({
        title:"gogo",
        author:"ramsey"
    })
    await booksnew.save();
    const data= await Book.findAll()
    console.log(data.length)
    
})()
}catch (error){
    console.log(error)
}
 return res.render('index')
})



router.get("/books",(req,res)=>{
    res.redirect('/')
})

router.get("/books/update",(req,res)=>{
    res.render('update-book')
})


router.get("/books/new",(req,res)=>{
    return res.render('new-book')
})

router.get("/books/:id",(req,res)=>{
    
    
})

// post 

router.post("/books/new",(req,res)=>{

    
})

router.post("/books/:id",(req,res)=>{
    
})

router.post("/books/:id/delete",(req,res)=>{
    
})


module.exports=router