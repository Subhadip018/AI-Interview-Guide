const Groq = require('groq-sdk');

if (!process.env.GROQ_API_KEY) {
  console.error('FATAL: GROQ_API_KEY is not set in environment variables');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Analyze resume text using Groq AI for ATS scoring
// @route   POST /api/resume/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'resumeText is required in the request body' });
    }

    // Truncate resume text to stay within model's 8K token limit
    const maxChars = 6000;
    const truncated =
      resumeText.length > maxChars
        ? resumeText.slice(0, maxChars) +
          '\n\n[Note: Resume was truncated due to length. Focus your analysis on the provided content.]'
        : resumeText;

    const prompt = `You are an expert ATS (Applicant Tracking System) and career coach. Analyze the following resume text thoroughly and return a JSON response ONLY (no markdown, no extra text).

Resume Text:
"""
${truncated}
"""

Return a JSON object with exactly these fields:
{
  "atsScore": <number 0-100 representing ATS compatibility score>,
  "skillsFound": [<array of skills/technologies found in the resume>],
  "missingSkills": [<array of important skills commonly expected that are missing>],
  "keywords": [<array of important ATS keywords found in the resume>],
  "summary": "<2-3 sentence professional summary of the resume>",
  "improvements": [<array of 5-7 specific actionable improvement suggestions>]
}

Be specific, accurate, and professional. Return valid JSON only.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 1500
    });

    const rawContent = chatCompletion.choices[0]?.message?.content || '';

    // Attempt to extract JSON from the response
    let parsedResult;
    try {
      // Strip potential markdown code fences
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON object found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error from Groq response:', parseError.message);
      console.error('Raw content:', rawContent);
      return res.status(500).json({
        success: false,
        message: 'AI returned an unexpected format. Please try again.',
        raw: rawContent
      });
    }

    res.status(200).json({
      success: true,
      analysis: {
        atsScore: parsedResult.atsScore || 0,
        skillsFound: parsedResult.skillsFound || [],
        missingSkills: parsedResult.missingSkills || [],
        keywords: parsedResult.keywords || [],
        summary: parsedResult.summary || '',
        improvements: parsedResult.improvements || []
      }
    });
  } catch (error) {
    console.error('AnalyzeResume error:', error.message);
    console.error('Stack:', error.stack);
    // Provide more specific error message if it's a Groq API issue
    const message =
      error.status === 401
        ? 'Invalid API key. Please check server GROQ_API_KEY.'
        : error.status === 429
        ? 'API rate limit exceeded. Please wait and try again.'
        : error.message?.includes('context_length')
        ? 'Resume is too long. Try a shorter version or remove formatting.'
        : 'Server error analyzing resume';
    res.status(500).json({ success: false, message });
  }
};

module.exports = { analyzeResume };
