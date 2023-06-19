import { Server, Socket } from 'socket.io'
import App from '../app'
import ServerEvent from '../lib/server_event'

class ChatUpdate extends ServerEvent {
	constructor(io: Server, socket: Socket, app: App, rid: string) {
		super('chat_update', io, socket, app, rid)
	}

	get data() {
		return {
			msgs: this.app.rooms.get_msgs(this.rid!)
		}
	}
}

export default ChatUpdate
