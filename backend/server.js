const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const ConnectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const taskRoute = require('./routes/taskRoute');


dotenv.config();
ConnectDB();


const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());
app.use('/api/auth/',authRoute);
app.use('/api/tasks/',taskRoute);






app.listen(PORT,()=>console.log(`server is running on http://localhost:${PORT}`));