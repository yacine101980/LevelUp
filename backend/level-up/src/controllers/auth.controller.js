const bcrypt = require('bcrypt')
const { prisma } = require('../prisma')
const { generateToken } = require('../utils/jwt')

const register = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  })

  return res.status(201).json({
    id: user.id,
    username: user.username,
  })
}

const login = async (req, res) => {
  const { username, password } = req.body

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user.id)

  return res.json({
    token,
  })
}

module.exports = {
  register,
  login,
}
