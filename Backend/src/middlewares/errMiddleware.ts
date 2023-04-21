import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/apiError.js'

export default function(err: ApiError, req: Request, res: Response, next: NextFunction) {
	const { status, message, fails } = err

	console.log(err.message)

	return res.status(status ?? 400).json({
		success: false,
		status: status,
		message: message ?? 'Error!',
		fails: fails
	})
}