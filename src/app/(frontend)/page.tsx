import React from 'react'
import Image from 'next/image'
import { getPayloadClient } from '../(payload)/getPayloadClient'
import { Homepage as HomepageType } from '../../payload-types'
import { Gutter } from '@/components/Gutter'

async function getHomepageContent(): Promise<HomepageType | null> {
  try {
    const payload = await getPayloadClient()

    const homepageData = await payload.findGlobal({
      slug: 'homepage',
      depth: 1,
    })

    return homepageData as HomepageType
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return null
  }
}

export default async function HomePage() {
  const homepageContent = await getHomepageContent()

  if (!homepageContent) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Loading homepage content or content not found...</p>
      </div>
    )
  }

  const {
    mainTitle,
    mainDescription,
    sections = [],
    backgroundImage,
    textColor = '#ffffff',
  } = homepageContent

  const backgroundUrl =
    typeof backgroundImage === 'object' && backgroundImage !== null ? backgroundImage.url : ''

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: textColor,
      }}
    >
      {/* Optional dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Foreground content */}
      {/* IMPORTANT: Ensure this container fills the height of the screen */}
      <div className="relative z-10 h-screen">
        {/* RE-APPLYING CENTER ALIGNMENT: Gutter now centers the content block vertically */}
        <Gutter className="py-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          {/* Main two-column wrapper */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 w-full">
            {/* ⬅️ Left Column: Main Title and Description */}
            {/* Using justify-end anchors the text within the left column to the bottom */}
            <div className="md:w-1/2 text-center md:text-left flex flex-col justify-end md:h-full">
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-3 font-[sans-serif] italic">
                {mainTitle}
              </h1>
              {mainDescription && (
                <p className="text-lg lg:text-xl max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed font-[sans-serif]">
                  {mainDescription}
                </p>
              )}
            </div>

            {/* ➡️ Right Column: Grid of Sections (2-up) */}
            {/* Content-sized container */}
            <div className="md:w-1/2 flex flex-row flex-wrap justify-center gap-4 md:pr-4">
              {sections?.map((section, index) => {
                const iconUrl =
                  typeof section.icon === 'object' && section.icon !== null ? section.icon.url : ''

                // Extract section background image URL
                const sectionBackgroundUrl =
                  typeof section.backgroundImage === 'object' && section.backgroundImage !== null
                    ? section.backgroundImage.url
                    : ''

                const textColorClass =
                  section.textColor === '#FFFFFF' ||
                  section.textColor?.toLowerCase().includes('white')
                    ? 'text-white'
                    : 'text-gray-800'

                return (
                  <div
                    key={index}
                    // ✅ SECTION IMAGE IS THE BACKGROUND HERE
                    className={`relative flex flex-col items-center justify-start p-5 rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]
                      w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] cursor-pointer border border-gray-300 dark:border-gray-700 ${textColorClass}`}
                    style={{
                      backgroundImage: sectionBackgroundUrl
                        ? `url(${sectionBackgroundUrl})`
                        : undefined,
                      backgroundColor: section.backgroundColor || 'transparent',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* ✅ Dark/color overlay for better text contrast over the image */}
                    {sectionBackgroundUrl && (
                      <div className="absolute inset-0 bg-black/40 rounded-xl z-0" />
                    )}

                    {/* Content container to ensure text/icon is above the background/overlay */}
                    <div className="relative z-10 flex flex-col items-center justify-start w-full">
                      <h2
                        className="text-2xl font-bold mb-2 font-[sans-serif] italic text-center"
                        style={{ color: section.textColor }}
                      >
                        {section.sectionTitle}
                      </h2>

                      {/* Icon image is intentionally removed/commented out to reduce vertical space */}

                      <Image
                        src={iconUrl || '/default-icon.png'}
                        alt={`${section.sectionTitle} icon`}
                        width={64}
                        height={64}
                        className="object-contain mb-4"
                      />

                      <ul className="text-base space-y-2 w-full max-w-xs">
                        {section.links?.map((link, linkIndex) => {
                          let href = '#'
                          if (
                            link.linkType === 'internal' &&
                            typeof link.internalPage === 'object' &&
                            typeof link.internalPage?.value === 'object' &&
                            'slug' in link.internalPage.value &&
                            typeof link.internalPage.relationTo === 'string'
                          ) {
                            const relationTo = link.internalPage.relationTo
                            const slug =
                              typeof link.internalPage.value === 'object' &&
                              'slug' in link.internalPage.value
                                ? link.internalPage.value.slug
                                : undefined
                            if (relationTo === 'posts') href = `/posts/${slug}`
                            else if (relationTo === 'pages') href = `/${slug}`
                          } else if (link.linkType === 'custom' && link.customUrl) {
                            href = link.customUrl
                          }

                          return (
                            <li key={linkIndex}>
                              <a
                                href={href}
                                className="block py-2 px-3 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-center text-lg font-semibold shadow-md"
                                style={{ color: section.textColor }}
                                target={link.linkType === 'custom' ? '_blank' : '_self'}
                                rel={link.linkType === 'custom' ? 'noopener noreferrer' : undefined}
                              >
                                {link.label}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Gutter>
      </div>
    </div>
  )
}
