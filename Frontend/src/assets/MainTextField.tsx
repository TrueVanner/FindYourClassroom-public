import React from 'react'
import StyledTextField from './StyledTextField'

type props = {
	not_required?: boolean,
	label: string,
	name: any,
	errors: {get: any, set: (errors: any) => void},
	userDatas: {get: any, set: (userData: any) => void},
	hasErrors?: {get: any, set: (hasErrors: any) => void}
}

export default function MainTextField(props: props) {

	const changeHasErrors = (newErrors: any) => {
		const newHasErrors = Object.assign({}, props.hasErrors?.get)
		newHasErrors.page1 = false
		Object.values(newErrors).slice(0, 4).forEach(error => {
			if(error != '') newHasErrors.page1 = true
		})
		props.hasErrors?.set(newHasErrors)
	}
	
	
	const changeUserData = (key: string, value: string) => {
		const newUserData: any = Object.assign({}, props.userDatas.get)
		const newErrors: any = Object.assign({}, props.errors.get)
		newUserData[key] = value
		newErrors[key] = ''
		props.userDatas.set(newUserData)
		props.errors.set(newErrors)
		if(props.hasErrors) changeHasErrors(newErrors)
	}

	return (
		
		<StyledTextField
			autoComplete='off'
			required={!props.not_required}
			label={props.label}
			error={!!props.errors.get[props.name]}
			helperText={props.errors.get[props.name]}
			value={props.userDatas.get[props.name]}
			onChange={event => changeUserData(props.name, event.target.value)}
		/>
	)
}