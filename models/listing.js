const mongoose = require("mongoose");
// const review = require("./review");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
       title: {
        type: String,
        required: true,
    },
    description: {
        type: String,

        
    },

      image: {
        url: String,
        filename: String
      },
    // image:{
    //     type: String,
    //     default: 'https://www.istockphoto.com/photo/tourism-gm1454842745-490366567',
    //     set: (v)=> v ===""? "https://www.istockphoto.com/photo/tourism-gm1454842745-490366567": v,
    // },
   price: {
    type: Number,
    required: true,
    default: 0
},
    location:{
        type: String,
    },
    country:{
        type: String,
        required: false
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
    category: {
  type: String,
  enum: [
    "trending",
    "room",
    "iconic-cities",
    "mountain",
    "castle",
    "pool",
    "camping",
    "farm",
    "arctic"
  ],
  required: true
}
  
}
);

listingSchema.post("findOneAndDelete", async (listing)=>{
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
   
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;