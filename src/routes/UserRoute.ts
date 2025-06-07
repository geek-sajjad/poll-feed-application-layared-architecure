import { Router } from 'express';
import { z } from 'zod';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../middleware';

const router = Router();
const userController = new UserController();

// Zod schemas
const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email').optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .optional(),
    firstName: z.string().min(1, 'First name cannot be empty').optional(),
    lastName: z.string().min(1, 'Last name cannot be empty').optional(),
  }),
  params: z.object({
    id: z
      .string()
      .uuid('Invalid user ID format')
      .or(z.string().min(1, 'User ID is required')),
  }),
});

const getUserByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .uuid('Invalid user ID format')
      .or(z.string().min(1, 'User ID is required')),
  }),
});

// Routes
router.post(
  '/',
  validateRequest(createUserSchema),
  userController.createUser.bind(userController)
);

router.get('/', userController.getAllUsers.bind(userController));

router.get(
  '/:id',
  validateRequest(getUserByIdSchema),
  userController.getUserById.bind(userController)
);

router.put(
  '/:id',
  validateRequest(updateUserSchema),
  userController.updateUser.bind(userController)
);

router.delete(
  '/:id',
  validateRequest(getUserByIdSchema),
  userController.deleteUser.bind(userController)
);

export { router as userRoutes };
