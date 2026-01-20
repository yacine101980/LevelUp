const { prisma } = require('../prisma')

exports.createGoal = (userId, data) => {
  return prisma.goal.create({
    data: {
      ...data,
      user_id: userId,
    },
  })
}

exports.getGoals = (userId, filters) => {
  const { status, priority, sort } = filters

  return prisma.goal.findMany({
    where: {
      user_id: userId,
      ...(status && { status }),
      ...(priority && { priority }),
    },
    orderBy: {
      deadline: sort === 'deadline' ? 'asc' : undefined,
    },
  })
}

exports.getGoalById = (userId, id) => {
  return prisma.goal.findFirst({
    where: { id: parseInt(id, 10), user_id: parseInt(userId, 10) },
    include: { steps: true },
  })
}

exports.updateGoal = (userId, id, data) => {
  return prisma.goal.update({
    where: { id: parseInt(id, 10) },
    data,
  })
}

exports.completeGoal = (id) => {
  return prisma.goal.update({
    where: { id: parseInt(id, 10) },
    data: { status: 'COMPLETED' },
  })
}

exports.deleteGoal = (id) => {
  return prisma.goal.delete({ where: { id: parseInt(id, 10) } })
}
