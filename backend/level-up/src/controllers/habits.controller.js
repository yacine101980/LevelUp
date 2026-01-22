const habitService = require('../services/habits.service')

exports.create = async (req, res) => {
  const habit = await habitService.createHabit(req.user.id, req.body)
  res.status(201).json(habit)
}

exports.list = async (req, res) => {
  const habits = await habitService.getHabits(req.user.id)
  res.json(habits)
}

exports.update = async (req, res) => {
  const habit = await habitService.updateHabit(req.params.id, req.body)
  res.json(habit)
}

exports.archive = async (req, res) => {
  const habit = await habitService.archiveHabit(req.params.id)
  res.json(habit)
}
