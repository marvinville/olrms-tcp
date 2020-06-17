'use strict'

const net = require('net')

const hostname = '127.0.0.1'
const port = 43552

const app = net.createServer(function(socket) {
  let remoteAddress = socket.remoteAddress
  let remotePort = socket.remotePort

  console.log(`CONNECTED: ${remoteAddress}:${remotePort}`)
  socket.setEncoding('utf8')

  socket.on('data', function(data) {
    console.log(`${data}`)
  })

  socket.write(`Server Reply`)
  socket.pipe(socket)
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

module.exports = app