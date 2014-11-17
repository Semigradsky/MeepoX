# MeepoX

[![Build Status](https://travis-ci.org/Semigradsky/MeepoX.svg?branch=master)](https://travis-ci.org/Semigradsky/MeepoX)
[![Dependencies](https://david-dm.org/Semigradsky/MeepoX.png)](https://david-dm.org/Semigradsky/MeepoX)
[![Issue Stats](http://issuestats.com/github/Semigradsky/MeepoX/badge/pr)](http://issuestats.com/github/Semigradsky/MeepoX)
[![Issue Stats](http://issuestats.com/github/Semigradsky/MeepoX/badge/issue)](http://issuestats.com/github/Semigradsky/MeepoX)
[![](https://reposs.herokuapp.com/?path=Semigradsky/MeepoX)](https://github.com/ruddfawcett/reposs)


Awesome online code editor that lets people collaborate in real-time.

## Running

App development depends on npm, the Node package manager, which is distributed with Node.js. If you haven't done so already, be sure to [download](http://nodejs.org/download/) and run the prebuilt Node.js installer for your platform from the Node.js website. Then, to run app locally, follow these steps:

1. Clone the app [GitHub repo](https://github.com/yandex-shri-minsk-2014/team-2) in your desktop.
2. Use your command line tool to navigate to the cloned app directory and install the modules required to run the app:

   ```
   cd team-2
   npm update
   ```

3. Install [MongoDB](http://www.mongodb.org/downloads) and run server:

   ```
   mongod
   ```
For more information, see [manual](http://docs.mongodb.org/manual/).

4. Install [gulp](http://gulpjs.com/) globally:

   ```
   npm install -g gulp
   ```

5. Run default gulp task:

   ```
   gulp
   ```

The app should start on [http://localhost:3000/](http://localhost:3000/)


## Testing

Just run in console:
   ```
   npm test
   ```


## Reports

Now we have code analysis and test coverage reports.

Just run in console:
   ```
   npm run report
   ```
 See `report` folder.
