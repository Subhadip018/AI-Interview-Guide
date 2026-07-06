const express = require('express');
const router = express.Router();

// ──────────────────────────────────────────────────────────────────────────────
// Full question bank: 60+ questions
// Companies: Google, Amazon, Microsoft, Meta, Netflix, General
// Roles: Frontend, Backend, Full Stack, Java Developer, Python Developer, Data Analyst
// Types: Behavioral, Technical, HR
// Difficulties: Easy, Medium, Hard
// ──────────────────────────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // ───────── GOOGLE ─────────
  {
    id: 'q001',
    question: 'How would you design a URL shortener like bit.ly? Walk through the architecture.',
    company: 'Google',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Consider scalability, hashing strategy, database choice, and caching.',
    timeLimit: 180,
    tags: ['System Design', 'Scalability', 'Databases']
  },
  {
    id: 'q002',
    question: 'Tell me about a time you resolved a major conflict within your team.',
    company: 'Google',
    role: 'Full Stack',
    type: 'Behavioral',
    difficulty: 'Medium',
    hint: 'Use the STAR method: Situation, Task, Action, Result.',
    timeLimit: 120,
    tags: ['Teamwork', 'Conflict Resolution', 'Leadership']
  },
  {
    id: 'q003',
    question: 'Implement a function to find the longest palindromic substring in a string.',
    company: 'Google',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Consider dynamic programming or expand-around-center approach.',
    timeLimit: 240,
    tags: ['Algorithms', 'Dynamic Programming', 'Strings']
  },
  {
    id: 'q004',
    question: 'How does the V8 JavaScript engine work and how does it optimize code?',
    company: 'Google',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Discuss JIT compilation, hidden classes, inline caching.',
    timeLimit: 180,
    tags: ['JavaScript', 'Performance', 'Engine Internals']
  },
  {
    id: 'q005',
    question: 'Where do you see yourself in 5 years, and how does this role fit into that vision?',
    company: 'Google',
    role: 'Full Stack',
    type: 'HR',
    difficulty: 'Easy',
    hint: 'Align your goals with Google\'s mission and the role\'s growth potential.',
    timeLimit: 90,
    tags: ['Career Goals', 'Motivation', 'Vision']
  },
  {
    id: 'q006',
    question: 'Explain how you would implement a real-time collaborative editing feature (like Google Docs).',
    company: 'Google',
    role: 'Full Stack',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Discuss OT (Operational Transformation) or CRDTs, WebSockets.',
    timeLimit: 240,
    tags: ['System Design', 'WebSockets', 'Collaboration']
  },

  // ───────── AMAZON ─────────
  {
    id: 'q007',
    question: 'Tell me about a time you had to make a decision with incomplete information.',
    company: 'Amazon',
    role: 'Full Stack',
    type: 'Behavioral',
    difficulty: 'Medium',
    hint: 'Relates to Amazon\'s "Bias for Action" leadership principle.',
    timeLimit: 120,
    tags: ['Decision Making', 'Leadership Principles', 'Ambiguity']
  },
  {
    id: 'q008',
    question: 'Design Amazon\'s product recommendation system at scale.',
    company: 'Amazon',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Consider collaborative filtering, content-based filtering, and real-time vs. batch processing.',
    timeLimit: 240,
    tags: ['System Design', 'Machine Learning', 'Scalability']
  },
  {
    id: 'q009',
    question: 'Describe a time when you raised the bar for quality in your team or project.',
    company: 'Amazon',
    role: 'Backend',
    type: 'Behavioral',
    difficulty: 'Medium',
    hint: 'Link to Amazon\'s "Insist on the Highest Standards" principle.',
    timeLimit: 120,
    tags: ['Quality', 'Standards', 'Leadership']
  },
  {
    id: 'q010',
    question: 'How would you optimize a slow SQL query that is causing production issues?',
    company: 'Amazon',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Discuss EXPLAIN plans, indexing, query restructuring, and caching.',
    timeLimit: 180,
    tags: ['SQL', 'Performance', 'Databases', 'Optimization']
  },
  {
    id: 'q011',
    question: 'What are your salary expectations and why do you think you deserve that amount?',
    company: 'Amazon',
    role: 'Full Stack',
    type: 'HR',
    difficulty: 'Easy',
    hint: 'Research market rates, present data, and tie to your value delivered.',
    timeLimit: 90,
    tags: ['Negotiation', 'Compensation', 'Self-Worth']
  },
  {
    id: 'q012',
    question: 'Implement LRU (Least Recently Used) cache from scratch.',
    company: 'Amazon',
    role: 'Java Developer',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Use a doubly linked list + HashMap for O(1) get and put operations.',
    timeLimit: 240,
    tags: ['Data Structures', 'Cache', 'Design Patterns']
  },

  // ───────── MICROSOFT ─────────
  {
    id: 'q013',
    question: 'How would you design a scalable notification system for millions of users?',
    company: 'Microsoft',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Consider pub/sub, message queues (Kafka/RabbitMQ), fanout strategies.',
    timeLimit: 240,
    tags: ['System Design', 'Messaging', 'Scalability']
  },
  {
    id: 'q014',
    question: 'Describe a time you had to learn a new technology very quickly to deliver a project.',
    company: 'Microsoft',
    role: 'Full Stack',
    type: 'Behavioral',
    difficulty: 'Easy',
    hint: 'Highlight your learning process, resources used, and outcome.',
    timeLimit: 120,
    tags: ['Learning Agility', 'Adaptability', 'Growth Mindset']
  },
  {
    id: 'q015',
    question: 'What are the differences between REST and GraphQL, and when would you choose one over the other?',
    company: 'Microsoft',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Compare over-fetching, under-fetching, caching, tooling, and use cases.',
    timeLimit: 150,
    tags: ['API Design', 'REST', 'GraphQL']
  },
  {
    id: 'q016',
    question: 'Explain the concept of dependency injection and how it is implemented in .NET or Spring.',
    company: 'Microsoft',
    role: 'Java Developer',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Discuss IoC containers, constructor vs. setter injection, and testability.',
    timeLimit: 150,
    tags: ['OOP', 'Design Patterns', 'Dependency Injection']
  },
  {
    id: 'q017',
    question: 'Why do you want to work at Microsoft specifically?',
    company: 'Microsoft',
    role: 'Full Stack',
    type: 'HR',
    difficulty: 'Easy',
    hint: 'Research Microsoft\'s mission, products, and culture of growth mindset.',
    timeLimit: 90,
    tags: ['Motivation', 'Culture Fit', 'Company Research']
  },
  {
    id: 'q018',
    question: 'How do you handle technical debt in a fast-moving product team?',
    company: 'Microsoft',
    role: 'Backend',
    type: 'Behavioral',
    difficulty: 'Medium',
    hint: 'Discuss prioritization, documentation, refactoring sprints, and trade-offs.',
    timeLimit: 120,
    tags: ['Technical Debt', 'Engineering Culture', 'Prioritization']
  },

  // ───────── META ─────────
  {
    id: 'q019',
    question: 'How would you build a highly scalable news feed system like Facebook\'s?',
    company: 'Meta',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Discuss fanout on write vs. read, ranking algorithms, caching layers.',
    timeLimit: 240,
    tags: ['System Design', 'Social Media', 'Scalability', 'Feed Ranking']
  },
  {
    id: 'q020',
    question: 'Optimize the rendering performance of a React application that is experiencing lag.',
    company: 'Meta',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Discuss React.memo, useMemo, useCallback, virtualization, code splitting.',
    timeLimit: 180,
    tags: ['React', 'Performance', 'Rendering', 'Optimization']
  },
  {
    id: 'q021',
    question: 'Describe a time you influenced an engineering decision without direct authority.',
    company: 'Meta',
    role: 'Full Stack',
    type: 'Behavioral',
    difficulty: 'Medium',
    hint: 'Focus on data-driven arguments, stakeholder communication, and outcomes.',
    timeLimit: 120,
    tags: ['Influence', 'Leadership', 'Communication']
  },
  {
    id: 'q022',
    question: 'Write an algorithm to find all permutations of a given string.',
    company: 'Meta',
    role: 'Python Developer',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Use recursion or itertools. Consider handling duplicates.',
    timeLimit: 180,
    tags: ['Algorithms', 'Recursion', 'Strings']
  },
  {
    id: 'q023',
    question: 'How do you approach building accessible (a11y) web interfaces?',
    company: 'Meta',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Discuss ARIA roles, semantic HTML, keyboard navigation, color contrast.',
    timeLimit: 150,
    tags: ['Accessibility', 'HTML', 'UX', 'WCAG']
  },
  {
    id: 'q024',
    question: 'What does "moving fast" mean to you in an engineering context?',
    company: 'Meta',
    role: 'Full Stack',
    type: 'HR',
    difficulty: 'Easy',
    hint: 'Balance speed with code quality, testing, and sustainable practices.',
    timeLimit: 90,
    tags: ['Engineering Philosophy', 'Culture', 'Velocity']
  },

  // ───────── NETFLIX ─────────
  {
    id: 'q025',
    question: 'How would you design Netflix\'s video streaming and CDN architecture?',
    company: 'Netflix',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Discuss Open Connect CDN, adaptive bitrate streaming (HLS/DASH), encoding.',
    timeLimit: 240,
    tags: ['System Design', 'CDN', 'Streaming', 'Scalability']
  },
  {
    id: 'q026',
    question: 'Tell me about a time you made a controversial technical decision and had to defend it.',
    company: 'Netflix',
    role: 'Backend',
    type: 'Behavioral',
    difficulty: 'Hard',
    hint: 'Show your reasoning process, how you gathered data, and the outcome.',
    timeLimit: 150,
    tags: ['Decision Making', 'Technical Leadership', 'Communication']
  },
  {
    id: 'q027',
    question: 'How does Netflix\'s chaos engineering (Chaos Monkey) improve system reliability?',
    company: 'Netflix',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Explain fault injection, resilience testing, and the Simian Army tools.',
    timeLimit: 150,
    tags: ['Chaos Engineering', 'Reliability', 'Distributed Systems']
  },
  {
    id: 'q028',
    question: 'How do you build and maintain a data pipeline for large-scale analytics?',
    company: 'Netflix',
    role: 'Data Analyst',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Discuss ETL/ELT, batch vs. streaming (Spark, Flink), data quality checks.',
    timeLimit: 200,
    tags: ['Data Engineering', 'Pipelines', 'Analytics', 'Big Data']
  },
  {
    id: 'q029',
    question: 'Netflix culture values freedom and responsibility. Give an example where you exemplified this.',
    company: 'Netflix',
    role: 'Full Stack',
    type: 'HR',
    difficulty: 'Medium',
    hint: 'Autonomy with accountability: self-directed work and ownership of outcomes.',
    timeLimit: 120,
    tags: ['Culture', 'Autonomy', 'Accountability']
  },
  {
    id: 'q030',
    question: 'Explain how you would implement A/B testing infrastructure for a streaming platform.',
    company: 'Netflix',
    role: 'Full Stack',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Feature flags, experiment assignments, metrics collection, statistical significance.',
    timeLimit: 200,
    tags: ['A/B Testing', 'Feature Flags', 'Experimentation', 'Analytics']
  },

  // ───────── GENERAL – FRONTEND ─────────
  {
    id: 'q031',
    question: 'Explain the difference between CSS Grid and Flexbox. When do you use each?',
    company: 'General',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'Grid is 2D layout; Flexbox is 1D. Grid for overall page, Flexbox for components.',
    timeLimit: 90,
    tags: ['CSS', 'Layout', 'Grid', 'Flexbox']
  },
  {
    id: 'q032',
    question: 'What is the virtual DOM in React and why does it improve performance?',
    company: 'General',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'Diffing algorithm, reconciliation, and batching updates.',
    timeLimit: 90,
    tags: ['React', 'Virtual DOM', 'Performance']
  },
  {
    id: 'q033',
    question: 'How do you handle state management in a large React application?',
    company: 'General',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Compare Context API, Redux Toolkit, Zustand, Jotai, and React Query.',
    timeLimit: 150,
    tags: ['React', 'State Management', 'Redux', 'Context API']
  },
  {
    id: 'q034',
    question: 'What are Web Vitals and how do you improve Core Web Vitals scores?',
    company: 'General',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'LCP, FID/INP, CLS — lazy loading, font optimization, layout stability.',
    timeLimit: 150,
    tags: ['Performance', 'Web Vitals', 'SEO', 'Optimization']
  },
  {
    id: 'q035',
    question: 'Explain event delegation and why it is used in JavaScript.',
    company: 'General',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'Attach one listener to a parent instead of many listeners to children. Memory efficient.',
    timeLimit: 90,
    tags: ['JavaScript', 'DOM', 'Events', 'Performance']
  },
  {
    id: 'q036',
    question: 'How does the browser\'s critical rendering path work?',
    company: 'General',
    role: 'Frontend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'DOM construction → CSSOM → Render Tree → Layout → Paint → Composite.',
    timeLimit: 150,
    tags: ['Browser', 'Rendering', 'Performance', 'HTML']
  },

  // ───────── GENERAL – BACKEND ─────────
  {
    id: 'q037',
    question: 'What is the CAP theorem and how does it affect distributed system design?',
    company: 'General',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Consistency, Availability, Partition Tolerance — you can only guarantee two.',
    timeLimit: 180,
    tags: ['Distributed Systems', 'CAP Theorem', 'System Design']
  },
  {
    id: 'q038',
    question: 'Explain the difference between SQL and NoSQL databases and give use cases for each.',
    company: 'General',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'ACID vs. BASE, schema flexibility, horizontal scaling, data relationships.',
    timeLimit: 120,
    tags: ['Databases', 'SQL', 'NoSQL', 'Architecture']
  },
  {
    id: 'q039',
    question: 'How do you secure a REST API? Walk through the main security concerns.',
    company: 'General',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Authentication (JWT/OAuth), HTTPS, input validation, rate limiting, CORS.',
    timeLimit: 150,
    tags: ['Security', 'API', 'Authentication', 'REST']
  },
  {
    id: 'q040',
    question: 'What is a message queue and how does Kafka differ from RabbitMQ?',
    company: 'General',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Log-based vs. queue-based, retention, ordering guarantees, throughput.',
    timeLimit: 180,
    tags: ['Messaging', 'Kafka', 'RabbitMQ', 'Microservices']
  },
  {
    id: 'q041',
    question: 'Describe how you would implement JWT-based authentication and refresh tokens.',
    company: 'General',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Access token (short-lived) + refresh token (long-lived, httpOnly cookie).',
    timeLimit: 150,
    tags: ['Authentication', 'JWT', 'Security', 'Sessions']
  },
  {
    id: 'q042',
    question: 'How does Docker help in development and production environments?',
    company: 'General',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'Containerization, environment consistency, isolation, docker-compose, orchestration.',
    timeLimit: 120,
    tags: ['Docker', 'DevOps', 'Containers', 'Deployment']
  },

  // ───────── GENERAL – FULL STACK ─────────
  {
    id: 'q043',
    question: 'How do you structure a full-stack project to ensure maintainability and scalability?',
    company: 'General',
    role: 'Full Stack',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Monorepo vs. multi-repo, feature-based folder structure, clear API contracts.',
    timeLimit: 150,
    tags: ['Architecture', 'Project Structure', 'Best Practices']
  },
  {
    id: 'q044',
    question: 'Walk me through the request lifecycle from browser to database and back.',
    company: 'General',
    role: 'Full Stack',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'DNS → TCP → HTTP → Server → Middleware → Controller → DB → Response.',
    timeLimit: 150,
    tags: ['Networking', 'HTTP', 'Full Stack', 'Request Lifecycle']
  },
  {
    id: 'q045',
    question: 'Tell me about your most impactful project. What problem did it solve?',
    company: 'General',
    role: 'Full Stack',
    type: 'Behavioral',
    difficulty: 'Easy',
    hint: 'Quantify impact: users served, time saved, revenue generated, performance improved.',
    timeLimit: 120,
    tags: ['Projects', 'Impact', 'Problem Solving']
  },
  {
    id: 'q046',
    question: 'How do you approach debugging a full-stack application with an intermittent bug?',
    company: 'General',
    role: 'Full Stack',
    type: 'Behavioral',
    difficulty: 'Medium',
    hint: 'Reproduce consistently, isolate layers, use logging/tracing, binary search approach.',
    timeLimit: 120,
    tags: ['Debugging', 'Problem Solving', 'Methodology']
  },

  // ───────── GENERAL – JAVA DEVELOPER ─────────
  {
    id: 'q047',
    question: 'Explain the Java memory model: heap, stack, and garbage collection.',
    company: 'General',
    role: 'Java Developer',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Young/Old generation, GC algorithms (G1, ZGC), Eden space, survivors.',
    timeLimit: 150,
    tags: ['Java', 'Memory Management', 'JVM', 'Garbage Collection']
  },
  {
    id: 'q048',
    question: 'What are the SOLID principles? Give a Java example for each.',
    company: 'General',
    role: 'Java Developer',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'SRP, OCP, LSP, ISP, DIP — with concrete code-level examples.',
    timeLimit: 180,
    tags: ['OOP', 'SOLID', 'Design Principles', 'Java']
  },
  {
    id: 'q049',
    question: 'How does Spring Boot auto-configuration work under the hood?',
    company: 'General',
    role: 'Java Developer',
    type: 'Technical',
    difficulty: 'Hard',
    hint: '@EnableAutoConfiguration, spring.factories, @Conditional annotations.',
    timeLimit: 180,
    tags: ['Spring Boot', 'Java', 'Auto-configuration', 'Framework']
  },
  {
    id: 'q050',
    question: 'Explain the differences between ArrayList, LinkedList, and HashMap in Java.',
    company: 'General',
    role: 'Java Developer',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'Time complexity of operations, memory layout, and appropriate use cases.',
    timeLimit: 120,
    tags: ['Java', 'Data Structures', 'Collections', 'Complexity']
  },
  {
    id: 'q051',
    question: 'How do you handle concurrency in Java? Explain synchronized, volatile, and java.util.concurrent.',
    company: 'General',
    role: 'Java Developer',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Thread safety, locks, atomic operations, thread pool executors, CompletableFuture.',
    timeLimit: 180,
    tags: ['Java', 'Concurrency', 'Multithreading', 'Thread Safety']
  },

  // ───────── GENERAL – PYTHON DEVELOPER ─────────
  {
    id: 'q052',
    question: 'What is the GIL in Python and how does it affect multithreading?',
    company: 'General',
    role: 'Python Developer',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Global Interpreter Lock prevents true thread parallelism; use multiprocessing or async for CPU-bound.',
    timeLimit: 150,
    tags: ['Python', 'GIL', 'Concurrency', 'Threading']
  },
  {
    id: 'q053',
    question: 'Explain Python decorators and write one that measures function execution time.',
    company: 'General',
    role: 'Python Developer',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Higher-order functions, functools.wraps, time.perf_counter.',
    timeLimit: 150,
    tags: ['Python', 'Decorators', 'Metaprogramming', 'Design Patterns']
  },
  {
    id: 'q054',
    question: 'How do you handle async programming in Python with asyncio?',
    company: 'General',
    role: 'Python Developer',
    type: 'Technical',
    difficulty: 'Hard',
    hint: 'Event loop, coroutines (async/await), asyncio.gather, aiohttp.',
    timeLimit: 180,
    tags: ['Python', 'Asyncio', 'Async Programming', 'Concurrency']
  },
  {
    id: 'q055',
    question: 'What are Python generators and when would you use them?',
    company: 'General',
    role: 'Python Developer',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'yield keyword, lazy evaluation, memory efficiency for large datasets.',
    timeLimit: 120,
    tags: ['Python', 'Generators', 'Iterators', 'Memory Efficiency']
  },
  {
    id: 'q056',
    question: 'Describe your experience with Python testing frameworks (pytest, unittest).',
    company: 'General',
    role: 'Python Developer',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'Fixtures, mocking, parametrize, coverage reports, CI integration.',
    timeLimit: 120,
    tags: ['Python', 'Testing', 'pytest', 'TDD']
  },

  // ───────── GENERAL – DATA ANALYST ─────────
  {
    id: 'q057',
    question: 'How would you detect and handle outliers in a dataset?',
    company: 'General',
    role: 'Data Analyst',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'IQR method, Z-score, domain knowledge, visualization (boxplot), removal vs. capping.',
    timeLimit: 150,
    tags: ['Data Analysis', 'Statistics', 'Outliers', 'Data Cleaning']
  },
  {
    id: 'q058',
    question: 'Write a SQL query to find the top 3 customers by revenue in each region.',
    company: 'General',
    role: 'Data Analyst',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Use window functions: ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC).',
    timeLimit: 180,
    tags: ['SQL', 'Window Functions', 'Analytics', 'Data Analysis']
  },
  {
    id: 'q059',
    question: 'Explain the difference between correlation and causation with a real-world example.',
    company: 'General',
    role: 'Data Analyst',
    type: 'Technical',
    difficulty: 'Easy',
    hint: 'Spurious correlations, confounding variables, A/B tests to establish causation.',
    timeLimit: 90,
    tags: ['Statistics', 'Correlation', 'Causation', 'Data Science']
  },
  {
    id: 'q060',
    question: 'How would you build a dashboard to track key business metrics for an e-commerce company?',
    company: 'General',
    role: 'Data Analyst',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'KPIs (GMV, conversion rate, churn), BI tools (Tableau, Looker), data refresh strategy.',
    timeLimit: 180,
    tags: ['BI', 'Dashboards', 'KPIs', 'Analytics', 'E-Commerce']
  },
  {
    id: 'q061',
    question: 'Tell me about a time your data analysis directly influenced a business decision.',
    company: 'General',
    role: 'Data Analyst',
    type: 'Behavioral',
    difficulty: 'Medium',
    hint: 'Quantify the impact. What was the business question, how did you frame the analysis?',
    timeLimit: 120,
    tags: ['Behavioral', 'Data-Driven Decisions', 'Business Impact']
  },
  {
    id: 'q062',
    question: 'What is p-value and how do you interpret it in hypothesis testing?',
    company: 'General',
    role: 'Data Analyst',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Probability of observing results as extreme as observed, given null hypothesis is true. α = 0.05.',
    timeLimit: 120,
    tags: ['Statistics', 'Hypothesis Testing', 'p-value', 'A/B Testing']
  },
  {
    id: 'q063',
    question: 'What is your greatest professional weakness, and what are you doing to address it?',
    company: 'General',
    role: 'Full Stack',
    type: 'HR',
    difficulty: 'Easy',
    hint: 'Be honest but strategic: choose a real weakness and show active steps to improve it.',
    timeLimit: 90,
    tags: ['Self-Awareness', 'Growth', 'HR', 'Weakness']
  },
  {
    id: 'q064',
    question: 'How do you prioritize tasks when you have multiple urgent deadlines?',
    company: 'General',
    role: 'Full Stack',
    type: 'Behavioral',
    difficulty: 'Easy',
    hint: 'Eisenhower Matrix, stakeholder communication, breaking down tasks, delegation.',
    timeLimit: 90,
    tags: ['Time Management', 'Prioritization', 'Productivity']
  },
  {
    id: 'q065',
    question: 'Explain the concept of microservices vs. monoliths and when you would choose each.',
    company: 'General',
    role: 'Backend',
    type: 'Technical',
    difficulty: 'Medium',
    hint: 'Team size, deployment complexity, network overhead, Conway\'s Law.',
    timeLimit: 150,
    tags: ['Architecture', 'Microservices', 'Monolith', 'System Design']
  }
];

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/questions
// Query params: company, role, type, difficulty (all optional, case-insensitive)
// ──────────────────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const { company, role, type, difficulty, count } = req.query;

    let filtered = [...ALL_QUESTIONS];

    if (company && company.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (q) => q.company.toLowerCase() === company.toLowerCase()
      );
    }

    if (role && role.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        (q) => q.role.toLowerCase() === role.toLowerCase()
      );
    }

    if (type && type.toLowerCase() !== 'mixed') {
      filtered = filtered.filter(
        (q) => q.type.toLowerCase() === type.toLowerCase()
      );
    }

    if (difficulty && difficulty.toLowerCase() !== 'any') {
      filtered = filtered.filter(
        (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Fallback 1: if zero questions found, search matching role or general
    if (filtered.length === 0) {
      filtered = ALL_QUESTIONS.filter(
        (q) => (role && q.role.toLowerCase() === role.toLowerCase()) || q.company.toLowerCase() === 'general'
      );
    }

    // Fallback 2: if still zero, just return general list
    if (filtered.length === 0) {
      filtered = ALL_QUESTIONS.slice(0, 15);
    }

    // Shuffle and slice to the requested count limit
    const limit = parseInt(count, 10) || 5;
    filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, limit);

    res.status(200).json({
      success: true,
      count: filtered.length,
      questions: filtered
    });
  } catch (error) {
    console.error('GetQuestions error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching questions' });
  }
});

module.exports = router;
