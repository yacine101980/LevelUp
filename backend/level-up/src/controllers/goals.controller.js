const goalService = require('../services/goals.service')

exports.create = async (req, res) => {
  const goal = await goalService.createGoal(req.user.id, req.body)
  res.status(201).json(goal)
}

exports.list = async (req, res) => {
  const goals = await goalService.getGoals(req.user.id, req.query)
  res.json(goals)
}

exports.getOne = async (req, res) => {
  const goal = await goalService.getGoalById(req.user.id, req.params.id)
  if (!goal) return res.status(404).json({ message: 'Goal not found' })
  res.json(goal)
}

exports.update = async (req, res) => {
  const goal = await goalService.updateGoal(req.user.id, req.params.id, req.body)
  res.json(goal)
}

exports.complete = async (req, res) => {
  const goal = await goalService.completeGoal(req.params.id)
  res.json(goal)
}

exports.remove = async (req, res) => {
  await goalService.deleteGoal(req.params.id)
  res.status(204).send()
}
