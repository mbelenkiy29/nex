const dictionary = {
  projectName: 'NexExam',

  shared: {
    showArchived: 'Afficher archivés?',
    viewArchived: 'Voir les archivés',
    archive: 'Archiver',
    restore: 'Restaurer',
    archived: 'Archivé',
    yes: 'Oui',
    no: 'Non',
    cancel: 'Annuler',
    save: 'Enregistrer',
    done: 'Terminé',
    clear: 'Effacer',
    accept: 'Accepter',
    dashboard: 'Tableau de bord',
    new: 'Nouveau',
    all: 'Tous',
    searchNotFound: 'Aucun résultat.',
    searchPlaceholder: 'Rechercher...',
    selectPlaceholder: 'Sélectionner une option',
    dateFormat: 'DD MMM YYYY',
    datetimeFormat: 'DD MMM YYYY HH:mm',
    tagsPlaceholder: 'Taper et appuyer sur Entrée pour ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    openMenu: 'Ouvrir le menu',
    search: 'Rechercher',
    reset: 'Réinitialiser',
    min: 'Min',
    max: 'Max',
    view: 'Voir',
    copiedToClipboard: 'Copié dans le presse-papiers',
    exportToCsv: 'Exporter en CSV',
    import: 'Importer',
    pause: 'Pause',
    discard: 'Abandonner',
    deleted: 'Supprimé',
    remove: 'Retirer',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    close: 'Fermer',
    loading: 'Chargement',
    toggleSidebar: 'Afficher/masquer la barre latérale',
    breadcrumb: "fil d'ariane",
    more: 'Plus',
    previousSlide: 'Diapositive précédente',
    nextSlide: 'Diapositive suivante',
    refresh: 'Actualiser',

    unsavedChanges: {
      title: 'Modifications non enregistrées',
      message:
        'Vous avez des modifications non enregistrées qui seront perdues si vous quittez cette page.',
      proceed: 'Abandonner',
      dismiss: 'Annuler',
      saveChanges: 'Enregistrer les modifications',
    },

    importer: {
      importHashAlreadyExists: 'Les données ont déjà été importées',
      title: 'Importer un fichier CSV',
      menu: 'Importer un fichier CSV',
      line: 'Ligne',
      status: 'Statut',
      pending: 'En attente',
      success: 'Importé',
      error: 'Erreur',
      importedMessage: `Traité {0} sur {1}.`,
      noValidRows: "Il n'y a pas de lignes valides.",
      noNavigateAwayMessage:
        "Ne quittez pas cette page ou l'importation sera arrêtée.",
      uploadFiles: 'Télécharger des fichiers',
      uploadFilesDisclaimer:
        "Cette importation contient des champs de fichiers. Les fichiers seront téléchargés lors de l'importation.",
      completed: {
        success:
          'Importation terminée. Toutes les lignes ont été importées avec succès.',
        someErrors:
          "Traitement terminé, mais certaines lignes n'ont pas pu être importées.",
        allErrors: "Échec de l'importation. Il n'y a pas de lignes valides.",
      },
      form: {
        downloadTemplate: 'Télécharger le modèle',
        description:
          'Téléchargez un fichier CSV pour importer des données. Vous pouvez télécharger le modèle pour voir le format requis.',
      },
      list: {
        newConfirm: 'Êtes-vous sûr?',
        discardConfirm:
          'Êtes-vous sûr? Les données non importées seront perdues.',
      },
      errors: {
        invalidFileEmpty: 'Le fichier est vide',
        fileRequired: 'Le fichier est requis',
        uploadFailed: 'Échec du téléchargement des fichiers',
        partialUpload: 'Seulement {0} sur {1} fichiers téléchargés',
      },
      fileUpload: {
        title: 'Téléchargement de fichiers',
        progress: 'Progression: {0} / {1}',
        uploading: '{0} en cours',
        completed: '{0} terminé',
        failed: '{0} échoué',
        rowLabel: 'Ligne {0} - {1}',
      },
    },

    dataTable: {
      filters: 'Filtres',
      noResults: 'Aucun résultat trouvé.',
      viewOptions: 'Affichage',
      toggleColumns: 'Afficher/masquer les colonnes',

      sortAscending: 'Asc',
      sortDescending: 'Desc',
      clearSort: 'Effacer',
      hide: 'Masquer',

      selectAll: 'Tout sélectionner',
      selectRow: 'Sélectionner la ligne',
      paginationRange: '{0}-{1} sur {2}',
      paginationSelected: '{0} sélectionné(s)',
      paginationRowsPerPage: 'par page',
      pagination: 'pagination',
      goToPreviousPage: 'Aller à la page précédente',
      goToNextPage: 'Aller à la page suivante',
      morePages: 'Plus de pages',
    },

    locales: {
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
      'pt-BR': 'Português (Brasil)',
      fr: 'Français',
    },

    localeSwitcher: {
      searchPlaceholder: 'Rechercher une langue...',
      title: 'Langue',
      placeholder: 'Sélectionner une langue',
      searchEmpty: 'Aucune langue trouvée.',
    },

    theme: {
      toggle: 'Thème',
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
    },

    errors: {
      previewMode: "Cette fonctionnalité n'est pas disponible en mode aperçu.",
      timezone: 'Fuseau horaire invalide',
      invalid: `{0} est invalide`,
      unknown: "Une erreur s'est produite",
      unique: `{0} doit être unique`,
      staleData:
        "L'enregistrement a été mis à jour par un autre utilisateur. Veuillez actualiser et réessayer.",
      copyToClipboard: 'Échec de la copie dans le presse-papiers',
      tooManyRequests: 'Trop de requêtes. Veuillez réessayer plus tard.',
    },
  },

  apiKey: {
    docs: {
      menu: 'Documentation API',
    },
    edit: {
      menu: 'Modifier la clé API',
      title: 'Modifier la clé API',
      success: 'Clé API mise à jour avec succès',
      error: 'Échec de la mise à jour de la clé API',
    },
    new: {
      menu: 'Nouvelle clé API',
      title: 'Nouvelle clé API',
      success: 'Clé API créée avec succès',
      error: 'Échec de la création de la clé API',
      warning: {
        title: 'Enregistrez votre clé API',
        message:
          "C'est la seule fois que vous verrez cette clé API. Veuillez la copier et la stocker en toute sécurité.",
      },
      restrictPermissions: 'Restreindre les permissions',
      allowAllPermissions: 'Autoriser toutes les permissions',
      permissionsDisclaimer:
        "Remarque: Vous devez avoir les permissions sélectionnées sur l'organisation pour qu'elles soient effectives.",
    },
    list: {
      menu: 'Clés API',
      title: 'Clés API',
      noResults: 'Aucune clé API trouvée.',
    },
    delete: {
      confirmTitle: 'Supprimer la clé API?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer cette clé API? Cette action ne peut pas être annulée.',
      success: 'Clé API supprimée avec succès',
    },
    enumerators: {
      status: {
        enabled: 'Activée',
        disabled: 'Désactivée',
      },
      remaining: {
        unlimited: 'Illimité',
      },
      lastUsed: {
        never: 'Jamais',
      },
      expiresAt: {
        never: 'Jamais',
      },
      permissions: {
        permission: 'permission',
        permissions: 'permissions',
        invalid: 'Invalide',
      },
    },
    fields: {
      apiKey: 'Clé API',
      member: 'Utilisateur',
      name: 'Nom',
      namePlaceholder: 'Ma clé API',
      keyPreview: 'Aperçu de la clé',
      expiresAt: 'Expire le',
      expiresAtPlaceholder: "N'expire jamais (laisser vide)",
      expiresAtMin:
        "La date d'expiration doit être au moins {0} jour(s) dans le futur",
      expiresAtMax:
        "La date d'expiration ne peut pas être supérieure à {0} jour(s) dans le futur",
      status: 'Statut',
      enabled: 'Activée',
      remaining: 'Restant',
      lastUsed: 'Dernière utilisation',
      createdAt: 'Créé le',
      permissions: 'Permissions',
      permissionsPlaceholder: 'Sélectionner les permissions',
      permissionsRequired: 'Au moins une permission est requise',
    },
    errors: {
      fetch: 'Échec de la récupération des clés API',
      delete: 'Échec de la suppression de la clé API',
      notFound: 'Clé API introuvable',
      permissionDenied: "Vous n'avez pas la permission d'accorder {0}:{1}",
      organizationRequired: "L'ID de l'organisation est requis",
      createFailed: 'Échec de la création de la clé API',
      listFailed: 'Échec de la liste des clés API',
    },
  },

  file: {
    button: 'Télécharger',
    delete: 'Supprimer',
    dropzone: {
      dragAndDrop: 'Glisser-déposer les fichiers ici',
      dropFiles: 'Déposer les fichiers ici',
      uploadFiles: 'Vous pouvez télécharger {0} fichier{1}.',
      upTo: "Jusqu'à {0}.",
      eachUpTo: "Chacun jusqu'à {0}.",
      accepted: '{0} accepté(s).',
      uploading: 'Téléchargement...',
      uploadSuccessful: 'Téléchargement réussi',
    },
    errors: {
      formats: `Format invalide. Doit être l'un de: {0}.`,
      notImage: `Le fichier doit être une image`,
      tooBig: `Le fichier est trop volumineux. La taille actuelle est {0} octets, la taille maximale est {1} octets`,
      invalidFilename: 'Nom de fichier invalide',
    },
  },

  dashboard: {
    searchLabel: "Rechercher du contenu d'apprentissage",
    searchPlaceholder: 'Rechercher des cours, sujets, ressources...',
    notifications: 'Notifications',
    learnerRole: 'Apprenant',
    superAdminRole: 'Super administrateur',
    fallbackName: 'Apprenant',
    viewSwitcher: {
      title: 'Changer de vue',
      superAdmin: 'Admin',
      student: 'Étudiant',
      creator: 'Professeur',
    },
    student: {
      menu: 'Tableau étudiant',
      role: 'Étudiant',
    },
    creator: {
      menu: 'Tableau créateur',
      role: 'Professeur créateur',
      welcome: 'Bon retour, {0}',
      title: 'Construisez votre parcours de professeur créateur',
      subtitle:
        'Demandez la vérification, suivez le statut et préparez des cours pour le catalogue NexExam.',
      applicationTitle: 'Statut de vérification',
      applicationEmpty:
        'Lancez votre candidature créateur afin que l’équipe NexExam examine vos références et votre spécialité.',
      applicationPending:
        'Votre candidature créateur est en cours d’examen. Vous pouvez mettre à jour les détails pendant l’évaluation.',
      applicationApproved:
        'Votre profil créateur est approuvé. La publication de cours contrôlée par les administrateurs reste active en phase 1.',
      applicationRejected:
        'Votre candidature nécessite des modifications avant approbation. Consultez les notes administrateur et renvoyez votre profil.',
      startApplication: 'Commencer la candidature',
      editApplication: 'Mettre à jour la candidature',
      workspaceTitle: 'Espace cours',
      workspaceBody:
        'La création de cours par les créateurs est séparée de l’apprentissage étudiant. La publication en libre-service ouvrira quand les flux de vérification seront stables.',
      reviewTitle: 'Examen administrateur',
      reviewBody:
        'Les super administrateurs NexExam examinent candidatures, qualité des cours, inscriptions et paiements depuis le tableau administrateur.',
      deferredTitle: 'Limite de phase 1',
      deferredBody:
        'La création par glisser-déposer et le partage automatique des revenus restent différés pendant la livraison du cycle d’inscription.',
      metricsTitle: 'Creator metrics',
      metricsBody:
        'Track enrollments, completion, AI usage, ratings, and earnings across your courses.',
    },
    welcome: 'Bon retour, {0}',
    heroTitle: 'Continuez votre parcours avec l’IA',
    heroSubtitle: 'Apprentissage personnalisé. Plus intelligent chaque jour.',
    continueLearning: 'Continuer l’apprentissage',
    askTutor: 'Demander au tuteur IA',
    viewAllCourses: 'Voir tous les cours',
    viewAll: 'Voir tout',
    recommendedForYou: 'Recommandé pour vous',
    aiTutorTitle: 'Tuteur IA',
    online: 'En ligne',
    aiTutorGreeting: 'Bonjour ! Je suis votre tuteur IA.',
    aiTutorPrompt: 'Comment puis-je vous aider aujourd’hui ?',
    tutorActions: [
      'Expliquer un concept',
      'Me tester sur ce sujet',
      'Recommander des ressources',
    ],
    learningProgress: 'Progression',
    thisWeek: 'Cette semaine',
    totalStudyTime: 'Temps total d’étude',
    noEnrolledCoursesTitle: 'Commencez votre premier cours',
    noEnrolledCoursesDescription:
      'Inscrivez-vous à un cours publié pour voir ici vos leçons, devoirs et progression avec le tuteur IA.',
    noRecommendationsTitle: 'Aucune recommandation pour le moment',
    noRecommendationsDescription:
      'Les nouveaux cours publiés apparaîtront ici dès qu’ils seront disponibles à l’inscription.',
    enrolledCoursesStat: 'Cours suivis',
    completedLessonsStat: 'Leçons terminées',
    submittedAssignmentsStat: 'Devoirs envoyés',
    averageProgressStat: 'Progression moyenne',
    lessonProgress: '{0} sur {1} leçons',
    assignmentProgress: '{0} sur {1} devoirs',
    progressComplete: '{0}% terminé',
    recommendationMeta: '{0} leçons • {1} devoirs',
    nextLesson: 'Prochaine leçon',
    noLessons: 'Toutes les leçons sont terminées',
    weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    courses: [
      {
        title: 'Introduction à l’intelligence artificielle',
        meta: 'Module 4 • Bases du machine learning',
        progress: '65%',
      },
      {
        title: 'Structures de données et algorithmes',
        meta: 'Module 3 • Arbres et graphes',
        progress: '40%',
      },
      {
        title: 'Fondamentaux du design UI/UX',
        meta: 'Module 2 • Principes de design',
        progress: '20%',
      },
    ],
    recommendations: [
      {
        title: 'Fondamentaux du deep learning',
        meta: 'Cours • Intermédiaire',
        rating: '4.8 (320)',
      },
      {
        title: 'SQL pour l’analyse de données',
        meta: 'Cours • Débutant',
        rating: '4.7 (210)',
      },
      {
        title: 'Masterclass de programmation Python',
        meta: 'Cours • Débutant',
        rating: '4.9 (421)',
      },
    ],
  },

  studentExperience: {
    menu: {
      myCourses: 'Mes cours',
      practice: 'Entraînement',
      notesStudyPlan: "Notes / Plan d'étude",
      aiTutor: 'AI Tutor',
      courseOverview: 'Aperçu du cours',
    },
    title: 'Tableau de bord étudiant',
    subtitle:
      "Restez concentré sur la prochaine leçon, les devoirs, l'entraînement et l'aide IA pour vos cours inscrits.",
    heroTitle: 'Votre prochain meilleur pas de révision est prêt',
    heroSubtitle:
      'NexExam regroupe progression, devoirs, entraînement, notes et niveau de préparation au même endroit.',
    continueLesson: 'Continuer la leçon',
    continueCourse: 'Continuer le cours',
    askCourseTutor: 'Demander au tuteur du cours',
    openCourseOverview: "Ouvrir l'aperçu",
    startPractice: "Commencer l'entraînement",
    continuePractice: "Continuer l'entraînement",
    completePractice: "Terminer l'entraînement",
    submitAnswer: 'Envoyer la réponse',
    viewCoursePlayer: 'Ouvrir le lecteur',
    addNote: 'Ajouter une note',
    saveNote: 'Enregistrer la note',
    addStudyPlanItem: "Ajouter une tâche d'étude",
    saveStudyPlanItem: "Enregistrer la tâche d'étude",
    markComplete: 'Marquer comme terminé',
    readinessScore: "Score de préparation à l'examen",
    readinessInsufficient:
      "Besoin de plus d'entraînement ou de données d'examen",
    readinessReady: 'Données suffisantes disponibles',
    myCourses: 'Mes cours',
    upcomingHomework: 'Devoirs à venir',
    practiceQuestions: "Questions d'entraînement",
    notesAndStudyPlan: "Notes + Plan d'étude",
    recentNotes: 'Notes récentes',
    todayPlan: "Plan d'aujourd'hui",
    progress: 'Progression',
    homework: 'Devoirs',
    notes: 'Notes',
    studyPlan: "Plan d'étude",
    mobile: {
      savedOffline:
        'Enregistré hors ligne. La synchronisation se fera au retour en ligne.',
      syncFailed: 'La synchronisation a échoué',
      continueLearning: 'Continuer à apprendre',
      offlineStatus: {
        online: 'En ligne',
        offline:
          'Mode hors ligne : les changements sont enregistrés sur cet appareil.',
        syncing: 'Synchronisation du travail mobile enregistré...',
        synced: 'Travail mobile synchronisé.',
        failed:
          'Une partie du travail mobile nécessite une nouvelle synchronisation.',
      },
    },
    adaptivePlan: {
      title: "Plan d'etude adaptatif",
      body: 'Definissez votre objectif et NexExam transforme votre niveau, vos points faibles, vos devoirs et votre pratique en taches ciblees.',
      badge: "Guide par l'IA",
      examNameLabel: 'Examen ou objectif',
      examNamePlaceholder: 'Certification, examen final ou resultat vise',
      targetExamDateLabel: "Date cible de l'examen",
      weakAreasLabel: 'Points faibles actuels',
      noWeakAreas: 'Terminez des exercices pour reveler vos points faibles.',
      generate: 'Generer le plan adaptatif',
      regenerate: 'Actualiser le plan adaptatif',
      itemsCreated: '{0} tache(s) adaptative(s) ajoutee(s).',
      itemTitles: {
        diagnostic: 'Terminez votre diagnostic initial',
        weakArea: 'Renforcer le point faible : {0}',
        homework: 'Terminer le devoir : {0}',
        lesson: 'Continuer la lecon : {0}',
        practice: 'Questions de pratique pour {0}',
        maintain: 'Maintenir la preparation pour {0}',
      },
      itemDescriptions: {
        diagnostic:
          'Repondez aux questions de pratique pour {0} afin qu NexExam calibre votre niveau.',
        weakArea:
          'Revoyez les explications et refaites une pratique ciblee sur {0}.',
        homework:
          'Terminez ou revisez {0} avant d ajouter de nouveaux contenus.',
        lesson: 'Avancez dans {0} et marquez la lecon comme terminee.',
        practice:
          'Utilisez une session de pratique ciblee pour confirmer votre maitrise de {0}.',
        maintain:
          'Gardez le rythme avec une courte revision, des notes et une pratique pour {0}.',
      },
    },
    learningOutcomes: {
      title: "Resultats d'apprentissage",
      body: 'Utilisez diagnostics, maitrise, rappel, remediation et simulation pour transformer la progression en preparation mesurable.',
      badge: 'Moteur de resultats',
      summary: {
        masteryAverage: 'Moyenne de maitrise',
        dueFlashcards: 'Cartes dues',
        streak: "Serie d'etude",
        mockExam: 'Examen blanc',
      },
      diagnostic: {
        title: 'Diagnostic adaptatif',
        body: 'Lancez une base de depart pour que NexExam cartographie vos domaines forts et faibles.',
        start: 'Lancer le diagnostic',
        restart: 'Refaire le diagnostic',
        submit: 'Enregistrer la reponse',
        complete: 'Terminer le diagnostic',
        answered: '{0} sur {1} repondues',
        lastScore: 'Dernier diagnostic : {0}% sur {1} questions',
        noQuestions:
          'Ajoutez des questions approuvees avant de lancer un diagnostic.',
      },
      mastery: {
        title: 'Carte de maitrise par domaine',
        empty:
          'Terminez des diagnostics, exercices ou examens blancs pour creer une carte de maitrise.',
        evidence: '{0} point(s) de preuve',
        confidence: {
          low: 'Confiance faible',
          medium: 'Confiance moyenne',
          high: 'Confiance elevee',
        },
        actions: {
          diagnose: 'Une base diagnostique est necessaire.',
          remediate: 'Priorisez la remediation avant les nouvelles lecons.',
          practice: 'Pratiquez jusqu a stabiliser le score.',
          maintain: 'Maintenir avec une revision espacee.',
        },
      },
      flashcards: {
        title: 'Repetition espacee',
        dueCount: '{0} sur {1} carte(s) dues',
        nextDue: 'Prochaine echeance {0}',
        inSet: 'Depuis {0}',
        flip: 'Retourner la carte',
        empty: 'Aucune carte due pour le moment.',
        openPlayer: 'Ouvrir les cartes',
        ratings: {
          again: 'Encore',
          hard: 'Difficile',
          good: 'Bien',
          easy: 'Facile',
        },
      },
      streak: {
        dayCount: '{0} jour(s)',
      },
      remediation: {
        title: 'Remediation des points faibles',
        body: 'Generez un plan court cible sur le domaine qui freine le plus votre preparation.',
        generate: 'Generer le plan de remediation',
        refresh: 'Actualiser le plan de remediation',
        noWeakDomains: 'Aucun domaine faible detecte pour le moment.',
        planTitle: 'Sprint de remediation : {0}',
        planDescription: 'Revision, pratique et rappel cibles pour {0}.',
        itemsCreated: '{0} tache(s) de remediation ajoutee(s).',
        itemTitles: {
          review: 'Revoir les bases : {0}',
          practice: 'Pratiquer le domaine faible : {0}',
          recall: 'Controle de rappel : {0}',
        },
        itemDescriptions: {
          review: 'Revenez aux lecons, notes et explications liees a {0}.',
          practice:
            'Repondez a des questions ciblees et revoyez les erreurs pour {0}.',
          recall:
            'Utilisez des cartes ou un court auto-controle pour confirmer la retention de {0}.',
        },
      },
      schedule: {
        title: "Calendrier d'etude",
        empty: "Aucune tache d'etude planifiee pour le moment.",
        flashcardsTitle: '{0} carte(s) dues',
      },
      mockExams: {
        title: "Simulation d'examen",
        noExams: 'Aucun examen blanc pret pour ce cours.',
        available: 'Disponibles',
        simulations: 'Simulations',
        bestScore: 'Meilleur score',
        lastScore: 'Dernier score',
        openPlayer: 'Ouvrir les examens blancs',
      },
    },
    noCoursesTitle: 'Inscrivez-vous à votre premier cours',
    noCoursesBody:
      'Les cours publiés auxquels vous vous inscrivez apparaîtront ici avec progression, devoirs, entraînement et contexte du tuteur IA.',
    noHomework: 'Aucun devoir à venir.',
    noPractice:
      "Aucune question d'entraînement n'est encore prête pour ce cours.",
    noNotes: 'Aucune note pour le moment.',
    noStudyPlan: "Aucune tâche dans le plan d'étude pour le moment.",
    emptyPracticeAttempt:
      "Démarrez une session d'entraînement pour répondre aux questions du cours.",
    noteTitlePlaceholder: 'Titre de la note',
    noteContentPlaceholder: 'Que voulez-vous retenir ?',
    studyPlanTitlePlaceholder: "Tâche d'étude",
    studyPlanDescriptionPlaceholder: 'Détails facultatifs',
    plannedForDate: 'Date planifiée',
    answerOptions: 'Options de réponse',
    selectedAnswer: 'Réponse sélectionnée',
    correctAnswer: 'Bonne réponse',
    explanation: 'Explication',
    score: '{0}%',
    lessonsProgress: '{0} leçons sur {1} terminées',
    answeredProgress: '{0} réponses sur {1}',
    homeworkProgress: '{0} terminés • {1} ouverts',
    practiceAccuracy: '{0}% de précision',
    attemptsCount: '{0} tentative(s)',
    availableQuestionCount: '{0} question(s) disponible(s)',
    nextAction: {
      lesson: 'Continuer {0}',
      homework: 'Terminer le devoir : {0}',
      practice: "S'entraîner sur {0}",
      none: 'Explorer les cours',
    },
    homeworkStatus: {
      open: 'Ouvert',
      dueSoon: 'Bientôt dû',
      overdue: 'En retard',
      submitted: 'Envoyé',
      complete: 'Terminé',
      needsRevision: 'À réviser',
    },
    practiceStatus: {
      active: 'En cours',
      completed: 'Terminé',
    },
    signals: {
      courseProgress: 'Progression du cours',
      homework: 'Devoirs',
      practice: 'Entraînement',
      exam: "Tentatives d'examen",
      recentActivity: 'Activité récente',
    },
    suggestions: {
      lesson: 'Réviser la leçon : {0}',
      homework: 'Travailler le devoir : {0}',
      practice: "Questions d'entraînement pour {0}",
    },
    aiPrompts: [
      'Explique ma prochaine leçon',
      'Interroge-moi sur ce cours',
      "Crée un plan d'étude",
    ],
    success: {
      noteSaved: 'Note enregistrée.',
      studyPlanSaved: "Tâche d'étude enregistrée.",
      studyPlanUpdated: "Plan d'étude mis à jour.",
      adaptivePlanGenerated: "Plan d'etude adaptatif mis a jour.",
      diagnosticStarted: 'Diagnostic lance.',
      diagnosticCompleted: 'Diagnostic termine.',
      flashcardReviewed: 'Revision de carte enregistree.',
      remediationGenerated: 'Plan de remediation ajoute.',
      answerSaved: 'Réponse enregistrée.',
      practiceCompleted: 'Entraînement terminé.',
    },
    errors: {
      noPractice: "Aucune question d'entraînement disponible pour ce cours.",
      practiceComplete: "Cette tentative d'entraînement est déjà terminée.",
      invalidAnswer: 'Choisissez une option de réponse valide.',
      diagnosticIncomplete:
        'Repondez a toutes les questions du diagnostic avant de terminer.',
    },
  },

  auth: {
    layout: {
      brandName: 'NexExam',
      heroTitle: 'Débloquez votre apprentissage spatial.',
      heroSubtitle:
        'La prochaine génération de l’éducation, conçue pour le web spatial. Plus intelligente, intuitive et parfaitement à vous.',
      authTabsLabel: 'Options d’authentification',
      aiTutorTitle: 'Tuteur IA',
      aiTutorDescription: 'Toujours disponible',
      flowStateTitle: 'Mode concentration',
      flowStateDescription: 'Sans distraction',
      insightsTitle: 'Analyses',
      insightsDescription: 'Métriques en temps réel',
      secureFooter: 'Protégé par un chiffrement avancé.',
    },
    signIn: {
      oauthError:
        'Impossible de se connecter avec ce fournisseur. Veuillez en utiliser un autre.',
      title: 'Se connecter',
      cardTitle: 'Bon retour',
      cardSubtitle:
        'Saisissez vos informations pour accéder à votre tableau de bord.',
      menu: 'Se connecter',
      button: 'Se connecter avec email',
      success: 'Connexion réussie',
      signingIn: 'Connexion...',
      email: 'Email',
      password: 'Mot de passe',
      socialHeader: 'Ou continuer avec',
      google: 'Google',
      passwordResetRequestLink: 'Mot de passe oublié?',
      signUpLink: `Pas de compte? Créer un compte`,
      studentSignUpLink: `Besoin d’un compte étudiant? Inscrivez-vous comme étudiant`,
      creatorSignUpLink: `Vous voulez enseigner? Inscrivez-vous comme créateur`,
    },
    signUp: {
      title: "S'inscrire",
      menu: "S'inscrire",
      studentMenu: 'Inscription étudiant',
      creatorMenu: 'Inscription créateur',
      studentTab: 'Étudiant',
      creatorTab: 'Créateur',
      studentTitle: 'Inscription étudiant',
      creatorTitle: 'Inscription créateur',
      studentCardTitle: 'Rejoindre comme étudiant',
      creatorCardTitle: 'Rejoindre comme créateur',
      cardSubtitle: 'Créez un compte pour commencer votre parcours.',
      studentSubtitle:
        'Inscrivez-vous aux cours de préparation, terminez les leçons, rendez les devoirs et étudiez avec l’aide de l’IA.',
      creatorSubtitle:
        'Demandez à devenir professeur vérifié et préparez la publication de cours NexExam après approbation.',
      signInLink: 'Vous avez déjà un compte? Se connecter',
      button: "S'inscrire",
      success: 'Inscription réussie',
      email: 'Email',
      password: 'Mot de passe',
      invitationEmailLocked:
        'Cet email est verrouillé car vous vous inscrivez via une invitation.',
    },
    verifyEmailRequest: {
      title: "Renvoyer la vérification d'email",
      button: "Renvoyer la vérification d'email",
      message:
        'Veuillez confirmer votre email à <strong>{0}</strong> pour continuer.',
      success: 'Email de vérification envoyé avec succès!',
      noEmail:
        'Aucune adresse email fournie. Veuillez vous inscrire ou vous connecter.',
    },
    verifyEmailConfirm: {
      title: "Vérifier l'email",
      success: 'Email vérifié avec succès.',
      loadingMessage: 'Un instant, votre email est en cours de vérification...',
    },
    passwordResetRequest: {
      title: 'Mot de passe oublié',
      signInLink: 'Annuler',
      button: "Envoyer l'email de réinitialisation",
      email: 'Email',
      success: 'Email de réinitialisation du mot de passe envoyé avec succès',
    },
    passwordResetConfirm: {
      title: 'Réinitialiser le mot de passe',
      signInLink: 'Annuler',
      button: 'Réinitialiser le mot de passe',
      password: 'Mot de passe',
      success: 'Mot de passe modifié avec succès',
    },
    noPermissions: {
      title: 'Aucune permission',
      message:
        "Vous n'avez pas encore de permissions. Veuillez attendre que l'administrateur vous accorde des privilèges.",
    },
    invitation: {
      title: 'Invitation',
      success: 'Invitation acceptée avec succès',
      loadingMessage: "Un instant, nous acceptons l'invitation...",
      invalidToken: "Jeton d'invitation expiré ou invalide.",
      errors: {
        INVITATION_EMAIL_MISMATCH:
          'Cette invitation a été envoyée à une autre adresse email. Veuillez vous connecter avec le bon compte.',
        INVITATION_EXPIRED: 'Cette invitation a expiré',
        INVITATION_NOT_PENDING:
          'Cette invitation a déjà été acceptée ou annulée',
      },
    },
    organization: {
      title: 'Organisation',
      create: {
        name: "Nom de l'organisation",
        success: 'Organisation créée avec succès',
        button: "Créer l'organisation",
      },
      select: {
        organization: 'Sélectionner une organisation',
        joinSuccess: 'Organisation rejointe avec succès',
        select: "Sélectionner l'organisation",
        continue: 'Continuer',
        autoSelecting: "Sélection de l'organisation...",
      },
      invitationAccepted: 'Invitation acceptée avec succès',
      invitationAcceptError: "Échec de l'acceptation de l'invitation",
      acceptingInvitation: "Acceptation de l'invitation...",
      invitationRejected: 'Invitation rejetée',
      invitationRejectError: "Échec du rejet de l'invitation",
      rejectingInvitation: "Rejet de l'invitation...",
      rejectInvitation: 'Rejeter',
      rejectInvitationTitle: "Rejeter l'invitation?",
      rejectInvitationDescription:
        'Êtes-vous sûr de vouloir rejeter cette invitation? Cette action ne peut pas être annulée.',
      invitations: 'Invitations',
      pendingInvitation: 'Invitation en attente',
    },
    passwordChange: {
      title: 'Changer le mot de passe',
      menu: 'Changer le mot de passe',
      oldPassword: 'Ancien mot de passe',
      newPassword: 'Nouveau mot de passe',
      newPasswordConfirmation: 'Confirmation du nouveau mot de passe',
      button: 'Enregistrer le mot de passe',
      success: 'Mot de passe modifié avec succès',
      mustMatch: 'Les mots de passe doivent correspondre',
      cancel: 'Annuler',
    },
    emailChange: {
      title: "Changer l'email",
      menu: "Changer l'email",
      newEmail: 'Nouvel email',
      button: "Changer l'email",
      success:
        'Email de vérification envoyé. Vérifiez votre email actuel pour approuver.',
      confirmSuccess: 'Email modifié avec succès',
      confirmStepTwo:
        'Nous avons envoyé un email de vérification à <strong>{0}</strong>. Veuillez vérifier votre boîte de réception pour finaliser le changement.',
      cancel: 'Annuler',
      loadingMessage:
        "Un instant, votre changement d'email est en cours de confirmation...",
    },
    emailChangeConfirm: {
      title: "Confirmer le changement d'email",
      confirmSuccess: 'Email modifié avec succès',
      loadingMessage:
        "Un instant, votre changement d'email est en cours de confirmation...",
    },
    profile: {
      title: 'Profil',
      menu: 'Profil',
      email: 'Email actuel',
      firstName: 'Prénom',
      lastName: 'Nom',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Activer les notifications',
      isNotificationsEnabledHint:
        'Recevoir des notifications par email et push pour les mises à jour et activités importantes dans votre organisation',
      button: 'Enregistrer le profil',
      success: 'Profil enregistré avec succès',
      cancel: 'Annuler',
    },
    profileOnboard: {
      firstName: 'Prénom',
      lastName: 'Nom',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Activer les notifications',
      isNotificationsEnabledHint:
        'Recevoir des notifications par email et push pour les mises à jour et activités importantes',
      button: 'Enregistrer le profil',
      success: 'Profil enregistré avec succès',
    },
    signOut: {
      menu: 'Se déconnecter',
      button: 'Se déconnecter',
      title: 'Se déconnecter',
      loading: `Déconnexion en cours...`,
    },
    errors: {
      invalidPasswordResetToken:
        'Le lien de réinitialisation du mot de passe est invalide ou a expiré',
      invalidVerifyEmailToken:
        "Le lien de vérification d'email est invalide ou a expiré",

      USER_NOT_FOUND: 'Utilisateur introuvable',
      FAILED_TO_CREATE_USER: "Échec de la création de l'utilisateur",
      FAILED_TO_CREATE_SESSION: 'Échec de la création de la session',
      FAILED_TO_UPDATE_USER: "Échec de la mise à jour de l'utilisateur",
      FAILED_TO_GET_SESSION: 'Échec de la récupération de la session',
      INVALID_PASSWORD: 'Mot de passe invalide',
      INVALID_EMAIL: 'Email invalide',
      INVALID_EMAIL_OR_PASSWORD: 'Email ou mot de passe invalide',
      SOCIAL_ACCOUNT_ALREADY_LINKED: 'Compte social déjà lié',
      PROVIDER_NOT_FOUND: 'Fournisseur introuvable',
      INVALID_TOKEN: 'Jeton invalide',
      ID_TOKEN_NOT_SUPPORTED: "Jeton d'ID non supporté",
      FAILED_TO_GET_USER_INFO:
        'Échec de la récupération des informations utilisateur',
      USER_EMAIL_NOT_FOUND: 'Email utilisateur introuvable',
      EMAIL_NOT_VERIFIED: 'Email non vérifié',
      CANNOT_REMOVE_ADMIN_WITH_SUBSCRIPTION:
        "Impossible de supprimer l'administrateur ou de retirer le rôle d'administrateur tant que l'organisation a un abonnement actif",
      CANNOT_REMOVE_SELF: "Vous ne pouvez pas vous retirer de l'organisation",
      PASSWORD_TOO_SHORT: 'Mot de passe trop court',
      PASSWORD_TOO_LONG: 'Mot de passe trop long',
      USER_ALREADY_EXISTS: "L'utilisateur existe déjà",
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        "L'utilisateur existe déjà. Utilisez un autre email",
      EMAIL_CAN_NOT_BE_UPDATED: "L'email ne peut pas être mis à jour",
      CREDENTIAL_ACCOUNT_NOT_FOUND: "Compte d'identification introuvable",
      SESSION_EXPIRED: 'Session expirée',
      FAILED_TO_UNLINK_LAST_ACCOUNT:
        'Échec de la dissociation du dernier compte',
      ACCOUNT_NOT_FOUND: 'Compte introuvable',
      USER_ALREADY_HAS_PASSWORD: "L'utilisateur a déjà un mot de passe",
      INVALID_METADATA_TYPE: 'Type de métadonnées invalide',
      REFILL_AMOUNT_AND_INTERVAL_REQUIRED:
        'Montant et intervalle de recharge requis',
      REFILL_INTERVAL_AND_AMOUNT_REQUIRED:
        'Intervalle et montant de recharge requis',
      USER_BANNED: 'Utilisateur banni',
      UNAUTHORIZED_SESSION: 'Session non autorisée',
      KEY_NOT_FOUND: 'Clé introuvable',
      KEY_DISABLED: 'Clé désactivée',
      KEY_EXPIRED: 'Clé expirée',
      USAGE_EXCEEDED: 'Utilisation dépassée',
      KEY_NOT_RECOVERABLE: 'Clé non récupérable',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION:
        "Vous n'êtes pas autorisé à créer une nouvelle organisation",
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS:
        "Vous avez atteint le nombre maximum d'organisations",
      ORGANIZATION_ALREADY_EXISTS: "L'organisation existe déjà",
      ORGANIZATION_NOT_FOUND: 'Organisation introuvable',
      USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION:
        "L'utilisateur n'est pas membre de l'organisation",
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION:
        "Vous n'êtes pas autorisé à mettre à jour cette organisation",
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION:
        "Vous n'êtes pas autorisé à supprimer cette organisation",
      NO_ACTIVE_ORGANIZATION: 'Aucune organisation active',
      USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION:
        "L'utilisateur est déjà membre de cette organisation",
      MEMBER_NOT_FOUND: 'Membre introuvable',
      ROLE_NOT_FOUND: 'Rôle introuvable',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM:
        "Vous n'êtes pas autorisé à créer une nouvelle équipe",
      TEAM_ALREADY_EXISTS: "L'équipe existe déjà",
      TEAM_NOT_FOUND: 'Équipe introuvable',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER:
        "Vous ne pouvez pas quitter l'organisation en tant que seul administrateur",
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER:
        "Vous ne pouvez pas quitter l'organisation sans propriétaire",
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER:
        "Vous n'êtes pas autorisé à supprimer ce membre",
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION:
        "Vous n'êtes pas autorisé à inviter des utilisateurs dans cette organisation",
      USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION:
        "L'utilisateur est déjà invité dans cette organisation",
      INVITATION_NOT_FOUND: 'Invitation introuvable',
      INVITATION_EMAIL_MISMATCH:
        'Cette invitation a été envoyée à une autre adresse email. Veuillez vous connecter avec le bon compte.',
      INVITATION_EXPIRED: 'Cette invitation a expiré',
      INVITATION_NOT_PENDING: 'Cette invitation a déjà été acceptée ou annulée',
      YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION:
        "Vous n'êtes pas le destinataire de l'invitation",
      EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION:
        "Vérification d'email requise avant d'accepter ou de rejeter l'invitation",
      YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION:
        "Vous n'êtes pas autorisé à annuler cette invitation",
      INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION:
        "L'invitant n'est plus membre de l'organisation",
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE:
        "Vous n'êtes pas autorisé à inviter un utilisateur avec ce rôle",
      FAILED_TO_RETRIEVE_INVITATION: "Échec de la récupération de l'invitation",
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS:
        "Vous avez atteint le nombre maximum d'équipes",
      UNABLE_TO_REMOVE_LAST_TEAM: 'Impossible de retirer la dernière équipe',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER:
        "Vous n'êtes pas autorisé à mettre à jour ce membre",
      ORGANIZATION_MEMBERSHIP_LIMIT_REACHED:
        "Limite d'adhésion à l'organisation atteinte",
      YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION:
        "Vous n'êtes pas autorisé à créer des équipes dans cette organisation",
      YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION:
        "Vous n'êtes pas autorisé à supprimer des équipes dans cette organisation",
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM:
        "Vous n'êtes pas autorisé à mettre à jour cette équipe",
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM:
        "Vous n'êtes pas autorisé à supprimer cette équipe",
      INVITATION_LIMIT_REACHED: "Limite d'invitations atteinte",
      YOU_CANNOT_BAN_YOURSELF: 'Vous ne pouvez pas vous bannir vous-même',
      YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE:
        "Vous n'êtes pas autorisé à changer le rôle des utilisateurs",
      YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS:
        "Vous n'êtes pas autorisé à créer des utilisateurs",
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS:
        "Vous n'êtes pas autorisé à lister les utilisateurs",
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS:
        "Vous n'êtes pas autorisé à lister les sessions des utilisateurs",
      YOU_ARE_NOT_ALLOWED_TO_BAN_USERS:
        "Vous n'êtes pas autorisé à bannir des utilisateurs",
      YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS:
        "Vous n'êtes pas autorisé à vous faire passer pour des utilisateurs",
      YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS:
        "Vous n'êtes pas autorisé à révoquer les sessions des utilisateurs",
      YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS:
        "Vous n'êtes pas autorisé à supprimer des utilisateurs",
      YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD:
        "Vous n'êtes pas autorisé à définir le mot de passe des utilisateurs",
      BANNED_USER: 'Vous avez été banni de cette application',
      YOU_ARE_NOT_ALLOWED_TO_GET_USER:
        "Vous n'êtes pas autorisé à obtenir l'utilisateur",
      NO_DATA_TO_UPDATE: 'Aucune donnée à mettre à jour',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS:
        "Vous n'êtes pas autorisé à mettre à jour les utilisateurs",
      YOU_CANNOT_REMOVE_YOURSELF: 'Vous ne pouvez pas vous retirer vous-même',
      COULD_NOT_CREATE_SESSION: 'Impossible de créer la session',
      ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY:
        'Les utilisateurs anonymes ne peuvent pas se reconnecter de manière anonyme',
      CHALLENGE_NOT_FOUND: 'Challenge introuvable',
      YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY:
        "Vous n'êtes pas autorisé à enregistrer cette clé d'accès",
      FAILED_TO_VERIFY_REGISTRATION:
        "Échec de la vérification de l'inscription",
      PASSKEY_NOT_FOUND: "Clé d'accès introuvable",
      AUTHENTICATION_FAILED: "Échec de l'authentification",
      UNABLE_TO_CREATE_SESSION: 'Impossible de créer la session',
      FAILED_TO_UPDATE_PASSKEY: "Échec de la mise à jour de la clé d'accès",
      INVALID_PHONE_NUMBER: 'Numéro de téléphone invalide',
      PHONE_NUMBER_EXIST: 'Le numéro de téléphone existe',
      INVALID_PHONE_NUMBER_OR_PASSWORD:
        'Numéro de téléphone ou mot de passe invalide',
      UNEXPECTED_ERROR: 'Erreur inattendue',
      OTP_NOT_FOUND: 'OTP introuvable',
      OTP_EXPIRED: 'OTP expiré',
      INVALID_OTP: 'OTP invalide',
      PHONE_NUMBER_NOT_VERIFIED: 'Numéro de téléphone non vérifié',
      INVALID_DEVICE_CODE: "Code d'appareil invalide",
      EXPIRED_DEVICE_CODE: "Code d'appareil expiré",
      EXPIRED_USER_CODE: 'Code utilisateur expiré',
      AUTHORIZATION_PENDING: 'Autorisation en attente',
      ACCESS_DENIED: 'Accès refusé',
      INVALID_USER_CODE: 'Code utilisateur invalide',
      DEVICE_CODE_ALREADY_PROCESSED: "Code d'appareil déjà traité",
      POLLING_TOO_FREQUENTLY: 'Interrogation trop fréquente',
      INVALID_DEVICE_CODE_STATUS: "Statut du code d'appareil invalide",
      AUTHENTICATION_REQUIRED: 'Authentification requise',
      OTP_NOT_ENABLED: 'OTP non activé',
      OTP_HAS_EXPIRED: 'OTP a expiré',
      TOTP_NOT_ENABLED: 'TOTP non activé',
      TWO_FACTOR_NOT_ENABLED: 'Double authentification non activée',
      BACKUP_CODES_NOT_ENABLED: 'Codes de secours non activés',
      INVALID_BACKUP_CODE: 'Code de secours invalide',
      INVALID_CODE: 'Code invalide',
      TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE:
        'Trop de tentatives. Demander un nouveau code',
      INVALID_TWO_FACTOR_COOKIE: 'Cookie de double authentification invalide',
      INVALID_USERNAME_OR_PASSWORD:
        "Nom d'utilisateur ou mot de passe invalide",
      USERNAME_IS_ALREADY_TAKEN: "Le nom d'utilisateur est déjà pris",
      USERNAME_TOO_SHORT: "Nom d'utilisateur trop court",
      USERNAME_TOO_LONG: "Nom d'utilisateur trop long",
      INVALID_USERNAME: "Nom d'utilisateur invalide",
      INVALID_DISPLAY_USERNAME: "Nom d'affichage invalide",
      TOO_MANY_ATTEMPTS: 'Trop de tentatives',
      PASSWORD_COMPROMISED: 'Mot de passe compromis',
      INVALID_OAUTH_CONFIGURATION: 'Configuration OAuth invalide',
      INVALID_SESSION_TOKEN: 'Jeton de session invalide',

      EXPIRES_IN_IS_TOO_SMALL:
        "La date d'expiration est inférieure à la valeur minimale prédéfinie.",
      EXPIRES_IN_IS_TOO_LARGE:
        "La date d'expiration est supérieure à la valeur maximale prédéfinie.",
      INVALID_REMAINING: 'Le nombre restant est trop grand ou trop petit.',
      INVALID_PREFIX_LENGTH:
        'La longueur du préfixe est trop grande ou trop petite.',
      INVALID_NAME_LENGTH: 'La longueur du nom est trop grande ou trop petite.',
      METADATA_DISABLED: 'Les métadonnées sont désactivées.',
      RATE_LIMIT_EXCEEDED: 'Limite de taux dépassée.',
      NO_VALUES_TO_UPDATE: 'Aucune valeur à mettre à jour.',
      KEY_DISABLED_EXPIRATION:
        "Les valeurs d'expiration de clé personnalisées sont désactivées.",
      INVALID_API_KEY: 'Clé API invalide.',
      INVALID_USER_ID_FROM_API_KEY:
        "L'ID utilisateur de la clé API est invalide.",
      INVALID_API_KEY_GETTER_RETURN_TYPE:
        'Le getter de clé API a retourné un type de clé invalide. Chaîne attendue.',
      SERVER_ONLY_PROPERTY:
        "La propriété que vous essayez de définir ne peut être définie qu'à partir de l'instance d'authentification du serveur uniquement.",
      FAILED_TO_UPDATE_API_KEY: 'Échec de la mise à jour de la clé API',
      NAME_REQUIRED: 'Le nom de la clé API est requis.',
    },
  },

  organization: {
    switcher: {
      title: 'Organisations',
      create: 'Créer une organisation',
      leave: "Quitter l'organisation",
      leaveConfirmTitle: "Quitter l'organisation?",
      leaveConfirmDescription:
        "Êtes-vous sûr de vouloir quitter {0}? Vous perdrez l'accès à toutes les ressources de cette organisation.",
      leaveSuccess: 'Organisation quittée avec succès',
      leaveError: "Échec de la sortie de l'organisation",
    },

    invitation: {
      title: `Accepter l'invitation à {0}`,
      message: `Vous avez été invité à {0}. Vous pouvez choisir d'accepter ou de refuser.`,
    },

    applicationSettings: {
      menu: `Paramètres de l'application`,
    },

    form: {
      name: 'Nom',
      subdomain: 'Sous-domaine',
      domain: 'Domaine',
      slugPlaceholderDomain: 'organisation.com',
      slugPlaceholderSubdomain: 'organisation',
      slugInvalidSubdomain:
        'Le sous-domaine doit contenir uniquement des lettres minuscules, des chiffres et des tirets. Il ne peut pas commencer ou se terminer par un tiret.',
      slugInvalidDomain:
        'Le domaine doit être au format valide (ex: exemple.com). Il doit contenir au moins un point et ne peut contenir que des lettres minuscules, des chiffres, des tirets et des points.',
      slugReserved:
        "Ce slug est réservé pour l'application et ne peut pas être utilisé",
      logoLight: 'Logo (Mode clair)',
      logoDark: 'Logo (Mode sombre)',
      backgroundImageLight: 'Image de fond (Mode clair)',
      backgroundImageDark: 'Image de fond (Mode sombre)',

      new: {
        title: 'Créer une organisation',
        success: 'Organisation créée avec succès',
      },

      edit: {
        title: "Modifier l'organisation",
        success: 'Organisation mise à jour avec succès',
      },
    },

    delete: {
      success: 'Organisation supprimée avec succès',
      confirmTitle: "Supprimer l'organisation?",
      confirmDescription:
        "Êtes-vous sûr de vouloir supprimer l'organisation {0}? Cette action est irréversible!",
    },

    errors: {
      notFound: 'Organisation introuvable',
      createFailed: "Échec de la création de l'organisation",
      updateFailed: "Échec de la mise à jour de l'organisation",
      deleteFailed: "Échec de la suppression de l'organisation",
      leaveFailed: "Échec de la sortie de l'organisation",
      setActiveFailed: "Échec de la définition de l'organisation active",
    },
  },

  member: {
    dashboardCard: {
      title: 'Utilisateurs',
    },

    view: {
      title: "Voir l'utilisateur",
    },

    showActivity: 'Activité',

    list: {
      menu: 'Utilisateurs',
      title: 'Utilisateurs',
      noResults: 'Aucun utilisateur trouvé.',
      empty:
        "Vous n'avez pas encore créé d'utilisateurs. Commencez par créer votre premier utilisateur.",
    },

    importer: {
      title: 'Importer des utilisateurs',
      menu: 'Importer des utilisateurs',
    },

    export: {
      success: 'Utilisateurs exportés avec succès',
    },

    edit: {
      menu: "Modifier l'utilisateur",
      title: "Modifier l'utilisateur",
      success: 'Utilisateur mis à jour avec succès',
    },

    new: {
      menu: 'Inviter un utilisateur',
      title: 'Inviter un utilisateur',
      success: 'Utilisateur invité avec succès',
    },

    deleteMany: {
      success: 'Utilisateur(s) supprimé(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un utilisateur à supprimer.',
      confirmTitle: 'Supprimer le(s) utilisateur(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} utilisateur(s) sélectionné(s)?',
    },

    delete: {
      success: 'Utilisateur supprimé avec succès',
      confirmTitle: "Supprimer l'utilisateur?",
    },

    fields: {
      avatars: 'Avatar',
      fullName: 'Nom complet',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      role: 'Rôle',
      roles: 'Rôles',
      status: 'Statut',
      createdAt: 'Créé le',
      createdByMember: 'Créé par',
      updatedAt: 'Mis à jour le',
      updatedByMember: 'Mis à jour par',
    },

    enumerators: {
      roles: {
        admin: 'Administrateur',
        member: 'Membre',
      },
      status: {
        active: 'Actif',
        disabled: 'Désactivé',
      },
    },

    errors: {
      cannotRemoveSelfAdminRole:
        "Vous ne pouvez pas retirer votre propre rôle d'administrateur",
      cannotRemoveSelf: "Vous ne pouvez pas vous retirer de l'organisation",
      notFound: 'Utilisateur introuvable',
      disabledMemberNotFound: 'Membre désactivé introuvable',
      removeFailed: "Échec de la suppression de l'utilisateur",
      disableFailed: "Échec de la désactivation de l'utilisateur",
    },

    mcpDescription: {
      list: "Récupérer une liste de tous les membres de l'organisation actuelle. Prend en charge le filtrage par nom, email et rôle. Renvoie les profils des membres incluant leurs informations utilisateur, rôle, statut et avatar.",
      get: "Obtenir des informations détaillées sur un membre spécifique par son ID unique. Renvoie le profil complet du membre incluant les données utilisateur associées et les détails de l'organisation.",
      autocomplete:
        'Rechercher des membres pour les champs de saisie semi-automatique. Renvoie une liste simplifiée de membres correspondant à la requête, utile pour attribuer des tâches, des relations ou des permissions.',
      update:
        "Mettre à jour un enregistrement de membre existant avec de nouvelles informations. Permet la modification des champs de membre incluant prénom, nom, rôle et avatar. Suit automatiquement la mise à jour dans les journaux d'audit. Empêche les membres de retirer leur propre rôle d'administrateur.",
      disable:
        "Désactiver temporairement un compte de membre. Le membre ne pourra plus accéder à l'organisation mais ses données sont préservées. Peut être inversé en utilisant l'opération de restauration.",
      restore:
        "Restaurer un compte de membre précédemment désactivé. Le membre retrouvera l'accès à l'organisation avec son rôle et ses permissions précédents.",
      remove:
        "Retirer définitivement un membre de l'organisation. Cette action ne peut pas être annulée. Le compte utilisateur du membre est supprimé et toutes les données associées sont retirées.",
    },
  },

  invitation: {
    list: {
      title: 'Invitations',
      noResults: 'Aucune invitation trouvée.',
    },

    view: {
      title: "Voir l'invitation",
    },

    resend: {
      success: 'Invitation renvoyée avec succès',
    },

    cancel: {
      success: 'Invitation annulée avec succès',
      confirmTitle: 'Êtes-vous sûr de vouloir annuler cette invitation?',
    },

    actions: {
      resend: 'Renvoyer',
      cancel: 'Annuler',
    },

    fields: {
      email: 'Email',
      role: 'Rôle',
      status: 'Statut',
      expiresAt: 'Expire le',
      invitedBy: 'Invité par',
      createdAt: 'Créé le',
    },

    enumerators: {
      status: {
        pending: 'En attente',
        accepted: 'Accepté',
        rejected: 'Rejeté',
        expired: 'Expiré',
        cancelled: 'Annulé',
      },
    },

    errors: {
      alreadyProcessed: "L'invitation a déjà été traitée",
      notFound: 'Invitation introuvable',
      acceptFailed: "Échec de l'acceptation de l'invitation",
      rejectFailed: "Échec du rejet de l'invitation",
      cancelFailed: "Échec de l'annulation de l'invitation",
      createFailed: "Échec de la création de l'invitation",
      resendFailed: "Échec du renvoi de l'invitation",
    },

    cancelMany: {
      success: 'Invitations annulées avec succès',
      noSelection: 'Veuillez sélectionner au moins une invitation',
      confirmTitle: 'Annuler les invitations?',
      confirmDescription: 'Êtes-vous sûr de vouloir annuler {0} invitation(s)?',
    },

    resendMany: {
      success: 'Invitations renvoyées avec succès',
      noSelection: 'Veuillez sélectionner au moins une invitation',
      confirmTitle: 'Renvoyer les invitations?',
      confirmDescription:
        'Êtes-vous sûr de vouloir renvoyer {0} invitation(s)?',
    },

    export: {
      success: 'Invitations exportées avec succès',
    },
  },

  subscription: {
    menu: 'Abonnement',
    title: 'Plans et tarifs',

    subscribe: "S'abonner",
    manage: 'Gérer',
    notPlanUser: "Vous n'êtes pas le gestionnaire de cet abonnement.",
    cancelAt: 'Votre abonnement sera annulé le',
    currentPlan: 'Plan actuel:',
    unknown: 'Inconnu',
    noPlansAvailable: "Aucun plan d'abonnement disponible.",
    current: 'Actuel',
    mobileUnavailableTitle: 'Abonnements non disponibles',
    mobileUnavailable:
      'Les abonnements ne sont pas disponibles sur mobile. Veuillez visiter notre site web sur un navigateur de bureau pour gérer votre abonnement.',

    intervals: {
      day: 'Quotidien',
      week: 'Hebdomadaire',
      month: 'Mensuel',
      year: 'Annuel',
    },

    errors: {
      disabled: 'Les abonnements sont désactivés sur cette plateforme',
      alreadyExistsActive: 'Il existe déjà un abonnement actif',
      stripeNotConfigured:
        "Les variables d'environnement Stripe sont manquantes",
    },

    mcpDescription: {
      checkout:
        "Créer une session de paiement Stripe pour s'abonner à un plan tarifaire. Fournissez l'ID de prix Stripe et le système générera une URL de paiement où les utilisateurs peuvent finaliser le paiement. Renvoie l'URL de la session de paiement.",
      portal:
        'Générer une URL du portail client Stripe où les utilisateurs peuvent gérer leur abonnement, mettre à jour les méthodes de paiement, consulter les factures et annuler leur abonnement. Nécessite un abonnement actif.',
      plans:
        "Récupérer tous les plans d'abonnement disponibles depuis Stripe. Renvoie une liste de plans avec les informations de tarification, les fonctionnalités, les intervalles de facturation et le statut de disponibilité. Inclut les plans actifs et archivés.",
    },
  },
  exam: {
    dashboardCard: {
      title: 'Exams',
    },

    list: {
      menu: 'Exams',
      title: 'Exams',
      noResults: 'Aucun exams trouvé.',
      empty:
        "Vous n'avez pas encore créé de exams. Commencez par créer votre premier exam.",
    },

    importer: {
      title: 'Importer des exams',
      menu: 'Importer des exams',
    },

    export: {
      success: 'Exams exportés avec succès',
    },

    new: {
      menu: 'Nouveau exam',
      title: 'Nouveau exam',
      success: 'Exam créé avec succès',
    },

    view: {
      title: 'Voir le exam',
    },

    edit: {
      menu: 'Modifier le exam',
      title: 'Modifier le exam',
      success: 'Exam mis à jour avec succès',
    },

    restore: {
      success: 'Exam restauré avec succès',
      confirmTitle: 'Restaurer le exam?',
    },

    restoreMany: {
      success: 'Exam(s) restauré(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un exam à restaurer.',
      confirmTitle: 'Restaurer le(s) exam(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} exam(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Exam(s) archivé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un exam à archiver.',
      confirmTitle: 'Archiver le(s) exam(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} exam(s) sélectionné(s)?',
    },

    archive: {
      success: 'Exam archivé avec succès',
      confirmTitle: 'Archiver le exam?',
    },

    deleteMany: {
      success: 'Exam(s) supprimé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un exam à supprimer.',
      confirmTitle: 'Supprimer le(s) exam(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} exam(s) sélectionné(s)?',
    },

    delete: {
      success: 'Exam supprimé avec succès',
      confirmTitle: 'Supprimer le exam?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de exams avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des exams incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un exam spécifique par son ID unique. Renvoie le profil complet du exam incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement exam avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement exam existant avec de nouvelles informations. Permet la modification de tous les champs exam incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs exams du système. Cette action est irréversible. Accepte un tableau d'ID de exam et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs exams pour les masquer des vues par défaut tout en préservant leurs données. Les exams archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les exams précédemment archivés au statut actif. Rend les exams visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de exams pour les saisies semi-automatiques. Renvoie une liste simplifiée de exams correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
    },
  },
  chapter: {
    dashboardCard: {
      title: 'Chapters',
    },

    list: {
      menu: 'Chapters',
      title: 'Chapters',
      noResults: 'Aucun chapters trouvé.',
      empty:
        "Vous n'avez pas encore créé de chapters. Commencez par créer votre premier chapter.",
    },

    importer: {
      title: 'Importer des chapters',
      menu: 'Importer des chapters',
    },

    export: {
      success: 'Chapters exportés avec succès',
    },

    new: {
      menu: 'Nouveau chapter',
      title: 'Nouveau chapter',
      success: 'Chapter créé avec succès',
    },

    view: {
      title: 'Voir le chapter',
    },

    edit: {
      menu: 'Modifier le chapter',
      title: 'Modifier le chapter',
      success: 'Chapter mis à jour avec succès',
    },

    restore: {
      success: 'Chapter restauré avec succès',
      confirmTitle: 'Restaurer le chapter?',
    },

    restoreMany: {
      success: 'Chapter(s) restauré(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un chapter à restaurer.',
      confirmTitle: 'Restaurer le(s) chapter(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} chapter(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Chapter(s) archivé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un chapter à archiver.',
      confirmTitle: 'Archiver le(s) chapter(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} chapter(s) sélectionné(s)?',
    },

    archive: {
      success: 'Chapter archivé avec succès',
      confirmTitle: 'Archiver le chapter?',
    },

    deleteMany: {
      success: 'Chapter(s) supprimé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un chapter à supprimer.',
      confirmTitle: 'Supprimer le(s) chapter(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} chapter(s) sélectionné(s)?',
    },

    delete: {
      success: 'Chapter supprimé avec succès',
      confirmTitle: 'Supprimer le chapter?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de chapters avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des chapters incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un chapter spécifique par son ID unique. Renvoie le profil complet du chapter incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement chapter avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement chapter existant avec de nouvelles informations. Permet la modification de tous les champs chapter incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs chapters du système. Cette action est irréversible. Accepte un tableau d'ID de chapter et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs chapters pour les masquer des vues par défaut tout en préservant leurs données. Les chapters archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les chapters précédemment archivés au statut actif. Rend les chapters visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de chapters pour les saisies semi-automatiques. Renvoie une liste simplifiée de chapters correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
    },
  },
  lesson: {
    dashboardCard: {
      title: 'Lessons',
    },

    list: {
      menu: 'Lessons',
      title: 'Lessons',
      noResults: 'Aucun lessons trouvé.',
      empty:
        "Vous n'avez pas encore créé de lessons. Commencez par créer votre premier lesson.",
    },

    importer: {
      title: 'Importer des lessons',
      menu: 'Importer des lessons',
    },

    export: {
      success: 'Lessons exportés avec succès',
    },

    new: {
      menu: 'Nouveau lesson',
      title: 'Nouveau lesson',
      success: 'Lesson créé avec succès',
    },

    view: {
      title: 'Voir le lesson',
    },

    edit: {
      menu: 'Modifier le lesson',
      title: 'Modifier le lesson',
      success: 'Lesson mis à jour avec succès',
    },

    restore: {
      success: 'Lesson restauré avec succès',
      confirmTitle: 'Restaurer le lesson?',
    },

    restoreMany: {
      success: 'Lesson(s) restauré(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un lesson à restaurer.',
      confirmTitle: 'Restaurer le(s) lesson(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} lesson(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Lesson(s) archivé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un lesson à archiver.',
      confirmTitle: 'Archiver le(s) lesson(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} lesson(s) sélectionné(s)?',
    },

    archive: {
      success: 'Lesson archivé avec succès',
      confirmTitle: 'Archiver le lesson?',
    },

    deleteMany: {
      success: 'Lesson(s) supprimé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un lesson à supprimer.',
      confirmTitle: 'Supprimer le(s) lesson(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} lesson(s) sélectionné(s)?',
    },

    delete: {
      success: 'Lesson supprimé avec succès',
      confirmTitle: 'Supprimer le lesson?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de lessons avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des lessons incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un lesson spécifique par son ID unique. Renvoie le profil complet du lesson incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement lesson avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement lesson existant avec de nouvelles informations. Permet la modification de tous les champs lesson incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs lessons du système. Cette action est irréversible. Accepte un tableau d'ID de lesson et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs lessons pour les masquer des vues par défaut tout en préservant leurs données. Les lessons archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les lessons précédemment archivés au statut actif. Rend les lessons visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de lessons pour les saisies semi-automatiques. Renvoie une liste simplifiée de lessons correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
    },
  },
  practiceQuestion: {
    dashboardCard: {
      title: 'Practice Questions',
    },

    list: {
      menu: 'Practice Questions',
      title: 'Practice Questions',
      noResults: 'Aucun practice questions trouvé.',
      empty:
        "Vous n'avez pas encore créé de practice questions. Commencez par créer votre premier practice question.",
    },

    importer: {
      title: 'Importer des practice questions',
      menu: 'Importer des practice questions',
    },

    export: {
      success: 'Practice Questions exportés avec succès',
    },

    new: {
      menu: 'Nouveau practice question',
      title: 'Nouveau practice question',
      success: 'Practice Question créé avec succès',
    },

    view: {
      title: 'Voir le practice question',
    },

    edit: {
      menu: 'Modifier le practice question',
      title: 'Modifier le practice question',
      success: 'Practice Question mis à jour avec succès',
    },

    restore: {
      success: 'Practice Question restauré avec succès',
      confirmTitle: 'Restaurer le practice question?',
    },

    restoreMany: {
      success: 'Practice Question(s) restauré(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un practice question à restaurer.',
      confirmTitle: 'Restaurer le(s) practice question(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} practice question(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Practice Question(s) archivé(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un practice question à archiver.',
      confirmTitle: 'Archiver le(s) practice question(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} practice question(s) sélectionné(s)?',
    },

    archive: {
      success: 'Practice Question archivé avec succès',
      confirmTitle: 'Archiver le practice question?',
    },

    deleteMany: {
      success: 'Practice Question(s) supprimé(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un practice question à supprimer.',
      confirmTitle: 'Supprimer le(s) practice question(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} practice question(s) sélectionné(s)?',
    },

    delete: {
      success: 'Practice Question supprimé avec succès',
      confirmTitle: 'Supprimer le practice question?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de practice questions avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des practice questions incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un practice question spécifique par son ID unique. Renvoie le profil complet du practice question incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement practice question avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement practice question existant avec de nouvelles informations. Permet la modification de tous les champs practice question incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs practice questions du système. Cette action est irréversible. Accepte un tableau d'ID de practice question et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs practice questions pour les masquer des vues par défaut tout en préservant leurs données. Les practice questions archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les practice questions précédemment archivés au statut actif. Rend les practice questions visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de practice questions pour les saisies semi-automatiques. Renvoie une liste simplifiée de practice questions correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
    },
  },
  concept: {
    dashboardCard: {
      title: 'Concepts',
    },

    list: {
      menu: 'Concepts',
      title: 'Concepts',
      noResults: 'Aucun concepts trouvé.',
      empty:
        "Vous n'avez pas encore créé de concepts. Commencez par créer votre premier concept.",
    },

    importer: {
      title: 'Importer des concepts',
      menu: 'Importer des concepts',
    },

    export: {
      success: 'Concepts exportés avec succès',
    },

    new: {
      menu: 'Nouveau concept',
      title: 'Nouveau concept',
      success: 'Concept créé avec succès',
    },

    view: {
      title: 'Voir le concept',
    },

    edit: {
      menu: 'Modifier le concept',
      title: 'Modifier le concept',
      success: 'Concept mis à jour avec succès',
    },

    restore: {
      success: 'Concept restauré avec succès',
      confirmTitle: 'Restaurer le concept?',
    },

    restoreMany: {
      success: 'Concept(s) restauré(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un concept à restaurer.',
      confirmTitle: 'Restaurer le(s) concept(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} concept(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Concept(s) archivé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un concept à archiver.',
      confirmTitle: 'Archiver le(s) concept(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} concept(s) sélectionné(s)?',
    },

    archive: {
      success: 'Concept archivé avec succès',
      confirmTitle: 'Archiver le concept?',
    },

    deleteMany: {
      success: 'Concept(s) supprimé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un concept à supprimer.',
      confirmTitle: 'Supprimer le(s) concept(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} concept(s) sélectionné(s)?',
    },

    delete: {
      success: 'Concept supprimé avec succès',
      confirmTitle: 'Supprimer le concept?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de concepts avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des concepts incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un concept spécifique par son ID unique. Renvoie le profil complet du concept incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement concept avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement concept existant avec de nouvelles informations. Permet la modification de tous les champs concept incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs concepts du système. Cette action est irréversible. Accepte un tableau d'ID de concept et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs concepts pour les masquer des vues par défaut tout en préservant leurs données. Les concepts archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les concepts précédemment archivés au statut actif. Rend les concepts visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de concepts pour les saisies semi-automatiques. Renvoie une liste simplifiée de concepts correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
    },
  },
  examType: {
    dashboardCard: {
      title: 'Exam Types',
    },

    list: {
      menu: 'Exam Types',
      title: 'Exam Types',
      noResults: 'Aucun exam types trouvé.',
      empty:
        "Vous n'avez pas encore créé de exam types. Commencez par créer votre premier exam type.",
    },

    importer: {
      title: 'Importer des exam types',
      menu: 'Importer des exam types',
    },

    export: {
      success: 'Exam Types exportés avec succès',
    },

    new: {
      menu: 'Nouveau exam type',
      title: 'Nouveau exam type',
      success: 'Exam Type créé avec succès',
    },

    view: {
      title: 'Voir le exam type',
    },

    edit: {
      menu: 'Modifier le exam type',
      title: 'Modifier le exam type',
      success: 'Exam Type mis à jour avec succès',
    },

    restore: {
      success: 'Exam Type restauré avec succès',
      confirmTitle: 'Restaurer le exam type?',
    },

    restoreMany: {
      success: 'Exam Type(s) restauré(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un exam type à restaurer.',
      confirmTitle: 'Restaurer le(s) exam type(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} exam type(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Exam Type(s) archivé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un exam type à archiver.',
      confirmTitle: 'Archiver le(s) exam type(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} exam type(s) sélectionné(s)?',
    },

    archive: {
      success: 'Exam Type archivé avec succès',
      confirmTitle: 'Archiver le exam type?',
    },

    deleteMany: {
      success: 'Exam Type(s) supprimé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un exam type à supprimer.',
      confirmTitle: 'Supprimer le(s) exam type(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} exam type(s) sélectionné(s)?',
    },

    delete: {
      success: 'Exam Type supprimé avec succès',
      confirmTitle: 'Supprimer le exam type?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de exam types avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des exam types incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un exam type spécifique par son ID unique. Renvoie le profil complet du exam type incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement exam type avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement exam type existant avec de nouvelles informations. Permet la modification de tous les champs exam type incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs exam types du système. Cette action est irréversible. Accepte un tableau d'ID de exam type et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs exam types pour les masquer des vues par défaut tout en préservant leurs données. Les exam types archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les exam types précédemment archivés au statut actif. Rend les exam types visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de exam types pour les saisies semi-automatiques. Renvoie une liste simplifiée de exam types correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
    },
  },
  examInstance: {
    dashboardCard: {
      title: 'Exam Attempts',
    },

    list: {
      menu: 'Exam Attempts',
      title: 'Exam Attempts',
      noResults: 'Aucun exam attempts trouvé.',
      empty:
        "Vous n'avez pas encore créé de exam attempts. Commencez par créer votre premier exam attempt.",
    },

    importer: {
      title: 'Importer des exam attempts',
      menu: 'Importer des exam attempts',
    },

    export: {
      success: 'Exam Attempts exportés avec succès',
    },

    new: {
      menu: 'Nouveau exam attempt',
      title: 'Nouveau exam attempt',
      success: 'Exam Attempt créé avec succès',
    },

    view: {
      title: 'Voir le exam attempt',
    },

    edit: {
      menu: 'Modifier le exam attempt',
      title: 'Modifier le exam attempt',
      success: 'Exam Attempt mis à jour avec succès',
    },

    restore: {
      success: 'Exam Attempt restauré avec succès',
      confirmTitle: 'Restaurer le exam attempt?',
    },

    restoreMany: {
      success: 'Exam Attempt(s) restauré(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un exam attempt à restaurer.',
      confirmTitle: 'Restaurer le(s) exam attempt(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} exam attempt(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Exam Attempt(s) archivé(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un exam attempt à archiver.',
      confirmTitle: 'Archiver le(s) exam attempt(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} exam attempt(s) sélectionné(s)?',
    },

    archive: {
      success: 'Exam Attempt archivé avec succès',
      confirmTitle: 'Archiver le exam attempt?',
    },

    deleteMany: {
      success: 'Exam Attempt(s) supprimé(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un exam attempt à supprimer.',
      confirmTitle: 'Supprimer le(s) exam attempt(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} exam attempt(s) sélectionné(s)?',
    },

    delete: {
      success: 'Exam Attempt supprimé avec succès',
      confirmTitle: 'Supprimer le exam attempt?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de exam attempts avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des exam attempts incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un exam attempt spécifique par son ID unique. Renvoie le profil complet du exam attempt incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement exam attempt avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement exam attempt existant avec de nouvelles informations. Permet la modification de tous les champs exam attempt incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs exam attempts du système. Cette action est irréversible. Accepte un tableau d'ID de exam attempt et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs exam attempts pour les masquer des vues par défaut tout en préservant leurs données. Les exam attempts archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les exam attempts précédemment archivés au statut actif. Rend les exam attempts visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de exam attempts pour les saisies semi-automatiques. Renvoie une liste simplifiée de exam attempts correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
    },
  },
  dailyGoal: {
    dashboardCard: {
      title: 'Daily Goals',
    },

    list: {
      menu: 'Daily Goals',
      title: 'Daily Goals',
      noResults: 'Aucun daily goals trouvé.',
      empty:
        "Vous n'avez pas encore créé de daily goals. Commencez par créer votre premier daily goal.",
    },

    importer: {
      title: 'Importer des daily goals',
      menu: 'Importer des daily goals',
    },

    export: {
      success: 'Daily Goals exportés avec succès',
    },

    new: {
      menu: 'Nouveau daily goal',
      title: 'Nouveau daily goal',
      success: 'Daily Goal créé avec succès',
    },

    view: {
      title: 'Voir le daily goal',
    },

    edit: {
      menu: 'Modifier le daily goal',
      title: 'Modifier le daily goal',
      success: 'Daily Goal mis à jour avec succès',
    },

    restore: {
      success: 'Daily Goal restauré avec succès',
      confirmTitle: 'Restaurer le daily goal?',
    },

    restoreMany: {
      success: 'Daily Goal(s) restauré(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un daily goal à restaurer.',
      confirmTitle: 'Restaurer le(s) daily goal(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} daily goal(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Daily Goal(s) archivé(s) avec succès',
      noSelection: 'Vous devez sélectionner au moins un daily goal à archiver.',
      confirmTitle: 'Archiver le(s) daily goal(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} daily goal(s) sélectionné(s)?',
    },

    archive: {
      success: 'Daily Goal archivé avec succès',
      confirmTitle: 'Archiver le daily goal?',
    },

    deleteMany: {
      success: 'Daily Goal(s) supprimé(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un daily goal à supprimer.',
      confirmTitle: 'Supprimer le(s) daily goal(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} daily goal(s) sélectionné(s)?',
    },

    delete: {
      success: 'Daily Goal supprimé avec succès',
      confirmTitle: 'Supprimer le daily goal?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de daily goals avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des daily goals incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un daily goal spécifique par son ID unique. Renvoie le profil complet du daily goal incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement daily goal avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement daily goal existant avec de nouvelles informations. Permet la modification de tous les champs daily goal incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs daily goals du système. Cette action est irréversible. Accepte un tableau d'ID de daily goal et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs daily goals pour les masquer des vues par défaut tout en préservant leurs données. Les daily goals archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les daily goals précédemment archivés au statut actif. Rend les daily goals visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de daily goals pour les saisies semi-automatiques. Renvoie une liste simplifiée de daily goals correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
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
      noResults: 'Aucun document uploads trouvé.',
      empty:
        "Vous n'avez pas encore créé de document uploads. Commencez par créer votre premier document upload.",
    },

    importer: {
      title: 'Importer des document uploads',
      menu: 'Importer des document uploads',
    },

    export: {
      success: 'Document Uploads exportés avec succès',
    },

    new: {
      menu: 'Nouveau document upload',
      title: 'Nouveau document upload',
      success: 'Document Upload créé avec succès',
    },

    view: {
      title: 'Voir le document upload',
    },

    edit: {
      menu: 'Modifier le document upload',
      title: 'Modifier le document upload',
      success: 'Document Upload mis à jour avec succès',
    },

    restore: {
      success: 'Document Upload restauré avec succès',
      confirmTitle: 'Restaurer le document upload?',
    },

    restoreMany: {
      success: 'Document Upload(s) restauré(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un document upload à restaurer.',
      confirmTitle: 'Restaurer le(s) document upload(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir restaurer le(s) {0} document upload(s) sélectionné(s)?',
    },

    archiveMany: {
      success: 'Document Upload(s) archivé(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un document upload à archiver.',
      confirmTitle: 'Archiver le(s) document upload(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir archiver le(s) {0} document upload(s) sélectionné(s)?',
    },

    archive: {
      success: 'Document Upload archivé avec succès',
      confirmTitle: 'Archiver le document upload?',
    },

    deleteMany: {
      success: 'Document Upload(s) supprimé(s) avec succès',
      noSelection:
        'Vous devez sélectionner au moins un document upload à supprimer.',
      confirmTitle: 'Supprimer le(s) document upload(s)?',
      confirmDescription:
        'Êtes-vous sûr de vouloir supprimer le(s) {0} document upload(s) sélectionné(s)?',
    },

    delete: {
      success: 'Document Upload supprimé avec succès',
      confirmTitle: 'Supprimer le document upload?',
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
      createdByMember: 'Créé par',
      updatedByMember: 'Mis à jour par',
      archivedByMember: 'Archivé par',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      archivedAt: 'Archivé le',
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
      list: 'Récupérer une liste paginée de document uploads avec des options de filtrage avancées. Prend en charge le filtrage par divers champs et entités liées. Renvoie les détails des document uploads incluant toutes les relations et métadonnées.',
      get: "Récupérer des informations détaillées sur un document upload spécifique par son ID unique. Renvoie le profil complet du document upload incluant toutes les relations, pièces jointes et métadonnées d'audit.",
      create:
        'Créer un nouvel enregistrement document upload avec des détails complets. Prend en charge tous les champs définis incluant les relations, pièces jointes et propriétés personnalisées.',
      update:
        "Mettre à jour un enregistrement document upload existant avec de nouvelles informations. Permet la modification de tous les champs document upload incluant les relations et pièces jointes. Suit automatiquement la mise à jour dans les journaux d'audit.",
      delete:
        "Supprimer définitivement un ou plusieurs document uploads du système. Cette action est irréversible. Accepte un tableau d'ID de document upload et supprime toutes les données associées.",
      archive:
        'Archiver un ou plusieurs document uploads pour les masquer des vues par défaut tout en préservant leurs données. Les document uploads archivés peuvent être restaurés ultérieurement. Utile pour les enregistrements inactifs ou historiques.',
      restore:
        'Restaurer les document uploads précédemment archivés au statut actif. Rend les document uploads visibles à nouveau dans les vues par défaut.',
      autocomplete:
        'Rechercher et récupérer des suggestions de document uploads pour les saisies semi-automatiques. Renvoie une liste simplifiée de document uploads correspondant à la requête de recherche, optimisée pour les listes déroulantes de sélection et les champs de saisie semi-automatique.',
    },
  },

  auditLog: {
    list: {
      menu: "Journaux d'audit",
      title: "Journaux d'audit",
      noResults: "Aucun journal d'audit trouvé.",
    },

    changesDialog: {
      title: "Journal d'audit",
      changes: 'Modifications',
      noChanges: "Il n'y a aucune modification dans ce journal.",
      showChangesOnly: 'Afficher uniquement les modifications',
      showFullObject: "Afficher l'objet complet",
    },

    export: {
      success: "Journaux d'audit exportés avec succès",
    },

    fields: {
      timestamp: 'Date',
      entityName: 'Entité',
      entityNames: 'Entités',
      entityId: "ID d'entité",
      operation: 'Opération',
      operations: 'Opérations',
      member: 'Utilisateur',
      apiKey: 'Clé API',
      apiEndpoint: 'Point de terminaison API',
      apiHttpResponseCode: 'Statut API',
    },

    enumerators: {
      operation: {
        SI: 'Connexion',
        SO: 'Déconnexion',
        SU: 'Inscription',
        PRR: 'Demande de réinitialisation du mot de passe',
        PRC: 'Confirmation de réinitialisation du mot de passe',
        PC: 'Changement de mot de passe',
        VER: "Demande de vérification d'email",
        VEC: "Confirmation de vérification d'email",
        C: 'Créer',
        U: 'Mettre à jour',
        D: 'Supprimer',
        AG: 'API Get',
        APO: 'API Post',
        APU: 'API Put',
        AD: 'API Delete',
      },
    },

    dashboardCard: {
      activityChart: 'Activité',
      activityList: 'Activité récente',
    },

    readableOperations: {
      SI: "{0} s'est connecté",
      SIF: 'Échec de tentative de connexion pour {0}',
      SU: "{0} s'est inscrit",
      PRR: '{0} a demandé à réinitialiser le mot de passe',
      PRC: '{0} a confirmé la réinitialisation du mot de passe',
      PC: '{0} a changé le mot de passe',
      VER: "{0} a demandé à vérifier l'email",
      VEC: "{0} a vérifié l'email",
      ECR: "{0} a demandé à changer d'email",
      ECC: "{0} a confirmé le changement d'email",
      C: '{0} a créé {1} {2}',
      U: '{0} a mis à jour {1} {2}',
      D: '{0} a supprimé {1} {2}',
      selfSignUp: "{0} s'est inscrit",
      selfUpdate: '{0} a mis à jour son profil',
      AG: 'Requête API Key GET',
      APO: 'Requête API Key POST',
      APU: 'Requête API Key PUT',
      AD: 'Requête API Key DELETE',
    },

    mcpDescription: {
      list: "Interroger le journal d'audit pour récupérer les journaux de toutes les actions effectuées dans l'organisation. Prend en charge le filtrage par type d'entité, ID d'entité, type d'opération et plage de temps. Renvoie des enregistrements détaillés incluant qui a effectué l'action, quand et ce qui a changé. Essentiel pour la conformité et la surveillance de la sécurité.",
      activityChart:
        "Obtenir des statistiques d'activité agrégées sur une période de temps. Renvoie un graphique de série temporelle des activités et opérations des utilisateurs, utile pour visualiser les modèles d'utilisation du système et identifier les périodes d'activité maximale.",
    },
  },

  apiDocs: {
    title: 'Documentation API',
    menu: 'Documentation API',
    featuresApi: 'API des fonctionnalités',
    authApi: "API d'authentification",
    openapi: {
      title: 'API',
      serverDescription: 'Serveur API',
      securitySchemes: {
        apiKeyAuth: {
          description:
            "Authentification par clé API utilisant l'en-tête x-api-key",
        },
        bearerAuth: {
          description:
            "Authentification par clé API utilisant le jeton Bearer d'autorisation",
        },
      },
    },
  },

  mcp: {
    title: 'Intégration MCP',
    menu: 'Intégration MCP',
    subtitle:
      'Connecter des assistants IA externes utilisant le Model Context Protocol',
    info: "Utilisez le point de terminaison ci-dessous pour connecter des assistants IA externes comme ChatGPT ou Claude Desktop à vos données d'organisation.",
    endpoint: {
      title: 'Votre point de terminaison MCP',
      description:
        'Utilisez ce point de terminaison pour configurer les clients MCP',
      endpointLabel: 'URL du point de terminaison MCP',
      organizationLabel: "ID d'organisation",
      languageLabel: 'Langue',
    },
    usage: {
      title: 'Comment utiliser',
      description:
        'Suivez ces étapes pour intégrer avec des assistants IA externes:',
      step1: "Copiez l'URL du point de terminaison ci-dessus",
      step2:
        'Configurez votre assistant IA (ChatGPT, Claude Desktop, etc.) avec ce point de terminaison MCP',
      step3: 'Authentifiez-vous en utilisant OAuth lorsque demandé',
      step4: "Commencez à utiliser vos données d'organisation via le chat IA",
    },
  },

  user: {
    mcpDescription: {
      me: "Récupérer le profil de l'utilisateur authentifié actuel et toutes ses adhésions d'organisation. Renvoie les détails de l'utilisateur, toutes les organisations auxquelles il appartient, ses rôles dans chaque organisation et tous les abonnements actifs.",
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
      title: 'Lecteur de cours',
      modules: 'Modules',
      courseOutline: 'Plan du cours',
      currentModule: 'Module : {0}',
      progressComplete: '{0}% termine',
      lessonKindVideo: 'Video',
      lessonKindArticle: 'Article',
      lessonKindQuiz: 'Quiz',
      durationMinutes: '{0} min',
      durationQuestions: '{0} questions',
      readingTime: '{0} min de lecture',
      videoUnavailable: 'Aucune video n a ete ajoutee pour cette lecon.',
      noLessonContent: 'Aucun contenu n a encore ete ajoute a cette lecon.',
      articleHint:
        'Demandez au tuteur IA d expliquer, de resumer ou de generer des questions d entrainement.',
      completeLesson: 'Marquer comme termine',
      completedLesson: 'Terminee',
      saveNote: 'Enregistrer une note',
      downloadResources: 'Telecharger les ressources',
      openMiniPlayer: 'Ouvrir le mini lecteur',
      closeMiniPlayer: 'Fermer le mini lecteur',
      playing: 'Lecture',
      assignments: 'Devoir',
      submitAssignment: 'Envoyer le devoir',
      resubmitAssignment: 'Renvoyer le devoir',
      pendingReview: 'Envoye et en attente de correction.',
      homeworkComplete: 'Ce devoir est termine.',
      resubmissionClosed: 'Les renvois sont fermes pour ce devoir.',
      maxAttemptsReached: 'Nombre maximal de tentatives atteint.',
      tutor: 'Tuteur IA du cours',
      tutorPrompt: 'Posez une question sur ce cours ou cette lecon...',
      resources: 'Fichiers telechargeables',
      quizzes: 'Quiz',
      takeQuiz: 'Faire le quiz',
    },
    mobile: {
      savedOffline:
        'Enregistré hors ligne. La synchronisation se fera au retour en ligne.',
      outline: 'Plan du cours',
      nextLesson: 'Leçon suivante',
      offlineStatus: {
        online: 'En ligne',
        offline:
          'Mode hors ligne : le travail de leçon est enregistré sur cet appareil.',
        syncing: 'Synchronisation du travail de leçon enregistré...',
        synced: 'Travail de leçon synchronisé.',
        failed:
          'Une partie du travail de leçon nécessite une nouvelle synchronisation.',
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
    ratings: {
      title: 'Course rating',
      summary: '{0} ({1})',
      noRatings: 'No ratings yet',
      commentPlaceholder: 'Share what helped or what could improve...',
      save: 'Save rating',
      starLabel: '{0} star rating',
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
    menu: 'Candidature créateur',
    title: 'Candidature créateur',
    description:
      'Demandez la vérification enseignant avec un profil structuré, un plan de cours et une vérification privée d’identité avant de publier des cours sur NexExam.',
    adminTitle: 'Candidatures créateurs',
    adminDescription:
      'Examinez les profils enseignants, la vérification d’identité et la préparation créateur avant approbation.',
    sections: {
      profile: 'Profil enseignant',
      profileBody:
        'Montrez aux étudiants et aux réviseurs qui vous êtes, ce que vous enseignez et qui vous accompagnez.',
      expertise: 'Expertise et plan de cours',
      expertiseBody:
        'Ajoutez des références, le domaine visé, des liens justificatifs et un exemple de plan de leçon pour la revue qualité.',
      identity: 'Vérification d’identité',
      identityBody:
        'Téléversez une pièce d’identité officielle ou des documents professionnels dans l’espace privé de vérification.',
      payout: 'Paiement et contact',
      payoutBody:
        'Partagez les notes de paiement ou le meilleur canal de contact pour l’intégration créateur.',
      review: 'Soumettre à la revue',
      reviewBody:
        'Enregistrez d’abord votre candidature, puis lancez l’agent de vérification une fois vos documents d’identité téléversés.',
      certifications: 'Références et certifications',
      certificationsBody:
        'Ajoutez des certifications ou références formelles, chacune avec un document justificatif facultatif.',
    },
    identity: {
      title: 'Liste de vérification',
      description:
        'NexExam vérifie votre profil enseignant, vos documents d’identité et l’approbation admin avant d’accorder l’accès créateur.',
      profileReady: 'Profil enseignant complet',
      documentsUploaded: 'Documents d’identité téléversés',
      consentRecorded: 'Consentement de vérification enregistré',
      adminVerified: 'Identité vérifiée par un admin',
      consent:
        'Je confirme que ces documents m’appartiennent et j’autorise NexExam à les examiner pour vérifier mon identité de créateur.',
      adminReviewTitle: 'Revue d’identité',
      approvalRequiresIdentity:
        'Vérifiez l’identité avant d’approuver cette candidature enseignant.',
    },
    hints: {
      onePerLine: 'Un élément par ligne',
      certificationsEmpty: 'Aucune certification ajoutée pour le moment.',
    },
    fields: {
      legalName: 'Nom légal',
      displayName: 'Nom affiché',
      professionalTitle: 'Titre professionnel',
      bio: 'Bio',
      credentials: 'Références',
      expertise: 'Expertise examen/catégorie',
      teachingExperience: 'Expérience d’enseignement',
      audience: 'Étudiants cibles',
      courseTopics: 'Sujets du cours',
      sampleLessonPlan: 'Exemple de plan de leçon',
      links: 'Liens',
      payoutContact: 'Notes paiement/contact',
      status: 'Statut',
      identityStatus: 'Statut d’identité',
      identityScanStatus: 'Analyse de l’agent',
      adminNotes: 'Notes admin',
      certificationTitle: 'Certification ou référence',
      certificationIssuer: 'Organisme émetteur',
      certificationYear: 'Année',
      certificationUrl: 'Lien de vérification',
      certificationDocuments: 'Documents justificatifs',
      payoutOnboardingStatus: 'Intégration paiement',
    },
    actions: {
      submit: 'Soumettre la candidature',
      runIdentityScan: 'Lancer l’analyse ID',
      verifyIdentity: 'Vérifier l’ID',
      requestDocuments: 'Demander des documents',
      approve: 'Approuver',
      reject: 'Rejeter',
      review: 'Examiner',
      addCertification: 'Ajouter une certification',
      removeCertification: 'Retirer',
      beginPayoutOnboarding: 'Commencer l’intégration paiement',
      submitPayoutDetails: 'Envoyer les détails de paiement',
      grantNexVerified: 'Accorder Nex Verified',
    },
    success: {
      submitted: 'Candidature créateur envoyée.',
      reviewed: 'Candidature créateur examinée.',
      identityScanStarted: 'Analyse de vérification d’identité terminée.',
      identityReviewed: 'Revue d’identité mise à jour.',
      payoutOnboardingUpdated: 'Intégration paiement mise à jour.',
    },
    errors: {
      payoutContactRequired:
        'Ajoutez des notes paiement/contact avant d’envoyer vos détails de paiement.',
      payoutOnboardingInvalid:
        'Cette étape d’intégration paiement n’est pas disponible pour le moment.',
      nexVerifiedNotEligible:
        'Ce créateur n’est pas encore éligible à Nex Verified.',
    },
    verification: {
      title: 'Centre de vérification',
      description:
        'Terminez chaque étape ci-dessous pour débloquer le statut créateur Nex Verified.',
      nexVerifiedBadge: 'Créateur Nex Verified',
      eligibleNote:
        'Toutes les vérifications sont réussies ; un admin peut maintenant accorder Nex Verified.',
      pendingNote: 'Terminez les étapes restantes pour devenir éligible.',
      checks: {
        applicationApproved: 'Candidature créateur approuvée',
        identityVerified: 'Identité vérifiée',
        payoutComplete: 'Intégration paiement terminée',
        nexVerified: 'Nex Verified accordé',
      },
    },
    enumerators: {
      status: {
        pending: 'En attente',
        approved: 'Approuvée',
        rejected: 'Rejetée',
      },
      identityStatus: {
        notStarted: 'Non démarrée',
        needsDocuments: 'Documents requis',
        readyForReview: 'Prête pour revue',
        verified: 'Vérifiée',
        rejected: 'Rejetée',
      },
      identityScanStatus: {
        notStarted: 'Non démarrée',
        passed: 'Réussie',
        needsReview: 'Revue requise',
        failed: 'Échouée',
      },
      identityScanChecks: {
        consent_recorded: 'Consentement enregistré',
        consent_missing: 'Consentement manquant',
        document_uploaded: 'Document téléversé',
        document_missing: 'Document manquant',
        too_many_documents: 'Trop de documents',
        file_type_supported: 'Type de fichier pris en charge',
        file_type_needs_review: 'Type de fichier à examiner',
        legal_name_present: 'Nom légal présent',
        legal_name_needs_review: 'Nom légal à examiner',
        manual_review_required: 'Revue admin manuelle requise',
      },
      payoutOnboardingStatus: {
        notStarted: 'Non démarrée',
        inProgress: 'En cours',
        submitted: 'Soumise pour revue',
        actionRequired: 'Action requise',
        complete: 'Terminée',
      },
    },
  },

  chatbot: {
    title: 'Chat IA',
    menu: 'Chat IA',
    placeholder: "Posez-moi n'importe quelle question sur vos données...",
    send: 'Envoyer',
    thinking: 'Réflexion...',
    usingTool: 'Utilisation de {0}...',
    error: "Quelque chose s'est mal passé. Veuillez réessayer.",
    errorNoApiKey:
      "Le chat IA n'est pas configuré. Veuillez contacter votre administrateur.",
    empty: 'Démarrer une conversation avec le chat IA',
    welcome:
      "Bonjour! Je peux vous aider avec exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, les membres, les journaux d'audit, les abonnements, et plus encore. Que souhaitez-vous savoir?",
    clearConversation: 'Effacer la conversation',
    inputHint:
      'Appuyez sur Entrée pour envoyer, Shift+Entrée pour nouvelle ligne',
    courseContextHeader: 'Course context available to the tutor:',
    courseVideoTranscriptNotice:
      'Uploaded videos are available as files only; no audio transcript is available in Phase 1.',
    courseScopedSystemPrompt: `The user is asking inside a specific course. Use this course context when helpful, but do not claim to know video audio that is not present in the written context:

{0}`,
    systemPrompt: `Vous êtes un chat IA pour {0}. Vous avez accès à divers outils pour aider les utilisateurs à gérer leurs données incluant exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, les membres, les journaux d\'audit, les abonnements et les informations utilisateur.

IMPORTANT: Répondez toujours en {1}. La langue de l\'interface de l\'utilisateur est {1}, donc toutes vos réponses doivent être en {1}.

Vous devriez:
- Être utile, concis et professionnel
- Utiliser les outils disponibles pour répondre aux questions sur les données
- Expliquer ce que vous faites lors de l\'utilisation des outils
- Formater les données de manière claire et lisible
- Demander des clarifications si une demande est ambiguë

Lors de l\'affichage des données:
- Utiliser des tableaux ou des listes pour plusieurs éléments
- Mettre en évidence les informations importantes
- Inclure les ID pertinents uniquement si nécessaire

Rappel: Vous opérez dans {0} et ne pouvez accéder qu\'aux données de cette organisation.`,
  },

  notification: {
    title: 'Notifications',
    menu: 'Notifications',
    unreadCount: '{0} notification(s) non lue(s)',
    markAsRead: 'Marquer comme lu',
    markAsReadSuccess: 'Notifications marquées comme lues',
    markAsUnread: 'Marquer comme non lu',
    markAsUnreadSuccess: 'Notifications marquées comme non lues',
    noNotifications:
      "Vous n'avez pas encore de notifications. Lorsqu'il y a des mises à jour ou des événements importants, vous les verrez ici.",
    list: {
      title: 'Notifications',
      menu: 'Notifications',
    },
    fields: {
      type: 'Type',
      message: 'Message',
      createdAt: 'Date',
      readAt: 'Lu',
    },
    status: {
      read: 'Lu',
      unread: 'Non lu',
    },
    enumerators: {
      type: {
        memberAdded: 'Membre ajouté',
        memberRemoved: 'Membre retiré',
        subscriptionCreated: 'Abonnement créé',
        studyPlanDue: "Plan d'étude à faire",
        flashcardsDue: 'Cartes à réviser',
        streakRisk: "Rappel de série d'étude",
        examDateApproaching: "Date d'examen proche",
        practiceReminder: "Rappel d'entraînement",
        custom: 'Personnalisé',
      },
    },
    memberAdded: {
      subject: 'Nouveau membre ajouté à {0}',
      body: `<p>Bonjour,</p><p><strong>{0}</strong> ({1}) a été ajouté à {2} par {3}.</p><p>Merci,</p><p>Votre équipe</p>`,
      pushBody: '{0} a rejoint {1}',
    },
    memberRemoved: {
      subject: 'Membre retiré de {0}',
      body: `<p>Bonjour,</p><p><strong>{0}</strong> ({1}) a été retiré de {2} par {3}.</p><p>Merci,</p><p>Votre équipe</p>`,
      pushBody: '{0} a quitté {1}',
    },
    subscriptionCreated: {
      subject: 'Nouvel abonnement dans {0}',
      body: `<p>Bonjour,</p><p><strong>{0}</strong> ({1}) s'est abonné au plan <strong>{2}</strong> pour {3}.</p><p>Merci,</p><p>Votre équipe</p>`,
      pushBody: "{0} s'est abonné à {1}",
    },
    studyPlanDue: {
      subject: "Plan d'étude à faire pour {0}",
      body: '<p>Votre tâche <strong>{0}</strong> est à faire pour {1}.</p>',
      pushBody: '{0} est à faire pour {1}',
    },
    flashcardsDue: {
      subject: 'Cartes à réviser pour {0}',
      body: '<p>Vous avez {0} carte(s) prêtes à réviser dans {1}.</p>',
      pushBody: '{0} carte(s) prêtes dans {1}',
    },
    streakRisk: {
      subject: 'Gardez votre série {0}',
      body: '<p>Ouvrez {0} aujourd’hui pour protéger votre série de {1} jour(s).</p>',
      pushBody: 'Gardez votre série {0} aujourd’hui',
    },
    examDateApproaching: {
      subject: '{0} approche',
      body: '<p>{0} est dans {1} jour(s). Revoyez votre plan aujourd’hui.</p>',
      pushBody: '{0} est dans {1} jour(s)',
    },
    practiceReminder: {
      subject: 'Entraînement prêt pour {0}',
      body: '<p>Une courte séance d’entraînement est prête pour {0}.</p>',
      bodyWithWeakArea:
        '<p>Une courte séance pour {0} est prête, ciblée sur {1}.</p>',
      pushBody: 'Entraînement prêt pour {0}',
      pushBodyWithWeakArea: 'Travaillez votre point faible {0}',
    },
    custom: {
      subject: '{0}',
      body: '{0}',
      pushBody: '{0}',
    },
    default: {
      subject: 'Notification',
      body: 'Vous avez une nouvelle notification',
      pushBody: 'Vous avez une nouvelle notification',
    },
    send: {
      title: 'Envoyer une notification',
      menu: 'Envoyer',
      success: 'Notification envoyée avec succès',
      fields: {
        title: 'Titre',
        message: 'Message',
        roles: 'Rôles cibles',
      },
      placeholders: {
        title: 'Entrer le titre de la notification',
        message: 'Entrer le message de la notification',
        roles: 'Sélectionner les rôles à notifier',
      },
    },
  },

  trustSafety: {
    admin: {
      title: 'Confiance et sécurité',
      menu: 'Confiance et sécurité',
      description:
        'Examinez les signalements marketplace, alertes de risque, acceptations de politiques et restrictions créateurs.',
      openReports: 'Signalements ouverts',
      openRiskFlags: 'Alertes de risque ouvertes',
      pendingReviews: 'Revues en attente',
      disabledCreators: 'Créateurs désactivés',
      policyVersions: 'Versions de politique actives',
      noPolicyVersions: 'Aucune politique active configurée.',
      searchPlaceholder:
        'Rechercher signalements, cours, créateurs ou alertes...',
      reportStatusFilter: 'Tous les statuts de signalement',
      flagStatusFilter: 'Tous les statuts d’alerte',
      priorityFilter: 'Toutes les priorités',
      severityFilter: 'Toutes les sévérités',
      targetTypeFilter: 'Tous les types de cible',
      runRuleScan: 'Analyser les règles de risque',
      riskFlags: 'Alertes de risque',
      reports: 'Signalements',
      manualFlag: 'Alerte de risque manuelle',
      pendingCourseReviews: 'Revues de cours en attente',
      disabledCreatorList: 'Créateurs désactivés',
      emptyRiskFlags: 'Aucune alerte de risque ne correspond à ces filtres.',
      emptyReports: 'Aucun signalement ne correspond à ces filtres.',
      emptyCourseReviews: 'Aucun cours en attente de revue.',
      emptyDisabledCreators: 'Aucun créateur désactivé.',
      targetIdPlaceholder: 'UUID cible',
      reasonPlaceholder: 'Décrire le risque',
      adminNotesPlaceholder: 'Notes admin',
      resolutionSummaryPlaceholder: 'Résumé de résolution',
      createFlag: 'Créer une alerte',
      assignToMe: 'Me l’assigner',
      markReviewing: 'Marquer en revue',
      resolve: 'Résoudre',
      dismiss: 'Ignorer',
      resolveActionTaken: 'Résoudre avec action',
      resolveNoAction: 'Résoudre sans action',
      disableCreator: 'Désactiver le créateur',
      restoreCreator: 'Restaurer le créateur',
      placeHold: 'Mettre en attente',
      removeHold: 'Retirer l’attente',
      onHold: 'En attente',
      inReview: 'En revue',
      openCourseReview: 'Ouvrir la revue',
      manualSafetyHoldReason: 'Blocage manuel de sécurité',
      unknownCreator: 'Créateur inconnu',
      unknown: 'Inconnu',
      unassigned: 'Non assigné',
      assignedTo: 'Assigné à',
      reportedBy: 'Signalé par',
      disabled: 'Désactivé',
      reviewTimeline: 'Historique de revue',
      noReviewDecisions: 'Aucune décision de revue enregistrée.',
      priorities: {
        low: 'Faible',
        normal: 'Normale',
        high: 'Élevée',
        urgent: 'Urgente',
      },
      outcomeCategories: {
        none: 'Aucun résultat sélectionné',
        contentRemoved: 'Contenu retiré',
        creatorWarning: 'Créateur averti',
        creatorSuspended: 'Créateur suspendu',
        refundReviewed: 'Remboursement examiné',
        noViolation: 'Aucune violation',
        duplicate: 'Doublon',
      },
      reviewDecisions: {
        submitted: 'Soumis à la revue',
        withdrawn: 'Retiré de la revue',
        creatorUnpublished: 'Dépublié par le créateur',
        approve: 'Approuvé',
        requestChanges: 'Modifications demandées',
        safetyHoldPlaced: 'Blocage de sécurité appliqué',
        safetyHoldRemoved: 'Blocage de sécurité retiré',
      },
      targetTypes: {
        creator: 'Créateur',
        course: 'Cours',
        report: 'Signalement',
        payout: 'Paiement',
        oneOnOneSession: 'Session 1:1',
      },
      severities: {
        low: 'Faible',
        medium: 'Moyenne',
        high: 'Élevée',
        critical: 'Critique',
      },
      flagStatuses: {
        open: 'Ouverte',
        reviewing: 'En revue',
        resolved: 'Résolue',
        dismissed: 'Ignorée',
      },
      reportStatuses: {
        open: 'Ouvert',
        underReview: 'En revue',
        resolvedActionTaken: 'Résolu avec action',
        resolvedNoAction: 'Résolu sans action',
      },
      sources: {
        manual: 'Manual',
        rule: 'Règle',
      },
      riskReasons: {
        repeatedReports: 'Signalements répétés',
        identityRejected: 'Vérification d’identité rejetée',
        payoutCancellations: 'Schéma d’annulations de paiement',
        sessionRefundDisputes: 'Schéma de remboursements ou litiges',
      },
    },
    policies: {
      title: 'Conditions du marketplace',
      description:
        'Examinez et acceptez la politique marketplace active avant de continuer.',
      version: 'Version {0}',
      accepted: 'Acceptée',
      accept: 'Accepter la politique',
      reviewTerms: 'Examiner les conditions',
      teacherTermsRequired: 'Conditions enseignant requises',
      teacherTermsRequiredBody:
        'Acceptez les conditions enseignant actuelles avant de soumettre ce cours à la revue marketplace.',
      refundPolicy: {
        title: 'Politique de remboursement',
        checkoutSummary:
          'Les remboursements sont examinés selon la politique marketplace active. Les abus, services terminés ou violations peuvent être refusés après revue.',
        body: 'Les sessions payantes et achats marketplace sont examinés selon la politique de remboursement active. Les remboursements peuvent être approuvés lorsqu’une session payante ne peut pas être fournie, qu’un enseignant manque le service prévu ou que l’accès à la plateforme échoue. Les abus, services terminés ou violations de politique peuvent être refusés après revue.',
      },
      teacherTerms: {
        title: 'Conditions enseignant',
        onboardingSummary:
          'Avant de soumettre, confirmez que votre cours est original ou correctement licencié, décrit avec exactitude et prêt pour la revue marketplace.',
        body: 'Les enseignants doivent soumettre des références exactes, publier du contenu original ou correctement licencié, répondre professionnellement aux problèmes étudiants, suivre les politiques marketplace et accepter que NexExam puisse examiner, retenir, rejeter ou retirer du contenu créant un risque étudiant, juridique, de paiement ou de plateforme.',
      },
      studentTerms: {
        title: 'Conditions étudiant',
        body: 'Les étudiants doivent utiliser les supports de cours pour leur apprentissage personnel, remettre un travail honnête, éviter le harcèlement ou l’abus de plateforme, respecter la propriété intellectuelle des enseignants et signaler les problèmes de sécurité, qualité ou paiement via les outils de signalement marketplace.',
      },
    },
    report: {
      title: 'Signaler un problème marketplace',
      description:
        'Envoyez ceci à l’équipe sécurité de la plateforme pour revue. Les signalements sont privés pour les admins.',
      reportCourse: 'Signaler un cours ou enseignant',
      detailsPlaceholder:
        'Ajoutez des détails qui aideront l’équipe sécurité à examiner ce signalement.',
      submit: 'Envoyer le signalement',
      reasons: {
        misleadingContent: 'Contenu trompeur',
        unsafeAdvice: 'Conseil dangereux',
        harassment: 'Harcèlement',
        fraud: 'Fraude ou arnaque',
        intellectualProperty: 'Problème de propriété intellectuelle',
        paymentIssue: 'Problème de paiement ou remboursement',
        other: 'Autre',
      },
    },
    success: {
      policyAccepted: 'Politique acceptée',
      reportCreated: 'Signalement envoyé',
      adminActionSaved: 'Action confiance et sécurité enregistrée',
      ruleScanComplete: 'Analyse de risque terminée. {0} alerte(s) créée(s).',
    },
    errors: {
      policyNotFound: 'Politique introuvable',
      policyAcceptanceRequired:
        'Veuillez accepter la politique marketplace actuelle avant de continuer.',
      creatorDisabled:
        'Ce créateur est actuellement désactivé pour l’activité marketplace.',
      courseSafetyHold:
        'Ce cours fait l’objet d’un blocage sécurité et ne peut pas être publié.',
      riskFlagsBlock:
        'Résolvez les alertes confiance et sécurité prioritaires avant publication.',
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
      title: 'Lien de création de compte',
      description:
        'Envoyez un lien d’invitation sécurisé à un futur étudiant ou admin.',
      emailSubject: 'Votre invitation de compte NexExam',
      emailBody: `<p>Bonjour,</p><p>Vous avez été invité à rejoindre {0} sur NexExam.</p><p>Utilisez ce lien sécurisé pour créer votre compte :</p><p><a href="{1}">{1}</a></p><p>Merci,</p><p>L’équipe NexExam</p>`,
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
        'reCAPTCHA est désactivé sur cette plateforme. Vérification ignorée.',
      invalid: 'reCAPTCHA invalide',
    },
  },

  emails: {
    passwordResetEmail: {
      subject: `Réinitialisez votre mot de passe pour {0}`,
      content: `<p>Bonjour,</p> <p> Suivez ce lien pour réinitialiser votre mot de passe {0} pour votre compte. </p> <p><a href="{1}">{1}</a></p> <p> Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer cet email. </p> <p>Merci,</p> <p>Votre équipe {0}</p>`,
    },
    verifyEmailEmail: {
      subject: `Vérifiez votre email pour {0}`,
      content: `<p>Bonjour,</p><p>Suivez ce lien pour vérifier votre adresse email.</p><p><a href="{1}">{1}</a></p><p>Si vous n'avez pas demandé à vérifier cette adresse, vous pouvez ignorer cet email. </p> <p>Merci,</p> <p>Votre équipe {0}</p>`,
    },
    emailChangeEmail: {
      subject: `Approuver le changement d'email pour {0}`,
      content: `<p>Bonjour,</p><p>Vous avez demandé à changer votre adresse email en <strong>{2}</strong>.</p><p>Suivez ce lien pour approuver le changement:</p><p><a href="{1}">{1}</a></p><p>Si vous n'avez pas demandé ce changement, vous pouvez ignorer cet email et votre adresse email restera inchangée.</p><p>Merci,</p><p>Votre équipe {0}</p>`,
    },
    invitationEmail: {
      multiOrganization: {
        subject: `Vous avez été invité à {1} sur {0}`,
        content: `<p>Bonjour,</p> <p>Vous avez été invité à {2}.</p> <p>Suivez ce lien pour vous inscrire.</p> <p><a href="{1}">{1}</a></p> <p>Merci,</p> <p>Votre équipe {0}</p>`,
      },
      singleOrganization: {
        subject: `Vous avez été invité à {0}`,
        content: `<p>Bonjour,</p> <p>Vous avez été invité à {0}.</p> <p>Suivez ce lien pour vous inscrire.</p> <p><a href="{1}">{1}</a></p> <p>Merci,</p> <p>Votre équipe {0}</p>`,
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
    title: 'Achats de cours',
    description:
      'Chaque achat Stripe ponctuel d’un cours payant. Émettez d’abord le remboursement dans Stripe Dashboard, puis marquez-le ici pour révoquer l’accès et annuler le paiement créateur lié.',
    empty: 'Aucun achat de cours pour le moment.',
    columns: {
      buyer: 'Acheteur',
      course: 'Cours',
      amount: 'Montant',
      paidAt: 'Payé le',
      refundedAt: 'Remboursé le',
      actions: 'Actions',
    },
    actions: {
      markRefunded: 'Marquer remboursé',
      cancel: 'Annuler',
      save: 'Enregistrer',
    },
    filters: {
      all: 'Tous',
      active: 'Actifs',
      refunded: 'Remboursés',
    },
    refundDialog: {
      title: 'Marquer l’achat remboursé',
      description:
        'Confirme que vous avez déjà émis le remboursement Stripe. Retire l’accès au cours pour l’acheteur et annule le paiement créateur lié. Cette action est irréversible.',
      reasonLabel: 'Motif du remboursement (facultatif)',
      reasonPlaceholder: 'Note interne pour le journal d’audit',
    },
    badges: {
      paid: 'Payé',
      refunded: 'Remboursé',
    },
  },
  studentOnboarding: {
    title: 'Choisissez vos premiers cours',
    body: 'Choisissez des cours gratuits pour vous inscrire maintenant. Vous pouvez parcourir tout le marketplace à tout moment ; les cours payants sont disponibles sur la page du cours.',
    skip: 'Ignorer pour le moment',
    continue: 'Continuer vers le tableau de bord',
    enrollLabel: 'S’inscrire',
    enrolledLabel: 'Inscrit',
    viewLabel: 'Voir le cours',
    emptyMessage:
      'Nous préparons une nouvelle série de cours. Revenez dès qu’elle est prête.',
  },
  aiTutor: {
    title: 'AI Tutor',
    subtitle: 'Demandez, révisez, planifiez — votre partenaire d’étude.',
    newChat: 'Nouveau chat',
    search: 'Rechercher des conversations',
    untitled: 'Nouveau chat',
    emptyHeroTitle: 'Comment puis-je vous aider à étudier aujourd’hui ?',
    emptyHeroBody:
      'Posez une question, demandez un quiz ou créez un plan d’étude.',
    suggestionExplain: 'Explique ma dernière leçon',
    suggestionQuiz: 'Interroge-moi sur ce module',
    suggestionPlan: 'Crée-moi un plan d’étude sur 7 jours',
    suggestionPractice: 'Donne-moi 12 questions d’entraînement',
    header: {
      openHistory: 'Ouvrir l’historique',
      studyMode: 'Mode étude',
    },
    timer: {
      toggle: 'Afficher ou masquer le minuteur d’étude',
      label: 'Minuteur d’étude',
      close: 'Fermer le minuteur d’étude',
      pause: 'Mettre le minuteur en pause',
      resume: 'Reprendre le minuteur',
    },
    history: {
      todayGroup: 'Aujourd’hui',
      yesterdayGroup: 'Hier',
      previousWeekGroup: '7 derniers jours',
      olderGroup: 'Plus anciennes',
      rename: 'Renommer',
      archive: 'Archiver',
      actions: 'Actions de conversation',
      confirmArchive:
        'Archiver cette conversation ? Vous pourrez la restaurer plus tard.',
      empty: 'Aucune conversation pour le moment — commencez par une question.',
    },
    composer: {
      placeholder: 'Message à AI Tutor',
      sendAriaLabel: 'Envoyer le message',
      stopAriaLabel: 'Arrêter la génération',
      attachComingSoon: 'Pièces jointes bientôt disponibles',
      disclaimer:
        'AI Tutor peut faire des erreurs. Vérifiez les réponses importantes.',
    },
    thread: {
      thinking: 'Réflexion…',
      usingTool: 'Utilisation de {0}…',
      retry: 'Réessayer',
      courseChip: 'Cours : {0}',
      lessonChip: 'Leçon : {0}',
    },
    widgets: {
      headerLabel: 'AI Tutor',
      expand: 'Développer',
      openLesson: 'Ouvrir la leçon',
      continueChat: 'Continuer le chat',
      submitAnswers: 'Envoyer les réponses',
      quiz: {
        title: 'Quiz',
        scorePrefix: 'Score',
        correct: 'Correct',
        incorrect: 'Incorrect',
        reviewExplanation: 'Afficher l’explication',
        tryAgain: 'Réessayer',
      },
      practice: {
        title: 'Entraînement',
        attemptedOf: '{0} sur {1} tentées',
        finish: 'Terminer l’entraînement',
      },
      explain: {
        title: 'Explication',
        openFullLesson: 'Ouvrir la leçon complète',
      },
      summary: {
        title: 'Résumé',
        copyToNotes: 'Copier dans les notes',
      },
      plan: {
        title: 'Plan d’étude',
        savePlan: 'Enregistrer le plan',
        saveSingle: 'Ajouter au plan',
        completed: 'Enregistré',
        daysShort: 'j',
      },
    },
    alerts: {
      limitDaily:
        'Vous avez atteint votre limite quotidienne personnelle AI Tutor. Elle sera réinitialisée demain.',
      limitOrg:
        'Votre organisation a atteint sa limite quotidienne AI Tutor. Elle sera réinitialisée demain.',
      limitGlobal:
        'AI Tutor a atteint sa capacité quotidienne. Veuillez réessayer demain.',
      concurrentRequest:
        'Une autre demande AI Tutor est en cours. Patientez un instant puis réessayez.',
      networkError:
        'Impossible de joindre AI Tutor. Vérifiez votre connexion et réessayez.',
      dismiss: 'Ignorer',
    },
  },

  legal: {
    terms: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Conditions d’utilisation',
      lastUpdated: 'Dernière mise à jour 2026-05-23',
      body: `# Conditions d’utilisation\n\nCes Conditions régissent votre accès à NexExam et son utilisation ("le Service"). En créant un compte, vous acceptez ces Conditions.\n\n## 1. Éligibilité\nVous devez avoir au moins 13 ans. En vous inscrivant, vous confirmez respecter cette exigence d’âge.\n\n## 2. Compte\nVous êtes responsable de la protection de votre mot de passe et de toute activité effectuée avec votre compte. Prévenez-nous immédiatement en cas d’utilisation non autorisée.\n\n## 3. Utilisation acceptable\nAucun contenu illégal, aucune usurpation, aucun scraping, aucun abus automatisé.\n\n## 4. Contenu\nVous conservez la propriété du contenu que vous téléversez. Vous nous accordez une licence pour l’héberger, l’afficher et le traiter selon les besoins d’exploitation du Service.\n\n## 5. Paiements\nLes achats de cours et sessions 1:1 sont facturés via Stripe. Les remboursements sont régis par la politique affichée au paiement.\n\n## 6. Résiliation\nVous pouvez fermer votre compte à tout moment. Nous pouvons suspendre ou résilier les comptes qui enfreignent ces Conditions.\n\n## 7. Avis de non-responsabilité et responsabilité\nLe Service est fourni "tel quel". Dans la mesure maximale permise par la loi, nous rejetons toute garantie.\n\n## 8. Modifications\nNous pouvons mettre à jour ces Conditions. L’utilisation continue après des mises à jour importantes signifie que vous acceptez les Conditions mises à jour.\n\n## 9. Contact\nDes questions ? Écrivez à legal@nexexam.com.`,
    },
    privacy: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Politique de confidentialité',
      lastUpdated: 'Dernière mise à jour 2026-05-23',
      body: `# Politique de confidentialité\n\nCette Politique décrit ce que nous collectons, comment nous l’utilisons et vos droits.\n\n## 1. Ce que nous collectons\nInformations de compte (email, nom, date de naissance), activité de cours, métadonnées de paiement via Stripe, conversations avec le tuteur IA et télémétrie opérationnelle.\n\n## 2. Comment nous l’utilisons\nPour exploiter le Service, personnaliser votre expérience d’étude, traiter les paiements, respecter la loi et communiquer avec vous.\n\n## 3. Partage\nAvec des prestataires de services (Stripe, AWS, livraison d’emails, Anthropic pour le tutorat IA) dans le cadre d’accords de traitement des données. Nous ne vendons pas vos données.\n\n## 4. Vos droits\nVous pouvez demander une copie de vos données ou supprimer votre compte à tout moment depuis les paramètres du compte. Les utilisateurs UE, Royaume-Uni et Canada disposent de droits supplémentaires, dont correction et portabilité.\n\n## 5. Conservation\nLes registres pertinents fiscalement (achats, journaux d’audit) sont conservés selon la loi applicable. Les autres données personnelles sont supprimées dans les 14 jours suivant la suppression du compte.\n\n## 6. Transferts internationaux\nLes données peuvent être traitées hors de votre pays. Nous utilisons des garanties appropriées.\n\n## 7. Enfants\nLe Service ne s’adresse pas aux enfants de moins de 13 ans.\n\n## 8. Modifications\nNous vous informerons des changements importants apportés à cette Politique.\n\n## 9. Contact\nprivacy@nexexam.com.`,
    },
  },

  account: {
    privacyTabLabel: 'Confidentialité et compte',
    delete: {
      cardTitle: 'Supprimer votre compte',
      cardBody:
        'Supprime définitivement votre compte et vos données personnelles. Les registres fiscaux (achats, journaux d’audit) sont conservés comme l’exige la loi.',
      cardAction: 'Supprimer le compte',
      dialogTitle: 'Supprimer votre compte',
      dialogBody:
        'Après 14 jours, votre compte et la plupart des données personnelles seront supprimés. Vous pouvez annuler à tout moment pendant cette période depuis cette page ou le lien email que nous enverrons.',
      dialogAcknowledge: 'Je comprends que cette action est permanente.',
      dialogSubmit: 'Continuer',
      requestSentTitle: 'Vérifiez votre email',
      requestSentBody:
        'Nous avons envoyé un lien de confirmation dans votre boîte de réception. Cliquez dessus sous 24 heures pour confirmer la suppression. Sans confirmation, rien ne change.',
      confirmedSuccessTitle: 'Suppression confirmée',
      confirmedSuccessBody:
        'Votre compte sera supprimé le {0}. Vous pouvez annuler à tout moment avant cette date.',
      confirmedExpiredTitle: 'Ce lien ne peut pas être utilisé',
      confirmedExpiredBody:
        'Le lien de confirmation est invalide ou a déjà été utilisé. Ouvrez les paramètres du compte pour demander un nouveau lien.',
      cancelBannerTitle: 'Votre compte est programmé pour suppression le {0}',
      cancelBannerAction: 'Annuler la suppression',
      cancelledToast: 'Suppression annulée.',
      errors: {
        alreadyDeleted: 'Ce compte a déjà été supprimé.',
      },
    },
    dataExport: {
      cardTitle: 'Télécharger une copie de vos données',
      cardBody:
        'Nous préparerons un fichier JSON avec votre compte, vos cours, notes, chats et autres données personnelles. Vous recevrez un email lorsqu’il sera prêt.',
      cardAction: 'Demander l’export',
      cooldownBody:
        'Réessayez dans {0} heures — un seul export est autorisé par période de 24 heures.',
      statusQueued: 'Préparation',
      statusCompleted: 'Prêt',
      statusFailed: 'Échoué',
      downloadAction: 'Télécharger',
      downloadHint:
        'Les liens de téléchargement expirent après 15 minutes pour des raisons de sécurité. Cliquez à nouveau pour obtenir un nouveau lien.',
      emptyTitle: 'Aucun export pour le moment',
      emptyBody: 'Lorsque vous en demanderez un, il apparaîtra ici.',
      requestedToast: 'Export ajouté à la file. Revenez dans une minute.',
    },
    emailPreferences: {
      cardTitle: 'Préférences email',
      cardBody:
        'Choisissez les emails non essentiels que vous voulez recevoir.',
      marketingLabel: 'Promotions et marketing',
      digestLabel: 'Résumé d’étude hebdomadaire',
      productUpdatesLabel: 'Actualités produit',
      alwaysOnLabel: 'Sécurité et reçus',
      alwaysOnHint:
        'Toujours envoyés — nécessaires à la sécurité du compte et aux paiements. Ne peuvent pas être désactivés.',
      savedToast: 'Préférences enregistrées.',
    },
    mobile: {
      title: 'Apprentissage mobile',
      nativeReady:
        'Cet appareil peut recevoir des rappels de cours et des liens profonds.',
      webReady:
        'Les rappels mobiles sont prêts lorsque vous ouvrez NexExam depuis l’app mobile.',
      browser: 'Navigateur',
      smartReminders: "Rappels d'étude intelligents",
      smartRemindersDescription:
        "Utilise les dates du plan, les cartes, les séries et les dates d'examen.",
      pushReminders: 'Rappels push',
      pushRemindersDescription:
        'Envoie des rappels à votre appareil mobile enregistré.',
      quietHoursStart: 'Début des heures calmes',
      quietHoursEnd: 'Fin des heures calmes',
      save: 'Enregistrer les réglages mobiles',
      requestPush: 'Activer le push',
      syncNow: 'Synchroniser',
      saved: 'Réglages mobiles enregistrés.',
      pushRequested: 'Inscription push actualisée.',
    },
  },

  cookies: {
    bannerTitle: 'Cookies',
    bannerBody:
      'Nous utilisons des cookies pour maintenir votre session et faire fonctionner le Service. Avec votre consentement, nous utiliserons aussi des cookies d’analyse et de marketing.',
    acceptAll: 'Tout accepter',
    essentialOnly: 'Essentiels uniquement',
    customize: 'Personnaliser',
    customizeTitle: 'Préférences de cookies',
    essentialLabel: 'Essentiels',
    essentialBody: 'Nécessaires pour vous connecter et utiliser le Service.',
    analyticsLabel: 'Analytics',
    analyticsBody:
      'Nous aide à comprendre comment le Service est utilisé. Aucune donnée personnelle n’est vendue.',
    marketingLabel: 'Marketing',
    marketingBody: 'Utilisé pour mesurer l’impact de nos communications.',
    save: 'Enregistrer les préférences',
  },

  signup: {
    dateOfBirthLabel: 'Date de naissance',
    dateOfBirthHint:
      'Requise par la loi. Nous l’utilisons uniquement pour vérifier que vous avez au moins 13 ans.',
    termsCheckboxLabel:
      'J’accepte les [Conditions d’utilisation]({0}) et la [Politique de confidentialité]({1}).',
    coppaBlockedTitle: 'Nous ne pouvons pas créer votre compte',
    coppaBlockedBody:
      'Les comptes sur cette plateforme exigent un âge de {0} ans ou plus. Les comptes familiaux avec consentement parental arriveront bientôt.',
    termsRequiredError:
      'Vous devez accepter les Conditions d’utilisation et la Politique de confidentialité pour continuer.',
    privacyRequiredError:
      'Vous devez accepter la Politique de confidentialité pour continuer.',
    dobRequiredError: 'Veuillez saisir votre date de naissance.',
  },
};

export { dictionary };
