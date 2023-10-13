import path from 'path'

import type { CollectionConfig } from '../../packages/payload/src/collections/config/types'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults'
import { devUser } from '../credentials'

export interface Relation {
  id: string
  name: string
}

const openAccess = {
  create: () => true,
  read: () => true,
  update: () => true,
  delete: () => true,
}

const collectionWithName = (
  collectionSlug: string,
  config: Partial<CollectionConfig> = {},
): CollectionConfig => {
  return {
    slug: collectionSlug,
    access: openAccess,
    fields: [
      {
        name: 'name',
        type: 'text',
      },
    ],
    ...config,
  }
}

export const slug = 'collection1'
export const slug2 = 'collection2'

export default buildConfigWithDefaults({
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'schema.graphql'),
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      access: openAccess,
      fields: [],
    },
    collectionWithName(slug, {
      hooks: {
        beforeChange: [
          async ({ operation, req }) => {
            if (operation === 'create' && req.payloadAPI === 'GraphQL') {
              await new Promise((resolve) => setTimeout(resolve, 100))
              throw new Error('fail')
            }
          },
        ],
      },
    }),
    collectionWithName(slug2, {
      hooks: {
        beforeChange: [
          async ({ operation, req }) => {
            console.log('operation', req.transactionID)
            if (operation === 'create' && req.payloadAPI === 'GraphQL') {
              // wait for the other collection to fail
              await new Promise((resolve) => setTimeout(resolve, 200))
            }
          },
        ],
      },
    }),
  ],
  onInit: async (payload) => {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: slug,
      data: {
        name: 'text',
      },
    })
    await payload.create({
      collection: slug2,
      data: {
        name: 'text',
      },
    })
  },
})
