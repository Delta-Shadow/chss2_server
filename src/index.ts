import dotenv from 'dotenv'
dotenv.config()

import logger from './lib/logger'
import ChssEngine from './chss_engine'

const engine = new ChssEngine()
let state = engine.get_state()

logger.debug('Initial Engine State', state)

for (let i = 0; i < 14; i++) {
	let movable_piece = state.pieces.find(piece => piece.moves)
	if (!movable_piece) break
	let move = movable_piece.moves![0].notation
	if (!engine.play(move)) {
		logger.debug('Invalid Move')
		break
	}

	// state = engine.get_state()
	// console.log(state.ascii)
}

logger.debug('Game Over')
