import {
	type ChangeEvent,
	type Dispatch,
	type SetStateAction,
	type SyntheticEvent,
	useState,
} from 'react'

interface FieldState {
	text: string
	valid: boolean
	regex: RegExp
}

const EMAIL_REGEX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/

const FIELD_ERRORS = {
	name: 'Please enter your name.',
	email: 'Please enter a valid email address.',
	message: 'Please enter a message.',
} as const

const BASE_INPUT_CLASSES =
	'w-full bg-[whitesmoke] text-charcoal border rounded-[3px] py-1.5 px-2.5 h-[2.25em] leading-[1.5] text-base shadow-[inset_0_1px_2px_rgba(10,10,10,0.1)] focus:outline-2 focus:outline-charcoal focus:outline-offset-2'

const BUTTON_CLASSES =
	'border-2 border-[silver] rounded-[0.2rem] px-4 py-[0.3rem] cursor-pointer bg-transparent uppercase inline-block relative transition-[background] duration-200 ease-in-out hover:bg-[rgba(51,51,51,0.07)] focus:outline-2 focus:outline-charcoal focus:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mr-4 mb-4 max-md:mr-2'

const encode = (data: Record<string, string>) =>
	Object.keys(data)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&')

const checkValid = (...fields: FieldState[]) => fields.every(({ text, regex }) => regex.test(text))

const isInvalid = (field: FieldState) => field.text.length > 0 && !field.valid

const inputClasses = (field: FieldState): string => {
	const filled = field.text.length > 0
	let stateClasses: string
	if (!filled) {
		stateClasses = 'border-gray-light focus:shadow-[inset_0_1px_5px_rgba(10,10,10,0.1)]'
	} else if (field.valid) {
		stateClasses = 'border-form-valid focus:shadow-[inset_0_1px_5px_rgba(60,179,113,0.5)]'
	} else {
		stateClasses = 'border-red-error focus:shadow-[inset_0_1px_5px_rgba(169,68,66,0.5)]'
	}
	return `${BASE_INPUT_CLASSES} ${stateClasses}`
}

const textareaClasses = (field: FieldState): string =>
	`${inputClasses(field)} min-h-[120px] max-h-[600px]`

function ContactForm() {
	const [name, setName] = useState<FieldState>({ text: '', valid: false, regex: /\S/ })
	const [email, setEmail] = useState<FieldState>({ text: '', valid: false, regex: EMAIL_REGEX })
	const [message, setMessage] = useState<FieldState>({ text: '', valid: false, regex: /\S/ })
	const [sent, setSent] = useState(false)

	const handleChange =
		(field: FieldState, setter: Dispatch<SetStateAction<FieldState>>) =>
		(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { value } = event.target
			setter({ ...field, valid: field.regex.test(value), text: value })
		}

	const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!checkValid(name, email, message)) return

		fetch('/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: encode({
				'form-name': 'contact',
				name: name.text,
				email: email.text,
				message: message.text,
			}),
		})
			.then((res) => {
				if (res.ok) {
					clearForm()
					setSent(true)
				} else {
					throw new Error(`Something went wrong and your message was not sent! 🤯 ${res.status}`)
				}
			})
			.catch((error: unknown) => alert(error))
	}

	const clearForm = () => {
		setName((field) => ({ ...field, text: '' }))
		setEmail((field) => ({ ...field, text: '' }))
		setMessage((field) => ({ ...field, text: '' }))
	}

	if (sent) {
		return (
			<article className="mt-[30%] text-center border-t-[5px] border-olive rounded-[5px] p-4 bg-off-white shadow-[0_3px_6px_1px_rgba(0,0,0,0.05)]">
				<h2 className="text-3xl">Message Sent!</h2>
				<p className="mt-4">
					<span role="img" aria-label="mail">
						📩
					</span>{' '}
					Your message is on it's way to me and I'll get back to you as soon as I can. Thanks for
					getting in touch.
				</p>
			</article>
		)
	}

	return (
		<form data-netlify="true" name="contact" method="post" onSubmit={handleSubmit}>
			<input type="hidden" name="form-name" value="contact" />
			<div className="mb-6">
				<label htmlFor="name" className="block text-base font-bold mb-2">
					Your Name:{' '}
				</label>
				<input
					id="name"
					type="text"
					name="name"
					value={name.text}
					placeholder="Your Name"
					aria-invalid={isInvalid(name)}
					aria-describedby={isInvalid(name) ? 'name-error' : undefined}
					onChange={handleChange(name, setName)}
					className={inputClasses(name)}
				/>
				{isInvalid(name) ? (
					<p id="name-error" className="sr-only">
						{FIELD_ERRORS.name}
					</p>
				) : null}
			</div>
			<div className="mb-6">
				<label htmlFor="email" className="block text-base font-bold mb-2">
					Your Email:{' '}
				</label>
				<input
					id="email"
					type="email"
					name="email"
					value={email.text}
					placeholder="you@youremail.com"
					aria-invalid={isInvalid(email)}
					aria-describedby={isInvalid(email) ? 'email-error' : undefined}
					onChange={handleChange(email, setEmail)}
					className={inputClasses(email)}
				/>
				{isInvalid(email) ? (
					<p id="email-error" className="sr-only">
						{FIELD_ERRORS.email}
					</p>
				) : null}
			</div>
			<div className="mb-6">
				<label htmlFor="message" className="block text-base font-bold mb-2">
					Message:{' '}
				</label>
				<textarea
					id="message"
					name="message"
					value={message.text}
					placeholder="What do you want to say?"
					aria-invalid={isInvalid(message)}
					aria-describedby={isInvalid(message) ? 'message-error' : undefined}
					onChange={handleChange(message, setMessage)}
					className={textareaClasses(message)}
				/>
				{isInvalid(message) ? (
					<p id="message-error" className="sr-only">
						{FIELD_ERRORS.message}
					</p>
				) : null}
			</div>
			<div className="flex flex-wrap justify-around md:justify-start">
				<button
					type="submit"
					disabled={!checkValid(name, email, message)}
					className={BUTTON_CLASSES}
				>
					Send Message
				</button>
				<button type="button" onClick={clearForm} className={BUTTON_CLASSES}>
					Clear Form
				</button>
			</div>
		</form>
	)
}

export default ContactForm
