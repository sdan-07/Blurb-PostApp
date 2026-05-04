import 'dotenv/config'
import app from './src/app.js'
import connectDB from './src/db/db.js'

const port = 3000

const start = async () => {
  await connectDB()
  app.listen(port, ()=>{
    console.log(`Server listening on port: ${port}`)
  }) 
}
start();
