const mongoose= require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");
const { object } = require("joi");

let mongo_url = 'mongodb://127.0.0.1:27017/wonderlust';

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>console.log(err));
async function main() {
      await mongoose.connect(mongo_url);
}

const initDB = async() =>{
   await listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({ ...obj, owner: '69eaf6139a3aa71d5fb5d445'}));
   await listing.insertMany(initData.data);
   console.log ("data was initialize");
};
initDB();
