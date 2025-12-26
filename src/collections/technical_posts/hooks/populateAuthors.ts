import type { CollectionAfterReadHook } from 'payload'
import type { Post, User } from 'src/payload-types'

// Extend the Post type to include the populated field
interface PostWithPopulatedAuthors extends Post {
  populatedAuthors?: {
    id: string
    name: string
  }[]
}

// This hook populates author data on the Post collection
export const populateAuthors: CollectionAfterReadHook<Post> = async ({ doc, req }) => {
  if (doc?.authors && doc.authors.length > 0) {
    const authorDocs: User[] = []

    for (const author of doc.authors) {
      try {
        const authorDoc = await req.payload.findByID({
          id: typeof author === 'object' ? author.id : author,
          collection: 'users',
          depth: 0,
        })

        if (authorDoc) {
          authorDocs.push(authorDoc)
        }
      } catch {
        // silently ignore missing authors
      }
    }

    if (authorDocs.length > 0) {
      ;(doc as PostWithPopulatedAuthors).populatedAuthors = authorDocs.map((authorDoc) => ({
        id: authorDoc.id,
        name: authorDoc.name ?? 'Unknown',
      }))
    }
  }

  return doc
}
