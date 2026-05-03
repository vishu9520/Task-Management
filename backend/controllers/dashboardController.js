const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    let taskQuery = {};
    let projectQuery = {};

    if (req.user.role === 'Admin') {
      projectQuery = { createdBy: req.user.id };
      const projects = await Project.find(projectQuery);
      const projectIds = projects.map((p) => p._id);
      taskQuery = { project: { $in: projectIds } };
    } else {
      taskQuery = { assignedTo: req.user.id };
      const userTasks = await Task.find(taskQuery);
      const projectIdsFromTasks = userTasks.map(t => t.project);
      projectQuery = {
        $or: [
          { members: req.user.id },
          { _id: { $in: projectIdsFromTasks } }
        ]
      };
    }

    const tasks = await Task.find(taskQuery);
    const projects = await Project.find(projectQuery);

    const totalProjects = projects.length;
    let inProgressProjects = 0;
    let completedProjects = 0;
    let planningProjects = 0;

    for (const p of projects) {
        const pTasks = await Task.find({ project: p._id });
        if (pTasks.length === 0) {
            planningProjects++;
        } else {
            const allCompleted = pTasks.every(t => t.status === 'Completed');
            if (allCompleted) completedProjects++;
            else inProgressProjects++;
        }
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const todoTasks = tasks.filter((t) => t.status === 'Todo').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trendData = days.map(day => ({ name: day, tasks: 0 }));
    
    tasks.forEach(t => {
      if (t.createdAt) {
        const dayIndex = new Date(t.createdAt).getDay();
        trendData[dayIndex].tasks += 1;
      }
    });

    res.status(200).json({
      totalProjects,
      inProgressProjects,
      planningProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      todoTasks,
      inProgressTasks,
      trendData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
