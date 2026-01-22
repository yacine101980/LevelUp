const express = require('express')
const cors= require('cors')
const authRoutes = require('./routes/auth.routes')
const goalsRoutes = require('./routes/goals.routes')
const habitsRoutes = require('./routes/habits.routes')
const stepsRoutes = require('./routes/steps.routes')
const logHabitsRoutes = require('./routes/habitLog.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const statsRoutes = require('./routes/stats.routes')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/auth', authRoutes)
app.use('/api/goals', goalsRoutes)
app.use('/api/habits', habitsRoutes)
app.use('/api/steps', stepsRoutes)
app.use('/api/habitsLog', logHabitsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/stats', statsRoutes)



module.exports = app
