const express = require('express')
const authRoutes = require('./routes/auth.routes')
const goalsRoutes = require('./routes/goals.routes')
const habitsRoutes = require('./routes/habits.routes')
const stepsRoutes = require('./routes/steps.routes')

const app = express()

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/goals', goalsRoutes)
app.use('/api/habits', habitsRoutes)
app.use('/api/steps', stepsRoutes)

module.exports = app
