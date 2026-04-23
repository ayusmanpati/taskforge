// README FILE WHICH WAS index.js EARLIER. SO IT HAS SAME STUFFS AS index.js.
// CHANGED TO readme.js due to large number of theoretical parts here important to understand backend.
// The real index.js is cleaner without so many comments

/*
import dotenv from "dotenv";
Should always be at the top
dotenv.config({
  // Path of the .env file
  path: "./.env",
});
let myusername = process.env.myusername;
let db = process.env.database;
console.log(`[confidential username value is ${myusername}]`);
console.log(`[database used is ${db}]`);
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// console.log("Hello Project -- Start of Backend Project !");
// console.log("This aims to make a Project Management System.");

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
In Node.js development, package.json is a crucial file that serves as the heart of any Node.js project.
It acts as a manifest that defines the project’s metadata, dependencies, scripts, and more.

The package-lock.json file is an auto-generated file in Node.js projects, created whenever npm modifies the node_modules directory or the package.json file.
Its primary purpose is to ensure consistent dependency installations across different environments by locking the exact versions of all dependencies and sub-dependencies.

package.json contains all the scripts and stuffs assigned....
....when we run npm init to initialize the project.

In package.json, we can change the scripts{} part to assign....
....what it runs when we use "npm run dev" (the script name should be 'dev')

We will use 'import' instead of 'require' -- to set we have to go to package.json....
....and change the "type" from "common.js" (which uses require) to "module" (uses import)

Add prettier to the code using "npm install --save-dev --save-exact prettier"
By far the biggest reason for adopting Prettier is to stop all the on-going debates over styles.
It is generally accepted that having a common style guide is valuable for a project and team but getting there is a very painful and unrewarding process.
Adding prettier solves this problem by implementing a common ground for (automatic) formatting.
"npx prettier . --write" will format all files with prettier. "npx prettier . --check" to check all files.
To change prettier's config for the project --> '.prettierrc' (lets the editor know that prettier is being used while also manually set values of formatting)....
....and '.prettierignore' (ignores files in this list).

We use "nodemon" or "node --watch"(newly added feature in node itself) to automattically restart....
....the node application when file changes in the directory are detected.
To install nodemon use "npm install --save-dev nodemon".
Now to run we will use 1/ ["dev": "nodemon index.js"] in development stage....
....& use 2/ ["start": "node index.js"] on the production server (because it is node dependency).
So both scripts should be added in "package.json".
npm run dev : keeps on restarting the server as soon as any changes is noticed (Hot Refresh or Hot Reloading)

"npm i dotenv" to install dot-env. ENV - Environment Variables
Environment variables are essential for configuring applications, especially when dealing with sensitive data like API keys, database credentials, and other configuration settings.
In Node.js, we can manage these variables using .env files and the dotenv package.
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Then process.env can be used to access the confidential info.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
We will be using mongoDB for database and Express.js for routing library.
MongoDB directly isn't interacted but is interacted via an ODM = Object Document Mapping (Mongoose) or an ORM = Object Relational Mapping
ODM are used for NoSQL Databases (like MongoDB) whereas ORM are used for SQL Databases (like PostgreSQL)

Express.js is a unopinionated, minimal and flexible web application framework for Node.js.
It is used to quickly build scalable, maintainable, and high-performance server-side applications in Node.js.
"npm i express" to install it.

Express.js is used to simplify backend development in Node.js. 
Although it is possible to build servers using the native HTTP module, 
that approach requires manually handling routing, request parsing, 
responses, middleware logic, and error handling, which increases code 
complexity and development time.

Express provides a clean and minimal framework that reduces boilerplate 
code by offering built-in features like easy routing, middleware support, 
JSON parsing, and simplified request/response handling. It also has a 
large ecosystem of plugins for tasks such as authentication, security, 
file uploads, and CORS.

In short, Express does not replace Node.js but sits on top of it to make 
server-side development faster, more organized, scalable, and easier to 
maintain, especially for larger web applications and APIs.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
import dotenv from "dotenv";
import app from "./app.js";
Imports express and the app made using express()
*/

/*
dotenv.config({
  path: "./.env",
});
*/

// const port = process.env.PORT || 3000;
// Port imported from .env file

/*
THIS IS ROUTING
Used to send the information
req --> from client
res --> from server
*/

/* 
app.get("/", (req, res) => {
  res.send("Hello World! By Ayusman Pati :0");
});
Statements like above and anything related to express is written in app.js
index.js only defines port & listens and is the entrypoint

app.get() means: Handle a GET request.
"/" is the home page route.
When someone visits: http://localhost:3000/
The server sends: Hello World! By Ayusman Pati :0
*/

/*
Example -->
app.get("/instagram", (req, res) => {
  res.send("This is an instagram page, mate :D");
});
We are using res.send that sends HTTP response.
*/

/*
app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}/`);
  console.log(
    `App is also listening on port http://localhost:${port}/instagram`,
  );
});
It tells Node.js to listen for incoming requests on the specified port.
The function inside runs once the server starts.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// An API(Application Programming Interface) is a set of protocols that enable different software components to communicate and transfer data.
// This is exactly how APIs work in software --> the API takes a request, sends it to the server, retrieves the data, and returns the response.

/* 
REST API (type of API architecture) is a simple, flexible API architecture that uses HTTP methods (GET, POST, PUT, DELETE) for communication. Data Format: JSON, XML.
REST = Representational State Transfer
Types of API requests (HTTP methods):-
    Method     Purpose        Example
    ------  -------------  --------------
    GET     Get data       View posts
    POST    Send new data  Create account
    PUT     Update data    Edit profile
    DELETE  Remove data    Delete post
*/

// But browsers mainly support GET requests only. You cannot easily send a POST request from a browser. This is where Postman helps.

/* 
Postman is a tool used to test APIs.
It acts like a client that can: Send requests, View responses, Test APIs without building a frontend.
Any testing will be done using Postman.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* 
A lot of frontend error are faced due to CORS(Cross-Origin Resource Sharing).

CORS is a browser security feature that controls which websites
(frontends) are allowed to communicate with a backend server.

An "origin" is made up of:
protocol + domain + port
Example:
http://localhost:3000 and http://localhost:5000
are considered different origins because the port is different.

When a frontend tries to send a request to a backend on a
different origin, it is called a cross-origin request.
By default, browsers block these requests for security reasons.

This prevents malicious websites from secretly sending requests
to other sites where the user is logged in (like banking or email).

If the backend does not allow the request, the browser shows a
CORS error, even though the server might be working correctly.
Tools like Postman do not show CORS errors because they are not browsers.

To fix this, the backend must explicitly allow certain origins
using CORS settings. In Express, this is usually done using
the "cors" package. --> app.js 
First install using "npm install cors"

Example:
app.use(cors()); // allows all origins

or

app.use(cors({
  origin: "http://localhost:3000"
})); // allows only this frontend
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* 
Server either sends Response or Error.

All responses should have -->
1/ status code
2/ data
3/ message

While erros should have -->
1/ status code
2/ data
3/ message
4/ errors
5/ stack (error stack - not compulsorily available)

The errors are already managed by node ecosystem using 'Error' class. 
The response are not available so we have to design it ourselves. --> api-response.js (inside utils)
Though, we have to config the 'Error' class. --> api-error.js (inside utils only)
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
A file is maintained (constants.js) (inside utils) to store all the constants/fixed values used across the project 
This way the constants can be referred everwhere by defining once without repeating it everwhere.
Change in one place --> Updates everywhere.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
ORM is an additional layer between server and db.
Mongoose is an ORM (Object Relational Mapper) which helps to talk with the db in a much simpler way.
"Let's face it, writing MongoDB validation, casting and business logic boilerplate is a drag. That's why we wrote Mongoose."
Install using 'npm install mongoose'.
And use it to connect to the MongoDB. --> index.js (inside db)

Then we will work around to MongoDB URI in .env file and then try to connect it.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
Healtcheck APIs are used to constantly monitor the system health status -- if its working properly or not.
Many servers/apps like AWS, GCP needs to constantly check if the application is running in a healthy status or not.
This is where Healthcheck APIs are used.
Healthcheck API controller (logic is stored) is inside controller folder.
Healthcheck API route (path is stored) is inside routes folder.

Inside controllers (folder inside src), logic functions are stored.
Similarly in routes, paths are stored.
All of these logic of controllers are imported into routes.
All of these routes are imported in app.js (inside src) so that they can serve on any endpoint.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
Structures of the data (which are stored in the database, eg. user login & register data) are stored in 'model' folder. 
--> user.models.js

Schema is the framework/structure of the data stored in db.
Mongoose schema helps us to write methods and hooks.

While saving, we do things just before saving of the data as a Schema is called Prehook and anything after saving is called Posthook.
Hashing(One way encryption which cannot be decoded) the password to the prehook before saving is considered.
BCrypt is a library used for this. --> npm install bcrypt
Done in user.models.js (models)
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
JWT - JSON Web Token
JWT is a secure way to send user authentication data between client and server as a signed token.
It is used to verify users and prevent unauthorized access.
A JWT is JSON data secured with a cryptographic signature.

A JWT consists of three parts, separated by dots (.) :- xxxxx.yyyy.zzzzzzz
1/ Header: Contains metadata about the token, such as the algorithm used for signing.
2/ Payload: Stores the claims, i.e., data being transmitted.
3/ Signature: Ensures the token's integrity and authenticity. (Used to verify the token is not modified)
All the parts are Base64Url Encoded.

Steps:- 
-> Login Request: The user logs in through the client application (e.g., web or mobile app) by sending their credentials (username & password) to the server.
-> Server Generates JWT: If the credentials are correct, the server generates a JWT token using a secret key.
-> Returns JWT: The server sends the JWT back to the client application.
-> Further Requests with JWT: For any subsequent requests, the client sends the JWT along with the request. The server verifies the JWT before granting access to protected resources.

Whenever the user wants to access a protected route or resource, the user agent should send the JWT, typically in the Authorization header using the Bearer schema.
Authorization: Bearer <token>
Can be tested in Postman [Authorization (key): Bearer sddysfbuyegwbyfywe (value).

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Token is a long String and are of 2 types -- with data (JWT) & without data.

1/ Without data token are used majorly for things that are done once. (Ex. Matching token saved on db and token sent to user's email for verification.)
Can also be used while password reset. They are temporary tokens.

2/ With data token (JWT) has some information stored and encrypted. These are of 2 types --> 
Access Token -- (for a shorter limited time ex. 5mins) 
Refresh Token -- (for a longer limited time ex. 1day)
Access Tokens and Refresh Tokens are also JWT Tokens.

We create a access & refresh token on server side.

Access token is used as a key which the client uses to be a valid user and use the application - Authenticated User (as long as the client has the access token) 
Access tokens are stateless i.e. they are not stored in db.

Access tokens are short lived so they may expire -- in that case user gets logged out and user has to login again.
If token is expired the server sends a special response like 401, 402, etc.
With the special response received, user knows that access token is timed out -- so client-side sends message to the server....
....with the Refresh Token. 
Server checks its database and if refresh token matches -- then it issues a fresh access token to the client.
Now the communication continues based on the new acess token.

Refresh tokens are stored on the db unlike access token.

To generate access and refresh token --> jsonwebtoken
Install it using npm install jsonwebtoken.
Managed and used in user.models.js (in models)

To generate "Without Data Tokens", crypto.js module is used (In-buit module of Nodejs).
Generation code in user.module.js (in models)
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
Steps of Registration --> 
  Take some data
  Validate the data
  Check in DB if user already exists
  SAVED the new user.
  Verify the user using EMAIL.
For this email --> Regular token is generated and this token must be sent to user's email.
For generating and sending the email, we use 'mailgen' library. --> npm i mailgen
Code in mail.js (inside utils)

Sending the email has two types --> 1/"development email" (Mailtrap) & 2/"production email" (AWS SES, Brevo)
For testing, (dev mail) we use Mailtrap, where we ourselves recieve our mail.
For this, we have to install nodemailer package. --> npm install nodemailer
Mailtrap --> Sandboxes --> freeapi (steps for email credentials to be stored in .env)

Mailgen → to generate beautiful email templates
Nodemailer → to actually send the email by establishing connection
Mailtrap → for testing emails safely

Code in mail.js (inside utils)
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
Register a new user --> auth.controllers.js (inside controllers)
Route for the same --> auth.routes.js (inside routes)

Steps of Registration --> 
  Take some data
  Validate the data
  Check in DB if user already exists
  SAVED the new user (access token, refresh token, general token, sendmail)
  Verify the user using EMAIL.
  Send response back to the request.
Thats it!

Can be tested in Postman.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
Validation --> Implementation of requirements of valid data (valid password (ex. minimum 8 characters), valid email, etc.)
"Making sure the data sent by the client follows your rules before processing it."

Some data need validation.
For this lot of tools/frameworks can be used like Zod, Yup or the most popular --> express-validator
It check the values and gives error according to the validation rule for datas.

Middleware --> A function that runs between request and response.
We need to have a middleware to carry out a task in between the path from one point to other.
Middleware can be token checker, express-validator code, etc.

For express-validators there are 3 files to work on :-
1/ middleware (calculate all the errors and send / checks if there are errors.)
2/ validations (the rules of validations)
3/ routes (implementation in the route)

File         Responsibility            
-----------  ------------------------- 
validations  Defines rules             
middleware   Handles validation result 
routes       Connects everything       

Both middleware and validations are connected to routes.

For middleware, first install "npm i express-validator".
Implemented in --> validator.middleware.js (inside middlewares)

For validations, we will target the body as it contains most data.
Implemented in --> index.js (inside validators)

For routes,
Implemented in --> auth.routes.js (inside routes)
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
For login,
1/ take data from user
2/ valdate
3/ if user exists (in middlewares & routes)
4/ if password is correct
5/ generate all the tokens
6/ send tokens in cookies (in mobile apps, no cookies are involved so tokens are sent directly)

In web, tokens are sent in cookies. 
But expressjs don't have direct cookies access.
So, in order to access the cookies (cookies & express can talk(r/w) to each other), "cookie-parser" package is used.
--> npm install cookie-parser
--> Implemented in app.js [app.use(cookieParser())]

login logic is implemented in auth.controller.js (inside controllers).
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
A middleware is introduced which checks the accessToken whenever client communicates(sends request) with the server.
This middleware checks it before req reaches the server.
--> auth.middleware

The access token is sent to the user via cookie or bearer(header - authorization) [used in case of mobile apps as they don't support cookies].
The server sends the access token to the user after login.
Then the client sends the access token back to the server via cookies (automatically) or Authorization header (Bearer token) on every protected request.

Implemented in auth.middleware.js (inside middlewares).

1/ Intercept the request in the middleware.
2/ Access the access token.
3/ Decode the information out.
4/ Inject the information in the request.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
For logout,
--> Client sends req to server -> accessToken will be sent via the cookie -> The auth.middlware will check -> Response will be sent by server.
--> auth.controller.js (inside controllers)

Client clicks logout →
Request goes through verifyJWT →
req.user available →
Refresh token removed from DB →
Cookies cleared →
Response sent →
User fully logged out.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
Authentication routes (checkin PRD.md) are implemented in:-
1/ getCurrentUser -> auth.controllers.js
2/ verify-email -> auth.controller.js
3/ resend-email-verification -> auth.controller.js
4/ refresh-token (refreshes access token) -> auth.controller.js 

Password related auth routes -->
5/ forgotPassword -> auth.controller.js : forgot password -> give email -> submit -> check user in db or not -> email sent to the user -> reset password
6/ resetPassword -> auth.controller.js
7/ changePassword -> auth.controller.js

Routes & validators of each are handled inside "auth.routes.js" (inside routes) & index.js (inside validators) respectively in a similar manner.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
The schema design (db design) can be referred from database-design.png (inside src).
Made accordingly with the PRD.md document.
The designs are implemented in models folder.

NOTE --> To read about DB aggregation pipelining, refer to /Notes/mongodb-aggregation-pipelining.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
All project related controllers (as specified in PRD.md) are being dealt with in "project.controllers.js" (inside controllers).
Users are already logged in so no authentication and verification to be done.
Also we will have verified JWT so can access 'req.user'.

Role based access perms -->
It will be written in middleware. This middleware will act as a checker.
--> Implemented in validateProjectPermission() (inside middlewares/auth.middleware.js)
Validator for this is implemented in index.js (inside validators). Only required for creating project and adding member to project.

Routes for projects is implemented in "project.routes.js".
Any operation to be done on the project needs to be done by a verified user. So 'verifyJWT' should be implemented.
'app.js' is also used to add prefix for the routes.
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*
All task related controllers (as specified in PRD.md) are being dealt with in "task.controllers.js".

Attachments are allowed in tasks. Attachments can be images, pdfs, csv, etc.
Attachments can be handled by using a package "multer" --> npm install multer.
Multer is the middleware that gives the ability to upload the file or files (array of attachments) and sends to Express as "req.files".
The middleware is implemented in "multer.middleware.js" (inside middlewares)

Routing for tasks controller done in "task.routes.js".
*/

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
