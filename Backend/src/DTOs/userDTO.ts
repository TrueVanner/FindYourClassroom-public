import { LevelType, SubjectType } from '../utils/classrooms.js'

export type UserType = { email: string, pass: string } 
export type StudentType = { name: string, surname: string, group: 0 | 1, year: 0 | 1, subjects: Array<{s: SubjectType, l: LevelType}>}
export type FullUserType = UserDTO & StudentDTO

export class FullUserDTO {
	name
	surname
	email
	password
	year
	group
	subjects

	constructor(name: string, surname: string, email: string, password: string, year: 0 | 1, group: 0 | 1, subjects: Array<{s: SubjectType, l: LevelType}>) {
		this.name = name,
		this.surname = surname,
		this.email = email,
		this.password = password
		this.year = year,
		this.group = group,
		this.subjects = subjects
	}
}

export class UserDTO {
	email
	password

	constructor(email: string, password: string) {
		this.email = email,
		this.password = password
	}
}

export default class StudentDTO {
	year
	group
	subjects

	constructor(year: 0 | 1, group: 0 | 1, subjects: Array<{s: SubjectType, l: LevelType}>) {
		this.year = year,
		this.group = group,
		this.subjects = subjects
	}
}