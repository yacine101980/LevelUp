const habitStatsService = require('../services/habitStats.service')

exports.getHabitStats = async (req, res) => {
  try {
    const habitId = Number(req.params.id)
    const userId = req.user.id

    const stats = await habitStatsService.getHabitStats(habitId, userId)

    res.json(stats)
  } catch (e) {
    res.status(404).json({ message: e.message })
  }
}
