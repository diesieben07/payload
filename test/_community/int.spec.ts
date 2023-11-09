import type { PayloadRequest } from '../../packages/payload/src/express/types'

import payload from '../../packages/payload/src'
import { devUser } from '../credentials'
import { initPayloadTest } from '../helpers/configHelpers'
import { postsSlug } from './collections/Posts'

require('isomorphic-fetch')

let apiUrl
let jwt

const headers = {
  'Content-Type': 'application/json',
}
const { email, password } = devUser
describe('_Community Tests', () => {
  // --__--__--__--__--__--__--__--__--__
  // Boilerplate test setup/teardown
  // --__--__--__--__--__--__--__--__--__
  beforeAll(async () => {
    const { serverURL } = await initPayloadTest({
      __dirname,
      init: { local: false, mongoURL: process.env.MONGODB_URL || undefined },
    })
    apiUrl = `${serverURL}/api`

    const response = await fetch(`${apiUrl}/users/login`, {
      body: JSON.stringify({
        email,
        password,
      }),
      headers,
      method: 'post',
    })

    const data = await response.json()
    jwt = data.token
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy(payload)
    }
  })

  // --__--__--__--__--__--__--__--__--__
  // You can run tests against the local API or the REST API
  // use the tests below as a guide
  // --__--__--__--__--__--__--__--__--__

  it('local API example', async () => {
    const req = {} as PayloadRequest
    req.transactionID = await payload.db.beginTransaction?.()
    expect(req.transactionID).toBeTruthy()
    const parentPost = await payload.create({
      req,
      collection: postsSlug,
      data: {
        text: 'ParentPost',
      },
    })
    const childPost = await payload.create({
      req,
      collection: postsSlug,
      data: {
        text: 'ParentPost',
        parentPost: parentPost.id,
      },
    })

    if (req.transactionID) {
      await payload.db.commitTransaction?.(req.transactionID)
    }

    expect(childPost.parentPost.id).toEqual(parentPost.id)
  })
})
