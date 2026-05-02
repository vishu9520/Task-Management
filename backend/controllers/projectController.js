const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      // Admin sees all projects they created or are a member of
      projects = await Project.find({
        $or: [{ createdBy: req.user.id }, { members: req.user.id }],
      }).populate('members', 'name email').populate('createdBy', 'name email');
    } else {
      // Member sees projects they are part of OR have tasks assigned in
      const Task = require('../models/Task');
      const userTasks = await Task.find({ assignedTo: req.user.id });
      const projectIdsFromTasks = userTasks.map(t => t.project);

      projects = await Project.find({
        $or: [
          { members: req.user.id },
          { _id: { $in: projectIdsFromTasks } }
        ]
      })
        .populate('members', 'name email')
        .populate('createdBy', 'name email');
    }
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin only)
const createProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;

    if (!name || !description) {
      res.status(400);
      throw new Error('Please add a name and description');
    }

    const project = await Project.create({
      name,
      description,
      members: members || [],
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is the creator
    if (project.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is the creator
    if (project.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await project.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check access
    let hasAccess = false;
    if (req.user.role === 'Admin') {
      hasAccess = true;
    } else if (project.members.some((member) => member._id.toString() === req.user.id)) {
      hasAccess = true;
    } else {
      const Task = require('../models/Task');
      const hasTask = await Task.findOne({ project: project._id, assignedTo: req.user.id });
      if (hasTask) hasAccess = true;
    }

    if (!hasAccess) {
      res.status(401);
      throw new Error('Not authorized to view this project');
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
};
