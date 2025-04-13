const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [{
    type: {
      type: String,
      enum: ['feed', 'play', 'clean', 'train', 'minigame'],
      required: true
    },
    requirement: {
      type: Number,
      required: true
    },
    progress: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    reward: {
      coins: Number,
      experience: Number
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  streakBonus: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Generate new daily tasks
dailyTaskSchema.statics.generateDailyTasks = async function(userId) {
  const tasks = [
    {
      type: 'feed',
      requirement: 3,
      reward: { coins: 50, experience: 20 }
    },
    {
      type: 'play',
      requirement: 2,
      reward: { coins: 30, experience: 15 }
    },
    {
      type: 'minigame',
      requirement: 1,
      reward: { coins: 100, experience: 50 }
    }
  ];

  return this.create({
    user: userId,
    tasks: tasks
  });
};

module.exports = mongoose.model('DailyTask', dailyTaskSchema);
