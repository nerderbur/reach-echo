var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8888);

app.get('/', function (req, res) {
  res.send('/index.html');
});

var driverNsp = io.of('driver');
var passengerNsp = io.of('passenger');

passengerNsp.on('connection', (socket) => {
    console.log(`Client connected to '/passenger': ${socket.id}.`)

    socket.on('request_ride', (data) => {
        console.log(`Request ride event (${socket.id})`)
        console.log(data)

        setTimeout(() => {
            driverNsp.emit('ride_requested', data)
        })

        setTimeout(() => {
            console.log('Emitting ride accepted.')
            socket.emit('ride_accepted', {driverId: "random driver id"})
        }, 6000)
    })

    socket.on('disconnect', (reason) => {
        console.log(`Client disconnected from '/passenger': ${socket.id} reason: ${reason}.`)
    })
})

driverNsp.on('connection', (socket) => {
    console.log(`Client connected to '/driver': ${socket.id}.`)

    socket.on('update_location', (data) => {
        console.log( `Event: 'update_location' (${socket.id})`)
        console.log(data)
    })

    socket.on('ride_accepted', (data) => {
        console.log( `Event: 'ride_accepted' (${socket.id})`)
        console.log(data)

        setTimeout(() => {
            passengerNsp.emit('ride_accepted', {driverId: 'some-id'})
        }, 3000)
    })

    socket.on('ride_declined', (data) => {
        console.log( `Event: 'ride_declined' (${socket.id})`)
        console.log(data)

        setTimeout(() => {
            passengerNsp.emit('ride_declined')
        }, 3000)
    })

    socket.on('disconnect', (reason) => {
        console.log(`Client disconnected from '/driver': ${socket.id} reason: ${reason}.`)
    })
})

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});