const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/itcast');
var userSchema = new Schema({
  nickname:{type:String,required:true},
  password:{type:String,required:true},
  email:{type:String,required:true},
  avatar:{type:String,default:'/public/img/avatar-max-img.png'},
  created_time:{type:Date,default:Date.now},
  last_modified_time:{type:Date,default:Date.now},
  bio:{type:String,default:''},
  gender:{type:Number,enum:[-1,0,1],default:-1},
  birthDay:{type:Date},
  comments:{type:String}
});
module.exports = mongoose.model('User',userSchema);