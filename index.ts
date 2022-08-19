// typegraphql
import "reflect-metadata";
import { resolvers } from "@generated/type-graphql";
import { buildSchema } from "type-graphql";
// Prisma
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// appllo
const { ApolloServer } = require("apollo-server");

// // subquery
// graphql schema => sequelize schema => database

// // DATA
// // 1. prisma: orm
//    2. typegraphql: define graphql schema
//    3. typegraphql-prisma: schema mapping
//    4. ApolloServer
// // WORKER
//    job queue

// prisma schema => graphql schema

async function main() {
      const schema = await buildSchema({
            resolvers,
            validate: false,
      });

      const server = new ApolloServer({
            schema,
            introspection: true,
            context: () => ({ prisma }),
      });

      server.listen().then(() => {
            console.log(`🚀  Server ready at http://localhost:4000/`);
      });
}

main()
      .then(async () => {
            await prisma.$disconnect();
      })
      .catch(async (e) => {
            console.error(e);
            await prisma.$disconnect();
            process.exit(1);
      });
