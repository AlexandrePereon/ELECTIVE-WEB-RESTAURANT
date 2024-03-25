import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import restaurantMiddleware from '../middlewares/restaurantMiddleware.js';
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
 *     security:
 *       - BearerAuth: []
 */
restaurantRouter.post('/create', authMiddleware, restaurantMiddleware, restaurantController.create);

/**
 * @swagger
 * /restaurant/{restaurant_id}/articles:
 *   get:
 *     summary: Get all articles of a restaurant
 *     description: This endpoint retrieves all articles belonging to a specific restaurant.
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         description: The unique identifier of the restaurant.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved all articles of the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: No articles found for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'No articles found for the restaurant'
 *     security:
 *       - BearerAuth: []
 */
restaurantRouter.get('/:restaurant_id/articles', restaurantController.findAllArticles);

/**
 * @swagger
 * /restaurant/{restaurant_id}/menus:
 *   get:
 *     summary: Get all menus of a restaurant
 *     description: This endpoint retrieves all menus belonging to a specific restaurant.
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         description: The unique identifier of the restaurant.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved all menus of the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: No menus found for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'No menus found for the restaurant'
 *     security:
 *       - BearerAuth: []
 */
restaurantRouter.get('/:restaurant_id/menus', restaurantController.findAllMenus);

export default restaurantRouter;
