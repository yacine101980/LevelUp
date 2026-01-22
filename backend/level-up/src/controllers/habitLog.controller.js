const habitLogService = require('../services/habitLog.service')

exports.logToday = async (req, res) => {
  try {
    const { id } = req.params
    const { notes } = req.body

    const log = await habitLogService.logHabitToday(
      Number(id),
      req.user.id,
      notes
    )

     await gamificationService.onHabitLogged(req.user.id, Number(id))

    res.status(201).json(log)
  } catch (e) {
    res.status(409).json({ message: e.message })
  }
}

exports.getLogs = async (req, res) => {
  const { id } = req.params
  const { start_date, end_date } = req.query

  const logs = await habitLogService.getLogs(
    Number(id),
    req.user.id,
    start_date,
    end_date
  )

  res.json(logs)
}

exports.deleteLog = async (req, res) => {
  const { id, date } = req.params

  await habitLogService.deleteLog(
    Number(id),
    req.user.id,
    date
  )

  res.status(204).send()
}
