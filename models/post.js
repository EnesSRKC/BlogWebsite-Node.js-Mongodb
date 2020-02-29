const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const BlogPost = new Schema({
  author: {type:ObjectId, ref:'users'},
  title: {type:String, required:true},
  content: {type:String, required:true},
  date: {type:Date, default:Date.now},
  category: {type:ObjectId, ref:'categories'},
  image: {type:String, required:true}
});

module.exports = mongoose.model('Post', BlogPost)