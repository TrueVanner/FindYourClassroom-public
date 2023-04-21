import { ToggleButtonGroup, ToggleButton, Select, InputLabel, MenuItem, FormControl, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'
import Codes from './codes&IDs/IDsToString.json'
import { tbs2 } from '../Register'

type props = {
	index: number,
	subjectData: { get: any[], set: (subjectData: any[]) => void },
	subjErrors: { get: any[], set: (subjData: any[]) => void }
	HLsCount: { get: number, set: (hlCount: any) => void },
	subjectSet: any[],
	hasErrors: {get: any, set: (hasErrors: any) => void}
}

export default function SubjectSelectField(props: props) {
	
	const changeHasErrors = (newSubjErrors: any[]) => {
		const newHasErrors = Object.assign({}, props.hasErrors.get)
		newHasErrors.page2 = false
		newSubjErrors.forEach(error => {
			if(error != '') newHasErrors.page2 = true
		})
		props.hasErrors.set(newHasErrors)
	}

	const changeSubjectData = (index: number, key: 's' | 'l', value: any) => {
		if(key == 'l' && props.subjectData.get[index].l == value) return
		const newSubjectData = [...props.subjectData.get]
		const newSubjErrors = [...props.subjErrors.get]
		newSubjectData[index][key] = value
		newSubjErrors[index] = ''
		props.subjErrors.set(newSubjErrors)
		props.subjectData.set(newSubjectData)
		if(key == 'l') props.HLsCount.set(value == 1 ? props.HLsCount.get + 1 : props.HLsCount.get - 1)
		changeHasErrors(newSubjErrors)
	}

	const isDisabled = (index: number, key: any) => {
		if(index != 5) 
			return props.subjectData.get[5].s == key
		else
			return !!props.subjectData.get.slice(0, 5).find(subj => subj.s == key)
	}
	
	return (
		<Stack direction='row' spacing={1} alignItems='center'>
			<FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
				<InputLabel>{`Group ${props.index + 1} subject`}</InputLabel>
					<Select
						value={props.subjectData.get[props.index].s}
						onChange={(e) => changeSubjectData(props.index, 's', e.target.value)}
						label={"G"+(props.index+1)}>
							
						{props.subjectSet.map(v => {
							return <MenuItem key={v} disabled={isDisabled(props.index, v)} value={v}>{Codes[v.toString() as keyof typeof Codes]}</MenuItem>
						})}
					</Select>
				{props.subjErrors.get[props.index] ? (<FormHelperText sx={{color: 'red'}}>{props.subjErrors.get[props.index]}</FormHelperText>) : null}
			</FormControl>
			<ToggleButtonGroup
				value={props.subjectData.get[props.index].l+1}
				exclusive
				onChange={(e, l) => {if(l) changeSubjectData(props.index, 'l', l-1)}}>

				<ToggleButton sx={tbs2} value={1}>SL</ToggleButton>
				<ToggleButton sx={tbs2} disabled={props.HLsCount.get == 3} value={2}>HL</ToggleButton>
			</ToggleButtonGroup>
		</Stack>
	)
}