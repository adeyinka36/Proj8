const Sequelize = require('sequelize');
const {sequelize} = require('../models');


module.exports=(sequelize)=>{
class Book extends Sequelize.Model{}

Book.init({
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    author:{
        type:Sequelize.STRING,
        allowNull:false
    },
    genre:Sequelize.STRING,
    year:Sequelize.INTEGER
},{sequelize})

return Book
}