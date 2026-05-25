const dictionary = {
  projectName: 'NexExam',

  shared: {
    showArchived: 'Show Archived?',
    viewArchived: 'View archived',
    archive: 'Archive',
    restore: 'Restore',
    archived: 'Archived',
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
    clear: 'Clear',
    accept: 'Accept',
    dashboard: 'Dashboard',
    new: 'New',
    all: 'All',
    searchNotFound: 'Nothing found.',
    searchPlaceholder: 'Search...',
    selectPlaceholder: 'Select an option',
    dateFormat: 'MMM DD, YYYY',
    datetimeFormat: 'MMM DD, YYYY hh:mma',
    tagsPlaceholder: 'Type and press enter to add',
    edit: 'Edit',
    delete: 'Delete',
    openMenu: 'Open menu',
    search: 'Search',
    reset: 'Reset',
    min: 'Min',
    max: 'Max',
    view: 'View',
    copiedToClipboard: 'Copied to clipboard',
    exportToCsv: 'Export to CSV',
    import: 'Import',
    pause: 'Pause',
    discard: 'Discard',
    deleted: 'Deleted',
    remove: 'Remove',
    startDate: 'Start date',
    endDate: 'End date',
    close: 'Close',
    loading: 'Loading',
    toggleSidebar: 'Toggle Sidebar',
    breadcrumb: 'breadcrumb',
    more: 'More',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    refresh: 'Refresh',

    unsavedChanges: {
      title: 'Unsaved Changes',
      message:
        'You have unsaved changes that will be lost if you leave this page.',
      proceed: 'Discard',
      dismiss: 'Cancel',
      saveChanges: 'Save Changes',
    },

    importer: {
      importHashAlreadyExists: 'Data has already been imported',
      title: 'Import CSV File',
      menu: 'Import CSV File',
      line: 'Line',
      status: 'Status',
      pending: 'Pending',
      success: 'Imported',
      error: 'Error',
      importedMessage: `Processed {0} of {1}.`,
      noValidRows: 'There are no valid rows.',
      noNavigateAwayMessage:
        'Do not navigate away from this page or import will be stopped.',
      uploadFiles: 'Upload files',
      uploadFilesDisclaimer:
        'This import contains file fields. Files will be uploaded to storage during import.',
      completed: {
        success: 'Import completed. All rows were successfully imported.',
        someErrors:
          'Processing completed, but some rows were unable to be imported.',
        allErrors: 'Import failed. There are no valid rows.',
      },
      form: {
        downloadTemplate: 'Download the template',
        description:
          'Upload a CSV file to import data. You can download the template to see the required format.',
      },
      list: {
        newConfirm: 'Are you sure?',
        discardConfirm: 'Are you sure? Non-imported data will be lost.',
      },
      errors: {
        invalidFileEmpty: 'The file is empty',
        fileRequired: 'File is required',
        uploadFailed: 'Failed to upload files',
        partialUpload: 'Only {0} of {1} files uploaded',
      },
      fileUpload: {
        title: 'Uploading Files',
        progress: 'Progress: {0} / {1}',
        uploading: '{0} uploading',
        completed: '{0} completed',
        failed: '{0} failed',
        rowLabel: 'Row {0} - {1}',
      },
    },

    dataTable: {
      filters: 'Filters',
      noResults: 'No results found.',
      viewOptions: 'View',
      toggleColumns: 'Toggle Columns',

      sortAscending: 'Asc',
      sortDescending: 'Desc',
      clearSort: 'Clear',
      hide: 'Hide',

      selectAll: 'Select All',
      selectRow: 'Select Row',
      paginationRange: '{0}-{1} of {2}',
      paginationSelected: '{0} selected',
      paginationRowsPerPage: 'per page',
      pagination: 'pagination',
      goToPreviousPage: 'Go to previous page',
      goToNextPage: 'Go to next page',
      morePages: 'More pages',
    },

    locales: {
      en: 'English',
      es: 'Spanish',
      de: 'German',
      'pt-BR': 'Português (Brasil)',
      fr: 'French',
    },

    localeSwitcher: {
      searchPlaceholder: 'Search language...',
      title: 'Language',
      placeholder: 'Select a Language',
      searchEmpty: 'No language found.',
    },

    theme: {
      toggle: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },

    errors: {
      previewMode: 'This feature is not available in preview/demo mode.',
      timezone: 'Invalid timezone',
      invalid: `{0} is invalid`,
      unknown: 'An error occurred',
      unique: `{0} must be unique`,
      staleData:
        'The record has been updated by another user. Please refresh and try again.',
      copyToClipboard: 'Failed to copy to clipboard',
      tooManyRequests: 'Too many requests. Please try again later.',
    },
  },

  apiKey: {
    docs: {
      menu: 'API Docs',
    },
    edit: {
      menu: 'Edit API Key',
      title: 'Edit API Key',
      success: 'API Key successfully updated',
      error: 'Failed to update API key',
    },
    new: {
      menu: 'New API Key',
      title: 'New API Key',
      success: 'API Key successfully created',
      error: 'Failed to create API key',
      warning: {
        title: 'Save your API key',
        message:
          'This is the only time you will see this API key. Please copy it and store it securely.',
      },
      restrictPermissions: 'Restrict Permissions',
      allowAllPermissions: 'Allow All Permissions',
      permissionsDisclaimer:
        'Note: You must have the selected permissions on the organization for them to be effective.',
    },
    list: {
      menu: 'API Keys',
      title: 'API Keys',
      noResults: 'No API keys found.',
    },
    delete: {
      confirmTitle: 'Delete API Key?',
      confirmDescription:
        'Are you sure you want to delete this API key? This action cannot be undone.',
      success: 'API Key successfully deleted',
    },
    enumerators: {
      status: {
        enabled: 'Enabled',
        disabled: 'Disabled',
      },
      remaining: {
        unlimited: 'Unlimited',
      },
      lastUsed: {
        never: 'Never',
      },
      expiresAt: {
        never: 'Never',
      },
      permissions: {
        permission: 'permission',
        permissions: 'permissions',
        invalid: 'Invalid',
      },
    },
    fields: {
      apiKey: 'API Key',
      member: 'User',
      name: 'Name',
      namePlaceholder: 'My API Key',
      keyPreview: 'Key Preview',
      expiresAt: 'Expires',
      expiresAtPlaceholder: 'Never expires (leave empty)',
      expiresAtMin: 'Expiration date must be at least {0} day(s) in the future',
      expiresAtMax:
        'Expiration date cannot be more than {0} day(s) in the future',
      status: 'Status',
      enabled: 'Enabled',
      remaining: 'Remaining',
      lastUsed: 'Last Used',
      createdAt: 'Created At',
      permissions: 'Permissions',
      permissionsPlaceholder: 'Select permissions',
      permissionsRequired: 'At least one permission is required',
    },
    errors: {
      fetch: 'Failed to fetch API keys',
      delete: 'Failed to delete API key',
      notFound: 'API key not found',
      permissionDenied: "You don't have permission to grant {0}:{1}",
      organizationRequired: 'Organization ID is required',
      createFailed: 'Failed to create API key',
      listFailed: 'Failed to list API keys',
    },
  },

  file: {
    button: 'Upload',
    delete: 'Delete',
    dropzone: {
      dragAndDrop: 'Drag and drop files here',
      dropFiles: 'Drop files here',
      uploadFiles: 'You can upload {0} file{1}.',
      upTo: 'Up to {0}.',
      eachUpTo: 'Each up to {0}.',
      accepted: 'Accepted {0}.',
      uploading: 'Uploading...',
      uploadSuccessful: 'Upload successful',
    },
    errors: {
      formats: `Invalid format. Must be one of: {0}.`,
      notImage: `File must be an image`,
      tooBig: `File is too big. Current size is {0} bytes, maximum size is {1} bytes`,
      invalidFilename: 'Invalid filename',
    },
  },

  dashboard: {
    searchLabel: 'Search learning content',
    searchPlaceholder: 'Search for courses, topics, resources...',
    notifications: 'Notifications',
    learnerRole: 'Learner',
    superAdminRole: 'Super Admin',
    fallbackName: 'Learner',
    viewSwitcher: {
      title: 'Switch view',
      superAdmin: 'Admin',
      student: 'Student',
      creator: 'Teacher',
    },
    student: {
      menu: 'Student Dashboard',
      role: 'Student',
    },
    creator: {
      menu: 'Creator Dashboard',
      role: 'Creator Teacher',
      welcome: 'Welcome back, {0}',
      title: 'Build your creator teaching path',
      subtitle:
        'Apply for verification, track review status, and prepare courses for the NexExam learning catalog.',
      applicationTitle: 'Verification status',
      applicationEmpty:
        'Start your creator application so the NexExam team can review your credentials and teaching focus.',
      applicationPending:
        'Your creator application is under review. You can update details while the team evaluates it.',
      applicationApproved:
        'Your creator profile is approved. Admin-controlled course publishing remains active for Phase 1.',
      applicationRejected:
        'Your application needs changes before approval. Review admin notes and resubmit your profile.',
      startApplication: 'Start application',
      editApplication: 'Update application',
      workspaceTitle: 'Course workspace',
      workspaceBody:
        'Creator course building is separated from student learning. Self-serve publishing opens after verification workflows are stable.',
      reviewTitle: 'Admin review',
      reviewBody:
        'NexExam super admins review applications, course quality, enrollments, and payouts from the admin dashboard.',
      deferredTitle: 'Phase 1 boundary',
      deferredBody:
        'Drag-and-drop course creation and automated revenue splits stay deferred while the enrollment loop ships.',
      metricsTitle: 'Creator metrics',
      metricsBody:
        'Track enrollments, completion, AI usage, ratings, and earnings across your courses.',
    },
    welcome: 'Welcome back, {0}',
    heroTitle: 'Continue your learning journey with AI',
    heroSubtitle: 'Personalized learning. Smarter every day.',
    continueLearning: 'Continue Learning',
    askTutor: 'Ask AI Tutor',
    viewAllCourses: 'View all courses',
    viewAll: 'View all',
    recommendedForYou: 'Recommended for You',
    aiTutorTitle: 'AI Tutor',
    online: 'Online',
    aiTutorGreeting: "Hi! I'm your AI tutor.",
    aiTutorPrompt: 'How can I help you today?',
    tutorActions: [
      'Explain a concept',
      'Quiz me on this topic',
      'Recommend resources',
    ],
    learningProgress: 'Learning Progress',
    thisWeek: 'This Week',
    totalStudyTime: 'Total Study Time',
    noEnrolledCoursesTitle: 'Start your first course',
    noEnrolledCoursesDescription:
      'Enroll in a published course to see your lessons, homework, and AI tutor progress here.',
    noRecommendationsTitle: 'No recommendations yet',
    noRecommendationsDescription:
      'New published courses will appear here when they are available for enrollment.',
    enrolledCoursesStat: 'Enrolled courses',
    completedLessonsStat: 'Completed lessons',
    submittedAssignmentsStat: 'Submitted homework',
    averageProgressStat: 'Average progress',
    lessonProgress: '{0} of {1} lessons',
    assignmentProgress: '{0} of {1} assignments',
    progressComplete: '{0}% complete',
    recommendationMeta: '{0} lessons • {1} assignments',
    nextLesson: 'Next lesson',
    noLessons: 'All lessons complete',
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    courses: [
      {
        title: 'Introduction to Artificial Intelligence',
        meta: 'Module 4 • Machine Learning Basics',
        progress: '65%',
      },
      {
        title: 'Data Structures and Algorithms',
        meta: 'Module 3 • Trees and Graphs',
        progress: '40%',
      },
      {
        title: 'UI/UX Design Fundamentals',
        meta: 'Module 2 • Design Principles',
        progress: '20%',
      },
    ],
    recommendations: [
      {
        title: 'Deep Learning Fundamentals',
        meta: 'Course • Intermediate',
        rating: '4.8 (320)',
      },
      {
        title: 'SQL for Data Analysis',
        meta: 'Course • Beginner',
        rating: '4.7 (210)',
      },
      {
        title: 'Python Programming Masterclass',
        meta: 'Course • Beginner',
        rating: '4.9 (421)',
      },
    ],
  },

  studentExperience: {
    menu: {
      myCourses: 'My Courses',
      practice: 'Practice',
      notesStudyPlan: 'Notes / Study Plan',
      aiTutor: 'AI Tutor',
      courseOverview: 'Course Overview',
    },
    title: 'Student Dashboard',
    subtitle:
      'Stay focused on the next lesson, homework, practice, and AI support for your enrolled courses.',
    heroTitle: 'Your next best study move is ready',
    heroSubtitle:
      'NexExam keeps your course progress, homework, practice, notes, and readiness in one place.',
    continueLesson: 'Continue lesson',
    continueCourse: 'Continue course',
    askCourseTutor: 'Ask course tutor',
    openCourseOverview: 'Open overview',
    startPractice: 'Start practice',
    continuePractice: 'Continue practice',
    completePractice: 'Complete practice',
    submitAnswer: 'Submit answer',
    viewCoursePlayer: 'Open player',
    addNote: 'Add note',
    saveNote: 'Save note',
    addStudyPlanItem: 'Add study plan item',
    saveStudyPlanItem: 'Save study plan item',
    markComplete: 'Mark complete',
    readinessScore: 'Exam readiness score',
    readinessInsufficient: 'Needs more practice or exam data',
    readinessReady: 'Enough data available',
    myCourses: 'My Courses',
    upcomingHomework: 'Upcoming Homework',
    practiceQuestions: 'Practice Questions',
    notesAndStudyPlan: 'Notes + Study Plan',
    recentNotes: 'Recent notes',
    todayPlan: "Today's plan",
    progress: 'Progress',
    homework: 'Homework',
    notes: 'Notes',
    studyPlan: 'Study plan',
    mobile: {
      savedOffline: 'Saved offline. It will sync when you are back online.',
      syncFailed: 'Sync failed',
      continueLearning: 'Continue learning',
      offlineStatus: {
        online: 'Online',
        offline: 'Offline mode: changes are saved on this device.',
        syncing: 'Syncing saved mobile work...',
        synced: 'Mobile work synced.',
        failed: 'Some mobile work needs another sync attempt.',
      },
    },
    adaptivePlan: {
      title: 'Adaptive study plan',
      body: 'Set your target and NexExam will turn readiness, weak areas, homework, and practice history into focused tasks.',
      badge: 'AI-guided',
      examNameLabel: 'Exam or goal',
      examNamePlaceholder: 'Certification, final, or target outcome',
      targetExamDateLabel: 'Target exam date',
      weakAreasLabel: 'Current weak areas',
      noWeakAreas: 'Complete practice to reveal weak areas.',
      generate: 'Generate adaptive plan',
      regenerate: 'Refresh adaptive plan',
      itemsCreated: '{0} adaptive task(s) added.',
      itemTitles: {
        diagnostic: 'Complete your baseline diagnostic',
        weakArea: 'Strengthen weak area: {0}',
        homework: 'Finish homework: {0}',
        lesson: 'Continue lesson: {0}',
        practice: 'Practice questions for {0}',
        maintain: 'Maintain readiness for {0}',
      },
      itemDescriptions: {
        diagnostic:
          'Answer practice questions for {0} so NexExam can calibrate your readiness.',
        weakArea: 'Review explanations and retake practice focused on {0}.',
        homework: 'Complete or revise {0} before adding more new material.',
        lesson: 'Move through {0} and mark it complete when finished.',
        practice:
          'Use a focused practice session to confirm your course mastery for {0}.',
        maintain:
          'Keep momentum with a short review, notes refresh, and practice check for {0}.',
      },
    },
    learningOutcomes: {
      title: 'Learning outcomes',
      body: 'Use diagnostics, mastery, recall, remediation, and exam simulation to turn course progress into measurable readiness.',
      badge: 'Outcome engine',
      summary: {
        masteryAverage: 'Mastery average',
        dueFlashcards: 'Due flashcards',
        streak: 'Study streak',
        mockExam: 'Mock exam',
      },
      diagnostic: {
        title: 'Adaptive diagnostic',
        body: 'Start a baseline check so NexExam can map your strongest and weakest exam domains.',
        start: 'Start diagnostic',
        restart: 'Retake diagnostic',
        submit: 'Save answer',
        complete: 'Complete diagnostic',
        answered: '{0} of {1} answered',
        lastScore: 'Last diagnostic: {0}% across {1} questions',
        noQuestions: 'Add approved questions before diagnostics can run.',
      },
      mastery: {
        title: 'Domain mastery map',
        empty:
          'Complete diagnostics, practice, or mock exams to build a mastery map.',
        evidence: '{0} evidence point(s)',
        confidence: {
          low: 'Low confidence',
          medium: 'Medium confidence',
          high: 'High confidence',
        },
        actions: {
          diagnose: 'Needs a diagnostic baseline.',
          remediate: 'Prioritize remediation before new lessons.',
          practice: 'Practice until the score is stable.',
          maintain: 'Maintain with spaced review.',
        },
      },
      flashcards: {
        title: 'Spaced repetition',
        dueCount: '{0} of {1} card(s) due',
        nextDue: 'Next due {0}',
        inSet: 'From {0}',
        flip: 'Flip card',
        empty: 'No flashcards are due right now.',
        openPlayer: 'Open flashcards',
        ratings: {
          again: 'Again',
          hard: 'Hard',
          good: 'Good',
          easy: 'Easy',
        },
      },
      streak: {
        dayCount: '{0} day(s)',
      },
      remediation: {
        title: 'Weak-area remediation',
        body: 'Generate a short plan that targets the domain most likely to hold back readiness.',
        generate: 'Generate remediation plan',
        refresh: 'Refresh remediation plan',
        noWeakDomains: 'No weak domains detected yet.',
        planTitle: 'Remediation sprint: {0}',
        planDescription: 'Focused review, practice, and recall for {0}.',
        itemsCreated: '{0} remediation task(s) added.',
        itemTitles: {
          review: 'Review fundamentals: {0}',
          practice: 'Practice weak domain: {0}',
          recall: 'Recall check: {0}',
        },
        itemDescriptions: {
          review: 'Revisit lessons, notes, and explanations tied to {0}.',
          practice:
            'Answer focused questions and review missed explanations for {0}.',
          recall:
            'Use flashcards or a short self-check to confirm retention for {0}.',
        },
      },
      schedule: {
        title: 'Calendar study schedule',
        empty: 'No scheduled study tasks yet.',
        flashcardsTitle: '{0} flashcard(s) due',
      },
      mockExams: {
        title: 'Mock exam simulation',
        noExams: 'No mock exams are ready for this course yet.',
        available: 'Available',
        simulations: 'Simulations',
        bestScore: 'Best score',
        lastScore: 'Last score',
        openPlayer: 'Open mock exams',
      },
    },
    noCoursesTitle: 'Enroll in your first course',
    noCoursesBody:
      'Published courses you enroll in will appear here with progress, homework, practice, and AI tutor context.',
    noHomework: 'No upcoming homework.',
    noPractice: 'No practice questions are ready for this course yet.',
    noNotes: 'No notes yet.',
    noStudyPlan: 'No study plan items yet.',
    emptyPracticeAttempt:
      'Start a practice session to answer course questions.',
    noteTitlePlaceholder: 'Note title',
    noteContentPlaceholder: 'What do you want to remember?',
    studyPlanTitlePlaceholder: 'Study task',
    studyPlanDescriptionPlaceholder: 'Optional details',
    plannedForDate: 'Planned date',
    answerOptions: 'Answer options',
    selectedAnswer: 'Selected answer',
    correctAnswer: 'Correct answer',
    explanation: 'Explanation',
    score: '{0}%',
    lessonsProgress: '{0} of {1} lessons complete',
    answeredProgress: '{0} of {1} answered',
    homeworkProgress: '{0} complete • {1} open',
    practiceAccuracy: '{0}% accuracy',
    attemptsCount: '{0} attempt(s)',
    availableQuestionCount: '{0} available question(s)',
    nextAction: {
      lesson: 'Continue {0}',
      homework: 'Finish homework: {0}',
      practice: 'Practice {0}',
      none: 'Explore courses',
    },
    homeworkStatus: {
      open: 'Open',
      dueSoon: 'Due soon',
      overdue: 'Overdue',
      submitted: 'Submitted',
      complete: 'Complete',
      needsRevision: 'Needs revision',
    },
    practiceStatus: {
      active: 'In progress',
      completed: 'Completed',
    },
    signals: {
      courseProgress: 'Course progress',
      homework: 'Homework',
      practice: 'Practice',
      exam: 'Exam attempts',
      recentActivity: 'Recent activity',
    },
    suggestions: {
      lesson: 'Review lesson: {0}',
      homework: 'Work on homework: {0}',
      practice: 'Practice questions for {0}',
    },
    aiPrompts: [
      'Explain my next lesson',
      'Quiz me from this course',
      'Build a study plan',
    ],
    success: {
      noteSaved: 'Note saved.',
      studyPlanSaved: 'Study plan item saved.',
      studyPlanUpdated: 'Study plan updated.',
      adaptivePlanGenerated: 'Adaptive study plan updated.',
      diagnosticStarted: 'Diagnostic started.',
      diagnosticCompleted: 'Diagnostic completed.',
      flashcardReviewed: 'Flashcard review saved.',
      remediationGenerated: 'Remediation plan added.',
      answerSaved: 'Answer saved.',
      practiceCompleted: 'Practice completed.',
    },
    errors: {
      noPractice:
        'No answerable practice questions are available for this course.',
      practiceComplete: 'This practice attempt is already complete.',
      invalidAnswer: 'Choose a valid answer option.',
      diagnosticIncomplete:
        'Answer every diagnostic question before completing.',
    },
  },

  auth: {
    layout: {
      brandName: 'NexExam',
      heroTitle: 'Unlock your spatial learning.',
      heroSubtitle:
        'The next generation of education, built for the spatial web. Smarter, intuitive, and seamlessly yours.',
      authTabsLabel: 'Authentication options',
      aiTutorTitle: 'AI Tutor',
      aiTutorDescription: 'Always available',
      flowStateTitle: 'Flow State',
      flowStateDescription: 'Distraction-free',
      insightsTitle: 'Insights',
      insightsDescription: 'Real-time metrics',
      secureFooter: 'Protected by advanced encryption.',
    },
    signIn: {
      oauthError:
        'Not possible to sign-in with this provider. Please use another one.',
      title: 'Sign In',
      cardTitle: 'Welcome back',
      cardSubtitle: 'Enter your details to access your dashboard.',
      menu: 'Sign In',
      button: 'Sign In with Email',
      success: 'Successfully signed in',
      signingIn: 'Signing in...',
      email: 'Email',
      password: 'Password',
      socialHeader: 'Or continue with',
      google: 'Google',
      passwordResetRequestLink: 'Forgot Password?',
      signUpLink: `Don't have an account? Create one`,
      studentSignUpLink: `Need a student account? Sign up as a student`,
      creatorSignUpLink: `Want to teach? Sign up as a creator`,
    },
    signUp: {
      title: 'Sign Up',
      menu: 'Sign Up',
      studentMenu: 'Student Sign Up',
      creatorMenu: 'Creator Sign Up',
      studentTab: 'Student',
      creatorTab: 'Creator',
      studentTitle: 'Student Sign Up',
      creatorTitle: 'Creator Sign Up',
      studentCardTitle: 'Join as a student',
      creatorCardTitle: 'Join as a creator',
      cardSubtitle: 'Create an account to start your journey.',
      studentSubtitle:
        'Enroll in exam prep courses, finish lessons, submit homework, and study with AI support.',
      creatorSubtitle:
        'Apply to become a verified teacher and prepare to publish NexExam courses after approval.',
      signInLink: 'Already have an account? Sign in',
      button: 'Sign Up',
      success: 'Successfully signed up',
      email: 'Email',
      password: 'Password',
      invitationEmailLocked:
        'This email is locked because you are signing up via invitation.',
    },
    verifyEmailRequest: {
      title: 'Resend email verification',
      button: 'Resend email verification',
      message: 'Please confirm your email at <strong>{0}</strong> to continue.',
      success: 'Email verification successfully sent!',
      noEmail: 'No email address provided. Please sign up or sign in.',
    },
    verifyEmailConfirm: {
      title: 'Verify Email',
      success: 'Email successfully verified.',
      loadingMessage: 'Just a moment, your email is being verified...',
    },
    passwordResetRequest: {
      title: 'Forgot password',
      signInLink: 'Cancel',
      button: 'Send password reset email',
      email: 'Email',
      success: 'Password reset email successfully sent',
    },
    passwordResetConfirm: {
      title: 'Reset Password',
      signInLink: 'Cancel',
      button: 'Reset Password',
      password: 'Password',
      success: 'Password successfully changed',
    },
    noPermissions: {
      title: 'No Permissions',
      message:
        'You have no permissions yet. Please wait for the admin to grant you privileges.',
    },
    invitation: {
      title: 'Invitation',
      success: 'Invitation successfully accepted',
      loadingMessage: 'Just a moment, we are accepting the invitation...',
      invalidToken: 'Expired or invalid invitation token.',
      errors: {
        INVITATION_EMAIL_MISMATCH:
          'This invitation was sent to a different email address. Please sign in with the correct account.',
        INVITATION_EXPIRED: 'This invitation has expired',
        INVITATION_NOT_PENDING:
          'This invitation has already been accepted or cancelled',
      },
    },
    organization: {
      title: 'Organization',
      create: {
        name: 'Organization Name',
        success: 'Organization successfully created',
        button: 'Create Organization',
      },
      select: {
        organization: 'Select a Organization',
        joinSuccess: 'Successfully joined organization',
        select: 'Select Organization',
        continue: 'Continue',
        autoSelecting: 'Selecting organization...',
      },
      invitationAccepted: 'Invitation accepted successfully',
      invitationAcceptError: 'Failed to accept invitation',
      acceptingInvitation: 'Accepting invitation...',
      invitationRejected: 'Invitation rejected',
      invitationRejectError: 'Failed to reject invitation',
      rejectingInvitation: 'Rejecting invitation...',
      rejectInvitation: 'Reject',
      rejectInvitationTitle: 'Reject Invitation?',
      rejectInvitationDescription:
        'Are you sure you want to reject this invitation? This action cannot be undone.',
      invitations: 'Invitations',
      pendingInvitation: 'Pending invitation',
    },
    passwordChange: {
      title: 'Password Change',
      menu: 'Password Change',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      newPasswordConfirmation: 'New Password Confirmation',
      button: 'Save Password',
      success: 'Password changed successfully saved',
      mustMatch: 'Passwords must match',
      cancel: 'Cancel',
    },
    emailChange: {
      title: 'Email Change',
      menu: 'Email Change',
      newEmail: 'New Email',
      button: 'Change Email',
      success: 'Verification email sent. Check your current email to approve.',
      confirmSuccess: 'Email changed successfully',
      confirmStepTwo:
        'We sent a verification email to <strong>{0}</strong>. Please check your inbox to complete the change.',
      cancel: 'Cancel',
      loadingMessage: 'Just a moment, your email change is being confirmed...',
    },
    emailChangeConfirm: {
      title: 'Confirm Email Change',
      confirmSuccess: 'Email changed successfully',
      loadingMessage: 'Just a moment, your email change is being confirmed...',
    },
    profile: {
      title: 'Profile',
      menu: 'Profile',
      email: 'Current Email',
      firstName: 'First Name',
      lastName: 'Last Name',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Enable Notifications',
      isNotificationsEnabledHint:
        'Receive email and push notifications for important updates and activities in your organization',
      button: 'Save Profile',
      success: 'Profile successfully saved',
      cancel: 'Cancel',
    },
    profileOnboard: {
      firstName: 'First Name',
      lastName: 'Last Name',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Enable Notifications',
      isNotificationsEnabledHint:
        'Receive email and push notifications for important updates and activities',
      button: 'Save Profile',
      success: 'Profile successfully saved',
    },
    signOut: {
      menu: 'Sign Out',
      button: 'Sign Out',
      title: 'Sign Out',
      loading: `You're being signed out...`,
    },
    errors: {
      invalidPasswordResetToken:
        'Password reset link is invalid or has expired',
      invalidVerifyEmailToken:
        'Email verification link is invalid or has expired',

      USER_NOT_FOUND: 'User not found',
      FAILED_TO_CREATE_USER: 'Failed to create user',
      FAILED_TO_CREATE_SESSION: 'Failed to create session',
      FAILED_TO_UPDATE_USER: 'Failed to update user',
      FAILED_TO_GET_SESSION: 'Failed to get session',
      INVALID_PASSWORD: 'Invalid password',
      INVALID_EMAIL: 'Invalid email',
      INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
      SOCIAL_ACCOUNT_ALREADY_LINKED: 'Social account already linked',
      PROVIDER_NOT_FOUND: 'Provider not found',
      INVALID_TOKEN: 'Invalid token',
      ID_TOKEN_NOT_SUPPORTED: 'ID token not supported',
      FAILED_TO_GET_USER_INFO: 'Failed to get user info',
      USER_EMAIL_NOT_FOUND: 'User email not found',
      EMAIL_NOT_VERIFIED: 'Email not verified',
      CANNOT_REMOVE_ADMIN_WITH_SUBSCRIPTION:
        'Cannot delete admin or remove admin role while the organization has an active subscription',
      CANNOT_REMOVE_SELF: "You can't remove yourself from the organization",
      PASSWORD_TOO_SHORT: 'Password too short',
      PASSWORD_TOO_LONG: 'Password too long',
      USER_ALREADY_EXISTS: 'User already exists',
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        'User already exists. Use another email',
      EMAIL_CAN_NOT_BE_UPDATED: 'Email can not be updated',
      CREDENTIAL_ACCOUNT_NOT_FOUND: 'Credential account not found',
      SESSION_EXPIRED: 'Session expired',
      FAILED_TO_UNLINK_LAST_ACCOUNT: 'Failed to unlink last account',
      ACCOUNT_NOT_FOUND: 'Account not found',
      USER_ALREADY_HAS_PASSWORD: 'User already has password',
      INVALID_METADATA_TYPE: 'Invalid metadata type',
      REFILL_AMOUNT_AND_INTERVAL_REQUIRED:
        'Refill amount and interval required',
      REFILL_INTERVAL_AND_AMOUNT_REQUIRED:
        'Refill interval and amount required',
      USER_BANNED: 'User banned',
      UNAUTHORIZED_SESSION: 'Unauthorized session',
      KEY_NOT_FOUND: 'Key not found',
      KEY_DISABLED: 'Key disabled',
      KEY_EXPIRED: 'Key expired',
      USAGE_EXCEEDED: 'Usage exceeded',
      KEY_NOT_RECOVERABLE: 'Key not recoverable',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION:
        'You are not allowed to create a new organization',
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS:
        'You have reached the maximum number of organizations',
      ORGANIZATION_ALREADY_EXISTS: 'Organization already exists',
      ORGANIZATION_NOT_FOUND: 'Organization not found',
      USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION:
        'User is not a member of the organization',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION:
        'You are not allowed to update this organization',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION:
        'You are not allowed to delete this organization',
      NO_ACTIVE_ORGANIZATION: 'No active organization',
      USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION:
        'User is already a member of this organization',
      MEMBER_NOT_FOUND: 'Member not found',
      ROLE_NOT_FOUND: 'Role not found',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM:
        'You are not allowed to create a new team',
      TEAM_ALREADY_EXISTS: 'Team already exists',
      TEAM_NOT_FOUND: 'Team not found',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER:
        'You cannot leave the organization as the only admin',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER:
        'You cannot leave the organization without an owner',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER:
        'You are not allowed to delete this member',
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION:
        'You are not allowed to invite users to this organization',
      USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION:
        'User is already invited to this organization',
      INVITATION_NOT_FOUND: 'Invitation not found',
      INVITATION_EMAIL_MISMATCH:
        'This invitation was sent to a different email address. Please sign in with the correct account.',
      INVITATION_EXPIRED: 'This invitation has expired',
      INVITATION_NOT_PENDING:
        'This invitation has already been accepted or cancelled',
      YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION:
        'You are not the recipient of the invitation',
      EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION:
        'Email verification required before accepting or rejecting invitation',
      YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION:
        'You are not allowed to cancel this invitation',
      INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION:
        'Inviter is no longer a member of the organization',
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE:
        'You are not allowed to invite user with this role',
      FAILED_TO_RETRIEVE_INVITATION: 'Failed to retrieve invitation',
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS:
        'You have reached the maximum number of teams',
      UNABLE_TO_REMOVE_LAST_TEAM: 'Unable to remove last team',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER:
        'You are not allowed to update this member',
      ORGANIZATION_MEMBERSHIP_LIMIT_REACHED:
        'Organization membership limit reached',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION:
        'You are not allowed to create teams in this organization',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION:
        'You are not allowed to delete teams in this organization',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM:
        'You are not allowed to update this team',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM:
        'You are not allowed to delete this team',
      INVITATION_LIMIT_REACHED: 'Invitation limit reached',
      YOU_CANNOT_BAN_YOURSELF: 'You cannot ban yourself',
      YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE:
        'You are not allowed to change users role',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS:
        'You are not allowed to create users',
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: 'You are not allowed to list users',
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS:
        'You are not allowed to list users sessions',
      YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: 'You are not allowed to ban users',
      YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS:
        'You are not allowed to impersonate users',
      YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS:
        'You are not allowed to revoke users sessions',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS:
        'You are not allowed to delete users',
      YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD:
        'You are not allowed to set users password',
      BANNED_USER: 'You have been banned from this application',
      YOU_ARE_NOT_ALLOWED_TO_GET_USER: 'You are not allowed to get user',
      NO_DATA_TO_UPDATE: 'No data to update',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS:
        'You are not allowed to update users',
      YOU_CANNOT_REMOVE_YOURSELF: 'You cannot remove yourself',
      COULD_NOT_CREATE_SESSION: 'Could not create session',
      ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY:
        'Anonymous users cannot sign in again anonymously',
      CHALLENGE_NOT_FOUND: 'Challenge not found',
      YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY:
        'You are not allowed to register this passkey',
      FAILED_TO_VERIFY_REGISTRATION: 'Failed to verify registration',
      PASSKEY_NOT_FOUND: 'Passkey not found',
      AUTHENTICATION_FAILED: 'Authentication failed',
      UNABLE_TO_CREATE_SESSION: 'Unable to create session',
      FAILED_TO_UPDATE_PASSKEY: 'Failed to update passkey',
      INVALID_PHONE_NUMBER: 'Invalid phone number',
      PHONE_NUMBER_EXIST: 'Phone number exist',
      INVALID_PHONE_NUMBER_OR_PASSWORD: 'Invalid phone number or password',
      UNEXPECTED_ERROR: 'Unexpected error',
      OTP_NOT_FOUND: 'OTP not found',
      OTP_EXPIRED: 'OTP expired',
      INVALID_OTP: 'Invalid OTP',
      PHONE_NUMBER_NOT_VERIFIED: 'Phone number not verified',
      INVALID_DEVICE_CODE: 'Invalid device code',
      EXPIRED_DEVICE_CODE: 'Expired device code',
      EXPIRED_USER_CODE: 'Expired user code',
      AUTHORIZATION_PENDING: 'Authorization pending',
      ACCESS_DENIED: 'Access denied',
      INVALID_USER_CODE: 'Invalid user code',
      DEVICE_CODE_ALREADY_PROCESSED: 'Device code already processed',
      POLLING_TOO_FREQUENTLY: 'Polling too frequently',
      INVALID_DEVICE_CODE_STATUS: 'Invalid device code status',
      AUTHENTICATION_REQUIRED: 'Authentication required',
      OTP_NOT_ENABLED: 'OTP not enabled',
      OTP_HAS_EXPIRED: 'OTP has expired',
      TOTP_NOT_ENABLED: 'TOTP not enabled',
      TWO_FACTOR_NOT_ENABLED: 'Two factor not enabled',
      BACKUP_CODES_NOT_ENABLED: 'Backup codes not enabled',
      INVALID_BACKUP_CODE: 'Invalid backup code',
      INVALID_CODE: 'Invalid code',
      TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: 'Too many attempts. Request new code',
      INVALID_TWO_FACTOR_COOKIE: 'Invalid two factor cookie',
      INVALID_USERNAME_OR_PASSWORD: 'Invalid username or password',
      USERNAME_IS_ALREADY_TAKEN: 'Username is already taken',
      USERNAME_TOO_SHORT: 'Username too short',
      USERNAME_TOO_LONG: 'Username too long',
      INVALID_USERNAME: 'Invalid username',
      INVALID_DISPLAY_USERNAME: 'Invalid display username',
      TOO_MANY_ATTEMPTS: 'Too many attempts',
      PASSWORD_COMPROMISED: 'Password compromised',
      INVALID_OAUTH_CONFIGURATION: 'Invalid OAuth configuration',
      INVALID_SESSION_TOKEN: 'Invalid session token',

      EXPIRES_IN_IS_TOO_SMALL:
        'The expires at is smaller than the predefined minimum value.',
      EXPIRES_IN_IS_TOO_LARGE:
        'The expires at is larger than the predefined maximum value.',
      INVALID_REMAINING:
        'The remaining count is either too large or too small.',
      INVALID_PREFIX_LENGTH:
        'The prefix length is either too large or too small.',
      INVALID_NAME_LENGTH: 'The name length is either too large or too small.',
      METADATA_DISABLED: 'Metadata is disabled.',
      RATE_LIMIT_EXCEEDED: 'Rate limit exceeded.',
      NO_VALUES_TO_UPDATE: 'No values to update.',
      KEY_DISABLED_EXPIRATION: 'Custom key expiration values are disabled.',
      INVALID_API_KEY: 'Invalid API key.',
      INVALID_USER_ID_FROM_API_KEY: 'The user id from the API key is invalid.',
      INVALID_API_KEY_GETTER_RETURN_TYPE:
        'API Key getter returned an invalid key type. Expected string.',
      SERVER_ONLY_PROPERTY:
        "The property you're trying to set can only be set from the server auth instance only.",
      FAILED_TO_UPDATE_API_KEY: 'Failed to update API key',
      NAME_REQUIRED: 'API Key name is required.',
    },
  },

  organization: {
    switcher: {
      title: 'Organizations',
      create: 'Create Organization',
      leave: 'Leave Organization',
      leaveConfirmTitle: 'Leave Organization?',
      leaveConfirmDescription:
        'Are you sure you want to leave {0}? You will lose access to all resources in this organization.',
      leaveSuccess: 'Successfully left organization',
      leaveError: 'Failed to leave organization',
    },

    invitation: {
      title: `Accept Invitation to {0}`,
      message: `You've been invited to {0}. You may choose to accept or decline.`,
    },

    applicationSettings: {
      menu: 'Application Settings',
    },

    form: {
      name: 'Name',
      subdomain: 'Subdomain',
      domain: 'Domain',
      slugPlaceholderDomain: 'organization.com',
      slugPlaceholderSubdomain: 'organization',
      slugInvalidSubdomain:
        'Subdomain must contain only lowercase letters, numbers, and hyphens. It cannot start or end with a hyphen.',
      slugInvalidDomain:
        'Domain must be a valid format (e.g., example.com). It must contain at least one dot and can only contain lowercase letters, numbers, hyphens, and dots.',
      slugReserved:
        'This slug is reserved for the application and cannot be used',
      logoLight: 'Logo (Light Mode)',
      logoDark: 'Logo (Dark Mode)',
      backgroundImageLight: 'Background Image (Light Mode)',
      backgroundImageDark: 'Background Image (Dark Mode)',

      new: {
        title: 'Create Organization',
        success: 'Organization successfully created',
      },

      edit: {
        title: 'Edit Organization',
        success: 'Organization successfully updated',
      },
    },

    delete: {
      success: 'Organization successfully deleted',
      confirmTitle: 'Delete Organization?',
      confirmDescription:
        'Are you sure you want to delete the {0} organization? This action is irreversible!',
    },

    errors: {
      notFound: 'Organization not found',
      createFailed: 'Failed to create organization',
      updateFailed: 'Failed to update organization',
      deleteFailed: 'Failed to delete organization',
      leaveFailed: 'Failed to leave organization',
      setActiveFailed: 'Failed to set active organization',
    },
  },

  member: {
    dashboardCard: {
      title: 'Users',
    },

    view: {
      title: 'View User',
    },

    showActivity: 'Activity',

    list: {
      menu: 'Users',
      title: 'Users',
      noResults: 'No users found.',
      empty:
        "You haven't created any users yet. Get started by creating your first user.",
    },

    importer: {
      title: 'Import Users',
      menu: 'Import Users',
    },

    export: {
      success: 'Users successfully exported',
    },

    edit: {
      menu: 'Edit User',
      title: 'Edit User',
      success: 'User successfully updated',
    },

    new: {
      menu: 'Invite User',
      title: 'Invite User',
      success: 'User successfully invited',
    },

    deleteMany: {
      success: 'User(s) successfully deleted',
      noSelection: 'You must select at least one user to delete.',
      confirmTitle: 'Delete User(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected user(s)?',
    },

    delete: {
      success: 'User successfully deleted',
      confirmTitle: 'Delete User?',
    },

    fields: {
      avatars: 'Avatar',
      fullName: 'Full Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      role: 'Role',
      roles: 'Roles',
      status: 'Status',
      createdAt: 'Created At',
      createdByMember: 'Created By',
      updatedAt: 'Updated At',
      updatedByMember: 'Updated By',
    },

    enumerators: {
      roles: {
        admin: 'Admin',
        member: 'Member',
      },
      status: {
        active: 'Active',
        disabled: 'Disabled',
      },
    },

    errors: {
      cannotRemoveSelfAdminRole: "You can't remove your own admin role",
      cannotRemoveSelf: "You can't remove yourself from the organization",
      notFound: 'User not found',
      disabledMemberNotFound: 'Disabled member not found',
      removeFailed: 'Failed to remove user',
      disableFailed: 'Failed to disable user',
    },

    mcpDescription: {
      list: 'Retrieve a list of all members in the current organization. Supports filtering by name, email, and role. Returns member profiles including their user information, role, status, and avatar.',
      get: 'Get detailed information about a specific member by their unique ID. Returns the complete member profile including associated user data and organization details.',
      autocomplete:
        'Search for members to use in autocomplete fields. Returns a simplified list of members matching the query, useful for assigning tasks, relationships, or permissions.',
      update:
        'Update an existing member record with new information. Allows modification of member fields including first name, last name, role, and avatar. Automatically tracks the update in audit logs. Prevents members from removing their own admin role.',
      disable:
        'Disable a member account temporarily. The member will no longer be able to access the organization but their data is preserved. Can be reversed using the restore operation.',
      restore:
        'Restore a previously disabled member account. The member will regain access to the organization with their previous role and permissions.',
      remove:
        'Permanently remove a member from the organization. This action cannot be undone. The member user account is deleted and all associated data is removed.',
    },
  },

  invitation: {
    list: {
      title: 'Invitations',
      noResults: 'No invitations found.',
    },

    view: {
      title: 'View Invitation',
    },

    resend: {
      success: 'Invitation resent successfully',
    },

    cancel: {
      success: 'Invitation cancelled successfully',
      confirmTitle: 'Are you sure you want to cancel this invitation?',
    },

    actions: {
      resend: 'Resend',
      cancel: 'Cancel',
    },

    fields: {
      email: 'Email',
      role: 'Role',
      status: 'Status',
      expiresAt: 'Expires At',
      invitedBy: 'Invited By',
      createdAt: 'Created At',
    },

    enumerators: {
      status: {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
        expired: 'Expired',
        cancelled: 'Cancelled',
      },
    },

    errors: {
      alreadyProcessed: 'Invitation has already been processed',
      notFound: 'Invitation not found',
      acceptFailed: 'Failed to accept invitation',
      rejectFailed: 'Failed to reject invitation',
      cancelFailed: 'Failed to cancel invitation',
      createFailed: 'Failed to create invitation',
      resendFailed: 'Failed to resend invitation',
    },

    cancelMany: {
      success: 'Invitations cancelled successfully',
      noSelection: 'Please select at least one invitation',
      confirmTitle: 'Cancel Invitations?',
      confirmDescription: 'Are you sure you want to cancel {0} invitation(s)?',
    },

    resendMany: {
      success: 'Invitations resent successfully',
      noSelection: 'Please select at least one invitation',
      confirmTitle: 'Resend Invitations?',
      confirmDescription: 'Are you sure you want to resend {0} invitation(s)?',
    },

    export: {
      success: 'Invitations successfully exported',
    },
  },

  subscription: {
    menu: 'Subscription',
    title: 'Plans and Pricing',

    subscribe: 'Subscribe',
    manage: 'Manage',
    notPlanUser: 'You are not the manager of this subscription.',
    cancelAt: 'Your subscription will be canceled on',
    currentPlan: 'Current plan:',
    unknown: 'Unknown',
    noPlansAvailable: 'No subscription plans available.',
    current: 'Current',
    mobileUnavailableTitle: 'Subscriptions Unavailable',
    mobileUnavailable:
      'Subscriptions are not available on mobile. Please visit our website on a desktop browser to manage your subscription.',

    intervals: {
      day: 'Daily',
      week: 'Weekly',
      month: 'Monthly',
      year: 'Yearly',
    },

    errors: {
      disabled: 'Subscriptions are disabled in this platform',
      alreadyExistsActive: 'There is an active subscription already',
      stripeNotConfigured: 'Stripe ENV vars are missing',
    },

    mcpDescription: {
      checkout:
        'Create a Stripe checkout session to subscribe to a pricing plan. Provide the Stripe price ID and the system will generate a checkout URL where users can complete payment. Returns the checkout session URL.',
      portal:
        'Generate a Stripe customer portal URL where users can manage their subscription, update payment methods, view invoices, and cancel their subscription. Requires an active subscription.',
      plans:
        'Retrieve all available subscription plans from Stripe. Returns a list of plans with pricing information, features, billing intervals, and availability status. Includes both active and archived plans.',
    },
  },
  exam: {
    dashboardCard: {
      title: 'Exams',
    },

    list: {
      menu: 'Exams',
      title: 'Exams',
      noResults: 'No exams found.',
      empty:
        "You haven't created any exams yet. Get started by creating your first exam.",
    },

    importer: {
      title: 'Import Exams',
      menu: 'Import Exams',
    },

    export: {
      success: 'Exams successfully exported',
    },

    new: {
      menu: 'New Exam',
      title: 'New Exam',
      success: 'Exam successfully created',
    },

    view: {
      title: 'View Exam',
    },

    edit: {
      menu: 'Edit Exam',
      title: 'Edit Exam',
      success: 'Exam successfully updated',
    },

    restore: {
      success: 'Exam successfully restored',
      confirmTitle: 'Restore Exam?',
    },

    restoreMany: {
      success: 'Exam(s) successfully restored',
      noSelection: 'You must select at least one exam to restore.',
      confirmTitle: 'Restore Exam(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected exam(s)?',
    },

    archiveMany: {
      success: 'Exam(s) successfully archived',
      noSelection: 'You must select at least one exam to archive.',
      confirmTitle: 'Archive Exam(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected exam(s)?',
    },

    archive: {
      success: 'Exam successfully archived',
      confirmTitle: 'Archive Exam?',
    },

    deleteMany: {
      success: 'Exam(s) successfully deleted',
      noSelection: 'You must select at least one exam to delete.',
      confirmTitle: 'Delete Exam(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected exam(s)?',
    },

    delete: {
      success: 'Exam successfully deleted',
      confirmTitle: 'Delete Exam?',
    },

    fields: {
      name: 'Name',
      code: 'Code',
      description: 'Description',
      iconUrl: 'Icon URL',
      course: 'Course',
      isActive: 'Active',
      chapters: 'Chapters',
      concepts: 'Concepts',
      examTypes: 'Exam Types',
      documentUploads: 'Document Uploads',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      name: 'Exam name (e.g., FINRA SIE)',
      code: 'Short exam code (e.g., SIE, SERIES7)',
      description: '',
      iconUrl: '',
      isActive: '',
      chapters: '',
      concepts: '',
      examTypes: '',
      documentUploads: '',
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of exams with advanced filtering options. Supports filtering by various fields and related entities. Returns exam details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific exam by their unique ID. Returns complete exam profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new exam record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing exam record with new information. Allows modification of all exam fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more exams from the system. This action is irreversible. Accepts an array of exam IDs and removes all associated data.',
      archive:
        'Archive one or more exams to hide them from default views while preserving their data. Archived exams can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived exams back to active status. Makes the exams visible in default views again.',
      autocomplete:
        'Search and retrieve exam suggestions for autocomplete inputs. Returns a simplified list of exams matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  chapter: {
    dashboardCard: {
      title: 'Chapters',
    },

    list: {
      menu: 'Chapters',
      title: 'Chapters',
      noResults: 'No chapters found.',
      empty:
        "You haven't created any chapters yet. Get started by creating your first chapter.",
    },

    importer: {
      title: 'Import Chapters',
      menu: 'Import Chapters',
    },

    export: {
      success: 'Chapters successfully exported',
    },

    new: {
      menu: 'New Chapter',
      title: 'New Chapter',
      success: 'Chapter successfully created',
    },

    view: {
      title: 'View Chapter',
    },

    edit: {
      menu: 'Edit Chapter',
      title: 'Edit Chapter',
      success: 'Chapter successfully updated',
    },

    restore: {
      success: 'Chapter successfully restored',
      confirmTitle: 'Restore Chapter?',
    },

    restoreMany: {
      success: 'Chapter(s) successfully restored',
      noSelection: 'You must select at least one chapter to restore.',
      confirmTitle: 'Restore Chapter(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected chapter(s)?',
    },

    archiveMany: {
      success: 'Chapter(s) successfully archived',
      noSelection: 'You must select at least one chapter to archive.',
      confirmTitle: 'Archive Chapter(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected chapter(s)?',
    },

    archive: {
      success: 'Chapter successfully archived',
      confirmTitle: 'Archive Chapter?',
    },

    deleteMany: {
      success: 'Chapter(s) successfully deleted',
      noSelection: 'You must select at least one chapter to delete.',
      confirmTitle: 'Delete Chapter(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected chapter(s)?',
    },

    delete: {
      success: 'Chapter successfully deleted',
      confirmTitle: 'Delete Chapter?',
    },

    fields: {
      title: 'Title',
      chapterNumber: 'Chapter Number',
      description: 'Description',
      aiTutorPrompt: 'AI Tutor Prompt',
      xpReward: 'XP Reward',
      orderIndex: 'Order Index',
      workflowStatus: 'Workflow Status',
      isPublished: 'Published',
      version: 'Version',
      objectives: 'Objectives',
      course: 'Course',
      exam: 'Exam',
      lessons: 'Lessons',
      practiceQuestions: 'Practice Questions',
      studyNotes: 'Study Notes',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      title: '',
      chapterNumber: '',
      description: '',
      aiTutorPrompt: 'System prompt for the chapter AI tutor',
      xpReward: '',
      orderIndex: '',
      workflowStatus: '',
      isPublished: '',
      version: '',
      objectives: 'Learning objectives for this chapter',
      exam: '',
      lessons: '',
      practiceQuestions: '',
      studyNotes: '',
    },
    enumerators: {
      workflowStatus: {
        draft: 'Draft',
        in_review: 'In Review',
        approved: 'Approved',
        published: 'Published',
      },
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of chapters with advanced filtering options. Supports filtering by various fields and related entities. Returns chapter details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific chapter by their unique ID. Returns complete chapter profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new chapter record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing chapter record with new information. Allows modification of all chapter fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more chapters from the system. This action is irreversible. Accepts an array of chapter IDs and removes all associated data.',
      archive:
        'Archive one or more chapters to hide them from default views while preserving their data. Archived chapters can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived chapters back to active status. Makes the chapters visible in default views again.',
      autocomplete:
        'Search and retrieve chapter suggestions for autocomplete inputs. Returns a simplified list of chapters matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  lesson: {
    dashboardCard: {
      title: 'Lessons',
    },

    list: {
      menu: 'Lessons',
      title: 'Lessons',
      noResults: 'No lessons found.',
      empty:
        "You haven't created any lessons yet. Get started by creating your first lesson.",
    },

    importer: {
      title: 'Import Lessons',
      menu: 'Import Lessons',
    },

    export: {
      success: 'Lessons successfully exported',
    },

    new: {
      menu: 'New Lesson',
      title: 'New Lesson',
      success: 'Lesson successfully created',
    },

    view: {
      title: 'View Lesson',
    },

    edit: {
      menu: 'Edit Lesson',
      title: 'Edit Lesson',
      success: 'Lesson successfully updated',
    },

    restore: {
      success: 'Lesson successfully restored',
      confirmTitle: 'Restore Lesson?',
    },

    restoreMany: {
      success: 'Lesson(s) successfully restored',
      noSelection: 'You must select at least one lesson to restore.',
      confirmTitle: 'Restore Lesson(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected lesson(s)?',
    },

    archiveMany: {
      success: 'Lesson(s) successfully archived',
      noSelection: 'You must select at least one lesson to archive.',
      confirmTitle: 'Archive Lesson(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected lesson(s)?',
    },

    archive: {
      success: 'Lesson successfully archived',
      confirmTitle: 'Archive Lesson?',
    },

    deleteMany: {
      success: 'Lesson(s) successfully deleted',
      noSelection: 'You must select at least one lesson to delete.',
      confirmTitle: 'Delete Lesson(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected lesson(s)?',
    },

    delete: {
      success: 'Lesson successfully deleted',
      confirmTitle: 'Delete Lesson?',
    },

    fields: {
      title: 'Title',
      lessonNumber: 'Lesson Number',
      content: 'Content',
      estimatedMinutes: 'Estimated Minutes',
      xpReward: 'XP Reward',
      workflowStatus: 'Workflow Status',
      isPublished: 'Published',
      course: 'Course',
      chapter: 'Chapter',
      studyNotes: 'Study Notes',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      title: '',
      lessonNumber: '',
      content: 'Lesson body (Markdown supported)',
      estimatedMinutes: '',
      xpReward: '',
      workflowStatus: '',
      isPublished: '',
      chapter: '',
      studyNotes: '',
    },
    enumerators: {
      workflowStatus: {
        draft: 'Draft',
        in_review: 'In Review',
        approved: 'Approved',
        published: 'Published',
      },
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of lessons with advanced filtering options. Supports filtering by various fields and related entities. Returns lesson details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific lesson by their unique ID. Returns complete lesson profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new lesson record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing lesson record with new information. Allows modification of all lesson fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more lessons from the system. This action is irreversible. Accepts an array of lesson IDs and removes all associated data.',
      archive:
        'Archive one or more lessons to hide them from default views while preserving their data. Archived lessons can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived lessons back to active status. Makes the lessons visible in default views again.',
      autocomplete:
        'Search and retrieve lesson suggestions for autocomplete inputs. Returns a simplified list of lessons matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  practiceQuestion: {
    dashboardCard: {
      title: 'Practice Questions',
    },

    list: {
      menu: 'Practice Questions',
      title: 'Practice Questions',
      noResults: 'No practice questions found.',
      empty:
        "You haven't created any practice questions yet. Get started by creating your first practice question.",
    },

    importer: {
      title: 'Import Practice Questions',
      menu: 'Import Practice Questions',
    },

    export: {
      success: 'Practice Questions successfully exported',
    },

    new: {
      menu: 'New Practice Question',
      title: 'New Practice Question',
      success: 'Practice Question successfully created',
    },

    view: {
      title: 'View Practice Question',
    },

    edit: {
      menu: 'Edit Practice Question',
      title: 'Edit Practice Question',
      success: 'Practice Question successfully updated',
    },

    restore: {
      success: 'Practice Question successfully restored',
      confirmTitle: 'Restore Practice Question?',
    },

    restoreMany: {
      success: 'Practice Question(s) successfully restored',
      noSelection: 'You must select at least one practice question to restore.',
      confirmTitle: 'Restore Practice Question(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected practice question(s)?',
    },

    archiveMany: {
      success: 'Practice Question(s) successfully archived',
      noSelection: 'You must select at least one practice question to archive.',
      confirmTitle: 'Archive Practice Question(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected practice question(s)?',
    },

    archive: {
      success: 'Practice Question successfully archived',
      confirmTitle: 'Archive Practice Question?',
    },

    deleteMany: {
      success: 'Practice Question(s) successfully deleted',
      noSelection: 'You must select at least one practice question to delete.',
      confirmTitle: 'Delete Practice Question(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected practice question(s)?',
    },

    delete: {
      success: 'Practice Question successfully deleted',
      confirmTitle: 'Delete Practice Question?',
    },

    fields: {
      questionText: 'Question Text',
      correctAnswerIndex: 'Correct Answer Index',
      answerOptions: 'Answer Options',
      explanation: 'Explanation',
      difficulty: 'Difficulty',
      category: 'Category',
      isActive: 'Active',
      tags: 'Tags',
      course: 'Course',
      chapter: 'Chapter',
      concepts: 'Related Concepts',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      questionText: '',
      correctAnswerIndex: 'Zero-based index of the correct option',
      answerOptions:
        'Enter one option per line. Student practice uses only questions with answer options.',
      explanation: 'Why the correct answer is correct',
      difficulty: '',
      category: '',
      isActive: '',
      tags: '',
      chapter: '',
      concepts: '',
    },
    enumerators: {
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        expert: 'Expert',
      },
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of practice questions with advanced filtering options. Supports filtering by various fields and related entities. Returns practice question details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific practice question by their unique ID. Returns complete practice question profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new practice question record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing practice question record with new information. Allows modification of all practice question fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more practice questions from the system. This action is irreversible. Accepts an array of practice question IDs and removes all associated data.',
      archive:
        'Archive one or more practice questions to hide them from default views while preserving their data. Archived practice questions can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived practice questions back to active status. Makes the practice questions visible in default views again.',
      autocomplete:
        'Search and retrieve practice question suggestions for autocomplete inputs. Returns a simplified list of practice questions matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  concept: {
    dashboardCard: {
      title: 'Concepts',
    },

    list: {
      menu: 'Concepts',
      title: 'Concepts',
      noResults: 'No concepts found.',
      empty:
        "You haven't created any concepts yet. Get started by creating your first concept.",
    },

    importer: {
      title: 'Import Concepts',
      menu: 'Import Concepts',
    },

    export: {
      success: 'Concepts successfully exported',
    },

    new: {
      menu: 'New Concept',
      title: 'New Concept',
      success: 'Concept successfully created',
    },

    view: {
      title: 'View Concept',
    },

    edit: {
      menu: 'Edit Concept',
      title: 'Edit Concept',
      success: 'Concept successfully updated',
    },

    restore: {
      success: 'Concept successfully restored',
      confirmTitle: 'Restore Concept?',
    },

    restoreMany: {
      success: 'Concept(s) successfully restored',
      noSelection: 'You must select at least one concept to restore.',
      confirmTitle: 'Restore Concept(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected concept(s)?',
    },

    archiveMany: {
      success: 'Concept(s) successfully archived',
      noSelection: 'You must select at least one concept to archive.',
      confirmTitle: 'Archive Concept(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected concept(s)?',
    },

    archive: {
      success: 'Concept successfully archived',
      confirmTitle: 'Archive Concept?',
    },

    deleteMany: {
      success: 'Concept(s) successfully deleted',
      noSelection: 'You must select at least one concept to delete.',
      confirmTitle: 'Delete Concept(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected concept(s)?',
    },

    delete: {
      success: 'Concept successfully deleted',
      confirmTitle: 'Delete Concept?',
    },

    fields: {
      conceptName: 'Concept Name',
      conceptCode: 'Concept ID',
      conceptDescription: 'Description',
      explanation: 'Explanation',
      examDomain: 'Exam Domain',
      difficulty: 'Difficulty',
      examWeight: 'Exam Weight',
      typicalMistakes: 'Typical Mistakes',
      examTips: 'Exam Tips',
      isActive: 'Active',
      course: 'Course',
      exam: 'Exam',
      practiceQuestions: 'Practice Questions',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      conceptName: '',
      conceptCode: 'Stable identifier (slug-like)',
      conceptDescription: '',
      explanation: 'Full explanation (Markdown)',
      examDomain: '',
      difficulty: '',
      examWeight: '',
      typicalMistakes: '',
      examTips: '',
      isActive: '',
      exam: '',
      practiceQuestions: '',
    },
    enumerators: {
      difficulty: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        expert: 'Expert',
      },
      examWeight: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        critical: 'Critical',
      },
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of concepts with advanced filtering options. Supports filtering by various fields and related entities. Returns concept details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific concept by their unique ID. Returns complete concept profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new concept record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing concept record with new information. Allows modification of all concept fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more concepts from the system. This action is irreversible. Accepts an array of concept IDs and removes all associated data.',
      archive:
        'Archive one or more concepts to hide them from default views while preserving their data. Archived concepts can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived concepts back to active status. Makes the concepts visible in default views again.',
      autocomplete:
        'Search and retrieve concept suggestions for autocomplete inputs. Returns a simplified list of concepts matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  examType: {
    dashboardCard: {
      title: 'Exam Types',
    },

    list: {
      menu: 'Exam Types',
      title: 'Exam Types',
      noResults: 'No exam types found.',
      empty:
        "You haven't created any exam types yet. Get started by creating your first exam type.",
    },

    importer: {
      title: 'Import Exam Types',
      menu: 'Import Exam Types',
    },

    export: {
      success: 'Exam Types successfully exported',
    },

    new: {
      menu: 'New Exam Type',
      title: 'New Exam Type',
      success: 'Exam Type successfully created',
    },

    view: {
      title: 'View Exam Type',
    },

    edit: {
      menu: 'Edit Exam Type',
      title: 'Edit Exam Type',
      success: 'Exam Type successfully updated',
    },

    restore: {
      success: 'Exam Type successfully restored',
      confirmTitle: 'Restore Exam Type?',
    },

    restoreMany: {
      success: 'Exam Type(s) successfully restored',
      noSelection: 'You must select at least one exam type to restore.',
      confirmTitle: 'Restore Exam Type(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected exam type(s)?',
    },

    archiveMany: {
      success: 'Exam Type(s) successfully archived',
      noSelection: 'You must select at least one exam type to archive.',
      confirmTitle: 'Archive Exam Type(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected exam type(s)?',
    },

    archive: {
      success: 'Exam Type successfully archived',
      confirmTitle: 'Archive Exam Type?',
    },

    deleteMany: {
      success: 'Exam Type(s) successfully deleted',
      noSelection: 'You must select at least one exam type to delete.',
      confirmTitle: 'Delete Exam Type(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected exam type(s)?',
    },

    delete: {
      success: 'Exam Type successfully deleted',
      confirmTitle: 'Delete Exam Type?',
    },

    fields: {
      name: 'Name',
      description: 'Description',
      type: 'Type',
      questionCount: 'Question Count',
      timeLimitMinutes: 'Time Limit (Minutes)',
      passingScore: 'Passing Score',
      maxAttempts: 'Max Attempts',
      shuffleQuestions: 'Shuffle Questions',
      showAnswersImmediately: 'Show Answers Immediately',
      isActive: 'Active',
      course: 'Course',
      exam: 'Exam',
      examInstances: 'Exam Attempts',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      name: 'e.g., Full Mock, Quick Quiz, Domain Drill',
      description: '',
      type: '',
      questionCount: '',
      timeLimitMinutes: '',
      passingScore: 'Percentage required to pass',
      maxAttempts: '',
      shuffleQuestions: '',
      showAnswersImmediately: '',
      isActive: '',
      exam: '',
      examInstances: '',
    },
    enumerators: {
      type: {
        mock: 'Mock',
        quiz: 'Quiz',
        drill: 'Drill',
        diagnostic: 'Diagnostic',
        final: 'Final',
      },
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of exam types with advanced filtering options. Supports filtering by various fields and related entities. Returns exam type details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific exam type by their unique ID. Returns complete exam type profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new exam type record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing exam type record with new information. Allows modification of all exam type fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more exam types from the system. This action is irreversible. Accepts an array of exam type IDs and removes all associated data.',
      archive:
        'Archive one or more exam types to hide them from default views while preserving their data. Archived exam types can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived exam types back to active status. Makes the exam types visible in default views again.',
      autocomplete:
        'Search and retrieve exam type suggestions for autocomplete inputs. Returns a simplified list of exam types matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  examInstance: {
    dashboardCard: {
      title: 'Exam Attempts',
    },

    list: {
      menu: 'Exam Attempts',
      title: 'Exam Attempts',
      noResults: 'No exam attempts found.',
      empty:
        "You haven't created any exam attempts yet. Get started by creating your first exam attempt.",
    },

    importer: {
      title: 'Import Exam Attempts',
      menu: 'Import Exam Attempts',
    },

    export: {
      success: 'Exam Attempts successfully exported',
    },

    new: {
      menu: 'New Exam Attempt',
      title: 'New Exam Attempt',
      success: 'Exam Attempt successfully created',
    },

    view: {
      title: 'View Exam Attempt',
    },

    edit: {
      menu: 'Edit Exam Attempt',
      title: 'Edit Exam Attempt',
      success: 'Exam Attempt successfully updated',
    },

    restore: {
      success: 'Exam Attempt successfully restored',
      confirmTitle: 'Restore Exam Attempt?',
    },

    restoreMany: {
      success: 'Exam Attempt(s) successfully restored',
      noSelection: 'You must select at least one exam attempt to restore.',
      confirmTitle: 'Restore Exam Attempt(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected exam attempt(s)?',
    },

    archiveMany: {
      success: 'Exam Attempt(s) successfully archived',
      noSelection: 'You must select at least one exam attempt to archive.',
      confirmTitle: 'Archive Exam Attempt(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected exam attempt(s)?',
    },

    archive: {
      success: 'Exam Attempt successfully archived',
      confirmTitle: 'Archive Exam Attempt?',
    },

    deleteMany: {
      success: 'Exam Attempt(s) successfully deleted',
      noSelection: 'You must select at least one exam attempt to delete.',
      confirmTitle: 'Delete Exam Attempt(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected exam attempt(s)?',
    },

    delete: {
      success: 'Exam Attempt successfully deleted',
      confirmTitle: 'Delete Exam Attempt?',
    },

    fields: {
      status: 'Status',
      score: 'Score',
      passed: 'Passed',
      startedAt: 'Started At',
      completedAt: 'Completed At',
      timeSpentSeconds: 'Time Spent (Seconds)',
      course: 'Course',
      examType: 'Exam Type',
      student: 'Member (User)',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      status: '',
      score: '',
      passed: '',
      startedAt: '',
      completedAt: '',
      timeSpentSeconds: '',
      examType: '',
      student: '',
    },
    enumerators: {
      status: {
        started: 'Started',
        in_progress: 'In Progress',
        completed: 'Completed',
        abandoned: 'Abandoned',
        expired: 'Expired',
      },
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of exam attempts with advanced filtering options. Supports filtering by various fields and related entities. Returns exam attempt details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific exam attempt by their unique ID. Returns complete exam attempt profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new exam attempt record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing exam attempt record with new information. Allows modification of all exam attempt fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more exam attempts from the system. This action is irreversible. Accepts an array of exam attempt IDs and removes all associated data.',
      archive:
        'Archive one or more exam attempts to hide them from default views while preserving their data. Archived exam attempts can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived exam attempts back to active status. Makes the exam attempts visible in default views again.',
      autocomplete:
        'Search and retrieve exam attempt suggestions for autocomplete inputs. Returns a simplified list of exam attempts matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  dailyGoal: {
    dashboardCard: {
      title: 'Daily Goals',
    },

    list: {
      menu: 'Daily Goals',
      title: 'Daily Goals',
      noResults: 'No daily goals found.',
      empty:
        "You haven't created any daily goals yet. Get started by creating your first daily goal.",
    },

    importer: {
      title: 'Import Daily Goals',
      menu: 'Import Daily Goals',
    },

    export: {
      success: 'Daily Goals successfully exported',
    },

    new: {
      menu: 'New Daily Goal',
      title: 'New Daily Goal',
      success: 'Daily Goal successfully created',
    },

    view: {
      title: 'View Daily Goal',
    },

    edit: {
      menu: 'Edit Daily Goal',
      title: 'Edit Daily Goal',
      success: 'Daily Goal successfully updated',
    },

    restore: {
      success: 'Daily Goal successfully restored',
      confirmTitle: 'Restore Daily Goal?',
    },

    restoreMany: {
      success: 'Daily Goal(s) successfully restored',
      noSelection: 'You must select at least one daily goal to restore.',
      confirmTitle: 'Restore Daily Goal(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected daily goal(s)?',
    },

    archiveMany: {
      success: 'Daily Goal(s) successfully archived',
      noSelection: 'You must select at least one daily goal to archive.',
      confirmTitle: 'Archive Daily Goal(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected daily goal(s)?',
    },

    archive: {
      success: 'Daily Goal successfully archived',
      confirmTitle: 'Archive Daily Goal?',
    },

    deleteMany: {
      success: 'Daily Goal(s) successfully deleted',
      noSelection: 'You must select at least one daily goal to delete.',
      confirmTitle: 'Delete Daily Goal(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected daily goal(s)?',
    },

    delete: {
      success: 'Daily Goal successfully deleted',
      confirmTitle: 'Delete Daily Goal?',
    },

    fields: {
      title: 'Title',
      goalType: 'Goal Type',
      targetValue: 'Target Value',
      currentValue: 'Current Value',
      xpReward: 'XP Reward',
      goalDate: 'Goal Date',
      completedAt: 'Completed At',
      owner: 'Member (User)',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      title: '',
      goalType: '',
      targetValue: '',
      currentValue: '',
      xpReward: '',
      goalDate: '',
      completedAt: '',
      owner: '',
    },
    enumerators: {
      goalType: {
        questions_answered: 'Questions Answered',
        study_minutes: 'Study Minutes',
        lessons_completed: 'Lessons Completed',
        chapters_mastered: 'Chapters Mastered',
        streak_day: 'Streak Day',
      },
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of daily goals with advanced filtering options. Supports filtering by various fields and related entities. Returns daily goal details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific daily goal by their unique ID. Returns complete daily goal profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new daily goal record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing daily goal record with new information. Allows modification of all daily goal fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more daily goals from the system. This action is irreversible. Accepts an array of daily goal IDs and removes all associated data.',
      archive:
        'Archive one or more daily goals to hide them from default views while preserving their data. Archived daily goals can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived daily goals back to active status. Makes the daily goals visible in default views again.',
      autocomplete:
        'Search and retrieve daily goal suggestions for autocomplete inputs. Returns a simplified list of daily goals matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  studyNote: {
    dashboardCard: {
      title: 'Study Notes',
    },

    list: {
      menu: 'Study Notes',
      title: 'Study Notes',
      noResults: 'No study notes found.',
      empty:
        "You haven't created any study notes yet. Get started by creating your first study note.",
    },

    importer: {
      title: 'Import Study Notes',
      menu: 'Import Study Notes',
    },

    export: {
      success: 'Study Notes successfully exported',
    },

    new: {
      menu: 'New Study Note',
      title: 'New Study Note',
      success: 'Study Note successfully created',
    },

    view: {
      title: 'View Study Note',
    },

    edit: {
      menu: 'Edit Study Note',
      title: 'Edit Study Note',
      success: 'Study Note successfully updated',
    },

    restore: {
      success: 'Study Note successfully restored',
      confirmTitle: 'Restore Study Note?',
    },

    restoreMany: {
      success: 'Study Note(s) successfully restored',
      noSelection: 'You must select at least one study note to restore.',
      confirmTitle: 'Restore Study Note(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected study note(s)?',
    },

    archiveMany: {
      success: 'Study Note(s) successfully archived',
      noSelection: 'You must select at least one study note to archive.',
      confirmTitle: 'Archive Study Note(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected study note(s)?',
    },

    archive: {
      success: 'Study Note successfully archived',
      confirmTitle: 'Archive Study Note?',
    },

    deleteMany: {
      success: 'Study Note(s) successfully deleted',
      noSelection: 'You must select at least one study note to delete.',
      confirmTitle: 'Delete Study Note(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected study note(s)?',
    },

    delete: {
      success: 'Study Note successfully deleted',
      confirmTitle: 'Delete Study Note?',
    },

    fields: {
      title: 'Title',
      content: 'Content',
      isFavorite: 'Favorite',
      tags: 'Tags',
      course: 'Course',
      chapter: 'Chapter',
      lesson: 'Lesson',
      author: 'Member (User)',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      title: '',
      content: 'Note body (Markdown supported)',
      isFavorite: '',
      tags: '',
      course: '',
      chapter: '',
      lesson: '',
      author: '',
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of study notes with advanced filtering options. Supports filtering by various fields and related entities. Returns study note details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific study note by their unique ID. Returns complete study note profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new study note record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing study note record with new information. Allows modification of all study note fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more study notes from the system. This action is irreversible. Accepts an array of study note IDs and removes all associated data.',
      archive:
        'Archive one or more study notes to hide them from default views while preserving their data. Archived study notes can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived study notes back to active status. Makes the study notes visible in default views again.',
      autocomplete:
        'Search and retrieve study note suggestions for autocomplete inputs. Returns a simplified list of study notes matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },
  documentUpload: {
    dashboardCard: {
      title: 'Document Uploads',
    },

    list: {
      menu: 'Document Uploads',
      title: 'Document Uploads',
      noResults: 'No document uploads found.',
      empty:
        "You haven't created any document uploads yet. Get started by creating your first document upload.",
    },

    importer: {
      title: 'Import Document Uploads',
      menu: 'Import Document Uploads',
    },

    export: {
      success: 'Document Uploads successfully exported',
    },

    new: {
      menu: 'New Document Upload',
      title: 'New Document Upload',
      success: 'Document Upload successfully created',
    },

    view: {
      title: 'View Document Upload',
    },

    edit: {
      menu: 'Edit Document Upload',
      title: 'Edit Document Upload',
      success: 'Document Upload successfully updated',
    },

    restore: {
      success: 'Document Upload successfully restored',
      confirmTitle: 'Restore Document Upload?',
    },

    restoreMany: {
      success: 'Document Upload(s) successfully restored',
      noSelection: 'You must select at least one document upload to restore.',
      confirmTitle: 'Restore Document Upload(s)?',
      confirmDescription:
        'Are you sure you want to restore the {0} selected document upload(s)?',
    },

    archiveMany: {
      success: 'Document Upload(s) successfully archived',
      noSelection: 'You must select at least one document upload to archive.',
      confirmTitle: 'Archive Document Upload(s)?',
      confirmDescription:
        'Are you sure you want to archive the {0} selected document upload(s)?',
    },

    archive: {
      success: 'Document Upload successfully archived',
      confirmTitle: 'Archive Document Upload?',
    },

    deleteMany: {
      success: 'Document Upload(s) successfully deleted',
      noSelection: 'You must select at least one document upload to delete.',
      confirmTitle: 'Delete Document Upload(s)?',
      confirmDescription:
        'Are you sure you want to delete the {0} selected document upload(s)?',
    },

    delete: {
      success: 'Document Upload successfully deleted',
      confirmTitle: 'Delete Document Upload?',
    },

    fields: {
      originalFilename: 'Original Filename',
      status: 'Status',
      pageCount: 'Page Count',
      wordCount: 'Word Count',
      processingError: 'Processing Error',
      sourceFiles: 'Source Files',
      course: 'Course',
      exam: 'Exam',
      uploadedBy: 'Member (User)',
      createdByMember: 'Created By',
      updatedByMember: 'Updated By',
      archivedByMember: 'Archived By',
      createdAt: 'Created at',
      updatedAt: 'Updated at',
      archivedAt: 'Archived at',
    },

    hints: {
      originalFilename: '',
      status: '',
      pageCount: '',
      wordCount: '',
      processingError: '',
      sourceFiles: 'Upload curriculum source documents (max 50MB each)',
      exam: '',
      uploadedBy: '',
    },
    enumerators: {
      status: {
        uploaded: 'Uploaded',
        processing: 'Processing',
        processed: 'Processed',
        failed: 'Failed',
      },
    },

    mcpDescription: {
      list: 'Retrieve a paginated list of document uploads with advanced filtering options. Supports filtering by various fields and related entities. Returns document upload details including all relationships and metadata.',
      get: 'Retrieve detailed information about a specific document upload by their unique ID. Returns complete document upload profile including all relationships, attachments, and audit metadata.',
      create:
        'Create a new document upload record with comprehensive details. Supports all defined fields including relationships, file attachments, and custom properties.',
      update:
        'Update an existing document upload record with new information. Allows modification of all document upload fields including relationships and attachments. Automatically tracks the update in audit logs.',
      delete:
        'Permanently delete one or more document uploads from the system. This action is irreversible. Accepts an array of document upload IDs and removes all associated data.',
      archive:
        'Archive one or more document uploads to hide them from default views while preserving their data. Archived document uploads can be restored later. Useful for inactive or historical records.',
      restore:
        'Restore previously archived document uploads back to active status. Makes the document uploads visible in default views again.',
      autocomplete:
        'Search and retrieve document upload suggestions for autocomplete inputs. Returns a simplified list of document uploads matching the search query, optimized for selection dropdowns and autocomplete fields.',
    },
  },

  auditLog: {
    list: {
      menu: 'Audit Logs',
      title: 'Audit Logs',
      noResults: 'No audit logs found.',
    },

    changesDialog: {
      title: 'Audit Log',
      changes: 'Changes',
      noChanges: 'There are no changes in this log.',
      showChangesOnly: 'Show Changes Only',
      showFullObject: 'Show Full Object',
    },

    export: {
      success: 'Audit Logs successfully exported',
    },

    fields: {
      timestamp: 'Date',
      entityName: 'Entity',
      entityNames: 'Entities',
      entityId: 'Entity ID',
      operation: 'Operation',
      operations: 'Operations',
      member: 'User',
      apiKey: 'API Key',
      apiEndpoint: 'API Endpoint',
      apiHttpResponseCode: 'API Status',
    },

    enumerators: {
      operation: {
        SI: 'Sign In',
        SO: 'Sign Out',
        SU: 'Sign Up',
        PRR: 'Password Reset Request',
        PRC: 'Password Reset Confirm',
        PC: 'Password Change',
        VER: 'Verify Email Request',
        VEC: 'Verify Email Confirm',
        C: 'Create',
        U: 'Update',
        D: 'Delete',
        AG: 'API Get',
        APO: 'API Post',
        APU: 'API Put',
        AD: 'API Delete',
      },
    },

    dashboardCard: {
      activityChart: 'Activity',
      activityList: 'Recent Activity',
    },

    readableOperations: {
      SI: '{0} signed in',
      SIF: 'Failed sign-in attempt for {0}',
      SU: '{0} registered',
      PRR: '{0} requested to reset the password',
      PRC: '{0} confirmed password reset',
      PC: '{0} changed the password',
      VER: '{0} requested to verify the email',
      VEC: '{0} verified the email',
      ECR: '{0} requested to change email',
      ECC: '{0} confirmed email change',
      C: '{0} created {1} {2}',
      U: '{0} updated {1} {2}',
      D: '{0} deleted {1} {2}',
      selfSignUp: '{0} signed up',
      selfUpdate: '{0} updated their profile',
      AG: 'API Key GET request',
      APO: 'API Key POST request',
      APU: 'API Key PUT request',
      AD: 'API Key DELETE request',
    },

    mcpDescription: {
      list: 'Query the audit trail to retrieve logs of all actions performed in the organization. Supports filtering by entity type, entity ID, operation type, and timestamp range. Returns detailed records including who performed the action, when, and what changed. Essential for compliance and security monitoring.',
      activityChart:
        'Get aggregated activity statistics over a time period. Returns a time-series chart of user activities and operations, useful for visualizing system usage patterns and identifying peak activity periods.',
    },
  },

  apiDocs: {
    title: 'API Documentation',
    menu: 'API Documentation',
    featuresApi: 'Features API',
    authApi: 'Auth API',
    openapi: {
      title: 'API',
      serverDescription: 'API Server',
      securitySchemes: {
        apiKeyAuth: {
          description: 'API Key authentication using x-api-key header',
        },
        bearerAuth: {
          description:
            'API Key authentication using Authorization Bearer token',
        },
      },
    },
  },

  mcp: {
    title: 'MCP Integration',
    menu: 'MCP Integration',
    subtitle: 'Connect external AI assistants using the Model Context Protocol',
    info: 'Use the endpoint below to connect external AI assistants like ChatGPT or Claude Desktop to your organization data.',
    endpoint: {
      title: 'Your MCP Endpoint',
      description: 'Use this endpoint to configure MCP clients',
      endpointLabel: 'MCP Endpoint URL',
      organizationLabel: 'Organization ID',
      languageLabel: 'Language',
    },
    usage: {
      title: 'How to Use',
      description:
        'Follow these steps to integrate with external AI assistants:',
      step1: 'Copy the endpoint URL from above',
      step2:
        'Configure your AI assistant (ChatGPT, Claude Desktop, etc.) with this MCP endpoint',
      step3: 'Authenticate using OAuth when prompted',
      step4: 'Start using your organization data through AI chat',
    },
  },

  user: {
    mcpDescription: {
      me: 'Retrieve the current authenticated user profile and all their organization memberships. Returns user details, all organizations they belong to, their roles in each organization, and any active subscriptions.',
    },
  },

  course: {
    list: {
      menu: 'Courses',
      title: 'Course Catalog',
      noResults: 'No courses found.',
      empty: 'Published courses will appear here when they are ready.',
      sortLabel: 'Sort',
      sortTrending: 'Trending',
      sortTopRated: 'Top rated',
      sortNewest: 'Newest',
      sortMostPopular: 'Most popular',
      sortPriceAsc: 'Price (low to high)',
      sortPriceDesc: 'Price (high to low)',
      sortDurationAsc: 'Shortest first',
      filterPriceLabel: 'Price',
      filterPriceAny: 'Any',
      filterPriceFree: 'Free',
      filterPricePaid: 'Paid',
      filterRatingLabel: 'Rating',
      filterRatingAny: 'Any',
      filterRating4: '4.0+',
      filterRating45: '4.5+',
      verifiedOnly: 'Verified only',
      featured: 'Featured',
      page: 'Page',
    },
    marketplace: {
      savedDefaultName: 'Saved courses',
      duration: 'Duration',
      noDuration: 'No duration set',
      durationHours: '{0} hr',
      durationBuckets: {
        short: 'Under 2 hours',
        medium: '2-8 hours',
        long: '8+ hours',
      },
      learners: 'learners',
      creator: 'Creator',
      creatorProfile: 'Creator profile',
      viewCreator: 'View creator profile',
      couponCode: 'Coupon code',
      couponPlaceholder: 'Enter a coupon code',
      unsave: 'Remove saved course',
      compare: 'Compare',
      compareLimit: 'You can compare up to 4 courses.',
      compareSelected: '{0} selected',
      compareHint: 'Compare price, outcomes, proof, and course structure.',
      noCompareCourses: 'Select courses from the catalog to compare.',
      bundles: 'Course bundles',
      bundle: 'Bundle',
      coursesIncluded: 'courses included',
      creatorStats: '{0} courses · {1} learners',
      creatorCourses: 'Published courses',
    },
    certificate: {
      title: 'Certificate of Completion',
      view: 'View certificate',
      print: 'Print certificate',
      verified: 'Verified completion',
      awardedTo: 'Awarded to',
      learner: 'Learner',
      completedCourse: 'for completing',
      issuedAt: 'Issued',
      number: 'Certificate number',
      verificationCode: 'Verification code',
      verifyHint: 'Verify this certificate with code {0}.',
    },
    detail: {
      title: 'Course Detail',
      enrolled: 'Enrolled',
      notEnrolled: 'Not enrolled',
    },
    learn: {
      title: 'Course Player',
      modules: 'Modules',
      courseOutline: 'Course outline',
      currentModule: 'Module: {0}',
      progressComplete: '{0}% complete',
      lessonKindVideo: 'Video',
      lessonKindArticle: 'Article',
      lessonKindQuiz: 'Quiz',
      durationMinutes: '{0} min',
      durationQuestions: '{0} questions',
      readingTime: '{0} min read',
      videoUnavailable: 'No video has been uploaded for this lesson.',
      noLessonContent: 'No lesson content has been added yet.',
      articleHint:
        'Ask the AI tutor to explain, summarize, or generate practice questions.',
      completeLesson: 'Mark complete',
      completedLesson: 'Completed',
      saveNote: 'Save note',
      downloadResources: 'Download resources',
      openMiniPlayer: 'Open mini player',
      closeMiniPlayer: 'Close mini player',
      playing: 'Playing',
      assignments: 'Homework',
      submitAssignment: 'Submit homework',
      resubmitAssignment: 'Resubmit homework',
      pendingReview: 'Submitted and waiting for review.',
      homeworkComplete: 'This homework is complete.',
      resubmissionClosed: 'Resubmissions are closed for this homework.',
      maxAttemptsReached: 'Maximum attempts reached.',
      tutor: 'Course AI Tutor',
      tutorPrompt: 'Ask about this course or lesson...',
      resources: 'Downloadable files',
      quizzes: 'Quizzes',
      takeQuiz: 'Take quiz',
    },
    mobile: {
      savedOffline: 'Saved offline. It will sync when you are back online.',
      outline: 'Course outline',
      nextLesson: 'Next lesson',
      offlineStatus: {
        online: 'Online',
        offline: 'Offline mode: lesson work is saved on this device.',
        syncing: 'Syncing saved lesson work...',
        synced: 'Lesson work synced.',
        failed: 'Some lesson work needs another sync attempt.',
      },
    },
    admin: {
      menu: 'Course Builder',
      title: 'Course Builder',
      description: 'Create, publish, and manage platform-wide courses.',
      content: 'Course content',
      enrollments: 'Enrollments',
      reviewSubmission: 'Review submission',
      newCourse: 'New course',
      linkedContent: 'Linked course content',
    },
    fields: {
      title: 'Title',
      slug: 'Slug',
      subtitle: 'Subtitle',
      description: 'Description',
      category: 'Category',
      categoryId: 'Category',
      examType: 'Exam type',
      difficulty: 'Difficulty',
      language: 'Language',
      thumbnail: 'Thumbnail',
      introVideoFiles: 'Intro video',
      status: 'Status',
      accessType: 'Access',
      price: 'Price',
      priceCents: 'Price (cents)',
      currency: 'Currency',
      stripePriceId: 'Stripe price ID',
      subscriptionPlanKey: 'Subscription plan key',
      creatorRevenueShareBps: 'Creator revenue share (bps)',
      platformRevenueShare: 'Platform revenue share (bps)',
      nexVerified: 'Nex Verified',
      creatorUserId: 'Creator user ID',
      creatorMemberId: 'Creator member ID',
      creatorOrganizationId: 'Creator organization ID',
      modules: 'Modules',
      lessons: 'Lessons',
      assignments: 'Assignments',
      lessonContent: 'Lesson text',
      videoFiles: 'Video files',
      prompt: 'Prompt',
      dueDate: 'Due date',
      dueDaysAfterEnroll: 'Due days after enrollment',
      rubric: 'Rubric',
      rubricDescription: 'Criterion guidance',
      allowResubmissions: 'Allow resubmissions',
      maxAttempts: 'Max attempts',
      attempt: 'Attempt',
      attempts: 'Attempts',
      score: 'Score',
      studentEmail: 'Student email',
      submissionText: 'Submission',
      submissionFiles: 'Files',
      feedback: 'Feedback',
      videoUrl: 'Video link',
      resourceFiles: 'Downloadable files',
      quizzes: 'Quizzes',
      passingScore: 'Passing score (%)',
      points: 'Points',
      questionPrompt: 'Question',
      explanation: 'Explanation',
      examDomain: 'Exam domain',
    },
    actions: {
      enroll: 'Enroll',
      continue: 'Continue learning',
      openCourse: 'Open course',
      saveCourse: 'Save course',
      publish: 'Publish',
      addModule: 'Add module',
      addLesson: 'Add lesson',
      addAssignment: 'Add assignment',
      moveUp: 'Move up',
      moveDown: 'Move down',
      manualEnroll: 'Enroll student',
      markComplete: 'Mark complete',
      needsRevision: 'Needs revision',
      askTutor: 'Ask tutor',
      buyCourse: 'Buy course',
      buyCourseWithPrice: 'Buy course — {0}',
      viewCourse: 'View course',
    },
    success: {
      enrolled: 'Enrollment created.',
      lessonCompleted: 'Lesson marked complete.',
      assignmentSubmitted: 'Homework submitted.',
      courseSaved: 'Course saved.',
      courseUnsaved: 'Course removed from saved courses.',
      studentEnrolled: 'Student enrolled.',
      submissionReviewed: 'Submission reviewed.',
      quizSubmitted: 'Quiz submitted.',
      ratingSaved: 'Course rating saved.',
      purchased: 'Purchase complete — you are now enrolled.',
    },
    notify: {
      coursePurchaseConfirmedTitle: 'Course purchase confirmed',
      coursePurchaseConfirmedBody:
        'You are now enrolled in {0}. Start learning anytime.',
      courseRefundedTitle: 'Course refunded',
      courseRefundedBody:
        'Your purchase of {0} has been refunded. Access has been removed.',
    },
    errors: {
      manualEnrollmentOnly:
        'This course requires manual, paid, or subscription access before enrollment.',
      invalidCourseLink:
        'This course cannot be linked from the current organization.',
      submissionRequired: 'Add text or files before submitting homework.',
      submissionPendingReview:
        'This homework is already submitted and waiting for review.',
      submissionComplete: 'This homework has already been completed.',
      resubmissionNotAllowed:
        'Resubmissions are not allowed for this homework.',
      maxAttemptsReached:
        'You have reached the maximum number of attempts for this homework.',
      invalidRubricScore:
        'Rubric scores must match the assignment criteria and point limits.',
      invalidSubmissionReviewStatus:
        'Choose complete or needs revision when reviewing homework.',
      ratingRequiresEnrollment: 'Enroll in this course before rating it.',
      reviewNotPending: 'This course is not awaiting review.',
      editLockedNotDraft:
        'Return the course to draft before editing its content.',
      submitNotDraft: 'Only a draft course can be submitted for review.',
      submitNeedsContent:
        'Complete the publishing checklist (title, description, thumbnail, a module, 3+ lessons, an assessment, and a learning outcome) before submitting.',
      cannotWithdraw: 'Only a course in review or published can be withdrawn.',
      examAlreadySubmitted: 'This practice exam attempt was already submitted.',
      categoryInUse:
        'This category cannot be removed while courses are still assigned to it.',
      coursePaymentNotConfigured:
        'This course is not ready for purchase yet. Please try again later.',
      alreadyEnrolled: 'You are already enrolled in this course.',
      invalidCoupon: 'This coupon cannot be applied to this course.',
      couponLimitReached: 'This coupon has already been used.',
    },
    enumerators: {
      status: {
        draft: 'Draft',
        inReview: 'In review',
        published: 'Published',
        archived: 'Archived',
      },
      accessType: {
        free: 'Free',
        manual: 'Manual enrollment',
        paid: 'Paid',
        subscription: 'Subscription',
      },
      submissionStatus: {
        submitted: 'Submitted',
        complete: 'Complete',
        needsRevision: 'Needs revision',
      },
    },
    ratings: {
      title: 'Course rating',
      summary: '{0} ({1})',
      noRatings: 'No ratings yet',
      commentPlaceholder: 'Share what helped or what could improve...',
      save: 'Save rating',
      starLabel: '{0} star rating',
    },
    ai: {
      outline: 'Course outline and study content:',
      focusedLesson: 'Current lesson',
      completed: 'completed',
      assignment: 'Assignment',
      linkedContent: 'Linked exam, practice, and study resources:',
    },
    studyAi: {
      actions: {
        sectionTitle: 'AI study tools',
        explainLesson: 'Explain this lesson',
        summarizeLesson: 'Summarize this lesson',
        quizMe: 'Quiz me on this module',
        generatePractice: 'Practice questions',
      },
      result: {
        explainTitle: 'Lesson explained',
        summarizeTitle: 'Lesson summary',
        generating: 'Thinking…',
        streamError: 'Something went wrong while generating. Please try again.',
        retry: 'Try again',
      },
      quiz: {
        quizTitle: 'Quick quiz',
        practiceTitle: 'Practice questions',
        generating: 'Building your questions…',
        intro: 'Answer each question, then check your results.',
        start: 'Start',
        submit: 'Check answers',
        next: 'Next',
        previous: 'Back',
        retake: 'New set',
        questionProgress: 'Question {0} of {1}',
        yourScore: 'You scored {0}%',
        correctCount: '{0} of {1} correct',
        passed: 'Great work!',
        failed: 'Keep practicing — review the topics below.',
        domainBreakdown: 'By topic',
        correct: 'Correct',
        incorrect: 'Incorrect',
        noQuestions:
          'No questions could be generated. Try a module with more lesson content.',
        aiDisclaimer: 'AI-generated practice — not graded toward the course.',
      },
      coach: {
        title: 'Study coach',
        weakAreasTab: 'Weak areas',
        whatNextTab: 'What next',
        studyPlanTab: 'Study plan',
      },
      weakness: {
        heading: 'Where you are losing marks',
        empty:
          'Take a quiz or practice exam and your weak topics will show here.',
        weakest: 'Weakest topic',
        scoreLabel: '{0}% ({1}/{2})',
      },
      whatNext: {
        heading: 'What should I study next?',
        generate: 'Get a recommendation',
        regenerate: 'Refresh recommendation',
        generating: 'Thinking it through…',
        empty:
          'Get an AI recommendation based on your progress and weak areas.',
      },
      studyPlan: {
        heading: 'Study plan',
        empty: 'No study plan yet. Generate one or add your own tasks.',
        generate: 'Generate study plan',
        regenerate: 'Regenerate plan',
        generating: 'Building your plan…',
        addItem: 'Add task',
        addPlaceholder: 'New study task',
        markDone: 'Mark done',
        markTodo: 'Mark not done',
        deleteItem: 'Delete',
        aiBadge: 'AI',
        noDate: 'No date',
        remaining: '{0} of {1} done',
      },
      examDate: {
        title: 'Target exam date',
        set: 'Set exam date',
        edit: 'Edit',
        dateLabel: 'Exam date',
        nameLabel: 'Exam name (optional)',
        namePlaceholder: 'e.g. SIE exam',
        save: 'Save',
        none: 'No exam date set.',
        daysRemaining: '{0} days until your exam',
        examToday: 'Your exam is today — good luck!',
        examPast: 'Your exam date has passed.',
      },
      errors: {
        busy: 'Another AI study request is still running. Please wait for it to finish.',
        limitReached:
          'The daily AI usage limit has been reached. It resets tomorrow.',
        notConfigured: 'AI study features are not available right now.',
        parseFailed: 'AI returned an unreadable response. Please try again.',
        unexpectedQuizFormat:
          'AI returned questions that could not be used. Try a module with more lesson content.',
        moduleNoContentQuiz: 'This module has no lesson content to quiz yet.',
        moduleNoContentPractice:
          'This module has no lesson content for practice questions yet.',
        enrollToSetExamDate:
          'Enroll in the course before setting an exam date.',
        unexpectedResponse:
          'AI returned an unexpected recommendation. Please try again.',
        unexpectedStudyPlan:
          'AI returned an unexpected study plan. Please try again.',
        courseScopedRequired:
          'This study tool can only be used from an active course.',
        lessonRequired: 'Select a lesson before using this study tool.',
        moduleRequired: 'Select a module before using this study tool.',
        signInStudyPlan: 'Sign in to build a study plan.',
        unknownStudyTool: 'Unknown study tool: {0}',
        generic: 'Something went wrong. Please try again.',
      },
    },
    builder: {
      menu: 'My Courses',
      title: 'Course Builder',
      description: 'Build, preview, and publish your own courses.',
      newCourse: 'New course',
      emptyCourses: 'You have not created any courses yet.',
      createFirst: 'Create your first course',
      continueBuilding: 'Continue building',
      updatedAt: 'Updated {0}',
      completionLabel: '{0}% ready',
      nextRecommended: 'Next: {0}',
      verifyRequired:
        'Finish creator verification to build and publish courses.',
      verifyCta: 'Go to creator verification',
      loadError: 'This course could not be loaded.',
      backToCourses: 'Back to my courses',
      details: 'Course details',
      detailsBody: 'The title, summary, and cover media students see first.',
      curriculum: 'Curriculum',
      curriculumBody:
        'Add modules, then drag lessons, quizzes, and homework into order.',
      moduleLabel: 'Module',
      lessonLabel: 'Lesson',
      quizLabel: 'Quiz',
      assignmentLabel: 'Homework',
      questionLabel: 'Question',
      optionLabel: 'Option',
      untitledModule: 'Untitled module',
      untitledLesson: 'Untitled lesson',
      untitledQuiz: 'Untitled quiz',
      untitledAssignment: 'Untitled homework',
      noModules: 'No modules yet. Add your first module to get started.',
      noItems: 'No lessons, quizzes, or homework in this module yet.',
      noQuestions: 'No questions yet. Add your first question.',
      rubricCriterionLabel: 'Rubric criterion',
      noRubricCriteria: 'No rubric criteria yet.',
      submissionsTitle: 'Homework review',
      submissionsBody:
        'Review student submissions, score rubric criteria, and send feedback.',
      dragHint: 'Drag to reorder',
      videoUpload: 'Upload video',
      videoEmbedHint:
        'Or paste a YouTube or Vimeo link to embed instead of uploading.',
      resourcesHint:
        'Attach worksheets, slides, or other files students can download.',
      contentHint: 'Lesson text supports Markdown formatting.',
      isPreviewLesson: 'Free preview lesson',
      correctOption: 'Correct answer',
      previewBanner:
        'Student preview — this is how learners experience your course.',
      backToBuilder: 'Back to builder',
      statusDraft: 'Draft — only you can see this course.',
      statusInReview: 'In review — an admin is reviewing this course.',
      statusPublished: 'Published — students can enroll in this course.',
      statusArchived: 'Archived.',
      reviewNotesTitle: 'Changes requested by the reviewer',
      submitConfirm: 'Submit this course for admin review?',
      withdrawConfirm:
        'Withdraw this course from review and return it to draft?',
      unpublishConfirm:
        'Unpublishing returns the course to draft and removes access for students already enrolled. Continue?',
      unsavedChanges: 'You have unsaved changes.',
      saveFirst: 'Save your changes before continuing.',
      actions: {
        save: 'Save draft',
        submitForReview: 'Submit for review',
        withdraw: 'Withdraw from review',
        unpublish: 'Unpublish',
        preview: 'Preview as student',
        edit: 'Edit course',
        addModule: 'Add module',
        addLesson: 'Add lesson',
        addQuiz: 'Add quiz',
        addAssignment: 'Add homework',
        addRubricCriterion: 'Add rubric criterion',
        saveFeedback: 'Save feedback',
        addQuestion: 'Add question',
        addOption: 'Add option',
        remove: 'Remove',
        addPracticeExam: 'Add practice exam',
        addExamRule: 'Add domain rule',
        addOutcome: 'Add outcome',
        addRequirement: 'Add requirement',
        addFlashcardSet: 'Add flashcard set',
        addFlashcard: 'Add card',
        applyMiniTemplate: 'Apply mini-course template',
        create: 'Create course',
      },
      quizSettings: {
        timeLimit: 'Time limit (min)',
        maxAttempts: 'Max attempts',
        randomizeQuestions: 'Shuffle questions',
        randomizeAnswers: 'Shuffle answers',
        showExplanations: 'Show explanations',
        allowRetries: 'Allow retries',
      },
      examSettings: {
        totalQuestions: 'Total questions',
        questionCount: 'Question count',
        simulateRealExam: 'Simulate real exam',
      },
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
      practiceExams: 'Practice exams',
      practiceExamsBody:
        'Build domain-weighted, timed practice exams from your question bank.',
      noPracticeExams: 'No practice exams yet.',
      practiceExamLabel: 'Practice exam',
      examRules: 'Domain rules',
      examRulesHint:
        'Add a rule per exam domain to weight how questions are drawn.',
      anyDifficulty: 'Any difficulty',
      questionType: {
        multipleChoice: 'Multiple choice',
        trueFalse: 'True / false',
        multiSelect: 'Select all that apply',
      },
      setup: {
        difficulty: 'Difficulty',
        language: 'Language',
        certificateEnabled: 'Issue a completion certificate',
        visibility: 'Visibility',
        audience: 'Intended audience',
        audienceHint: 'One audience description per line.',
        promoVideo: 'Promo video',
        outcomes: 'Learning outcomes',
        outcomesBody:
          'What students will be able to do after taking the course.',
        requirements: 'Requirements',
        requirementsBody: 'What students should know or have before starting.',
        outcomePlaceholder: 'Learning outcome',
        requirementPlaceholder: 'Requirement',
      },
      visibility: {
        private: 'Private',
        unlisted: 'Unlisted',
        public: 'Public',
      },
      flashcards: 'Flashcards',
      flashcardsBody: 'Build flashcard sets students can study.',
      noFlashcardSets: 'No flashcard sets yet.',
      flashcardSetLabel: 'Flashcard set',
      flashcardFront: 'Front',
      flashcardBack: 'Back',
      flashcardHint: 'Hint (optional)',
      noCards: 'No cards yet.',
      lessonHidden: 'Hidden from students',
      ai: {
        title: 'AI assistant',
        body: 'Generate draft course content with AI — you review everything before it is added.',
        promptPlaceholder: 'Describe the topic, exam, or outline…',
        generateOutline: 'Generate outline',
        generateQuiz: 'Generate quiz',
        generateFlashcards: 'Generate flashcards',
        generateLesson: 'Generate lesson',
        improveLesson: 'Improve lesson',
        targetLessonLabel: 'Lesson to improve',
        targetLessonPlaceholder: 'Select a lesson',
        generating: 'Generating…',
        queued: 'Queued',
        processing: 'Processing',
        completed: 'Completed',
        failed: 'Failed',
        progressLabel: '{0}% complete',
        addToCourse: 'Add to course',
        discard: 'Discard',
        generated:
          'AI produced a draft. Review it below, then add it to your course.',
        qualityTitle: 'Review checklist',
        qualityBody:
          'AI checks source coverage, quiz quality, duplicates, and course structure before you accept the draft.',
        noQualityIssues: 'No review issues found.',
        sourcesTitle: 'Sources and basis',
        sourceFallback: 'Course prompt or existing lesson material',
        sourceNoteFallback: 'No note provided.',
        issueTarget: 'Target: {0}',
        draftNotice:
          'AI content is added as an editable draft and is never auto-published.',
        saveFirst: 'Save the course once before using the AI assistant.',
        notConfigured:
          'AI generation is not configured yet (ANTHROPIC_API_KEY).',
        merge: {
          flashcardsTitle: 'AI flashcards',
          moduleTitle: 'AI module',
          quizTitle: 'AI quiz',
          lessonTitle: 'AI lesson',
          questionSource: 'AI generated',
        },
        progressStages: {
          queued: 'Queued',
          preparing: 'Preparing context',
          generating: 'Generating draft',
          checking: 'Checking quality',
          completed: 'Completed',
          failed: 'Failed',
        },
        qualitySeverity: {
          critical: 'Needs review',
          warning: 'Check',
          info: 'Note',
        },
        qualityIssues: {
          missingSources:
            'Add citations or source notes before accepting this draft.',
          outlineEmpty: 'The outline did not include any modules.',
          outlineThin:
            'The outline may be too thin for a complete course experience.',
          emptyTitle: 'A generated item is missing a title.',
          questionInvalidCorrectCount:
            'A question does not have exactly one correct answer.',
          questionTooFewOptions: 'A question has fewer than three options.',
          questionMissingExplanation:
            'A question is missing its answer explanation.',
          questionMissingDomain: 'A question is missing its exam domain.',
          duplicateQuestion:
            'A generated question appears to duplicate an existing or generated question.',
          flashcardsThin:
            'The flashcard set may need more cards before students use it.',
          lessonNoBlocks:
            'The lesson draft did not include editable content blocks.',
        },
        errors: {
          notConfigured: 'AI generation is not configured yet.',
          lessonRequired: 'Select a lesson to improve.',
          queueFailed: 'AI generation could not be queued. Please try again.',
          courseAiNotConfigured: 'AI generation is not configured yet.',
          courseAiParseFailed:
            'AI returned an unreadable draft. Please try again.',
          courseAiGenerationFailed: 'AI generation failed. Please try again.',
          courseAiQueueFailed:
            'AI generation could not be queued. Please try again.',
        },
      },
      blocks: {
        title: 'Content blocks',
        body: 'Add rich, typed content blocks to the lesson.',
        empty: 'No content blocks yet.',
        add: 'Add block',
        headingLevel: 'Heading level',
        textPlaceholder: 'Text…',
        listHint: 'One item per line.',
        calloutVariant: 'Style',
        videoUrlPlaceholder: 'YouTube / Vimeo link',
        selectQuiz: 'Select a quiz',
        selectFlashcardSet: 'Select a flashcard set',
        types: {
          heading: 'Heading',
          paragraph: 'Paragraph',
          callout: 'Callout',
          bulletList: 'Bullet list',
          numberedList: 'Numbered list',
          divider: 'Divider',
          image: 'Image',
          video: 'Video',
          quizEmbed: 'Quiz',
          flashcardSet: 'Flashcards',
        },
        calloutVariants: {
          info: 'Info',
          warning: 'Warning',
          success: 'Success',
        },
      },
      untitledCourse: 'Untitled course',
      landingPage: 'Course landing page',
      landingPageBody:
        'The thumbnail, promo video, and audience students see before enrolling.',
      createBody:
        'Give your course a working title — you can refine everything else later.',
      createFlow: {
        title: 'Start with a course blueprint',
        body: 'Pick a starter structure, review the outline, then continue refining it in the full builder.',
        stepDetails: 'Course basics',
        stepDetailsBody:
          'Set the working identity for the course. These details stay editable after creation.',
        stepTemplate: 'Choose a starter template',
        stepTemplateBody:
          'Templates create a useful first outline so you are never starting from an empty page.',
        stepReview: 'Outline preview',
        stepReviewBody:
          'This draft will be saved immediately and can be edited section by section.',
        examGoal: 'Exam or learning goal',
        createWithTemplate: 'Create course blueprint',
      },
      templates: {
        examPrep: {
          title: 'Exam prep',
          badge: 'Structured',
          description:
            'Best for certification, placement, licensing, or final exam preparation.',
          outcomes: [
            'Understand the exam structure and scoring priorities.',
            'Practice core domains with targeted review.',
            'Build a final readiness plan before test day.',
          ],
          requirements: [
            'A target exam or assessment date.',
            'Enough weekly study time to complete practice work.',
          ],
          modules: [
            {
              title: 'Orientation and baseline',
              description:
                'Help students understand the course plan and current readiness.',
              lessons: [
                'Course roadmap',
                'Baseline diagnostic',
                'Study system setup',
              ],
              quizTitle: 'Baseline check',
              assignmentTitle: 'Create your study schedule',
              assignmentPrompt:
                'Share your target date, weekly study windows, and the topics you feel least confident about.',
            },
            {
              title: 'Core domains',
              description:
                'Teach the highest-impact domains with examples and practice.',
              lessons: [
                'Domain walkthrough',
                'Worked examples',
                'Common mistakes',
              ],
              quizTitle: 'Core domain check',
            },
            {
              title: 'Final readiness',
              description:
                'Move from practice into timed review and test-day confidence.',
              lessons: [
                'Timed practice strategy',
                'Review weak areas',
                'Exam day plan',
              ],
              quizTitle: 'Final readiness check',
            },
          ],
        },
        skillCourse: {
          title: 'Skill course',
          badge: 'Project-led',
          description:
            'Best for teaching a practical skill with demonstrations, homework, and feedback.',
          outcomes: [
            'Apply the skill through guided practice.',
            'Complete a small project that proves competency.',
            'Know how to continue improving after the course.',
          ],
          requirements: [
            'Basic familiarity with the topic.',
            'Access to any tools needed for the practice project.',
          ],
          modules: [
            {
              title: 'Foundations',
              description:
                'Introduce the mental model, vocabulary, and first practice loop.',
              lessons: ['Core concepts', 'Guided demonstration', 'First try'],
              quizTitle: 'Foundations check',
            },
            {
              title: 'Guided practice',
              description:
                'Build confidence through repeated examples and feedback.',
              lessons: [
                'Practice walkthrough',
                'Troubleshooting',
                'Feedback loop',
              ],
              quizTitle: 'Practice check',
              assignmentTitle: 'Submit a practice artifact',
              assignmentPrompt:
                'Upload or describe your first practice result and explain what you would improve next.',
            },
            {
              title: 'Capstone',
              description:
                'Bring the full skill together in a concise final project.',
              lessons: [
                'Project brief',
                'Build session',
                'Review and next steps',
              ],
              quizTitle: 'Capstone reflection',
            },
          ],
        },
        miniCourse: {
          title: 'Quick mini-course',
          badge: 'Fast start',
          description:
            'Best for a focused topic that students can complete in one short sitting.',
          outcomes: [
            'Understand the topic quickly.',
            'Apply one focused technique or framework.',
            'Leave with a clear next action.',
          ],
          requirements: ['No advanced preparation required.'],
          modules: [
            {
              title: 'Focused lesson path',
              description:
                'A compact structure for a short, outcome-focused course.',
              lessons: [
                'What matters most',
                'Example walkthrough',
                'Apply it now',
              ],
              quizTitle: 'Mini-course check',
              assignmentTitle: 'One action plan',
              assignmentPrompt:
                'Write the next action you will take and how you will know it worked.',
            },
          ],
        },
      },
      nextStep: {
        title: 'Next best step',
        ready: 'Ready for review',
        fix: 'Go there',
        review: 'Review course',
      },
      recovery: {
        title: 'Restore unsaved draft?',
        body: 'A newer builder draft was found. Restore it to continue from your latest edits, or keep the saved course version.',
        restore: 'Restore draft',
        discard: 'Keep server version',
        later: 'Review later',
      },
      curriculumExpandAll: 'Expand all',
      curriculumCollapseAll: 'Collapse all',
      nav: {
        plan: 'Plan',
        content: 'Content',
        publish: 'Publish',
        goals: 'Goals & outcomes',
        landingPage: 'Landing page',
        curriculum: 'Curriculum',
        practiceExams: 'Practice exams',
        flashcards: 'Flashcards',
        aiAssistant: 'AI assistant',
        submit: 'Submit for review',
      },
      autosave: {
        saving: 'Saving…',
        saved: 'Saved',
        error: 'Save failed',
        retry: 'Retry',
      },
      checkpoints: {
        title: 'Version history',
        body: 'Create manual restore points and recover recent builder drafts.',
        label: 'Checkpoint label',
        labelPlaceholder: 'e.g. Before final quiz edits',
        create: 'Create checkpoint',
        restore: 'Restore',
        delete: 'Delete checkpoint',
        empty: 'No checkpoints yet.',
        loading: 'Loading checkpoints…',
        created: 'Checkpoint created.',
        restored: 'Checkpoint restored.',
        deleted: 'Checkpoint deleted.',
        submitSnapshotLabel: 'Before submit for review',
        sources: {
          autosave: 'Autosave',
          manual: 'Manual',
          restore: 'Restore',
          submitSnapshot: 'Submit snapshot',
        },
      },
      checklist: {
        title: 'Submit for review',
        intro:
          'Your course must meet these requirements before an admin can review it.',
        required: 'Required',
        recommended: 'Recommended',
        ready: 'Everything looks good — submit when you are ready.',
        notReady: 'Complete the items above before submitting.',
        fix: 'Fix',
        titleItem: 'Add a course title',
        descriptionItem: 'Write a course description',
        thumbnailItem: 'Upload a course thumbnail',
        moduleItem: 'Add at least one module',
        lessonsItem: 'Add at least three lessons',
        assessmentItem: 'Add at least one quiz or practice exam',
        outcomeItem: 'Add at least one learning outcome',
        audienceItem: 'Describe who this course is for',
        requirementItem: 'Add course requirements',
        lessonContentItem: 'Add content, blocks, or media to a lesson',
        flashcardRecommendedItem: 'Add flashcards for review practice',
      },
      success: {
        created: 'Course created.',
        saved: 'Draft saved.',
        submitted: 'Course submitted for review.',
        withdrawn: 'Course returned to draft.',
      },
    },
    quiz: {
      heading: 'Quiz',
      passingScore: 'Passing score',
      noPassingScore: 'No passing score required.',
      yourScore: 'Your score',
      lastScore: 'Last attempt',
      passed: 'Passed',
      failed: 'Not passed yet',
      correct: 'Correct',
      incorrect: 'Incorrect',
      explanation: 'Explanation',
      selectAll: 'Select all that apply.',
      selectOne: 'Select one answer.',
      answerAll: 'Answer every question before submitting.',
      points: 'points',
      empty: 'This quiz has no questions yet.',
      submit: 'Submit answers',
    },
    practiceExam: {
      heading: 'Practice exams',
      start: 'Start exam',
      submit: 'Submit exam',
      retake: 'Retake',
      yourScore: 'Your score',
      passed: 'Passed',
      failed: 'Not passed',
      domainBreakdown: 'Domain breakdown',
      empty: 'This exam has no questions available yet.',
      answerAll: 'Answer every question before submitting.',
    },
    flashcards: {
      heading: 'Flashcards',
      flip: 'Flip card',
      next: 'Next',
      previous: 'Previous',
      cardLabel: 'Card',
      showHint: 'Show hint',
      empty: 'This set has no cards yet.',
    },
    review: {
      menu: 'Course Reviews',
      title: 'Courses awaiting review',
      empty: 'No courses are awaiting review.',
      pending: 'Awaiting review',
      submittedAt: 'Submitted for review',
      decision: 'Review decision',
      notesLabel: 'Notes for the creator',
      notesHint:
        'Required when requesting changes — this is shared with the creator.',
      approveBody: 'Approving publishes the course to the catalog immediately.',
      approve: 'Approve & publish',
      requestChanges: 'Request changes',
      filterAll: 'All courses',
      filterPending: 'Awaiting review',
      success: 'Course review saved.',
    },
  },

  creatorApplication: {
    menu: 'Creator Application',
    title: 'Creator Application',
    description:
      'Apply for teacher verification with a structured profile, course plan, and private identity check before publishing courses on NexExam.',
    adminTitle: 'Creator Applications',
    adminDescription:
      'Review teacher profiles, identity verification, and creator readiness before approval.',
    sections: {
      profile: 'Teaching profile',
      profileBody:
        'Show students and reviewers who you are, what you teach, and who you serve.',
      expertise: 'Expertise and course plan',
      expertiseBody:
        'Add credentials, topic focus, proof links, and a sample lesson plan for quality review.',
      identity: 'Identity verification',
      identityBody:
        'Upload government ID or professional identity documents to the private verification bucket.',
      payout: 'Payout and contact',
      payoutBody:
        'Share payout notes or the best contact route for creator onboarding.',
      review: 'Submit for review',
      reviewBody:
        'Save your application first, then run the verification agent once your ID documents are uploaded.',
      certifications: 'Credentials & certifications',
      certificationsBody:
        'Add formal certifications or credentials, each with an optional supporting document.',
    },
    identity: {
      title: 'Verification checklist',
      description:
        'NexExam checks your teacher profile, ID documents, and admin approval state before creator access is granted.',
      profileReady: 'Teacher profile complete',
      documentsUploaded: 'Identity documents uploaded',
      consentRecorded: 'Identity check consent recorded',
      adminVerified: 'Identity verified by admin',
      consent:
        'I confirm these documents belong to me and authorize NexExam to review them for creator identity verification.',
      adminReviewTitle: 'Identity review',
      approvalRequiresIdentity:
        'Verify identity before approving this teacher application.',
    },
    hints: {
      onePerLine: 'One item per line',
      certificationsEmpty: 'No certifications added yet.',
    },
    fields: {
      legalName: 'Legal name',
      displayName: 'Display name',
      professionalTitle: 'Professional title',
      bio: 'Bio',
      credentials: 'Credentials',
      expertise: 'Exam/category expertise',
      teachingExperience: 'Teaching experience',
      audience: 'Target students',
      courseTopics: 'Course topics',
      sampleLessonPlan: 'Sample lesson plan',
      links: 'Links',
      payoutContact: 'Payout/contact notes',
      status: 'Status',
      identityStatus: 'Identity status',
      identityScanStatus: 'Agent scan',
      adminNotes: 'Admin notes',
      certificationTitle: 'Certification or credential',
      certificationIssuer: 'Issuing organization',
      certificationYear: 'Year',
      certificationUrl: 'Verification link',
      certificationDocuments: 'Supporting documents',
      payoutOnboardingStatus: 'Payout onboarding',
    },
    actions: {
      submit: 'Submit application',
      runIdentityScan: 'Run ID scan',
      verifyIdentity: 'Verify ID',
      requestDocuments: 'Request documents',
      approve: 'Approve',
      reject: 'Reject',
      review: 'Review',
      addCertification: 'Add certification',
      removeCertification: 'Remove',
      beginPayoutOnboarding: 'Begin payout onboarding',
      submitPayoutDetails: 'Submit payout details',
      grantNexVerified: 'Grant Nex Verified',
    },
    success: {
      submitted: 'Creator application submitted.',
      reviewed: 'Creator application reviewed.',
      identityScanStarted: 'Identity verification scan completed.',
      identityReviewed: 'Identity review updated.',
      payoutOnboardingUpdated: 'Payout onboarding updated.',
    },
    errors: {
      payoutContactRequired:
        'Add payout/contact notes before submitting your payout details.',
      payoutOnboardingInvalid:
        'That payout onboarding step is not available right now.',
      nexVerifiedNotEligible:
        'This creator is not yet eligible for Nex Verified.',
    },
    verification: {
      title: 'Verification center',
      description:
        'Clear every step below to unlock Nex Verified creator status.',
      nexVerifiedBadge: 'Nex Verified creator',
      eligibleNote: 'All checks passed — an admin can now grant Nex Verified.',
      pendingNote: 'Complete the remaining steps to become eligible.',
      checks: {
        applicationApproved: 'Creator application approved',
        identityVerified: 'Identity verified',
        payoutComplete: 'Payout onboarding complete',
        nexVerified: 'Nex Verified granted',
      },
    },
    enumerators: {
      status: {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
      },
      identityStatus: {
        notStarted: 'Not started',
        needsDocuments: 'Needs documents',
        readyForReview: 'Ready for review',
        verified: 'Verified',
        rejected: 'Rejected',
      },
      identityScanStatus: {
        notStarted: 'Not started',
        passed: 'Passed',
        needsReview: 'Needs review',
        failed: 'Failed',
      },
      identityScanChecks: {
        consent_recorded: 'Consent recorded',
        consent_missing: 'Consent missing',
        document_uploaded: 'Document uploaded',
        document_missing: 'Document missing',
        too_many_documents: 'Too many documents',
        file_type_supported: 'File type supported',
        file_type_needs_review: 'File type needs review',
        legal_name_present: 'Legal name present',
        legal_name_needs_review: 'Legal name needs review',
        manual_review_required: 'Manual admin review required',
      },
      payoutOnboardingStatus: {
        notStarted: 'Not started',
        inProgress: 'In progress',
        submitted: 'Submitted for review',
        actionRequired: 'Action required',
        complete: 'Complete',
      },
    },
  },

  chatbot: {
    title: 'AI Chat',
    menu: 'AI Chat',
    placeholder: 'Ask me anything about your data...',
    send: 'Send',
    thinking: 'Thinking...',
    usingTool: 'Using {0}...',
    error: 'Something went wrong. Please try again.',
    errorNoApiKey:
      'AI Chat is not configured. Please contact your administrator.',
    empty: 'Start a conversation with your AI chat',
    welcome:
      'Hello! I can help you with exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, members, audit logs, subscriptions, and more. What would you like to know?',
    clearConversation: 'Clear conversation',
    inputHint: 'Press Enter to send, Shift+Enter for new line',
    courseContextHeader: 'Course context available to the tutor:',
    courseVideoTranscriptNotice:
      'Uploaded videos are available as files only; no audio transcript is available in Phase 1.',
    courseScopedSystemPrompt: `The user is asking inside a specific course. Use this course context when helpful, but do not claim to know video audio that is not present in the written context:

{0}`,
    systemPrompt: `You are an AI chat assistant for {0}. You have access to various tools to help users manage their data including exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, members, audit logs, subscriptions, and user information.

IMPORTANT: Always respond in {1}. The user's interface language is {1}, so all your responses must be in {1}.

You should:
- Be helpful, concise, and professional
- Use the available tools to answer questions about data
- Explain what you're doing when using tools
- Format data in a clear, readable way
- Ask for clarification if a request is ambiguous

When showing data:
- Use tables or lists for multiple items
- Highlight important information
- Include relevant IDs only when necessary

Remember: You are operating within {0} and can only access data from this organization.`,
  },

  notification: {
    title: 'Notifications',
    menu: 'Notifications',
    unreadCount: '{0} unread notification(s)',
    markAsRead: 'Mark as read',
    markAsReadSuccess: 'Notifications marked as read',
    markAsUnread: 'Mark as unread',
    markAsUnreadSuccess: 'Notifications marked as unread',
    noNotifications:
      "You have no notifications yet. When there are updates or important events, you'll see them here.",
    list: {
      title: 'Notifications',
      menu: 'Notifications',
    },
    fields: {
      type: 'Type',
      message: 'Message',
      createdAt: 'Date',
      readAt: 'Read',
    },
    status: {
      read: 'Read',
      unread: 'Unread',
    },
    enumerators: {
      type: {
        memberAdded: 'Member Added',
        memberRemoved: 'Member Removed',
        subscriptionCreated: 'Subscription Created',
        studyPlanDue: 'Study plan due',
        flashcardsDue: 'Flashcards due',
        streakRisk: 'Study streak reminder',
        examDateApproaching: 'Exam date approaching',
        practiceReminder: 'Practice reminder',
        custom: 'Custom',
      },
    },
    memberAdded: {
      subject: 'New member added to {0}',
      body: `<p>Hello,</p><p><strong>{0}</strong> ({1}) has been added to {2} by {3}.</p><p>Thanks,</p><p>Your team</p>`,
      pushBody: '{0} joined {1}',
    },
    memberRemoved: {
      subject: 'Member removed from {0}',
      body: `<p>Hello,</p><p><strong>{0}</strong> ({1}) has been removed from {2} by {3}.</p><p>Thanks,</p><p>Your team</p>`,
      pushBody: '{0} left {1}',
    },
    subscriptionCreated: {
      subject: 'New subscription in {0}',
      body: `<p>Hello,</p><p><strong>{0}</strong> ({1}) has subscribed to the <strong>{2}</strong> plan for {3}.</p><p>Thanks,</p><p>Your team</p>`,
      pushBody: '{0} subscribed to {1}',
    },
    studyPlanDue: {
      subject: 'Study plan due for {0}',
      body: '<p>Your task <strong>{0}</strong> is due for {1}.</p>',
      pushBody: '{0} is due for {1}',
    },
    flashcardsDue: {
      subject: 'Flashcards due for {0}',
      body: '<p>You have {0} flashcard(s) ready to review in {1}.</p>',
      pushBody: '{0} flashcard(s) ready in {1}',
    },
    streakRisk: {
      subject: 'Keep your {0} streak going',
      body: '<p>Open {0} today to protect your {1}-day study streak.</p>',
      pushBody: 'Keep your {0} streak going today',
    },
    examDateApproaching: {
      subject: '{0} is coming up',
      body: '<p>{0} is {1} day(s) away. Review your study plan today.</p>',
      pushBody: '{0} is {1} day(s) away',
    },
    practiceReminder: {
      subject: 'Practice ready for {0}',
      body: '<p>A short practice session is ready for {0}.</p>',
      bodyWithWeakArea:
        '<p>A short practice session for {0} is ready, focused on {1}.</p>',
      pushBody: 'Practice is ready for {0}',
      pushBodyWithWeakArea: 'Practice your {0} weak area',
    },
    custom: {
      subject: '{0}',
      body: '{0}',
      pushBody: '{0}',
    },
    default: {
      subject: 'Notification',
      body: 'You have a new notification',
      pushBody: 'You have a new notification',
    },
    send: {
      title: 'Send Notification',
      menu: 'Send',
      success: 'Notification sent successfully',
      fields: {
        title: 'Title',
        message: 'Message',
        roles: 'Target Roles',
      },
      placeholders: {
        title: 'Enter notification title',
        message: 'Enter notification message',
        roles: 'Select roles to notify',
      },
    },
  },

  trustSafety: {
    admin: {
      title: 'Trust and Safety',
      menu: 'Trust and Safety',
      description:
        'Review marketplace reports, risk flags, policy acceptance, and creator restrictions.',
      openReports: 'Open reports',
      openRiskFlags: 'Open risk flags',
      pendingReviews: 'Pending reviews',
      disabledCreators: 'Disabled creators',
      policyVersions: 'Active policy versions',
      noPolicyVersions: 'No active policies configured.',
      searchPlaceholder: 'Search reports, courses, creators, or flags...',
      reportStatusFilter: 'All report statuses',
      flagStatusFilter: 'All flag statuses',
      priorityFilter: 'All priorities',
      severityFilter: 'All severities',
      targetTypeFilter: 'All target types',
      runRuleScan: 'Scan risk rules',
      riskFlags: 'Risk flags',
      reports: 'Reports',
      manualFlag: 'Manual risk flag',
      pendingCourseReviews: 'Pending course reviews',
      disabledCreatorList: 'Disabled creators',
      emptyRiskFlags: 'No risk flags match these filters.',
      emptyReports: 'No reports match these filters.',
      emptyCourseReviews: 'No courses are waiting for review.',
      emptyDisabledCreators: 'No creators are disabled.',
      targetIdPlaceholder: 'Target UUID',
      reasonPlaceholder: 'Describe the risk',
      adminNotesPlaceholder: 'Admin notes',
      resolutionSummaryPlaceholder: 'Resolution summary',
      createFlag: 'Create flag',
      assignToMe: 'Assign to me',
      markReviewing: 'Mark reviewing',
      resolve: 'Resolve',
      dismiss: 'Dismiss',
      resolveActionTaken: 'Resolve with action',
      resolveNoAction: 'Resolve no action',
      disableCreator: 'Disable creator',
      restoreCreator: 'Restore creator',
      placeHold: 'Place hold',
      removeHold: 'Remove hold',
      onHold: 'On hold',
      inReview: 'In review',
      openCourseReview: 'Open review',
      manualSafetyHoldReason: 'Manual safety hold',
      unknownCreator: 'Unknown creator',
      unknown: 'Unknown',
      unassigned: 'Unassigned',
      assignedTo: 'Assigned to',
      reportedBy: 'Reported by',
      disabled: 'Disabled',
      reviewTimeline: 'Review timeline',
      noReviewDecisions: 'No review decisions recorded yet.',
      priorities: {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
        urgent: 'Urgent',
      },
      outcomeCategories: {
        none: 'No outcome selected',
        contentRemoved: 'Content removed',
        creatorWarning: 'Creator warned',
        creatorSuspended: 'Creator suspended',
        refundReviewed: 'Refund reviewed',
        noViolation: 'No violation',
        duplicate: 'Duplicate',
      },
      reviewDecisions: {
        submitted: 'Submitted for review',
        withdrawn: 'Withdrawn from review',
        creatorUnpublished: 'Unpublished by creator',
        approve: 'Approved',
        requestChanges: 'Changes requested',
        safetyHoldPlaced: 'Safety hold placed',
        safetyHoldRemoved: 'Safety hold removed',
      },
      targetTypes: {
        creator: 'Creator',
        course: 'Course',
        report: 'Report',
        payout: 'Payout',
        oneOnOneSession: '1:1 session',
      },
      severities: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        critical: 'Critical',
      },
      flagStatuses: {
        open: 'Open',
        reviewing: 'Reviewing',
        resolved: 'Resolved',
        dismissed: 'Dismissed',
      },
      reportStatuses: {
        open: 'Open',
        underReview: 'Under review',
        resolvedActionTaken: 'Resolved with action',
        resolvedNoAction: 'Resolved no action',
      },
      sources: {
        manual: 'Manual',
        rule: 'Rule',
      },
      riskReasons: {
        repeatedReports: 'Repeated reports',
        identityRejected: 'Rejected identity check',
        payoutCancellations: 'Payout cancellation pattern',
        sessionRefundDisputes: 'Refund or dispute pattern',
      },
    },
    policies: {
      title: 'Marketplace terms',
      description:
        'Review and accept the active marketplace policy before continuing.',
      version: 'Version {0}',
      accepted: 'Accepted',
      accept: 'Accept policy',
      reviewTerms: 'Review terms',
      teacherTermsRequired: 'Teacher terms required',
      teacherTermsRequiredBody:
        'Accept the current teacher terms before submitting this course for marketplace review.',
      refundPolicy: {
        title: 'Refund policy',
        checkoutSummary:
          'Refunds are reviewed under the active marketplace refund policy. Abuse, completed services, or policy violations may be denied after review.',
        body: 'Paid sessions and marketplace purchases are reviewed under the active refund policy. Refunds may be approved when a paid session cannot be delivered, a teacher misses the scheduled service, or platform access fails. Abuse, completed services, or policy violations may be denied after review.',
      },
      teacherTerms: {
        title: 'Teacher terms',
        onboardingSummary:
          'Before submitting, confirm your course is original or properly licensed, accurately described, and ready for marketplace review.',
        body: 'Teachers must submit accurate credentials, publish original or properly licensed content, respond to student issues professionally, follow marketplace policies, and accept that NexExam may review, hold, reject, or remove content that creates student, legal, payment, or platform risk.',
      },
      studentTerms: {
        title: 'Student terms',
        body: 'Students must use course materials for personal learning, submit honest work, avoid harassment or platform abuse, respect teacher intellectual property, and report safety, quality, or payment concerns through the marketplace reporting tools.',
      },
    },
    report: {
      title: 'Report a marketplace issue',
      description:
        'Send this to the platform safety team for review. Reports are private to admins.',
      reportCourse: 'Report course or teacher',
      detailsPlaceholder:
        'Add details that will help the safety team review this.',
      submit: 'Submit report',
      reasons: {
        misleadingContent: 'Misleading content',
        unsafeAdvice: 'Unsafe advice',
        harassment: 'Harassment',
        fraud: 'Fraud or scam',
        intellectualProperty: 'Intellectual property concern',
        paymentIssue: 'Payment or refund issue',
        other: 'Other',
      },
    },
    success: {
      policyAccepted: 'Policy accepted',
      reportCreated: 'Report submitted',
      adminActionSaved: 'Trust and safety action saved',
      ruleScanComplete: 'Risk scan complete. {0} flag(s) created.',
    },
    errors: {
      policyNotFound: 'Policy not found',
      policyAcceptanceRequired:
        'Please accept the current marketplace policy before continuing.',
      creatorDisabled:
        'This creator is currently disabled for marketplace activity.',
      courseSafetyHold:
        'This course has a safety hold and cannot be published.',
      riskFlagsBlock:
        'Resolve high-priority trust and safety flags before publishing.',
    },
  },

  platformAdmin: {
    title: 'Platform Admin',
    menu: 'Platform Admin',
    hero: {
      badge: 'Super admin controls',
      title: 'Monitor NexExam operations',
      description:
        'Manage students, account creation links, student-facing promotions, and manual creator payouts across every organization.',
    },
    stats: {
      users: 'Users',
      organizations: 'Organizations',
      students: 'Students',
      activeCreators: 'Active creators',
      totalPayouts: 'Total payouts',
      activeSubscriptions: 'Active subscriptions',
      pendingInvitations: 'Pending invitations',
      activePromotions: 'Active promotions',
      pendingPayouts: 'Pending payouts',
      unreadNotifications: 'Unread notifications',
    },
    metrics: {
      title: 'Metrics command center',
      description:
        'Track growth, learning outcomes, revenue, refunds, AI usage, and course quality.',
      range: 'Range',
      loading: 'Loading metrics...',
      empty: 'No course metrics available yet.',
      ranges: {
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
        '90d': 'Last 90 days',
        '12m': 'Last 12 months',
      },
      signups: 'Signups',
      courseEnrollments: 'Course enrollments',
      lessonCompletion: 'Lesson completion',
      homeworkCompletion: 'Homework completion',
      quizScores: 'Quiz scores',
      aiUsage: 'AI usage',
      refundRate: 'Refund rate',
      creatorEarnings: 'Creator earnings',
      monthlyRevenue: 'Monthly revenue',
      studentRetention: 'Student retention',
      courseRatings: 'Course ratings',
      topCourses: 'Top courses',
      topCoursesBody:
        'Compare enrollment, learning progress, quiz results, ratings, and revenue.',
      course: 'Course',
      enrollments: 'Enrollments',
      homework: 'Homework',
      quiz: 'Quiz',
      rating: 'Rating',
      revenue: 'Revenue',
    },
    dashboard: {
      shortcut: 'Cmd K',
      adminName: 'NexExam Admin',
      adminRole: 'Super Admin',
      daily: 'Daily',
      noValue: '$0',
      loading: 'Loading users...',
      emptyUsers: 'No users match these filters.',
      showingUsers: 'Showing {0} of {1} users',
      platformWide: 'Platform-wide',
      manualPlan: 'Manual',
    },
    students: {
      title: 'Student accounts',
      description:
        'Search users across organizations and manage their memberships.',
    },
    invitation: {
      title: 'Account creation link',
      description:
        'Send a secure invitation link to a potential student or admin.',
      emailSubject: 'Your NexExam account invitation',
      emailBody: `<p>Hello,</p><p>You have been invited to join {0} on NexExam.</p><p>Use this secure link to create your account:</p><p><a href="{1}">{1}</a></p><p>Thanks,</p><p>The NexExam team</p>`,
    },
    promotions: {
      title: 'Promotions and toasts',
      description:
        'Publish toast notifications, banners, and discount messages for students.',
    },
    payouts: {
      title: 'Creator payouts',
      description:
        'Track manual payout records for course creators before marking them paid.',
      unassigned: 'Unassigned creator',
      totalMtd: 'Total payouts',
      pendingAmount: 'Pending amount',
      successfulPayouts: 'Successful payouts',
      cancelledPayouts: 'Cancelled payouts',
      trend: 'Payout trend',
      pendingQueue: 'Pending payouts queue',
      createTitle: 'Create payout',
      createDescription:
        'Add a manual payout record and track it through completion.',
    },
    roles: {
      title: 'Roles and permissions',
      description: 'Monitor platform access control.',
      adminDescription: 'Manage organization settings and users',
      memberDescription: 'Use the learning workspace',
    },
    activity: {
      title: 'Recent activity',
      description: 'Track important admin actions.',
      system: 'System',
      auditLine: '{0} on {1}',
    },
    risk: {
      title: 'Fraud and risk overview',
      description: 'Flagged accounts and payout risks.',
      disabledMembers: 'Disabled members',
      pendingPayouts: 'Pending payouts',
      cancelledAmount: 'Cancelled payout amount',
    },
    activePromotion: {
      open: 'Open',
      dismiss: 'Dismiss promotion',
    },
    fields: {
      organization: 'Organization',
      email: 'Email',
      role: 'Role',
      memberships: 'memberships',
      kind: 'Type',
      audience: 'Audience',
      creatorUserId: 'Creator user ID',
      amount: 'Amount',
      accessStatus: 'Access status',
      description: 'Description',
    },
    filters: {
      allRoles: 'All roles',
      allStatus: 'All status',
    },
    table: {
      user: 'User',
      role: 'Role',
      access: 'Access',
      plan: 'Organization',
      creatorEarnings: 'Creator earnings',
      actions: 'Actions',
    },
    placeholders: {
      organization: 'Select organization',
      email: 'student@example.com',
      globalSearch: 'Search users, creators, payouts, notifications...',
      searchStudents: 'Search students by name or email...',
      title: 'Promotion title',
      message: 'Promotion message',
      ctaLabel: 'Call to action label',
      ctaHref: 'Call to action link',
      creatorUserId: 'Paste creator user ID',
      description: 'Payout note',
    },
    actions: {
      sendInvitation: 'Send invitation',
      createPromotion: 'Create promotion',
      createPayout: 'Create payout',
      activate: 'Activate',
      deactivate: 'Deactivate',
      disable: 'Disable',
      restore: 'Restore',
      markPaid: 'Mark paid',
      cancel: 'Cancel',
      add: 'Add',
      addUser: 'Add user',
      export: 'Export',
      alerts: 'Alerts',
      filters: 'Filters',
      view: 'View',
      edit: 'Edit',
      viewAll: 'View all',
      viewPayouts: 'View payouts',
      backToDashboard: 'Back to dashboard',
    },
    success: {
      invitationSent: 'Invitation sent successfully',
      promotionCreated: 'Promotion created successfully',
      payoutCreated: 'Payout created successfully',
    },
    errors: {
      inviteExists: 'A pending invitation already exists for this email.',
    },
    enumerators: {
      role: {
        admin: 'Admin',
        member: 'Member',
      },
      kind: {
        toast: 'Toast',
        banner: 'Banner',
        discount: 'Discount',
      },
      audience: {
        students: 'Students',
        admins: 'Admins',
        all: 'Everyone',
      },
      status: {
        pending: 'Pending',
        paid: 'Paid',
        cancelled: 'Cancelled',
      },
      accessStatus: {
        active: 'Active',
        disabled: 'Disabled',
      },
    },
  },

  recaptcha: {
    errors: {
      disabled:
        'reCAPTCHA is disabled in this platform. Skipping verification.',
      invalid: 'Invalid reCAPTCHA',
    },
  },

  emails: {
    passwordResetEmail: {
      subject: `Reset your password for {0}`,
      content: `<p>Hello,</p> <p> Follow this link to reset your {0} password for your account. </p> <p><a href="{1}">{1}</a></p> <p> If you didn't ask to reset your password, you can ignore this email. </p> <p>Thanks,</p> <p>Your {0} team</p>`,
    },
    verifyEmailEmail: {
      subject: `Verify your email for {0}`,
      content: `<p>Hello,</p><p>Follow this link to verify your email address.</p><p><a href="{1}">{1}</a></p><p>If you didn't ask to verify this address, you can ignore this email. </p> <p>Thanks,</p> <p>Your {0} team</p>`,
    },
    emailChangeEmail: {
      subject: `Approve email change for {0}`,
      content: `<p>Hello,</p><p>You have requested to change your email address to <strong>{2}</strong>.</p><p>Follow this link to approve the change:</p><p><a href="{1}">{1}</a></p><p>If you didn't request this change, you can ignore this email and your email address will remain unchanged.</p><p>Thanks,</p><p>Your {0} team</p>`,
    },
    invitationEmail: {
      multiOrganization: {
        subject: `You've been invited to {1} at {0}`,
        content: `<p>Hello,</p> <p>You've been invited to {2}.</p> <p>Follow this link to register.</p> <p><a href="{1}">{1}</a></p> <p>Thanks,</p> <p>Your {0} team</p>`,
      },
      singleOrganization: {
        subject: `You've been invited to {0}`,
        content: `<p>Hello,</p> <p>You've been invited to {0}.</p> <p>Follow this link to register.</p> <p><a href="{1}">{1}</a></p> <p>Thanks,</p> <p>Your {0} team</p>`,
      },
    },
    accountDeletionRequestEmail: {
      subject: `Confirm your account deletion`,
      content: `<p>Hello {0},</p><p>You asked to delete your account. To confirm, click this link within 24 hours:</p><p><a href="{1}">{1}</a></p><p>Your account is scheduled to be permanently removed on <strong>{2}</strong> unless you cancel before then. You can cancel anytime from your Account Settings.</p><p>If you didn't request this, you can ignore this email — nothing will happen.</p>`,
    },
    accountDeletionConfirmedEmail: {
      subject: `Your account is scheduled for deletion`,
      content: `<p>Hello {0},</p><p>Your account deletion is confirmed. We will permanently remove your data on <strong>{1}</strong>. You can still cancel anytime before then from your Account Settings.</p>`,
    },
    dataExportReadyEmail: {
      subject: `Your data export is ready`,
      content: `<p>Hello {0},</p><p>Your data export is ready to download.</p><p><a href="{1}">{1}</a></p><p>Download links expire after 15 minutes for security — visit your Account Settings anytime to request a fresh link.</p>`,
    },
  },
  oneOnOneCall: {
    entryCard: {
      title: '1:1 with your instructor',
      description: 'Book a video call with your course instructor.',
      actionOpen: 'Book a 1:1',
      noAvailability: 'Your instructor has not opened any 1:1 sessions yet.',
    },
    availability: {
      title: 'Availability',
      description: 'Pick the weekly windows you can take 1:1 calls.',
      timezoneLabel: 'Timezone',
      addWindow: 'Add window',
      removeWindow: 'Remove',
      dayOfWeek: 'Day',
      startTime: 'Start',
      endTime: 'End',
      save: 'Save availability',
      saved: 'Availability saved',
      empty: 'No availability windows yet. Add one to start taking sessions.',
      days: {
        sunday: 'Sunday',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
      },
    },
    sessionType: {
      title: 'Session types',
      description: 'Define what students can book.',
      add: 'Add session type',
      fields: {
        title: 'Title',
        description: 'Description (optional)',
        durationMinutes: 'Duration (minutes)',
        isFree: 'Free session',
        priceCents: 'Price (cents)',
        currency: 'Currency',
        bufferMinutes: 'Buffer (minutes)',
        minNoticeHours: 'Minimum notice (hours)',
      },
      save: 'Save',
      disable: 'Disable',
      empty: 'No session types yet.',
      paidDisabledHint:
        'Paid sessions are coming soon — only free sessions can be created right now.',
    },
    booking: {
      title: 'Book a 1:1',
      pickSessionType: 'Choose a session',
      pickDate: 'Pick a date',
      pickTime: 'Pick a time',
      confirm: 'Confirm booking',
      submitting: 'Booking…',
      noSessionTypes: 'Your instructor has not opened any 1:1 sessions yet.',
      noSlots: 'No open slots in this range.',
      success: 'Booked — see your session under your sessions list.',
    },
    session: {
      title: 'Your 1:1 sessions',
      tabs: { upcoming: 'Upcoming', past: 'Past' },
      role: { student: 'As student', instructor: 'As instructor' },
      emptyUpcoming: 'No upcoming sessions.',
      emptyPast: 'No past sessions.',
      join: 'Join call',
      joinHint: 'The join link unlocks 10 minutes before start.',
      cancel: 'Cancel session',
      statusLabel: 'Status',
      statuses: {
        confirmed: 'Confirmed',
        pendingPayment: 'Awaiting payment',
        completed: 'Completed',
        cancelledByStudent: 'Cancelled by student',
        cancelledByInstructor: 'Cancelled by instructor',
        noShow: 'No-show',
        expired: 'Expired',
        disputed: 'Disputed',
        refunded: 'Refunded',
      },
    },
    notes: {
      title: 'Notes',
      placeholder: 'Add a private or shared note…',
      add: 'Add note',
      shared: 'Share with the other party',
      edit: 'Edit',
      delete: 'Delete',
      empty: 'No notes yet.',
    },
    cancel: {
      title: 'Cancel this session?',
      reasonLabel: 'Reason (optional)',
      confirm: 'Yes, cancel',
      keep: 'Keep session',
      lateCancelWarning:
        'You are cancelling within 24 hours of the start — this counts as a late cancel.',
    },
    errors: {
      noInstructor: 'This course has no instructor available for 1:1 sessions.',
      cannotBookSelf: 'You cannot book a 1:1 with yourself.',
      paidNotAvailable:
        'Paid 1:1 sessions are not available yet — only free sessions can be booked or created.',
      slotUnavailable:
        'That time is not in the instructor availability or violates the minimum-notice window.',
      slotTaken:
        'That slot was just booked by someone else. Please pick another time.',
      rangeTooLarge:
        'Slot range is too large — narrow the dates and try again.',
      notCourseOwner: 'You do not own this course.',
      cannotCancel: 'This session can no longer be cancelled.',
    },
    notify: {
      bookingConfirmedTitle: '1:1 session booked',
      bookingConfirmedStudentBody:
        'Your 1:1 session for {0} is confirmed for {1}.',
      bookingConfirmedInstructorBody: '{0} booked a 1:1 for {1} on {2}.',
      cancelledTitle: '1:1 session cancelled',
      cancelledByStudentBody: '{0} cancelled the 1:1 for {1} on {2}.',
      cancelledByInstructorBody: '{0} cancelled your 1:1 for {1} on {2}.',
      reminderTitle: '1:1 session reminder',
      reminderBody: 'Your 1:1 for {0} is starting soon — {1}.',
      disputeOpenedTitle: '1:1 session disputed',
      disputeResolvedTitle: '1:1 dispute resolved',
    },
    dispute: {
      open: 'Dispute this session',
      reasonLabel: 'What went wrong?',
      reasonPlaceholder: 'Describe the issue in detail.',
      submit: 'Open dispute',
      alreadyDisputed: 'A dispute is already open for this session.',
      notEligible:
        'Only paid sessions that have completed or been marked no-show can be disputed.',
      outcomeRefund: 'A refund has been issued.',
      outcomeNoRefund: 'The dispute was reviewed and no refund was issued.',
      admin: {
        title: '1:1 dispute review',
        list: 'Open disputes',
        statusFilter: 'Filter by status',
        detail: 'Dispute detail',
        resolutionLabel: 'Resolution',
        refund: 'Issue refund',
        noRefund: 'No refund',
        refundAmount: 'Refund amount (cents)',
        notes: 'Resolution notes',
        resolve: 'Resolve',
        resolved: 'Resolved',
        empty: 'No disputes match this filter.',
      },
    },
  },
  creatorEarnings: {
    title: 'Your earnings',
    summary: {
      title: 'Earnings summary',
      totalEarned: 'Total paid',
      pending: 'Pending',
      paidThisMonth: 'Paid this month',
    },
    list: {
      title: 'Payouts',
      empty: 'No payouts yet. Entries will appear here as soon as you earn.',
      status: {
        pending: 'Pending',
        paid: 'Paid',
        cancelled: 'Cancelled',
      },
    },
    payoutMethod: {
      title: 'Payout method',
      description:
        'How would you like to be paid? Bank ACH details, Wise email, PayPal, etc. Plain text — admins read this when wiring your funds.',
      edit: 'Edit',
      save: 'Save',
      placeholder: 'e.g. ACH — Chase ****1234 — routing 021000021',
      empty: 'No payout method set yet.',
    },
    notify: {
      payoutPaidTitle: 'Your payout was sent',
      payoutPaidBody: 'Your payout of {0} {1} has been marked as paid.',
      payoutCancelledTitle: 'Your payout was cancelled',
      payoutCancelledBody: 'Your payout of {0} {1} has been cancelled.',
    },
  },
  adminCourseCategories: {
    title: 'Course categories',
    description:
      'Curated taxonomy that powers the marketplace chip row and the creator builder dropdown.',
    empty: 'No categories yet. Add one to start curating the marketplace.',
    columns: {
      name: 'Name',
      slug: 'Slug',
      displayOrder: 'Order',
      isActive: 'Active',
      actions: 'Actions',
    },
    fields: {
      name: 'Name',
      description: 'Description',
      iconName: 'Icon (Lucide key, e.g. LuBookOpen)',
      displayOrder: 'Display order',
      isActive: 'Active',
    },
    actions: {
      create: 'New category',
      edit: 'Edit',
      disable: 'Disable',
      enable: 'Enable',
      save: 'Save',
      cancel: 'Cancel',
    },
    confirm: {
      disable:
        'Disable this category? Courses linked to it will keep their assignment but the category will not appear in the marketplace.',
      enable: 'Make this category visible again in the marketplace?',
    },
    errors: {
      statusRequired: 'Choose enable or disable.',
    },
  },
  adminCoursePurchases: {
    title: 'Course purchases',
    description:
      'Every one-time Stripe purchase of a paid course. Issue refunds in Stripe Dashboard first, then mark them here to revoke access + cancel the linked creator payout.',
    empty: 'No course purchases yet.',
    columns: {
      buyer: 'Buyer',
      course: 'Course',
      amount: 'Amount',
      paidAt: 'Paid at',
      refundedAt: 'Refunded at',
      actions: 'Actions',
    },
    actions: {
      markRefunded: 'Mark refunded',
      cancel: 'Cancel',
      save: 'Save',
    },
    filters: {
      all: 'All',
      active: 'Active',
      refunded: 'Refunded',
    },
    refundDialog: {
      title: 'Mark purchase refunded',
      description:
        'Confirms you have already issued the Stripe refund. Removes course access for the buyer and cancels the linked creator payout. This cannot be undone.',
      reasonLabel: 'Refund reason (optional)',
      reasonPlaceholder: 'Internal note for the audit log',
    },
    badges: {
      paid: 'Paid',
      refunded: 'Refunded',
    },
  },
  studentOnboarding: {
    title: 'Pick your first courses',
    body: 'Choose any free courses to enroll in now. You can browse the full marketplace anytime — paid courses live on the course page.',
    skip: 'Skip for now',
    continue: 'Continue to dashboard',
    enrollLabel: 'Enroll',
    enrolledLabel: 'Enrolled',
    viewLabel: 'View course',
    emptyMessage:
      "We're prepping a fresh batch of courses. Jump in when ready.",
  },
  aiTutor: {
    title: 'AI Tutor',
    subtitle: 'Ask, quiz, plan — your study partner.',
    newChat: 'New chat',
    search: 'Search conversations',
    untitled: 'New chat',
    emptyHeroTitle: 'How can I help you study today?',
    emptyHeroBody: 'Ask a question, request a quiz, or build a study plan.',
    suggestionExplain: 'Explain my last lesson',
    suggestionQuiz: 'Quiz me on this module',
    suggestionPlan: 'Build me a 7-day study plan',
    suggestionPractice: 'Give me 12 practice questions',
    header: {
      openHistory: 'Open history',
      studyMode: 'Study Mode',
    },
    timer: {
      toggle: 'Toggle study timer',
      label: 'Study Timer',
      close: 'Close study timer',
      pause: 'Pause timer',
      resume: 'Resume timer',
    },
    history: {
      todayGroup: 'Today',
      yesterdayGroup: 'Yesterday',
      previousWeekGroup: 'Previous 7 days',
      olderGroup: 'Older',
      rename: 'Rename',
      archive: 'Archive',
      actions: 'Conversation actions',
      confirmArchive: 'Archive this conversation? You can restore it later.',
      empty: 'No conversations yet — start by asking a question.',
    },
    composer: {
      placeholder: 'Message AI Tutor',
      sendAriaLabel: 'Send message',
      stopAriaLabel: 'Stop generating',
      attachComingSoon: 'Attachments coming soon',
      disclaimer: 'AI Tutor can make mistakes. Verify key answers.',
    },
    thread: {
      thinking: 'Thinking…',
      usingTool: 'Using {0}…',
      retry: 'Retry',
      courseChip: 'Course: {0}',
      lessonChip: 'Lesson: {0}',
    },
    widgets: {
      headerLabel: 'AI Tutor',
      expand: 'Expand',
      openLesson: 'Open lesson',
      continueChat: 'Continue chat',
      submitAnswers: 'Submit answers',
      quiz: {
        title: 'Quiz',
        scorePrefix: 'Score',
        correct: 'Correct',
        incorrect: 'Incorrect',
        reviewExplanation: 'Show explanation',
        tryAgain: 'Try again',
      },
      practice: {
        title: 'Practice',
        attemptedOf: '{0} of {1} attempted',
        finish: 'Finish practice',
      },
      explain: {
        title: 'Explanation',
        openFullLesson: 'Open full lesson',
      },
      summary: {
        title: 'Summary',
        copyToNotes: 'Copy to notes',
      },
      plan: {
        title: 'Study plan',
        savePlan: 'Save plan',
        saveSingle: 'Add to plan',
        completed: 'Saved',
        daysShort: 'd',
      },
    },
    alerts: {
      limitDaily:
        "You've reached your personal daily AI Tutor limit. It resets tomorrow.",
      limitOrg:
        'Your organization has reached its daily AI Tutor limit. It resets tomorrow.',
      limitGlobal:
        'AI Tutor has reached its daily capacity. Please try again tomorrow.',
      concurrentRequest:
        'Another AI Tutor request is in flight. Wait a moment and try again.',
      networkError: "Couldn't reach AI Tutor. Check your connection and retry.",
      dismiss: 'Dismiss',
    },
  },

  legal: {
    terms: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Terms of Service',
      lastUpdated: 'Last updated 2026-05-23',
      body: `# Terms of Service\n\nThese Terms govern your access to and use of NexExam ("the Service"). By creating an account, you agree to these Terms.\n\n## 1. Eligibility\nYou must be at least 13 years old. By signing up you confirm you meet this age requirement.\n\n## 2. Account\nYou're responsible for safeguarding your password and for all activity under your account. Notify us immediately of any unauthorized use.\n\n## 3. Acceptable Use\nNo unlawful content, no impersonation, no scraping, no automated abuse.\n\n## 4. Content\nYou retain ownership of content you upload. You grant us a license to host, display, and process it as needed to operate the Service.\n\n## 5. Payments\nCourse purchases and 1:1 sessions are billed through Stripe. Refunds are governed by the policy displayed at checkout.\n\n## 6. Termination\nYou may close your account anytime. We may suspend or terminate accounts that violate these Terms.\n\n## 7. Disclaimers and Liability\nThe Service is provided "as is". To the maximum extent permitted by law we disclaim all warranties.\n\n## 8. Changes\nWe may update these Terms. Continued use after material updates means you accept the updated Terms.\n\n## 9. Contact\nQuestions? Email legal@nexexam.com.`,
    },
    privacy: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Privacy Policy',
      lastUpdated: 'Last updated 2026-05-23',
      body: `# Privacy Policy\n\nThis Policy describes what we collect, how we use it, and your rights.\n\n## 1. What we collect\nAccount info (email, name, date of birth), course activity, payment metadata via Stripe, AI tutor conversations, and operational telemetry.\n\n## 2. How we use it\nTo run the Service, personalize your study experience, process payments, comply with the law, and communicate with you.\n\n## 3. Sharing\nWith service providers (Stripe, AWS, email delivery, Anthropic for AI tutoring) under data-processing agreements. We do not sell your data.\n\n## 4. Your rights\nYou can request a copy of your data or delete your account anytime from Account Settings. EU/UK/CA users have additional rights including correction and portability.\n\n## 5. Retention\nTax-relevant records (purchases, audit logs) are retained per applicable law. Other personal data is removed within 14 days of account deletion.\n\n## 6. International transfers\nData may be processed outside your country. We use appropriate safeguards.\n\n## 7. Children\nThe Service is not directed to children under 13.\n\n## 8. Changes\nWe will notify you of material changes to this Policy.\n\n## 9. Contact\nprivacy@nexexam.com.`,
    },
  },

  account: {
    privacyTabLabel: 'Privacy & account',
    delete: {
      cardTitle: 'Delete your account',
      cardBody:
        'Permanently remove your account and personal data. Tax-related records (purchases, audit logs) are retained as required by law.',
      cardAction: 'Delete account',
      dialogTitle: 'Delete your account',
      dialogBody:
        "After 14 days, your account and most personal data will be removed. You can cancel anytime within the 14-day window from this page or the email link we'll send.",
      dialogAcknowledge: 'I understand this is permanent.',
      dialogSubmit: 'Continue',
      requestSentTitle: 'Check your email',
      requestSentBody:
        'We sent a confirmation link to your inbox. Click it within 24 hours to lock in the deletion. Without confirmation, nothing changes.',
      confirmedSuccessTitle: 'Deletion confirmed',
      confirmedSuccessBody:
        'Your account will be removed on {0}. You can cancel anytime before then.',
      confirmedExpiredTitle: "This link can't be used",
      confirmedExpiredBody:
        'The confirmation link is invalid or has already been used. Open Account Settings to request a fresh link.',
      cancelBannerTitle: 'Your account is scheduled for deletion on {0}',
      cancelBannerAction: 'Cancel deletion',
      cancelledToast: 'Deletion cancelled.',
      errors: {
        alreadyDeleted: 'This account has already been deleted.',
      },
    },
    dataExport: {
      cardTitle: 'Download a copy of your data',
      cardBody:
        "We'll prepare a JSON file with your account, courses, notes, chats, and other personal data. You'll get an email when it's ready.",
      cardAction: 'Request export',
      cooldownBody:
        'Try again in {0} hours — only one export per 24-hour window.',
      statusQueued: 'Preparing',
      statusCompleted: 'Ready',
      statusFailed: 'Failed',
      downloadAction: 'Download',
      downloadHint:
        'Download links expire after 15 minutes for security. Click again for a fresh link.',
      emptyTitle: 'No exports yet',
      emptyBody: "When you request one, it'll appear here.",
      requestedToast: 'Export queued. Check back in a minute.',
    },
    emailPreferences: {
      cardTitle: 'Email preferences',
      cardBody: 'Choose which non-essential emails you want to receive.',
      marketingLabel: 'Promotional & marketing',
      digestLabel: 'Weekly study digest',
      productUpdatesLabel: 'Product updates',
      alwaysOnLabel: 'Security & receipts',
      alwaysOnHint:
        "Always sent — required for account security and payments. Can't be disabled.",
      savedToast: 'Preferences saved.',
    },
    mobile: {
      title: 'Mobile learning',
      nativeReady: 'This device can receive course reminders and deep links.',
      webReady:
        'Mobile reminders are ready when you open NexExam from the mobile app.',
      browser: 'Browser',
      smartReminders: 'Smart study reminders',
      smartRemindersDescription:
        'Use study-plan due dates, flashcards, streaks, and exam dates.',
      pushReminders: 'Push reminders',
      pushRemindersDescription:
        'Send reminders to your registered mobile device.',
      quietHoursStart: 'Quiet hours start',
      quietHoursEnd: 'Quiet hours end',
      save: 'Save mobile settings',
      requestPush: 'Enable push',
      syncNow: 'Sync now',
      saved: 'Mobile settings saved.',
      pushRequested: 'Push registration refreshed.',
    },
  },

  cookies: {
    bannerTitle: 'Cookies',
    bannerBody:
      "We use cookies to keep you signed in and run the Service. With your consent we'll also use analytics and marketing cookies.",
    acceptAll: 'Accept all',
    essentialOnly: 'Essential only',
    customize: 'Customize',
    customizeTitle: 'Cookie preferences',
    essentialLabel: 'Essential',
    essentialBody: 'Required to sign in and use the Service.',
    analyticsLabel: 'Analytics',
    analyticsBody:
      'Helps us understand how the Service is used. No personal data is sold.',
    marketingLabel: 'Marketing',
    marketingBody: 'Used to measure the impact of our outreach.',
    save: 'Save preferences',
  },

  signup: {
    dateOfBirthLabel: 'Date of birth',
    dateOfBirthHint:
      "Required by law. We use this only to verify you're 13 or older.",
    termsCheckboxLabel:
      'I agree to the [Terms of Service]({0}) and [Privacy Policy]({1}).',
    coppaBlockedTitle: "We can't create your account",
    coppaBlockedBody:
      'Accounts on this platform require an age of {0} or older. Family accounts with parental consent are coming soon.',
    termsRequiredError:
      'You must accept the Terms of Service and Privacy Policy to continue.',
    privacyRequiredError: 'You must accept the Privacy Policy to continue.',
    dobRequiredError: 'Please enter your date of birth.',
  },
};

export { dictionary };
