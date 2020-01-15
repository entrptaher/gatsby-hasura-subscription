# Setup Hasura
https://hasura.io/ => Try it with Heroku
https://heroku.com/deploy?template=https://github.com/hasura/graphql-engine-heroku
https://gatsby-test-postgres.herokuapp.com/console
https://gatsby-test-postgres.herokuapp.com/v1/graphql

# Add dependencies
```
yarn install
yarn add apollo-link apollo-link-http apollo-link-ws ws apollo-utilities apollo-client apollo-boost apollo-cache-inmemory @apollo/react-hooks
```

# Create the client
```js
// src/utils/apollo.js
import { split } from "apollo-link"
import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import ws from "ws"

/**
 * HTTP Link
 */
const httpLink = new HttpLink({
  uri: "https://gatsby-test-postgres.herokuapp.com/v1/graphql",
})

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


const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === "OperationDefinition" && operation === "subscription"
  },
  wsLink,
  httpLink
)

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
```

```js
// gatsby-browser.js
import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "./src/utils/apollo";

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);
```

```js
// src/components/AuthorList.js
import React from "react";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const SUB_AUTHORS= gql`
subscription author{
  author{
    id
    name
  }
}
`;

const AuthorList = () => {
  const { data, loading, error } = useSubscription(SUB_AUTHORS, { suspend: false });
  if (loading) return "loading...";
  if (error) return `error: ${error.message}`;

  return (
    <div>
      {data.author.map((author, index) => (
        <div key={index}>
          <h2>{author.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default AuthorList;
```

```js
// src/pages/index.js
import React from "react";

import AddAuthor from "../components/AddAuthor";
import AuthorList from "../components/AuthorList";

const Index = () => (
  <div>
    <h1>My Authors</h1>
    <AddAuthor />
    <AuthorList />
  </div>
);

export default Index;
```