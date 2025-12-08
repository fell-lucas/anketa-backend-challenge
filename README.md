# Anketa Test Project

This monoreo includes all components of the Pollpapa project:

- apps/: The Nest.js APIs
- apps/main: Main monorepo with auth, user, posting, engadgement, etc.
- example: apps/api/crypto: The Nest.js API for Crypto and pyments

Every project have a .env file that you need to create from the .env.example

Don't forget to check each project README.md for more information.

## Getting Started

Use nvm to install the correct version of node.js. See .nvmrc file.

```commandline
nvm install
nvm use
```

### Setup pnpm

```commandline
npm i -g pnpm
```

- after cloning the repo, from the root of this repo, install all dependencies with pnpm

```commandline
pnpm i
```

### Start the DEV server

Start the db first:

```commandline
pnpm db:start
```

Reset the db schema AND data (useful after breaking changes)

```commandline
pnpm dev:env
pnpm db:generate
pnpm db:reset
```

You can start all other services by entering their folder and running `pnpm dev` or run all from a single command from the root

```commandline
pnpm dev
```

After starting the db, navigate to [localhost](http://localhost:8000/)

For extra documentation, see the README.md in each app/api folder

## Tests

To run the tests, cd into apps/core and run `jest`, eg:

```commandline
cd apps/core
jest
jest reports
```

## Build

```commandline
npx turbo run build
```

### Build specific workspace

```commandline
npx turbo run build --filter=@repo/core
```

### Connect to Railway:

```commandline
railway login
railway link
railway shell
```
