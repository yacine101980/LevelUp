const { prisma } = require('../prisma')

const logHabitToday = async (habit_id, user_id, notes) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const habit = await prisma.habit.findFirst({
    where: { id: habit_id, user_id, is_archived: false },
  })

  if (!habit) {
    throw new Error('Habit not found')
  }

  return prisma.habitLog.create({
    data: {
      habit_id,
      date: today,
      notes,
    },
  })
}

const getLogs = async (habit_id, user_id, startDate, endDate) => {
  return prisma.habitLog.findMany({
    where: {
      habit_id,
      habit: { user_id },
      date: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    orderBy: { date: 'desc' },
  })
}

const deleteLog = async (habit_id, user_id, date) => {
  return prisma.habitLog.deleteMany({
    where: {
      habit_id,
      date: new Date(date),
      habit: { user_id },
    },
  })
}

module.exports = {
  logHabitToday,
  getLogs,
  deleteLog,
}
