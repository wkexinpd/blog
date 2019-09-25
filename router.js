const express = require('express');
const router = express.Router();
const User = require('./module/user');
const md5 = require('blueimp-md5');
router.get('/',function (req,res) {
  res.render('index.html',{
    user:req.session.user
  });
});
router.get('/register',function (req,res) {
  res.render('register.html');
});
router.post('/register',function (req,res) {
  /**
   * 注册
   * 1.获取表单提交的数据
   *    req.body
   * 2.操作数据库
   *    判断是否注册过 user.findOne
   *    将注册过的数据添加到数据库中
   * 3.发送响应
   */
  let body = req.body;

  User.findOne({email:body.email},function (emailErr,emailData) {
    User.findOne({nickname:body.nickname},function (nameErr,nameData) {
      if(emailErr&&nameErr){
        return res.status(500).json({
          error_code:500,
          message:'Server error'
        })
      }
      if(emailData){
        return res.status(200).json({
          error_code:1,
          message:'email has existed'
        })
      }
      if(nameData){
        return res.status(200).json({
          error_code:2,
          message:'name has existed'
        })
      }
      body.password=md5(md5(body.password));
      new User(body).save(function (err,data) {

        if(err){
          return res.status(500).json({
            error_code:500,
            message:'Server error'
          })
        }
        req.session.user = data;
        res.status(200).json({
          error_code:0,
          message:'ok'
        })
      });
    });
  });
});
router.get('/login',function (req,res) {
  res.render('login.html');
});
router.post('/login',function (req,res) {
  /**
   *  判断email，nickname，password是否与数据库存入的数据相等
   *  相等的话，登录成功，否则提醒哪里不对
   */
  let body = req.body;
  User.findOne({
    email: body.email,
    password:md5(md5(body.password))
  },function (err,data) {
    if(err){
      return res.status(500).json({
        err_data:500,
        message:'Server Error'
      })
    }
    if(!data){
      return res.status(200).json({
        err_data:1,
        message:'nickname or password is error'
      })
    }
    req.session.user=data;
    return res.status(200).json({
      err_data:0,
      message:'ok'
    })
  })
});
router.get('/logout',function (req,res) {
  req.session.user=null;
  res.redirect('/login');
});
/**
 * 发表评论
 */
router.get('/topics/new',function (req,res) {
  res.render('settings/comments.html');
});
router.post('/topics/new',function (req,res) {
  User.findOne({
    nickname:req.body.nickname
  },function (err,data) {
    if(err){
      return res.status(500).json({
        err_data:500,
        message:'Server error'
      })
    }

  });
  new User(req.body).save(function (err,ret) {
    
  })
});

/**
 * 查看评论
 */
router.get('/topics/123',function (req,res) {
  /*
  根据用户名查找
   */

  console.log(req.query);
  console.log(req.query.nickname);
  User.findOne({
    nickname:req.query.nickname
  },function (err,user) {
    console.log(user);
    if(err){
      return res.status(500).render('404.html');
    }
  res.render('settings/seeComment.html',{
    user
  });
  })
});

/**
 * 设置个人信息
 */
router.get('/settings/profile',function (req,res) {
  res.render('settings/admin.html');
});
/**
 *  个人中心
 */
router.get('/admin',function (req,res) {
  res.render('settings/profile.html');
});
module.exports = router;
