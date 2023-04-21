import { NextFunction, Request, Response } from 'express'

import StudentDTO, { FullUserDTO, UserDTO } from '../DTOs/userDTO.js'
import userService from '../service/userService.js'
import ApiError from '../errors/apiError.js'
import Cookies from 'cookies'
import { encrypt } from '../utils/crypt.js'
import { isInDayBounds, Time } from '../utils/classrooms.js'

class UserController {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const { name, surname, email, password, year, group, subjects, is_secure } = req.body
			
			const result = await userService.registerUser(new FullUserDTO(name, surname, email, password, year, group, subjects))
			
			const cookies = new Cookies(req, res, { keys: [process.env.TOKEN] })
			cookies.set('fyc_logindata', JSON.stringify(result.toCookie), { domain: process.env.LOCALDOMAIN, sameSite: process.env.PROD ? 'none' : undefined, signed: true, maxAge: 1000*60*60*24 * (is_secure ? 7 : 1), httpOnly: true })

			res.status(200).json({ success: true, message: result.message })
		} catch (e) {
			next(e)
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password, is_secure } = req.body

			const cookies = new Cookies(req, res, { keys: [process.env.TOKEN] })
			cookies.set('fyc_logindata', JSON.stringify(new UserDTO(email, encrypt(password))), { domain: process.env.LOCALDOMAIN, sameSite: process.env.PROD ? 'none' : undefined, signed: true, maxAge: 1000*60*60*24 * (is_secure ? 7 : 1), httpOnly: true })

			res.status(200).json({ success: true })
		} catch(e) {
			next(e)
		}
	}

	async getCurrent(req: Request, res: Response, next: NextFunction) {
		try {
			if (!isInDayBounds(new Date().getDay(), Time.current()))
				throw new ApiError(403, 'Time out of bounds')
		
			const result = userService.getCurrent(JSON.parse(req.body.studentData))
			res.status(200).json({ success: true, data: result })
		} catch(e) {
			next(e)
		}
	}
	
	async getNext(req: Request, res: Response, next: NextFunction) {
		try {
			if (!isInDayBounds(new Date().getDay(), Time.current()))
				throw new ApiError(403, 'Time out of bounds')

			const result = userService.getNext(JSON.parse(req.body.studentData))
			res.status(200).json({ success: true, data: result })
		} catch(e) {
			next(e)
		}
	}

	async getFreeRoomsDuringBreak(req: Request, res: Response, next: NextFunction) {
		try {
			const result = userService.getBreakRooms(JSON.parse(req.body.studentData))
			res.status(200).json(result)
		} catch(e) {
			next(e)
		}
	}

	async getStudentData(req: Request, res: Response, next: NextFunction) {
		try {
			res.status(200).json({ success: true, data: JSON.parse(req.body.studentData) })
		} catch(e) {
			next(e)
		}
	}

	async setStudentData(req: Request, res: Response, next: NextFunction) {
		try {
			const { login, year, group, subjects } = req.body
			
			const result = await userService.setStudentData(login, new StudentDTO(year, group, subjects))

			res.status(200).json({ success: true, message: result.message })
		} catch (e) {
			next(e)
		}
	}
}

export default new UserController()