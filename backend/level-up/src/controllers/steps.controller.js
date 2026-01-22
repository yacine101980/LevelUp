const stepService = require('../services/steps.service')

exports.create = async (req, res) => {
  const step = await stepService.createStep(req.params.id, req.body)
  res.status(201).json(step)
}

exports.complete = async (req, res) => {
  const step = await stepService.completeStep(req.params.id)
    await gamificationService.onStepCompleted(step.user_id)
  res.json(step)
}

exports.update = async (req, res) => {
  const step = await stepService.updateStep(req.params.id, req.body)
  res.json(step)
}

exports.remove = async (req, res) => {
  await stepService.deleteStep(req.params.id)
  res.status(204).send()
}
