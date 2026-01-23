const router = require('express').Router()
const auth = require('../middleware/auth.middleware')
const habitLogCtrl = require('../controllers/habitLog.controller')
const habitStatsController = require('../controllers/habitStats.controller')

/**
 * @swagger
 * /api/habitsLog/{id}/log:
 *   post:
 *     summary: Log a habit completion for today
 *     tags: [Habit Logs]
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 example: Felt great after meditation today!
 *     responses:
 *       201:
 *         description: Habit logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 habit_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 is_completed:
 *                   type: boolean
 *                   example: true
 *                 notes:
 *                   type: string
 *       409:
 *         description: Habit already logged for today
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Habit already logged for today
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/log', auth, habitLogCtrl.logToday)

/**
 * @swagger
 * /api/habitsLog/{id}/logs:
 *   get:
 *     summary: Get habit logs for a specific habit
 *     tags: [Habit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Habit ID
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering logs (YYYY-MM-DD)
 *         example: 2024-01-01
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering logs (YYYY-MM-DD)
 *         example: 2024-01-31
 *     responses:
 *       200:
 *         description: List of habit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   habit_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   is_completed:
 *                     type: boolean
 *                   notes:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/logs', auth, habitLogCtrl.getLogs)

/**
 * @swagger
 * /api/habitsLog/{id}/log/{date}:
 *   delete:
 *     summary: Delete a specific habit log entry
 *     tags: [Habit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Habit ID
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the log entry to delete (YYYY-MM-DD)
 *         example: 2024-01-15
 *     responses:
 *       204:
 *         description: Habit log deleted successfully
 *       404:
 *         description: Habit log not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/log/:date', auth, habitLogCtrl.deleteLog)
router.get('/:id/stats', auth, habitStatsController.getHabitStats)


module.exports = router
