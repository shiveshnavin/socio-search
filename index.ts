import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from "path";
import cors from "cors";
import fs from 'fs'
import { SQLiteDB } from "multi-db-orm";
import Linkedin from './modules/linkedin'
import Instagram from "./modules/instagram";
import { QuerySearchArgs, SearchParams, User } from "./gen/model";
import { matchBatchFace } from "./face-match";
import { GraphQLError } from "graphql";

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
    platform: (parent) => {
      if (parent.igUserName || parent.igUserId) {
        return "instagram"
      }
      return "linkedin"
    },

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
        return parent.profile_pic_url || parent.image || parent.thumbnail || Instagram.getUser(parent.igUserName, parent).then(u => u.profile_pic_url_hd || u.image)
      }
      if (parent.linkedinUserName)
        return parent.image || parent.thumbnail
    },
    image: (parent, args, ctx, info) => {
      if (parent.image) {
        return parent.image
      }
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
    search: async (parent, args: QuerySearchArgs, ctx, info) => {
      let response: User[] = []
      if (args.linkedin) {
        let li = args.linkedin
        response = await Linkedin.search(li.text, li.city, args.skip)
      }
      if (args.instagram) {
        let li = args.instagram
        response = await Instagram.search(li.text)
      }

      let requestedFeilds = info.fieldNodes[0].selectionSet.selections.map(selection => selection.name.value)
      try {
        if (requestedFeilds.includes("hdImage")) {
          if (args.instagram) {
            let usernames = response.map(u => u.igUserName).join(",")
            response = await Instagram.getUsersInBatch(usernames)
          }
        }
      } catch (e) {
        console.log("Tolerable error while doing full load", e)
      }
      try {
        if (requestedFeilds.includes("faceScore")) {
          let originalFaceUrl = args.instagram?.realFaceUrl
          if (!originalFaceUrl)
            throw new GraphQLError("Must provide realFaceUrl for faceScore")
          let urls = response.map(u => (u.hdImage || u.image))
          let matchresults = await matchBatchFace(originalFaceUrl, 0.7, urls)
          for (let i = 0; i < matchresults.length; i++) {
            response[i].faceScore = matchresults[i].confidence
          }
          response = response.sort((a, b) => {
            return a.faceScore - b.faceScore
          })
        }
      } catch (e) {
        console.log("Tolerable error while doing face match", e)
      }
      return response
    }
  }
}

const appoloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()
app.options("*", cors())

const port = process.env.PORT || 8086
appoloServer.start().then(() => {
  app.use(express.static('./client/dist'))
  app.use('/graph', express.json(), expressMiddleware(appoloServer, {
    context: async ({ req, res }) => ({
      req,
      res
    }),
  }));
  app.use("*",
    express.static(path.join(__dirname, 'client/dist')),
    (req, res) => {
      res.sendFile(path.join(__dirname, 'client/dist/index.html'))
    })
  app.listen(port)
  console.log(`Running a GraphQL API server at http://localhost:${port}/graph`)
})
