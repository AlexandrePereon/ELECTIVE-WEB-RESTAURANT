import express from 'express';
import restaurantController from '../controllers/restaurantController.js';

const restaurantRouter = express.Router();

/**
 * @swagger
 * /restaurant/create:
 *   post:
 *     summary: Create a new restaurant
 *     description: This endpoint creates a new restaurant with the provided name, image, description, and creator id. It checks if a restaurant with the same name already exists to avoid duplicates. Upon successful creation, it returns the unique identifier of the new restaurant.
 *     tags: [Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *               - description
 *               - createur_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Restaurant ABC'
 *               image:
 *                 type: string
 *                 example: 'https://example.com/restaurant.jpg'
 *               description:
 *                 type: string
 *                 example: 'This is a fantastic restaurant.'
 *               createur_id:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Successfully created the new restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the newly created restaurant.
 *                   example: '507f1f77bcf86cd799439011'
 *       400:
 *         description: Bad Request - Restaurant with the same name already exists, or other validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Restaurant with the same name already exists'
 */
restaurantRouter.post('/create', restaurantController.create);

export default restaurantRouter;
