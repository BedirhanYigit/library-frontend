import type { ChangeEventHandler, TextareaHTMLAttributes } from 'react'

type TextAreaFieldProps = {
	label: string
	name: string
	value: string
	onChange: ChangeEventHandler<HTMLTextAreaElement>
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'value' | 'onChange'>

function TextAreaField({ label, name, value, onChange, required = false, ...textareaProps }: TextAreaFieldProps) {
	return (
		<div className="input-group">
			<label htmlFor={name}>
				{label}
				{required && ' *'}
			</label>

			<textarea id={name} name={name} value={value} onChange={onChange} required={required} {...textareaProps}></textarea>
		</div>
	)
}

export default TextAreaField
