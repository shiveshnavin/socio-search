import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from "path";
import axios from "axios";
import fs from 'fs'
import { SQLiteDB } from "multi-db-orm";

const db = new SQLiteDB()
db.create("users_comments", {
  id: 'string',
  comments: `[]`
}).then(() => console.log('DB Initialized'))

const typeDefs = fs.readFileSync('model.graphql').toString()
const resolvers = {
  User: {
    async comments(parent) {
      let user = await db.getOne("users_comments", { id: parent.id })
      return user?.comments ? JSON.parse(user.comments) : []
    },
    userName: (parent, arg, ctx, info) => {
      return parent.id + '-' + parent.first_name
    }
  },
  Mutation: {
    async commentOnUser(parent, { id, comment }, context, info) {
      let userComments = await db.getOne("users_comments", { id: id })
      let isInsert = false
      if (!userComments) {
        isInsert = true
        userComments = {
          id: id,
          comments: '[]'
        }
      }
      userComments.comments = JSON.parse(userComments.comments)
      userComments.comments.push(comment)
      userComments.comments = JSON.stringify(userComments.comments)
      if (isInsert)
        await db.insert("users_comments", userComments)
      else
        await db.update("users_comments", { id: id }, userComments)
      return {
        id,
        comments: JSON.parse(userComments.comments)
      }
    }
  },
  Query: {
    users: () =>
      axios.get(`https://reqres.in/api/users?per_page=12`).then(d => d.data.data),
    User: (parent, arg, ctx, info) =>
      axios.get(`https://reqres.in/api/users/${arg.id}`).then(d => d.data.data)
  }
}
const appoloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()


//see https://docs.expo.dev/more/expo-cli/#hosting-with-sub-paths
//cd client && npx expo export
const ui = express.Router()
ui.all('*',
  express.static(path.join(__dirname, 'client/dist')), (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
  })
app.use('/ui', ui)

// Remove in production
app.get("/", (_req, res) => {
  res.redirect('/graph')
})

const port = process.env.PORT || 4000
appoloServer.start().then(() => {
  app.use('/graph', express.json(), expressMiddleware(appoloServer));
  app.listen(port)
  console.log(`Running a GraphQL API server at http://localhost:${port}/graph`)
})