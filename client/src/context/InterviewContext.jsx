import React, { createContext, useContext, useState, useRef } from 'react';

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [config, setConfig] = useState({
    company: 'Google',
    role: 'Frontend',
    difficulty: 'Medium',
    type: 'Mixed',
    count: 10,
    voiceEnabled: true,
  });

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState(null);

  const updateConfig = (updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const startInterview = (qs) => {
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers([]);
    setIsActive(true);
    setIsComplete(false);
    setResults(null);
  };

  const submitAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      question: questions[currentIndex]?.question || '',
      answer,
      score: 0,
      feedback: '',
    };
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      setIsActive(false);
    }
  };

  const skipQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      question: questions[currentIndex]?.question || '',
      answer: '[Skipped]',
      score: 0,
      feedback: 'Question was skipped.',
    };
    setAnswers(newAnswers);
    nextQuestion();
  };

  const resetInterview = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setIsActive(false);
    setIsComplete(false);
    setResults(null);
  };

  return (
    <InterviewContext.Provider value={{
      config, updateConfig,
      questions, currentIndex,
      answers, setAnswers,
      isActive, isComplete, results, setResults,
      startInterview, submitAnswer, nextQuestion, skipQuestion, resetInterview,
    }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) throw new Error('useInterview must be used within InterviewProvider');
  return context;
};

export default InterviewContext;
