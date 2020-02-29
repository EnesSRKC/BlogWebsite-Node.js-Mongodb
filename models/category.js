const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const CategorySchema = new Schema({
  author: ObjectId,
  name: {type:String, required:true, unique:true}
});


/* CategorySchema.pre('remove', function(next) {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  Sweepstakes.remove({client_id: this._id}).exec();
  Submission.remove({client_id: this._id}).exec();
  next();
}); */

module.exports = mongoose.model('Category', CategorySchema)