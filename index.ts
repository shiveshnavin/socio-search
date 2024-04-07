import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ruruHTML } from "ruru/server";
import path from "path";

var typeDefs = `#graphql
type Query {
  User: User
}

type User {
  name: String
}
`

var resolvers = {
  User: {
  },
  Query: {
  }
}

var app = express()

//see https://docs.expo.dev/more/expo-cli/#hosting-with-sub-paths
//cd client && npx expo export


let ui = express.Router()
ui.all('*',
  express.static(path.join(__dirname, 'client/dist')), (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
  })
app.use('/ui', ui)
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