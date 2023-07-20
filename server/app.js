var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const jwt = require('jsonwebtoken');
const SECRET = 'ewgfvwergvwsgw5454gsrgvsvsd';
// 安装：npm install cors
// 使用：
// const cors = require('cors');
// app.use(cors());  #  不加上这句代码跨域访问时会出现错误，加上就不会出现跨域错误情况
app.use(require('cors')()); // 允许跨域

// 解析json文件数据，与使用body-parser中间件有什么区别？
app.use(express.json());

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fullstack',{
  useNewUrlParser:true,
  useFindAndModify:true,
  useCreateIndex:true
});

// 用户数据库
var User = mongoose.model('User',new mongoose.Schema({
  email:{
    type:String,
    unique:true // 字段唯一
  },
  password:{
    type:String,
    set(val){
      // 通过bcryptjs对密码加密返回值: 第一个值为返回值， 第二个为密码强度
      return require('bcryptjs').hashSync(val,10);
    }
  },
  isadmin:{
    type:Boolean
  },
  registrationTime: {
    type: Date,
    default: Date.now
  },
  phone:{
    type: String,
  },
  avatar:{
    type: String,
  }
}));

// 文章数据库
var Article = mongoose.model('Article',new mongoose.Schema({
  title:{type:String},
  body:{type:String}
}));

// app.get('/',async (req,res) =>{
//   res.send('index')
// });

// ****************************************** 用户登录注册 ******************************************


// 注册，类似数据库的“增”
app.post('/api/register',async(req,res) =>{
  console.log(req.body); // 此处req.body接受到的数据及其参数来自前端，因此和前端数据的命名是一致的
  const mon_user = await User.findOne({
    email:req.body.useremail
  });
  const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})$/;
  if(mon_user) {
    res.send("-1"); // -1，表示用户已存在
  }else if (!emailRegex.test(req.body.useremail)){
    res.send("-2") //-2，表示邮箱格式不符合要求
  }else {
    // Check if password is valid
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(req.body.userpwd)) {
      res.send("-3"); // -3，表示密码格式不符合要求
      return;
    }
    const user = await User.create({
      email: req.body.useremail,
      password: req.body.userpwd,
      isadmin: req.body.isadmin, // 添加 isadmin 字段
      registrationTime: req.body.registrationTime, // 获取并保存注册时间
      phone:'',
      avatar:''
    });
    res.send("0"); // 0，表示用户注册成功
    console.log(user)
  }
});

// 登录，第一步判断用户是否存在，第二步判断密码是否正确，第三步生成token，返回客户端
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) {
    res.send("-1"); // -1，表示用户不存在
  }

  const isPasswordValid = require('bcryptjs').compareSync(
      req.body.password,
      user.password
  );
  if (!isPasswordValid) {
    res.send("1"); // 1，表示密码无效
  }

  // 返回登录成功和用户的 isadmin 属性
  res.send({code:"0", isadmin: user.isadmin ,phone:user.phone , avatar:user.avatar});
});

//删除用户
app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send({
    status: true
  });
});
//获取所有用户信息
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});
//更新个人信息
app.put('/api/user', async (req, res) => {
  // 获取用户 ID 和请求参数
  const { email, phone, avatar } = req.body;
  const user = await User.findOne({ email });

  user.email = email;
  user.phone = phone;
  user.avatar = avatar;
  await user.save();
  // 返回成功响应
  res.send({ code: 0, message: '用户信息更新成功' });
});
//获取个人信息
app.get('/api/user/else/:email', async (req, res) => {
  // const { email } = req.body;
  var user = await User.findOne({ email: req.params.email });
  console.log(req.params.email)
  res.send(user);
});

//编辑页面中获取和修改信息
app.get('/api/users/:id',async (req,res) =>{
  var user = await User.findById(req.params.id);
  res.send(user);
});
app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body);
  res.send(user);
});

// 修改密码
app.post('/api/changepassword', async (req, res) => {
  // 获取请求参数
  const { email, oldPassword, newPassword } = req.body;
  // 根据邮箱查询用户
  const user = await User.findOne({ email });
  // 检查旧密码是否正确
  const isPasswordValid = require('bcryptjs').compareSync(oldPassword, user.password);
  if (!isPasswordValid) {
    return res.send({ code: 1, message: '旧密码错误' });
  }
  // 更新用户密码
  user.password = newPassword;
  await user.save();
  // 返回成功响应
  res.send({ code: 0, message: '密码修改成功' });
});

// 用户注销
app.post('/api/deleteuseremail', async (req, res) => {
  // 获取请求参数
  const { email } = req.body;
  // 根据邮箱查询并删除用户
  await User.findOneAndDelete({ email });
  // 返回成功响应
  res.send({ code: 0, message: '用户注销成功' });
});

//根据邮箱查询
app.get('/api/user/email', async (req, res) => {
  // 获取请求参数
  const { email } = req.body;
  console.log(req.body)
  // 根据邮箱查询用户
  const user = await User.findOne({ email });
  // 返回成功响应
  res.send(user);
});

// ****************************************** 文章增删查改 ******************************************

// 新增文章
app.post('/api/articles',async (req,res) =>{
  var article = await Article.create(req.body);
  res.send(article)
});

// 显示文章列表
app.get('/api/articles',async (req,res) =>{
  var article = await Article.find();
  res.send(article);
});
// app.get('/api/articles', async (req, res) => {
//   // 从 session 中获取当前登录用户的信息
//   const user = req.session.loginuser;
//   console.log(user)
//   console.log(req.session.loginuser)
//   const userId = user.id;
//
//   // 根据用户id查询文章
//   const articles = await Article.find({userId: userId});
//
//   // 返回查询结果
//   res.send(articles);
// });

// 删除文章
app.delete('/api/articles/:id',async (req,res) =>{
  await Article.findByIdAndDelete(req.params.id);
  res.send({
    status:true
  })
});

// 指定ID获取数据
app.get('/api/articles/:id',async (req,res) =>{
  var article = await Article.findById(req.params.id);
  res.send(article);
});

// 修改文章（put，post，patch）并覆盖性保存
app.put('/api/articles/:id',async (req,res) =>{
  var article = await Article.findByIdAndUpdate(req.params.id,req.body);
  res.send(article);
});

app.listen(8080,() => {
  console.log('已启动服务http://localhost:8080/')
});
