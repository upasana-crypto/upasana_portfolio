import type { Metadata } from 'next' // Necessary for generateMetadata

import React from 'react'
import Image from 'next/image'
import { getPayloadClient } from '../(payload)/getPayloadClient'
// Assuming HomepageType now includes the necessary media structure
import { Homepage as HomepageType, Media } from '../../payload-types'
import { Gutter } from '@/components/Gutter'

// Import utilities needed for metadata generation
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

// --- Async Data Fetching Functions ---

async function getHomepageContent(): Promise<HomepageType | null> {
  try {
    const payload = await getPayloadClient()

    // Ensure depth is sufficient to fetch all related data (media, etc.)
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

// Function to fetch content specifically for SEO purposes
async function getHomepageContentSEO(): Promise<HomepageType | null> {
  // We reuse the main fetch function since it fetches depth 1 (needed for image)
  return getHomepageContent()
}

// --- Next.js Metadata Generation Function ---

export async function generateMetadata(): Promise<Metadata> {
  const homepageContent = await getHomepageContentSEO()

  // 1. Source title and description from main content fields as a fallback for SEO
  const title = homepageContent?.mainTitle
  const description = homepageContent?.mainDescription

  // 2. Safely source the image from the 'backgroundImage' field for the OG image.
  const imageURL = (homepageContent?.backgroundImage as Media)?.url

  // Set pageTitle to main title or a sensible default
  const pageTitle = title || 'Home'

  // If even the main content is missing, use the ultimate fallback.
  if (!pageTitle && !description && !imageURL) {
    return {
      title: 'Upasana Chakraborty',
      openGraph: mergeOpenGraph(),
    }
  }

  return {
    // 🎯 Use explicit title structure to apply the name/brand suffix
    title: {
      template: '%s — Upasana Chakraborty',
      default: 'Upasana Chakraborty', // Default title for the root page itself
    },

    description: description ?? undefined,

    openGraph: mergeOpenGraph({
      title: pageTitle,
      description: description ?? undefined,
      url: getServerSideURL('/'),

      images: imageURL
        ? [
            {
              url: imageURL,
              width: 1200, // Standard OG image width
              height: 630, // Standard OG image height
              alt: pageTitle || 'Homepage Image',
            },
          ]
        : undefined,
    }),
  }
}

// --- Main Page Component ---

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
      // 1. Allows scrolling when content exceeds the viewport height (e.g., on mobile)
      className="min-h-screen w-full relative overflow-y-auto"
      style={{
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: textColor,
      }}
    >
      {/* Optional dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Foreground content. Use h-full to inherit height from min-h-screen */}
      <div className="relative z-10 h-full">
        {/* 2. Vertically centers the content block within the viewport */}
        <Gutter className="py-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          {/* 3. Main two-column wrapper. Use h-full to take up the full available Gutter space */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 w-full h-full">
            {/* ⬅️ Left Column: Main Title and Description */}
            {/* Removed justify-end here as mt-auto handles it. Keeping md:h-full is vital. */}
            <div className="md:w-1/2 text-center md:text-left flex flex-col md:h-full">
              {/* FIX APPLIED: Added mt-auto to push this content block to the bottom of the flex column */}
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-3 font-[sans-serif] italic mt-auto">
                {mainTitle}
              </h1>
              {mainDescription && (
                <p className="text-lg lg:text-xl max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed font-[sans-serif]">
                  {mainDescription}
                </p>
              )}
            </div>

            {/* ➡️ Right Column: Grid of Sections (2-up) */}
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
                          let target: '_self' | '_blank' = '_self'

                          // 🛑 MODIFIED: Assuming the field for the document is named 'documentLink'
                          const linkedDocument = (link as any).documentLink as Media | null
                          const documentUrl = linkedDocument?.url

                          if (documentUrl) {
                            // CASE 1: Document Link (CV) - Use the file URL and open in new tab
                            href = documentUrl
                            target = '_blank'
                          } else if (
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
                            target = '_blank'
                          }

                          // Fallback check to use the original link.label which is always present
                          const linkLabel = (link as any).label || 'Link'

                          return (
                            <li key={linkIndex}>
                              <a
                                href={href}
                                className="block py-2 px-3 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-center text-lg font-semibold shadow-md"
                                style={{ color: section.textColor }}
                                target={target}
                                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                              >
                                {linkLabel}
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
