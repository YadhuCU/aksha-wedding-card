import { CoverflowGallery } from '../CoverflowGallery'
import { SectionTitle } from '../SectionTitle'
import { useReveal } from '../../hooks/useReveal'
import { invitation } from '../../data/invitation'

export function Gallery({ images, onImageClick }) {
  const reveal = useReveal()
  if (!images.length) return null

  return (
    <section className="relative isolate z-10 w-full px-[9%] pt-[7%] pb-[10.9%] md:px-[12%] md:pt-[4%] md:pb-[7%]">
      <div
        ref={reveal}
        className="reveal relative z-10 flex w-full flex-col items-center"
      >
        <SectionTitle className="mb-5">{invitation.copy.galleryTitle}</SectionTitle>
        <CoverflowGallery images={images} onImageClick={onImageClick} />
      </div>
    </section>
  )
}
