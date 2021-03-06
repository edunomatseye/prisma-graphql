const { gql } = require('apollo-server');
const { prisma } = require('./db')

const posts = [
    {
      id: 1,
      title: 'Subscribe to GraphQL Weekly for community news ',
      content: 'https://graphqlweekly.com/',
      published: true,
    },
    {
      id: 2,
      title: 'Follow DigitalOcean on Twitter',
      content: 'https://twitter.com/digitalocean',
      published: true,
    },
    {
      id: 3,
      title: 'What is GraphQL?',
      content: 'GraphQL is a query language for APIs',
      published: false,
    },
  ];

const typeDefs = gql`
    type Post {
        content: String
        id: ID!
        published: Boolean!
        title: String!
    }

    type Query {
        feed: [Post!]!
        post(id: ID!): Post
    }

    type Mutation {
        createDraft(content: String, title: String!): Post!
        publish(id: ID): Post
    }
`

const resolvers = {
    Query: {
        post: (parent, args, ctx, info) => {
            ///return posts.find((post) => post.id === Number(args.id))
            return prisma.post.findOne({
                where: {
                    id: Number(args.id)
                }
            })
        },

        feed: (parent, args, ctx, info) => {
           // return posts.filter((post) => post.published)
           return prisma.post.findMany({
               where: {
                   published: true,
               }
           })
        }
    },

    Mutation: {
        createDraft: (parent, args, ctx, info) => {
            // posts.push({
            //     id: posts.length + 1,
            //     title: args.title,
            //     content: args.content,
            //     published: false
            // })
            // return posts[posts.length - 1]
            const {title, content} = args;
            return prisma.post.create({
                data: {
                    title,
                    content,
                }
            })
        },

        publish: (parent, args, ctx, info) => {
            // let postToPublish = posts.filter((post) => post.id === args.id)
            // postToPublish.published = true;
            // return postToPublish

            return prisma.post.update({
                where: { id: Number(args.id) },
                data: { published: true }
            })
        }
    },

    Post: {
        content: p => p.content,
        id: p => p.id,
        published: p => p.published,
        title: p => p.title,
    }
}

module.exports = {
    resolvers,
    typeDefs
}