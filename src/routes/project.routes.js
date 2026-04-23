import { Router } from "express";
import {
  getProjects,
  getProjectMembers,
  getProjectById,
  createProject,
  updateMemberRole,
  updateProject,
  deleteMember,
  addMembersToProject,
  deleteProject,
} from "../controllers/project.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";
import {
  addMemberToProjectValidator,
  createProjectValidator,
} from "../validators/index.js";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";

import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);
// Means "Run the verifyJWT middleware for every route defined after this line."
// Whatever written after the this line will have verified JWT.

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getProjectById)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteProject);
// "validateProjectPermission(AvailableUserRole)" means eveybody can use this and have the access.
// :projectId means it goes via req.params.
// No colon => No params. The one with ':' is the params.

router
  .route("/:projectId/members")
  .get(validateProjectPermission(AvailableUserRole), getProjectMembers)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMemberToProjectValidator(),
    validate,
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember);
// Here, two params are taken in consideration -> projectId & userId

export default router;
