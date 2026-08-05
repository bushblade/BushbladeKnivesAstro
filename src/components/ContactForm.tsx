import {
	type ChangeEvent,
	type Dispatch,
	type FormEvent,
	type SetStateAction,
	useState,
} from 'react'

interface FieldState {
	text: string
	valid: boolean
	regex: RegExp
}

const EMAIL_REGEX = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/

const BASE_INPUT_CLASSES =
	'w-full bg-[whitesmoke] text-charcoal border rounded-[3px] py-1.5 px-2.5 h-[2.25em] leading-[1.5] text-base shadow-[inset_0_1px_2px_rgba(10,10,10,0.1)] focus:outline-none'

const BUTTON_CLASSES =
	'border-2 border-[silver] rounded-[0.2rem] px-4 py-[0.3rem] cursor-pointer bg-transparent uppercase inline-block relative transition-[background] duration-200 ease-in-out hover:bg-[rgba(51,51,51,0.07)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 mr-4 mb-4 max-md:mr-2'

const encode = (data: Record<string, string>) =>
	Object.keys(data)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
		.join('&')

const checkValid = (...fields: FieldState[]) => fields.every(({ text, regex }) => regex.test(text))

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

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
				<h2 className="text-[1.73rem] font-medium mb-6">Message Sent!</h2>
				<p>
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
					onChange={handleChange(name, setName)}
					className={inputClasses(name)}
				/>
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
					onChange={handleChange(email, setEmail)}
					className={inputClasses(email)}
				/>
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
					onChange={handleChange(message, setMessage)}
					className={textareaClasses(message)}
				/>
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
