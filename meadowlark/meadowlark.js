var express = require('express'),
    app = express(),
    fortune = require('./lib/fortune');

app.use(require('body-parser')());

// 设置模板引擎
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}); // 引用模版引擎并设置默认layout文件
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

// 表单
app.get('/newsletter', function (req, res) {
    res.render('newsletter', {csrf: 'CSRF token goes here'});
});

// 提交成功提示页
app.get('/thank-you', function (req, res) {
    res.render('thank-you');
});

// 查看头信息
app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) {
        s += name + ': ' + req.headers[name] + '\n';
    }
    res.send(s);
});


//表单提交
app.post('/process', function (req, res) {
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);

    console.log(req.xhr);
    console.log(req.accepts('json, html') === 'json');



    if (req.xhr || req.accepts('json, html') === 'json') {
        res.send({success: true});
    } else {
        res.redirect(303, '/thank-you');
    }
});

// 404
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

// 500
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500);
    res.render('500');
});

// 监听
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});