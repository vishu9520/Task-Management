const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user has access to project
    let hasAccess = false;
    if (req.user.role === 'Admin') {
      hasAccess = true;
    } else if (project.members.includes(req.user.id)) {
      hasAccess = true;
    } else {
      const hasTask = await Task.findOne({ project: project._id, assignedTo: req.user.id });
      if (hasTask) hasAccess = true;
    }

    if (!hasAccess) {
      res.status(401);
      throw new Error('Not authorized to view tasks for this project');
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks (Admin only)
// @route   GET /api/tasks
// @access  Private
const getAllTasks = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      res.status(401);
      throw new Error('Not authorized to view all tasks');
    }
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for logged in user (Member)
// @route   GET /api/tasks/me
// @access  Private
const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Admin only)
const createTask = async (req, res, next) => {
  try {
    const { title, description, startDate, dueDate, assignedTo, project } = req.body;

    if (!title || !description || !startDate || !dueDate || !assignedTo || !project) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const proj = await Project.findById(project);
    if (!proj) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (proj.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to create tasks for this project');
    }

    const task = await Task.create({
      title,
      description,
      startDate,
      dueDate,
      assignedTo,
      project,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (Admin can update all, Member can update status)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    let updatedFields = req.body;

    if (req.user.role !== 'Admin') {
      // Member can only update status and progressNotes if assigned to them
      if (task.assignedTo.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to update this task');
      }
      updatedFields = {};
      if (req.body.status !== undefined) updatedFields.status = req.body.status;
      if (req.body.progressNotes !== undefined) updatedFields.progressNotes = req.body.progressNotes;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const proj = await Project.findById(task.project);
    
    if (proj.createdBy.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this task');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getAllTasks,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
};
