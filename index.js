var express = require("express")
var ApolloServer = require('@apollo/server').ApolloServer
var expressMiddleware = require('@apollo/server/express4').expressMiddleware;
var { ruruHTML } = require("ruru/server")
var Linkedin = require('./modules/linkedin.js');
const Instagram = require("./modules/instagram.js");

var typeDefs = `#graphql
type Query {
  search(
    linkedin: SearchParams,
    instagram: SearchParams,
    skip: Int
  ): [User]
  linkedinUser(username: String!) : User
  instagramUser(username: String!) : User
}

type User {
  name: String!
  subtitle: String
  summary: String
  image: String
  thumbnail: String
  location: String

  igUserName: String
  igUserId: String
  igBio: String
  igBasic: String

  linkedinDegree: String
  linkedinUrl: String
  linkedinId: String
  linkedinUserName: String
  linkedinEducation: [LinkedinEducation]
}

type LinkedinEducation {
  name: String
  course: String
  link: String
  yearFrom: String
  yearTo: String
}

input SearchParams {
  text: String!
  city: String
}
`

var resolvers = {
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
        return parent.image || parent.thumbnail || Instagram.getUser(parent.igUserName, parent).then(u => u.image)
      }
      if (parent.linkedinUserName)
        return parent.image || parent.thumbnail || Linkedin.linkedinImage(parent.linkedinUserName)
    },
    image: (parent, args, ctx, info) => {
      if (parent.igUserName != undefined) {
        return Instagram.getUser(parent.igUserName, parent).then(u => u.image)
      }
      if (parent.linkedinUserName)
        Linkedin.linkedinImage(parent.linkedinUserName)
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