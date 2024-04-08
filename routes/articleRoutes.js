import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import articleController from '../controllers/articleController.js';
import isRestaurantMiddleware from '../middlewares/isRestaurantMiddleware.js';
import hasRestaurantMiddleware from '../middlewares/hasRestaurantMiddleware.js';

const articleRouter = express.Router();
const BASE_URL = '/article';
// GET /article/:articleId
/**
 * @swagger
 * /api-restaurant/article/{articleId}:
 *   get:
 *     summary: Get an article by ID
 *     description: This endpoint retrieves an article by its unique identifier.
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: The unique identifier of the article.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the article
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Article not found'
 *     security:
 *       - BearerAuth: []
 */
articleRouter.get(`${BASE_URL}/:articleId`, articleController.read);

// DELETE /article/:articleId
/**
 * @swagger
 * /api-restaurant/article/{articleId}:
 *   delete:
 *     summary: Delete an article by ID
 *     description: This endpoint deletes an article by its unique identifier.
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: The unique identifier of the article.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: 'Article deleted successfully'
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Article not found'
 *     security:
 *       - BearerAuth: []
 */
articleRouter.delete(`${BASE_URL}/:articleId`, authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, articleController.delete);

// POST /article/create
/**
 * @swagger
 * /api-restaurant/article/create:
 *   post:
 *     summary: Create a new article
 *     description: |
 *       This endpoint creates a new article with the provided name, image, description, and price, associated with the authenticated restaurant.
 *       It checks if an article with the same name already exists and ensures data integrity by associating the article with the authenticated restaurant.
 *     tags: [Article]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Article XYZ'
 *               description:
 *                 type: string
 *                 example: 'This is a fantastic article.'
 *               price:
 *                 type: number
 *                 example: 10.99
 *     responses:
 *       200:
 *         description: Successfully created the new article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the newly created article.
 *                   example: '507f1f77bcf86cd799439011'
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                   example: 'Article created successfully'
 *       400:
 *         description: Bad Request - Invalid request body or article with the same name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'This article already exists'
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
 */

articleRouter.post(`${BASE_URL}/create`, authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, articleController.create);

/**
 * @swagger
 * /api-restaurant/article/{articleId}:
 *   put:
 *     summary: Update an article by ID
 *     description: This endpoint updates an existing article by its unique identifier.
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: The unique identifier of the article to update.
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
 *                 description: The updated name of the article.
 *               description:
 *                 type: string
 *                 description: The updated description of the article.
 *               price:
 *                 type: number
 *                 description: The updated price of the article.
 *     responses:
 *       200:
 *         description: Successfully updated the article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the updated article.
 *                 name:
 *                   type: string
 *                   description: The updated name of the article.
 *                 image:
 *                   type: string
 *                   description: The updated image URL of the article.
 *                 description:
 *                   type: string
 *                   description: The updated description of the article.
 *                 price:
 *                   type: number
 *                   description: The updated price of the article.
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
 *                   example: "Vous n'êtes pas autorisé à modifier cet article"
 *       404:
 *         description: Article not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Article not found'
 *     security:
 *       - BearerAuth: []
 */
articleRouter.put(`${BASE_URL}/:articleId`, authMiddleware, isRestaurantMiddleware, hasRestaurantMiddleware, articleController.update);

export default articleRouter;
