export type StatusMessageType = {
	type: 'success' | 'error'
	text: string
} | null

type StatusMessageProps = {
	message: StatusMessageType
}

function StatusMessage({ message }: StatusMessageProps) {
	if (!message) {
		return null
	}

	return <div className={message.type === 'error' ? 'error-message' : 'success-message'}>{message.text}</div>
}

export default StatusMessage
