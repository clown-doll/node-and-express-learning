var express = require('express'),
    app = express(),
    fortune = require('./lib/fortune');

// 设置模板引擎
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'}); // 引用模版引擎并设置默认layout文件
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// 设置静态文件目录
app.use(express.static(__dirname + '/public'));

// 设置端口
app.set('port', process.env.PORT || 3000);

// 判断是否进行测试
app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});


/*
* 路由
* */
// 首页
app.get('/', function (req, res) {
    res.render('home');
});

// 关于
app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

/*app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
});*/

// 查看头信息
app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) {
        s += name + ': ' + req.headers[name] + '\n';
    }
    res.send(s);
});

// 404
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

// 500
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// 监听
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});