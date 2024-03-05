const mongoose = require('mongoose');
const colors = require('colors');



const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to mongodb Database ${mongoose.connection.host}` .bgMagenta.white);

    }
    catch(error) {
        console.log(`mongodb Database Error ${error}` .bgRed.white);

    }
};

module.exports = connectDB;