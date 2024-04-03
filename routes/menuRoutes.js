import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import menuController from '../controllers/menuController.js';
import isRestaurantMiddleware from '../middlewares/isRestaurantMiddleware.js';
import hasRestaurantMiddleware from '../middlewares/hasRestaurantMiddleware.js';

const menuRouter = express.Router();
const BASE_URL = '/menu';

/**
 * @swagger
 * /restaurant/menu/create:
 *   post:
 *     summary: Create a new menu
 *     description: >
 *       This endpoint creates a new menu with the provided name, image, description,
 *       list of articles, and total price. It checks if the list of articles contains
 *       at least two articles and calculates the total price of the menu as the sum
 *       of the prices of all the articles. Upon successful creation, it returns the
 *       unique identifier of the new menu.
 *     tags: [Menu]
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
 *               - description
 *               - articles
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Menu ABC"
 *               description:
 *                 type: string
 *                 example: "This is a fantastic menu."
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The total price of the menu
 *                 example: 25.99
 *               articles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 example: ["articleId1", "articleId2"]
 *
 *     responses:
 *       200:
 *         description: Successfully created the new menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the newly created menu.
 *                   example: "507f1f77bcf86cd799439011"
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                   example: "Menu created successfully"
 *       400:
 *         description: Bad Request - The list of articles should contain at least two articles, or an article was not found, or other validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: "A menu should have at least two articles"
 */
menuRouter.post(`${BASE_URL}/create`, authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, menuController.create);

/**
 * @swagger
 * /restaurant/menu/{menuId}:
 *   get:
 *     summary: Get a menu by ID
 *     description: This endpoint retrieves a menu by its unique identifier.
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         description: The unique identifier of the menu.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the menu
 *       404:
 *         description: Menu not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Menu not found'
 *     security:
 *       - BearerAuth: []
 */
menuRouter.get(`${BASE_URL}/:menuId`, menuController.read);

/**
 * @swagger
 * /restaurant/menu/{menuId}:
 *   delete:
 *     summary: Delete a menu by ID
 *     description: This endpoint deletes a menu by its unique identifier.
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         description: The unique identifier of the menu.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: 'Menu deleted successfully'
 *       404:
 *         description: Menu not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Menu not found'
 *     security:
 *       - BearerAuth: []
 */
menuRouter.delete(`${BASE_URL}/:menuId`, authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, menuController.delete);

/**
 * @swagger
 * /restaurant/menu/{menuId}:
 *   put:
 *     summary: Update a menu by ID
 *     description: This endpoint updates an existing menu by its unique identifier.
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: menuId
 *         required: true
 *         description: The unique identifier of the menu to update.
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
 *                 description: The updated name of the menu.
 *               description:
 *                 type: string
 *                 description: The updated description of the menu.
 *               price:
 *                 type: number
 *                 description: The updated price of the menu.
 *               articles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of article IDs belonging to the menu.
 *     responses:
 *       200:
 *         description: Successfully updated the menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the updated menu.
 *                 name:
 *                   type: string
 *                   description: The updated name of the menu.
 *                 image:
 *                   type: string
 *                   description: The updated image URL of the menu.
 *                 description:
 *                   type: string
 *                   description: The updated description of the menu.
 *                 price:
 *                   type: number
 *                   description: The updated price of the menu.
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: An array of article IDs belonging to the menu.
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: "You are not authorized to update this menu"
 *       404:
 *         description: Menu not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Menu not found'
 *     security:
 *       - BearerAuth: []
 */
menuRouter.put(`${BASE_URL}/:menuId`, authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, menuController.update);

export default menuRouter;
