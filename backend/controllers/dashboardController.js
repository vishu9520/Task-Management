const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    let taskQuery = {};

    if (req.user.role === 'Admin') {
      // Admin gets stats for all tasks in their projects
      const projects = await Project.find({ createdBy: req.user.id });
      const projectIds = projects.map((p) => p._id);
      taskQuery = { project: { $in: projectIds } };
    } else {
      // Member gets stats for their assigned tasks
      taskQuery = { assignedTo: req.user.id };
    }

    const tasks = await Task.find(taskQuery);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
    
    // Overdue tasks: not completed and dueDate < now
    const now = new Date();
    const overdueTasks = tasks.filter(
      (t) => t.status !== 'Completed' && new Date(t.dueDate) < now
    ).length;

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
