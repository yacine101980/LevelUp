const dashboardService = require('../services/dashboard.service')

exports.getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboard(req.user.id)
    res.json(data)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}
