var express = require("express")
var ApolloServer = require('@apollo/server').ApolloServer
var expressMiddleware = require('@apollo/server/express4').expressMiddleware;

var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var { ruruHTML } = require("ruru/server")
var Linkedin = require('./modules/linkedin.js')

var typeDefs = `#graphql
type Query {
  search(
    linkedin: LinkedInSearchParams,
    skip: Int
  ): [User]
  linkedinUser(username: String!) : User
}

type User {
  name: String!
  subtitle: String
  summary: String
  image: String
  location: String

  linkedinDegree: String
  linkedinUrl: String
  linkedinId: String
  linkedinEducation: [LinkedinEducation]
}

type LinkedinEducation {
  name: String
  course: String
  link: String
  yearFrom: Int
  yearTo: Int
}

input LinkedInSearchParams {
  text: String!
  city: String
}
`
var schema = buildSchema(typeDefs)

var resolvers = {
  Query: {
    linkedinUser: (parent, args, ctx, info) => Linkedin.linkedinUser(args.username),
    search: (parent, args, ctx, info) => {
      if (args.linkedin) {
        let li = args.linkedin
        return Linkedin.search(li.text, li.city, args.skip)
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

// app.all(
//   "/graphql",
//   createHandler({
//     schema: schema,
//     rootValue: root,
//   })
// )

let appoloServer = new ApolloServer({
  typeDefs,
  resolvers,
})
appoloServer.start().then(() => {
  app.use('/graphql', express.json(), expressMiddleware(appoloServer));
  app.listen(4000)
  console.log("Running a GraphQL API server at http://localhost:4000/graphql")
})