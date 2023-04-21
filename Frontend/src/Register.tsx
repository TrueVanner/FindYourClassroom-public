import React, { useState } from 'react'
import { Button, Typography, Paper, ToggleButtonGroup, ToggleButton, Select, InputLabel, MenuItem, FormControl, InputAdornment, IconButton, FormHelperText, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import ReactCardFlip from 'react-card-flip'
import MainTextField from './assets/MainTextField'
import StyledTextField from './assets/StyledTextField'
import { Stack } from '@mui/system'
import Codes from './assets/codes&IDs/IDsToString.json'
import { G1, G2, G3, G4, G5, G6, TOK } from './assets/codes&IDs/subjectCodeSets'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import fetchData from './assets/fetchData'
import { useNavigate } from 'react-router-dom'
import SubjectSelectField from './assets/SubjectSelectField'

export type RegUserData = {
	name: string,
	surname: string,
	email: string,
	password: string,
	cpassword: string,
}

export type StudentData = {
	year: number,
	group: number
}

export type SubjectData = {
	s: number,
	l: number
}[]

export const tbs1 = {
	width: '7ch',
	fontWeight: 'bold'
}
export const tbs2 = {
	height: '4ch'
}

export default function Register() {
	const navigate = useNavigate()

	const [userData, setUserData] = useState({
		name: '',
		surname: '',
		email: '',
		password: '',
		cpassword: ''
	})
	
	const [errors, setErrors] = useState({
		name: '',
		surname: '',
		email: '',
		password: '',
		cpassword: '',
		year: '',
		group: '',
		subjects: ''
	})

	const [subjErrors, setSubjErrors] = useState([
		'', '', '', '', '', '', ''
	])

	const [year, setYear] = useState(0)
	const [group, setGroup] = useState(0)

	const [subjectData, setSubjectData] = useState([
		{ s: -1, l: 0 },
		{ s: -1, l: 0 },
		{ s: -1, l: 0 },
		{ s: -1, l: 0 },
		{ s: -1, l: 0 },
		{ s: -1, l: 0 },
		{ s: -1, l: -1 },
	])

	const changeTOKData = (value: any) => {
		const newSubjectData = [...subjectData]
		const newSubjErrors = [...subjErrors]
		newSubjectData[6].s = value
		newSubjErrors[6] = ''
		setSubjErrors(newSubjErrors)
		setSubjectData(newSubjectData)
	}

	const changePasswords = (key: 'password' | 'cpassword', value: any) => {
		const newUserData = Object.assign({}, userData)
		const newErrors = Object.assign({}, errors)
		newUserData[key] = value
		newErrors[key] = ''
		setUserData(newUserData)
		setErrors(newErrors)
		changeHasErrors(newErrors)
	}

	const changeHasErrors = (newErrors: any) => {
		const newHasErrors = Object.assign({}, hasErrors)
		newHasErrors.page1 = false
		Object.values(newErrors).slice(0, 4).forEach(error => {
			if(error != '') newHasErrors.page1 = true
		})
		setHasErrors(newHasErrors)
	}

	const handleFlip = () => {
		setIsFlipped(!isFlipped)
	}

	const [HLsCount, setHLsCount] = useState(0)

	const [isFlipped, setIsFlipped] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [secure, setSecure] = useState(true)
	const [hasErrors, setHasErrors] = useState({
		page1: false,
		page2: false
	})

	const register = async () => {

		setLoading(true)
		const body = {
			name: userData.name,
			surname: userData.surname,
			email: userData.email,
			password: userData.password,
			year: year,
			group: group,
			subjects: subjectData,
			is_secure: secure
		}

		const data = await fetchData('/register', body, 'POST').catch(e => setLoading(false))
		if(data.redirectTo) navigate(data.redirectTo)

		// lazy cpassword check
		if(userData.password != userData.cpassword) {
			data.success = false
			data.fails ??= []
			data.fails.push({
				msg: 'Passwords don\'t match',
				param: 'cpassword'
			})
		}

		if(!data.success) {
			const newErrors: any = {}
			const newSubjectErrors = ['', '', '', '', '', '']
			const newHasErrors: any = {}

			data.fails.forEach((fail: any) => {
				if(fail.param == 'subjects') {
					newHasErrors.page2 = true

					if(fail.msg.includes('#')) {
						newErrors.subjects = ''
						const fullMsg = fail.msg.split('#')
						newSubjectErrors[fullMsg[1]] = fullMsg[0]
					}
				} else newHasErrors.page1 = true
				newErrors[fail.param] = fail.msg
			})

			setLoading(false)
			setErrors(newErrors)
			setSubjErrors(newSubjectErrors)
			setHasErrors(newHasErrors)
		} else navigate('/')
	}

	return (
		<Stack spacing={5} style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
			<ReactCardFlip isFlipped={isFlipped} flipDirection='horizontal'>
				<Paper sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: document.body.style.backgroundColor}}>
					<Stack spacing={1.5} m={5}>
						<MainTextField
							label='Real name (only visible to teachers)'
							name='name'
							errors={{get: errors, set: setErrors}}
							userDatas={{ get: userData, set: setUserData }}
							hasErrors={{ get: hasErrors, set: setHasErrors }}
						/>
						<MainTextField
							label='Real surname (only visible to teachers)'
							name='surname'
							errors={{get: errors, set: setErrors}}
							userDatas={{ get: userData, set: setUserData }}
							hasErrors={{ get: hasErrors, set: setHasErrors }}
						/>
						<MainTextField
							label='Email'
							name='email'
							errors={{get: errors, set: setErrors}}
							userDatas={{ get: userData, set: setUserData }}
							hasErrors={{ get: hasErrors, set: setHasErrors }}
						/>
						<StyledTextField
							required={true}
							label='Password'
							error={!!errors.password}
							helperText={errors.password}
							value={userData.password}
							type={showPassword ? 'text' : 'password'}
							onChange={event => changePasswords('password', event.target.value)}

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
						
						<StyledTextField
							required={true}
							label='Confirm password'
							error={!!errors.cpassword}
							helperText={errors.cpassword}
							value={userData.cpassword}
							type={showPassword ? 'text' : 'password'}
							onChange={event => changePasswords('cpassword', event.target.value)}

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
						<FormGroup>
						<FormControlLabel
							control={<Checkbox defaultChecked />}
							label="Remember me"
							onChange={() => setSecure(!secure)}/>
						</FormGroup>

						<Button variant='outlined' color={hasErrors.page2 ? 'error' : 'primary'} onClick={handleFlip}>NEXT →</Button>
					</Stack>
				</Paper>
				<Paper sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: document.body.style.backgroundColor}}>
					<Stack direction='column' m={3} spacing={3}>
					
						<Stack direction='row' justifyContent='center' spacing={5}>
							<Stack direction='column' spacing={1.5} alignItems='center'>
								<Typography variant='h5'>Year</Typography>
								<Stack direction='row'>
								<ToggleButtonGroup
									value={year+1}
									exclusive
									onChange={(e, l) => {if(l) setYear(l-1)}}>
									<ToggleButton sx={tbs1} value={1}>DP1</ToggleButton>
									<ToggleButton sx={tbs1} value={2}>DP2</ToggleButton>
								</ToggleButtonGroup>
								</Stack>
							</Stack>
							<Stack direction='column' spacing={1.5} alignItems='center'>
								<Typography variant='h5'>Group</Typography>
								<Stack direction='row'>
								<ToggleButtonGroup
									value={group+1}
									exclusive
									onChange={(e, l) => {if(l) setGroup(l-1)}}>
									<ToggleButton sx={tbs1} value={1}>A</ToggleButton>
									<ToggleButton sx={tbs1} value={2}>B</ToggleButton>
								</ToggleButtonGroup>
								</Stack>
							</Stack>
						</Stack>
						
						<Typography variant='h5'>Subjects</Typography>

						<Stack direction='row' spacing={3}>
							<Stack spacing={1}>
								<SubjectSelectField
									index={0}
									subjectData={{get: subjectData, set: setSubjectData}}
									subjErrors={{get: subjErrors, set: setSubjErrors}}
									HLsCount={{get: HLsCount, set: setHLsCount}}
									subjectSet={G1}
									hasErrors={{ get: hasErrors, set: setHasErrors }}/>

								<SubjectSelectField
									index={1}
									subjectData={{get: subjectData, set: setSubjectData}}
									subjErrors={{get: subjErrors, set: setSubjErrors}}
									HLsCount={{get: HLsCount, set: setHLsCount}}
									subjectSet={G2}
									hasErrors={{ get: hasErrors, set: setHasErrors }}/>

								<SubjectSelectField
									index={2}
									subjectData={{get: subjectData, set: setSubjectData}}
									subjErrors={{get: subjErrors, set: setSubjErrors}}
									HLsCount={{get: HLsCount, set: setHLsCount}}
									subjectSet={G3}
									hasErrors={{ get: hasErrors, set: setHasErrors }}/>
							</Stack>

							<Stack spacing={1}>
								<SubjectSelectField
									index={3}
									subjectData={{get: subjectData, set: setSubjectData}}
									subjErrors={{get: subjErrors, set: setSubjErrors}}
									HLsCount={{get: HLsCount, set: setHLsCount}}
									subjectSet={G4}
									hasErrors={{ get: hasErrors, set: setHasErrors }}/>
									
								<SubjectSelectField
									index={4}
									subjectData={{get: subjectData, set: setSubjectData}}
									subjErrors={{get: subjErrors, set: setSubjErrors}}
									HLsCount={{get: HLsCount, set: setHLsCount}}
									subjectSet={G5}
									hasErrors={{ get: hasErrors, set: setHasErrors }}/>

								<SubjectSelectField
									index={5}
									subjectData={{get: subjectData, set: setSubjectData}}
									subjErrors={{get: subjErrors, set: setSubjErrors}}
									HLsCount={{get: HLsCount, set: setHLsCount}}
									subjectSet={G6}
									hasErrors={{ get: hasErrors, set: setHasErrors }}/>
								
							</Stack>
							
						</Stack>

						<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
							<InputLabel>TOK</InputLabel>
								<Select
									value={subjectData[6].s}
									onChange={(e) => changeTOKData(e.target.value)}
									label="TOK">

									{TOK.map(v => {
										return <MenuItem key={v} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
									})}
								</Select>
							{subjErrors[6] ? (<FormHelperText sx={{color: 'red'}}>{subjErrors[6]}</FormHelperText>) : null}
						</FormControl>
								
						{errors.subjects && !errors.subjects.includes('#') ? <Typography sx={{color: 'red'}}>{errors.subjects}</Typography> : null}
						<Button variant='outlined' color={hasErrors.page1 ? 'error' : 'primary'} onClick={handleFlip}>← PREV</Button>
					</Stack>			
				</Paper>
			</ReactCardFlip>

			<LoadingButton
				loading={loading}
				loadingIndicator='Loading…'
				variant='contained'
				onClick={register}>
					Register
			</LoadingButton>
		</Stack>
	)
}