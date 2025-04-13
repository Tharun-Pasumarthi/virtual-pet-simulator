const express = require('express');
const auth = require('../middleware/auth');
const DailyTask = require('../models/DailyTask');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Get today's tasks
router.get('/today', auth, catchAsync(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tasks = await DailyTask.findOne({
    user: req.user._id,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });

  if (!tasks) {
    tasks = await DailyTask.generateDailyTasks(req.user._id);
  }

  res.json({
    status: 'success',
    data: { tasks }
  });
}));

// Update task progress
router.patch('/:taskId/progress', auth, catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const { taskIndex, progress } = req.body;

  const dailyTask = await DailyTask.findOne({
    _id: taskId,
    user: req.user._id
  });

  if (!dailyTask) {
    throw new AppError('Daily task not found', 404);
  }

  const task = dailyTask.tasks[taskIndex];
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Update progress
  task.progress = Math.min(task.requirement, progress);
  task.completed = task.progress >= task.requirement;

  // Check if all tasks are completed
  dailyTask.completed = dailyTask.tasks.every(t => t.completed);

  // If task was just completed, give rewards
  if (task.completed && !dailyTask.tasks[taskIndex].rewardClaimed) {
    const coinReward = task.reward.coins * dailyTask.streakBonus;
    req.user.coins += coinReward;
    await req.user.save();
    
    dailyTask.tasks[taskIndex].rewardClaimed = true;
  }

  await dailyTask.save();

  res.json({
    status: 'success',
    data: { 
      dailyTask,
      user: { coins: req.user.coins }
    }
  });
}));

// Claim streak bonus
router.post('/claim-streak', auth, catchAsync(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [todayTask, yesterdayTask] = await Promise.all([
    DailyTask.findOne({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }),
    DailyTask.findOne({
      user: req.user._id,
      date: {
        $gte: yesterday,
        $lt: today
      }
    })
  ]);

  if (!todayTask) {
    throw new AppError('No daily tasks found for today', 404);
  }

  // Check if streak bonus was already claimed
  if (todayTask.streakBonusClaimed) {
    throw new AppError('Streak bonus already claimed', 400);
  }

  // Calculate streak bonus
  let streakBonus = 1;
  if (yesterdayTask?.completed) {
    streakBonus = (yesterdayTask.streakBonus || 1) + 0.1;
  }

  // Apply streak bonus
  todayTask.streakBonus = streakBonus;
  todayTask.streakBonusClaimed = true;
  await todayTask.save();

  res.json({
    status: 'success',
    data: { 
      dailyTask: todayTask,
      streakBonus
    }
  });
}));

module.exports = router;
