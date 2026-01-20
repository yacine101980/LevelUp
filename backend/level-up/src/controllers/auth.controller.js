const authService = require('../services/auth.service')

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json(user)
  } catch (e) {
    if (e.message === 'USER_EXISTS')
      return res.status(409).json({ message: 'User exists' })
    res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  try {
    res.json(await authService.login(req.body))
  } catch {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}

exports.me = async (req, res) => {
  res.json(await authService.getProfile(req.user.id))
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
