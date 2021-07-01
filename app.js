var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// 个人中心
var usersRouter = require('./routes/users');
// 校验用户名
var checkNickRouter = require('./routes/checkNick');
// 注册
const registerRouter = require('./routes/register');
// 登陆
const loginRouter = require('./routes/login');
// 忘记密码
const forgetRouter = require('./routes/forget')
// 发现
const findRouter = require('./routes/find')
// search 
const searchRouter = require('./routes/search')
// 好友
const friendRouter = require('./routes/friends')
// 创建群
const groupRouter = require('./routes/group')
// 修改用户信息
const changeinfoRouter = require('./routes/changeinfo')
// 聊天记录
const chatRouter = require('./routes/chat')
// 消息列表
const newslistRouter = require('./routes/newslist')
//上传图片
const uploadRouter = require('./routes/upload')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true ,limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 校验用户名
app.use('/checkNick',checkNickRouter)
// 注册
app.use('/register',registerRouter)
// 登陆
app.use('/login',loginRouter)
// 忘记密码
app.use('/forget',forgetRouter)
// 发现
app.use('/find',findRouter)
// search
app.use('/search',searchRouter)
// friends
app.use('/friends',friendRouter)
// 创建群组
app.use('/group',groupRouter)
// 修改信息
app.use('/changeinfo',changeinfoRouter)
// 聊天记录
app.use('/chat',chatRouter)
// 消息列表
app.use('/newslist',newslistRouter)
// 上传图片
app.use('/upload',uploadRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
