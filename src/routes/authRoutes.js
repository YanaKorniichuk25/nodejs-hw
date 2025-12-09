import { Router } from 'express';
import { celebrate } from 'celebrate';

import * as authController from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post(
  '/register',
  celebrate(registerUserSchema),
  authController.registerUser,
);
router.post('/login', celebrate(loginUserSchema), authController.loginUser);
router.post('/refresh', authController.refreshUserSession);
router.post('/logout', authController.logoutUser);

export default router;
