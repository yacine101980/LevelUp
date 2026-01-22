const { prisma } = require('../prisma')

exports.createStep = (goalId, data) => {
  return prisma.step.create({
    data: { ...data, goal_id: parseInt(goalId, 10) },
  })
}

exports.completeStep = (id) => {
  return prisma.step.update({
    where: { id : parseInt(id, 10) },
    data: { is_completed: true, completed_at: new Date() },
  })
}

exports.updateStep = (id, data) => {
  return prisma.step.update({ where: { id: parseInt(id, 10) }, data })
}

exports.deleteStep = (id) => {
  return prisma.step.delete({ where: { id: parseInt(id, 10) } })
}

exports.calculateProgress = async (goalId) => {
  const steps = await prisma.step.findMany({ where: { goal_id: parseInt(goalId, 10) } })
  if (steps.length === 0) return 0

  const completed = steps.filter(s => s.is_completed).length
  return Math.round((completed / steps.length) * 100)
}
