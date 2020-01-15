# Setup Hasura

https://hasura.io/ => Try it with Heroku
https://heroku.com/deploy?template=https://github.com/hasura/graphql-engine-heroku
https://gatsby-test-postgres.herokuapp.com/console
https://gatsby-test-postgres.herokuapp.com/v1/graphql
https://github.com/hasura/graphql-engine/tree/master/community/sample-apps/gatsby-postgres-graphql

# Add dependencies

```
yarn install
yarn add apollo-link-ws apollo-boost apollo-cache-inmemory @apollo/react-hooks
```

# Add gatsby plugin

```js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-graphql", // <- Configure plugin
      options: {
        typeName: "HASURA",
        fieldName: "hasura", // <- fieldName under which schema will be stitched
        url: process.env.GATSBY_HASURA_GRAPHQL_URL,
        refetchInterval: 10, // Refresh every 10 seconds for new data
      },
    },
  ],
}
```

# Create the client

```js
// src/utils/apollo.js
import { WebSocketLink } from "apollo-link-ws"
import { ApolloClient } from "apollo-boost"
import { InMemoryCache } from "apollo-cache-inmemory"

const link = new WebSocketLink({
  uri: "wss://gatsby-test-postgres.herokuapp.com/v1/graphql",
  options: {
    reconnect: true,
  },
})

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
```

# Create the provider

```js
// gatsby-browser.js
import React from "react"
import { ApolloProvider } from "@apollo/react-hooks"
import { client } from "./src/utils/apollo"

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)
```

# Add subscription to component

```js
// src/components/AuthorList.js
import React from "react"
import { useSubscription } from "@apollo/react-hooks"
import { gql } from "apollo-boost"

const SUB_AUTHORS = gql`
  subscription {
    author {
      id
      name
    }
  }
`

const AuthorList = () => {
  const { data, loading, error } = useSubscription(SUB_AUTHORS, {
    suspend: false,
  })
  if (loading) return "loading..."
  if (error) return `error: ${error.message}`

  return (
    <div>
      {data.author.map((author, index) => (
        <div key={index}>
          <h2>{author.name}</h2>
        </div>
      ))}
    </div>
  )
}

export default AuthorList
```

# Show the component

```js
// src/pages/index.js
import React from "react"
import AuthorList from "../components/AuthorList"

const Index = () => <AuthorList />

export default Index
```
