const authService = require('../services/auth.service')
const gamificationService = require('../services/gamification.service')

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json(user)
  } catch (e) {
    if (e.message === 'MISSING_FIELDS')
      return res.status(400).json({ message: 'Missing required fields' })
    if (e.message === 'USER_ALREADY_EXISTS')
      return res.status(409).json({ message: 'User already exists' })
    res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  try {
    res.json(await authService.login(req.body))
  } catch (e) {
    if (e.message === 'MISSING_FIELDS')
      return res.status(400).json({ message: 'Email and password are required' })
    if (e.message === 'INVALID_CREDENTIALS')
      return res.status(401).json({ message: 'Invalid credentials' })
    res.status(500).json({ message: 'Server error' })
  }
}

exports.me = async (req, res) => {
  const me = await authService.getProfile(req.user.id)
  res.json(me)
}

exports.logout = async (req, res) => {
  try {
    const result = await authService.logout(req.user.id)
    res.json(result)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateProfile(
      req.user.id,
      req.body
    )
    res.json(updatedUser)
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
}
