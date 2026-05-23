import type { Book } from '../../models/types.ts'
import type { BookRequest } from '../../models/request.types.ts'
import { useTranslation } from 'react-i18next'
import { type ChangeEvent, type MouseEventHandler, type SubmitEventHandler, useEffect, useState } from 'react'
import { toAssetUrl } from '../../api/assets.ts'
import TextField from '../TextField.tsx'

interface BookFormData {
	title: string
	author: string
	isbn: string
	genre: string
	numOfTotalCopies: string
}

type BookFormModalProps = {
	book: Book | null
	isSubmitting: boolean
	onSubmit: (payload: BookRequest, coverImage: File | null) => Promise<void>
	onClose: () => void
}

const emptyBookForm: BookFormData = {
	title: '',
	author: '',
	isbn: '',
	genre: '',
	numOfTotalCopies: '',
}

function createFormDataFromBook(book: Book | null): BookFormData {
	if (!book) {
		return emptyBookForm
	}

	return {
		title: book.title,
		author: book.author,
		isbn: book.isbn,
		genre: book.genre ?? '',
		numOfTotalCopies: String(book.numOfTotalCopies),
	}
}

function BookFormModal({ book, isSubmitting, onSubmit, onClose }: BookFormModalProps) {
	const { t } = useTranslation()

	const [formData, setFormData] = useState<BookFormData>(() => createFormDataFromBook(book))
	const [coverImage, setCoverImage] = useState<File | null>(null)
	const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState<string | null>(null)

	const isEditing = book !== null
	const existingCoverImageUrl = toAssetUrl(book?.coverImageUrl)
	const previewImageUrl = coverImagePreviewUrl ?? existingCoverImageUrl

	useEffect(() => {
		setFormData(createFormDataFromBook(book))
		setCoverImage(null)
		setCoverImagePreviewUrl(null)
	}, [book])

	useEffect(() => {
		if (!coverImage) {
			setCoverImagePreviewUrl(null)
			return
		}

		const previewUrl = URL.createObjectURL(coverImage)
		setCoverImagePreviewUrl(previewUrl)

		return () => {
			URL.revokeObjectURL(previewUrl)
		}
	}, [coverImage])

	const handleBackdropMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
		if (e.target !== e.currentTarget) {
			return
		}

		onClose()
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCoverImage(e.target.files?.[0] ?? null)
	}

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		const payload: BookRequest = {
			title: formData.title.trim(),
			author: formData.author.trim(),
			isbn: formData.isbn.trim(),
			genre: formData.genre.trim(),
			numOfTotalCopies: Number(formData.numOfTotalCopies),
		}

		await onSubmit(payload, coverImage)
	}

	return (
		<div className="modal-backdrop" role="presentation" onMouseDown={handleBackdropMouseDown}>
			<div className="modal-card book-form-modal" role="dialog" aria-modal="true">
				<div className="modal-header">
					<h2>{isEditing ? t('adminBooks.updateBookDetails') : t('adminBooks.createBookTitle')}</h2>

					<button type="button" className="modal-close-button" onClick={onClose} disabled={isSubmitting}>
						×
					</button>
				</div>

				<form className="login-form" onSubmit={handleSubmit}>
					<TextField
						label={t('book.title')}
						name="title"
						value={formData.title}
						onChange={handleInputChange}
						required
					/>

					<TextField
						label={t('book.author')}
						name="author"
						value={formData.author}
						onChange={handleInputChange}
						required
					/>

					<TextField label={t('book.genre')} name="genre" value={formData.genre} onChange={handleInputChange} />

					<TextField label={t('book.isbn')} name="isbn" value={formData.isbn} onChange={handleInputChange} required />

					<TextField
						label={t('book.totalNumberOfCopies')}
						name="numOfTotalCopies"
						type="number"
						value={formData.numOfTotalCopies}
						onChange={handleInputChange}
						min={1}
						required
					/>

					<div className="input-group">
						<label htmlFor="coverImage">{t('book.coverImage')}</label>

						<div className="cover-image-upload-row">
							<input
								id="coverImage"
								className="cover-image-file-input"
								name="coverImage"
								type="file"
								accept="image/png,image/jpeg,image/webp"
								onChange={handleCoverImageChange}
								disabled={isSubmitting}
							/>

							<label className="cover-image-upload-button" htmlFor="coverImage" tabIndex={0}>
								{t('book.chooseCoverImage')}
							</label>

							<span className="cover-image-file-name">
								{coverImage ? coverImage.name : t('book.noCoverImageSelected')}
							</span>
						</div>

						<p className="cover-image-upload-hint">{t('book.coverImageUploadHint')}</p>

						{previewImageUrl && (
							<div className="cover-image-preview">
								<img src={previewImageUrl} alt={t('book.coverImagePreview')} />
							</div>
						)}
					</div>

					<div className="button-group">
						<button type="button" className="login-btn back-btn" onClick={onClose} disabled={isSubmitting}>
							{t('adminBooks.cancel')}
						</button>

						<button type="submit" className="login-btn admin-btn" disabled={isSubmitting}>
							{isSubmitting
								? t('adminBooks.saving')
								: isEditing
									? t('adminBooks.saveChanges')
									: t('adminBooks.createBook')}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default BookFormModal
