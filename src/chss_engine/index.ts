import {
	Position,
	forEachSquare,
	squareToCoordinates,
	type Piece as PieceType,
	type Color as PieceColor,
	coordinatesToSquare
} from 'kokopu'

type Pieces = Array<Piece>

interface Piece {
	x: number
	y: number
	type: PieceType
	color: PieceColor
	moves?: Array<Move>
}

interface Move {
	x: number
	y: number
	notation: string
}

interface ChssEngineState {
	pieces: Pieces
}

class ChssEngine {
	#position = new Position()
	#pieces: Pieces = []

	constructor() {
		this.#init_pieces()
		this.#refresh_moves()
	}

	#init_pieces() {
		forEachSquare((square) => {
			const square_contents = this.#position.square(square)
			const coords = squareToCoordinates(square)
			if (square_contents == '-') return
			this.#pieces.push({
				x: coords.file,
				y: coords.rank,
				type: square_contents[1] as PieceType,
				color: square_contents[0] as PieceColor
			})
		})
	}

	#refresh_moves() {
		const move_descriptors = this.#position.moves()
		let moves: Record<string, Array<Move>> = {}

		move_descriptors.forEach((desciptor) => {
			const from = desciptor.from()
			if (!(from in moves)) moves[from] = []
			const to = squareToCoordinates(desciptor.to())
			moves[from].push({
				x: to.file,
				y: to.rank,
				notation: this.#position.notation(desciptor)
			})
		})

		this.#pieces.forEach((piece) => {
			const from = coordinatesToSquare(piece.x, piece.y)
			piece.moves = moves[from]
		})
	}

	play(move: string) {
		const played = this.#position.play(move)
		if (played) {
		}
	}

	get_state(): ChssEngineState {
		return {
			pieces: this.#pieces
		}
	}
}

export default ChssEngine
