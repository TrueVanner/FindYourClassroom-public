// connects to the database containing the student data.
// a separate empty database was created for the sake of testing,
// but the original database was used for the demonstration

import mongoose from 'mongoose'
import { UserSchema } from '../schemas/userSchema.js'

const conn = mongoose.createConnection(process.env.DB_URL_USERS, {
	keepAliveInitialDelay: 300000,
	socketTimeoutMS: 10000,
})

conn.asPromise().then(() => console.log('Connection to MongoDB-Testing established'))

export const UserModel = conn.model('Students', UserSchema)