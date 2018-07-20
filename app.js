console.log("hello world")
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server Started")

var io = require('socket.io')(serv,{});

var SOCKET_LIST={};

// INITIALIZE ON CONNECTION======================================
io.sockets.on('connection', function(socket){
    console.log("client connected")
    socket.on("giveInitPos",function(data){
        socket.id = Math.floor(Math.random() * 999999)+100000;
        socket.x = data.x
        socket.y = data.y
        SOCKET_LIST[socket.id]= socket;
        socket.emit('giveId',SOCKET_LIST[socket.id].id)
    })
    socket.on("move",function(data){
        SOCKET_LIST[data.id].x += data.x;
        SOCKET_LIST[data.id].y += data.y;
    });
    // console.log(SOCKET_LIST)
});

// LOOP======================================
setInterval(function(){
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('updatePosition',{
            id:socket.id,
            x:socket.x,
            y:socket.y
        })
    }
},1)
