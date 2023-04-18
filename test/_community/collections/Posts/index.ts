import type { CollectionConfig } from '../../../../src/collections/config/types';
import { postCategoriesSlug } from '../PostCategories';

export const postsSlug = 'posts';

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      type: 'relationship',
      relationTo: postCategoriesSlug,
      name: 'category',
    },
  ],
};
