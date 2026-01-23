const habitService = require('../services/habits.service')
const gamificationService = require('../services/gamification.service')
exports.create = async (req, res) => {
  const habit = await habitService.createHabit(req.user.id, req.body)
  await gamificationService.onHabitCreated(req.user.id)
  res.status(201).json(habit)
}

exports.list = async (req, res) => {
  const includeArchived = req.query.includeArchived === 'true'
  const habits = includeArchived 
    ? await habitService.getAllHabits(req.user.id)
    : await habitService.getHabits(req.user.id)
  res.json(habits)
}

exports.delete = async (req, res) => {
  await habitService.deleteHabit(req.params.id)
  res.status(204).send()
}

exports.update = async (req, res) => {
  const habit = await habitService.updateHabit(req.params.id, req.body)
  res.json(habit)
}

exports.archive = async (req, res) => {
  const habit = await habitService.archiveHabit(req.params.id)
  res.json(habit)
}
