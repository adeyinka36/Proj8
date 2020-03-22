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
};



// home page
router.get("/",wrapper(async(req,res)=>{
  
  const values= await Book.findAll({limit:2});
  const data = values.map(v=>v.toJSON());
  console.log(data[0].title);
  res.render("index",{data});

}));

router.post("/next",wrapper(async(req,res)=>{
    
  const values= await Book.findAll({offset:2,limit:2});
  const data = values.map(v=>v.toJSON());
  console.log(data[0].title);
  res.render("index",{data});
}));


router.post("/back",wrapper(async(req,res)=>{
    
    const values= await Book.findAll({offset:-2,limit:2});
    const data = values.map(v=>v.toJSON());
    console.log(data[0].title);
    res.render("index",{data});
  }));
  
// redirect to home 
router.get("/books",(req,res)=>{


    res.redirect('/');
});

// route to book update page
router.get("/books/update",(req,res)=>{
    res.render('update-book');
});

// route to add new book
router.get("/books/new",(req,res)=>{
    
    return res.render('new-book');
});


// route to update book with url
router.get("/books/:id/delete",wrapper(async(req,res)=>{

    const book = await Book.findByPk(req.params.id);
    book.destroy();
      res.redirect("/");
    
}));

router.get("/books/:id",wrapper(async(req,res)=>{
    console.log(req.params.id);
    const newBook= await Book.findByPk(req.params.id);
    return res.render('update-book',{data:newBook});
}));


router.post("/books/:id/update",wrapper(async(req,res)=>{

    const bookToChange= await Book.findByPk(req.params.id);

     await bookToChange.update(req.body);
     res.redirect('/')
}));


router.post("/books/:id/delete",wrapper(async(req,res)=>{
    console.log(req.params.id);
    const book= await Book.findByPk(req.params.id);
    book.destroy();
    return res.redirect('/');
}));

// add new book to database
router.post("/books/new",wrapper(async(req,res)=>{
    console.log(typeof req.body);
    const newBook= await Book.build(req.body);
    await newBook.save();
    return res.render("new-book");
}));

router.post("/books/:id",wrapper(async(req,res)=>{
    const newBook= await Book.findOne(req.params.id)
    return res.render('update-book',{data:newBook});
}));


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



module.exports= router