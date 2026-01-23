const router = require('express').Router()

const htrl = require('../controllers/habits.controller')
const auth = require('../middleware/auth.middleware')

router.use(auth)

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - frequency
 *             properties:
 *               name:
 *                 type: string
 *                 example: Morning Meditation
 *               description:
 *                 type: string
 *                 example: 10 minutes of meditation every morning
 *               category:
 *                 type: string
 *                 example: Wellness
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly]
 *                 example: daily
 *               weekly_target:
 *                 type: integer
 *                 example: 5
 *                 description: Target number of times per week (required if frequency is weekly)
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T00:00:00Z
 *     responses:
 *       201:
 *         description: Habit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 frequency:
 *                   type: string
 *                 weekly_target:
 *                   type: integer
 *                 start_date:
 *                   type: string
 *                   format: date-time
 *                 is_archived:
 *                   type: boolean
 *                 user_id:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', htrl.create)

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Get all habits for the authenticated user
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of habits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   frequency:
 *                     type: string
 *                   weekly_target:
 *                     type: integer
 *                   start_date:
 *                     type: string
 *                     format: date-time
 *                   is_archived:
 *                     type: boolean
 *                   user_id:
 *                     type: integer
 *                   habitLogs:
 *                     type: array
 *                     items:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', htrl.list)

/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Update a habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Habit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Evening Meditation
 *               description:
 *                 type: string
 *                 example: 15 minutes of meditation every evening
 *               category:
 *                 type: string
 *                 example: Wellness
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly]
 *                 example: daily
 *               weekly_target:
 *                 type: integer
 *                 example: 5
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T00:00:00Z
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 frequency:
 *                   type: string
 *                 weekly_target:
 *                   type: integer
 *                 start_date:
 *                   type: string
 *                   format: date-time
 *                 is_archived:
 *                   type: boolean
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', htrl.update)

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Archive a habit (soft delete)
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Habit ID
 *     responses:
 *       200:
 *         description: Habit archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 is_archived:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', htrl.archive)
router.delete('/:id/delete', htrl.delete)


module.exports = router