'use strict'

import net from 'net'
import Olrms from './api/Olrms.js'

const olrms = new Olrms()
const port = 43556

const app = net.createServer((socket) => {
  const remoteAddress = socket.remoteAddress
  const remotePort = socket.remotePort

  console.log(`CONNECTED: ${remoteAddress}:${remotePort}`)
  socket.setEncoding('utf8')

  socket.on('data', (data) => {
    olrms.sendToApi({ data })
  })

  socket.write(`Server Reply`)
  socket.pipe(socket)
})

app.listen(port, () => {
  console.log(`Server running at ${port}`)
})

export default app
