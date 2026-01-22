const router = require('express').Router()
const ctrl = require('../controllers/goals.controller')
const auth = require('../middleware/auth.middleware')

router.use(auth)

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn React
 *               description:
 *                 type: string
 *                 example: Master React fundamentals and build a portfolio project
 *               category:
 *                 type: string
 *                 example: Learning
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T00:00:00Z
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-06-30T23:59:59Z
 *     responses:
 *       201:
 *         description: Goal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date-time
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 user_id:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', ctrl.create)

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get all goals for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, abandoned]
 *         description: Filter goals by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter goals by priority
 *     responses:
 *       200:
 *         description: List of goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   status:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date-time
 *                   deadline:
 *                     type: string
 *                     format: date-time
 *                   completed_at:
 *                     type: string
 *                     format: date-time
 *                   user_id:
 *                     type: integer
 *                   steps:
 *                     type: array
 *                     items:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', ctrl.list)

/**
 * @swagger
 * /api/goals/{id}:
 *   get:
 *     summary: Get a specific goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date-time
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 completed_at:
 *                   type: string
 *                   format: date-time
 *                 user_id:
 *                   type: integer
 *                 steps:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Goal not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', ctrl.getOne)

/**
 * @swagger
 * /api/goals/{id}:
 *   put:
 *     summary: Update a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn React and Next.js
 *               description:
 *                 type: string
 *                 example: Master React fundamentals and Next.js framework
 *               category:
 *                 type: string
 *                 example: Learning
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T00:00:00Z
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-06-30T23:59:59Z
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *       404:
 *         description: Goal not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', ctrl.update)

/**
 * @swagger
 * /api/goals/{id}/complete:
 *   patch:
 *     summary: Mark a goal as completed
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: completed
 *                 completed_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Goal not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/complete', ctrl.complete)

/**
 * @swagger
 * /api/goals/{id}/abandon:
 *   patch:
 *     summary: Abandon a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal abandoned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: abandoned
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Goal not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/abandon', ctrl.abandon)

/**
 * @swagger
 * /api/goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Goal ID
 *     responses:
 *       204:
 *         description: Goal deleted successfully
 *       404:
 *         description: Goal not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', ctrl.remove)

module.exports = router
