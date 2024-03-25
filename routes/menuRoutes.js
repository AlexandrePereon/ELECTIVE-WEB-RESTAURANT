import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import menuController from '../controllers/menuController.js';

const menuRouter = express.Router();
const BASE_URL = '/menus';

/**
 * @swagger
 * /restaurant/menus/create:
 *   post:
 *     summary: Create a new menu
 *     description: This endpoint creates a new menu with the provided name, image, description, and list of articles. It checks if the list of articles contains at least two articles and calculates the total price of the menu as the sum of the prices of all the articles. Upon successful creation, it returns the unique identifier of the new menu.
 *     tags: [Menu]
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
 *               - articles
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Menu ABC'
 *               image:
 *                 type: string
 *                 example: 'https://example.com/menu.jpg'
 *               description:
 *                 type: string
 *                 example: 'This is a fantastic menu.'
 *               articles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['articleId1', 'articleId2']
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
 *                   example: '507f1f77bcf86cd799439011'
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
 *                   example: 'A menu should have at least two articles'
 *     security:
 *       - BearerAuth: []
 */
menuRouter.post(`${BASE_URL}/create`, authMiddleware, menuController.create);

export default menuRouter;
