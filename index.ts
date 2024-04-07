var express = require("express")
var ApolloServer = require('@apollo/server').ApolloServer
var expressMiddleware = require('@apollo/server/express4').expressMiddleware;
var { ruruHTML } = require("ruru/server")

var typeDefs = `#graphql
type Query {
 
}
`

var resolvers = {
  User: {
  },
  Query: {
  }
}

var app = express()
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})
let appoloServer = new ApolloServer({
  typeDefs,
  resolvers,
})
appoloServer.start().then(() => {
  app.use('/graphql', express.json(), expressMiddleware(appoloServer));
  app.listen(4000)
  console.log("Running a GraphQL API server at http://localhost:4000/graphql")
})