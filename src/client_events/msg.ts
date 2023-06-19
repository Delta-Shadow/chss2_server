import { type Server, type Socket } from 'socket.io'
import App from '../app'
import { z } from 'zod'

// Lib
import { OpFailed } from '../lib/errors'

// Client Events
import ClientEvent from '../lib/client_event'

// Server Events
import ChatUpdate from '../server_events/chat_update'

class MsgEvent extends ClientEvent {
	constructor(io: Server, socket: Socket, app: App) {
		super('msg', io, socket, app)
	}

	schema = z.object({
		content: z.string()
	})

	handle(params: z.infer<typeof this.schema>) {
		// Check if player is in a room
		if (!this.socket.info.player.rid) throw new OpFailed('You are not in a room')

		// Update the rooms's msgs
		this.app.rooms.add_msg(
			this.socket.info.player.rid,
			this.socket.info.player.name!,
			params.content
		)

		// Emit a chat update packet to all members of the room
		new ChatUpdate(this.io, this.socket, this.app, this.socket.info.player.rid).broadcast()
	}
}

export default MsgEvent
