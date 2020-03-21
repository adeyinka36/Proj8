const express = require('express');
const router = express.Router();
const {Book}= require ("./models");
const {sequelize} = require ('./models');


function wrapper(cb){
    return async (req,res,next)=>{
        try{
            await cb(req,res,next)
        }catch(error){
            console.log(error)
        }
    }
}

// home page
router.get("/",wrapper(async(req,res)=>{

  const values= await Book.findAll();
  const data = await values.map(v=>v.toJSON());
  console.log(data[0].title);
  res.render("index",{data})

}))

// redirect to home 
router.get("/books",(req,res)=>{


    res.redirect('/')
})

// route to book update page
router.get("/books/update",(req,res)=>{
    res.render('update-book')
})

// route to add new book
router.get("/books/new",(req,res)=>{
    
    return res.render('new-book')
})


// route to update book with url
router.get("/books/:id",wrapper(async(req,res)=>{

    const book = await Book.findOne(req.params.id)
    book.destroy()
      res.render('update-book')
    
}))


// add new book to database
router.post("/books/new",wrapper(async(req,res)=>{
    console.log(req.body);
    const newBook= await Book.build(req.body);
    await newBook.save();
    return res.render("new-book");
}));

router.post("/books/:id",(req,res)=>{
    return res.render('update-book');
})

router.post("/books/:id/delete",(req,res)=>{
    res.send("index")
})


module.exports= router