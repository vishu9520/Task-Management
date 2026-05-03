const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Completed'],
      default: 'Todo',
    },
    progressNotes: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add a due date'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
