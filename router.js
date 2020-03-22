const express = require('express');
const router = express.Router();
const {Book}= require ("./models");
const {sequelize} = require ('./models');

// wrapper catch, try method
function wrapper(cb){
    return async (req,res,next)=>{
        try{
            await cb(req,res,next)
        }catch(error){
            console.log(error)
        }
    }
};



// home page and fecth the inititla 7 rows for pagination
router.get("/",wrapper(async(req,res)=>{
  
  const values= await Book.findAll({limit:7});
  const data = values.map(v=>v.toJSON());
  console.log(data[0].title);
  res.render("index",{data});

}));

// fetch rest of  rows for pagination
router.post("/next",wrapper(async(req,res)=>{
    
  const values= await Book.findAll({offset:7});
  const data = values.map(v=>v.toJSON());
  console.log(data[0].title);
  res.render("index",{data});
}));

// shows the inital rows 
router.post("/back",wrapper(async(req,res)=>{
    
    const values= await Book.findAll({limit:7});
    const data = values.map(v=>v.toJSON());
    console.log(data[0].title);
   return  res.render("index",{data});
  }));
  
// redirect to home 
router.get("/books",(req,res)=>{


    res.redirect('/');
});

// route to book update page
router.get("/books/update",wrapper(async(req,res)=>{
    return res.render('update-book');
}));

// route to add new book
router.get("/books/new",wrapper(async(req,res)=>{
    
    return res.render('new-book');
}));


// route to update book with url
router.get("/books/:id/delete",wrapper(async(req,res)=>{

    const book = await Book.findByPk(req.params.id);
    book.destroy();
      res.redirect("/");
    
}));

// incorrect book entry error page
router.get("/books/error",wrapper(async(req,res)=>{
    return res.render("error");
}));

// route to update a specific book page with id in url
router.get("/books/:id",wrapper(async(req,res)=>{
    console.log(req.params.id);
    const newBook= await Book.findByPk(req.params.id);
    return res.render('update-book',{data:newBook});
}));

// update error route
router.get("/books/:id/error",wrapper(async(req,res)=>{
    console.log(req.params.id);
    const newBook= await Book.findByPk(req.params.id);
    return res.render('update-error',{data:newBook});
}));
// update a specific book strait from url 
router.post("/books/:id/update",wrapper(async(req,res)=>{
    
    if (req.body.title==""||req.body.author==""){
        return res.redirect(`/books/${req.params.id}/error`)}
    else{
    const bookToChange= await Book.findByPk(req.params.id);

     await bookToChange.update(req.body);
     res.redirect('/')
}}));

// delete a specific book from url
router.post("/books/:id/delete",wrapper(async(req,res)=>{
    console.log(req.params.id);
    const book= await Book.findByPk(req.params.id);
    book.destroy();
    return res.redirect('/');
}));

// add new book to database
router.post("/books/new",wrapper(async(req,res)=>{
    console.log(typeof req.body.title);
    if (req.body.title==""||req.body.author==""){
        return res.redirect("/books/error")
    }else{
    const newBook= await Book.build(req.body);
    await newBook.save();
    return res.render("new-book");
    }
}));

// route to upadate book
router.post("/books/:id",wrapper(async(req,res)=>{
    const newBook= await Book.findOne(req.params.id)
    return res.render('update-book',{data:newBook});
}));

router.post("")

// search route
router.post("/search",wrapper(async(req,res)=>{
    const data=[]
    const search=req.body.search.toLowerCase();
    const searchData= await Book.findAll();
    const searchResult=searchData.map(v=>v.toJSON());
    console.log(search);
   for(i=0;i<searchResult.length;i++){
      if(searchResult[i].title.toLowerCase().includes(search)||
      searchResult[i].author.toLowerCase().includes(search)||
      searchResult[i].genre.toLowerCase().includes(search)||
      searchResult[i].year==search){
          data.push(searchResult[i])
      }
  };
  console.log(data);
  return res.render("index",{data});
}));

// route to 404 page 
router.get("*",wrapper(async(req,res)=>{
    res.render("page-not-found")
}));

module.exports= router