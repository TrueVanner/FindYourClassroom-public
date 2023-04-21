import crypto from 'crypto'

export function encrypt(value: string) {
	const cipher = crypto.createCipheriv('aes-256-gcm', process.env.KEY, Buffer.from(process.env.TOKEN, 'hex'))
	const encrypted = cipher.update(value, 'utf-8', 'hex') + cipher.final('hex')
	return `${encrypted}$${cipher.getAuthTag().toString('hex')}`
}

export function decrypt(encrypted: string) {
	const data = encrypted.split('$')
	const decipher = crypto.createDecipheriv('aes-256-gcm', process.env.KEY, Buffer.from(process.env.TOKEN, 'hex'))
	decipher.setAuthTag(Buffer.from(data[1], 'hex'))
	return decipher.update(data[0], 'hex', 'utf-8') + decipher.final('utf-8')
}