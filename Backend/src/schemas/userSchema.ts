import { Schema } from 'mongoose'

export type UserSchemaType = { email: string | undefined, pass: string | undefined, student_data: string | undefined }

export const UserSchema = new Schema({
	email: String,
	password: String,
	user_data: String,
	student_data: String
})