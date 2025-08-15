import 'dotenv/config.js'
import { app } from './src/app.js'

// Running the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
