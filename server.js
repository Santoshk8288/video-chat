let express = require('express');
let app 	= express();
let server 	= require('http').createServer(app);
let io 		= require('socket.io').listen(server);
let fs = require('fs')
let path = require('path')
let PORT = process.env.PORT || 3100


server.listen(PORT);
console.log(`server running at port ${PORT}`);

connections = [];

app.get('/',(req, res)=>{
	/* res.writeHead(200,{'content-type':'video/mp4'})
	let rs = fs.createReadStream('cat.mp4');
	rs.pipe(res) */
	res.sendFile(path.join(__dirname, 'index.html'))
})
let rs ={}
app.get('/start-video',(req, res)=>{
	rs = fs.createReadStream('cat.mp4');
	
})

io.sockets.on('connection', (socket)=>{

	socket.on('join',(data)=>{
		socket.name = data
		connections.push(socket)
		console.log('connected with name '+data)
	})

	socket.on('disconnect', ()=>{
		console.log(`${socket.name} closed the tab`)
		connections.splice(connections.indexOf(socket), 1)
		console.log('disconnected: '+connections.length+' connections')		
	})

	socket.on('send message', (data)=>{
		io.sockets.emit('new message', {msg : data, user : socket.name})
	})

	io.emit('video', rs.pipe(io))
})

