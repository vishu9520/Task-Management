const express = require('express');
const router = express.Router();
const {
  getTasks,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/project/:projectId').get(protect, getTasks);
router.route('/').post(protect, adminOnly, createTask).get(protect, adminOnly, getAllTasks);
router
  .route('/:id')
  .put(protect, updateTask)
  .delete(protect, adminOnly, deleteTask);

module.exports = router;
