import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import fetchData from './assets/fetchData'
import { G1, G2, G3, G4, G5, G6, TOK } from './assets/codes&IDs/subjectCodeSets.js'
import Codes from './assets/codes&IDs/IDsToString.json'
import { SubjectData, tbs1, tbs2 } from './Register'
import { LoadingButton } from '@mui/lab'
import BG from './assets/BG'

export async function editLoader() {
	document.body.style.backgroundColor = BG.hex
	const data = await fetchData('/studentdata')
	return data.data
}

export default function EditStudentData() {
	const navigate = useNavigate()

	const studentData = useLoaderData() as { year: number, group: number, subjects: SubjectData}

	// it took me days to find the way to store this data so that nothing breaks
	// and apparently this is the only way
	const [subjectData, setSubjectData] = useState([
		{s: studentData.subjects[0].s, l: studentData.subjects[0].l},
		{s: studentData.subjects[1].s, l: studentData.subjects[1].l},
		{s: studentData.subjects[2].s, l: studentData.subjects[2].l},
		{s: studentData.subjects[3].s, l: studentData.subjects[3].l},
		{s: studentData.subjects[4].s, l: studentData.subjects[4].l},
		{s: studentData.subjects[5].s, l: studentData.subjects[5].l},
		{s: studentData.subjects[6].s, l: studentData.subjects[6].l},
	])

	const [originalSubjectData, setOriginalSubjectData] = useState(studentData.subjects)
	const [originalYear, setOriginalYear] = useState(studentData.year)
	const [originalGroup, setOriginalGroup] = useState(studentData.group)

	// not include homeroom subject
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState({
		year: '',
		group: '',
		subjects: ''
	})
	const [subjErrors, setSubjErrors] = useState([
		'', '', '', '', '', '', ''
	])
	const [year, setYear] = useState(originalYear)
	const [group, setGroup] = useState(originalGroup)
	const [HLsCount, setHLsCount] = useState(3)

	const changeSubjectData = (index: number, key: 's' | 'l', value: any) => {
		if(key == 'l' && subjectData[index].l == value) return;
		const obj = [...subjectData]
		obj[index][key] = value
		setSubjectData(obj)
		if(key == 'l') setHLsCount(value == 1 ? HLsCount + 1 : HLsCount - 1)
	}

	const submit = async () => {
		setLoading(true)

		const body = {
			year: year,
			group: group,
			subjects: subjectData
		}

		let isSame = year == originalYear && group == originalGroup
		subjectData.forEach((subject, i) => {
			isSame = isSame && subject.s == originalSubjectData[i].s && subject.l == originalSubjectData[i].l
		})
		
		let data: any = {}
		if(isSame) {
			data.success = false
			data.fails = [{
				param: 'subjects',
				msg: 'There are no changes.'
			}]
		} else {
			data = await fetchData('/studentdata', body, 'POST')
		}

		if(!data.success) {
			const newErrors: any = {}
			const newSubjectErrors = ['', '', '', '', '', '', '']

			data.fails.forEach((fail: any) => {
				if(fail.param == 'subjects' && fail.msg.includes('#')) {
					const fullMsg = fail.msg.split('#')
					newSubjectErrors[fullMsg[1]] = fullMsg[0]
				}
				newErrors[fail.param] = fail.msg
			})
			
			setLoading(false)
			setErrors(newErrors)
			setSubjErrors(newSubjectErrors)
		} else navigate('/')
	}
	return (
		<Box display='flex' alignItems='center' justifyContent='center' minHeight='100vh'>
			<Paper sx={{display: 'flex', width: '800px', height: '90vh', alignItems: 'center', justifyContent: 'center', backgroundColor: document.body.style.backgroundColor}}>
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
							<Stack direction='row' spacing={1} alignItems='center'>
								<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
									<InputLabel>Group 1 subject</InputLabel>
										<Select
											value={subjectData[0].s}
											onChange={(e) => changeSubjectData(0, 's', e.target.value)}
											label="G1">
												
											{G1.map(v => {
												return <MenuItem key={v} disabled={subjectData[5].s == v} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
											})}
										</Select>
									{subjErrors[0] ? (<FormHelperText sx={{color: 'red'}}>{subjErrors[0]}</FormHelperText>) : null}
								</FormControl>
								<ToggleButtonGroup
									value={subjectData[0].l+1}
									exclusive
									onChange={(e, l) => {if(l) changeSubjectData(0, 'l', l-1)}}>

									<ToggleButton sx={tbs2} value={1}>SL</ToggleButton>
									<ToggleButton sx={tbs2} disabled={HLsCount == 3} value={2}>HL</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
							<Stack direction='row' spacing={1} alignItems='center'>
								<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
									<InputLabel>Group 2 subject</InputLabel>
										<Select
											value={subjectData[1].s}
											onChange={(e) => changeSubjectData(1, 's', e.target.value)}
											label="G2">

											{G2.map(v => {
												return <MenuItem key={v} disabled={subjectData[5].s == v} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
											})}
										</Select>
									{subjErrors[1] ? (<FormHelperText sx={{color: 'red'}}>{subjErrors[1]}</FormHelperText>) : null}
								</FormControl>
								<ToggleButtonGroup
									value={subjectData[1].l+1}
									exclusive
									onChange={(e, l) => {if(l) changeSubjectData(1, 'l', l-1)}}>
										
									<ToggleButton sx={tbs2} value={1}>SL</ToggleButton>
									<ToggleButton sx={tbs2} disabled={HLsCount == 3} value={2}>HL</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
							<Stack direction='row' spacing={1} alignItems='center'>
								<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
									<InputLabel>Group 3 subject</InputLabel>
										<Select
											value={subjectData[2].s}
											onChange={(e) => changeSubjectData(2, 's', e.target.value)}
											label="G3">

											{G3.map(v => {
												return <MenuItem key={v} disabled={subjectData[5].s == v} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
											})}
										</Select>
									{subjErrors[2] ? (<FormHelperText sx={{color: 'red'}}>{subjErrors[2]}</FormHelperText>) : null}
								</FormControl>
								<ToggleButtonGroup
									value={subjectData[2].l+1}
									exclusive
									onChange={(e, l) => {if(l) changeSubjectData(2, 'l', l-1)}}>
										
									<ToggleButton sx={tbs2} value={1}>SL</ToggleButton>
									<ToggleButton sx={tbs2} disabled={HLsCount == 3} value={2}>HL</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
						</Stack>
						<Stack spacing={1}>
						<Stack direction='row' spacing={1} alignItems='center'>
								<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
									<InputLabel>Group 4 subject</InputLabel>
										<Select
											value={subjectData[3].s}
											onChange={(e) => changeSubjectData(3, 's', e.target.value)}
											label="G4">

											{G4.map(v => {
												return <MenuItem key={v} disabled={subjectData[5].s == v} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
											})}
										</Select>
									{subjErrors[3] ? (<FormHelperText sx={{color: 'red'}}>{subjErrors[3]}</FormHelperText>) : null}
								</FormControl>
								<ToggleButtonGroup
									value={subjectData[3].l+1}
									exclusive
									onChange={(e, l) => {if(l) changeSubjectData(3, 'l', l-1)}}>
										
									<ToggleButton sx={tbs2} value={1}>SL</ToggleButton>
									<ToggleButton sx={tbs2} disabled={HLsCount == 3} value={2}>HL</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
							<Stack direction='row' spacing={1} alignItems='center'>
								<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
									<InputLabel>Group 5 subject</InputLabel>
										<Select
											value={subjectData[4].s}
											onChange={(e) => changeSubjectData(4, 's', e.target.value)}
											label="G5">

											{G5.map(v => {
												return <MenuItem key={v} disabled={subjectData[5].s == v} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
											})}
										</Select>
									{subjErrors[4] ? (<FormHelperText sx={{color: 'red'}}>{subjErrors[4]}</FormHelperText>) : null}
								</FormControl>
								<ToggleButtonGroup
									value={subjectData[4].l+1}
									exclusive
									onChange={(e, l) => {if(l) changeSubjectData(4, 'l', l-1)}}>
										
									<ToggleButton sx={tbs2} value={1}>SL</ToggleButton>
									<ToggleButton sx={tbs2} disabled={HLsCount == 3} value={2}>HL</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
							<Stack direction='row' spacing={1} alignItems='center'>
								<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
									<InputLabel>Group 6 subject</InputLabel>
										<Select
											value={subjectData[5].s}
											onChange={(e) => changeSubjectData(5, 's', e.target.value)}
											label="G5">

											{G6.map(v => {
												return <MenuItem key={v} disabled={!!subjectData.find(subj => subj.s == v)} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
											})}
										</Select>
									{subjErrors[5] ? (<FormHelperText sx={{color: 'red'}}>{subjErrors[5]}</FormHelperText>) : null}
								</FormControl>
								<ToggleButtonGroup
									value={subjectData[5].l+1}
									exclusive
									onChange={(e, l) => {if(l) changeSubjectData(5, 'l', l-1)}}>
										
									<ToggleButton sx={tbs2} value={1}>SL</ToggleButton>
									<ToggleButton sx={tbs2} disabled={HLsCount == 3} value={2}>HL</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
						</Stack>
					</Stack>

					<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
						<InputLabel>TOK</InputLabel>
							<Select
								value={subjectData[6].s}
								onChange={(e) => changeSubjectData(6, 's', e.target.value)}
								label="TOK">

								{TOK.map(v => {
									return <MenuItem key={v} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
								})}
							</Select>
						{subjErrors[6] ? (<FormHelperText sx={{color: 'red'}}>{subjErrors[6]}</FormHelperText>) : null}
					</FormControl>
							
					{errors.subjects && !errors.subjects.includes('#') ? <Typography sx={{color: 'red'}}>{errors.subjects}</Typography> : null}
					
					<LoadingButton
						style={{marginTop: '6vh'}}
						loading={loading}
						loadingIndicator='Loading…'
						variant='outlined'
						// desided to be stubborn
						color={Object.values(errors).find(e => /.+/.test(e)) || subjErrors.find(e => /.+/.test(e)) ? 'error' : 'primary'}
						onClick={submit}>
							Submit
					</LoadingButton>
				</Stack>
			</Paper>
		</Box>
	)
}