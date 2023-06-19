// Lib
import PlayerManager from './lib/player_manager'
import RoomManager from './lib/room_manager'

class App {
	players: PlayerManager
	rooms: RoomManager

	constructor() {
		this.players = new PlayerManager()
		this.rooms = new RoomManager()
	}
}

export default App
