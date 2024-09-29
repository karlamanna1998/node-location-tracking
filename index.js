const express = require('express');
const socket = require('socket.io');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = socket(server)

app.set('view engine' , 'ejs');
app.use(express.static(__dirname + '/public'));

io.on('connect' , (socket)=>{
    console.log("socket connected" , socket.id);
    socket.on('send-location' , (data)=>{
         io.emit('recieve-location' , {
            id : socket.id,
            ...data
         })
    })
    socket.on('disconnect' , ()=>{
        console.log('gone' , socket.id);
        io.emit('user-disconnect' , {id : socket.id})
    })
})


app.get('/' , async (req , res)=>{
    res.render('index')
});

server.listen(8000 , ()=>{
    console.log('server started at port 80');
});