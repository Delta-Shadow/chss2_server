import { type Server, type Socket } from 'socket.io'
import App from '../app'
import { z } from 'zod'

// Lib
import { OpFailed } from '../lib/errors'

// Client Events
import ClientEvent from '../lib/client_event'

// Server Events
import GameUpdate from '../server_events/game_update'
import SocialUpdate from '../server_events/social_update'

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
		const count = this.app.players.count(params.room)
		this.app.players.update(this.socket.info.sid, {
			rid: params.room,
			name: params.name,
			role: count > 1 ? 'spectator' : count == 1 ? 'black' : 'white'
		})

		// Put the socket belonging to this player into a room
		this.socket.join(params.room)

		// Emit a game update packet to this socket
		new GameUpdate(this.io, this.socket, this.app, params.room).emit()

		// Emit an update packet to all members of the room
		new SocialUpdate(this.io, this.socket, this.app, params.room).broadcast()
	}
}

export default JoinEvent
