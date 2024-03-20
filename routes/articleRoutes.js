import express from 'express';
import articleController from '../controllers/articleController.js';

const articleRouter = express.Router();
const BASE_URL = '/article';

/**
 * @swagger
 * /restaurant/article/create:
 *   post:
 *     summary: Create a new article
 *     description: This endpoint creates a new article with the provided name, image, description, and price. It checks if an article with the same name already exists to avoid duplicates. Upon successful creation, it returns the unique identifier of the new article.
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
 *         description: Bad Request - Article with the same name already exists, or other validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Article with the same name already exists'
 */
articleRouter.post(`${BASE_URL}/create`, articleController.create);

export default articleRouter;
