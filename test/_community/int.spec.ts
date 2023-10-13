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
    const { serverURL } = await initPayloadTest({ __dirname, init: { local: false } })
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

  it('should not crash when trying to refresh an invalid token', async () => {
    const res = await fetch(`${apiUrl}/users/refresh-token`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `JWT invalid-hooey`,
      },
    })

    expect(res.status).toEqual(403)
  })
})
