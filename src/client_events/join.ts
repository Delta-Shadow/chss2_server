import { type Server, type Socket } from 'socket.io'
import { z } from 'zod'

import App from '../app'
import ClientEvent from '../lib/client_event'
import { OpFailed } from '../lib/errors'

class JoinEvent extends ClientEvent {
	constructor(io: Server, socket: Socket, app: App) {
		super('join', io, socket, app)
	}

	schema = z.object({
		name: z.string(),
		room: z.string()
	})

	handle(params: z.infer<typeof this.schema>) {
		// Check if player is already in a room
		if (this.socket.info.player.rid) throw new OpFailed('You are already in a room')

		// Check if this room exists
		// If not, create the room
		if (!this.app.rooms.exists(params.room)) this.app.rooms.create(params.room)

		// Update the player's data
		this.app.players.update(this.socket.info.sid, {
			rid: params.room,
			name: params.name
		})

		// Put the socket belonging to this player into a room
		this.socket.join(params.room)

		// Emit an update packet to all members of the room
		const game_state = this.app.rooms.get(params.room).game.get_state()
		this.io.in(params.room).emit('game_state', game_state)
	}
}

export default JoinEvent
