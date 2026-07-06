const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  feedback: { type: String, default: '' },
  score: { type: Number, default: 0 }
}, { _id: false });

const AiFeedbackSchema = new mongoose.Schema({
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [{ type: String }]
}, { _id: false });

const InterviewResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: { type: String, required: true },
  role: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  interviewType: {
    type: String,
    enum: ['Behavioral', 'Technical', 'HR', 'Mixed'],
    default: 'Mixed'
  },
  totalQuestions: { type: Number, default: 0 },
  answeredQuestions: { type: Number, default: 0 },
  score: { type: Number, min: 0, max: 100, default: 0 },
  accuracy: { type: Number, min: 0, max: 100, default: 0 },
  confidence: { type: Number, min: 0, max: 100, default: 0 },
  communication: { type: Number, min: 0, max: 100, default: 0 },
  speed: { type: Number, min: 0, max: 100, default: 0 },
  problemSolving: { type: Number, min: 0, max: 100, default: 0 },
  timeManagement: { type: Number, min: 0, max: 100, default: 0 },
  answers: [AnswerSchema],
  aiFeedback: { type: AiFeedbackSchema, default: () => ({}) },
  duration: { type: Number, default: 0 }, // in seconds
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewResult', InterviewResultSchema);
