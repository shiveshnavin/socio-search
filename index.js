var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var { ruruHTML } = require("ruru/server")
var Linkedin = require('./modules/linkedin.js')
var schema = buildSchema(`
  type Query {
    search(linkedin: LinkedInSearchParams) : [User]
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
`)

var root = {
  linkedinUser: (obj) => Linkedin.linkedinUser(obj.username),
  search(obj, ref, ctx, info) {
    if (obj.linkedin) {
      let li = obj.linkedin
      return Linkedin.search(li.text, li.city)
    }
    return []
  },
}

var app = express()
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
)

app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")    