import { Server, Socket } from 'socket.io'

import App from '../app'
import ClientEvent from '../lib/client_event'
import logger from '../lib/logger'

class Disconnect extends ClientEvent {
	constructor(io: Server, socket: Socket, app: App) {
		super('disconnect', io, socket, app)
	}

	handle() {
		logger.debug('Disconnecting')

		// Remove entry from player records
		this.app.players.delete(this.socket.info.sid)

		// If the player was not in a room, no need to do anything further
		if (!this.socket.info.player.rid) return

		// Otherwise...
		// Get updated list of all players inside the room
		const players = this.app.players.from(this.socket.info.player.rid)
		logger.debug('players after disconnect', players)

		// Emit an event inside the room with the new list of players
		this.io.in(this.socket.info.player.rid).emit('social_update', { players })

		// If no more players in the room, delete the room
		if (players.length == 0) this.app.rooms.delete(this.socket.info.player.rid)

		logger.debug('Disconnected')
	}
}

export default Disconnect
