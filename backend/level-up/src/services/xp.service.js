const { prisma } = require('../prisma')
const { getLevelFromXp } = require('../utils/level')

const addXp = async (userId, amount) => {
  console.log(`Adding ${amount} XP to user ${userId}`)

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      xp_points: { increment: amount },
    },
  })

  console.log(`User ${userId} now has ${user.xp_points} XP`)

  const newLevel = getLevelFromXp(user.xp_points)
  console.log(`Calculated new level: ${newLevel}`)

  if (newLevel !== user.level) {
    console.log(`Updating level for user ${userId} to ${newLevel}`)
    await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel },
    })
  } else {
    console.log(`Level remains the same for user ${userId}`)
  }
}

module.exports = { addXp }
