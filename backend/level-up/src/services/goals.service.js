const { prisma } = require('../prisma')

exports.createGoal = (userId, data) => {
  
    const { steps, ...goalData } = data;
  return prisma.goal.create({
    data: {
      ...goalData,
      user_id: userId,
      steps: steps && steps.length > 0 ? { create: steps.map(s => ({ title: s.title, deadline: s.deadline, is_completed: s.completed })) } : undefined,
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
    include: { steps: true },
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
  const { steps, ...goalData } = data;
  return prisma.goal.update({
    where: { id: parseInt(id, 10) },
    data: {
      ...goalData,
      steps: steps && steps.length > 0 ? {
        deleteMany: {},
        create: steps.map(s => ({ title: s.title, deadline: s.deadline, is_completed: s.completed }))
      } : { deleteMany: {} }, // Supprimer les étapes si aucune
    },
  })
}

exports.completeGoal = (id) => {
  return prisma.goal.update({
    where: { id: parseInt(id, 10) },
    data: { status: 'completed' },
  })
}
exports.deleteGoal = async (id) => {
  try {
    const goal = await prisma.goal.findUnique({ where: { id: parseInt(id, 10) } });
    
    if (!goal) {
      throw new Error('Objectif non trouvé');
    }

    // 2. Supprimer d'abord tous les steps associés
    await prisma.step.deleteMany({ where: { goal_id: parseInt(id, 10) } });

    // 3. Ensuite supprimer le goal
    await prisma.goal.delete({ where: { id: parseInt(id, 10) } });

    return { success: true, message: 'Objectif supprimé avec succès' };
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

exports.abandonGoal = (id) => {
  return prisma.goal.update({
    where: { id: parseInt(id, 10) },
    data: { status: 'abandoned' },
  });
};