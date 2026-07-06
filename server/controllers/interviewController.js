const Groq = require('groq-sdk');
const InterviewResult = require('../models/InterviewResult');
const User = require('../models/User');
const Achievement = require('../models/Achievement');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getFeedback = async (req, res) => {
  try {
    const { answers, config, questions } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'answers array is required' });
    }

    const formattedAnswers = answers
      .map((a, idx) => `Q${idx + 1}: ${a.question || questions?.[idx]?.question || 'Question'}\nA${idx + 1}: ${a.answer || '(No answer provided)'}`)
      .join('\n\n');

    const baselineScores = answers.map(a => {
      const text = (a.answer || '').trim().toLowerCase();
      if (!text || text.includes('[skipped]') || text.includes('[no answer provided]') || text.includes('[time expired') || text.length < 8) return 0;
      if (text.includes("don't know") || text.includes("dont know") || text.includes("no idea") || text.includes("unsure") || text === 'wrong' || text === 'test' || text === 'nothing' || text.includes("wrong answer") || text.includes("incorrect")) return 10;
      if (text.length > 150) return 75;
      if (text.length > 80) return 60;
      if (text.length > 30) return 40;
      return 20;
    });

    const averageProgrammaticScore = Math.round(
      baselineScores.reduce((sum, s) => sum + s, 0) / baselineScores.length
    );

    const prompt = `You are an expert technical interview coach. Evaluate each answer INDIVIDUALLY and return a JSON response ONLY (no markdown, no extra text).

CRITICAL SCORING RULES:
- Wrong/incorrect/irrelevant answers → score 0-10
- Vague/off-topic answers → score 5-15
- Gibberish/blank/"don't know" → score 0-5
- Short generic (<30 words, no specifics) → score 10-25
- Decent but incomplete → score 30-55
- Good with specifics → score 55-75
- Excellent detailed accurate answer → score 75-100
- If most answers are poor, overallScore MUST be below 30

Interview Q&A:
"""
${formattedAnswers}
"""

Return a JSON object with exactly these fields:
{
  "perQuestionScores": [<array of numbers 0-100, one score per question in order>],
  "strengths": [<array of 3-5 specific strengths>],
  "weaknesses": [<array of 3-5 specific weaknesses>],
  "suggestions": [<array of 5-7 actionable improvement suggestions>],
  "overallScore": <number 0-100>,
  "confidence": <number 0-100>,
  "communication": <number 0-100>,
  "accuracy": <number 0-100>,
  "problemSolving": <number 0-100>,
  "timeManagement": <number 0-100>,
  "speed": <number 0-100>
}

Take your time to evaluate each answer carefully. Be strict — do not inflate scores. Return valid JSON only.`;

    let parsedResult = null;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        max_tokens: 2500,
      });

      const rawContent = chatCompletion.choices[0]?.message?.content || '';
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      }
    } catch (groqErr) {
      console.warn('Groq feedback error, using defaults:', groqErr.message);
    }

    const perQuestionScores = parsedResult?.perQuestionScores;
    const hasValidPerQuestionScores = Array.isArray(perQuestionScores) && perQuestionScores.length === answers.length;

    const finalPerQuestionScores = hasValidPerQuestionScores
      ? perQuestionScores.map((s, i) => {
          const blended = Math.round((s + baselineScores[i]) / 2);
          if (baselineScores[i] < 15 && s > 50) return Math.min(s, 30);
          return s;
        })
      : baselineScores;

    const computedOverall = Math.round(
      finalPerQuestionScores.reduce((sum, s) => sum + s, 0) / finalPerQuestionScores.length
    );

    let finalScore = parsedResult?.overallScore;
    if (finalScore === undefined || finalScore === null) {
      finalScore = computedOverall;
    } else {
      if (averageProgrammaticScore < 15) {
        finalScore = Math.min(finalScore, 20);
      }
    }

    const getMetric = (val) => {
      if (val === undefined || val === null) return computedOverall;
      if (averageProgrammaticScore < 15) return Math.min(val, 20);
      return val;
    };

    const feedback = {
      strengths:      parsedResult?.strengths      || (averageProgrammaticScore < 15 ? ['Completed session'] : ['Completed the interview', 'Showed effort']),
      weaknesses:     parsedResult?.weaknesses     || (averageProgrammaticScore < 15 ? ['Did not provide valid answers to most questions'] : ['Some answers need more depth']),
      suggestions:    parsedResult?.suggestions    || (averageProgrammaticScore < 15 ? ['Review core concepts', 'Attempt all questions in detail'] : ['Practice more questions', 'Use STAR method']),
      overallScore:   finalScore,
      confidence:     getMetric(parsedResult?.confidence),
      communication:  getMetric(parsedResult?.communication),
      accuracy:       getMetric(parsedResult?.accuracy),
      problemSolving: getMetric(parsedResult?.problemSolving),
      timeManagement: getMetric(parsedResult?.timeManagement),
      speed:          getMetric(parsedResult?.speed),
    };

    let savedResult = null;
    try {
      const answeredCount = answers.filter(a => a.answer && a.answer !== '[Skipped]' && a.answer !== '[No answer provided]').length;

      savedResult = await InterviewResult.create({
        userId:           req.user.id,
        company:          config?.company       || 'General',
        role:             config?.role          || 'General',
        difficulty:       config?.difficulty    || 'Medium',
        interviewType:    config?.type          || 'Mixed',
        totalQuestions:   questions?.length     || answers.length,
        answeredQuestions: answeredCount,
        score:            feedback.overallScore,
        accuracy:         feedback.accuracy,
        confidence:       feedback.confidence,
        communication:    feedback.communication,
        speed:            feedback.speed,
        problemSolving:   feedback.problemSolving,
        timeManagement:   feedback.timeManagement,
        answers:          answers.map((a, i) => ({
          question: a.question || '',
          answer:   a.answer   || '',
          feedback: '',
          score:    finalPerQuestionScores[i] || feedback.overallScore,
        })),
        aiFeedback: {
          strengths:   feedback.strengths,
          weaknesses:  feedback.weaknesses,
          suggestions: feedback.suggestions,
        },
        duration: 0,
      });

      const user = await User.findById(req.user.id);
      if (user) {
        user.totalInterviews = (user.totalInterviews || 0) + 1;
        if (feedback.overallScore > (user.bestScore || 0)) {
          user.bestScore = feedback.overallScore;
        }

        const now = new Date();
        const lastActive = user.lastActive ? new Date(user.lastActive) : null;
        if (lastActive) {
          const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            user.streak = (user.streak || 0) + 1;
          } else if (diffDays > 1) {
            user.streak = 1;
          }
        } else {
          user.streak = 1;
        }

        if (user.streak > (user.maxStreak || 0)) {
          user.maxStreak = user.streak;
        }

        user.lastActive = now;
        await user.save();

        const totalInterviews = user.totalInterviews || 0;
        const badgeChecks = [
          { id: 'first_interview', condition: totalInterviews >= 1 },
          { id: 'five_interviews', condition: totalInterviews >= 5 },
          { id: 'ten_interviews', condition: totalInterviews >= 10 },
          { id: 'perfect_score', condition: feedback.overallScore === 100 },
          { id: 'streak_3', condition: (user.streak || 0) >= 3 },
          { id: 'streak_7', condition: (user.streak || 0) >= 7 },
          { id: 'streak_30', condition: (user.streak || 0) >= 30 },
        ];

        const badgeNames = {
          first_interview: 'First Interview', five_interviews: '5 Interviews Done', ten_interviews: '10 Interviews',
          perfect_score: 'Perfect Score', streak_3: '3-Day Streak', streak_7: '7-Day Streak', streak_30: '30-Day Streak',
        };

        for (const badge of badgeChecks) {
          if (badge.condition) {
            const existing = await Achievement.findOne({ userId: req.user.id, badgeId: badge.id });
            if (!existing) {
              await Achievement.create({ userId: req.user.id, badgeId: badge.id, badgeName: badgeNames[badge.id] || badge.id });
            }
          }
        }
      }
    } catch (dbErr) {
      console.error('DB save error:', dbErr.message);
    }

    return res.status(200).json({
      success:       true,
      resultId:      savedResult?._id || null,
      ...feedback,
    });
  } catch (error) {
    console.error('GetFeedback error:', error.message);
    res.status(500).json({ success: false, message: 'Server error generating interview feedback' });
  }
};

module.exports = { getFeedback };
