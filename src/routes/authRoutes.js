import { Router } from 'express';
import { celebrate } from 'celebrate';
import * as authController from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
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

router.post(
  '/request-reset-email',
  celebrate(requestResetEmailSchema),
  authController.requestResetEmail,
);

router.post(
  '/reset-password',
  celebrate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
