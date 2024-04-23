# Basic quick start app

The basic quick start app comes with:

1. ExpressJS
2. Typescript
3. React Native using expo
4. GraphQL
5. Multi-DB-ORM

## Hosting Client
By default the UI is hosted at `/ui` and the graph studio at `/` and `/graph` . If you want to host the UI at homepage instead then 
- remove the basePath from client/app.json  
```
    "experiments": {
      "baseUrl": "/ui"
    },
```
- remove the basepath from _layout.tsx
```
  let basePath = ''
  if (__DEV__) {
    basePath = ''
  }
```
