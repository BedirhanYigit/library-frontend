import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type TextFieldProps = {
  label: string
  name: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  type?: HTMLInputTypeAttribute
  placeholder?: string
  required?: boolean
}

function TextField
({
   label,
   name,
   value,
   onChange,
   type = 'text',
   placeholder,
   required = false,
 }: TextFieldProps) {
  return (
    <div className={"input-group"}>
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
      />
    </div>
  )
}

export default TextField
