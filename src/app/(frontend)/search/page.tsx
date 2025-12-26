import type { Metadata } from 'next/types'
import { Card, CardPostData } from '@/components/Card' // Import Card directly
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      relationTo: true, // ✅ CRITICAL: Fetch the source collection name
    },
    pagination: true, // Set to true so you can use totalDocs safely
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>
          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.docs.length > 0 ? (
        <div className="container">
          {/* ✅ Use a direct grid here instead of CollectionArchive */}
          <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8">
            {posts.docs.map((result: any, index) => (
              <div className="col-span-4" key={index}>
                <Card
                  className="h-full"
                  doc={result}
                  // ✅ Dynamic relationTo: 'pages', 'posts', or 'technical_posts'
                  relationTo={result.relationTo}
                  showCategories
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Search`,
  }
}
