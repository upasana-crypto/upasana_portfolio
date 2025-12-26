// payload.config.ts

// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob' // Import the Vercel Blob Storage plugin
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { resendAdapter } from '@payloadcms/email-resend'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { technical_posts } from './collections/Technical_Posts'
import { Users } from './collections/Users'

// --- ADD THESE NEW IMPORTS ---
// import { Projects } from './collections/Projects' // Make sure Projects.ts exists in src/collections/
import { Homepage } from './globals/Homepage' // Make sure Homepage.ts exists in src/globals/
// --- END NEW IMPORTS ---

import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    // 🎯 ADDED: Meta configuration to change the browser tab title
    meta: {
      // This text will be appended to the page title in the browser tab
      // Example: "Dashboard — Upasana Portfolio Admin"
      titleSuffix: '— Upasana Portfolio Admin',
    },
    // 🎯 ADDED: End of Meta configuration

    components: {
      // 🎯 ADDED: Custom Logo and Icon definitions
      graphics: {
        // Points to the custom React component for the main logo (login, open sidebar)
        Logo: 'src/graphics/Logo.tsx',

        // Points to the custom React component for the small icon (collapsed sidebar)
        Icon: 'src/graphics/Icon.tsx',
      },
      // 🎯 MODIFICATION END

      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [
    Pages,
    Posts,
    Media, // Ensure Media collection is included here
    Categories,
    technical_posts,
    Users,
    // --- ADD YOUR NEW COLLECTION HERE ---
    // Projects, // <--- ADD THIS LINE
  ],
  cors: [getServerSideURL('/')].filter(Boolean),
  globals: [
    Header,
    Footer,
    // --- ADD YOUR NEW GLOBAL HERE ---
    Homepage, // <--- ADD THIS LINE
  ],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
    // Configure Vercel Blob Storage
    vercelBlobStorage({
      enabled: true, // Enable the plugin
      collections: {
        // Specify which collections should use Vercel Blob
        // The slug 'media' must match the slug of your Media collection
        media: true,
        // If you had a 'MediaWithPrefix' collection, you would configure it like this:
        // 'media-with-prefix': {
        //   prefix: 'my-prefix',
        // },
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Do uploads directly on the client to bypass limits on Vercel serverless functions
      clientUploads: true,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  //added email options
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY ?? '',
    defaultFromAddress: process.env.PUBLIC_EMAIL_FROM_ADDRESS ?? 'noreply@example.com', // Use a fallback
    defaultFromName: process.env.PUBLIC_EMAIL_FROM_NAME ?? 'Payload CMS',
  }),
})
