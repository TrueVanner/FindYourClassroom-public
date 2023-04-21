import bodyParser from 'body-parser'
import express from 'express'
import mainRouter from './routers/mainRouter.js'
import errMiddleware from './middlewares/errMiddleware.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import https from 'https'
import fs from 'fs'

const app = express()
app.use(cors({ origin: (process.env.PROD ? 'https://' : 'http://') + process.env.DOMAIN, credentials: true }))

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(express.json())

app.use('/api', mainRouter)
app.use(errMiddleware)

app.use(cookieParser(process.env.TOKEN))

// important note - all code pieces which are perfomed on the condition
// of "process.env.PROD" being true are present to allow me to upload
// and run same code segments on both local and remote server. The pieces
// of code are usually domain-specific settings of cookies and server starting
// sequence, presented below.

if(process.env.PROD) {
	https.createServer({
		key: fs.readFileSync('/etc/letsencrypt/live/findyourclassroom.switzerlandnorth.cloudapp.azure.com/privkey.pem'),
		cert: fs.readFileSync('/etc/letsencrypt/live/findyourclassroom.switzerlandnorth.cloudapp.azure.com/fullchain.pem'),
	}, app).listen(process.env.PORT, () => {
		console.log('Server started!')
	})
} else app.listen(8081)
	

