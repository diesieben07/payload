import { GraphQLClient, ClientError } from 'graphql-request'

import payload from '../../packages/payload/src'
import { initPayloadTest } from '../helpers/configHelpers'
import configPromise, { slug, slug2 } from './config'

let client: GraphQLClient

describe('collections-graphql', () => {
  beforeAll(async () => {
    process.env.PAYLOAD_TEST_MONGO_USE_REPL_SET = 'true'
    const { serverURL } = await initPayloadTest({ __dirname, init: { local: false } })
    const config = await configPromise
    const url = `${serverURL}${config.routes.api}${config.routes.graphQL}`
    client = new GraphQLClient(url)
  })

  afterAll(async () => {
    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy(payload)
    }
  })

  describe('GraphQL transactions', () => {
    it('should correctly use transactions for GraphQL mutations issued in parallel', async () => {
      const mutations = `mutation {
        createCollection1(data: {name: "text"}) {
          name
        }
        createCollection2(data: {name: "text"}) {
          name
        }
      }
      `
      try {
        await client.request(mutations)
      } catch (e) {
        // eslint-disable-next-line jest/no-if
        if (e instanceof ClientError && e.message.startsWith('Something went wrong.')) {
          // expected error
        } else {
          throw e
        }
      }
      const existing = await payload.find({
        collection: slug,
      })
      expect(existing.totalDocs).toBe(0)
      const existing2 = await payload.find({
        collection: slug2,
      })
      expect(existing2.totalDocs).toBe(0)
    })
  })
})
