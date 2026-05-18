import type { ChangeEventHandler, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react'

type TextFieldProps = {
	label: string
	name: string
	value: string
	onChange: ChangeEventHandler<HTMLInputElement>
	type?: HTMLInputTypeAttribute
	placeholder?: string
	required?: boolean
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange' | 'type'>

function TextField({
	label,
	name,
	value,
	onChange,
	type = 'text',
	placeholder,
	required = false,
	...inputProps
}: TextFieldProps) {
	return (
		<div className="input-group">
			<label htmlFor={name}>
				{label}
				{required && ' *'}
			</label>

			<input
				id={name}
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				{...inputProps}
			/>
		</div>
	)
}

export default TextField
