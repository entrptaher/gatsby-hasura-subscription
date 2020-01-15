import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from "apollo-link-ws"
import ws from "ws"
import { ApolloLink } from "apollo-link"
import { HttpLink } from "apollo-link-http"
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

/**
 * Websocket
 */

const wsLink = new WebSocketLink({
  uri: "wss://gatsby-test-postgres.herokuapp.com/v1/graphql",
  options: {
    reconnect: true,
  },
  webSocketImpl: typeof window === "undefined" ? ws : null,
})

/**
 * HTTP Link
 */
const httpLink = new HttpLink({
  uri: "https://gatsby-test-postgres.herokuapp.com/v1/graphql",
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

export const client = new ApolloClient({
  link,//: ApolloLink.from([httpLink, wsLink]),
  cache: new InMemoryCache()
})
