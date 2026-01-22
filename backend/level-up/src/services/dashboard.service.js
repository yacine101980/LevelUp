const { prisma } = require('../prisma')

const getDashboard = async (userId) => {
  const [goals, habits, habitLogs] = await Promise.all([
    prisma.goal.findMany({
      where: { user_id: userId },
    }),
    prisma.habit.findMany({
      where: {
        user_id: userId,
        is_archived: false,
      },
    }),
    prisma.habitLog.findMany({
      where: {
        habit: { user_id: userId },
      },
    }),
  ])

  const completedGoals = goals.filter(g => g.status === 'completed').length
  const activeGoals = goals.filter(g => g.status === 'active').length

  const totalHabits = habits.length

  return {
    goals: {
      total: goals.length,
      completed: completedGoals,
      active: activeGoals,
    },
    habits: {
      active: totalHabits,
      logs: habitLogs.length,
    },
  }
}

module.exports = { getDashboard }
