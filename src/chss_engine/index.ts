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
	x?: number
	y?: number
	type: PieceType
	color: PieceColor
	moves?: Array<Move>
}

interface Move {
	x: number
	y: number
	notation: string
}

class ChssEngine {
	#position = new Position()
	#pieces: Pieces = []
	#game_over = false

	constructor() {
		this.#init_pieces()
		this.#refresh_moves()
		this.#update()
	}

	#init_pieces() {
		forEachSquare(square => {
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

		move_descriptors.forEach(desciptor => {
			const from = desciptor.from()
			if (!(from in moves)) moves[from] = []
			const to = squareToCoordinates(desciptor.to())
			moves[from].push({
				x: to.file,
				y: to.rank,
				notation: this.#position.notation(desciptor)
			})
		})

		this.#pieces.forEach(piece => {
			if (!piece.x || !piece.y) {
				piece.moves = undefined
				return
			}
			const from = coordinatesToSquare(piece.x, piece.y)
			piece.moves = moves[from]
		})
	}

	#update() {}

	play(move: string) {
		// Extract description of the move
		const description = this.#position.notation(move)

		// Play out the move
		const played = this.#position.play(move)
		if (!played) return false

		// Find the piece that was moved
		const from = squareToCoordinates(description.from())
		const moved_piece_index = this.#pieces.findIndex(
			piece => piece.x == from.file && piece.y == from.rank
		)
		if (moved_piece_index == -1)
			throw new Error('Move played from a square that contains no Piece')

		// Find target square
		const to = squareToCoordinates(description.to())

		// If a promotion occurred
		if (description.isPromotion()) {
			// Update the piece
			const promoted_piece_type = description.promotion()
			this.#pieces[moved_piece_index].type = promoted_piece_type
		}

		// If a normal capture occured
		if (description.isCapture() && !description.isEnPassant()) {
			// Find the piece that was captured
			const captured_piece_index = this.#pieces.findIndex(
				piece => piece.x == to.file && piece.y == to.rank
			)
			if (captured_piece_index == -1)
				throw new Error('Move captured a square that contains no Piece')

			// Update the piece that was captured
			this.#pieces[captured_piece_index].x = undefined
			this.#pieces[captured_piece_index].y = undefined
		}

		// If an enpassant capture occured
		if (description.isEnPassant()) {
			// Find the piece that was captured
			const enpassant_square = squareToCoordinates(description.enPassantSquare())
			const captured_piece_index = this.#pieces.findIndex(
				piece => piece.x == enpassant_square.file && piece.y == enpassant_square.rank
			)
			if (captured_piece_index == -1)
				throw new Error('EnPassant captured a square that contains no Piece')

			// Update the piece that was captured
			this.#pieces[captured_piece_index].x = undefined
			this.#pieces[captured_piece_index].y = undefined
		}

		// If castling occured
		if (description.isCastling()) {
			// Find the rook that castled
			const rook_from = squareToCoordinates(description.rookFrom())
			const rook_index = this.#pieces.findIndex(
				piece => piece.x == rook_from.file && piece.y == rook_from.rank
			)
			if (rook_index == -1)
				throw new Error('Castling moved a rook from a square that contains no Piece')

			// Update the rook
			const rook_to = squareToCoordinates(description.rookTo())
			this.#pieces[rook_index].x = rook_to.file
			this.#pieces[rook_index].y = rook_to.rank
		}

		// Update the piece that was moved
		this.#pieces[moved_piece_index].x = to.file
		this.#pieces[moved_piece_index].y = to.rank

		// Update all moves
		this.#refresh_moves()
		this.#update()
		return true
	}

	state() {
		const turn = this.#position.turn() == 'w' ? 'white' : 'black'
		const checkmate = this.#position.isCheckmate()
		const stalemate = this.#position.isStalemate()
		const dead = this.#position.isDead()

		const over = checkmate || stalemate || dead
		const draw = over && !checkmate
		const winner = over && !draw ? turn : null

		return {
			pieces: this.#pieces,
			turn,
			over,
			draw,
			winner
			// ascii: this.#position.ascii()
		}
	}
}

export default ChssEngine
