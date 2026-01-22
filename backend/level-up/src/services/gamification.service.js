const { prisma } = require('../prisma')
const habitStatsService = require('./habitStats.service')
const xpService = require('./xp.service')

const XP = {
  STEP: 10,
  GOAL: 50,
  HABIT: 5,
  STREAK_7: 30,
  STREAK_30: 100
}

/* -------------------- UTILITAIRES -------------------- */

const unlockBadge = async (userId, code) => {
  const badge = await prisma.badge.findUnique({ where: { criteria: code } })
  if (!badge) return

  const exists = await prisma.userBadge.findUnique({
    where: {
      user_id_badge_id: {
        user_id: userId,
        badge_id: badge.id
      }
    }
  })

  if (exists) return

  await prisma.userBadge.create({
    data: {
      user_id: userId,
      badge_id: badge.id
    }
  })
}

/* -------------------- EVENTS -------------------- */

exports.onGoalCreated = async (userId) => {
  const count = await prisma.goal.count({ where: { user_id: userId } })
  if (count === 1) {
    await unlockBadge(userId, 'first_goal')
  }
}

exports.onGoalCompleted = async (userId) => {
  await xpService.addXp(userId, XP.GOAL)

  const completed = await prisma.goal.count({
    where: { user_id: userId, status: 'completed' } // Updated status to match the GoalStatus enum
  })

  if (completed >= 5) {
    await unlockBadge(userId, 'complete_5_goals')
  }
}

exports.onHabitCreated = async (userId) => {
  const count = await prisma.habit.count({
    where: { user_id: userId, is_archived: false }
  })

  if (count >= 3) {
    await unlockBadge(userId, 'create_3_habits')
  }
}

exports.onHabitLogged = async (userId, habitId) => {
  await xpService.addXp(userId, XP.HABIT)

  const { streak } = await habitStatsService.getHabitStats(habitId, userId)

  if (streak === 7) {
    await xpService.addXp(userId, XP.STREAK_7)
    await unlockBadge(userId, 'streak_7')
  }

  if (streak === 30) {
    await xpService.addXp(userId, XP.STREAK_30)
    await unlockBadge(userId, 'streak_30')
  }
}

exports.onStepCompleted = async (userId) => {
  await xpService.addXp(userId, XP.STEP)
}

/* -------------------- CONSULTATION -------------------- */

exports.getUserXp = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true }
  })

  const levels = [
    { level: 1, name: 'Débutant', min: 0 },
    { level: 2, name: 'Motivé', min: 100 },
    { level: 3, name: 'Discipliné', min: 300 },
    { level: 4, name: 'Expert', min: 600 },
    { level: 5, name: 'Maître', min: 1000 }
  ]

  const current = [...levels].reverse().find(l => user.xp >= l.min)

  return {
    xp: user.xp,
    level: current.level,
    title: current.name,
    nextLevelXp:
      levels.find(l => l.level === current.level + 1)?.min ?? null
  }
}
