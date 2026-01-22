const { prisma } = require('../prisma')

exports.createHabit = (userId, data) => {
  return prisma.habit.create({
    data: { ...data, user_id: userId },
  })
}

exports.getHabits = (userId) => {
  return prisma.habit.findMany({
    where: { user_id: userId, is_archived: false },
  })
}

exports.getAllHabits = (userId) => {
  return prisma.habit.findMany({
    where: { user_id: userId },
  })
}

exports.deleteHabit = (id) => {
  return prisma.habit.delete({
    where: { id: parseInt(id, 10) },
  })
}

exports.updateHabit = (id, data) => {
  return prisma.habit.update({ where: { id: parseInt(id, 10) }, data })
}

exports.archiveHabit = (id) => {
  return prisma.habit.update({
    where: { id: parseInt(id, 10) },
    data: { is_archived: true },
  })
}
