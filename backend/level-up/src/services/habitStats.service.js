const { prisma } = require('../prisma')

const calculateStreak = (logs) => {
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const log of logs) {
    const logDate = new Date(log.date)
    logDate.setHours(0, 0, 0, 0)

    if (logDate.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

const getHabitStats = async (habitId, userId) => {
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      user_id: userId,
      is_archived: false,
    },
  })

  if (!habit) {
    throw new Error('Habit not found')
  }

  const logs = await prisma.habitLog.findMany({
    where: { habit_id: habitId },
    orderBy: { date: 'desc' },
  })

  const streak = calculateStreak(logs)

  // 📊 Completion rate
  const startDate = new Date(habit.start_date)
  startDate.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysSinceStart =
    Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1

  const completionRate =
    daysSinceStart > 0
      ? Math.round((logs.length / daysSinceStart) * 100)
      : 0

  return {
    habitId,
    streak,
    completionRate,
    totalLogs: logs.length,
    daysSinceStart,
  }
}

module.exports = {
  getHabitStats,
}
