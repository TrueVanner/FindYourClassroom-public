import { LoadingButton } from '@mui/lab'
import { Box, Button, InputAdornment, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StyledTextField from './assets/StyledTextField'
import fetchData from './assets/fetchData'

export default function ReportForm() {

	const navigate = useNavigate()

	const [type, setType] = useState(0)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [hasLoaded, setHasLoaded] = useState(false)
	const [noteData, setNoteData] = useState({
		name: '',
		descr: '',
	})
	const [errors, setErrors] = useState({
		name: '',
		descr: '',
		other: ''
	})

	const [length, setLength] = useState({ name: 0, descr: 0 })

	const changeNoteData = (str: string, type: 0 | 1) => {
		const newNoteData = Object.assign({}, noteData)
		const newLength = Object.assign({}, length)

		if(type == 0) {
			if(str.length <= 50) {
				newNoteData.name = str
				newLength.name = str.length
			}
		} else {
			if(str.length <= 1000) {
				newNoteData.descr = str
				newLength.descr = str.length
			}
		}

		setNoteData(newNoteData)
		setLength(newLength)
	}


	const submit = async () => {
		setLoading(true)
		
		const newErrors = {
			name: '',
			descr: '',
			other: ''
		}

		const data = await fetchData('/notes/' + type, noteData, 'POST').catch(() => setLoading(false))
		if(data.success) {
			setSuccess(true)
		} else {
			setSuccess(false)
			data.fails.forEach((fail: any) => {
				newErrors[fail.param as keyof typeof newErrors] = fail.msg
			})
		}
		setErrors(newErrors)
		setLoading(false)
		setHasLoaded(true)
	}

	return (
		<Box display="flex" alignItems='center' justifyContent='center' minHeight='100vh'>
			<Button
				variant='outlined'
				style={{position: 'absolute', left: '0.1%', top: '0.1%', margin: '5px'}}
				onClick={() => navigate(-1)}>
					BACK
			</Button>
			<Paper style={{width: '70vw', padding: '10px', backgroundColor: document.body.style.backgroundColor }}>
				<Stack spacing={5}>
					<StyledTextField
						color={errors.descr ? 'error' : 'primary'}
						style={{width: 'auto'}}
						InputProps={{
							endAdornment: <InputAdornment position="end">{`${length.name}/50`}</InputAdornment>
						}}
						onChange={e => { if(!success && !loading) setHasLoaded(false); changeNoteData(e.target.value, 0) }}
						onClick={() => { if(success && !loading) setHasLoaded(false) }}
						label='Name of the bug / Suggestion'
						helperText={errors.name}
						error={!!errors.name}
						value={noteData.name}/>
					<StyledTextField
						color={errors.descr ? 'error' : 'primary'}
						InputProps={{
							endAdornment: <InputAdornment position="end">{`${length.descr}/1000`}</InputAdornment>
						}}
						multiline
						rows={10}
						style={{width: 'auto'}}
						helperText={errors.descr}
						error={!!errors.descr}
						onChange={e => { if(!success && !loading) setHasLoaded(false); changeNoteData(e.target.value, 1) }}
						value={noteData.descr}
						onClick={() => { if(success && !loading) setHasLoaded(false) }}
						label='Detailed description'/>
					<ToggleButtonGroup
						value={type}
						exclusive
						onChange={() => setType(Math.abs(type - 1))}>
							
						<ToggleButton value={0}>Bug</ToggleButton>
						<ToggleButton value={1}>Suggestion</ToggleButton>
					</ToggleButtonGroup>

					{hasLoaded ? (
						errors.other ? (
							<Typography sx={{color: 'red'}}>{errors.other}</Typography>
						) : ( success ? (
							<Typography sx={{color: 'green'}}>Success!</Typography>
						) : null)
					) : null}
					
					<LoadingButton
						loading={loading}
						loadingIndicator='Loading…'
						variant='contained'
						color={hasLoaded ? (success ? 'success' : 'error') : 'primary'}
						onClick={submit}>
							Submit
					</LoadingButton>
				</Stack>
			</Paper>
		</Box>
	)
}