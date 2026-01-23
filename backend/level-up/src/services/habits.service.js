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

exports.deleteHabit = async (id) => {
  const habit = await prisma.habit.findFirst({
    where: { id: parseInt(id, 10) },
  })
  if (!habit) {
    throw new Error('Habit not found')
  }
  await prisma.habitLog.deleteMany({
    where: { habit_id: habit.id },
  })
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
