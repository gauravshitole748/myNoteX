1. Concurrently: 
    - Installed so that we can run both commands (npm start to start frontend server and nodemon index.js to start backend server) simulteneously
    - Document: https://www.npmjs.com/package/concurrently
    - in package.json of where concurrently is installed, add under scripts following commands
        "both": "concurrently npm run start nodemon /backend/index.js"
    - Add backalsh to add exit charater because commands needs to be in double quote only. So cmd becomes:
        "both": "concurrently \"npm run start\" \"nodemon /backend/index.js\""
    - ** for some reason, my npm run both not starting nodeJS server. It still attempting to start nodeJS on 3000. Not sure why?