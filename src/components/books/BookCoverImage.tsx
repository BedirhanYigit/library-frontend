import { useState } from 'react'
import { toAssetUrl } from '../../api/assets.ts'
import bookPlaceholderImage from '../../assets/book-placeholder.png'

type BookCoverImageProps = {
	title: string
	coverImageUrl?: string | null | undefined
}

export const BookCoverImage = ({ title, coverImageUrl }: BookCoverImageProps) => {
	const [hasImageLoadError, setHasImageLoadError] = useState(false)

	const resolvedCoverImageUrl = toAssetUrl(coverImageUrl)
	const imageSrc = !hasImageLoadError && resolvedCoverImageUrl ? resolvedCoverImageUrl : bookPlaceholderImage
	const isPlaceholder = imageSrc === bookPlaceholderImage

	return (
		<img
			className="entity-card-cover-image"
			src={imageSrc}
			alt={isPlaceholder ? '' : title}
			onError={() => setHasImageLoadError(true)}
		/>
	)
}

export default BookCoverImage
