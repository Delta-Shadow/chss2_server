import { Server } from 'socket.io'

// Lib
import logger from './lib/logger'

let cors = {
	origin: process.env.CLIENT_ORIGIN ?? '*'
}

const io = new Server({
	cors,
	serveClient: false
})

io.on('connection', socket => {
	logger.debug('received connection: ', {
		id: socket.id,
		handshake: socket.handshake.auth
	})
	socket.emit('hello', 'world')
})

export default io
