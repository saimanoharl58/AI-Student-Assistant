/**
 * ============================================================================
 * StudyMate AI - Modern College Study Assistant
 * Core Vanilla JavaScript Application
 * ============================================================================
 * Features:
 * - Single-page responsive navigation with hash support
 * - Study Dashboard with live calculated analytics & progress ring
 * - Offline AI Study Chat with fallback heuristics & modular backend support
 * - Rule-based Notes Summarizer with key-point extraction
 * - Multiple-Choice Quiz Generator with scoring & detailed explanations
 * - Study Planner with deadline tracking, priority, and filters
 * - 3D Flippable Revision Flashcards with active recall mastery tracking
 * - Light/Dark Theme toggle with localStorage persistence
 * - Data backup, JSON export/import, and demo data loader
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. STORAGE KEYS & INITIAL DEFAULT DATA
     ========================================================================== */
  const STORAGE_KEYS = {
    THEME: 'studymate_theme',
    TASKS: 'studymate_tasks',
    FLASHCARDS: 'studymate_flashcards',
    CHAT_HISTORY: 'studymate_chat_history',
    RECENT_ACTIVITY: 'studymate_recent_activity',
    STREAK: 'studymate_streak',
    BACKEND_CONFIG: 'studymate_backend_config'
  };

  // Curated College Sample Flashcards for immediate exploration
  const SAMPLE_FLASHCARDS = [
    {
      id: 'fc-1',
      subject: 'Computer Science',
      front: 'What are the four necessary conditions for a Deadlock to occur?',
      back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait (Coffman conditions)',
      status: 'needs-revision',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fc-2',
      subject: 'Computer Science',
      front: 'What is the average time complexity of QuickSort?',
      back: 'O(n log n) average time complexity, with O(log n) auxiliary stack space. Worst-case is O(n²) when unbalanced pivots are picked.',
      status: 'mastered',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fc-3',
      subject: 'Biology',
      front: 'What is the primary role of ATP Synthase in cellular respiration?',
      back: 'It utilizes the proton gradient across the inner mitochondrial membrane (chemiosmosis) to synthesize ATP from ADP and inorganic phosphate.',
      status: 'needs-revision',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fc-4',
      subject: 'Biology',
      front: 'What is the Central Dogma of Molecular Biology?',
      back: 'DNA is transcribed into RNA (mRNA), which is then translated into functional proteins: DNA -> RNA -> Protein.',
      status: 'mastered',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fc-5',
      subject: 'Mathematics',
      front: 'State the Fundamental Theorem of Calculus (Part 1).',
      back: 'If f is continuous on [a, b] and F is defined by F(x) = ∫[a, x] f(t) dt, then F is continuous on [a, b], differentiable on (a, b), and F\'(x) = f(x).',
      status: 'needs-revision',
      createdAt: new Date().toISOString()
    },
    {
      id: 'fc-6',
      subject: 'Psychology',
      front: 'What is the difference between Working Memory and Long-Term Memory?',
      back: 'Working memory temporarily holds and manipulates active information (capacity ~4-7 items, seconds to minutes), while long-term memory stores knowledge indefinitely via consolidation.',
      status: 'mastered',
      createdAt: new Date().toISOString()
    }
  ];

  // Curated College Sample Tasks
  const SAMPLE_TASKS = [
    {
      id: 'task-1',
      title: 'Operating Systems: Implement Semaphores Lab',
      description: 'Write the producer-consumer synchronization problem using POSIX semaphores and mutex locks.',
      subject: 'Computer Science',
      dueDate: getRelativeDateString(2),
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Cell Biology: Review Photosynthesis & Calvin Cycle',
      description: 'Prepare diagrams for Light-dependent reactions and NADPH formation.',
      subject: 'Biology',
      dueDate: getRelativeDateString(4),
      priority: 'medium',
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'Calculus III: Vector Calculus Problem Set 5',
      description: 'Complete questions 1 to 15 on Green\'s Theorem and surface integrals.',
      subject: 'Mathematics',
      dueDate: getRelativeDateString(1),
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-4',
      title: 'Psychology: Read Cognitive Biases Chapter',
      description: 'Summarize confirmation bias, availability heuristic, and anchoring effect.',
      subject: 'Psychology',
      dueDate: getRelativeDateString(-1), // overdue for demo
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];

  // College Question Bank for Offline Quiz Generation
  const QUESTION_BANK = {
    cs: [
      {
        question: 'Which data structure offers O(1) average time complexity for insertion, deletion, and lookup operations?',
        options: ['Hash Table', 'Binary Search Tree', 'Sorted Array', 'Linked List'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'Hash tables map keys to bucket indices using a hash function, providing O(1) average-case time complexity.'
      },
      {
        question: 'In operating systems, which scheduling algorithm can lead to the "convoy effect"?',
        options: ['First-Come, First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Multi-level Feedback Queue'],
        correct: 0,
        difficulty: 'medium',
        explanation: 'In FCFS, if a CPU-bound process with a huge burst time arrives first, all subsequent short I/O bound processes wait behind it, causing the convoy effect.'
      },
      {
        question: 'Which of the following is true about Virtual Memory?',
        options: [
          'It separates user logical memory from physical memory',
          'It requires all pages of a process to reside in physical RAM continuously',
          'It completely eliminates page faults',
          'It can only be used on 32-bit systems'
        ],
        correct: 0,
        difficulty: 'medium',
        explanation: 'Virtual memory separates logical address space from physical RAM, enabling processes larger than physical memory to execute via paging.'
      },
      {
        question: 'What is the worst-case time complexity of finding an element in a balanced AVL tree with n nodes?',
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'Because an AVL tree guarantees a height of at most 1.44 log₂(n), lookup is strictly O(log n) even in the worst case.'
      },
      {
        question: 'In computer networking, which protocol provides reliable, connection-oriented data transfer with congestion control?',
        options: ['TCP', 'UDP', 'IP', 'ICMP'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'TCP (Transmission Control Protocol) handles three-way handshakes, sequence numbers, acknowledgments, and window-based congestion control.'
      },
      {
        question: 'What is the primary difference between a process and a thread?',
        options: [
          'Threads within the same process share memory space and open files, whereas processes have independent memory spaces',
          'Processes cannot execute in parallel on multi-core processors',
          'Threads are always managed directly by the BIOS',
          'Processes take fewer resources to context switch than threads'
        ],
        correct: 0,
        difficulty: 'hard',
        explanation: 'Threads share the code, data, and heap segments of their parent process, making thread context switches much faster and memory footprint lighter.'
      }
    ],
    bio: [
      {
        question: 'Which organelle is considered the powerhouse of eukaryotic cells due to ATP production?',
        options: ['Mitochondrion', 'Golgi Apparatus', 'Endoplasmic Reticulum', 'Ribosome'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'Mitochondria generate most of the cell\'s chemical energy in the form of adenosine triphosphate (ATP) through oxidative phosphorylation.'
      },
      {
        question: 'During which phase of Mitosis do sister chromatids pull apart toward opposite poles of the cell?',
        options: ['Anaphase', 'Prophase', 'Metaphase', 'Telophase'],
        correct: 0,
        difficulty: 'medium',
        explanation: 'During anaphase, the cohesin proteins holding sister chromatids are cleaved, allowing spindle fibers to pull them to opposite poles.'
      },
      {
        question: 'Which enzyme is responsible for synthesizing mRNA by reading the DNA template strand?',
        options: ['RNA Polymerase', 'DNA Helicase', 'DNA Ligase', 'Reverse Transcriptase'],
        correct: 0,
        difficulty: 'medium',
        explanation: 'RNA Polymerase binds to the gene promoter and synthesizes a complementary single-stranded mRNA molecule in the 5\' to 3\' direction.'
      },
      {
        question: 'In genetics, what term describes having two identical alleles for a given gene locus?',
        options: ['Homozygous', 'Heterozygous', 'Hemizygous', 'Phenotype'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'Homozygous individuals carry two identical alleles (e.g., AA or aa) for a specific gene locus.'
      },
      {
        question: 'What is the end product of Glycolysis under aerobic conditions?',
        options: ['Pyruvate', 'Lactate', 'Ethanol', 'Acetyl-CoA'],
        correct: 0,
        difficulty: 'hard',
        explanation: 'One molecule of glucose (6 carbons) is broken down into two molecules of pyruvate (3 carbons each) alongside a net yield of 2 ATP and 2 NADH.'
      }
    ],
    psych: [
      {
        question: 'Who conducted the famous classical conditioning experiment involving dogs, meat powder, and a bell?',
        options: ['Ivan Pavlov', 'B.F. Skinner', 'Sigmund Freud', 'Jean Piaget'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'Ivan Pavlov discovered classical conditioning by demonstrating that dogs learned to salivate to a conditioned stimulus (bell) paired with an unconditioned stimulus (food).'
      },
      {
        question: 'Which cognitive bias causes people to favor information that confirms their preexisting beliefs?',
        options: ['Confirmation Bias', 'Availability Heuristic', 'Anchoring Bias', 'Dunning-Kruger Effect'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'Confirmation bias is the tendency to search for, interpret, favor, and recall information in a way that confirms one\'s prior hypotheses.'
      },
      {
        question: 'According to Jean Piaget, in which stage does a child develop conservation and logical thought regarding concrete events?',
        options: ['Concrete Operational Stage', 'Sensorimotor Stage', 'Preoperational Stage', 'Formal Operational Stage'],
        correct: 0,
        difficulty: 'medium',
        explanation: 'The Concrete Operational stage (approx. ages 7 to 11) is characterized by logical thinking about concrete objects and mastery of conservation.'
      },
      {
        question: 'What psychological phenomenon occurs when individuals in a group conform to reach consensus, suppressing dissenting viewpoints?',
        options: ['Groupthink', 'Social Loafing', 'Deindividuation', 'Bystander Effect'],
        correct: 0,
        difficulty: 'medium',
        explanation: 'Groupthink occurs when the desire for group harmony and conformity results in irrational or dysfunctional decision-making.'
      }
    ],
    math: [
      {
        question: 'What is the derivative of f(x) = e^(3x) with respect to x?',
        options: ['3e^(3x)', 'e^(3x)', '3x e^(3x-1)', '(1/3)e^(3x)'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'Using the chain rule: d/dx[e^u] = e^u * (du/dx). With u = 3x, du/dx = 3, so the derivative is 3e^(3x).'
      },
      {
        question: 'What does the integral ∫ 1/x dx evaluate to for x > 0?',
        options: ['ln(x) + C', '-1/x² + C', 'e^x + C', 'x + C'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'The anti-derivative of 1/x is the natural logarithm ln|x| + C.'
      },
      {
        question: 'In linear algebra, if the determinant of a square matrix A is 0, what does this indicate?',
        options: ['Matrix A is singular (non-invertible)', 'Matrix A is identity', 'Matrix A has linearly independent columns', 'Matrix A has rank equal to its dimension'],
        correct: 0,
        difficulty: 'medium',
        explanation: 'A zero determinant indicates that the matrix maps space onto a lower dimension, making it non-invertible (singular).'
      }
    ],
    history: [
      {
        question: 'In which year did the Industrial Revolution begin to transform manufacturing, starting primarily in Great Britain?',
        options: ['Mid-18th Century (~1760)', 'Early 16th Century (~1510)', 'Late 19th Century (~1890)', 'Early 20th Century (~1914)'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'The Industrial Revolution began in Britain around the 1760s with innovations like the steam engine and mechanized textile spinning.'
      },
      {
        question: 'Which treaty officially brought an end to World War I in 1919?',
        options: ['Treaty of Versailles', 'Treaty of Westphalia', 'Treaty of Paris', 'Treaty of Ghent'],
        correct: 0,
        difficulty: 'easy',
        explanation: 'The Treaty of Versailles was signed in June 1919 at the Palace of Versailles, formalizing the conclusion of World War I.'
      }
    ]
  };

  // Sample Lecture Notes for instant testing
  const SAMPLE_NOTE_TEXT = `Operating Systems: Concurrency, Deadlocks and Resource Management.
In modern computing, concurrency occurs when multiple instruction sequences execute simultaneously through multiprocessing or multithreading. While concurrency maximizes CPU utilization and throughput, it introduces race conditions where the final system state depends on unpredictable execution orders.

A critical section is a piece of code that accesses shared resources like memory or files. To avoid inconsistent data states, operating systems enforce mutual exclusion, progress, and bounded waiting. Synchronization primitives like semaphores, mutex locks, and monitors are employed to coordinate thread access.

A deadlock is a persistent condition where two or more processes are permanently blocked because each is holding a resource and waiting for another resource held by another process. For a deadlock to happen, four Coffman conditions must hold simultaneously:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process holding at least one resource is waiting to acquire additional resources held by other processes.
3. No Preemption: Resources cannot be forcibly confiscated from a process; they can only be released voluntarily.
4. Circular Wait: A closed loop of processes exists where each process waits for a resource held by the next.

Deadlock handling methods include Deadlock Prevention, Deadlock Avoidance (such as Dijkstra's Banker's Algorithm), and Deadlock Detection and Recovery. Understanding these principles ensures high performance in distributed systems and cloud microservices.`;

  // Daily Study Tips Catalog
  const STUDY_TIPS = [
    {
      title: 'The Pomodoro Technique',
      content: 'Study with high focus for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 20-minute rest. This prevents cognitive burnout and maintains concentration.'
    },
    {
      title: 'The Feynman Technique',
      content: 'Explain a difficult concept in simple terms as if teaching a child. Whenever you encounter jargon or confusion, consult your textbook to fill the gap. True understanding is simplicity.'
    },
    {
      title: 'Active Recall vs. Passive Reading',
      content: 'Closing your book and testing what you recall yields 50% higher exam retention than highlighting or re-reading notes. Use flashcards and practice quizzes frequently!'
    },
    {
      title: 'Spaced Repetition Intervals',
      content: 'Review new material within 24 hours, then at 3 days, 1 week, and 1 month. Spacing out reviews interrupts the Ebbinghaus Forgetting Curve and locks information into long-term memory.'
    },
    {
      title: 'Interleaved Practice',
      content: 'Don\'t study only one subject all day. Alternate between related topics (e.g., 1 hour of Algorithms followed by 1 hour of Calculus). Interleaving trains your brain to categorize problem types.'
    }
  ];

  /* ==========================================================================
     2. APPLICATION STATE
     ========================================================================== */
  const state = {
    theme: 'light',
    currentSection: 'dashboard',
    tasks: [],
    flashcards: [],
    chatHistory: [],
    recentActivity: [],
    streak: { count: 1, lastActiveDate: getTodayDateString() },
    backendConfig: {
      baseUrl: 'http://localhost:3000/api',
      chatEndpoint: '/chat',
      summarizeEndpoint: '/summarize',
      quizEndpoint: '/quiz'
    },
    // Active Quiz Session
    quizSession: {
      questions: [],
      currentIndex: 0,
      userAnswers: {},
      isSubmitted: false,
      score: 0,
      subjectName: '',
      difficulty: 'medium'
    },
    // Flashcard Deck View Session
    flashcardSession: {
      filteredCards: [],
      currentIndex: 0,
      isFlipped: false,
      filterSubject: 'all',
      filterStatus: 'all'
    },
    // Tip index
    currentTipIndex: 0
  };

  /* ==========================================================================
     3. DOM ELEMENT REFERENCES
     ========================================================================== */
  const DOM = {
    // Layout & Nav
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    toggleSidebarBtn: document.getElementById('toggle-sidebar-btn'),
    closeSidebarBtn: document.getElementById('close-sidebar-btn'),
    navItems: document.querySelectorAll('.nav-item'),
    sections: document.querySelectorAll('.content-section'),
    currentPageTitle: document.getElementById('current-page-title'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    systemStatusText: document.getElementById('system-status-text'),
    toastContainer: document.getElementById('toast-container'),

    // Streak
    streakBadge: document.getElementById('study-streak-badge'),
    streakDaysCount: document.getElementById('streak-days-count'),

    // Dashboard
    statTotalTasks: document.getElementById('stat-total-tasks'),
    statTotalSubtext: document.getElementById('stat-total-subtext'),
    statCompletedTasks: document.getElementById('stat-completed-tasks'),
    statCompletionPct: document.getElementById('stat-completion-pct'),
    statPendingTasks: document.getElementById('stat-pending-tasks'),
    statPendingSubtext: document.getElementById('stat-pending-subtext'),
    statOverdueTasks: document.getElementById('stat-overdue-tasks'),
    statOverdueSubtext: document.getElementById('stat-overdue-subtext'),
    dashOverallProgressBar: document.getElementById('dash-overall-progress-bar'),
    dashCirclePct: document.getElementById('dash-circle-pct'),
    dashStatCompletedNum: document.getElementById('dash-stat-completed-num'),
    dashStatTotalNum: document.getElementById('dash-stat-total-num'),
    subjectProgressContainer: document.getElementById('subject-progress-container'),
    recentActivityList: document.getElementById('recent-activity-list'),
    clearActivityBtn: document.getElementById('clear-activity-btn'),
    loadSampleDataBtn: document.getElementById('load-sample-data-btn'),
    dashAddTaskBtn: document.getElementById('dash-add-task-btn'),

    // Chat
    chatMessages: document.getElementById('chat-messages'),
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),
    clearChatBtn: document.getElementById('clear-chat-btn'),
    chatSuggestions: document.getElementById('chat-suggestions'),

    // Summarizer
    notesForm: document.getElementById('notes-form'),
    noteTitle: document.getElementById('note-title'),
    summaryLength: document.getElementById('summary-length'),
    summaryFormat: document.getElementById('summary-format'),
    noteContent: document.getElementById('note-content'),
    notesWordCount: document.getElementById('notes-word-count'),
    notesValidationMsg: document.getElementById('notes-validation-msg'),
    loadSampleNoteBtn: document.getElementById('load-sample-note-btn'),
    clearNotesBtn: document.getElementById('clear-notes-btn'),
    summaryEmptyState: document.getElementById('summary-empty-state'),
    summaryResultContent: document.getElementById('summary-result-content'),
    summaryActionsBar: document.getElementById('summary-actions-bar'),
    summaryOverviewBox: document.getElementById('summary-overview-box'),
    summaryBulletsList: document.getElementById('summary-bullets-list'),
    summaryKeywordsCloud: document.getElementById('summary-keywords-cloud'),
    summaryKeywordsSection: document.getElementById('summary-keywords-section'),
    copySummaryBtn: document.getElementById('copy-summary-btn'),
    turnSummaryToFlashcardBtn: document.getElementById('turn-summary-to-flashcard-btn'),
    statOrigWords: document.getElementById('stat-orig-words'),
    statSumWords: document.getElementById('stat-sum-words'),
    statCompressionRatio: document.getElementById('stat-compression-ratio'),
    statTimeSaved: document.getElementById('stat-time-saved'),

    // Quiz
    quizSetupPanel: document.getElementById('quiz-setup-panel'),
    quizPlayPanel: document.getElementById('quiz-play-panel'),
    quizResultsPanel: document.getElementById('quiz-results-panel'),
    quizConfigForm: document.getElementById('quiz-config-form'),
    quizSourcePreset: document.getElementById('quiz-source-preset'),
    quizSourceCustom: document.getElementById('quiz-source-custom'),
    quizSubjectGroup: document.getElementById('quiz-subject-group'),
    quizCustomTextGroup: document.getElementById('quiz-custom-text-group'),
    quizSubjectSelect: document.getElementById('quiz-subject-select'),
    quizCustomText: document.getElementById('quiz-custom-text'),
    quizDifficulty: document.getElementById('quiz-difficulty'),
    quizCount: document.getElementById('quiz-count'),
    quizPlaySubjectBadge: document.getElementById('quiz-play-subject-badge'),
    quizPlayDifficultyBadge: document.getElementById('quiz-play-difficulty-badge'),
    quizCurrentQNum: document.getElementById('quiz-current-q-num'),
    quizTotalQNum: document.getElementById('quiz-total-q-num'),
    quizProgressBarFill: document.getElementById('quiz-progress-bar-fill'),
    quizQuestionText: document.getElementById('quiz-question-text'),
    quizOptionsContainer: document.getElementById('quiz-options-container'),
    quizPrevBtn: document.getElementById('quiz-prev-btn'),
    quizNextBtn: document.getElementById('quiz-next-btn'),
    quizSubmitBtn: document.getElementById('quiz-submit-btn'),
    resultsScoreText: document.getElementById('results-score-text'),
    resultsPctText: document.getElementById('results-pct-text'),
    resultsGradeTitle: document.getElementById('results-grade-title'),
    resultsFeedbackText: document.getElementById('results-feedback-text'),
    quizRetakeBtn: document.getElementById('quiz-retake-btn'),
    quizNewBtn: document.getElementById('quiz-new-btn'),
    quizReviewContainer: document.getElementById('quiz-review-container'),

    // Planner / Tasks
    plannerAddTaskBtn: document.getElementById('planner-add-task-btn'),
    tasksContainer: document.getElementById('tasks-container'),
    tasksEmptyState: document.getElementById('tasks-empty-state'),
    emptyAddTaskBtn: document.getElementById('empty-add-task-btn'),
    taskSubjectFilter: document.getElementById('task-subject-filter'),
    taskSortBy: document.getElementById('task-sort-by'),
    countAllTasks: document.getElementById('count-all-tasks'),
    countPendingTasks: document.getElementById('count-pending-tasks'),
    countCompletedTasks: document.getElementById('count-completed-tasks'),
    countOverdueTasks: document.getElementById('count-overdue-tasks'),
    taskTabBtns: document.querySelectorAll('.task-tab-btn'),

    // Flashcards
    shuffleFlashcardsBtn: document.getElementById('shuffle-flashcards-btn'),
    newFlashcardBtn: document.getElementById('new-flashcard-btn'),
    fcPositionText: document.getElementById('fc-position-text'),
    fcMasteryText: document.getElementById('fc-mastery-text'),
    fcMasteryBarFill: document.getElementById('fc-mastery-bar-fill'),
    fcSubjectFilter: document.getElementById('fc-subject-filter'),
    fcStatusFilter: document.getElementById('fc-status-filter'),
    fcDeckViewBtn: document.getElementById('fc-deck-view-btn'),
    fcGridViewBtn: document.getElementById('fc-grid-view-btn'),
    fcDeckView: document.getElementById('fc-deck-view'),
    fcGridView: document.getElementById('fc-grid-view'),
    activeFlashcard: document.getElementById('active-flashcard'),
    fcFrontSubject: document.getElementById('fc-front-subject'),
    fcBackSubject: document.getElementById('fc-back-subject'),
    fcFrontText: document.getElementById('fc-front-text'),
    fcBackText: document.getElementById('fc-back-text'),
    fcFrontStatus: document.getElementById('fc-front-status'),
    fcBackStatus: document.getElementById('fc-back-status'),
    fcPrevBtn: document.getElementById('fc-prev-btn'),
    fcNextBtn: document.getElementById('fc-next-btn'),
    fcMarkNeedsRevisionBtn: document.getElementById('fc-mark-needs-revision-btn'),
    fcMarkMasteredBtn: document.getElementById('fc-mark-mastered-btn'),
    fcEditCardBtn: document.getElementById('fc-edit-card-btn'),
    fcDeleteCardBtn: document.getElementById('fc-delete-card-btn'),
    flashcardsEmptyState: document.getElementById('flashcards-empty-state'),
    emptyAddFcBtn: document.getElementById('empty-add-fc-btn'),
    emptyLoadFcBtn: document.getElementById('empty-load-fc-btn'),
    flashcardsTableBody: document.getElementById('flashcards-table-body'),

    // Settings
    backendSettingsForm: document.getElementById('backend-settings-form'),
    backendUrlInput: document.getElementById('backend-url-input'),
    testBackendConnectionBtn: document.getElementById('test-backend-connection-btn'),
    backendTestResult: document.getElementById('backend-test-result'),
    exportDataBtn: document.getElementById('export-data-btn'),
    importDataFileInput: document.getElementById('import-data-file-input'),
    resetAllDataBtn: document.getElementById('reset-all-data-btn'),
    settingsBackendStatusBadge: document.getElementById('settings-backend-status-badge'),

    // Modals
    taskModal: document.getElementById('task-modal'),
    taskModalBackdrop: document.getElementById('task-modal-backdrop'),
    taskModalCloseBtn: document.getElementById('task-modal-close-btn'),
    taskModalCancelBtn: document.getElementById('task-modal-cancel-btn'),
    taskForm: document.getElementById('task-form'),
    taskIdInput: document.getElementById('task-id-input'),
    taskTitleInput: document.getElementById('task-title-input'),
    taskDescInput: document.getElementById('task-desc-input'),
    taskSubjectInput: document.getElementById('task-subject-input'),
    taskPriorityInput: document.getElementById('task-priority-input'),
    taskDueDateInput: document.getElementById('task-due-date-input'),
    taskModalTitle: document.getElementById('task-modal-title'),

    flashcardModal: document.getElementById('flashcard-modal'),
    fcModalBackdrop: document.getElementById('fc-modal-backdrop'),
    fcModalCloseBtn: document.getElementById('fc-modal-close-btn'),
    fcModalCancelBtn: document.getElementById('fc-modal-cancel-btn'),
    flashcardForm: document.getElementById('flashcard-form'),
    fcIdInput: document.getElementById('fc-id-input'),
    fcSubjectInput: document.getElementById('fc-subject-input'),
    fcFrontInput: document.getElementById('fc-front-input'),
    fcBackInput: document.getElementById('fc-back-input'),
    fcStatusInput: document.getElementById('fc-status-input'),
    fcModalTitle: document.getElementById('fc-modal-title'),

    confirmModal: document.getElementById('confirm-modal'),
    confirmModalBackdrop: document.getElementById('confirm-modal-backdrop'),
    confirmModalCloseBtn: document.getElementById('confirm-modal-close-btn'),
    confirmCancelBtn: document.getElementById('confirm-cancel-btn'),
    confirmOkBtn: document.getElementById('confirm-ok-btn'),
    confirmModalMessage: document.getElementById('confirm-modal-message')
  };

  /* ==========================================================================
     4. SAFE STORAGE HELPERS
     ========================================================================== */
  function loadFromStorage(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      if (data === null || data === undefined) return defaultValue;
      return JSON.parse(data);
    } catch (e) {
      console.warn(`[Storage Warning] Error reading key "${key}" from localStorage:`, e);
      return defaultValue;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[Storage Warning] Error saving key "${key}" to localStorage:`, e);
      showToast('Storage limit reached or local storage unavailable.', 'error');
      return false;
    }
  }

  /* ==========================================================================
     5. UTILITY FUNCTIONS
     ========================================================================== */
  function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  function getRelativeDateString(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return 'No due date';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  function formatTimeAgo(isoString) {
    if (!isoString) return '';
    try {
      const past = new Date(isoString).getTime();
      const now = Date.now();
      const diffSecs = Math.floor((now - past) / 1000);
      if (diffSecs < 60) return 'Just now';
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return '';
    }
  }

  function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  function showToast(message, type = 'info') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-msg">${escapeHtml(message)}</div>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 3500);
  }

  // Confirmation dialog promise helper
  let confirmResolver = null;
  function showConfirmDialog(message) {
    return new Promise(resolve => {
      confirmResolver = resolve;
      DOM.confirmModalMessage.textContent = message;
      DOM.confirmModal.removeAttribute('hidden');
      DOM.confirmOkBtn.focus();
    });
  }

  function closeConfirmDialog(result) {
    DOM.confirmModal.setAttribute('hidden', '');
    if (confirmResolver) {
      confirmResolver(result);
      confirmResolver = null;
    }
  }

  /* ==========================================================================
     6. RECENT ACTIVITY LOGGING & STREAK TRACKING
     ========================================================================== */
  function logActivity(text) {
    const activityItem = {
      id: 'act-' + Date.now(),
      text: text,
      timestamp: new Date().toISOString()
    };
    state.recentActivity.unshift(activityItem);
    if (state.recentActivity.length > 8) {
      state.recentActivity.pop();
    }
    saveToStorage(STORAGE_KEYS.RECENT_ACTIVITY, state.recentActivity);
    renderRecentActivity();
    updateStreak();
  }

  function renderRecentActivity() {
    if (!DOM.recentActivityList) return;
    if (state.recentActivity.length === 0) {
      DOM.recentActivityList.innerHTML = `
        <li class="activity-item text-muted" style="justify-content: center; padding: 16px 0;">
          No recent activity logged. Complete a task or study flashcards to get started!
        </li>
      `;
      return;
    }

    DOM.recentActivityList.innerHTML = state.recentActivity.map(item => `
      <li class="activity-item">
        <span class="activity-dot"></span>
        <div class="activity-text">${escapeHtml(item.text)}</div>
        <span class="activity-time">${formatTimeAgo(item.timestamp)}</span>
      </li>
    `).join('');
  }

  function updateStreak() {
    const today = getTodayDateString();
    const lastActive = state.streak.lastActiveDate;

    if (lastActive === today) {
      // already counted today
    } else {
      const yesterday = getRelativeDateString(-1);
      if (lastActive === yesterday) {
        state.streak.count += 1;
      } else {
        // missed days, reset to 1
        state.streak.count = 1;
      }
      state.streak.lastActiveDate = today;
      saveToStorage(STORAGE_KEYS.STREAK, state.streak);
    }

    if (DOM.streakDaysCount) {
      DOM.streakDaysCount.textContent = state.streak.count;
    }
  }

  /* ==========================================================================
     7. THEME MANAGEMENT
     ========================================================================== */
  function initTheme() {
    const savedTheme = loadFromStorage(STORAGE_KEYS.THEME, null);
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    DOM.themeToggleBtn.addEventListener('click', () => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }

  function setTheme(theme) {
    state.theme = theme;
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    saveToStorage(STORAGE_KEYS.THEME, theme);
  }

  /* ==========================================================================
     8. NAVIGATION & ROUTING
     ========================================================================== */
  function initNavigation() {
    // Nav Items click
    DOM.navItems.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const sectionId = btn.getAttribute('data-section');
        navigateToSection(sectionId);
        closeMobileSidebar();
      });
    });

    // Quick action cards click
    document.querySelectorAll('[data-section]').forEach(el => {
      if (!el.classList.contains('nav-item')) {
        el.addEventListener('click', e => {
          e.preventDefault();
          const target = el.getAttribute('data-section');
          navigateToSection(target);
        });
      }
    });

    // Mobile Sidebar Toggles
    DOM.toggleSidebarBtn.addEventListener('click', openMobileSidebar);
    DOM.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
    DOM.sidebarOverlay.addEventListener('click', closeMobileSidebar);

    // Hash change handler
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
  }

  function openMobileSidebar() {
    DOM.sidebar.classList.add('open');
    DOM.sidebarOverlay.classList.add('active');
    DOM.sidebarOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeMobileSidebar() {
    DOM.sidebar.classList.remove('open');
    DOM.sidebarOverlay.classList.remove('active');
    DOM.sidebarOverlay.setAttribute('aria-hidden', 'true');
  }

  function handleHashChange() {
    const hash = window.location.hash.replace('#', '').trim();
    const validSections = ['dashboard', 'chat', 'summarizer', 'quiz', 'planner', 'flashcards', 'settings'];
    if (validSections.includes(hash)) {
      navigateToSection(hash, false);
    } else {
      navigateToSection('dashboard', false);
    }
  }

  function navigateToSection(sectionId, updateHash = true) {
    state.currentSection = sectionId;

    // Update active nav button
    DOM.navItems.forEach(btn => {
      const match = btn.getAttribute('data-section') === sectionId;
      btn.classList.toggle('active', match);
      if (match) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    // Update visible section
    DOM.sections.forEach(sec => {
      if (sec.id === `section-${sectionId}`) {
        sec.classList.add('active-section');
        sec.removeAttribute('hidden');
      } else {
        sec.classList.remove('active-section');
        sec.setAttribute('hidden', '');
      }
    });

    // Update Header Breadcrumb Title
    const titles = {
      dashboard: 'Study Dashboard',
      chat: 'AI Study Chat',
      summarizer: 'Notes Summarizer',
      quiz: 'Quiz Generator',
      planner: 'Study Planner',
      flashcards: 'Revision Flashcards',
      settings: 'Settings & Data'
    };
    DOM.currentPageTitle.textContent = titles[sectionId] || 'Dashboard';

    if (updateHash) {
      window.location.hash = sectionId;
    }

    // Trigger feature refreshes on navigation
    if (sectionId === 'dashboard') {
      updateDashboardAnalytics();
      renderRecentActivity();
    } else if (sectionId === 'planner') {
      renderTasks();
    } else if (sectionId === 'flashcards') {
      updateFlashcardsDeck();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ==========================================================================
     9. FEATURE 1: DASHBOARD & STUDY ANALYTICS
     ========================================================================== */
  function updateDashboardAnalytics() {
    const todayStr = getTodayDateString();
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    // Overdue Tasks: incomplete tasks whose due dates have passed
    const overdue = state.tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;
    // Pending Tasks: tasks that are not completed and are not overdue
    const pending = state.tasks.filter(t => !t.completed && (!t.dueDate || t.dueDate >= todayStr)).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Key Metric Cards (Display-Only Summary Cards)
    if (DOM.statTotalTasks) DOM.statTotalTasks.textContent = total;
    if (DOM.statTotalSubtext) {
      DOM.statTotalSubtext.textContent = total === 1 ? '1 registered task' : `${total} registered tasks`;
    }

    if (DOM.statCompletedTasks) DOM.statCompletedTasks.textContent = completed;
    if (DOM.statCompletionPct) DOM.statCompletionPct.textContent = `${completionRate}% completed`;

    if (DOM.statPendingTasks) DOM.statPendingTasks.textContent = pending;
    if (DOM.statPendingSubtext) {
      DOM.statPendingSubtext.textContent = pending === 1 ? '1 task on track' : `${pending} tasks on track`;
    }

    if (DOM.statOverdueTasks) {
      DOM.statOverdueTasks.textContent = overdue;
      if (overdue > 0) {
        DOM.statOverdueTasks.classList.add('text-red');
      } else {
        DOM.statOverdueTasks.classList.remove('text-red');
      }
    }
    if (DOM.statOverdueSubtext) {
      DOM.statOverdueSubtext.textContent = overdue === 0 ? 'All deadlines on track' : `${overdue} deadline${overdue > 1 ? 's' : ''} passed`;
    }

    // Overall Progress Bar & Percentage
    if (DOM.dashCirclePct) DOM.dashCirclePct.textContent = `${completionRate}%`;
    if (DOM.dashOverallProgressBar) {
      DOM.dashOverallProgressBar.style.width = `${completionRate}%`;
    }

    if (DOM.dashStatCompletedNum) DOM.dashStatCompletedNum.textContent = completed;
    if (DOM.dashStatTotalNum) DOM.dashStatTotalNum.textContent = total;

    // Subject-Wise Progress Breakdown
    renderSubjectBreakdown();
  }

  function renderSubjectBreakdown() {
    if (!DOM.subjectProgressContainer) return;

    if (state.tasks.length === 0) {
      DOM.subjectProgressContainer.innerHTML = `
        <div class="empty-state" style="padding: 16px 0;">
          <p class="text-muted" style="font-size: 0.85rem;">No courses recorded yet. Add study tasks in the Planner to view subject progress.</p>
        </div>
      `;
      return;
    }

    // Group tasks by subject
    const subjectMap = {};
    state.tasks.forEach(task => {
      const sub = task.subject ? task.subject.trim() : 'General';
      if (!subjectMap[sub]) {
        subjectMap[sub] = { total: 0, completed: 0 };
      }
      subjectMap[sub].total += 1;
      if (task.completed) subjectMap[sub].completed += 1;
    });

    const subjects = Object.keys(subjectMap);
    DOM.subjectProgressContainer.innerHTML = subjects.map(sub => {
      const data = subjectMap[sub];
      const pct = Math.round((data.completed / data.total) * 100);
      return `
        <div class="subject-item">
          <div class="subject-item-header">
            <span class="subject-name">${escapeHtml(sub)}</span>
            <span class="subject-stats">${data.completed} of ${data.total} (${pct}%)</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function initStudyTips() {
    // Study tips widget simplified out of dashboard
  }

  function updateTipDisplay() {
    // Study tips widget simplified out of dashboard
  }

  /* ==========================================================================
     10. FEATURE 2: AI STUDY CHAT (GOOGLE GEMINI API VIA BACKEND)
     ========================================================================== */
  function getChatEndpointUrl() {
    if (window.location.protocol.startsWith('http')) {
      return `${window.location.origin}/api/chat`;
    }
    const base = state.backendConfig.baseUrl || 'http://localhost:3000/api';
    return `${base.replace(/\/+$/, '')}/chat`;
  }

  function getHealthEndpointUrl() {
    if (window.location.protocol.startsWith('http')) {
      return `${window.location.origin}/api/health`;
    }
    const base = state.backendConfig.baseUrl || 'http://localhost:3000/api';
    return `${base.replace(/\/+$/, '')}/health`;
  }

  async function checkBackendHealth() {
    try {
      const res = await fetch(getHealthEndpointUrl(), { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        const chatBanner = document.getElementById('chat-mode-banner');
        if (data.hasKey) {
          if (DOM.systemStatusText) DOM.systemStatusText.textContent = 'Gemini AI Online';
          if (DOM.settingsBackendStatusBadge) {
            DOM.settingsBackendStatusBadge.textContent = 'Gemini Online';
            DOM.settingsBackendStatusBadge.className = 'badge badge-success';
          }
          if (chatBanner) {
            chatBanner.className = 'banner banner-info';
            chatBanner.innerHTML = `
              <div class="banner-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="banner-content">
                <strong>Online Gemini AI Active:</strong> Connected to Google Gemini (<code>gemini-2.5-flash</code>) through the local secure backend proxy. All responses are generated by live AI.
              </div>
            `;
          }
        } else {
          if (DOM.systemStatusText) DOM.systemStatusText.textContent = 'Missing API Key';
          if (DOM.settingsBackendStatusBadge) {
            DOM.settingsBackendStatusBadge.textContent = 'Missing Key';
            DOM.settingsBackendStatusBadge.className = 'badge badge-warning';
          }
          if (chatBanner) {
            chatBanner.className = 'banner banner-info';
            chatBanner.innerHTML = `
              <div class="banner-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="banner-content">
                <strong>Server Connected, Key Required:</strong> Backend is running on port 3000, but <code>GEMINI_API_KEY</code> is not yet configured in your <code>.env</code> file. Add your key from Google AI Studio and restart the server.
              </div>
            `;
          }
        }
      }
    } catch (e) {
      // Backend not running yet (static local file view)
      if (DOM.systemStatusText) DOM.systemStatusText.textContent = 'Server Not Running';
    }
  }

  function initChat() {
    state.chatHistory = loadFromStorage(STORAGE_KEYS.CHAT_HISTORY, [
      {
        id: 'msg-init',
        role: 'assistant',
        text: 'Hello! I am your AI Study Assistant powered by Google Gemini. Ask me to explain difficult topics, outline study schedules, practice active recall, or break down lecture notes.',
        timestamp: new Date().toISOString()
      }
    ]);

    renderChatMessages();
    checkBackendHealth();

    // Chat form submit
    DOM.chatForm.addEventListener('submit', e => {
      e.preventDefault();
      handleChatSubmit();
    });

    // Enter to submit, Shift+Enter for new line
    DOM.chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatSubmit();
      }
    });

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        DOM.chatInput.value = prompt;
        handleChatSubmit();
      });
    });

    // Clear chat button
    DOM.clearChatBtn.addEventListener('click', async () => {
      const confirmed = await showConfirmDialog('Are you sure you want to clear the entire chat conversation history?');
      if (confirmed) {
        state.chatHistory = [
          {
            id: 'msg-reset',
            role: 'assistant',
            text: 'Conversation history cleared. How can I assist your college studies today?',
            timestamp: new Date().toISOString()
          }
        ];
        saveToStorage(STORAGE_KEYS.CHAT_HISTORY, state.chatHistory);
        renderChatMessages();
        showToast('Chat history cleared', 'info');
      }
    });
  }

  function renderChatMessages() {
    if (!DOM.chatMessages) return;
    DOM.chatMessages.innerHTML = state.chatHistory.map(msg => {
      const isUser = msg.role === 'user';
      return `
        <div class="chat-message ${isUser ? 'user' : 'assistant'}">
          <div class="chat-avatar" aria-hidden="true">${isUser ? 'You' : 'AI'}</div>
          <div class="chat-bubble">
            ${formatChatText(msg.text)}
            <span class="chat-timestamp">${formatTimeAgo(msg.timestamp)}</span>
          </div>
        </div>
      `;
    }).join('');

    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  }

  function formatChatText(text) {
    if (!text) return '';
    // Basic Markdown formatting for bold, lists, and code
    let formatted = escapeHtml(text);
    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italics *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Newlines to <br> or paragraphs
    formatted = formatted.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    return `<p>${formatted}</p>`;
  }

  async function handleChatSubmit() {
    const rawText = DOM.chatInput.value.trim();
    if (!rawText) return;

    // Add user message
    const userMsg = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: rawText,
      timestamp: new Date().toISOString()
    };
    state.chatHistory.push(userMsg);
    saveToStorage(STORAGE_KEYS.CHAT_HISTORY, state.chatHistory);
    renderChatMessages();
    DOM.chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
      // Send message to real Gemini AI backend
      const assistantReply = await dispatchChatRequest(rawText, state.chatHistory);
      removeTypingIndicator();

      const assistantMsg = {
        id: 'msg-' + Date.now(),
        role: 'assistant',
        text: assistantReply,
        timestamp: new Date().toISOString()
      };
      state.chatHistory.push(assistantMsg);
      saveToStorage(STORAGE_KEYS.CHAT_HISTORY, state.chatHistory);
      renderChatMessages();
      logActivity(`Asked Gemini assistant: "${rawText.slice(0, 30)}..."`);
    } catch (err) {
      removeTypingIndicator();
      console.error('Chat dispatch error:', err);
      const errorMsg = {
        id: 'msg-' + Date.now(),
        role: 'assistant',
        text: `⚠️ **AI Study Chat Error:**\n\n${err.message || 'Unable to connect to the Gemini AI backend.'}\n\n*Setup Instructions:* Ensure your Node.js backend server is running (\`npm start\`) and a valid \`GEMINI_API_KEY\` is configured in your \`.env\` file.`,
        timestamp: new Date().toISOString()
      };
      state.chatHistory.push(errorMsg);
      saveToStorage(STORAGE_KEYS.CHAT_HISTORY, state.chatHistory);
      renderChatMessages();
      showToast(err.message ? err.message.slice(0, 60) : 'Chat request failed', 'error');
    }
  }

  function showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.id = 'chat-typing-indicator';
    typingEl.className = 'chat-message assistant';
    typingEl.innerHTML = `
      <div class="chat-avatar" aria-hidden="true">AI</div>
      <div class="chat-bubble">
        <div class="typing-dots" aria-label="Assistant is thinking">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    DOM.chatMessages.appendChild(typingEl);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const typingEl = document.getElementById('chat-typing-indicator');
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
  }

  /**
   * Dispatches chat request to the real Node.js/Express Google Gemini API backend.
   * Sends user query and recent conversational history with timeout and error handling.
   */
  async function dispatchChatRequest(userMessage, conversationHistory) {
    const url = getChatEndpointUrl();

    // 35-second timeout for online Google Gemini generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory.slice(-8)
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Server returned non-JSON response (${response.status} ${response.statusText}).`);
      }

      if (response.ok && data && data.reply) {
        return data.reply;
      }

      // Check for structured server errors (e.g. missing API key, invalid key, rate limit)
      if (data && data.error) {
        throw new Error(data.error);
      }

      throw new Error(`Server returned HTTP ${response.status} (${response.statusText}).`);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Gemini API request timed out (exceeded 35 seconds). Please check your internet connection.');
      }
      if (err.message && err.message.includes('Failed to fetch')) {
        throw new Error(`Unable to connect to the backend server at ${url}. Please verify the Node.js server is running (\`npm start\`).`);
      }
      throw err;
    }
  }

  /**
   * Transparent Rule-Based Offline Study Helper
   * Provides educational advice for common college study queries.
   */
  function generateOfflineChatResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('feynman')) {
      return `**The Feynman Technique (4 Steps to Mastery):**\n\n1. **Choose the Concept:** Write down the topic (e.g., Dijkstra's algorithm, Photosynthesis).\n2. **Teach It Simply:** Write an explanation as if teaching a student with no background knowledge. Use plain analogies.\n3. **Identify Knowledge Gaps:** Whenever you struggle for words or rely on complex jargon, refer back to your lecture notes or textbook.\n4. **Refine & Simplify:** Consolidate your explanation with a clean visual diagram or simplified summary.`;
    }

    if (q.includes('pomodoro')) {
      return `**The Pomodoro Routine for College Work:**\n\n- **25 min Work:** Zero distractions, phone silenced, single study task.\n- **5 min Rest:** Step away from the screen, stretch, hydrate.\n- **Repeat 4 Times**, then take a **20-30 min Long Break**.\n\n*College Tip:* Schedule 2 Pomodoros for reviewing theory, and 2 Pomodoros for working through problem sets.`;
    }

    if (q.includes('active recall') || q.includes('spaced repetition')) {
      return `**Active Recall & Spaced Repetition Principles:**\n\n- **Testing Effect:** Forcing your brain to retrieve knowledge creates stronger neural pathways than passive re-reading.\n- **Practical Strategy:** After completing a chapter, close your notes and write a 5-bullet summary from memory, then verify.\n- **Review Schedule:** Day 1 (immediate), Day 3, Day 7, Day 14, and Day 30 before midterms.`;
    }

    if (q.includes('finals') || q.includes('schedule') || q.includes('exam')) {
      return `**College Finals Week Prep Strategy:**\n\n1. **Audit Your Syllabus:** List every exam date, weight, and remaining weak topics in the Study Planner.\n2. **Prioritize by Impact:** Spend 70% of revision time on high-weight or mathematically challenging concepts.\n3. **Practice Past Papers:** Practice with timed conditions to build speed and reduce test anxiety.\n4. **Sleep Prioritization:** Memory consolidation occurs during deep sleep. Sacrificing sleep for all-nighters degrades recall by up to 40%.`;
    }

    if (q.includes('procrastination') || q.includes('focus')) {
      return `**Overcoming Study Procrastination:**\n\n- **The 5-Minute Rule:** Commit to working on your assignment for just 5 minutes. The hurdle is almost always starting.\n- **Lower Friction:** Have your notes open and IDE/calculator ready the night before.\n- **Break Down Large Tasks:** Instead of "Write 10-page thesis", make a task "Write thesis outline and find 3 citations."`;
    }

    if (q.includes('deadlock') || q.includes('operating system')) {
      return `**Operating Systems Concept Summary:**\n\nA **Deadlock** happens when processes holding resources are simultaneously waiting for others in a cyclic chain. The 4 required conditions are **Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait**.\n\nYou can use the **Notes Summarizer** tab to paste full OS lecture notes for bullet breakdown!`;
    }

    // Default intelligent guidance
    return `**Offline Study Assistant Guidance:**\n\nHere are actionable steps for: "${escapeHtml(query)}"\n\n1. **Core Concept Clarification:** Break this question down into core fundamentals. What are the key definitions and formulas?\n2. **Active Testing:** Create 2-3 flashcards in the **Revision Flashcards** tab covering the trickiest definitions.\n3. **Application:** Solve a practice problem or generate an MCQ quiz in the **Quiz Generator** to measure your grasp.\n\n*Tip:* To connect a live generative LLM like Gemini or OpenAI, configure the backend API proxy in **Settings**!`;
  }

  /* ==========================================================================
     11. FEATURE 3: NOTES SUMMARIZER (RULE-BASED EXTRACTIVE ENGINE)
     ========================================================================== */
  function initNotesSummarizer() {
    DOM.notesForm.addEventListener('submit', e => {
      e.preventDefault();
      handleGenerateSummary();
    });

    DOM.loadSampleNoteBtn.addEventListener('click', () => {
      DOM.noteTitle.value = 'Operating Systems: Concurrency, Deadlocks & Synchronization';
      DOM.noteContent.value = SAMPLE_NOTE_TEXT;
      updateNotesWordCount();
      showToast('Sample lecture notes loaded', 'info');
    });

    DOM.clearNotesBtn.addEventListener('click', () => {
      DOM.noteTitle.value = '';
      DOM.noteContent.value = '';
      updateNotesWordCount();
      DOM.summaryResultContent.style.display = 'none';
      DOM.summaryEmptyState.style.display = 'block';
      DOM.summaryActionsBar.style.display = 'none';
    });

    DOM.noteContent.addEventListener('input', updateNotesWordCount);

    DOM.copySummaryBtn.addEventListener('click', handleCopySummary);
    DOM.turnSummaryToFlashcardBtn.addEventListener('click', handleSummaryToFlashcard);
  }

  function updateNotesWordCount() {
    const text = DOM.noteContent.value.trim();
    const count = text.length > 0 ? text.split(/\s+/).length : 0;
    DOM.notesWordCount.textContent = `${count} words`;

    if (count > 0 && count < 20) {
      DOM.notesValidationMsg.classList.add('error');
      DOM.notesValidationMsg.textContent = `Input is short (${count} words). At least 20 words recommended for meaningful extraction.`;
    } else {
      DOM.notesValidationMsg.classList.remove('error');
      DOM.notesValidationMsg.textContent = 'Provide at least 20 words for meaningful extraction.';
    }
  }

  /**
   * Transparent Rule-Based Extractive Summarization Engine
   * 1. Splits text into sentences.
   * 2. Eliminates common English stopwords.
   * 3. Calculates Term Frequency (TF).
   * 4. Scores each sentence based on word frequencies, sentence position, and title overlap.
   * 5. Returns the top salient sentences preserving original flow.
   */
  function handleGenerateSummary() {
    const rawText = DOM.noteContent.value.trim();
    const title = DOM.noteTitle.value.trim();
    const targetBulletCount = parseInt(DOM.summaryLength.value, 10) || 5;
    const formatStyle = DOM.summaryFormat.value;

    if (!rawText) {
      showToast('Please paste or type notes to summarize.', 'error');
      return;
    }

    const words = rawText.split(/\s+/);
    if (words.length < 15) {
      showToast('Please provide a longer text excerpt for summarization.', 'error');
      return;
    }

    // Split sentences using regex
    const rawSentences = rawText
      .replace(/([.?!])\s*(?=[A-Z0-9])/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 15);

    if (rawSentences.length === 0) {
      showToast('Could not detect distinct sentences in the notes.', 'error');
      return;
    }

    // Stopwords list
    const stopwords = new Set([
      'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of', 'or', 'by',
      'with', 'as', 'are', 'was', 'were', 'it', 'this', 'that', 'from', 'be', 'has', 'have',
      'had', 'not', 'but', 'can', 'will', 'all', 'any', 'such', 'into', 'than', 'then', 'so'
    ]);

    // Word frequencies calculation
    const wordFreq = {};
    const titleWords = new Set(title.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);

    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (clean.length > 2 && !stopwords.has(clean)) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    // Score sentences
    const scoredSentences = rawSentences.map((sentence, index) => {
      const sWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      let score = 0;

      sWords.forEach(w => {
        if (wordFreq[w]) {
          score += wordFreq[w];
        }
        if (titleWords.has(w)) {
          score += 3; // bonus for title relevance
        }
      });

      // Bonus for first sentence in paragraphs
      if (index === 0) score *= 1.4;
      // Normalization by length to avoid bias for overly long sentences
      if (sWords.length > 0) {
        score = score / Math.sqrt(sWords.length);
      }

      // Bonus for presence of key indicator terms
      if (/conclude|therefore|key|definition|critical|primary|consists|results|principle/i.test(sentence)) {
        score += 4;
      }

      return { sentence, score, originalIndex: index };
    });

    // Sort by score descending to find top sentences
    const ranked = [...scoredSentences].sort((a, b) => b.score - a.score);

    // Pick top sentences for bullets
    const topBullets = ranked.slice(0, targetBulletCount).sort((a, b) => a.originalIndex - b.originalIndex);

    // Executive overview: 2 highest scoring sentences
    const topOverview = ranked.slice(0, Math.min(2, ranked.length)).sort((a, b) => a.originalIndex - b.originalIndex);
    const overviewText = topOverview.map(s => s.sentence).join(' ');

    // Extract high-salience keywords (top 8)
    const sortedKeywords = Object.keys(wordFreq)
      .sort((a, b) => wordFreq[b] - wordFreq[a])
      .slice(0, 8);

    // Calculate metrics
    const origCount = words.length;
    const summaryCount = (overviewText + ' ' + topBullets.map(b => b.sentence).join(' ')).split(/\s+/).length;
    const compressionRatio = Math.max(10, Math.round((1 - (summaryCount / origCount)) * 100));
    const timeSavedMin = Math.max(1, Math.round((origCount - summaryCount) / 180)); // 180 wpm avg college reading

    // Update UI
    DOM.statOrigWords.textContent = origCount;
    DOM.statSumWords.textContent = summaryCount;
    DOM.statCompressionRatio.textContent = `${compressionRatio}%`;
    DOM.statTimeSaved.textContent = `~${timeSavedMin} min`;

    DOM.summaryOverviewBox.textContent = overviewText || 'Overview not available.';

    DOM.summaryBulletsList.innerHTML = topBullets.map(item => {
      // Highlight first 3 words in bullet
      const parts = item.sentence.split(/\s+/);
      const lead = parts.slice(0, 3).join(' ');
      const rest = parts.slice(3).join(' ');
      return `<li><strong>${escapeHtml(lead)}</strong> ${escapeHtml(rest)}</li>`;
    }).join('');

    DOM.summaryKeywordsCloud.innerHTML = sortedKeywords.map(kw => `
      <span class="keyword-tag">#${escapeHtml(kw)}</span>
    `).join('');

    // Toggle views
    DOM.summaryEmptyState.style.display = 'none';
    DOM.summaryResultContent.style.display = 'block';
    DOM.summaryActionsBar.style.display = 'flex';

    showToast('Summary generated successfully!', 'success');
    logActivity(`Summarized notes: ${title ? `"${title.slice(0, 25)}"` : `${origCount} words`}`);
  }

  function handleCopySummary() {
    const overview = DOM.summaryOverviewBox.textContent;
    const bullets = Array.from(DOM.summaryBulletsList.querySelectorAll('li'))
      .map(li => `• ${li.textContent}`)
      .join('\n');

    const copyText = `Study Summary:\n\n${overview}\n\nKey Concept Takeaways:\n${bullets}\n\nGenerated with StudyMate AI (Offline)`;

    navigator.clipboard.writeText(copyText)
      .then(() => showToast('Summary copied to clipboard!', 'success'))
      .catch(() => showToast('Could not copy to clipboard automatically.', 'error'));
  }

  function handleSummaryToFlashcard() {
    const title = DOM.noteTitle.value.trim() || 'Key Lecture Concept';
    const overview = DOM.summaryOverviewBox.textContent;

    openFlashcardModal({
      id: '',
      subject: title.length > 20 ? title.slice(0, 20) + '...' : title,
      front: `What are the core takeaways of: ${title}?`,
      back: overview,
      status: 'needs-revision'
    });
  }

  /* ==========================================================================
     12. FEATURE 4: MULTIPLE-CHOICE QUIZ GENERATOR
     ========================================================================== */
  function initQuizGenerator() {
    // Radio toggle between preset subjects and custom notes
    DOM.quizSourcePreset.addEventListener('change', () => {
      DOM.quizSubjectGroup.style.display = 'block';
      DOM.quizCustomTextGroup.style.display = 'none';
    });

    DOM.quizSourceCustom.addEventListener('change', () => {
      DOM.quizSubjectGroup.style.display = 'none';
      DOM.quizCustomTextGroup.style.display = 'block';
    });

    // Start Quiz Form
    DOM.quizConfigForm.addEventListener('submit', e => {
      e.preventDefault();
      handleStartQuiz();
    });

    // Quiz Navigation Buttons
    DOM.quizPrevBtn.addEventListener('click', () => {
      if (state.quizSession.currentIndex > 0) {
        state.quizSession.currentIndex -= 1;
        renderActiveQuizQuestion();
      }
    });

    DOM.quizNextBtn.addEventListener('click', () => {
      if (state.quizSession.currentIndex < state.quizSession.questions.length - 1) {
        state.quizSession.currentIndex += 1;
        renderActiveQuizQuestion();
      }
    });

    DOM.quizSubmitBtn.addEventListener('click', handleSubmitQuiz);

    DOM.quizRetakeBtn.addEventListener('click', () => {
      state.quizSession.currentIndex = 0;
      state.quizSession.userAnswers = {};
      state.quizSession.isSubmitted = false;
      DOM.quizResultsPanel.style.display = 'none';
      DOM.quizPlayPanel.style.display = 'block';
      renderActiveQuizQuestion();
    });

    DOM.quizNewBtn.addEventListener('click', () => {
      DOM.quizResultsPanel.style.display = 'none';
      DOM.quizPlayPanel.style.display = 'none';
      DOM.quizSetupPanel.style.display = 'block';
    });
  }

  function handleStartQuiz() {
    const isPreset = DOM.quizSourcePreset.checked;
    const difficulty = DOM.quizDifficulty.value;
    const requestedCount = parseInt(DOM.quizCount.value, 10) || 5;

    let selectedQuestions = [];
    let subjectLabel = '';

    if (isPreset) {
      const subjectKey = DOM.quizSubjectSelect.value;
      const bank = QUESTION_BANK[subjectKey] || QUESTION_BANK.cs;
      subjectLabel = DOM.quizSubjectSelect.options[DOM.quizSubjectSelect.selectedIndex].text.split('(')[0].trim();

      // Filter by difficulty if matches available, otherwise take from bank
      let pool = bank.filter(q => q.difficulty === difficulty);
      if (pool.length < requestedCount) {
        pool = [...bank]; // fallback to full subject bank
      }

      // Shuffle pool
      pool.sort(() => Math.random() - 0.5);
      selectedQuestions = pool.slice(0, requestedCount);
    } else {
      // Custom text mode: generate cloze / concept MCQs
      const customText = DOM.quizCustomText.value.trim();
      if (!customText || customText.length < 50) {
        showToast('Please paste at least 50 characters of study notes to generate custom questions.', 'error');
        return;
      }

      subjectLabel = 'Custom Notes';
      selectedQuestions = generateQuestionsFromCustomText(customText, requestedCount);
    }

    if (selectedQuestions.length === 0) {
      showToast('Could not formulate questions with this input. Try another subject.', 'error');
      return;
    }

    // Initialize session
    state.quizSession = {
      questions: selectedQuestions,
      currentIndex: 0,
      userAnswers: {},
      isSubmitted: false,
      score: 0,
      subjectName: subjectLabel,
      difficulty: difficulty
    };

    // Transition panels
    DOM.quizSetupPanel.style.display = 'none';
    DOM.quizResultsPanel.style.display = 'none';
    DOM.quizPlayPanel.style.display = 'block';

    DOM.quizPlaySubjectBadge.textContent = subjectLabel;
    DOM.quizPlayDifficultyBadge.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    DOM.quizTotalQNum.textContent = selectedQuestions.length;

    renderActiveQuizQuestion();
  }

  /**
   * Rule-based cloze & key-concept question synthesizer for custom user notes.
   */
  function generateQuestionsFromCustomText(text, count) {
    const sentences = text
      .split(/[.?!]/)
      .map(s => s.trim())
      .filter(s => s.length > 25 && s.length < 160);

    const questions = [];
    const keywords = ['function', 'system', 'process', 'memory', 'algorithm', 'energy', 'structure', 'concept', 'method', 'theory'];

    sentences.slice(0, count).forEach((sentence, idx) => {
      // Find prominent word in sentence
      const words = sentence.split(/\s+/).filter(w => w.length > 4);
      const targetWord = words.length > 0 ? words[Math.floor(words.length / 2)].replace(/[^a-zA-Z]/g, '') : 'mechanism';
      const blankedSentence = sentence.replace(new RegExp('\\b' + targetWord + '\\b', 'i'), '__________');

      const distractors = ['Variable', 'Frequency', 'Component', 'Protocol', 'Sequence']
        .filter(d => d.toLowerCase() !== targetWord.toLowerCase())
        .slice(0, 3);

      const options = [targetWord, ...distractors].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(targetWord);

      questions.push({
        question: `Fill in the blank from your study notes: "${blankedSentence}"`,
        options: options,
        correct: correctIndex,
        difficulty: 'medium',
        explanation: `Original context from your notes: "${sentence}."`
      });
    });

    return questions;
  }

  function renderActiveQuizQuestion() {
    const session = state.quizSession;
    const currentQ = session.questions[session.currentIndex];
    const totalQ = session.questions.length;

    DOM.quizCurrentQNum.textContent = session.currentIndex + 1;
    DOM.quizProgressBarFill.style.width = `${((session.currentIndex + 1) / totalQ) * 100}%`;

    DOM.quizQuestionText.textContent = currentQ.question;

    // Render options
    DOM.quizOptionsContainer.innerHTML = currentQ.options.map((opt, optIndex) => {
      const letter = String.fromCharCode(65 + optIndex);
      const isSelected = session.userAnswers[session.currentIndex] === optIndex;
      return `
        <button type="button" class="quiz-option-btn ${isSelected ? 'selected' : ''}" data-opt-index="${optIndex}">
          <span class="quiz-option-letter">${letter}</span>
          <span class="quiz-option-text">${escapeHtml(opt)}</span>
        </button>
      `;
    }).join('');

    // Attach click listeners to option buttons
    DOM.quizOptionsContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const optIdx = parseInt(btn.getAttribute('data-opt-index'), 10);
        session.userAnswers[session.currentIndex] = optIdx;
        renderActiveQuizQuestion();
      });
    });

    // Update navigation button states
    DOM.quizPrevBtn.disabled = session.currentIndex === 0;

    const isLast = session.currentIndex === totalQ - 1;
    DOM.quizNextBtn.style.display = isLast ? 'none' : 'inline-flex';
    DOM.quizSubmitBtn.style.display = isLast ? 'inline-flex' : 'none';
  }

  function handleSubmitQuiz() {
    const session = state.quizSession;
    const totalQ = session.questions.length;
    const answeredCount = Object.keys(session.userAnswers).length;

    if (answeredCount < totalQ) {
      const remaining = totalQ - answeredCount;
      if (!confirm(`You have ${remaining} unanswered question${remaining > 1 ? 's' : ''}. Do you still want to finish and view your score?`)) {
        return;
      }
    }

    // Calculate score
    let score = 0;
    session.questions.forEach((q, idx) => {
      if (session.userAnswers[idx] === q.correct) {
        score += 1;
      }
    });

    session.score = score;
    session.isSubmitted = true;
    const percentage = Math.round((score / totalQ) * 100);

    // Update Results Screen
    DOM.resultsScoreText.textContent = `${score} / ${totalQ}`;
    DOM.resultsPctText.textContent = `${percentage}%`;

    let grade = 'Needs Revision';
    let feedback = 'Keep practicing! Review the detailed explanations below to master these concepts.';

    if (percentage >= 90) {
      grade = 'Outstanding Mastery! (A+)';
      feedback = 'Exceptional performance! You have thoroughly grasped this study material.';
    } else if (percentage >= 75) {
      grade = 'Solid Understanding! (B+)';
      feedback = 'Great job! A quick review of the missed questions below will solidify your recall.';
    } else if (percentage >= 50) {
      grade = 'Passing Foundation (C)';
      feedback = 'Good foundation. Turn the questions you missed into flashcards to reinforce them.';
    }

    DOM.resultsGradeTitle.textContent = grade;
    DOM.resultsFeedbackText.textContent = feedback;

    // Render detailed question review
    DOM.quizReviewContainer.innerHTML = session.questions.map((q, idx) => {
      const userChoice = session.userAnswers[idx];
      const isCorrect = userChoice === q.correct;
      const statusBadge = isCorrect 
        ? '<span class="badge badge-success">Correct</span>' 
        : '<span class="badge badge-danger">Incorrect</span>';

      const userText = userChoice !== undefined ? q.options[userChoice] : 'No answer selected';
      const correctText = q.options[q.correct];

      return `
        <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="review-header">
            <span><strong>Question ${idx + 1}</strong></span>
            ${statusBadge}
          </div>
          <div class="review-question">${escapeHtml(q.question)}</div>
          <div class="review-answers">
            <div>Your Answer: <strong class="${isCorrect ? 'text-green' : 'text-red'}">${escapeHtml(userText)}</strong></div>
            ${!isCorrect ? `<div>Correct Answer: <strong class="text-green">${escapeHtml(correctText)}</strong></div>` : ''}
          </div>
          <div class="review-explanation">
            <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
          </div>
        </div>
      `;
    }).join('');

    // Toggle panels
    DOM.quizPlayPanel.style.display = 'none';
    DOM.quizResultsPanel.style.display = 'block';

    logActivity(`Completed quiz on ${session.subjectName}: Scored ${score}/${totalQ} (${percentage}%)`);
    showToast(`Quiz completed! Score: ${score}/${totalQ}`, 'success');
  }

  /* ==========================================================================
     13. FEATURE 5: STUDY PLANNER & TASK MANAGEMENT
     ========================================================================= */
  let activeTaskFilter = 'all';

  function initStudyPlanner() {
    state.tasks = loadFromStorage(STORAGE_KEYS.TASKS, SAMPLE_TASKS);

    // Filter Tab Clicks
    DOM.taskTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.taskTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        activeTaskFilter = btn.getAttribute('data-filter');
        renderTasks();
      });
    });

    // Subject Filter Change
    DOM.taskSubjectFilter.addEventListener('change', renderTasks);
    // Sort change
    DOM.taskSortBy.addEventListener('change', renderTasks);

    // Modal Triggers
    DOM.plannerAddTaskBtn.addEventListener('click', () => openTaskModal());
    DOM.dashAddTaskBtn.addEventListener('click', () => openTaskModal());
    DOM.emptyAddTaskBtn.addEventListener('click', () => openTaskModal());

    // Task Modal Controls
    DOM.taskModalCloseBtn.addEventListener('click', closeTaskModal);
    DOM.taskModalCancelBtn.addEventListener('click', closeTaskModal);
    DOM.taskModalBackdrop.addEventListener('click', closeTaskModal);

    // Task Form Submit
    DOM.taskForm.addEventListener('submit', handleTaskFormSubmit);

    // Populate task subject dropdown & render
    updateTaskSubjectOptions();
    renderTasks();
  }

  function updateTaskSubjectOptions() {
    const subjects = new Set();
    state.tasks.forEach(t => {
      if (t.subject) subjects.add(t.subject.trim());
    });

    const currentVal = DOM.taskSubjectFilter.value;
    DOM.taskSubjectFilter.innerHTML = '<option value="all">All Subjects</option>' + 
      Array.from(subjects).sort().map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

    DOM.taskSubjectFilter.value = subjects.has(currentVal) ? currentVal : 'all';
  }

  function renderTasks() {
    const todayStr = getTodayDateString();
    const subjectFilter = DOM.taskSubjectFilter.value;
    const sortBy = DOM.taskSortBy.value;

    // Filter tasks
    let filtered = state.tasks.filter(t => {
      // Status filter
      if (activeTaskFilter === 'pending' && t.completed) return false;
      if (activeTaskFilter === 'completed' && !t.completed) return false;
      if (activeTaskFilter === 'overdue' && (t.completed || !t.dueDate || t.dueDate >= todayStr)) return false;

      // Subject filter
      if (subjectFilter !== 'all' && t.subject !== subjectFilter) return false;

      return true;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      if (sortBy === 'dueDateAsc') {
        return (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1;
      }
      if (sortBy === 'dueDateDesc') {
        return (a.dueDate || '0000') < (b.dueDate || '0000') ? 1 : -1;
      }
      if (sortBy === 'priority') {
        const weights = { high: 3, medium: 2, low: 1 };
        return (weights[b.priority] || 1) - (weights[a.priority] || 1);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    // Update Counts in tabs
    DOM.countAllTasks.textContent = state.tasks.length;
    DOM.countPendingTasks.textContent = state.tasks.filter(t => !t.completed).length;
    DOM.countCompletedTasks.textContent = state.tasks.filter(t => t.completed).length;
    DOM.countOverdueTasks.textContent = state.tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;

    // Render list or empty state
    if (filtered.length === 0) {
      DOM.tasksContainer.innerHTML = '';
      DOM.tasksEmptyState.style.display = 'block';
    } else {
      DOM.tasksEmptyState.style.display = 'none';
      DOM.tasksContainer.innerHTML = filtered.map(task => {
        const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
        const priorityBadgeClass = task.priority === 'high' ? 'badge-danger' : (task.priority === 'medium' ? 'badge-warning' : 'badge-neutral');
        const dueBadgeClass = isOverdue ? 'badge-danger' : (task.dueDate === todayStr ? 'badge-warning' : 'badge-neutral');

        return `
          <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-left">
              <div class="task-checkbox-wrapper">
                <input type="checkbox" class="task-checkbox" id="chk-${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
              </div>
              <div class="task-content">
                <h4 class="task-title-text">${escapeHtml(task.title)}</h4>
                ${task.description ? `<p class="task-desc-text">${escapeHtml(task.description)}</p>` : ''}
                <div class="task-meta">
                  <span class="badge badge-primary">${escapeHtml(task.subject || 'General')}</span>
                  <span class="badge ${priorityBadgeClass}">${task.priority.toUpperCase()}</span>
                  <span class="badge ${dueBadgeClass}">Due: ${formatDisplayDate(task.dueDate)}</span>
                </div>
              </div>
            </div>
            <div class="task-actions">
              <button class="btn btn-ghost btn-sm edit-task-btn" title="Edit task">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn btn-ghost btn-sm delete-task-btn text-red" title="Delete task">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Attach event listeners for checkboxes, edit, and delete
      DOM.tasksContainer.querySelectorAll('.task-card').forEach(card => {
        const taskId = card.getAttribute('data-task-id');
        const task = state.tasks.find(t => t.id === taskId);

        // Checkbox toggle
        const chk = card.querySelector('.task-checkbox');
        chk.addEventListener('change', () => {
          task.completed = chk.checked;
          saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
          renderTasks();
          updateDashboardAnalytics();
          logActivity(`${task.completed ? 'Completed' : 'Reopened'} task: "${task.title}"`);
          showToast(`Task marked as ${task.completed ? 'completed' : 'pending'}`, 'success');
        });

        // Edit button
        card.querySelector('.edit-task-btn').addEventListener('click', () => {
          openTaskModal(task);
        });

        // Delete button
        card.querySelector('.delete-task-btn').addEventListener('click', async () => {
          const confirmed = await showConfirmDialog(`Are you sure you want to delete the study task "${task.title}"?`);
          if (confirmed) {
            state.tasks = state.tasks.filter(t => t.id !== taskId);
            saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
            updateTaskSubjectOptions();
            renderTasks();
            updateDashboardAnalytics();
            logActivity(`Deleted task: "${task.title}"`);
            showToast('Task deleted successfully', 'info');
          }
        });
      });
    }

    updateDashboardAnalytics();
  }

  function openTaskModal(task = null) {
    if (task) {
      DOM.taskModalTitle.textContent = 'Edit Study Task';
      DOM.taskIdInput.value = task.id;
      DOM.taskTitleInput.value = task.title;
      DOM.taskDescInput.value = task.description || '';
      DOM.taskSubjectInput.value = task.subject || '';
      DOM.taskPriorityInput.value = task.priority || 'medium';
      DOM.taskDueDateInput.value = task.dueDate || getTodayDateString();
    } else {
      DOM.taskModalTitle.textContent = 'Add Study Task';
      DOM.taskIdInput.value = '';
      DOM.taskTitleInput.value = '';
      DOM.taskDescInput.value = '';
      DOM.taskSubjectInput.value = '';
      DOM.taskPriorityInput.value = 'medium';
      DOM.taskDueDateInput.value = getRelativeDateString(3); // default due in 3 days
    }

    DOM.taskModal.removeAttribute('hidden');
    DOM.taskTitleInput.focus();
  }

  function closeTaskModal() {
    DOM.taskModal.setAttribute('hidden', '');
  }

  function handleTaskFormSubmit(e) {
    e.preventDefault();
    const id = DOM.taskIdInput.value.trim();
    const title = DOM.taskTitleInput.value.trim();
    const description = DOM.taskDescInput.value.trim();
    const subject = DOM.taskSubjectInput.value.trim() || 'General';
    const priority = DOM.taskPriorityInput.value;
    const dueDate = DOM.taskDueDateInput.value;

    if (!title || title.length < 3) {
      showToast('Task title must be at least 3 characters.', 'error');
      return;
    }

    if (!dueDate) {
      showToast('Please specify a valid due date.', 'error');
      return;
    }

    if (id) {
      // Edit existing task
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.title = title;
        task.description = description;
        task.subject = subject;
        task.priority = priority;
        task.dueDate = dueDate;
        showToast('Study task updated!', 'success');
        logActivity(`Updated task: "${title}"`);
      }
    } else {
      // Add new task
      const newTask = {
        id: 'task-' + Date.now(),
        title,
        description,
        subject,
        priority,
        dueDate,
        completed: false,
        createdAt: new Date().toISOString()
      };
      state.tasks.unshift(newTask);
      showToast('New study task added!', 'success');
      logActivity(`Added task: "${title}"`);
    }

    saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
    updateTaskSubjectOptions();
    renderTasks();
    closeTaskModal();
  }

  /* ==========================================================================
     14. FEATURE 6: REVISION FLASHCARDS (3D FLIP & MASTERY TRACKING)
     ========================================================================== */
  function initFlashcards() {
    state.flashcards = loadFromStorage(STORAGE_KEYS.FLASHCARDS, SAMPLE_FLASHCARDS);

    // 3D Card Flip toggle
    DOM.activeFlashcard.addEventListener('click', toggleCardFlip);
    DOM.activeFlashcard.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleCardFlip();
      }
    });

    // Deck Navigation
    DOM.fcPrevBtn.addEventListener('click', prevFlashcard);
    DOM.fcNextBtn.addEventListener('click', nextFlashcard);

    // Keyboard support for flashcards (arrow keys)
    window.addEventListener('keydown', e => {
      if (state.currentSection === 'flashcards' && !document.querySelector('.modal:not([hidden])')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevFlashcard();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextFlashcard();
        }
      }
    });

    // Mastery mark buttons
    DOM.fcMarkNeedsRevisionBtn.addEventListener('click', () => markCurrentCardStatus('needs-revision'));
    DOM.fcMarkMasteredBtn.addEventListener('click', () => markCurrentCardStatus('mastered'));

    // Shuffle Deck
    DOM.shuffleFlashcardsBtn.addEventListener('click', handleShuffleDeck);

    // Filter controls
    DOM.fcSubjectFilter.addEventListener('change', e => {
      state.flashcardSession.filterSubject = e.target.value;
      updateFlashcardsDeck();
    });

    DOM.fcStatusFilter.addEventListener('change', e => {
      state.flashcardSession.filterStatus = e.target.value;
      updateFlashcardsDeck();
    });

    // View mode toggle (Deck vs Grid)
    DOM.fcDeckViewBtn.addEventListener('click', () => {
      DOM.fcDeckViewBtn.classList.add('active');
      DOM.fcGridViewBtn.classList.remove('active');
      DOM.fcDeckView.style.display = 'flex';
      DOM.fcGridView.style.display = 'none';
    });

    DOM.fcGridViewBtn.addEventListener('click', () => {
      DOM.fcGridViewBtn.classList.add('active');
      DOM.fcDeckViewBtn.classList.remove('active');
      DOM.fcDeckView.style.display = 'none';
      DOM.fcGridView.style.display = 'block';
      renderFlashcardsTable();
    });

    // Edit and Delete buttons on current card
    DOM.fcEditCardBtn.addEventListener('click', () => {
      const card = getCurrentCard();
      if (card) openFlashcardModal(card);
    });

    DOM.fcDeleteCardBtn.addEventListener('click', async () => {
      const card = getCurrentCard();
      if (!card) return;
      const confirmed = await showConfirmDialog(`Are you sure you want to delete this flashcard: "${card.front.slice(0, 35)}..."?`);
      if (confirmed) {
        state.flashcards = state.flashcards.filter(c => c.id !== card.id);
        saveToStorage(STORAGE_KEYS.FLASHCARDS, state.flashcards);
        updateFlashcardSubjectOptions();
        updateFlashcardsDeck();
        showToast('Flashcard deleted', 'info');
      }
    });

    // Add card triggers
    DOM.newFlashcardBtn.addEventListener('click', () => openFlashcardModal());
    DOM.emptyAddFcBtn.addEventListener('click', () => openFlashcardModal());

    DOM.emptyLoadFcBtn.addEventListener('click', () => {
      state.flashcards = [...SAMPLE_FLASHCARDS];
      saveToStorage(STORAGE_KEYS.FLASHCARDS, state.flashcards);
      updateFlashcardSubjectOptions();
      updateFlashcardsDeck();
      showToast('Loaded sample college flashcard deck!', 'success');
    });

    // Flashcard Modal controls
    DOM.fcModalCloseBtn.addEventListener('click', closeFlashcardModal);
    DOM.fcModalCancelBtn.addEventListener('click', closeFlashcardModal);
    DOM.fcModalBackdrop.addEventListener('click', closeFlashcardModal);
    DOM.flashcardForm.addEventListener('submit', handleFlashcardFormSubmit);

    updateFlashcardSubjectOptions();
    updateFlashcardsDeck();
  }

  function updateFlashcardSubjectOptions() {
    const subjects = new Set();
    state.flashcards.forEach(fc => {
      if (fc.subject) subjects.add(fc.subject.trim());
    });

    const currentVal = DOM.fcSubjectFilter.value;
    DOM.fcSubjectFilter.innerHTML = '<option value="all">All Subjects</option>' +
      Array.from(subjects).sort().map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

    DOM.fcSubjectFilter.value = subjects.has(currentVal) ? currentVal : 'all';
  }

  function updateFlashcardsDeck() {
    const subFilter = state.flashcardSession.filterSubject;
    const statFilter = state.flashcardSession.filterStatus;

    // Filter deck
    let list = state.flashcards.filter(c => {
      if (subFilter !== 'all' && c.subject !== subFilter) return false;
      if (statFilter !== 'all' && c.status !== statFilter) return false;
      return true;
    });

    state.flashcardSession.filteredCards = list;

    // Boundary check index
    if (state.flashcardSession.currentIndex >= list.length) {
      state.flashcardSession.currentIndex = Math.max(0, list.length - 1);
    }

    // Reset flip
    state.flashcardSession.isFlipped = false;
    DOM.activeFlashcard.classList.remove('flipped');

    // Calculate mastery percentage across whole deck
    const totalDeck = state.flashcards.length;
    const masteredCount = state.flashcards.filter(c => c.status === 'mastered').length;
    const masteryPct = totalDeck > 0 ? Math.round((masteredCount / totalDeck) * 100) : 0;

    DOM.fcMasteryText.textContent = `${masteryPct}% Mastered (${masteredCount}/${totalDeck})`;
    DOM.fcMasteryBarFill.style.width = `${masteryPct}%`;

    // Render deck or empty state
    if (list.length === 0) {
      DOM.fcDeckView.style.display = 'none';
      DOM.flashcardsEmptyState.style.display = 'block';
    } else {
      DOM.flashcardsEmptyState.style.display = 'none';
      if (!DOM.fcGridViewBtn.classList.contains('active')) {
        DOM.fcDeckView.style.display = 'flex';
      }
      renderActiveCardFace();
    }

    if (DOM.fcGridViewBtn.classList.contains('active')) {
      renderFlashcardsTable();
    }
  }

  function getCurrentCard() {
    const session = state.flashcardSession;
    return session.filteredCards[session.currentIndex] || null;
  }

  function renderActiveCardFace() {
    const session = state.flashcardSession;
    const card = getCurrentCard();
    if (!card) return;

    DOM.fcPositionText.textContent = `Card ${session.currentIndex + 1} of ${session.filteredCards.length}`;

    // Front Face
    DOM.fcFrontSubject.textContent = card.subject || 'General';
    DOM.fcFrontText.textContent = card.front;
    DOM.fcFrontStatus.textContent = card.status === 'mastered' ? 'Mastered ★' : 'Needs Review';
    DOM.fcFrontStatus.className = `fc-status-tag ${card.status === 'mastered' ? 'text-green' : 'text-amber'}`;

    // Back Face
    DOM.fcBackSubject.textContent = `${card.subject || 'Concept'} (Answer)`;
    DOM.fcBackText.textContent = card.back;
    DOM.fcBackStatus.textContent = card.status === 'mastered' ? 'Mastered ★' : 'Needs Review';
    DOM.fcBackStatus.className = `fc-status-tag ${card.status === 'mastered' ? 'text-green' : 'text-amber'}`;

    // Highlight mastery button
    DOM.fcMarkMasteredBtn.classList.toggle('active', card.status === 'mastered');
    DOM.fcMarkNeedsRevisionBtn.classList.toggle('active', card.status === 'needs-revision');
  }

  function toggleCardFlip() {
    state.flashcardSession.isFlipped = !state.flashcardSession.isFlipped;
    DOM.activeFlashcard.classList.toggle('flipped', state.flashcardSession.isFlipped);
  }

  function prevFlashcard() {
    const session = state.flashcardSession;
    if (session.filteredCards.length === 0) return;
    session.currentIndex = (session.currentIndex - 1 + session.filteredCards.length) % session.filteredCards.length;
    session.isFlipped = false;
    DOM.activeFlashcard.classList.remove('flipped');
    renderActiveCardFace();
  }

  function nextFlashcard() {
    const session = state.flashcardSession;
    if (session.filteredCards.length === 0) return;
    session.currentIndex = (session.currentIndex + 1) % session.filteredCards.length;
    session.isFlipped = false;
    DOM.activeFlashcard.classList.remove('flipped');
    renderActiveCardFace();
  }

  function markCurrentCardStatus(newStatus) {
    const card = getCurrentCard();
    if (!card) return;

    card.status = newStatus;
    saveToStorage(STORAGE_KEYS.FLASHCARDS, state.flashcards);
    renderActiveCardFace();
    updateFlashcardsDeck();
    showToast(`Marked card as ${newStatus === 'mastered' ? 'Mastered' : 'Needs Revision'}`, 'success');
    logActivity(`Marked flashcard as ${newStatus}: "${card.front.slice(0, 25)}..."`);
  }

  function handleShuffleDeck() {
    const session = state.flashcardSession;
    if (session.filteredCards.length < 2) {
      showToast('Add more flashcards to shuffle the deck!', 'info');
      return;
    }

    // Fisher-Yates shuffle
    for (let i = session.filteredCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [session.filteredCards[i], session.filteredCards[j]] = [session.filteredCards[j], session.filteredCards[i]];
    }

    session.currentIndex = 0;
    session.isFlipped = false;
    DOM.activeFlashcard.classList.remove('flipped');
    renderActiveCardFace();
    showToast('Deck shuffled!', 'info');
  }

  function renderFlashcardsTable() {
    if (!DOM.flashcardsTableBody) return;
    if (state.flashcards.length === 0) {
      DOM.flashcardsTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No flashcards in library.</td></tr>';
      return;
    }

    DOM.flashcardsTableBody.innerHTML = state.flashcards.map(c => `
      <tr>
        <td><span class="badge badge-primary">${escapeHtml(c.subject || 'General')}</span></td>
        <td><strong>${escapeHtml(c.front)}</strong></td>
        <td>${escapeHtml(c.back)}</td>
        <td>
          <span class="badge ${c.status === 'mastered' ? 'badge-success' : 'badge-warning'}">
            ${c.status === 'mastered' ? 'Mastered' : 'Needs Review'}
          </span>
        </td>
        <td>
          <div class="table-actions" style="display: flex; gap: 4px;">
            <button class="btn btn-ghost btn-sm edit-fc-row-btn" data-id="${c.id}">Edit</button>
            <button class="btn btn-ghost btn-sm text-red delete-fc-row-btn" data-id="${c.id}">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');

    DOM.flashcardsTableBody.querySelectorAll('.edit-fc-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const c = state.flashcards.find(item => item.id === id);
        if (c) openFlashcardModal(c);
      });
    });

    DOM.flashcardsTableBody.querySelectorAll('.delete-fc-row-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const c = state.flashcards.find(item => item.id === id);
        if (!c) return;
        const confirmed = await showConfirmDialog(`Delete flashcard "${c.front.slice(0, 30)}..."?`);
        if (confirmed) {
          state.flashcards = state.flashcards.filter(item => item.id !== id);
          saveToStorage(STORAGE_KEYS.FLASHCARDS, state.flashcards);
          updateFlashcardSubjectOptions();
          updateFlashcardsDeck();
          renderFlashcardsTable();
          showToast('Flashcard deleted', 'info');
        }
      });
    });
  }

  function openFlashcardModal(card = null) {
    if (card) {
      DOM.fcModalTitle.textContent = 'Edit Flashcard';
      DOM.fcIdInput.value = card.id;
      DOM.fcSubjectInput.value = card.subject || '';
      DOM.fcFrontInput.value = card.front;
      DOM.fcBackInput.value = card.back;
      DOM.fcStatusInput.value = card.status || 'needs-revision';
    } else {
      DOM.fcModalTitle.textContent = 'Add Revision Flashcard';
      DOM.fcIdInput.value = '';
      DOM.fcSubjectInput.value = '';
      DOM.fcFrontInput.value = '';
      DOM.fcBackInput.value = '';
      DOM.fcStatusInput.value = 'needs-revision';
    }

    DOM.flashcardModal.removeAttribute('hidden');
    DOM.fcSubjectInput.focus();
  }

  function closeFlashcardModal() {
    DOM.flashcardModal.setAttribute('hidden', '');
  }

  function handleFlashcardFormSubmit(e) {
    e.preventDefault();
    const id = DOM.fcIdInput.value.trim();
    const subject = DOM.fcSubjectInput.value.trim() || 'General';
    const front = DOM.fcFrontInput.value.trim();
    const back = DOM.fcBackInput.value.trim();
    const status = DOM.fcStatusInput.value;

    if (!front || !back) {
      showToast('Both front question and back answer are required.', 'error');
      return;
    }

    if (id) {
      const card = state.flashcards.find(c => c.id === id);
      if (card) {
        card.subject = subject;
        card.front = front;
        card.back = back;
        card.status = status;
        showToast('Flashcard updated!', 'success');
      }
    } else {
      const newCard = {
        id: 'fc-' + Date.now(),
        subject,
        front,
        back,
        status,
        createdAt: new Date().toISOString()
      };
      state.flashcards.unshift(newCard);
      showToast('New revision card created!', 'success');
      logActivity(`Created flashcard: "${front.slice(0, 25)}..."`);
    }

    saveToStorage(STORAGE_KEYS.FLASHCARDS, state.flashcards);
    updateFlashcardSubjectOptions();
    updateFlashcardsDeck();
    closeFlashcardModal();
  }

  /* ==========================================================================
     15. FEATURE 7: SETTINGS & LOCAL DATA MANAGEMENT
     ========================================================================== */
  function initSettings() {
    state.backendConfig = loadFromStorage(STORAGE_KEYS.BACKEND_CONFIG, state.backendConfig);
    DOM.backendUrlInput.value = state.backendConfig.baseUrl;

    DOM.backendSettingsForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = DOM.backendUrlInput.value.trim();
      if (!val) {
        showToast('Please provide a valid backend URL.', 'error');
        return;
      }
      state.backendConfig.baseUrl = val;
      saveToStorage(STORAGE_KEYS.BACKEND_CONFIG, state.backendConfig);
      showToast('Backend endpoint settings saved!', 'success');
    });

    DOM.testBackendConnectionBtn.addEventListener('click', handleTestBackend);

    // Export Data
    DOM.exportDataBtn.addEventListener('click', handleExportData);

    // Import Data
    DOM.importDataFileInput.addEventListener('change', handleImportData);

    // Reset All Data
    DOM.resetAllDataBtn.addEventListener('click', async () => {
      const confirmed = await showConfirmDialog('WARNING: This will permanently erase all study tasks, flashcards, streaks, and reset StudyMate AI to fresh defaults. Are you sure?');
      if (confirmed) {
        localStorage.clear();
        state.tasks = [];
        state.flashcards = [];
        state.chatHistory = [];
        state.recentActivity = [];
        state.streak = { count: 1, lastActiveDate: getTodayDateString() };
        showToast('All local storage data reset.', 'info');
        setTimeout(() => window.location.reload(), 600);
      }
    });

    // Load Demo Data from Dashboard
    DOM.loadSampleDataBtn.addEventListener('click', () => {
      state.tasks = [...SAMPLE_TASKS];
      state.flashcards = [...SAMPLE_FLASHCARDS];
      saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
      saveToStorage(STORAGE_KEYS.FLASHCARDS, state.flashcards);
      updateTaskSubjectOptions();
      updateFlashcardSubjectOptions();
      updateDashboardAnalytics();
      renderTasks();
      updateFlashcardsDeck();
      showToast('Loaded demo college tasks and flashcards!', 'success');
      logActivity('Loaded demo college dataset');
    });

    // Clear Activity
    DOM.clearActivityBtn.addEventListener('click', () => {
      state.recentActivity = [];
      saveToStorage(STORAGE_KEYS.RECENT_ACTIVITY, state.recentActivity);
      renderRecentActivity();
      showToast('Activity log cleared', 'info');
    });

    // Confirm Modal Controls
    DOM.confirmCancelBtn.addEventListener('click', () => closeConfirmDialog(false));
    DOM.confirmModalCloseBtn.addEventListener('click', () => closeConfirmDialog(false));
    DOM.confirmModalBackdrop.addEventListener('click', () => closeConfirmDialog(false));
    DOM.confirmOkBtn.addEventListener('click', () => closeConfirmDialog(true));
  }

  async function handleTestBackend() {
    const url = `${DOM.backendUrlInput.value.trim()}/health`;
    DOM.backendTestResult.style.display = 'block';
    DOM.backendTestResult.className = 'diagnostic-box';
    DOM.backendTestResult.textContent = `Pinging ${url}...`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (resp.ok) {
        DOM.backendTestResult.className = 'diagnostic-box success';
        DOM.backendTestResult.textContent = `[Connected]: Backend answered with HTTP status ${resp.status}. Real AI proxy available.`;
        DOM.settingsBackendStatusBadge.textContent = 'Backend Connected';
        DOM.settingsBackendStatusBadge.className = 'badge badge-success';
        DOM.systemStatusText.textContent = 'AI Backend Active';
      } else {
        throw new Error(`HTTP status ${resp.status}`);
      }
    } catch (err) {
      DOM.backendTestResult.className = 'diagnostic-box error';
      DOM.backendTestResult.innerHTML = `
        <strong>Offline Notice:</strong> No backend proxy responding at <code>${escapeHtml(url)}</code>.<br>
        • Status: Local Heuristics Mode active (Everything continues functioning offline).<br>
        • Note: To enable live LLM queries, launch a local Node.js or Python backend proxy handling secrets.
      `;
      DOM.settingsBackendStatusBadge.textContent = 'Offline Heuristics';
      DOM.settingsBackendStatusBadge.className = 'badge badge-neutral';
      DOM.systemStatusText.textContent = 'Local Heuristics Mode';
    }
  }

  function handleExportData() {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks: state.tasks,
      flashcards: state.flashcards,
      recentActivity: state.recentActivity,
      streak: state.streak,
      theme: state.theme
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymate_backup_${getTodayDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
  }

  function handleImportData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported.tasks)) {
          state.tasks = imported.tasks;
          saveToStorage(STORAGE_KEYS.TASKS, state.tasks);
        }
        if (Array.isArray(imported.flashcards)) {
          state.flashcards = imported.flashcards;
          saveToStorage(STORAGE_KEYS.FLASHCARDS, state.flashcards);
        }
        if (Array.isArray(imported.recentActivity)) {
          state.recentActivity = imported.recentActivity;
          saveToStorage(STORAGE_KEYS.RECENT_ACTIVITY, state.recentActivity);
        }
        if (imported.streak) {
          state.streak = imported.streak;
          saveToStorage(STORAGE_KEYS.STREAK, state.streak);
        }

        updateTaskSubjectOptions();
        updateFlashcardSubjectOptions();
        updateDashboardAnalytics();
        renderTasks();
        updateFlashcardsDeck();
        renderRecentActivity();
        updateStreak();
        showToast('Study data imported successfully!', 'success');
      } catch (err) {
        showToast('Invalid JSON file format. Import aborted.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  /* ==========================================================================
     16. INITIALIZATION BOOTSTRAP
     ========================================================================== */
  function init() {
    // 1. Theme
    initTheme();

    // 2. Load streak & recent activity
    state.streak = loadFromStorage(STORAGE_KEYS.STREAK, { count: 1, lastActiveDate: getTodayDateString() });
    state.recentActivity = loadFromStorage(STORAGE_KEYS.RECENT_ACTIVITY, []);
    updateStreak();

    // 3. Navigation
    initNavigation();

    // 4. Feature Modules
    initStudyTips();
    initChat();
    initNotesSummarizer();
    initQuizGenerator();
    initStudyPlanner();
    initFlashcards();
    initSettings();

    // 5. Initial Render of Dashboard
    updateDashboardAnalytics();
    renderRecentActivity();

    console.log('%c StudyMate AI Initialized Successfully %c Local Heuristics Ready ', 'background: #2563eb; color: #fff; font-weight: bold; border-radius: 3px 0 0 3px;', 'background: #10b981; color: #fff; font-weight: bold; border-radius: 0 3px 3px 0;');
  }

  // Run on DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
