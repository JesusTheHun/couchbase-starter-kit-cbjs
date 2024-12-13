# ![RealWorld Example App](/assets/realworld-app-logo.png)

<p align="center">
 <img src="/assets/trpcio-logo.svg" height="80" width="120"/>
 <img src="/assets/cbjs-logo.svg" height="80" width="120"/>
 <img src="/assets/couchbase-logo.svg" height="80" width="120"/>
</p>

> ### tRPC.io, Couchbase and Cbjs codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.


### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with tRPC.io, Couchbase and Cbjs including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the TypeScript community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.


# How it works

## Codebase
Each functional domain is located in `src/domains`.
The domains themselves declare a sub-router and some business logic.

In `src/database` you will find the documents' schemas.  
We've decided to use `arktype` as the runtime validator.

The types inferred from the schemas are used to create the [cluster types](https://cbjs.dev/guide/cluster-types.html) of the application.  
Thanks to the amazing [cbjs](https://cbjs.dev) library, this will provide us with type safety and code completion for our database operations.

## Tests

You will find the tests in `tests/suites`, where each directory contains the tests of each domain.  
The tests use `vitest` ⚡️and tRPC server-side callers to perform the API tests.

A helper, `createAuthenticatedTestContext()`, will create a tRPC caller, register and authenticated a new user, so you don't have to do that for every tests.

If you check the file `src/database/conduitClusterConfig.ts` you will see all the keyspaces and their indexes defined in a single object, along with our Couchbase user.  
When starting the tests, vitest will call `tests/setupTestsOnce.ts` which will use `@cbjsdev/deploy` (see [documentation](https://cbjs.dev/guide/deploy/cluster-config.html)) to update the keyspaces and indexes of your Couchbase container. No manual step required ✨ 

## GitHub Actions

As a bonus, you will find in `.github/workflows/tests.yml` a GitHub Actions workflow to run the tests of your application 🎁.  
It is advised to run this on a large runner, the default ones are tiny tiny and can't run Couchbase consistently.

# Getting started

Create the couchbase container by running `bash ./tests/scripts/createCouchbaseContainer.sh`

```bash
nvm install
corepack enable
pnpm i
```

## Development

Since the project uses project references, you must run the following command to
have TypeScript make incremental builds :

```bash
pnpm run dev # TypeScript incremental builds
```

I suggest you run the test once with `pnpm run test` before starting the server, because it will automatically create all the keyspaces and indexes required by the project.  

If you want to run the server in dev mode, so the server is reloaded when a change
is detected, execute the following command :

```bash
pnpm run server-dev # The server will be reloaded when a change is detected
```

## Production

To build the app and start in production mode, make sure you have all the keyspaces and indexes required, then execute the commands below.
Note that when you run the tests, if will automatically create all the keyspaces and indexes for you, which is convenient if you are trying to execute the production build on your local machine.

```bash
pnpm run build
pnpm run start
```