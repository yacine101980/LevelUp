const { prisma } = require('../prisma')

const getGlobalStats = async (userId) => {
  const goals = await prisma.goal.findMany({
    where: { user_id: userId },
  })

  const completedGoals = goals.filter(g => g.status === 'completed').length

  const habits = await prisma.habit.findMany({
    where: { user_id: userId },
  })

  const logs = await prisma.habitLog.findMany({
    where: {
      habit: { user_id: userId },
    },
  })

  return {
    goalsCompletionRate: goals.length
      ? Math.round((completedGoals / goals.length) * 100)
      : 0,
    habitsTracked: habits.length,
    habitLogs: logs.length,
  }
}

const getGoalStatsByCategory = async (userId) => {
  const goals = await prisma.goal.groupBy({
    by: ['category', 'status'],
    where: { user_id: userId },
    _count: true,
  })

  return goals
}

const getHabitStats = async (userId) => {
  const habits = await prisma.habit.findMany({
    where: { user_id: userId, is_archived: false },
    include: {
      habitLogs: true,
    },
  })

  return habits.map(habit => ({
    habitId: habit.id,
    name: habit.name,
    totalLogs: habit.habitLogs.length,
    frequency: habit.frequency,
  }))
}



module.exports = { getGlobalStats, getGoalStatsByCategory, getHabitStats }
