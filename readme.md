# Wetube Clone project ver.2021

## Routers

`"Grouping URLs"`

1. Global Routers  
   /  
   /join  
   /login  
   /search -> /search?queries

2. Users Routers

   /users
   /users/logout
   /users/:id :: users' profile
   /users/edit  
   /users/delete

3. Video Routers

   /videos -> /videos/:id  
   /videos/upload
   /videos/:id/edit  
   /videos/:id/delete  
   /videos/:id/comments  
   /videos/:id/comments/:id/delete

## Templates

`using "pug"`

- add pug
- views setting (cwd + src/views)
- compress repeats

## Database

`using "mongoDB" and "mongoose"`

## Make Controllers

`with DB, save, call, Promise object etc.`

## User Auth

`create Acc, Form validation, Login, Sessions, Cookie, Social Login etc.`

## Profile for User, Video

`Creates User, Video profile and save at DB, call from DB`

## Webpack

`Convert files with Webpack, Uses SCSS for decoration not CSS`

## Video Player & Video Recorder

`HTML5, Vanilla JS video Player`