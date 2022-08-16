// typegraphql
import "reflect-metadata";
import { resolvers } from "@generated/type-graphql"
import { buildSchema } from 'type-graphql'
// Prisma
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// appllo
const { ApolloServer } = require('apollo-server')


async function main() {
    const schema = await buildSchema({
        resolvers,
        validate: false,
    });

    const server = new ApolloServer({
        schema,
        context: () => ({ prisma }),
    });
    
    server.listen().then(() => {
        console.log(`🚀  Server ready at http://localhost:4000/`);
    });
    
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })