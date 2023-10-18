import type { GlobalConfig } from '../../../../packages/payload/src/globals/config/types'

export const menuSlug = 'menu'

export const MenuGlobal: GlobalConfig = {
  graphQL: false,
  slug: menuSlug,
  fields: [
    {
      name: 'globalText',
      type: 'text',
    },
  ],
}
