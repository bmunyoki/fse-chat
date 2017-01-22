var express = require("express");
var app = express();
var mysql = require('mysql');
var port = 8004;
var usernames = {};

var pool = mysql.createPool({
    connectionLimit : 100, 
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'fse',
    debug    :  false
});



app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome to FSE chat. Enter your name to continue' });

    socket.on('send', function (data) {
        //Insert into DB
        pool.getConnection(function(err,connection){
            var entry = { name: data.username, txt: data.message, created: data.tmp };
            connection.query('INSERT INTO chat SET ?', entry, function(err,res){
                if(err) throw err;
            });
        });

        //Pull data from DB
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM chat', function(err,rows){
                if(err) throw err;
                io.sockets.emit('receiveddb', rows);
            });
        });
    });

    socket.on('newcomer', function (data) {
        pool.getConnection(function(err,connection){
            var entry = { name: data.username, txt: data.joiningmessage, created: data.tmp };
            connection.query('INSERT INTO chat SET ?', entry, function(err,res){
                if(err) throw err;
            });
        });
        
        //Pull data from DB
        pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM chat', function(err,rows){
                if(err) throw err;
                io.sockets.emit('receiveddb', rows);
            });
        });
    });

    socket.on('leftchat', function (data) {
        pool.getConnection(function(err,connection){
            var entry = { name: data.username, txt: data.leavingmessage, created: data.tmp };
            connection.query('INSERT INTO chat SET ?', entry, function(err,res){
                if(err) throw err;
            });
        });

        //Pull data from DB
        /*pool.getConnection(function(err,connection){
            connection.query('SELECT * FROM chat', function(err,rows){
                if(err) throw err;
                io.sockets.emit('receiveddb', rows);
            });
        });*/
    });
});

console.log("Listening on port " + port);

app.set('views', __dirname + '/pages');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
    res.render("page");
});

app.get("/chat", function(req, res){
    var x = "Hello";
    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }   
         
        connection.query("select name from chat",function(err,rows){
            connection.release();
            if(!err) {
                res.render("page");
            }           
        });
 
        connection.on('error', function(err) {      
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;     
        });
    });
});

