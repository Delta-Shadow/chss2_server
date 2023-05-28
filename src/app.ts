import { Server } from 'socket.io'

// Events
import JoinEventHandler from './events/join'

// Lib
import logger from './lib/logger'

// CORS config
let cors = {
	origin: process.env.CLIENT_ORIGIN ?? '*'
}

// Creating the Socket IO Server
const io = new Server({
	cors,
	serveClient: false
})

// Assign all event handlers
io.on('connection', socket => {
	logger.debug('received connection: ', {
		id: socket.id,
		handshake: socket.handshake.auth
	})

	new JoinEventHandler(io, socket)
})

export default io
