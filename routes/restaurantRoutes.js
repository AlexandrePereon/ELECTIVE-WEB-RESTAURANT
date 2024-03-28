import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import restaurantController from '../controllers/restaurantController.js';
import isRestaurantMiddleware from '../middlewares/isRestaurantMiddleware.js';
import hasNotRestaurantMiddleware from '../middlewares/hasNotRestaurantMiddleware.js';
import hasRestaurantMiddleware from '../middlewares/hasRestaurantMiddleware.js';

const restaurantRouter = express.Router();

/**
 * @swagger
 * /restaurant/create:
 *   post:
 *     summary: Create a new restaurant
 *     description: >
 *       This endpoint creates a new restaurant with the provided name, image, description, and creator id.
 *       It checks if a restaurant with the same name already exists to avoid duplicates.
 *       Upon successful creation, it returns the unique identifier of the new restaurant.
 *     tags: [Restaurant]
 *     security:
 *       - BearerAuth: []
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
 *                 example: "Restaurant ABC"
 *               image:
 *                 type: string
 *                 example: "https://example.com/restaurant.jpg"
 *               description:
 *                 type: string
 *                 example: "This is a fantastic restaurant."
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
 *                   example: "507f1f77bcf86cd799439011"
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                   example: "Restaurant created successfully"
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
 *                   example: "Restaurant with the same name already exists"
 */
restaurantRouter.post('/create', authMiddleware, isRestaurantMiddleware, hasNotRestaurantMiddleware, restaurantController.create);

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

/**
 * @swagger
 * /restaurant/{id}:
 *   put:
 *     summary: Update a restaurant by ID
 *     description: This endpoint updates an existing restaurant by its unique identifier.
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the restaurant to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the restaurant.
 *               image:
 *                 type: string
 *                 description: The updated image URL of the restaurant.
 *               description:
 *                 type: string
 *                 description: The updated description of the restaurant.
 *               price:
 *                 type: number
 *                 description: The updated price of the restaurant.
 *     responses:
 *       200:
 *         description: Successfully updated the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the updated restaurant.
 *                 name:
 *                   type: string
 *                   description: The updated name of the restaurant.
 *                 image:
 *                   type: string
 *                   description: The updated image URL of the restaurant.
 *                 description:
 *                   type: string
 *                   description: The updated description of the restaurant.
 *                 price:
 *                   type: number
 *                   description: The updated price of the restaurant.
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Invalid data provided'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Restaurant not found'
 *     security:
 *       - BearerAuth: []
 */
restaurantRouter.put('/:id', authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, restaurantController.update);

/**
 * @swagger
 * /restaurant/creator/{creator_id}:
 *   get:
 *     summary: Get a restaurant by creator ID
 *     description: Retrieve a restaurant based on the creator's ID.
 *     tags: [Restaurant]
 *     parameters:
 *       - in: path
 *         name: creator_id
 *         required: true
 *         description: The unique identifier of the restaurant's creator.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the restaurant
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Restaurant not found'
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Invalid request'
 *     security:
 *       - BearerAuth: []
 */
restaurantRouter.get('/creator/:creator_id', restaurantController.getByCreatorId);

/**
 * @swagger
 * /restaurant/all:
 *   get:
 *     summary: Get all restaurants
 *     description: This endpoint retrieves all restaurants available in the system.
 *     tags: [Restaurant]
 *     responses:
 *       200:
 *         description: Successfully retrieved all restaurants
 *       400:
 *         description: Bad Request - Error while retrieving restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Error while retrieving restaurants'
 *     security:
 *       - BearerAuth: []
 */
restaurantRouter.get('/all', restaurantController.findAllRestaurants);

export default restaurantRouter;
