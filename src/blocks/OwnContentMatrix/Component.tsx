// components/blocks/OwnContentMatrix/Component.tsx
import React, { Fragment } from 'react'
import type {
  OwnContentMatrixBlock as OwnContentMatrixBlockType,
  RichtextElement,
  MediaElement,
  LinkElement,
} from '@/payload-types' // NOTE: Run 'payload generate:types' first!

import { cn } from '@/utilities/ui' // Assuming this Tailwind utility is available
import RichText from '@/components/RichText' // Your RichText renderer
import { Media } from '@/components/Media' // Your Media renderer
import { CMSLink } from '@/components/Link' // Your Link/Button renderer

// --- 1. Element Component Map (The inner-most content) ---
const elementComponents: {
  [key: string]: React.FC<RichtextElement | MediaElement | LinkElement | any>
} = {
  'richtext-element': (props: RichtextElement) =>
    props.richText ? <RichText data={props.richText} /> : null,
  'media-element': (props: MediaElement) => <Media resource={props.media} />,
  'link-element': (props: LinkElement) => <CMSLink label={props.linkText} url={props.linkURL} />,
}

// --- 2. Row Styling Map ---
const rowBackgrounds: { [key: string]: string } = {
  none: '',
  'light-gray': 'bg-gray-100 dark:bg-gray-800',
  'dark-blue': 'bg-blue-900 text-white dark:bg-blue-950',
}

// --- 3. Main Block Component ---
export const OwnContentMatrixBlock: React.FC<OwnContentMatrixBlockType> = (props) => {
  const { rows } = props

  if (!rows || rows.length === 0) return null

  return (
    <Fragment>
      {rows.map((row, rowIndex) => {
        const rowClass = rowBackgrounds[row.backgroundStyle || 'none']

        return (
          <section key={rowIndex} className={cn('py-16', rowClass)}>
            <div className="container">
              {/* Optional Row Title for debugging/admin guidance */}
              {row.rowTitle && <h2 className="mb-8">{row.rowTitle}</h2>}

              {/* Grid Wrapper: 12-column grid system */}
              <div className="grid grid-cols-4 md:grid-cols-12 gap-y-12 md:gap-x-16">
                {row.columns &&
                  row.columns.map((col, colIndex) => {
                    const { contentElements, size } = col

                    // Tailwind class for column width (e.g., lg:col-span-4)
                    const colSpanClass = `lg:col-span-${size}`

                    return (
                      <div
                        key={colIndex}
                        // Default to col-span-4 (full width on small screens), apply dynamic size on large
                        className={cn('col-span-4', colSpanClass)}
                      >
                        {/* Iterate over the flexible content elements */}
                        {contentElements &&
                          contentElements.map((element, elIndex) => {
                            const { blockType } = element
                            const Element = elementComponents[blockType]

                            if (Element) {
                              return (
                                <div key={elIndex} className="mb-4 last:mb-0">
                                  <Element {...element} />
                                </div>
                              )
                            }
                            return null
                          })}
                      </div>
                    )
                  })}
              </div>
            </div>
          </section>
        )
      })}
    </Fragment>
  )
}
