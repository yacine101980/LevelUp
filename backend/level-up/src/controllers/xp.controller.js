const gamificationService = require('../services/gamification.service')

exports.getMyXp = async (req, res) => {
  const data = await gamificationService.getUserXp(req.user.id)
  res.json(data)
}
