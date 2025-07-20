// // src/collections/Projects.ts

// import type { CollectionConfig } from 'payload'

// // Extracted hook function for slug generation
// function generateSlugFromTitle({
//   data,
//   operation,
//   originalDoc,
// }: {
//   data: { title?: string; slug?: string }
//   operation: string
//   originalDoc?: { title?: string }
// }): string | undefined {
//   const shouldGenerateSlug = operation === 'create' || (operation === 'update' && !data.slug)
//   if (shouldGenerateSlug) {
//     const title = data.title || originalDoc?.title
//     if (title) {
//       return title
//         .toLowerCase()
//         .replace(/ /g, '-')
//         .replace(/[^\w-]+/g, '')
//     }
//   }
//   return data.slug
// }

// export const Projects: CollectionConfig = {
//   slug: 'projects', // This is the unique identifier for your collection
//   admin: {
//     useAsTitle: 'title', // What field to use as the title in the admin UI
//     defaultColumns: ['title', 'category', 'status', 'updatedAt'], // Columns to show in the admin list view
//     group: 'Portfolio', // Group this collection under 'Portfolio' in the admin sidebar
//   },
//   access: {
//     read: () => true, // Anyone can read projects on the frontend
//   },
//   fields: [
//     {
//       name: 'title',
//       type: 'text',
//       required: true,
//       label: 'Project Title',
//     },
//     {
//       name: 'slug',
//       type: 'text',
//       unique: true, // Ensures each slug is unique for URLs
//       admin: {
//         description:
//           'A unique identifier for the project URL (e.g., my-awesome-website-project). This will be auto-generated from the title if left blank.',
//       },
//       // Custom slug field to automatically generate from title
//       hooks: {
//         beforeValidate: [generateSlugFromTitle],
//       },
//     },
//     {
//       name: 'category',
//       type: 'select',
//       options: [
//         { label: 'Web Development', value: 'web-development' },
//         { label: 'Mobile App', value: 'mobile-app' },
//         { label: 'UI/UX Design', value: 'ui-ux-design' },
//         { label: 'Graphic Design', value: 'graphic-design' },
//         { label: 'Game Development', value: 'game-development' },
//         { label: 'Other', value: 'other' },
//       ],
//       defaultValue: 'web-development',
//       required: true,
//     },
//     {
//       name: 'status',
//       type: 'select',
//       options: [
//         { label: 'Draft', value: 'draft' },
//         { label: 'Published', value: 'published' },
//         { label: 'Archived', value: 'archived' },
//       ],
//       defaultValue: 'draft',
//       admin: {
//         position: 'sidebar', // Puts this field in the sidebar of the admin UI
//       },
//     },
//     {
//       name: 'featuredImage',
//       type: 'upload',
//       relationTo: 'media', // This links to your existing 'media' collection for images
//       required: true,
//       label: 'Main Project Image',
//       admin: {
//         description: 'The primary image for this project, shown on listings.',
//       },
//     },
//     {
//       name: 'description',
//       type: 'richText', // Allows you to write formatted text, like in a word processor
//       label: 'Detailed Project Description',
//     },
//     {
//       name: 'technologies',
//       type: 'array', // An array allows you to add multiple items
//       label: 'Technologies Used',
//       fields: [
//         {
//           name: 'techName',
//           type: 'text',
//           required: true,
//         },
//       ],
//       admin: {
//         description:
//           'List of technologies or tools used in this project (e.g., React, Node.js, Figma).',
//       },
//     },
//     {
//       name: 'projectUrl',
//       type: 'text',
//       label: 'Live Demo URL (Optional)',
//       admin: {
//         placeholder: 'https://www.yourproject.com',
//       },
//     },
//     {
//       name: 'githubUrl',
//       type: 'text',
//       label: 'GitHub Repository URL (Optional)',
//       admin: {
//         placeholder: 'https://github.com/yourusername/yourproject',
//       },
//     },
//     {
//       name: 'screenshots',
//       type: 'array',
//       label: 'Additional Screenshots/Images (Optional)',
//       fields: [
//         {
//           name: 'image',
//           type: 'upload',
//           relationTo: 'media',
//           required: true,
//         },
//         {
//           name: 'caption',
//           type: 'text',
//           label: 'Image Caption (Optional)',
//         },
//       ],
//       admin: {
//         description: 'Additional images to showcase your project.',
//       },
//     },
//   ],
// }
