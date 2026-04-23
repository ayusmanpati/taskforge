import { Router } from "express";
import {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
} from "../controllers/task.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createTaskValidator,
  createSubtaskValidator,
} from "../validators/index.js";

import {
  verifyJWT,
  requireVerifiedEmail,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";

import {
  AvailableUserRole,
  UserRolesEnum,
  AvailableTaskStatus,
  TaskStatusEnum,
} from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);
// Verifies user.

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getTasks)
  .post(
    requireVerifiedEmail,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    upload.array("attachments"),
    // To upload attachments in the task.
    createTaskValidator(),
    validate,
    createTask,
  );

router
  .route("/:projectId/t/:taskId")
  .get(validateProjectPermission(AvailableUserRole), getTaskById)
  .put(
    requireVerifiedEmail,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createTaskValidator(),
    validate,
    updateTask,
  )
  .delete(
    requireVerifiedEmail,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteTask,
  );

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    requireVerifiedEmail,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createSubtaskValidator(),
    validate,
    createSubTask,
  );

router
  .route("/:projectId/st/:subtaskId")
  .put(
    requireVerifiedEmail,
    validateProjectPermission(AvailableUserRole),
    createSubtaskValidator(),
    validate,
    updateSubTask,
  )
  .delete(
    requireVerifiedEmail,
    validateProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteSubTask,
  );

export default router;
