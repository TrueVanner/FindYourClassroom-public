import { NextFunction, Request, Response } from 'express'
import Cookies from 'cookies'
import { UserModel } from '../config/connections.js'
import ApiError from '../errors/apiError.js'
import { decrypt } from '../utils/crypt.js'

export default (req: Request, res: Response, next: NextFunction) => {
	
	const cookies = new Cookies(req, res, { keys: [process.env.TOKEN] })

	try {
		const authCookie = cookies.get('fyc_logindata', { signed: true })

		if(authCookie) {
			const loginData: { email: string, password: string} = JSON.parse(authCookie)
			UserModel.findOne({ email: loginData.email }).then(user => {
				if(!user) {
					next(new ApiError(401, 'User with the email in the cookie doesn\'t exist'))
				}
				else {
					if(user.password != loginData.password)
						next(new ApiError(401, 'Wrong password'))
					else {
						req.body.login = loginData.email
						req.body.studentData = decrypt(user.student_data as string)
						next()
					}
				}
			})
		} else next(new ApiError(401, 'No cookie present'))
		
	} catch (e) {
		cookies.set('fyc_logindata', undefined)
		next(e)
	}
}