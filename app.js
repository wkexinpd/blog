const express = require('express');
const path = require('path');
const router = require('./router');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
app.engine('html',require('express-art-template'));
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public/',express.static(__dirname+'/public'));
app.use('/node_modules',express.static(__dirname+'/node_modules'));
app.use(session({
  secret:'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(router);
app.listen(3636,function () {
  console.log('我爱你3636！！');
});
// https://LAPTOP-7IJKFP0B/svn/jd
