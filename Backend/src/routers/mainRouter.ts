import express, { NextFunction, Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import userController from '../controllers/userController.js'
import timetableController from '../controllers/timetableController.js'
import { UserModel } from '../config/connections.js'
import { SubjectType, Period, LevelType, Levels } from '../utils/classrooms.js'
import ApiError from '../errors/apiError.js'
import { decrypt } from '../utils/crypt.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import noteHandler from '../utils/noteHandler.js'
import fs from 'fs'
import Subjects from '../codes&other/codesToIDs.json' assert { type: 'json' }

function validate(req: Request, res: Response, next: NextFunction) {
	if(!validationResult(req).isEmpty())
		return next(new ApiError(400, 'Validation failed', validationResult(req).array()))
	next()
}

const router = express.Router()

router.post('/register',

	body('name')
		.exists({ checkFalsy: true }).bail()
		.withMessage('Invalid name!')
		.isLength({ min: 2, max: 60 }).bail()
		.withMessage('The name must be between 2 and 60 symbols'),
		
	body('surname')
		.exists({ checkFalsy: true }).bail()
		.withMessage('Invalid surname!')
		.isLength({ min: 2, max: 60 }).bail()
		.withMessage('The surname must be between 2 and 60 symbols'),
	
	body('email')
		.exists({ checkFalsy: true }).bail()
		.withMessage('E-mail must be included!')
		.isEmail()
		.bail().withMessage('This email is invalid')
		.custom(async value => {
			const users = await UserModel.findOne({ email: value })
			if (users)
				throw 'This email is already in use.'
			return true
		}),
	
	body('password')
		.exists({ checkFalsy: true }).bail()
		.withMessage('Create a password!')
		.isStrongPassword({ 'minLength': 6, 'minLowercase': 0, 'minNumbers': 1, 'minSymbols': 0, 'minUppercase': 0 }).bail()
		.withMessage('Your password must be at least 6 symbols long and contain at least 1 number!'),
	
	body('subjects').custom((subjects: Array<{s: SubjectType, l: LevelType}>) => {
		let hls = 0
		const subject_ids: SubjectType[] = []

		if(subjects.length < 6) throw 'You must select 6 subjects.'

		subjects.forEach((subject, i) => {
			if (!subject.s) throw 'Please select a subject!'
			if(!Object.values(Subjects).includes(subject.s)) throw 'This is not a valid subject.#'+i
			if(subject.l == undefined) throw 'Please select a subject level!#'+i
		
			if(![-1, 0, 1].includes(subject.l)) throw 'Wrong subject level#'+i
			
			if((subject.s == Subjects.COMP_SCI || subject.s == Subjects.SEH_SCI) && subject.l != Levels.SL) throw 'This subject can only be taken on SL level#'+i

			hls += +(subject.l == 1)
			// to validate all Eng B -> 1 Eng B, all Polish -> 1 Polish, all TOK -> 1 TOK
			// declarations to allow "includes"
			const english: SubjectType[] = [Subjects.ENG_B_G1, Subjects.ENG_B_G2, Subjects.ENG_B_G3, Subjects.ENG_B_G4]
			const polish: SubjectType[] = [Subjects.POL_G1, Subjects.POL_G2]
			const tok: SubjectType[] = [Subjects.TOK_MON, Subjects.TOK_TUE, Subjects.TOK_WED, Subjects.TOK_THU]

			// i'm not sure if it's legal but I'll do it anyway
			subject_ids.push(
				english.includes(subject.s) ? english[0] : 
					polish.includes(subject.s) ? polish[0] : 
						tok.includes(subject.s) ? tok [0] :
							subject.s)
		})

		if(hls != 3) throw 'You need to select exactly 3 HL subjects.'

		const badSubject = subject_ids.find((value, i) => subject_ids.indexOf(value) != i)
		if(badSubject)
			throw 'No duplicate subjects allowed.#'+subject_ids.lastIndexOf(badSubject)
			
		return true
	}),
	
	body('year')
		.isIn([0, 1]).bail().withMessage('Invalid study year!'),

	body('group')
		.isIn([0, 1]).bail().withMessage('Invalid group!'),
	
	body('is_secure')
		.default(false)
		.isBoolean().bail()
		.withMessage('Wrong value'),
	
	validate,
	userController.register)

router.post('/login',

	body('email')
		.exists({ 'checkFalsy': true }).bail()
		.withMessage('Missing login')
		.isEmail().bail()
		.withMessage('Please use your email to login!')
		.custom(async (value: string, { req }) => {
			const user = await UserModel.findOne({ email: value })
			if(!user) throw new ApiError(403, 'This user doesn\'t exist.')
			if(!user.password) throw new ApiError(500, 'User does not contain password')
			req.body.correctPass = user.password
			return true
		}),
	
	body('password')
		.exists({ 'checkFalsy': true }).bail()
		.withMessage('Missing password')
		.custom(async (value: string, { req }) => {
			if(!req.body.correctPass)
				return false
			
			const correctPass = req.body.correctPass
			req.body.correctPass = undefined
			if(value !== decrypt(correctPass)) throw new ApiError(401, 'Wrong password! Password recovery not yet supported, sorry :(')
			return true
		}),
	
	body('is_secure')
		.default(false)	
		.isBoolean().bail()
		.withMessage('Wrong value'),

	validate,
	userController.login)

router.get('/current',
	authMiddleware,

	userController.getCurrent)

router.get('/next',
	authMiddleware,
	userController.getNext)

router.get('/currentbreakrooms', 
	authMiddleware,
	userController.getFreeRoomsDuringBreak)

/**
 * Example of body:
 * {
 * 	'day': ?int
 * 	'periodBounds': {
 * 		'start': ?int
 *		'dur': ?int
 * 	}
 * }
 */
router.get('/tt/empty',
	authMiddleware,

	body('day')
		.default(new Date().getDay() - 1)
		.isIn([0, 1, 2, 3, 4]).bail()
		.withMessage('Invalid day'),

	body('periodBounds')
		.custom((periodBounds, { req }) => {
			const current = Period.current()

			if(!periodBounds.start)
				req.body.periodBounds.start = current
			
			if(!periodBounds.dur)
				req.body.periodBounds.dur = 1

			return true
		
		}).custom(periodBounds => {
			const toTest = new Period([periodBounds.start, periodBounds.dur], []) // checks if the period can be created
			periodBounds.end = toTest.end
			return true
		}),
	
	validate,
	timetableController.getEmptyRooms)

router.get('/tt/break',
	authMiddleware,
	
	body('day')
		.default(new Date().getDay() - 1)
		.isIn([0, 1, 2, 3, 4]).bail()
		.withMessage('Invalid day'),

	body('periodBounds')
		.custom((periodBounds, { req }) => {
			const current = Period.current()

			if(!periodBounds.start)
				req.body.periodBounds.start = current
			
			if(!periodBounds.dur)
				req.body.periodBounds.dur = 1

			return true
		
		}).custom(periodBounds => {
			const toTest = new Period([periodBounds.start, periodBounds.dur], []) // checks if the period can be created
			periodBounds.end = toTest.end
			return true
		}),	

	validate,
	timetableController.getClassesDuringPeriod
)

router.get('/studentdata', 
	authMiddleware, 
	userController.getStudentData
)

router.post('/studentdata', 
	authMiddleware,
	
	body('subjects').custom((subjects: Array<{s: SubjectType, l: LevelType}>) => {
		let hls = 0
		const subject_ids: SubjectType[] = []

		if(subjects.length < 7) throw 'You must select 6 subjects and a TOK subject.'

		subjects.forEach((subject, i) => {
			if (!subject.s) throw 'Please select a subject!#'+i
			if(!Object.values(Subjects).includes(subject.s)) throw 'This is not a valid subject.#'+i
			if(subject.l == undefined) throw 'Please select a subject level!#'+i
		
			if(![-1, 0, 1].includes(subject.l)) throw 'Wrong subject level#'+i
			
			if((subject.s == Subjects.COMP_SCI || subject.s == Subjects.SEH_SCI) && subject.l != Levels.SL) throw 'This subject can only be taken on SL level#'+i
			
			hls += +(subject.l == 1)
			// to validate all Eng B -> 1 Eng B, all Polish -> 1 Polish, all TOK -> 1 TOK
			const english: SubjectType[] = [Subjects.ENG_B_G1, Subjects.ENG_B_G2, Subjects.ENG_B_G3, Subjects.ENG_B_G4]
			const polish: SubjectType[] = [Subjects.POL_G1, Subjects.POL_G2]
			const tok: SubjectType[] = [Subjects.TOK_MON, Subjects.TOK_TUE, Subjects.TOK_WED, Subjects.TOK_THU]

			// i'm not sure if it's legal but I'll do it anyway
			subject_ids.push(
				english.includes(subject.s) ? english[0] : 
					polish.includes(subject.s) ? polish[0] : 
						tok.includes(subject.s) ? tok [0] :
							subject.s)
		})

		if(hls != 3) throw 'You need to select exactly 3 HL subjects.'

		const badSubject = subject_ids.find((value, i) => subject_ids.indexOf(value) != i)
		if(badSubject)
			throw 'No duplicate subjects allowed.#'+subject_ids.lastIndexOf(badSubject)
			
		return true
	}),
	
	body('year')
		.isIn([0, 1]).bail().withMessage('Invalid study year!'),

	body('group')
		.isIn([0, 1]).bail().withMessage('Invalid group!'),

	validate,
	userController.setStudentData
)

router.post('/notes/:id', 

	authMiddleware,

	param('id')
		.toInt()
		.isIn([0, 1]).bail()
		.withMessage('Wrong note ID'),
	
	body('name')
		.exists({ checkFalsy: true }).bail()
		.withMessage('The name cannot be empty!')
		.isLength({ min: 2, max: 50 }).bail()
		.withMessage('The name must be 2-50 symbols long!'),
	
	body('descr')
		.exists({ checkFalsy: true }).bail()
		.withMessage('The description cannot be empty!')
		.isLength({ min: 2, max: 1000 }).bail()
		.withMessage('The description must be 2-1000 symbols long!'),
	
	body('other')
		.custom((a, { req }) => {
			const { name, descr, login } = req.body
			const result = noteHandler.validateNote(parseInt(req.params?.id), name, descr, login.split('@')[0])
			if(!result.success) throw result.msg
			return true
		}),
	
	validate,
	noteHandler.main
)

router.get('/download/:pass', 
	param('pass')
		.equals(process.env.DOWNLOAD_PASS as string).bail(),
	
	validate,
	(req, res) => {
		const textFile: string[] = []
		const paths = ['/bugNotes.json', '/suggestionNotes.json']

		paths.forEach(path => {
			textFile.push(path[1] == 'b' ? '\nBug reports:\n' : '\nSuggestions:\n')
			JSON.parse(fs.readFileSync(process.env.PATH_TO_REPORTS + path).toString()).forEach((info: any) => {
				let descrString = ''
				info.descr.split('\n').forEach((part: string) => {
					descrString += ('| ' + part + '\n')
				})
				textFile.push([`Author: ${info.author}`, `Date: ${info.date}`, `Name: ${info.name}`, 'Desciption:', descrString].join('\n'))	
			})
		})
		
		fs.writeFileSync(process.env.PATH_TO_REPORTS + '/allReports.txt', textFile.join('\n'))
		res.download(process.env.PATH_TO_REPORTS + '/allReports.txt')
	}
)

export default router