import { WebSocketLink } from "apollo-link-ws"
import { ApolloClient } from "apollo-boost"
import { InMemoryCache } from "apollo-cache-inmemory"

const link = new WebSocketLink({
  uri: "wss://gatsby-test-postgres.herokuapp.com/v1/graphql",
  options: {
    reconnect: true,
  }
})

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
