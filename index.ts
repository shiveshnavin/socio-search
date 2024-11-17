import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from "path";
import axios from "axios";
import fs from 'fs'
import { SQLiteDB } from "multi-db-orm";
import Linkedin from './modules/linkedin'
import Instagram from "./modules/instagram";

const db = new SQLiteDB()
db.create("users_comments", {
  id: 'string',
  comments: `[]`
}).then(() => console.log('DB Initialized'))

const typeDefs = [
  fs.readFileSync('model.graphql').toString(),
  // ... you other models
]
const resolvers = {
  User: {
    igBio: (parent, args, ctx, info) => {
      if (parent.igUserName)
        return Instagram.getUser(parent.igUserName, parent).then(u => u.igBio)
    },
    igBasic: (parent, args, ctx, info) => {
      if (parent.igUserName)
        return Instagram.getUser(parent.igUserName, parent).then(u => u.igBasic)
    },
    thumbnail: (parent, args, ctx, info) => {
      if (parent.igUserName != undefined) {
        return parent.image || parent.thumbnail || Instagram.getUser(parent.igUserName, parent).then(u => u.profile_pic_url_hd || u.image)
      }
      if (parent.linkedinUserName)
        return parent.image || parent.thumbnail || Linkedin.linkedinImage(parent.linkedinUserName)
    },
    image: (parent, args, ctx, info) => {
      if (parent.igUserName != undefined) {
        return Instagram.getUser(parent.igUserName, parent).then(u => (u.profile_pic_url_hd || u.image))
      }
      if (parent.linkedinUserName)
        return Linkedin.linkedinImage(parent.linkedinUserName)
    },
    linkedinEducation: (parent, args, ctx, info) => {
      if (parent.linkedinId)
        return Linkedin.linkedinEducation(parent.linkedinId)
      else
        return undefined
    }
  },
  Query: {
    instagramUser: (parent, args, ctx, info) => Instagram.getUser(args.username),
    linkedinUser: (parent, args, ctx, info) => Linkedin.linkedinUser(args.username),
    search: (parent, args, ctx, info) => {
      if (args.linkedin) {
        let li = args.linkedin
        return Linkedin.search(li.text, li.city, args.skip)
      }
      if (args.instagram) {
        let li = args.instagram
        return Instagram.search(li.text)
      }
      return []
    }
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
  app.use('/graph', express.json(), expressMiddleware(appoloServer, {
    context: async ({ req, res }) => ({
      req,
      res
    }),
  }));
  app.listen(port)
  console.log(`Running a GraphQL API server at http://localhost:${port}/graph`)
})
