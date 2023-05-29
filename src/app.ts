// Lib
import PlayerManager from './lib/player_manager'

class App {
	players: PlayerManager

	constructor() {
		this.players = new PlayerManager()
	}
}

export default App
