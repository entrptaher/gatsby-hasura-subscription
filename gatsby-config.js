module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    {
      resolve: "gatsby-source-graphql", // <- Configure plugin
      options: {
        typeName: "HASURA",
        fieldName: "hasura", // <- fieldName under which schema will be stitched
        url: "https://gatsby-test-postgres.herokuapp.com/v1/graphql",
        refetchInterval: 10, // Refresh every 10 seconds for new data
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
  ],
}
