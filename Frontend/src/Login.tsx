import { LoadingButton } from '@mui/lab'
import { Alert, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputAdornment, Snackbar, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import MainTextField from './assets/MainTextField'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Clickable from './assets/Clickable'
import StyledTextField from './assets/StyledTextField'
import fetchData from './assets/fetchData'
import { useNavigate } from 'react-router-dom'

export type LoginUserData = {
	email: string,
	password: string,
}

function Login() {
	const navigate = useNavigate()

	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [userData, setUserData] = useState({
		email: '',
		password: ''
	})
	const [errors, setErrors] = useState({
		email: '',
		password: ''
	})
	const [secure, setSecure] = useState(true)
	const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)

	const changeUserData = (key: keyof LoginUserData, value: any) => {
		const obj = Object.assign({}, userData)
		obj[key] = value
		setUserData(obj)
	}

	const login = async () => {
		setLoading(true)

		const body = {
			email: userData.email,
			password: userData.password,
			is_secure: secure
		}

		const data = await fetchData('/login', body, 'POST').catch(e => setLoading(false))
		if(data.redirectTo) navigate(data.redirectTo)
		
		if(!data.success) {
			const newErrors: any = {}
			data.fails.forEach((fail: any) => {
				newErrors[fail.param] = fail.msg
			})
			setLoading(false)
			setErrors(newErrors)
		} else navigate('/')
	}

	return (
		<div>
			<Stack
				className='centered'
				direction='column'
				spacing={3}>
				
				<Stack
					direction='column'
					spacing={1.5}
					>

					<MainTextField
						label='Email'
						name='email'
						errors={{get: errors, set: setErrors}}
						userDatas={{ get: userData, set: setUserData }}
					/>

					<FormControl>
						<StyledTextField
							required={true}
							label='Password'
							error={!!errors.password}
							helperText={errors.password}
							value={userData.password}
							type={showPassword ? 'text' : 'password'}
							onChange={event => changeUserData('password', event.target.value)}

							InputProps={{
								autoComplete: 'off',
								endAdornment:

								<InputAdornment position='end'>
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										onMouseDown={event => event.preventDefault()}
										edge='end'>
										{showPassword ? <VisibilityOff/> : <Visibility/>}
									</IconButton>
								</InputAdornment>

							}}/>
						<Clickable
							sx={{
								position: 'relative',
								right: '-27.5%',
								fontStyle: 'italic',
							}}
							onClick={() => setErrorSnackbarOpen(true)}
							link={'/login'}
							colors={{ main: 'black', hover: 'gray' }}
							text='Forgot password?'
						/>
					</FormControl>
				</Stack>
				<FormGroup>
					<FormControlLabel
						control={<Checkbox defaultChecked />}
						label="Remember me"
						onChange={() => setSecure(!secure)}/>
				</FormGroup>
				<LoadingButton
					sx={{ mt: 7, width: '15ch' }}
					loading={loading}
					loadingIndicator='Loading…'
					variant='outlined'
					onClick={login}>
						Login
				</LoadingButton>

				<Typography sx={{ position: 'relative', top: '20px' }}>

					If you don&apos;t have an account yet,&nbsp;

					<Clickable
						sx={{
							textDecoration: 'underline'
						}}
						text='register'
						colors={{ main: 'black', hover: 'gray' }}
						link='/register'
					/>
					&nbsp;to be able to find your classrooms quickly, and more!
				</Typography>
			</Stack>
			<Snackbar
				open={errorSnackbarOpen}
				autoHideDuration={2500}
				onClose={() => setErrorSnackbarOpen(false)}
				anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
				<Alert severity='error'>Sorry, not yet implemented.</Alert>
			</Snackbar>
		</div>
	)
}

export default Login