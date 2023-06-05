type ErrorCode = 'InternalServerError' | 'ValidationError' | 'OpFailed'

export default class Error {
	code: ErrorCode
	data: any

	constructor(code: ErrorCode, data?: any) {
		this.code = code
		this.data = data
	}
}

export class InternalServerError extends Error {
	constructor(data?: any) {
		super('InternalServerError', data)
	}
}

export class ValidationError extends Error {
	constructor(data?: any) {
		super('ValidationError', data)
	}
}

export class OpFailed extends Error {
	constructor(data?: any) {
		super('OpFailed', data)
	}
}
