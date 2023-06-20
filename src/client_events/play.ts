import { z } from 'zod'
import { Server, Socket } from 'socket.io'
import App from '../app'

// Client Events
import ClientEvent from '../lib/client_event'

// Server Events
import GameUpdate from '../server_events/game_update'

// Lib
import { InternalServerError, OpFailed } from '../lib/errors'

class PlayEvent extends ClientEvent {
	constructor(io: Server, socket: Socket, app: App) {
		super('play', io, socket, app)
	}

	schema = z.object({
		move: z.string()
	})

	handle(params: z.infer<typeof this.schema>) {
		// Check if player is in a room
		if (!this.socket.info.player.rid) throw new OpFailed('You are not in a room')

		try {
			const played = this.app.rooms.get(this.socket.info.player.rid).game.play(params.move)
			if (!played) throw new OpFailed('The move was invalid')
			new GameUpdate(this.io, this.socket, this.app, this.socket.info.player.rid).broadcast()
		} catch (e) {
			if (e instanceof OpFailed) throw e
			else {
				const msg = `Error during processing of move: ${e}`
				throw new InternalServerError(msg)
			}
		}
	}
}

export default PlayEvent
