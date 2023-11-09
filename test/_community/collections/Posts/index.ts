import type { CollectionConfig } from '../../../../packages/payload/src/collections/config/types'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'parentPost',
      type: 'relationship',
      relationTo: postsSlug,
      filterOptions: {},
      access: {
        create: () => true,
        update: () => false,
      },
    },
  ],
}
