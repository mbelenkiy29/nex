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
    backHome: "Retour à l'accueil",
    sidebar: 'Barre latérale',
    sidebarDescription: 'Affiche la barre latérale mobile.',
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
        'Votre profil créateur est approuvé. Vous pouvez créer des cours et les envoyer à l’examen NexExam.',
      applicationRejected:
        'Votre candidature nécessite des modifications avant approbation. Consultez les notes administrateur et renvoyez votre profil.',
      startApplication: 'Commencer la candidature',
      editApplication: 'Mettre à jour la candidature',
      workspaceTitle: 'Espace cours',
      workspaceBody:
        'Utilisez le générateur de cours pour organiser programme, leçons, quiz, examens blancs et objectifs avant l’envoi en examen.',
      reviewTitle: 'Examen de publication',
      reviewBody:
        'Les administrateurs NexExam approuvent les cours envoyés, gèrent la publication au catalogue et vérifient inscriptions, paiements et paramètres de revenus.',
      deferredTitle: 'Paramètres de revenus',
      deferredBody:
        'Le partage des revenus et les détails de paiement sont configurés dans les outils administrateur de chaque cours.',
      metricsTitle: 'Métriques créateur',
      metricsBody:
        'Suivez les inscriptions, la progression, les notes et l’activité de revenus de vos cours.',
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
      masteryMap: 'Carte de maitrise',
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
    nextUnlock: {
      badge: 'Prochain déblocage',
      activeBadge: 'Premium actif',
      title: "Débloquez votre boucle d'apprentissage IA",
      activeTitle: 'Votre boucle premium est prête',
      body: 'Premium transforme vos cours, exercices, notes et tuteur IA en parcours guidé.',
      activeBody:
        'Utilisez les outils IA débloqués pour passer de la progression à une préparation mesurable.',
      aiPlanTitle: "Plan d'étude IA",
      aiPlanBody:
        'Transformez points faibles et échéances en tâches quotidiennes ciblées.',
      practiceTitle: 'Entraînement premium',
      practiceBody:
        'Débloquez plus de questions ciblées et de révisions type examen.',
      certificateTitle: 'Parcours certificat',
      certificateBody: 'Suivez le travail qui mène à une validation vérifiée.',
      subscriptionCta: 'Voir les offres premium',
      coursesCta: 'Parcourir les cours',
      aiTutorCta: 'Ouvrir le tuteur IA',
    },
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
    masteryMap: {
      badge: 'Carte de maitrise',
      title: 'Protegez votre progression',
      body: 'Suivez preparation, points faibles, deblocages, series et certificats qui montrent que votre apprentissage compose.',
      emptyBody:
        'Inscrivez-vous a un cours pour creer votre tendance de preparation, carte de competences, deblocages, serie et parcours certificat.',
      browseCourses: 'Parcourir les cours',
      readinessScore: 'Score de preparation',
      points: 'points',
      openCta: 'Ouvrir la carte de maitrise',
      nextMilestone: 'Prochain jalon de preparation',
      milestoneTarget: '{0} points de preparation',
      milestoneProgress: '{0}% de ce jalon protege',
      unlockedModulesValue: '{0} / {1}',
      certificatesValue: '{0} / {1}',
      streakValue: '{0} jour(s)',
      milestonesTitle: 'Jalons de preparation examen',
      milestonesBody:
        'Chaque jalon rend la progression visible avant le certificat final.',
      milestoneLabels: {
        baseline: 'Base cartographiee',
        momentum: 'Elan construit',
        ready: 'Pret pour examen',
        examReady: 'Preparation finale',
        mastered: 'Maitrise protegee',
      },
      metrics: {
        weakSkills: 'Competences faibles',
        weakSkillsHelper: 'Competences qui peuvent ralentir la preparation.',
        unlockedModules: 'Modules debloques',
        unlockedModulesHelper: 'Zones de cours ouvertes par la progression.',
        certificates: 'Certificats',
        certificatesHelper: 'Parcours de preuve gagnes ou en cours.',
        streak: "Serie d'etude",
        streakHelper: 'Meilleure serie : {0} jour(s)',
      },
      trend: {
        title: 'Tendance de preparation',
        body: 'Des captures quotidiennes montrent si le travail protege ou accelere la progression.',
        chartLabel: 'Graphique de tendance de preparation',
        delta: '+{0}',
        direction: {
          up: 'En hausse',
          down: 'A surveiller',
          flat: 'Stable',
          none: 'Nouvelle tendance',
        },
      },
      premium: {
        title: "L'economie de progression complete se debloque avec premium",
        body: 'Premium relie la carte multi-cours, les prochaines etapes IA et la pratique avancee a la progression construite.',
        cta: 'Voir les offres premium',
      },
      weakSkills: {
        title: 'Competences faibles a proteger',
        body: 'Ciblez les competences qui peuvent freiner la preparation avant de rajouter du nouveau contenu.',
        empty:
          'Aucune competence faible detectee. Terminez exercices ou diagnostics pour les reveler.',
        practiceCta: 'Pratiquer',
      },
      modules: {
        title: 'Modules debloques',
        body: 'Voyez quelles sections sont ouvertes, actuelles, terminees ou en attente de progression precedente.',
        empty: 'Aucun module disponible pour le moment.',
        lessons: '{0} sur {1} lecons',
        status: {
          complete: 'Termine',
          current: 'Actuel',
          unlocked: 'Debloque',
          locked: 'Bloque',
        },
      },
      streaks: {
        title: 'Series qui protegent la progression',
        body: "Les series montrent ou l'activite recente maintient l'elan.",
        dayCount: '{0} jour(s)',
        lastActivity: 'Derniere activite {0}',
        noActivity: 'Aucune activite encore',
      },
      certificates: {
        title: 'Parcours certificats',
        body: 'Les certificats transforment un apprentissage termine en preuve durable.',
        lessons: '{0} sur {1} lecons',
        view: 'Voir',
        status: {
          earned: 'Obtenu',
          inProgress: 'En cours',
          locked: 'Bloque',
          unavailable: 'Indisponible',
          revoked: 'Revoque',
        },
      },
      preview: {
        badge: 'Economie de progression',
        title: 'Carte de maitrise',
        body: 'Montrez la progression que les utilisateurs veulent proteger avant de payer pour accelerer.',
        readiness: 'Preparation',
        streak: 'Serie',
        weakestSkill: 'Competence la plus faible',
        noWeakSkill: 'Aucune faiblesse encore',
        nextMilestone: 'Prochain jalon',
        noMilestone: 'Aucun jalon encore',
        cta: 'Ouvrir la carte',
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

    disable: {
      success: 'Utilisateur désactivé avec succès',
      confirmTitle: "Désactiver l'utilisateur?",
      label: 'Désactiver',
    },

    restore: {
      success: 'Utilisateur restauré avec succès',
      confirmTitle: "Restaurer l'utilisateur?",
      label: 'Restaurer',
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
    activation: {
      title: 'Premium débloqué',
      unlockingTitle: 'Déblocage de votre plan premium',
      unlockingBody:
        'Le paiement est terminé. NexExam ouvre maintenant vos outils premium.',
      retryUnlock: 'Vérifier à nouveau',
      unlockedPlan: 'Votre plan débloqué',
      titleWithPlan: '{0} est actif',
      body: 'Les outils d’étude premium sont maintenant disponibles dans votre espace d’apprentissage.',
      exploreCourses: 'Explorer les cours',
      aiCoachTitle: 'Coach IA',
      aiCoachBody:
        'Générez des plans d’étude et obtenez une aide guidée quand vous bloquez.',
      readinessTitle: 'Indicateurs de préparation',
      readinessBody:
        'Suivez progression, points faibles et prochaines actions au même endroit.',
      practiceTitle: 'Entraînement approfondi',
      practiceBody:
        'Utilisez les parcours premium pour transformer vos points faibles en révision ciblée.',
      openTutor: 'Ouvrir le tuteur IA',
      openPractice: "Commencer l'entraînement",
      openMasteryMap: 'Ouvrir la carte de maitrise',
      openDashboard: 'Aller à mon apprentissage',
    },
    mobileUnavailableTitle: 'Abonnements non disponibles',
    mobileUnavailable:
      'Les abonnements ne sont pas disponibles sur mobile. Veuillez visiter notre site web sur un navigateur de bureau pour gérer votre abonnement.',
    value: {
      eyebrow: "Système d'apprentissage premium",
      title:
        'Abonnez-vous lorsque vous voulez que NexExam guide tout le parcours.',
      body: 'Achetez un cours pour un objectif précis ou débloquez la couche premium avec planification IA, progression multi-cours et entraînement plus approfondi.',
      courseTitle: 'Acheter un cours',
      courseBody:
        'Idéal pour une certification, une classe ou un objectif guidé par un créateur.',
      subscriptionTitle: 'S’abonner à premium',
      subscriptionBody:
        'Idéal pour un coaching IA continu, le suivi de préparation et les outils premium sur plusieurs cours.',
      includedTitle: 'Premium débloque',
      included: [
        "Coach d'étude IA et plans adaptatifs",
        'Insights de préparation entre les cours',
        'Entraînement premium et révision des points faibles',
        "Contexte prioritaire du tuteur IA et historique d'étude enregistré",
      ],
      comparisonTitle: 'Choisissez le chemin adapté à votre objectif',
      comparisonRows: [
        {
          label: 'Valeur principale',
          course: 'Débloquer un cours expert',
          subscription:
            "Débloquer le système d'apprentissage autour de vos cours",
        },
        {
          label: 'Idéal pour',
          course: 'Un examen ou une compétence spécifique',
          subscription: 'Préparation continue et étude guidée',
        },
        {
          label: 'Sensation premium',
          course: 'Programme complet, certificat et devoirs',
          subscription:
            'Coach IA, plan adaptatif, préparation et entraînement approfondi',
        },
      ],
      cardUnlockLabel: 'Déblocages inclus',
    },

    intervals: {
      day: 'Quotidien',
      week: 'Hebdomadaire',
      month: 'Mensuel',
      year: 'Annuel',
    },
    intervalUnits: {
      day: 'jour',
      week: 'semaine',
      month: 'mois',
      year: 'an',
    },
    intervalUnitsPlural: {
      day: 'jours',
      week: 'semaines',
      month: 'mois',
      year: 'ans',
    },
    priceInterval: '/{0}',
    intervalCountLabel: '{0} {1}',

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
  checkoutTrust: {
    badge: 'Paiement sécurisé avec Stripe',
    finalTotal: 'Total final affiché avant paiement : {0}',
    subscriptionRenewal:
      'Renouvellement tous les {0}. Gérez ou annulez avant le prochain renouvellement.',
    courseOneTime:
      "Achat unique du cours. L'accès se débloque après confirmation du paiement.",
    courseBundleOneTime:
      'Achat unique du pack. Les cours inclus se débloquent après confirmation du paiement.',
    aiCreditOneTime:
      'Achat unique de crédits IA. Les crédits sont ajoutés après confirmation du paiement.',
    courseRefund:
      'La politique de remboursement est vérifiée avant le paiement.',
    oneOnOneOneTime:
      'Paiement unique de réservation. Votre session est confirmée après le paiement.',
    oneOnOneHold:
      'Votre créneau est réservé 30 minutes pendant la finalisation du paiement.',
    couponReview:
      'Coupon saisi. Stripe affichera le total remisé avant le paiement.',
    paymentMethods:
      'Cartes, portefeuilles et moyens de paiement locaux apparaissent selon leur disponibilité dans votre région.',
    noSurpriseFees:
      'Aucun frais surprise NexExam. Les taxes ou frais requis sont affichés avant le paiement.',
    secureAfterPayment: 'Payé en toute sécurité avec Stripe',
    checkoutCancelled:
      "Le paiement a été annulé. Aucun paiement n'a été effectué et aucun accès n'a changé.",
    sessionPaymentSuccess:
      'Paiement terminé. Votre session est en cours de confirmation.',
    stripeCustomText: {
      subscriptionSubmit:
        "Paiement d'abonnement sécurisé avec Stripe. Les conditions de renouvellement et le total final sont affichés avant l'abonnement.",
      courseSubmit:
        'Paiement unique sécurisé avec Stripe. Le total final est affiché avant de payer.',
      courseBundleSubmit:
        'Paiement de pack sécurisé avec Stripe. Le total final est affiché avant de payer.',
      aiCreditPackSubmit:
        'Paiement de crédits IA sécurisé avec Stripe. Le total final est affiché avant de payer.',
      oneOnOneSessionSubmit:
        'Paiement de réservation sécurisé avec Stripe. Votre créneau reste réservé pendant le paiement.',
      afterSubmit:
        "NexExam débloque l'accès seulement après confirmation du paiement par Stripe.",
    },
  },
  pricing: {
    recommended: 'Recommandé',
    savingsBadge: 'Économisez {0}%',
    oneTime: 'Paiement unique',
    perMonth: 'par mois',
    perYear: 'par an',
    choosePackage: 'Choisir le pack',
    buyCredits: 'Acheter des crédits',
    buyBundle: 'Acheter le pack',
    addAiCredits: 'Ajouter des crédits IA',
    aiTokensIncluded: '{0} tokens IA inclus',
    aiCreditShelfTitle: 'Packs de crédits IA',
    aiCreditShelfBody:
      "Pour un usage plus intensif du tuteur IA et des plans d'étude, ajoutez de la capacité en tokens sans changer d'abonnement.",
    aiCreditPurchaseSuccess:
      'Crédits IA achetés. Votre capacité IA supplémentaire est disponible.',
    bundlePurchaseSuccess:
      'Pack acheté. Les cours inclus sont en cours de déblocage.',
    coursePurchaseDescription:
      'Un paiement débloque ce cours, les exercices, les prompts du tuteur IA et le parcours de certificat.',
    lifetimeAccessName: 'Accès à vie : {0}',
    lifetimeAccessDescription:
      'Accès à vie à un cours sélectionné, sans renouvellement.',
    benefits: {
      coursePurchase: [
        'Leçons du cours et exercices',
        'Prompts de démarrage du tuteur IA',
        'Parcours de certificat',
      ],
      lifetime: [
        'Accès à vie pour ce cours sélectionné',
        'Futures mises à jour du cours incluses',
        'Aucune date de renouvellement',
      ],
      bundle: [
        'Tous les cours inclus',
        'Un paiement pour tout le parcours',
        'Certificats pour les cours éligibles',
      ],
      aiCredits: [
        'Capacité supplémentaire du tuteur IA',
        "Fonctionne avec les plans d'étude et les explications",
        'Les crédits inutilisés restent sur votre compte',
      ],
    },
  },
  contextualPaywall: {
    badges: {
      personalized_onboarding_result: 'Plan personnel prêt',
      diagnostic_result: 'Diagnostic terminé',
      preview_lesson_complete: 'Aperçu terminé',
      ai_full_plan: 'Plan IA complet',
      locked_certificate: 'Parcours de certificat',
      locked_practice_exam: 'Examen blanc',
    },
    titles: {
      personalized_onboarding_result:
        'Transformez votre objectif en parcours débloqué',
      diagnostic_result: 'Transformez ce résultat en plan ciblé',
      preview_lesson_complete: 'Continuez avec le cours complet',
      ai_full_plan: "Débloquez le plan d'étude IA complet",
      locked_certificate: 'Accélérez ce parcours de certificat',
      locked_practice_exam: 'Débloquez une préparation plus approfondie',
    },
    bodies: {
      personalized_onboarding_result:
        'Votre plan montre le rythme de départ. L’accès payant débloque programme complet, guidage adaptatif, pratique approfondie et parcours de certificat liés à cet objectif.',
      diagnostic_result:
        'Premium transforme votre score de diagnostic en priorités de compétences faibles, pratique ciblée et jalons de préparation.',
      preview_lesson_complete:
        "L'aperçu a montré le point de départ. Débloquez les leçons restantes, les exercices, les prompts du tuteur et le parcours de certificat.",
      ai_full_plan:
        "Un plan complet utilise votre préparation, vos compétences faibles, votre progression et votre historique d'exercices pour guider les prochaines étapes.",
      locked_certificate:
        'Premium relie ce parcours de certificat à la préparation, aux rappels et au guidage IA pendant que votre progression débloque le certificat.',
      locked_practice_exam:
        "Premium ajoute simulation d'examen, signaux de préparation et suivi IA pour rendre la pratique mesurable.",
    },
    bullets: {
      personalized_onboarding_result: [
        'Jalons reliés à votre calendrier',
        'Cours recommandés selon votre objectif',
        'Guidage IA et pratique approfondie après déblocage',
      ],
      diagnostic_result: [
        'Compétences faibles priorisées depuis vos réponses',
        'Pratique recommandée liée à la préparation',
        "Coaching IA pour la prochaine session d'étude",
      ],
      preview_lesson_complete: [
        'Programme complet et leçons verrouillées',
        'Examens blancs et devoirs pratiques',
        'Contexte du tuteur IA et parcours de certificat',
      ],
      ai_full_plan: [
        'Tâches créées depuis la progression du cours',
        "Zones faibles et historique d'exercices inclus",
        'Raisonnement IA transparent et contrôles de confidentialité',
      ],
      locked_certificate: [
        'Jalons du certificat toujours visibles',
        'Préparation et séries reliées à la progression',
        'Guidage IA sur la prochaine étape à terminer',
      ],
      locked_practice_exam: [
        "Flux réaliste de simulation d'examen",
        'Signaux de préparation après les tentatives',
        'Suivi IA ciblé sur les zones faibles',
      ],
    },
    cta: {
      subscription: 'Débloquer Premium',
      course: 'Débloquer le cours',
      aiCredits: 'Ajouter des crédits IA',
      viewPlans: 'Voir les offres',
      checkoutPending: 'Préparation du checkout...',
    },
    errors: {
      checkoutUnavailable: "Le checkout n'est pas disponible pour ce pack.",
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
      name: "Nom de l'examen (par ex. FINRA SIE)",
      code: "Code court de l'examen (par ex. SIE, SERIES7)",
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
      aiTutorPrompt: 'Invite AI Tutor',
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
      aiTutorPrompt: 'Invite système pour le tuteur IA du chapitre',
      objectives: "Objectifs d'apprentissage de ce chapitre",
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
      content: 'Contenu de la leçon (Markdown pris en charge)',
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
      correctAnswerIndex: 'Index de la bonne réponse',
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
      correctAnswerIndex: "Index à partir de zéro de l'option correcte",
      answerOptions:
        "Saisissez une option par ligne. L'entraînement étudiant utilise uniquement les questions avec des options de réponse.",
      explanation: 'Pourquoi la bonne réponse est correcte',
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
      conceptCode: 'Identifiant stable (type slug)',
      explanation: 'Explication complète (Markdown)',
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
      timeLimitMinutes: 'Limite de temps (minutes)',
      passingScore: 'Passing Score',
      maxAttempts: 'Max Attempts',
      shuffleQuestions: 'Shuffle Questions',
      showAnswersImmediately: 'Afficher les réponses immédiatement',
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
      name: 'par ex. examen blanc complet, quiz rapide, entraînement par domaine',
      passingScore: 'Pourcentage requis pour réussir',
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
      timeSpentSeconds: 'Temps passé (secondes)',
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
      noResults: "Aucune note d'étude trouvée.",
      empty:
        "Vous n'avez pas encore créé de notes d'étude. Commencez par créer votre première note.",
    },

    importer: {
      title: "Importer des notes d'étude",
      menu: "Importer des notes d'étude",
    },

    export: {
      success: "Notes d'étude exportées avec succès",
    },

    new: {
      menu: "Nouvelle note d'étude",
      title: "Nouvelle note d'étude",
      success: "Note d'étude créée avec succès",
    },

    view: {
      title: "Afficher la note d'étude",
    },

    edit: {
      menu: "Modifier la note d'étude",
      title: "Modifier la note d'étude",
      success: "Note d'étude mise à jour avec succès",
    },

    restore: {
      success: "Note d'étude restaurée avec succès",
      confirmTitle: "Restaurer la note d'étude ?",
    },

    restoreMany: {
      success: "Notes d'étude restaurées avec succès",
      noSelection:
        "Vous devez sélectionner au moins une note d'étude à restaurer.",
      confirmTitle: "Restaurer les notes d'étude ?",
      confirmDescription:
        "Voulez-vous vraiment restaurer les {0} notes d'étude sélectionnées ?",
    },

    archiveMany: {
      success: "Notes d'étude archivées avec succès",
      noSelection:
        "Vous devez sélectionner au moins une note d'étude à archiver.",
      confirmTitle: "Archiver les notes d'étude ?",
      confirmDescription:
        "Voulez-vous vraiment archiver les {0} notes d'étude sélectionnées ?",
    },

    archive: {
      success: "Note d'étude archivée avec succès",
      confirmTitle: "Archiver la note d'étude ?",
    },

    deleteMany: {
      success: "Notes d'étude supprimées avec succès",
      noSelection:
        "Vous devez sélectionner au moins une note d'étude à supprimer.",
      confirmTitle: "Supprimer les notes d'étude ?",
      confirmDescription:
        "Voulez-vous vraiment supprimer les {0} notes d'étude sélectionnées ?",
    },

    delete: {
      success: "Note d'étude supprimée avec succès",
      confirmTitle: "Supprimer la note d'étude ?",
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
      content: 'Corps de la note (Markdown pris en charge)',
    },

    mcpDescription: {
      list: "Récupère une liste paginée de notes d'étude avec des filtres avancés. Prend en charge les filtres par champs et entités liées. Renvoie les détails, relations et métadonnées.",
      get: "Récupère les informations détaillées d'une note d'étude par son ID unique, avec relations, pièces jointes et métadonnées d'audit.",
      create:
        "Crée une nouvelle note d'étude avec ses champs, relations, pièces jointes et propriétés personnalisées.",
      update:
        "Met à jour une note d'étude existante et enregistre automatiquement la modification dans les journaux d'audit.",
      delete:
        "Supprime définitivement une ou plusieurs notes d'étude. Cette action est irréversible.",
      archive:
        "Archive une ou plusieurs notes d'étude pour les masquer des vues par défaut sans supprimer leurs données.",
      restore:
        "Restaure des notes d'étude archivées afin qu'elles réapparaissent dans les vues par défaut.",
      autocomplete:
        "Recherche des suggestions de notes d'étude pour les champs de saisie semi-automatique et les sélecteurs.",
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
      sourceFiles:
        'Téléversez les documents sources du programme (50 Mo max chacun)',
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
      noResults: 'Aucun cours trouvé.',
      empty: 'Les cours publiés apparaîtront ici lorsqu’ils seront prêts.',
      sortLabel: 'Sort',
      sortTrending: 'Trending',
      sortTopRated: 'Top rated',
      sortNewest: 'Newest',
      sortMostPopular: 'Most popular',
      sortPriceAsc: 'Prix (croissant)',
      sortPriceDesc: 'Prix (décroissant)',
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
      allCourses: 'Tous les cours',
      viewModeLabel: 'Vue du catalogue',
      cardView: 'Cartes',
      listView: 'Liste',
      page: 'Page',
    },
    freeSample: {
      badge: 'Échantillon gratuit',
      title: 'Obtenez un vrai résultat avant de payer',
      body: 'Prévisualisez une vraie leçon, puis faites un court diagnostic pour que le déverrouillage ressemble à l’étape suivante.',
      loading: 'Préparation de votre échantillon gratuit...',
      previewLesson: 'Leçon d’aperçu',
      startPreview: 'Commencer l’aperçu',
      completePreview: 'Terminer l’aperçu',
      previewComplete: 'Aperçu terminé',
      emptyPreview:
        'Cette leçon d’aperçu est prête, mais le créateur n’a pas encore ajouté de blocs de contenu.',
      resourcesTitle: 'Ressources de l’aperçu',
      diagnosticBadge: 'Bilan initial',
      diagnosticTitle: 'Faites le court diagnostic',
      diagnosticBody:
        'Répondez à quelques questions pour voir où le cours complet peut vous faire progresser le plus vite.',
      signInTitle: 'Enregistrez votre résultat',
      signInBody:
        'Connectez-vous pour faire le diagnostic et garder le score lié à ce cours.',
      signInCta: 'Se connecter pour continuer',
      noQuestions:
        'Ce cours ne contient pas encore de questions diagnostiques utilisables.',
      previewFirstTitle: 'Terminez d’abord l’aperçu',
      previewFirstBody:
        'Terminez la leçon d’échantillon pour déverrouiller votre court résultat diagnostique.',
      questionCount: '{0} questions diagnostiques',
      startDiagnostic: 'Commencer le diagnostic',
      answered: '{0} sur {1} répondues',
      saveAnswer: 'Enregistrer la réponse',
      readyToScoreTitle: 'Prêt à noter',
      readyToScoreBody:
        'Toutes les questions d’échantillon sont répondues. Notez le diagnostic pour voir le prochain déverrouillage.',
      completeDiagnostic: 'Noter le diagnostic',
      resultTitle: 'Votre résultat initial',
      resultBody:
        'Vous avez maintenant un point de départ. Déverrouillez le cours complet pour poursuivre cet élan.',
      scoreLabel: 'Score',
      weakDomains: 'Compétences faibles',
      noWeakDomains:
        'Aucune compétence faible détectée dans ce court échantillon.',
      reviewAnswers: 'Révision des réponses',
      correct: 'Correct',
      incorrect: 'À revoir',
      errors: {
        premiumOnly:
          'Les échantillons gratuits sont réservés aux cours premium.',
      },
    },
    marketplace: {
      savedDefaultName: 'Saved courses',
      duration: 'Duration',
      noDuration: 'Aucune durée définie',
      durationHours: '{0} hr',
      durationBuckets: {
        short: 'Under 2 hours',
        medium: '2-8 hours',
        long: '8+ hours',
      },
      learners: 'learners',
      creator: 'Creator',
      creatorProfile: 'Creator profile',
      viewCreator: 'Voir le profil du créateur',
      couponCode: 'Coupon code',
      couponPlaceholder: 'Saisir un code promo',
      unsave: 'Retirer le cours enregistré',
      compare: 'Compare',
      compareLimit: 'Vous pouvez comparer jusqu’à 4 cours.',
      compareSelected: '{0} selected',
      compareHint:
        'Comparez le prix, les résultats, les preuves et la structure du cours.',
      noCompareCourses: 'Sélectionnez des cours du catalogue à comparer.',
      bundles: 'Course bundles',
      bundle: 'Bundle',
      coursesIncluded: 'courses included',
      creatorStats: '{0} cours · {1} apprenants',
      creatorCourses: 'Published courses',
      proof: {
        badge: 'Preuve du cours',
        title: 'Pourquoi les apprenants paient pour ce cours',
        outcomeLabel: 'Résultat exemple',
        outcomeValue: 'Résultat clair',
        outcomeFallback:
          'Prévisualisez la promesse du cours avant de débloquer le parcours complet.',
        completionLabel: 'Preuve de progression',
        completionRateValue: '{0}% de complétion',
        completionRateHelper: '{0} apprenants sur {1} ont terminé ce cours.',
        learnerCountValue: '{0} apprenants',
        learnerCountHelper:
          'Le nombre d’apprenants est affiché jusqu’à ce qu’il y ait assez de complétions.',
        reviewsLabel: 'Avis vérifiés',
        reviewsValue: '{0} avis',
        reviewsEmptyValue: 'Avis en cours',
        reviewsEmptyHelper:
          'Les avis publics apparaissent après les retours des apprenants inscrits.',
        previewLabel: 'Aperçu du programme',
        previewValue: '{0} aperçus gratuits',
        previewHelper: '{0} leçons visibles avant achat.',
        creatorVerified: 'Vérifié par NexExam',
        creatorProfileFallback: 'Créateur du cours',
        credentials: 'Qualifications',
        expertise: 'Expertise',
        refundTitle: 'Politique de remboursement',
        refundBadge: 'Politique revue',
        previewCurriculumTitle: 'Prévisualisez le programme',
        previewCurriculumBody:
          '{0} leçons en aperçu gratuit et {1} leçons disponibles après achat.',
        certificatesIssued: '{0} certificats délivrés',
        standaloneLessons: 'Leçons supplémentaires',
        freePreview: 'Aperçu gratuit',
        lockedAfterPurchase: 'Débloquer après achat',
        reviewsTitle: 'Avis d’apprenants vérifiés',
        reviewsBody:
          'Avis publics d’apprenants inscrits ou acheteurs de ce cours.',
        verifiedLearner: 'Apprenant vérifié',
        noReviewsTitle: 'Les avis sont encore en cours',
        noReviewsBody:
          'Les retours d’apprenants vérifiés apparaîtront ici après publication d’un avis public.',
      },
      unlock: {
        badge: 'Débloquer',
        title: 'Ce que vous débloquez',
        paidTitle: "Débloquez l'expérience complète du cours",
        subscriptionTitle: 'Inclus avec l’accès premium',
        body: 'Prévisualisez le résultat avant de payer, puis débloquez le parcours complet.',
        paidBody:
          'Votre achat débloque les leçons, exercices, devoirs et le parcours de fin de ce cours.',
        subscriptionBody:
          'Premium relie ce cours à la planification IA, à la préparation et à l’entraînement continu.',
        courseCardPaid:
          'Débloque le programme complet, l’entraînement et le certificat',
        courseCardSubscription:
          'L’accès premium débloque la couche d’étude guidée',
        courseCardFree: 'Commencez gratuitement et prenez de l’élan',
        previewLesson: 'Aperçu gratuit',
        lockedLesson: 'Verrouillé',
        availableAfterPurchase: 'Disponible après achat',
        previewAvailable: 'Aperçu disponible',
        items: [
          'Bibliothèque complète de leçons et ressources',
          'Devoirs, quiz et examens blancs',
          'Contexte du tuteur IA et coach d’étude du cours',
          'Parcours certificat et preuve de progression',
        ],
      },
    },
    certificate: {
      title: 'Certificat de réussite',
      view: 'View certificate',
      print: 'Print certificate',
      verified: 'Verified completion',
      awardedTo: 'Awarded to',
      learner: 'Learner',
      completedCourse: 'for completing',
      issuedAt: 'Issued',
      number: 'Certificate number',
      verificationCode: 'Verification code',
      verifyHint: 'Vérifiez ce certificat avec le code {0}.',
    },
    detail: {
      title: 'Course Detail',
      enrolled: 'Enrolled',
      notEnrolled: 'Not enrolled',
    },
    activation: {
      title: 'Cours débloqué',
      loading: 'Préparation de votre cours débloqué...',
      unlockingTitle: 'Déblocage de votre cours',
      unlockingBody:
        'Le paiement est terminé. NexExam ouvre {0} et vous inscrit maintenant.',
      retryUnlock: 'Vérifier à nouveau',
      viewCourse: 'Voir le cours',
      unlockedPlan: 'Votre plan débloqué',
      startLesson: 'Commencer la leçon recommandée',
      openPlayer: 'Ouvrir le lecteur du cours',
      whatUnlocked: 'Ce qui est ouvert',
      aiTutor: 'Tuteur IA',
      included: 'Inclus',
      recommendedLesson: 'Première leçon recommandée',
      noLesson: 'Ce cours n’a pas encore de leçon visible.',
      practiceSet: 'Premier exercice',
      practiceQuestions: '{0} questions d’entraînement prêtes',
      startPractice: "Commencer l'entraînement",
      practiceUnavailable: 'Entraînement pas encore disponible',
      certificatePath: 'Parcours du certificat',
      certificateProgress: '{0} leçons sur {1} terminées',
      certificateLocked: 'Terminez le cours pour débloquer votre certificat.',
      certificateUnavailable:
        'Ce cours ne comprend pas actuellement de certificat.',
      aiTutorStarter: 'Prompt de départ du tuteur IA',
      aiTutorPromptLesson:
        'Je viens de débloquer {0}. Aidez-moi à commencer par {1} et donnez-moi une première étape claire.',
      aiTutorPromptCourse:
        'Je viens de débloquer {0}. Aidez-moi à créer une première étape d’étude claire.',
      askTutor: 'Demander au tuteur IA',
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
      description: 'Créez, publiez et gérez les cours de toute la plateforme.',
      content: 'Course content',
      enrollments: 'Enrollments',
      reviewSubmission: 'Review submission',
      newCourse: 'New course',
      linkedContent: 'Contenu de cours lié',
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
      stripePriceId: 'ID de prix Stripe',
      lifetimeAccessEnabled: 'Accès à vie disponible',
      lifetimePriceCents: 'Prix à vie (centimes)',
      lifetimeStripePriceId: 'ID de prix Stripe pour accès à vie',
      subscriptionPlanKey: 'Clé du forfait d’abonnement',
      creatorRevenueShareBps: 'Part de revenus du créateur (bps)',
      platformRevenueShare: 'Part de revenus de la plateforme (bps)',
      nexVerified: 'Nex Verified',
      creatorUserId: 'ID utilisateur du créateur',
      creatorMemberId: 'ID membre du créateur',
      creatorOrganizationId: 'ID organisation du créateur',
      modules: 'Modules',
      lessons: 'Lessons',
      assignments: 'Assignments',
      lessonContent: 'Lesson text',
      videoFiles: 'Video files',
      prompt: 'Prompt',
      dueDate: 'Due date',
      dueDaysAfterEnroll: 'Jours avant échéance après inscription',
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
      lessonCompleted: 'Leçon marquée comme terminée.',
      assignmentSubmitted: 'Homework submitted.',
      courseSaved: 'Course saved.',
      courseUnsaved: 'Cours retiré des favoris.',
      studentEnrolled: 'Student enrolled.',
      submissionReviewed: 'Submission reviewed.',
      quizSubmitted: 'Quiz submitted.',
      ratingSaved: 'Note du cours enregistrée.',
      purchased: 'Achat terminé : vous êtes inscrit.',
    },
    notify: {
      coursePurchaseConfirmedTitle: 'Achat du cours confirmé',
      coursePurchaseConfirmedBody:
        'Vous êtes maintenant inscrit à {0}. Commencez à apprendre à tout moment.',
      courseRefundedTitle: 'Course refunded',
      courseRefundedBody:
        'Votre achat de {0} a été remboursé. L’accès a été supprimé.',
    },
    errors: {
      manualEnrollmentOnly:
        'Ce cours nécessite un accès manuel, payant ou par abonnement avant l’inscription.',
      invalidCourseLink:
        'Ce cours ne peut pas être lié depuis l’organisation actuelle.',
      submissionRequired:
        'Ajoutez du texte ou des fichiers avant de remettre le devoir.',
      submissionPendingReview:
        'Ce devoir a déjà été remis et attend une révision.',
      submissionComplete: 'Ce devoir est déjà terminé.',
      resubmissionNotAllowed:
        'Les nouvelles soumissions ne sont pas autorisées pour ce devoir.',
      maxAttemptsReached:
        'Vous avez atteint le nombre maximal de tentatives pour ce devoir.',
      invalidRubricScore:
        'Les scores de la grille doivent respecter les critères et limites de points.',
      invalidSubmissionReviewStatus:
        'Choisissez terminé ou à réviser lors de l’évaluation du devoir.',
      ratingRequiresEnrollment: 'Inscrivez-vous à ce cours avant de le noter.',
      reviewNotPending: 'Ce cours n’est pas en attente de révision.',
      editLockedNotDraft:
        'Repassez le cours en brouillon avant de modifier son contenu.',
      submitNotDraft: 'Seul un cours en brouillon peut être soumis à révision.',
      submitNeedsContent:
        'Complétez la checklist de publication (titre, description, vignette, un module, au moins 3 leçons, une évaluation et des résultats) avant de soumettre.',
      cannotWithdraw: 'Seul un cours en révision ou publié peut être retiré.',
      examAlreadySubmitted:
        'Cette tentative d’examen blanc a déjà été soumise.',
      categoryInUse:
        'Cette catégorie ne peut pas être supprimée tant que des cours y sont associés.',
      coursePaymentNotConfigured:
        'Ce cours n’est pas encore prêt à l’achat. Veuillez réessayer plus tard.',
      alreadyEnrolled: 'Vous êtes déjà inscrit à ce cours.',
      invalidCoupon: 'Ce coupon ne peut pas être appliqué à ce cours.',
      couponLimitReached: 'Ce coupon a déjà été utilisé.',
      videoTranscriptNoVideo:
        'Téléversez une vidéo de leçon avant de demander une transcription.',
    },
    ratings: {
      title: 'Course rating',
      summary: '{0} ({1})',
      noRatings: 'Aucune note pour le moment',
      commentPlaceholder:
        'Partagez ce qui a aidé ou ce qui pourrait être amélioré...',
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
      outline: 'Plan du cours et contenu d’étude :',
      focusedLesson: 'Current lesson',
      completed: 'completed',
      assignment: 'Assignment',
      linkedContent: 'Ressources d’examen, d’entraînement et d’étude liées :',
      videoTranscript: 'Transcription vidéo',
    },
    videoTranscript: {
      title: 'Transcription vidéo',
      statusLabel: 'Transcription',
      retry: 'Relancer la transcription',
      retryQueued: 'Nouvelle tentative de transcription mise en file.',
      status: {
        notRequested: 'Aucune transcription demandée',
        queued: 'Transcription en file',
        processing: 'Transcription en cours',
        ready: 'Transcription prête',
        failed: 'Échec de la transcription',
      },
    },
    studyAi: {
      actions: {
        sectionTitle: 'Outils d’étude IA',
        explainLesson: 'Expliquer cette leçon',
        summarizeLesson: 'Résumer cette leçon',
        quizMe: 'Me faire un quiz sur ce module',
        generatePractice: 'Practice questions',
      },
      result: {
        explainTitle: 'Lesson explained',
        summarizeTitle: 'Lesson summary',
        generating: 'Thinking…',
        streamError:
          'Une erreur est survenue pendant la génération. Réessayez.',
        retry: 'Try again',
      },
      quiz: {
        quizTitle: 'Quick quiz',
        practiceTitle: 'Practice questions',
        generating: 'Création de vos questions…',
        intro: 'Répondez à chaque question, puis vérifiez vos résultats.',
        start: 'Start',
        submit: 'Check answers',
        next: 'Next',
        previous: 'Back',
        retake: 'New set',
        questionProgress: 'Question {0} of {1}',
        yourScore: 'You scored {0}%',
        correctCount: '{0} of {1} correct',
        passed: 'Great work!',
        failed: 'Continuez à vous entraîner : révisez les sujets ci-dessous.',
        domainBreakdown: 'By topic',
        correct: 'Correct',
        incorrect: 'Incorrect',
        noQuestions:
          'Aucune question n’a pu être générée. Essayez un module avec plus de contenu.',
        aiDisclaimer:
          'Entraînement généré par IA : non pris en compte dans la note du cours.',
      },
      coach: {
        title: 'Study coach',
        weakAreasTab: 'Weak areas',
        whatNextTab: 'What next',
        studyPlanTab: 'Study plan',
      },
      weakness: {
        heading: 'Là où vous perdez des points',
        empty:
          'Passez un quiz ou un examen blanc et vos points faibles apparaîtront ici.',
        weakest: 'Weakest topic',
        scoreLabel: '{0}% ({1}/{2})',
      },
      whatNext: {
        heading: 'Que dois-je étudier ensuite ?',
        generate: 'Get a recommendation',
        regenerate: 'Refresh recommendation',
        generating: 'Réflexion en cours…',
        empty:
          'Obtenez une recommandation IA selon vos progrès et points faibles.',
      },
      studyPlan: {
        heading: 'Study plan',
        empty:
          'Aucun plan d’étude pour le moment. Générez-en un ou ajoutez vos tâches.',
        generate: 'Générer un plan d’étude',
        regenerate: 'Regenerate plan',
        generating: 'Création de votre plan…',
        addItem: 'Add task',
        addPlaceholder: 'Nouvelle tâche d’étude',
        markDone: 'Mark done',
        markTodo: 'Marquer comme non terminé',
        deleteItem: 'Delete',
        aiBadge: 'AI',
        noDate: 'No date',
        remaining: '{0} of {1} done',
      },
      examDate: {
        title: 'Date cible de l’examen',
        set: 'Définir la date d’examen',
        edit: 'Edit',
        dateLabel: 'Exam date',
        nameLabel: 'Nom de l’examen (facultatif)',
        namePlaceholder: 'e.g. SIE exam',
        save: 'Save',
        none: 'Aucune date d’examen définie.',
        daysRemaining: '{0} jours avant votre examen',
        examToday: 'Votre examen a lieu aujourd’hui. Bonne chance !',
        examPast: 'La date de votre examen est passée.',
      },
      errors: {
        busy: 'Une autre demande d’étude IA est encore en cours. Attendez sa fin.',
        limitReached:
          'La limite quotidienne d’utilisation de l’IA est atteinte. Elle sera réinitialisée demain.',
        notConfigured:
          'Les outils d’étude IA ne sont pas disponibles pour le moment.',
        parseFailed: 'L’IA a renvoyé une réponse illisible. Réessayez.',
        unexpectedQuizFormat:
          'L’IA a renvoyé des questions inutilisables. Essayez un module avec plus de contenu.',
        moduleNoContentQuiz:
          'Ce module n’a pas encore de contenu de leçon pour un quiz.',
        moduleNoContentPractice:
          'Ce module n’a pas encore de contenu de leçon pour des questions d’entraînement.',
        enrollToSetExamDate:
          'Inscrivez-vous au cours avant de définir une date d’examen.',
        unexpectedResponse:
          'L’IA a renvoyé une recommandation inattendue. Réessayez.',
        unexpectedStudyPlan:
          'L’IA a renvoyé un plan d’étude inattendu. Réessayez.',
        courseScopedRequired:
          'Cet outil d’étude ne peut être utilisé que depuis un cours actif.',
        lessonRequired:
          'Sélectionnez une leçon avant d’utiliser cet outil d’étude.',
        moduleRequired:
          'Sélectionnez un module avant d’utiliser cet outil d’étude.',
        signInStudyPlan: 'Connectez-vous pour créer un plan d’étude.',
        unknownStudyTool: 'Outil d’étude inconnu : {0}',
        generic: 'Une erreur est survenue. Réessayez.',
      },
    },
    builder: {
      menu: 'My Courses',
      title: 'Course Builder',
      description: 'Créez, prévisualisez et publiez vos propres cours.',
      newCourse: 'New course',
      emptyCourses: 'Vous n’avez pas encore créé de cours.',
      createFirst: 'Créer votre premier cours',
      continueBuilding: 'Continue building',
      updatedAt: 'Updated {0}',
      completionLabel: '{0}% ready',
      nextRecommended: 'Next: {0}',
      verifyRequired:
        'Terminez la vérification créateur pour créer et publier des cours.',
      verifyCta: 'Aller à la vérification créateur',
      loadError: 'Ce cours n’a pas pu être chargé.',
      backToCourses: 'Retour à mes cours',
      details: 'Course details',
      detailsBody:
        'Le titre, le résumé et les médias de couverture que les apprenants voient en premier.',
      curriculum: 'Curriculum',
      curriculumBody:
        'Ajoutez des modules, puis glissez les leçons, quiz et devoirs dans l’ordre.',
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
      noModules:
        'Aucun module pour le moment. Ajoutez votre premier module pour commencer.',
      noItems:
        'Aucune leçon, aucun quiz ni devoir dans ce module pour le moment.',
      noQuestions:
        'Aucune question pour le moment. Ajoutez votre première question.',
      rubricCriterionLabel: 'Rubric criterion',
      noRubricCriteria: 'Aucun critère de grille pour le moment.',
      submissionsTitle: 'Homework review',
      submissionsBody:
        'Révisez les remises, notez les critères de grille et envoyez des retours.',
      dragHint: 'Glisser pour réordonner',
      videoUpload: 'Upload video',
      videoEmbedHint:
        'Ou collez un lien YouTube ou Vimeo à intégrer au lieu de téléverser.',
      resourcesHint:
        'Joignez des fiches, diapositives ou autres fichiers que les apprenants peuvent télécharger.',
      contentHint: 'Le texte de la leçon prend en charge Markdown.',
      isPreviewLesson: 'Leçon d’aperçu gratuite',
      correctOption: 'Correct answer',
      previewBanner:
        'Aperçu apprenant : voici l’expérience du cours côté apprenant.',
      backToBuilder: 'Retour au créateur de cours',
      statusDraft: 'Brouillon : vous seul pouvez voir ce cours.',
      statusInReview: 'En révision : un administrateur examine ce cours.',
      statusPublished: 'Publié : les apprenants peuvent s’inscrire à ce cours.',
      statusArchived: 'Archived.',
      reviewNotesTitle: 'Modifications demandées par le réviseur',
      submitConfirm: 'Soumettre ce cours à la révision administrative ?',
      withdrawConfirm:
        'Retirer ce cours de la révision et le repasser en brouillon ?',
      unpublishConfirm:
        'La dépublication repasse le cours en brouillon et retire l’accès aux apprenants inscrits. Continuer ?',
      unsavedChanges: 'Vous avez des modifications non enregistrées.',
      saveFirst: 'Enregistrez vos modifications avant de continuer.',
      actions: {
        save: 'Save draft',
        submitForReview: 'Soumettre à révision',
        withdraw: 'Retirer de la révision',
        unpublish: 'Unpublish',
        preview: 'Aperçu apprenant',
        edit: 'Edit course',
        addModule: 'Add module',
        addLesson: 'Add lesson',
        addQuiz: 'Add quiz',
        addAssignment: 'Add homework',
        addRubricCriterion: 'Ajouter un critère de grille',
        saveFeedback: 'Save feedback',
        addQuestion: 'Add question',
        addOption: 'Add option',
        remove: 'Remove',
        addPracticeExam: 'Ajouter un examen blanc',
        addExamRule: 'Ajouter une règle de domaine',
        addOutcome: 'Add outcome',
        addRequirement: 'Add requirement',
        addFlashcardSet: 'Ajouter un jeu de cartes mémoire',
        addFlashcard: 'Add card',
        applyMiniTemplate: 'Appliquer le modèle de mini-cours',
        create: 'Create course',
      },
      quizSettings: {
        timeLimit: 'Limite de temps (min)',
        maxAttempts: 'Max attempts',
        randomizeQuestions: 'Shuffle questions',
        randomizeAnswers: 'Shuffle answers',
        showExplanations: 'Show explanations',
        allowRetries: 'Allow retries',
      },
      examSettings: {
        totalQuestions: 'Total questions',
        questionCount: 'Question count',
        simulateRealExam: 'Simuler un vrai examen',
      },
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
      practiceExams: 'Practice exams',
      practiceExamsBody:
        'Créez des examens blancs chronométrés et pondérés par domaine depuis votre banque de questions.',
      noPracticeExams: 'Aucun examen blanc pour le moment.',
      practiceExamLabel: 'Practice exam',
      examRules: 'Domain rules',
      examRulesHint:
        'Ajoutez une règle par domaine d’examen pour pondérer la sélection des questions.',
      anyDifficulty: 'Any difficulty',
      questionType: {
        multipleChoice: 'Multiple choice',
        trueFalse: 'True / false',
        multiSelect: 'Sélectionnez toutes les réponses pertinentes',
      },
      setup: {
        difficulty: 'Difficulty',
        language: 'Language',
        certificateEnabled: 'Délivrer un certificat de réussite',
        visibility: 'Visibility',
        audience: 'Intended audience',
        audienceHint: 'Une description d’audience par ligne.',
        promoVideo: 'Promo video',
        outcomes: 'Learning outcomes',
        outcomesBody: 'Ce que les apprenants sauront faire après le cours.',
        requirements: 'Requirements',
        requirementsBody:
          'Ce que les apprenants doivent savoir ou posséder avant de commencer.',
        outcomePlaceholder: 'Learning outcome',
        requirementPlaceholder: 'Requirement',
      },
      visibility: {
        private: 'Private',
        unlisted: 'Unlisted',
        public: 'Public',
      },
      flashcards: 'Flashcards',
      flashcardsBody: 'Créez des jeux de cartes mémoire pour l’étude.',
      noFlashcardSets: 'Aucun jeu de cartes mémoire pour le moment.',
      flashcardSetLabel: 'Flashcard set',
      flashcardFront: 'Front',
      flashcardBack: 'Back',
      flashcardHint: 'Hint (optional)',
      noCards: 'Aucune carte pour le moment.',
      lessonHidden: 'Masquée aux apprenants',
      ai: {
        title: 'AI assistant',
        body: 'Générez des brouillons de contenu avec l’IA ; vous relisez tout avant ajout.',
        promptPlaceholder: 'Décrivez le sujet, l’examen ou le plan…',
        generateOutline: 'Generate outline',
        generateQuiz: 'Generate quiz',
        generateFlashcards: 'Generate flashcards',
        generateLesson: 'Generate lesson',
        improveLesson: 'Improve lesson',
        targetLessonLabel: 'Leçon à améliorer',
        targetLessonPlaceholder: 'Select a lesson',
        generating: 'Generating…',
        queued: 'Queued',
        processing: 'Processing',
        completed: 'Completed',
        failed: 'Failed',
        progressLabel: '{0}% complete',
        addToCourse: 'Ajouter au cours',
        discard: 'Discard',
        generated:
          'L’IA a produit un brouillon. Vérifiez-le ci-dessous, puis ajoutez-le au cours.',
        qualityTitle: 'Review checklist',
        qualityBody:
          'L’IA vérifie la couverture des sources, la qualité des quiz, les doublons et la structure avant acceptation.',
        noQualityIssues: 'Aucun problème de révision détecté.',
        sourcesTitle: 'Sources et base',
        sourceFallback: 'Invite du cours ou contenu de leçon existant',
        sourceNoteFallback: 'Aucune note fournie.',
        issueTarget: 'Target: {0}',
        draftNotice:
          'Le contenu IA est ajouté comme brouillon modifiable et n’est jamais publié automatiquement.',
        saveFirst:
          'Enregistrez le cours une fois avant d’utiliser l’assistant IA.',
        notConfigured: 'La génération IA n’est pas disponible pour le moment.',
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
            'Ajoutez des citations ou notes de source avant d’accepter ce brouillon.',
          outlineEmpty: 'Le plan ne contient aucun module.',
          outlineThin:
            'Le plan peut être trop léger pour une expérience complète.',
          emptyTitle: 'Un élément généré n’a pas de titre.',
          questionInvalidCorrectCount:
            'Une question n’a pas exactement une bonne réponse.',
          questionTooFewOptions: 'Une question a moins de trois options.',
          questionMissingExplanation:
            'Une question n’a pas d’explication de réponse.',
          questionMissingDomain: 'Une question n’a pas de domaine d’examen.',
          duplicateQuestion:
            'Une question générée semble dupliquer une question existante ou générée.',
          flashcardsThin:
            'Le jeu de cartes mémoire peut nécessiter plus de cartes avant utilisation.',
          lessonNoBlocks:
            'Le brouillon de leçon ne contient pas de blocs de contenu modifiables.',
        },
        errors: {
          notConfigured:
            'La génération IA n’est pas disponible pour le moment.',
          lessonRequired: 'Sélectionnez une leçon à améliorer.',
          queueFailed:
            'La génération IA n’a pas pu être mise en file. Réessayez.',
          courseAiNotConfigured:
            'La génération IA n’est pas disponible pour le moment.',
          courseAiParseFailed:
            'L’IA a renvoyé un brouillon illisible. Réessayez.',
          courseAiGenerationFailed: 'La génération IA a échoué. Réessayez.',
          courseAiQueueFailed:
            'La génération IA n’a pas pu être mise en file. Réessayez.',
        },
      },
      blocks: {
        title: 'Content blocks',
        body: 'Ajoutez des blocs de contenu riches et typés à la leçon.',
        empty: 'Aucun bloc de contenu pour le moment.',
        add: 'Add block',
        headingLevel: 'Heading level',
        textPlaceholder: 'Text…',
        listHint: 'Un élément par ligne.',
        calloutVariant: 'Style',
        videoUrlPlaceholder: 'Lien YouTube / Vimeo',
        selectQuiz: 'Select a quiz',
        selectFlashcardSet: 'Sélectionner un jeu de cartes mémoire',
        embeddedQuiz: 'Quiz intégré',
        embeddedFlashcards: 'Cartes mémoire intégrées',
        lessonVideoTitle: 'Vidéo de la leçon',
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
      landingPage: 'Page de présentation du cours',
      landingPageBody:
        'La vignette, la vidéo promotionnelle et l’audience visibles avant l’inscription.',
      createBody:
        'Donnez un titre de travail à votre cours ; vous pourrez tout affiner ensuite.',
      createFlow: {
        title: 'Commencer avec un plan de cours',
        body: 'Choisissez une structure de départ, vérifiez le plan, puis affinez-le dans le créateur complet.',
        stepDetails: 'Course basics',
        stepDetailsBody:
          'Définissez l’identité de travail du cours. Ces détails restent modifiables après création.',
        stepTemplate: 'Choisir un modèle de départ',
        stepTemplateBody:
          'Les modèles créent un premier plan utile pour éviter de partir d’une page vide.',
        stepReview: 'Outline preview',
        stepReviewBody:
          'Ce brouillon sera enregistré immédiatement et modifiable section par section.',
        examGoal: 'Examen ou objectif d’apprentissage',
        createWithTemplate: 'Créer le plan du cours',
      },
      templates: {
        examPrep: {
          title: 'Exam prep',
          badge: 'Structured',
          description:
            'Idéal pour préparer une certification, un placement, une licence ou un examen final.',
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
            'Idéal pour enseigner une compétence pratique avec démonstrations, devoirs et retours.',
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
          title: 'Mini-cours rapide',
          badge: 'Fast start',
          description:
            'Idéal pour un sujet ciblé que les apprenants peuvent terminer en une courte session.',
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
        title: 'Meilleure prochaine étape',
        ready: 'Prêt pour révision',
        fix: 'Go there',
        review: 'Review course',
      },
      recovery: {
        title: 'Restaurer le brouillon non enregistré ?',
        body: 'Un brouillon plus récent a été trouvé. Restaurez-le pour reprendre vos dernières modifications ou gardez la version enregistrée.',
        restore: 'Restore draft',
        discard: 'Garder la version serveur',
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
        submit: 'Soumettre à révision',
      },
      autosave: {
        saving: 'Saving…',
        saved: 'Saved',
        error: 'Save failed',
        retry: 'Retry',
      },
      checkpoints: {
        title: 'Version history',
        body: 'Créez des points de restauration manuels et récupérez les brouillons récents.',
        label: 'Checkpoint label',
        labelPlaceholder: 'par ex. avant les dernières modifications du quiz',
        create: 'Create checkpoint',
        restore: 'Restore',
        delete: 'Delete checkpoint',
        empty: 'Aucun point de restauration pour le moment.',
        loading: 'Loading checkpoints…',
        created: 'Checkpoint created.',
        restored: 'Checkpoint restored.',
        deleted: 'Checkpoint deleted.',
        submitSnapshotLabel: 'Avant soumission à révision',
        sources: {
          autosave: 'Autosave',
          manual: 'Manual',
          restore: 'Restore',
          submitSnapshot: 'Submit snapshot',
        },
      },
      checklist: {
        title: 'Soumettre à révision',
        intro:
          'Votre cours doit respecter ces exigences avant qu’un administrateur le révise.',
        required: 'Required',
        recommended: 'Recommended',
        ready: 'Tout semble prêt ; soumettez quand vous l’êtes.',
        notReady: 'Complétez les éléments ci-dessus avant de soumettre.',
        fix: 'Fix',
        titleItem: 'Ajouter un titre de cours',
        descriptionItem: 'Rédiger une description du cours',
        thumbnailItem: 'Téléverser une vignette du cours',
        moduleItem: 'Ajouter au moins un module',
        lessonsItem: 'Ajouter au moins trois leçons',
        assessmentItem: 'Ajouter au moins un quiz ou un examen blanc',
        outcomeItem: 'Ajouter au moins un résultat d’apprentissage',
        audienceItem: 'Décrire à qui s’adresse ce cours',
        requirementItem: 'Ajouter les prérequis du cours',
        lessonContentItem:
          'Ajouter du contenu, des blocs ou des médias à une leçon',
        previewLessonRecommendedItem:
          'Marquez une leçon comme aperçu gratuit avant de publier des cours payants',
        flashcardRecommendedItem: 'Ajouter des cartes mémoire pour la révision',
      },
      success: {
        created: 'Course created.',
        saved: 'Draft saved.',
        submitted: 'Cours soumis à révision.',
        withdrawn: 'Cours repassé en brouillon.',
      },
    },
    quiz: {
      heading: 'Quiz',
      passingScore: 'Passing score',
      noPassingScore: 'Aucun score de réussite requis.',
      yourScore: 'Your score',
      lastScore: 'Last attempt',
      passed: 'Passed',
      failed: 'Pas encore réussi',
      correct: 'Correct',
      incorrect: 'Incorrect',
      explanation: 'Explanation',
      selectAll: 'Sélectionnez toutes les réponses pertinentes.',
      selectOne: 'Sélectionnez une réponse.',
      answerAll: 'Répondez à toutes les questions avant de soumettre.',
      points: 'points',
      empty: 'Ce quiz n’a pas encore de questions.',
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
      empty: 'Cet examen n’a pas encore de questions disponibles.',
      answerAll: 'Répondez à toutes les questions avant de soumettre.',
    },
    flashcards: {
      heading: 'Flashcards',
      flip: 'Flip card',
      next: 'Next',
      previous: 'Previous',
      cardLabel: 'Card',
      showHint: 'Show hint',
      empty: 'Ce jeu n’a pas encore de cartes.',
    },
    review: {
      menu: 'Course Reviews',
      title: 'Cours en attente de révision',
      empty: 'Aucun cours n’est en attente de révision.',
      pending: 'Awaiting review',
      submittedAt: 'Soumis à révision',
      decision: 'Review decision',
      notesLabel: 'Notes pour le créateur',
      notesHint:
        'Requis lors d’une demande de modifications ; partagé avec le créateur.',
      approveBody:
        'L’approbation publie immédiatement le cours dans le catalogue.',
      approve: 'Approve & publish',
      requestChanges: 'Request changes',
      filterAll: 'All courses',
      filterPending: 'Awaiting review',
      success: 'Révision du cours enregistrée.',
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
    courseContextHeader: 'Contexte du cours disponible pour le tuteur :',
    courseVideoTranscriptNotice:
      'Les transcriptions des vidéos téléversées sont incluses une fois le traitement terminé.',
    courseScopedSystemPrompt:
      'L’utilisateur pose une question dans un cours précis. Utilisez ce contexte de cours lorsque c’est utile. Utilisez les transcriptions vidéo lorsqu’elles sont disponibles.',
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
      badge: 'Contrôles super administrateur',
      title: 'Surveiller les opérations NexExam',
      description:
        'Gérez les étudiants, liens de création de compte, promotions étudiantes et paiements manuels aux créateurs dans toutes les organisations.',
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
      title: 'Centre de contrôle des métriques',
      description:
        'Suivez la croissance, les résultats d’apprentissage, les revenus, remboursements, l’usage de l’IA et la qualité des cours.',
      range: 'Range',
      loading: 'Loading metrics...',
      empty: 'Aucune métrique de cours disponible pour le moment.',
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
        'Comparez inscriptions, progression, résultats de quiz, notes et revenus.',
      course: 'Course',
      enrollments: 'Enrollments',
      homework: 'Homework',
      quiz: 'Quiz',
      rating: 'Rating',
      revenue: 'Revenue',
      funnelTitle: 'Tunnel de monétisation',
      funnelDescription:
        'Mesurez comment l’intérêt pour un cours devient checkout, accès payé et première valeur débloquée.',
      funnelEmpty: 'Aucune activité de tunnel disponible pour le moment.',
      viewToCheckout: 'Vue vers checkout',
      checkoutToPaid: 'Checkout vers paiement',
      paidToFirstValue: 'Paiement vers première valeur',
      funnelEvents: '{0} événements',
      fromPrevious: '{0} depuis l’étape précédente',
      courseViews: 'Vues',
      paywallSeen: 'Paywall',
      checkoutStarted: 'Checkout',
      paid: 'Payé',
      firstValue: 'Première valeur',
      paidRate: 'Taux payé',
      funnelSteps: {
        course_view: 'Vue du cours',
        preview_start: 'Aperçu',
        value_sample_started: 'Échantillon commencé',
        value_sample_completed: 'Échantillon terminé',
        sample_diagnostic_started: 'Diagnostic commencé',
        sample_diagnostic_completed: 'Diagnostic terminé',
        paywall_seen: 'Paywall vu',
        cta_click: 'Clic CTA',
        checkout_started: 'Checkout',
        paid: 'Payé',
        first_value_after_payment: 'Première valeur',
      },
    },
    dashboard: {
      shortcut: 'Cmd K',
      adminName: 'NexExam Admin',
      adminRole: 'Super Admin',
      daily: 'Daily',
      noValue: '$0',
      loading: 'Loading users...',
      emptyUsers: 'Aucun utilisateur ne correspond à ces filtres.',
      showingUsers: 'Affichage de {0} utilisateurs sur {1}',
      platformWide: 'Platform-wide',
      manualPlan: 'Manual',
    },
    students: {
      title: 'Student accounts',
      description:
        'Recherchez des utilisateurs dans toutes les organisations et gérez leurs adhésions.',
    },
    invitation: {
      title: 'Lien de création de compte',
      description:
        'Envoyez un lien d’invitation sécurisé à un futur étudiant ou admin.',
      emailSubject: 'Votre invitation de compte NexExam',
      emailBody: `<p>Bonjour,</p><p>Vous avez été invité à rejoindre {0} sur NexExam.</p><p>Utilisez ce lien sécurisé pour créer votre compte :</p><p><a href="{1}">{1}</a></p><p>Merci,</p><p>L’équipe NexExam</p>`,
    },
    promotions: {
      title: 'Promotions et messages',
      description:
        'Publiez des notifications toast, bannières et messages de réduction pour les étudiants.',
    },
    payouts: {
      title: 'Creator payouts',
      description:
        'Suivez les paiements manuels aux créateurs avant de les marquer comme payés.',
      unassigned: 'Unassigned creator',
      totalMtd: 'Total payouts',
      pendingAmount: 'Pending amount',
      successfulPayouts: 'Successful payouts',
      cancelledPayouts: 'Cancelled payouts',
      trend: 'Payout trend',
      pendingQueue: 'File des paiements en attente',
      createTitle: 'Create payout',
      createDescription:
        'Ajoutez un paiement manuel et suivez-le jusqu’à son achèvement.',
    },
    roles: {
      title: 'Rôles et autorisations',
      description: 'Surveillez le contrôle d’accès à la plateforme.',
      adminDescription:
        'Gérer les paramètres et utilisateurs de l’organisation',
      memberDescription: 'Utiliser l’espace d’apprentissage',
    },
    activity: {
      title: 'Recent activity',
      description: 'Suivez les actions administratives importantes.',
      system: 'System',
      auditLine: '{0} on {1}',
    },
    risk: {
      title: 'Vue d’ensemble fraude et risque',
      description: 'Comptes signalés et risques de paiement.',
      disabledMembers: 'Disabled members',
      pendingPayouts: 'Pending payouts',
      cancelledAmount: 'Montant des paiements annulés',
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
      creatorUserId: 'ID utilisateur du créateur',
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
      email: 'etudiant@example.com',
      globalSearch:
        'Rechercher utilisateurs, créateurs, paiements, notifications...',
      searchStudents: 'Rechercher des étudiants par nom ou e-mail...',
      title: 'Promotion title',
      message: 'Promotion message',
      ctaLabel: 'Libellé de l’appel à l’action',
      ctaHref: 'Lien de l’appel à l’action',
      creatorUserId: 'Coller l’ID utilisateur du créateur',
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
      backToDashboard: 'Retour au tableau de bord',
    },
    success: {
      invitationSent: 'Invitation envoyée avec succès',
      promotionCreated: 'Promotion créée avec succès',
      payoutCreated: 'Paiement créé avec succès',
    },
    errors: {
      inviteExists: 'Une invitation est déjà en attente pour cet e-mail.',
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
      subject: 'Confirmez la suppression de votre compte',
      content:
        '<p>Bonjour {0},</p><p>Vous avez demandé la suppression de votre compte. Pour confirmer, cliquez sur ce lien dans les 24 heures :</p><p><a href="{1}">{1}</a></p><p>Votre compte est programmé pour une suppression définitive le <strong>{2}</strong>, sauf annulation avant cette date. Vous pouvez annuler depuis les paramètres du compte.</p><p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail ; rien ne se passera.</p>',
    },
    accountDeletionConfirmedEmail: {
      subject: 'Votre compte est programmé pour suppression',
      content:
        '<p>Bonjour {0},</p><p>La suppression de votre compte est confirmée. Nous supprimerons définitivement vos données le <strong>{1}</strong>. Vous pouvez encore annuler depuis les paramètres du compte avant cette date.</p>',
    },
    dataExportReadyEmail: {
      subject: 'Votre export de données est prêt',
      content:
        '<p>Bonjour {0},</p><p>Votre export de données est prêt à télécharger.</p><p><a href="{1}">{1}</a></p><p>Les liens de téléchargement expirent après 15 minutes pour des raisons de sécurité ; ouvrez les paramètres du compte pour demander un nouveau lien.</p>',
    },
  },
  oneOnOneCall: {
    entryCard: {
      title: '1:1 avec votre instructeur',
      description: 'Réservez un appel vidéo avec l’instructeur du cours.',
      actionOpen: 'Book a 1:1',
      noAvailability:
        'Votre instructeur n’a pas encore ouvert de sessions 1:1.',
    },
    availability: {
      title: 'Availability',
      description:
        'Choisissez les créneaux hebdomadaires où vous pouvez prendre des appels 1:1.',
      timezoneLabel: 'Timezone',
      addWindow: 'Add window',
      removeWindow: 'Remove',
      dayOfWeek: 'Day',
      startTime: 'Start',
      endTime: 'End',
      save: 'Save availability',
      saved: 'Availability saved',
      empty:
        'Aucun créneau de disponibilité pour le moment. Ajoutez-en un pour commencer.',
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
      description: 'Définissez ce que les étudiants peuvent réserver.',
      add: 'Ajouter un type de session',
      fields: {
        title: 'Title',
        description: 'Description (optional)',
        durationMinutes: 'Duration (minutes)',
        isFree: 'Session gratuite',
        priceAmount: 'Prix',
        currency: 'Devise',
        bufferMinutes: 'Buffer (minutes)',
        minNoticeHours: 'Préavis minimal (heures)',
      },
      pricingModeLabel: 'Mode de tarification',
      freeMode: 'Gratuit',
      paidMode: 'Payant',
      freeLabel: 'Gratuit',
      durationMinutesShort: '{0} min',
      priceAmountPlaceholder: '25.00',
      paidHelper:
        'Les élèves paient avec Stripe avant la confirmation de la session.',
      priceInvalid: 'Saisissez un prix entre 0,50 $US et 10 000,00 $US.',
      currencyInvalid: 'Saisissez un code devise à 3 lettres.',
      save: 'Save',
      cancel: 'Annuler',
      disable: 'Disable',
      empty: 'Aucun type de session pour le moment.',
    },
    booking: {
      title: 'Book a 1:1',
      pickSessionType: 'Choose a session',
      pickDate: 'Pick a date',
      pickTime: 'Pick a time',
      confirm: 'Confirm booking',
      submitting: 'Booking…',
      noSessionTypes:
        'Votre instructeur n’a pas encore ouvert de sessions 1:1.',
      noSlots: 'Aucun créneau disponible dans cette période.',
      success: 'Réservé : consultez la session dans votre liste.',
      close: 'Fermer',
      freeLabel: 'Gratuit',
      durationMinutesShort: '{0} min',
      sessionTypeOptionLabel: '{0} ({1}, {2})',
      paidBookingNotice:
        "Les sessions payantes redirigent vers Stripe Checkout. Le créneau est réservé jusqu'à la fin du paiement.",
      stripeProductName: '1:1 avec {0} : {1}',
    },
    session: {
      title: 'Your 1:1 sessions',
      tabs: { upcoming: 'Upcoming', past: 'Past' },
      role: { student: 'As student', instructor: 'As instructor' },
      emptyUpcoming: 'Aucune session à venir.',
      emptyPast: 'Aucune session passée.',
      join: 'Join call',
      joinHint:
        'Le lien de connexion se déverrouille 10 minutes avant le début.',
      cancel: 'Cancel session',
      statusLabel: 'Status',
      statuses: {
        confirmed: 'Confirmée',
        pendingPayment: 'Paiement en attente',
        completed: 'Terminée',
        cancelledByStudent: 'Annulée par l’étudiant',
        cancelledByInstructor: 'Annulée par l’instructeur',
        noShow: 'Absence',
        expired: 'Expirée',
        disputed: 'Contestée',
        refunded: 'Remboursée',
      },
    },
    notes: {
      title: 'Notes',
      placeholder: 'Ajouter une note privée ou partagée…',
      add: 'Add note',
      shared: 'Partager avec l’autre personne',
      edit: 'Edit',
      delete: 'Delete',
      empty: 'Aucune note pour le moment.',
    },
    cancel: {
      title: 'Annuler cette session ?',
      reasonLabel: 'Reason (optional)',
      confirm: 'Yes, cancel',
      keep: 'Keep session',
      lateCancelWarning:
        'Vous annulez dans les 24 heures précédant le début ; cela compte comme annulation tardive.',
    },
    errors: {
      noInstructor:
        'Ce cours n’a pas d’instructeur disponible pour les sessions 1:1.',
      cannotBookSelf: 'Vous ne pouvez pas réserver un 1:1 avec vous-même.',
      paidNotAvailable:
        'Les sessions 1:1 payantes nécessitent que le traitement des paiements Stripe soit configuré.',
      slotUnavailable:
        'Ce créneau n’est pas dans la disponibilité de l’instructeur ou ne respecte pas le préavis minimal.',
      slotTaken:
        'Ce créneau vient d’être réservé par quelqu’un d’autre. Choisissez-en un autre.',
      rangeTooLarge:
        'La plage de créneaux est trop grande ; réduisez les dates et réessayez.',
      notCourseOwner: 'Vous n’êtes pas propriétaire de ce cours.',
      cannotCancel: 'Cette session ne peut plus être annulée.',
    },
    notify: {
      bookingConfirmedTitle: '1:1 session booked',
      bookingConfirmedStudentBody:
        'Votre session 1:1 pour {0} est confirmée pour {1}.',
      bookingConfirmedInstructorBody: '{0} a réservé un 1:1 pour {1} le {2}.',
      cancelledTitle: '1:1 session cancelled',
      cancelledByStudentBody: '{0} a annulé le 1:1 pour {1} le {2}.',
      cancelledByInstructorBody: '{0} a annulé votre 1:1 pour {1} le {2}.',
      reminderTitle: '1:1 session reminder',
      reminderBody: 'Votre 1:1 pour {0} commence bientôt : {1}.',
      disputeOpenedTitle: '1:1 session disputed',
      disputeResolvedTitle: '1:1 dispute resolved',
    },
    dispute: {
      open: 'Contester cette session',
      reasonLabel: 'Qu’est-ce qui n’a pas fonctionné ?',
      reasonPlaceholder: 'Décrivez le problème en détail.',
      submit: 'Open dispute',
      alreadyDisputed: 'Un litige est déjà ouvert pour cette session.',
      notEligible:
        'Seules les sessions payantes terminées ou marquées comme absence peuvent être contestées.',
      outcomeRefund: 'Un remboursement a été émis.',
      outcomeNoRefund:
        'Le litige a été examiné et aucun remboursement n’a été émis.',
      admin: {
        title: 'Examen des litiges 1:1',
        list: 'Litiges ouverts',
        statusFilter: 'Filtrer par statut',
        statuses: {
          all: 'Tous',
          open: 'Ouvert',
          underReview: 'En cours d’examen',
          resolvedRefund: 'Résolu : remboursement',
          resolvedNoRefund: 'Résolu : sans remboursement',
        },
        detail: 'Détail du litige',
        sessionLabel: 'Session',
        courseLabel: 'Cours',
        studentLabel: 'Étudiant',
        instructorLabel: 'Instructeur',
        scheduledLabel: 'Planifiée',
        priceLabel: 'Prix',
        paidAtLabel: 'Payée le',
        refundedLabel: 'Remboursée',
        refundedValue: '{0} le {1}',
        statusLabel: 'Statut',
        reasonLabel: 'Motif',
        resolutionLabel: 'Résolution',
        refund: 'Émettre un remboursement',
        noRefund: 'Aucun remboursement',
        refundAmount: 'Montant du remboursement (centimes)',
        notes: 'Notes de résolution',
        resolve: 'Résoudre',
        resolved: 'Résolu',
        empty: 'Aucun litige ne correspond à ce filtre.',
        emptyValue: '—',
        resolveError: 'Impossible de résoudre le litige.',
      },
    },
  },
  creatorEarnings: {
    title: 'Your earnings',
    summary: {
      title: 'Earnings summary',
      totalEarned: 'Total paid',
      pending: 'Pending',
      paidThisMonth: 'Payé ce mois-ci',
    },
    list: {
      title: 'Payouts',
      empty:
        'Aucun paiement pour le moment. Les entrées apparaîtront ici dès que vous gagnerez.',
      status: {
        pending: 'Pending',
        paid: 'Paid',
        cancelled: 'Cancelled',
      },
    },
    payoutMethod: {
      title: 'Payout method',
      description:
        'Comment souhaitez-vous être payé ? Coordonnées ACH bancaires, e-mail Wise, PayPal, etc. Texte brut ; les administrateurs le lisent lors du virement.',
      edit: 'Edit',
      save: 'Save',
      placeholder: 'par ex. ACH — Chase ****1234 — routage 021000021',
      empty: 'Aucun mode de paiement défini pour le moment.',
    },
    notify: {
      payoutPaidTitle: 'Votre paiement a été envoyé',
      payoutPaidBody: 'Votre paiement de {0} {1} a été marqué comme payé.',
      payoutCancelledTitle: 'Votre paiement a été annulé',
      payoutCancelledBody: 'Votre paiement de {0} {1} a été annulé.',
    },
  },
  adminCourseCategories: {
    title: 'Course categories',
    description:
      'Taxonomie organisée pour la rangée de filtres du marketplace et le menu du créateur de cours.',
    empty:
      'Aucune catégorie pour le moment. Ajoutez-en une pour organiser le marketplace.',
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
      iconName: 'Icône (clé Lucide, par ex. LuBookOpen)',
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
        'Désactiver cette catégorie ? Les cours liés conserveront leur affectation, mais la catégorie n’apparaîtra plus dans le marketplace.',
      enable: 'Rendre cette catégorie à nouveau visible dans le marketplace ?',
    },
    errors: {
      statusRequired: 'Choisissez activer ou désactiver.',
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
    badge: 'Onboarding personnalisé',
    title: 'Créez votre parcours d’examen',
    body: 'Répondez à cinq questions rapides pour que NexExam transforme tarifs et recommandations en plan lié à votre objectif.',
    skip: 'Ignorer pour le moment',
    continue: 'Continuer vers le tableau de bord',
    enrollLabel: 'S’inscrire',
    enrolledLabel: 'Inscrit',
    viewLabel: 'Voir le cours',
    generatePlan: 'Générer mon plan',
    editAnswers: 'Modifier les réponses',
    emptyMessage:
      'Nous préparons une nouvelle série de cours. Votre plan peut tout de même commencer par un diagnostic et un rythme d’étude.',
    fields: {
      examGoal: 'Examen ou objectif d’apprentissage',
      timeline: 'Calendrier',
      currentLevel: 'Niveau actuel',
      studyTime: 'Temps d’étude hebdomadaire',
      targetScore: 'Score cible',
    },
    placeholders: {
      examGoal: 'Finale Algèbre 1, SAT Math, concours infirmier...',
      targetScore: '90 %, 700+, réussir du premier coup...',
    },
    timeline: {
      two_weeks: '2 semaines',
      one_month: '1 mois',
      two_months: '2 mois',
      three_months: '3 mois',
      six_months: '6 mois',
      not_sure: 'Pas sûr',
    },
    timelineBody: {
      two_weeks: 'Plan sprint',
      one_month: 'Mois ciblé',
      two_months: 'Progression régulière',
      three_months: 'Préparation profonde',
      six_months: 'Longue marge',
      not_sure: 'Départ flexible',
    },
    currentLevel: {
      new: 'Tout nouveau',
      some_background: 'Quelques bases',
      practicing: 'Déjà en pratique',
      almost_ready: 'Presque prêt',
    },
    currentLevelBody: {
      new: 'Commencez par les bases et de premières réussites.',
      some_background: 'Trouvez les lacunes et créez un rythme répétable.',
      practicing: 'Priorisez les faiblesses et la pratique type examen.',
      almost_ready: 'Affinez le temps, la précision et la révision finale.',
    },
    studyTime: {
      '120': 'Léger',
      '240': 'Régulier',
      '420': 'Engagé',
      '600': 'Intensif',
      '900': 'Immersif',
    },
    duration: {
      minutes: '{0} min',
      hours: '{0} h',
      hoursMinutes: '{0} h {1} min',
    },
    unlockPreview: {
      badge: 'Aperçu du déblocage',
      title: 'Payer doit donner l’impression d’ouvrir l’étape suivante',
      body: 'Le plan montrera ce que vous pouvez faire maintenant et ce qui apparaît avec un abonnement ou un achat de cours.',
      items: [
        'Un rythme d’étude adapté à votre temps disponible',
        'Des cours recommandés liés à votre objectif',
        'Une séparation claire entre valeur gratuite et déblocages payants',
      ],
    },
    plan: {
      title: 'Votre plan personnel est prêt',
      body: 'Passez en revue le rythme, les jalons et les cours avant de choisir quoi débloquer.',
      readyBadge: 'Plan généré',
      personalTitle: 'Plan pour {0}',
      summary:
        'Calendrier de {0} vers {1}, avec une première action choisie selon votre niveau et les cours disponibles.',
      sessionRhythm: '{0} sessions/semaine de {1}',
      today: 'Aujourd’hui',
      days: 'Jour {0}',
      milestonesTitle: 'Parcours de jalons',
      metrics: {
        timeline: 'Calendrier',
        weeklyTime: 'Temps hebdomadaire',
        rhythm: 'Rythme d’étude',
        targetScore: 'Objectif',
      },
      milestones: {
        baseline: {
          title: 'Point de départ',
          body: 'Commencez par un diagnostic ou une première leçon pour donner un vrai signal au plan.',
        },
        firstWin: {
          title: 'Première réussite',
          body: 'Terminez une leçon ou un exercice ciblé pour créer de l’élan.',
        },
        practiceRhythm: {
          title: 'Rythme de pratique',
          body: 'Répétez la pratique des compétences faibles chaque semaine.',
        },
        examReadiness: {
          title: 'Contrôle de préparation',
          body: 'Utilisez les signaux de préparation pour décider quoi revoir avant l’examen.',
        },
        finalReview: {
          title: 'Révision finale',
          body: 'Protégez vos points forts et ajustez les dernières faiblesses.',
        },
      },
    },
    courses: {
      title: 'Cours recommandés',
      body: 'Classés selon votre objectif, niveau et calendrier.',
      browseAll: 'Voir tous les cours',
    },
    unlocks: {
      title: 'Ce qui s’ouvre',
      includedTitle: 'Inclus maintenant',
      paidTitle: 'Débloqué avec un accès payant',
      includedItems: [
        'Objectif et calendrier enregistrés',
        'Premier cours ou aperçu recommandé',
        'Un parcours simple de jalons',
      ],
      items: {
        fullCurriculum: 'Programme complet et ressources du cours',
        adaptivePlan: 'Plan adaptatif qui évolue avec la progression',
        aiTutor: 'Prompts du tuteur IA liés aux leçons et exercices',
        practiceExams: 'Examens blancs et contrôles de préparation approfondis',
        certificatePath: 'Parcours de certificat et preuve de réussite',
      },
    },
    errors: {
      noRecommendations:
        'Aucune recommandation de cours disponible pour le moment. Réessayez quand des cours seront publiés.',
    },
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
      disclaimer:
        'AI Tutor peut faire des erreurs. Vérifiez les réponses importantes.',
    },
    attachments: {
      add: 'Joindre des fichiers',
      remove: 'Retirer la pièce jointe',
      tooMany: 'Joignez jusqu’à 5 fichiers par message.',
      tooLarge: 'Chaque pièce jointe doit faire 10 Mo ou moins.',
      unsupported:
        'Joignez des fichiers PDF, DOCX, TXT, Markdown, CSV ou JSON.',
      invalid:
        'Cette pièce jointe n’est pas disponible pour cette conversation.',
      uploadFailed: 'Échec du téléversement. Veuillez réessayer.',
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

  aiTrust: {
    title: 'Transparence IA',
    openControls: 'Controles de confidentialite IA',
    settingsTitle: 'Controles de confidentialite IA',
    settingsDescription:
      'Choisissez les signaux d etude que NexExam peut utiliser pour les futures reponses IA.',
    saved: 'Controles de confidentialite IA enregistres.',
    saving: 'Enregistrement...',
    controls: {
      lessonContent: {
        label: 'Contenu des lecons',
        description:
          'Utiliser le texte, les transcriptions et les devoirs pour les explications, quiz et plans.',
      },
      lessonProgress: {
        label: 'Progression des lecons',
        description:
          'Utiliser les lecons terminees et restantes pour personnaliser les recommandations.',
      },
      practiceResults: {
        label: 'Resultats de pratique',
        description:
          'Utiliser les scores de quiz et de pratique pour identifier les sujets faibles.',
      },
      chatHistory: {
        label: 'Historique du chat',
        description:
          'Utiliser les messages precedents dans la meme conversation avec le tuteur IA.',
      },
      attachments: {
        label: 'Pieces jointes',
        description:
          'Utiliser les fichiers importes pour repondre a votre message actuel.',
      },
    },
    panel: {
      trigger: 'Pourquoi ceci ?',
      title: 'Couche de confiance IA',
      why: 'Pourquoi genere',
      influencedBy: 'Influence par',
      confidence: 'Confiance',
      limitations: 'Limites',
      privacy: 'Confidentialite',
      used: 'Utilise',
      omitted: 'Non utilise',
      unavailable: 'Aucune donnee',
      generated: 'Genere',
      model: 'Modele',
      noSignals: 'Aucun detail de confiance IA disponible.',
      privacyNote:
        'Les controles de confidentialite affectent les futures generations IA.',
    },
    confidence: {
      high: 'Preuves fortes',
      medium: 'Preuves partielles',
      low: 'Preuves limitees',
    },
    sources: {
      studentPrompt: 'Votre message',
      courseOutline: 'Plan du cours',
      lessonContent: 'Contenu des lecons',
      lessonProgress: 'Progression des lecons',
      practiceResults: 'Resultats de pratique',
      examDate: 'Date d examen',
      chatHistory: 'Historique du chat',
      attachments: 'Pieces jointes',
    },
    reasons: {
      studyPlan:
        'Ce plan a ete genere pour prioriser les sujets faibles, les lecons restantes et votre calendrier d examen.',
      nextStep:
        'Cette recommandation a ete generee depuis votre progression et vos sujets faibles.',
      lessonExplain:
        'Cette explication a ete generee avec le contexte de la lecon selectionnee.',
      lessonSummary:
        'Ce resume a ete genere avec le contexte de la lecon selectionnee.',
      quiz: 'Ce quiz a ete genere depuis les lecons du module selectionne.',
      practice:
        'Cet entrainement a ete genere depuis les lecons du module selectionne.',
      aiTutor:
        'Cette reponse a ete generee depuis votre message et le contexte d etude active.',
    },
    limitations: {
      general:
        'L IA peut se tromper. Verifiez les reponses importantes avec le contenu du cours.',
      noPracticeData: 'Aucun resultat de quiz ou de pratique disponible.',
      noLessonProgress: 'Aucun historique de lecons terminees disponible.',
      noLessonContent:
        'La lecon selectionnee contient peu ou pas de contenu lisible.',
      lessonContentOff:
        'Le contenu des lecons n a pas ete utilise car vous l avez desactive.',
      lessonProgressOff:
        'La progression des lecons n a pas ete utilisee car vous l avez desactivee.',
      practiceOff:
        'Les resultats de pratique n ont pas ete utilises car vous les avez desactives.',
      historyOff:
        'L historique du chat n a pas ete utilise car vous l avez desactive.',
      attachmentsOff:
        'Les pieces jointes n ont pas ete utilisees car vous les avez desactivees.',
      verifyAnswers:
        'Revoyez les questions et explications generees avant de vous y fier.',
    },
    units: {
      days: 'jours',
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
