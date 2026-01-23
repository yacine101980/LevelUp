const statsService = require('../services/stats.service')


exports.getStats = async (req, res) => {
  const stats = await statsService.getGlobalStats(req.user.id)
  res.json(stats)
}
exports.getGoalStats = async (req, res) => {
  const stats = await statsService.getGoalStatsByCategory(req.user.id)
  res.json(stats)
}

exports.getHabitStats = async (req, res) => {
  const stats = await statsService.getHabitStats(req.user.id)
  res.json(stats)
}   