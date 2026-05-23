import type { Book } from '../../models/types.ts'
import type { BookRequest } from '../../models/request.types.ts'
import { useTranslation } from 'react-i18next'
import { type ChangeEvent, type MouseEventHandler, type SubmitEventHandler, useEffect, useRef, useState } from 'react'
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
	const [removeExistingCoverImage, setRemoveExistingCoverImage] = useState(false)

	const coverImageInputRef = useRef<HTMLInputElement | null>(null)

	const isEditing = book !== null
	const existingCoverImageUrl = toAssetUrl(book?.coverImageUrl)
	const previewImageUrl = coverImagePreviewUrl ?? (removeExistingCoverImage ? null : existingCoverImageUrl)

	useEffect(() => {
		setFormData(createFormDataFromBook(book))
		setCoverImage(null)
		setCoverImagePreviewUrl(null)
		setRemoveExistingCoverImage(false)

		if (coverImageInputRef.current) {
			coverImageInputRef.current.value = ''
		}
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
		const selectedFile = e.target.files?.[0]

		if (!selectedFile) {
			return
		}

		setCoverImage(selectedFile)

		if (selectedFile) {
			setRemoveExistingCoverImage(false)
		}
	}

	const resetCoverImageInput = () => {
		if (coverImageInputRef.current) {
			coverImageInputRef.current.value = ''
		}
	}

	const handleClearSelectedCoverImage = () => {
		setCoverImage(null)
		setCoverImagePreviewUrl(null)
		setRemoveExistingCoverImage(false)
		resetCoverImageInput()
	}

	const handleRemoveExistingCoverImage = () => {
		setCoverImage(null)
		setCoverImagePreviewUrl(null)
		setRemoveExistingCoverImage(true)
		resetCoverImageInput()
	}

	const getCoverImageFileName = () => {
		if (coverImage) {
			return coverImage.name
		}

		if (removeExistingCoverImage) {
			return t('book.coverImageMarkedForRemoval')
		}

		if (existingCoverImageUrl) {
			return t('book.currentCoverImage')
		}

		return t('book.noCoverImageSelected')
	}

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		const payload: BookRequest = {
			title: formData.title.trim(),
			author: formData.author.trim(),
			isbn: formData.isbn.trim(),
			genre: formData.genre.trim(),
			numOfTotalCopies: Number(formData.numOfTotalCopies),
			removeCoverImage: removeExistingCoverImage,
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

				<form className="app-form book-form-grid" onSubmit={handleSubmit}>
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
								ref={coverImageInputRef}
								className="cover-image-file-input"
								name="coverImage"
								type="file"
								accept="image/png,image/jpeg,image/webp"
								onChange={handleCoverImageChange}
								disabled={isSubmitting}
							/>

							<label className="cover-image-upload-button" htmlFor="coverImage">
								{t('book.chooseCoverImage')}
							</label>

							<span className="cover-image-file-name" title={getCoverImageFileName()}>
								{getCoverImageFileName()}
							</span>
						</div>

						<p className="cover-image-upload-hint">{t('book.coverImageUploadHint')}</p>
					</div>

					{previewImageUrl && (
						<div className="cover-image-preview">
							<button
								type="button"
								className="cover-image-preview-remove-button"
								onClick={coverImage ? handleClearSelectedCoverImage : handleRemoveExistingCoverImage}
								disabled={isSubmitting}
								aria-label={coverImage ? t('book.clearSelectedCoverImage') : t('book.removeCoverImage')}
							>
								×
							</button>

							<img src={previewImageUrl} alt={t('book.coverImagePreview')} />
						</div>
					)}

					<div className="button-group book-form-actions">
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
