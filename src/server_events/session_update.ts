import ServerEvent from '../lib/server_event'
import { Server, Socket } from 'socket.io'
import App from '../app'

class SessionUpdate extends ServerEvent {
	constructor(io: Server, socket: Socket, app: App) {
		super('session_update', io, socket, app)
	}

	get data() {
		return {
			sid: this.socket.info.sid,
			pid: this.socket.info.player.pid
		}
	}
}

export default SessionUpdate
