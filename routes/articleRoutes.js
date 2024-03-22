import express from 'express';
import userMiddleware from '../middlewares/userMiddleware.js';
import articleController from '../controllers/articleController.js';

const articleRouter = express.Router();
const BASE_URL = '/article';
// GET /article/:id
/**
 * @swagger
 * /restaurant/article/{id}:
 *   get:
 *     summary: Get an article by ID
 *     description: This endpoint retrieves an article by its unique identifier.
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the article.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
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
articleRouter.get(`${BASE_URL}/:id`, articleController.read);

// DELETE /article/:id
/**
 * @swagger
 * /restaurant/article/{id}:
 *   delete:
 *     summary: Delete an article by ID
 *     description: This endpoint deletes an article by its unique identifier.
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
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
articleRouter.delete(`${BASE_URL}/:id`, articleController.delete);

// POST /article/create
/**
 * @swagger
 * /restaurant/article/create:
 *   post:
 *     summary: Create a new article
 *     description: |
 *       This endpoint creates a new article with the provided name, image, description, price, and associated restaurant ID.
 *       It checks if the provided restaurant ID exists before creating the article to ensure data integrity.
 *     tags: [Article]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Article XYZ'
 *               image:
 *                 type: string
 *                 example: 'https://example.com/article.jpg'
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
 *       400:
 *         description: Bad Request - Invalid request body or missing restaurant ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Restaurant ID is required'
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
 *       409:
 *         description: Conflict - Article with the same name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'This article already exists'
 *     security:
 *       - BearerAuth: []
 */
articleRouter.post(`${BASE_URL}/create`, userMiddleware, articleController.create);

export default articleRouter;
