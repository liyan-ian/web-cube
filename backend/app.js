var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

/////////////从此处开始为websocket部分/////////////////////
//创建一个websocket连接，端口为8080
var WebSocketServer = require('ws').Server,wss = new WebSocketServer({port: 8081});
 
// 创建websocket连接池，clients存储所有正在连接的websocket，name为用户名
var clients = [];
var name="";

//target为发送消息是否有指定用户
var target="";

//监听websocket连接，当监听到创建新的websocket连接以后走下段代码
wss.on('connection', function(ws) {

	//target目标进行赋值，如果消息为群发消息无target，则赋值为“”,后期增加ws测试客户端后此行代码删除
	target="";

	//生成json字符串，并且push进连接池，json格式中的ws为websocket连接，target为目标用户
	var str = {"ws":ws,"target":target};
	clients.push(str);

	//显示当前连接池中的连接数量
	console.log("add a websocket websockets total:"+clients.length);

	//当监听到有消息过来的时候触发下段代码
	ws.on('message', function(message) {

		//当前还没完成websocket的测试客户端，因此target直接进行的赋值，在测试客户端中使用meaage.data.target获取目标用户
		if(target === ""){

			//遍历整个连接池，查询是否有符合条件的websocket连接
			clients.forEach(function(ws_temp){

				//进行判断，如果遍历的当前websocket连接(ws_temp)与触发消息时间的websocket连接(ws)不为同一个，则发送内容
				if(ws_temp.ws !== ws) {

					//使用ws_temp中的ws来获取连接，并进行发送消息
					ws_temp.ws.send(message);
				}
			})
		}
	});

	ws.on('close', function(message) {
	// 连接关闭时，将其移出连接池
		clients = clients.filter(function(ws1){
			return ws1.ws !== ws
		})
		console.log("close a websocket websockets total:"+clients.length);
	});
});
////////////////此处为websocket部分结束////////////////////
module.exports = app;
