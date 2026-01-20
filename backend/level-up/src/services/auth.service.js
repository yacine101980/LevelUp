const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { prisma } = require('../prisma')

/**
 * REGISTER
 * POST /api/auth/register
 */
exports.register = async ({ email, password, name }) => {
  if (!email || !password || !name) {
    throw new Error('MISSING_FIELDS')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('USER_ALREADY_EXISTS')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
  }
}

/**
 * LOGIN
 * POST /api/auth/login
 */
exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('MISSING_FIELDS')
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  return { token }
}

/**
 * LOGOUT
 * POST /api/auth/logout
 * (stateless → frontend supprime le token)
 */
exports.logout = async (userId) => {
  // Ici rien à faire côté DB pour JWT stateless
  return { message: 'Logged out successfully' }
}

/**
 * GET PROFILE
 * GET /api/auth/me
 */
exports.getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      level: true,
      xp_points: true,
      created_at: true,
      updated_at: true,
    },
  })

  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  return user
}

/**
 * UPDATE PROFILE
 * PUT /api/auth/me
 */
exports.updateProfile = async (userId, data) => {
  const { name, password } = data

  const updateData = {}

  if (name) updateData.name = name

  if (password) {
    updateData.password = await bcrypt.hash(password, 10)
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      updated_at: true,
    },
  })

  return user
}
