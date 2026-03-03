import { Router } from "express";
// Imported Router package which is in-buit in Express.
import { healthCheck } from "../controllers/healthcheck.controller.js";

const router = Router();
// express.Router() is a factory function so therefore no 'new' keyword.

router.route("/").get(healthCheck);
// route("/") -- Create a route for the path / inside this router and then attach one or more HTTP methods (like GET, POST, PUT, DELETE) to that same path in a chained and organized way.
// '/' means the base path of that router, not the whole app.
// This router doesn’t know its final URL yet. The actual path is decided when it is mounted in the main app. (app.js)

/*
Instead of writing:
router.get("/", handler);
router.post("/", handler);
router.put("/", handler);

Group them using route():
router.route("/")
  .get(handler)
  .post(handler)
  .put(handler);
*/

/*
router.route("/users")
Now, can attach:
.get()     // for GET /users
.post()    // for POST /users
.delete()  // for DELETE /users
*/

/*
Base path (app.use) + Route path (router)
= /api/v1/healthcheck + /
= /api/v1/healthcheck
*/

// get(healthCheck) -- When a GET request comes to this route, run the healthCheck function.
// Similarly, can also use .post, .delete, etc.

export default router;
