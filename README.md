# XSCAN

## Define prisma database schema

```bash
vi ./prisma/schema.prisma
```

## Prisma migrate 

Whenever you make changes to your Prisma, you manually need to invoke prisma migrate.

```bash
npx prisma migrate dev
```

This command will generate migration file, do migrating and generate type graphql artifacts.

    You can generate type graphql artifacts with this command:

    ```bash
    npx prisma generate
    ```

## Run Apollo Server

```bash
npx ts-node index.ts
```