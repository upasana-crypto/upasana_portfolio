'use client'

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
    typeof backgroundImage === 'object' && backgroundImage !== null
      ? backgroundImage.url
      : ''

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
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10">
        <Gutter className="py-24 text-center max-w-7xl mx-auto px-4">
          <h1 className="text-6xl font-extrabold mb-4 font-[serif] italic">{mainTitle}</h1>

          {mainDescription && (
            <p className="text-xl max-w-3xl mx-auto mb-16 leading-relaxed font-serif">
              {mainDescription}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => {
              const iconUrl =
                typeof section.icon === 'object' && section.icon !== null ? section.icon.url : ''

              const sectionBackgroundImage =
                typeof section.backgroundImage === 'object' && section.backgroundImage !== null
                  ? section.backgroundImage.url
                  : ''

              const isWhiteText =
                section.textColor?.toLowerCase() === '#ffffff' ||
                section.textColor?.toLowerCase() === 'white'

              return (
                <div
                  key={index}
                  className={`relative p-8 rounded-2xl shadow-xl border border-gray-300 dark:border-gray-700 flex flex-col justify-start items-center transition-transform duration-300 hover:scale-105`}
                  style={{
                    backgroundColor: section.backgroundColor || '#f9f9f9',
                    backgroundImage: sectionBackgroundImage ? `url(${sectionBackgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: section.textColor || '#000',
                  }}
                >
                  <h2 className="text-4xl font-bold mb-2 font-[serif] italic">
                    {section.sectionTitle}
                  </h2>

                  {section.sectionSubtitle && (
                    <p className="text-lg mb-4 font-serif text-center">
                      {section.sectionSubtitle}
                    </p>
                  )}

                  <Image
                    src={iconUrl || '/default-icon.png'}
                    alt={`${section.sectionTitle} icon`}
                    width={96}
                    height={96}
                    className="object-contain mb-6"
                  />

                  {section.links && section.links.length > 0 && (
                    <ul className="text-lg space-y-2 w-full">
                      {section.links.map((link, linkIndex) => {
                        let href = '#'

                        if (
                          link.linkType === 'internal' &&
                          typeof link.internalPage === 'object' &&
                          typeof link.internalPage?.value === 'object' &&
                          'slug' in link.internalPage.value &&
                          typeof link.internalPage.relationTo === 'string'
                        ) {
                          const relationTo = link.internalPage.relationTo
                          const slug = link.internalPage.value?.slug

                          if (relationTo === 'posts') href = `/posts/${slug}`
                          else if (relationTo === 'pages') href = `/${slug}`
                        } else if (link.linkType === 'custom' && link.customUrl) {
                          href = link.customUrl
                        }

                        return (
                          <li key={linkIndex}>
                            <a
                              href={href}
                              className={`block py-2 px-4 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-center text-xl font-semibold`}
                              style={{ color: section.textColor || '#000' }}
                              target={link.linkType === 'custom' ? '_blank' : '_self'}
                              rel={link.linkType === 'custom' ? 'noopener noreferrer' : undefined}
                            >
                              {link.label}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </Gutter>
      </div>
    </div>
  )
}
