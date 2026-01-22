import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './payload/collections/Users'
import { Products } from './payload/collections/Products'
import { Categories } from './payload/collections/Categories'
import { Media } from './payload/collections/Media'
import { BlogPosts } from './payload/collections/BlogPosts'
import { Orders } from './payload/collections/Orders'

// Globals
import { SiteSettings } from './payload/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Luxehome Admin',
    },
  },
  collections: [
    Users,
    Products,
    Categories,
    Media,
    BlogPosts,
    Orders,
  ],
  globals: [
    SiteSettings,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
})
