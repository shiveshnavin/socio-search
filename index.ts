import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ruruHTML } from "ruru/server";
import path from "path";
import axios from "axios";
import fs from 'fs'

var typeDefs = fs.readFileSync('model.graphql').toString()

var resolvers = {
  User: {
    userName: (parent, arg, ctx, info) => {
      return parent.id + '-' + parent.first_name
    }
  },
  Query: {
    users: () =>
      axios.get(`https://reqres.in/api/users`).then(d => d.data.data),
    User: (parent, arg, ctx, info) =>
      axios.get(`https://reqres.in/api/users/${arg.id}`).then(d => d.data.data)
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
  res.end(ruruHTML({ endpoint: "/graph" }))
})
let appoloServer = new ApolloServer({
  typeDefs,
  resolvers,
})
appoloServer.start().then(() => {
  app.use('/graph', express.json(), expressMiddleware(appoloServer));
  app.listen(4000)
  console.log("Running a GraphQL API server at http://localhost:4000/graphql")
})