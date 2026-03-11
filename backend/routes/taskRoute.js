const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {CreateTask,getAllTask,getTaskById,UpdateTask,deleteTask} = require('../controllers/taskController');

router.post('/',protect,CreateTask);

router.get('/',protect,getAllTask);

router.get('/:id',protect,getTaskById);

router.put('/:id',protect,UpdateTask);

router.delete('/:id',protect,deleteTask);

module.exports = router;
