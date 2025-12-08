# Pollpapa Core

This is the main API for the Pollpapa Project

# Commands

Initial setup:
-> Create .env file from the .env.example

$ pnpm i

$ pnpm generate

(in another terminal)
$ pnpm db:start

$ pnpm db:reset

Run dev server:
$ pnpm dev

Run Prisma studio
$ npx prisma studio

Create DB Migrations:
$ npx prisma migrate dev

Reset DB with empty state plus seeds:
$ npx prisma migrate reset

Generate Typescript client:
$ pnpm prisma generate client

# Solve potential errors

- Check that the variables in .env file are up to date and matching example.env
- Delete /dist folder

# Staging deployment

Just merge to staging branch.

Note that the DB is migrated on every deployment, if there are breaking changes, you will need to manually reset the DB by adding "pnpm db:reset" command to the start command in Railway. Note that in production this shouln'd never run since it will reset the db.

# Firebase

You can use Swagger UI or the API by passing an Authorization header: Bearer <token>
You can get a valid token on dev from the `users.fixtures.ts` file, for example: token_user1 (user) or token_admin1 (admin)

## Login with real Firebase

To use the real Firebase to login, sets the the FIREBASE\* env fars set in your local .env file.

Also, to be able to easily login without using the real app, also set the FIREBASE_DEV_WEB_APP_CONFIG in your .env file, you can take it from Firebase Apps Settings page

Then, login with a user in Firebase, do:

$ pnpm firebase:login <your email@pollpapa.com> <password>

The first time you'll call POST /auth/me it it will register the user if not present in Firebase, then you'll be able to login

NB: if the email already exists in Firebase, you need to manually delete from the Firebase console, otherwise the login will fail, and then create it from Firebase admin console again,
and then /auth/me will work. Then run firebase:login again to get the updated token

# Tests

IMPORTANT! ALWAYS RUN THE TESTS BEFORE PUSHING TO GIT.

To run the tests, run:

$ jest post.search.e2e-spec.ts

or just a part and jest will match all tests containing the string:

$ jest likes

or run a single test:

$ jest post.search.e2e-spec.ts -t 'filters posts by search query'
