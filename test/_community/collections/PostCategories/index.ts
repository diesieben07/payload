import type { CollectionConfig } from '../../../../src/collections/config/types';

export const postCategoriesSlug = 'postCategories';

export const PostCategoriesCollection: CollectionConfig = {
  slug: postCategoriesSlug,
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
};
