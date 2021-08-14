# Wetube Clone project ver.2021

## Routers

`"Grouping URLs"`

1. Global Routers

   - /
   - /join
   - /login
   - /search -> /search?queries

2. Users Routers

   - /users
   - /users/logout
   - /users/:id :: users' profile
   - /users/edit
   - /users/delete

3. Video Routers

   - /videos -> /videos/:id
   - /videos/upload
   - /videos/:id/edit
   - /videos/:id/delete
   - /videos/:id/comments
   - /videos/:id/comments/:id/delete

## Templates

`using "pug"`

- add pug
- views setting (cwd + src/views)
- compress repeats

## Database

`using "mongoDB" and "mongoose"`

mongoose - mongoDB의 JS controller

CRUD - Create, Read, Update, Delete

Schema - Model -> link to server/DB

## Make Controllers

`with DB, save, call, Promise object etc.`

## User Auth

`Create Account, Form Validation, Login, Sessions, Cookie, Social Login etc.`

## Profile for User, Video

`Creates User, Video profile and save at DB, call from DB`

## Webpack

`Convert files with Webpack, Uses SCSS for decoration not CSS`

- Webpack의 Loader는 뒤에서부터 실행된다.

## Video Player & Video Recorder

`HTML5, Vanilla JS video Player`

Tag Video inhereits **[HTMLMediaElement](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement)**

##
