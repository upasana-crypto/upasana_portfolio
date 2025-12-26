import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
  technical_posts: '/technical_posts',
}

// type Props = {
//   collection: keyof typeof collectionPrefixMap
//   slug: string
//   req: PayloadRequest
// }
type Props = {
  // Use CollectionSlug directly to allow any collection defined in Payload
  collection: CollectionSlug
  slug: string
  req: PayloadRequest
}

// export const generatePreviewPath = ({ collection, slug }: Props) => {
//   const encodedParams = new URLSearchParams({
//     slug,
//     collection,
//     path: `${collectionPrefixMap[collection]}/${slug}`,
//     previewSecret: process.env.PREVIEW_SECRET || '',
//   })

//   const url = `/next/preview?${encodedParams.toString()}`

//   return url
// }

export const generatePreviewPath = ({ collection, slug }: Props) => {
  const path = `${collectionPrefixMap[collection] || ''}/${slug}`

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
