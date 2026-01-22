const router = require('express').Router()

const strl = require('../controllers/steps.controller')
const auth = require('../middleware/auth.middleware')

router.use(auth)

/**
 * @swagger
 * /api/steps/{id}:
 *   post:
 *     summary: Create a new step for a goal
 *     tags: [Steps]
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
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Set up React development environment
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-02-01T23:59:59Z
 *               order:
 *                 type: integer
 *                 example: 1
 *                 description: Order/position of the step
 *     responses:
 *       201:
 *         description: Step created successfully
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
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 is_completed:
 *                   type: boolean
 *                   example: false
 *                 order:
 *                   type: integer
 *                 goal_id:
 *                   type: integer
 *       404:
 *         description: Goal not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/:id', strl.create)

/**
 * @swagger
 * /api/steps/{id}:
 *   put:
 *     summary: Update a step
 *     tags: [Steps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Step ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Set up React and Next.js development environment
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-02-05T23:59:59Z
 *               order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Step updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 is_completed:
 *                   type: boolean
 *                 order:
 *                   type: integer
 *                 goal_id:
 *                   type: integer
 *       404:
 *         description: Step not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', strl.update)

/**
 * @swagger
 * /api/steps/{id}/complete:
 *   patch:
 *     summary: Mark a step as completed
 *     tags: [Steps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Step ID
 *     responses:
 *       200:
 *         description: Step marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 is_completed:
 *                   type: boolean
 *                   example: true
 *                 completed_at:
 *                   type: string
 *                   format: date-time
 *                 goal_id:
 *                   type: integer
 *       404:
 *         description: Step not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id/complete', strl.complete)

/**
 * @swagger
 * /api/steps/{id}:
 *   delete:
 *     summary: Delete a step
 *     tags: [Steps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Step ID
 *     responses:
 *       204:
 *         description: Step deleted successfully
 *       404:
 *         description: Step not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', strl.remove)


module.exports = router