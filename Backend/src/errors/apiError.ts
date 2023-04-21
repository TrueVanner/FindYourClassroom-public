import { ValidationError } from 'express-validator'

export default class ApiError extends Error {
	status
	fails 

	constructor(status: number, message: string, fails: Array<ValidationError> | undefined = undefined) {
		super(message)
		this.status = status
		this.fails = fails
	}
}