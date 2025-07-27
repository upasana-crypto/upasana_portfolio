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
    mainDescription, // new field for description
    sections = [],
    backgroundImage,
    textColor = '#ffffff', // default fallback
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
      <div className="relative z-10">
        <Gutter className="py-24 text-center max-w-7xl mx-auto px-4">
          <h1 className="text-6xl font-extrabold mb-4 font-[serif] italic">{mainTitle}</h1>
          {mainDescription && (
            <p className="text-xl max-w-3xl mx-auto mb-16 leading-relaxed font-serif">
              {mainDescription}
            </p>
          )}

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4">
            {sections?.map((section, index) => {
              const iconUrl =
                typeof section.icon === 'object' && section.icon !== null ? section.icon.url : ''

              const textColorClass =
                section.textColor === '#FFFFFF' ||
                section.textColor?.toLowerCase().includes('white')
                  ? 'text-white'
                  : 'text-gray-800'

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: section.backgroundColor,
                    backgroundImage:
                      typeof section.backgroundImage === 'object' &&
                      section.backgroundImage !== null
                        ? `url(${section.backgroundImage.url})`
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className={`relative flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105
                    w-full md:w-96 h-96 cursor-pointer border border-gray-300 dark:border-gray-700 ${textColorClass}`}
                >
                  <h2
                    className="text-4xl font-bold mb-4 font-[serif] italic"
                    style={{ color: section.textColor }}
                  >
                    {section.sectionTitle}
                  </h2>

                  <Image
                    src={iconUrl || '/default-icon.png'}
                    alt={`${section.sectionTitle} icon`}
                    width={96}
                    height={96}
                    className="object-contain mb-6"
                  />

                  <ul className="text-lg space-y-2">
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
                        // if (relationTo === 'projects') href = `/projects/${slug}`
                        if (relationTo === 'posts') href = `/posts/${slug}`
                        else if (relationTo === 'pages') href = `/${slug}`
                      } else if (link.linkType === 'custom' && link.customUrl) {
                        href = link.customUrl
                      }

                      return (
                        <li key={linkIndex}>
                          <a
                            href={href}
                            className="block py-2 px-4 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-center text-xl font-semibold"
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
              )
            })}
          </div>
        </Gutter>
      </div>
    </div>
  )
}