const dictionary = {
  projectName: 'NexExam',

  shared: {
    showArchived: 'Archivierte anzeigen?',
    viewArchived: 'Archivierte ansehen',
    archive: 'Archivieren',
    restore: 'Wiederherstellen',
    archived: 'Archiviert',
    yes: 'Ja',
    no: 'Nein',
    cancel: 'Abbrechen',
    save: 'Speichern',
    done: 'Fertig',
    clear: 'Löschen',
    accept: 'Akzeptieren',
    dashboard: 'Dashboard',
    new: 'Neu',
    all: 'Alle',
    searchNotFound: 'Nichts gefunden.',
    searchPlaceholder: 'Suchen...',
    selectPlaceholder: 'Option wählen',
    dateFormat: 'DD.MM.YYYY',
    datetimeFormat: 'DD.MM.YYYY HH:mm',
    tagsPlaceholder: 'Eingeben und Enter drücken',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    openMenu: 'Menü öffnen',
    search: 'Suchen',
    reset: 'Zurücksetzen',
    min: 'Min',
    max: 'Max',
    view: 'Ansehen',
    copiedToClipboard: 'In Zwischenablage kopiert',
    exportToCsv: 'Als CSV exportieren',
    import: 'Importieren',
    pause: 'Pausieren',
    discard: 'Verwerfen',
    deleted: 'Gelöscht',
    remove: 'Entfernen',
    startDate: 'Startdatum',
    endDate: 'Enddatum',
    close: 'Schließen',
    loading: 'Laden',
    toggleSidebar: 'Seitenleiste umschalten',
    breadcrumb: 'Brotkrumen',
    more: 'Mehr',
    previousSlide: 'Vorherige Folie',
    nextSlide: 'Nächste Folie',
    refresh: 'Aktualisieren',

    unsavedChanges: {
      title: 'Nicht gespeicherte Änderungen',
      message:
        'Sie haben nicht gespeicherte Änderungen, die verloren gehen, wenn Sie diese Seite verlassen.',
      proceed: 'Verwerfen',
      dismiss: 'Abbrechen',
      saveChanges: 'Änderungen speichern',
    },

    importer: {
      importHashAlreadyExists: 'Daten wurden bereits importiert',
      title: 'CSV-Datei importieren',
      menu: 'CSV-Datei importieren',
      line: 'Zeile',
      status: 'Status',
      pending: 'Ausstehend',
      success: 'Importiert',
      error: 'Fehler',
      importedMessage: `{0} von {1} verarbeitet.`,
      noValidRows: 'Es gibt keine gültigen Zeilen.',
      noNavigateAwayMessage:
        'Verlassen Sie diese Seite nicht, sonst wird der Import gestoppt.',
      uploadFiles: 'Dateien hochladen',
      uploadFilesDisclaimer:
        'Dieser Import enthält Dateifelder. Dateien werden während des Imports hochgeladen.',
      completed: {
        success:
          'Import abgeschlossen. Alle Zeilen wurden erfolgreich importiert.',
        someErrors:
          'Verarbeitung abgeschlossen, aber einige Zeilen konnten nicht importiert werden.',
        allErrors: 'Import fehlgeschlagen. Es gibt keine gültigen Zeilen.',
      },
      form: {
        downloadTemplate: 'Vorlage herunterladen',
        description:
          'Laden Sie eine CSV-Datei hoch, um Daten zu importieren. Sie können die Vorlage herunterladen, um das erforderliche Format zu sehen.',
      },
      list: {
        newConfirm: 'Sind Sie sicher?',
        discardConfirm:
          'Sind Sie sicher? Nicht importierte Daten gehen verloren.',
      },
      errors: {
        invalidFileEmpty: 'Die Datei ist leer',
        fileRequired: 'Datei ist erforderlich',
        uploadFailed: 'Hochladen fehlgeschlagen',
        partialUpload: 'Nur {0} von {1} Dateien hochgeladen',
      },
      fileUpload: {
        title: 'Dateien hochladen',
        progress: 'Fortschritt: {0} / {1}',
        uploading: '{0} wird hochgeladen',
        completed: '{0} abgeschlossen',
        failed: '{0} fehlgeschlagen',
        rowLabel: 'Zeile {0} - {1}',
      },
    },

    dataTable: {
      filters: 'Filter',
      noResults: 'Keine Ergebnisse gefunden.',
      viewOptions: 'Ansicht',
      toggleColumns: 'Spalten umschalten',

      sortAscending: 'Auf',
      sortDescending: 'Ab',
      clearSort: 'Löschen',
      hide: 'Ausblenden',

      selectAll: 'Alle auswählen',
      selectRow: 'Zeile auswählen',
      paginationRange: '{0}-{1} von {2}',
      paginationSelected: '{0} ausgewählt',
      paginationRowsPerPage: 'pro Seite',
      pagination: 'Paginierung',
      goToPreviousPage: 'Zur vorherigen Seite',
      goToNextPage: 'Zur nächsten Seite',
      morePages: 'Weitere Seiten',
    },

    locales: {
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
      'pt-BR': 'Português (Brasil)',
      fr: 'Français',
    },

    localeSwitcher: {
      searchPlaceholder: 'Sprache suchen...',
      title: 'Sprache',
      placeholder: 'Sprache auswählen',
      searchEmpty: 'Keine Sprache gefunden.',
    },

    theme: {
      toggle: 'Design',
      light: 'Hell',
      dark: 'Dunkel',
      system: 'System',
    },

    errors: {
      previewMode: 'Diese Funktion ist im Vorschaumodus nicht verfügbar.',
      timezone: 'Ungültige Zeitzone',
      invalid: `{0} ist ungültig`,
      unknown: 'Ein Fehler ist aufgetreten',
      unique: `{0} muss eindeutig sein`,
      staleData:
        'Der Datensatz wurde von einem anderen Benutzer aktualisiert. Bitte aktualisieren Sie und versuchen Sie es erneut.',
      copyToClipboard: 'Kopieren in die Zwischenablage fehlgeschlagen',
      tooManyRequests:
        'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
    },
  },

  apiKey: {
    docs: {
      menu: 'API-Dokumentation',
    },
    edit: {
      menu: 'API-Schlüssel bearbeiten',
      title: 'API-Schlüssel bearbeiten',
      success: 'API-Schlüssel erfolgreich aktualisiert',
      error: 'Fehler beim Aktualisieren des API-Schlüssels',
    },
    new: {
      menu: 'Neuer API-Schlüssel',
      title: 'Neuer API-Schlüssel',
      success: 'API-Schlüssel erfolgreich erstellt',
      error: 'Fehler beim Erstellen des API-Schlüssels',
      warning: {
        title: 'Speichern Sie Ihren API-Schlüssel',
        message:
          'Dies ist das einzige Mal, dass Sie diesen API-Schlüssel sehen werden. Bitte kopieren und sicher aufbewahren.',
      },
      restrictPermissions: 'Berechtigungen einschränken',
      allowAllPermissions: 'Alle Berechtigungen erlauben',
      permissionsDisclaimer:
        'Hinweis: Sie müssen die ausgewählten Berechtigungen in der Organisation haben, damit sie wirksam sind.',
    },
    list: {
      menu: 'API-Schlüssel',
      title: 'API-Schlüssel',
      noResults: 'Keine API-Schlüssel gefunden.',
    },
    delete: {
      confirmTitle: 'API-Schlüssel löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie diesen API-Schlüssel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      success: 'API-Schlüssel erfolgreich gelöscht',
    },
    enumerators: {
      status: {
        enabled: 'Aktiviert',
        disabled: 'Deaktiviert',
      },
      remaining: {
        unlimited: 'Unbegrenzt',
      },
      lastUsed: {
        never: 'Nie',
      },
      expiresAt: {
        never: 'Nie',
      },
      permissions: {
        permission: 'Berechtigung',
        permissions: 'Berechtigungen',
        invalid: 'Ungültig',
      },
    },
    fields: {
      apiKey: 'API-Schlüssel',
      member: 'Benutzer',
      name: 'Name',
      namePlaceholder: 'Mein API-Schlüssel',
      keyPreview: 'Schlüsselvorschau',
      expiresAt: 'Läuft ab',
      expiresAtPlaceholder: 'Läuft nie ab (leer lassen)',
      expiresAtMin:
        'Ablaufdatum muss mindestens {0} Tag(e) in der Zukunft liegen',
      expiresAtMax:
        'Ablaufdatum darf nicht mehr als {0} Tag(e) in der Zukunft liegen',
      status: 'Status',
      enabled: 'Aktiviert',
      remaining: 'Verbleibend',
      lastUsed: 'Zuletzt verwendet',
      createdAt: 'Erstellt am',
      permissions: 'Berechtigungen',
      permissionsPlaceholder: 'Berechtigungen auswählen',
      permissionsRequired: 'Mindestens eine Berechtigung erforderlich',
    },
    errors: {
      fetch: 'Fehler beim Abrufen der API-Schlüssel',
      delete: 'Fehler beim Löschen des API-Schlüssels',
      notFound: 'API-Schlüssel nicht gefunden',
      permissionDenied: 'Sie haben keine Berechtigung, {0}:{1} zu gewähren',
      organizationRequired: 'Organisations-ID ist erforderlich',
      createFailed: 'Fehler beim Erstellen des API-Schlüssels',
      listFailed: 'Fehler beim Auflisten der API-Schlüssel',
    },
  },

  file: {
    button: 'Hochladen',
    delete: 'Löschen',
    dropzone: {
      dragAndDrop: 'Dateien hier ablegen',
      dropFiles: 'Dateien hier ablegen',
      uploadFiles: 'Sie können {0} Datei{1} hochladen.',
      upTo: 'Bis zu {0}.',
      eachUpTo: 'Jeweils bis zu {0}.',
      accepted: '{0} akzeptiert.',
      uploading: 'Hochladen...',
      uploadSuccessful: 'Upload erfolgreich',
    },
    errors: {
      formats: `Ungültiges Format. Muss eines sein von: {0}.`,
      notImage: `Datei muss ein Bild sein`,
      tooBig: `Datei ist zu groß. Aktuelle Größe ist {0} Bytes, maximale Größe ist {1} Bytes`,
      invalidFilename: 'Ungültiger Dateiname',
    },
  },

  dashboard: {
    searchLabel: 'Lerninhalte suchen',
    searchPlaceholder: 'Kurse, Themen, Ressourcen suchen...',
    notifications: 'Benachrichtigungen',
    learnerRole: 'Lernende Person',
    superAdminRole: 'Super Admin',
    fallbackName: 'Lernende Person',
    viewSwitcher: {
      title: 'Ansicht wechseln',
      superAdmin: 'Admin',
      student: 'Student',
      creator: 'Lehrer',
    },
    student: {
      menu: 'Studenten-Dashboard',
      role: 'Student',
    },
    creator: {
      menu: 'Creator-Dashboard',
      role: 'Creator Teacher',
      welcome: 'Willkommen zurück, {0}',
      title: 'Baue deinen Weg als Lehr-Creator auf',
      subtitle:
        'Beantrage Verifizierung, verfolge den Prüfstatus und bereite Kurse für den NexExam-Lernkatalog vor.',
      applicationTitle: 'Verifizierungsstatus',
      applicationEmpty:
        'Starte deine Creator-Bewerbung, damit das NexExam-Team deine Referenzen und deinen Lehrfokus prüfen kann.',
      applicationPending:
        'Deine Creator-Bewerbung wird geprüft. Du kannst Details aktualisieren, während das Team sie bewertet.',
      applicationApproved:
        'Dein Creator-Profil ist genehmigt. Admin-gesteuerte Kursveröffentlichung bleibt in Phase 1 aktiv.',
      applicationRejected:
        'Deine Bewerbung benötigt Änderungen vor der Genehmigung. Prüfe die Admin-Notizen und reiche dein Profil erneut ein.',
      startApplication: 'Bewerbung starten',
      editApplication: 'Bewerbung aktualisieren',
      workspaceTitle: 'Kursarbeitsbereich',
      workspaceBody:
        'Creator-Kurserstellung ist vom Lernen der Studenten getrennt. Self-Service-Veröffentlichung startet, wenn die Verifizierungsabläufe stabil sind.',
      reviewTitle: 'Admin-Prüfung',
      reviewBody:
        'NexExam-Super-Admins prüfen Bewerbungen, Kursqualität, Einschreibungen und Auszahlungen im Admin-Dashboard.',
      deferredTitle: 'Phase-1-Grenze',
      deferredBody:
        'Drag-and-drop-Kurserstellung und automatische Umsatzaufteilung bleiben zurückgestellt, während der Einschreibungsloop ausgeliefert wird.',
      metricsTitle: 'Creator metrics',
      metricsBody:
        'Track enrollments, completion, AI usage, ratings, and earnings across your courses.',
    },
    welcome: 'Willkommen zurück, {0}',
    heroTitle: 'Setze deine Lernreise mit KI fort',
    heroSubtitle: 'Personalisiertes Lernen. Jeden Tag intelligenter.',
    continueLearning: 'Weiterlernen',
    askTutor: 'KI-Tutor fragen',
    viewAllCourses: 'Alle Kurse ansehen',
    viewAll: 'Alle ansehen',
    recommendedForYou: 'Für dich empfohlen',
    aiTutorTitle: 'KI-Tutor',
    online: 'Online',
    aiTutorGreeting: 'Hallo! Ich bin dein KI-Tutor.',
    aiTutorPrompt: 'Wie kann ich dir heute helfen?',
    tutorActions: [
      'Ein Konzept erklären',
      'Mich zu diesem Thema abfragen',
      'Ressourcen empfehlen',
    ],
    learningProgress: 'Lernfortschritt',
    thisWeek: 'Diese Woche',
    totalStudyTime: 'Gesamte Lernzeit',
    noEnrolledCoursesTitle: 'Starte deinen ersten Kurs',
    noEnrolledCoursesDescription:
      'Schreibe dich in einen veröffentlichten Kurs ein, um hier Lektionen, Aufgaben und KI-Tutor-Fortschritt zu sehen.',
    noRecommendationsTitle: 'Noch keine Empfehlungen',
    noRecommendationsDescription:
      'Neue veröffentlichte Kurse erscheinen hier, sobald sie zur Einschreibung verfügbar sind.',
    enrolledCoursesStat: 'Eingeschriebene Kurse',
    completedLessonsStat: 'Abgeschlossene Lektionen',
    submittedAssignmentsStat: 'Eingereichte Aufgaben',
    averageProgressStat: 'Durchschnittlicher Fortschritt',
    lessonProgress: '{0} von {1} Lektionen',
    assignmentProgress: '{0} von {1} Aufgaben',
    progressComplete: '{0}% abgeschlossen',
    recommendationMeta: '{0} Lektionen • {1} Aufgaben',
    nextLesson: 'Nächste Lektion',
    noLessons: 'Alle Lektionen abgeschlossen',
    weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    courses: [
      {
        title: 'Einführung in künstliche Intelligenz',
        meta: 'Modul 4 • Grundlagen des maschinellen Lernens',
        progress: '65%',
      },
      {
        title: 'Datenstrukturen und Algorithmen',
        meta: 'Modul 3 • Bäume und Graphen',
        progress: '40%',
      },
      {
        title: 'Grundlagen des UI/UX-Designs',
        meta: 'Modul 2 • Designprinzipien',
        progress: '20%',
      },
    ],
    recommendations: [
      {
        title: 'Grundlagen des Deep Learning',
        meta: 'Kurs • Fortgeschritten',
        rating: '4.8 (320)',
      },
      {
        title: 'SQL für Datenanalyse',
        meta: 'Kurs • Anfänger',
        rating: '4.7 (210)',
      },
      {
        title: 'Python-Programmierung Masterclass',
        meta: 'Kurs • Anfänger',
        rating: '4.9 (421)',
      },
    ],
  },

  studentExperience: {
    menu: {
      myCourses: 'Meine Kurse',
      practice: 'Übung',
      notesStudyPlan: 'Notizen / Lernplan',
      aiTutor: 'AI Tutor',
      courseOverview: 'Kursübersicht',
    },
    title: 'Lernenden-Dashboard',
    subtitle:
      'Bleibe auf die nächste Lektion, Aufgaben, Übungen und KI-Unterstützung für deine belegten Kurse fokussiert.',
    heroTitle: 'Dein nächster bester Lernschritt ist bereit',
    heroSubtitle:
      'NexExam bündelt Kursfortschritt, Aufgaben, Übungen, Notizen und Prüfungsbereitschaft an einem Ort.',
    continueLesson: 'Lektion fortsetzen',
    continueCourse: 'Kurs fortsetzen',
    askCourseTutor: 'Kurstutor fragen',
    openCourseOverview: 'Übersicht öffnen',
    startPractice: 'Übung starten',
    continuePractice: 'Übung fortsetzen',
    completePractice: 'Übung abschließen',
    submitAnswer: 'Antwort senden',
    viewCoursePlayer: 'Player öffnen',
    addNote: 'Notiz hinzufügen',
    saveNote: 'Notiz speichern',
    addStudyPlanItem: 'Lernplaneintrag hinzufügen',
    saveStudyPlanItem: 'Lernplaneintrag speichern',
    markComplete: 'Als abgeschlossen markieren',
    readinessScore: 'Prüfungsbereitschaft',
    readinessInsufficient: 'Benötigt mehr Übung oder Prüfungsdaten',
    readinessReady: 'Genügend Daten verfügbar',
    myCourses: 'Meine Kurse',
    upcomingHomework: 'Anstehende Aufgaben',
    practiceQuestions: 'Übungsfragen',
    notesAndStudyPlan: 'Notizen + Lernplan',
    recentNotes: 'Aktuelle Notizen',
    todayPlan: 'Plan für heute',
    progress: 'Fortschritt',
    homework: 'Aufgaben',
    notes: 'Notizen',
    studyPlan: 'Lernplan',
    mobile: {
      savedOffline:
        'Offline gespeichert. Es wird synchronisiert, sobald du wieder online bist.',
      syncFailed: 'Synchronisierung fehlgeschlagen',
      continueLearning: 'Weiterlernen',
      offlineStatus: {
        online: 'Online',
        offline:
          'Offline-Modus: Änderungen werden auf diesem Gerät gespeichert.',
        syncing: 'Gespeicherte mobile Arbeit wird synchronisiert...',
        synced: 'Mobile Arbeit synchronisiert.',
        failed:
          'Ein Teil der mobilen Arbeit benötigt einen weiteren Synchronisierungsversuch.',
      },
    },
    adaptivePlan: {
      title: 'Adaptiver Lernplan',
      body: 'Setze dein Ziel und NexExam verwandelt Bereitschaft, Schwachstellen, Aufgaben und Uebungsverlauf in fokussierte Aufgaben.',
      badge: 'KI-gefuehrt',
      examNameLabel: 'Pruefung oder Ziel',
      examNamePlaceholder: 'Zertifizierung, Abschlusspruefung oder Ziel',
      targetExamDateLabel: 'Zieldatum der Pruefung',
      weakAreasLabel: 'Aktuelle Schwachstellen',
      noWeakAreas: 'Schliesse Uebungen ab, um Schwachstellen zu sehen.',
      generate: 'Adaptiven Plan erstellen',
      regenerate: 'Adaptiven Plan aktualisieren',
      itemsCreated: '{0} adaptive Aufgabe(n) hinzugefuegt.',
      itemTitles: {
        diagnostic: 'Schliesse deine Eingangsdiagnose ab',
        weakArea: 'Schwachstelle staerken: {0}',
        homework: 'Aufgabe abschliessen: {0}',
        lesson: 'Lektion fortsetzen: {0}',
        practice: 'Uebungsfragen fuer {0}',
        maintain: 'Bereitschaft fuer {0} halten',
      },
      itemDescriptions: {
        diagnostic:
          'Beantworte Uebungsfragen fuer {0}, damit NexExam deine Bereitschaft kalibrieren kann.',
        weakArea:
          'Pruefe Erklaerungen und wiederhole gezielte Uebungen zu {0}.',
        homework:
          'Schliesse {0} ab oder ueberarbeite es, bevor du neues Material hinzufuegst.',
        lesson:
          'Arbeite {0} durch und markiere die Lektion danach als abgeschlossen.',
        practice:
          'Nutze eine fokussierte Uebungssitzung, um deine Kompetenz in {0} zu bestaetigen.',
        maintain:
          'Halte den Schwung mit kurzer Wiederholung, Notizen und Uebung fuer {0}.',
      },
    },
    learningOutcomes: {
      title: 'Lernergebnisse',
      body: 'Nutze Diagnose, Kompetenzkarte, Wiederholung, Aufarbeitung und Pruefungssimulation, um Fortschritt messbar zu machen.',
      badge: 'Ergebnis-Engine',
      summary: {
        masteryAverage: 'Kompetenzschnitt',
        dueFlashcards: 'Faellige Karten',
        streak: 'Lernserie',
        mockExam: 'Probepruefung',
      },
      diagnostic: {
        title: 'Adaptive Diagnose',
        body: 'Starte eine Ausgangsmessung, damit NexExam starke und schwache Pruefungsbereiche erkennt.',
        start: 'Diagnose starten',
        restart: 'Diagnose wiederholen',
        submit: 'Antwort speichern',
        complete: 'Diagnose abschliessen',
        answered: '{0} von {1} beantwortet',
        lastScore: 'Letzte Diagnose: {0}% bei {1} Fragen',
        noQuestions:
          'Fuege genehmigte Fragen hinzu, bevor Diagnosen laufen koennen.',
      },
      mastery: {
        title: 'Kompetenzkarte nach Bereich',
        empty:
          'Schliesse Diagnosen, Uebungen oder Probepruefungen ab, um eine Kompetenzkarte aufzubauen.',
        evidence: '{0} Evidenzpunkt(e)',
        confidence: {
          low: 'Niedrige Sicherheit',
          medium: 'Mittlere Sicherheit',
          high: 'Hohe Sicherheit',
        },
        actions: {
          diagnose: 'Braucht eine Diagnosebasis.',
          remediate: 'Aufarbeitung vor neuen Lektionen priorisieren.',
          practice: 'Ueben, bis der Score stabil ist.',
          maintain: 'Mit verteilter Wiederholung halten.',
        },
      },
      flashcards: {
        title: 'Verteilte Wiederholung',
        dueCount: '{0} von {1} Karte(n) faellig',
        nextDue: 'Naechste Faelligkeit {0}',
        inSet: 'Aus {0}',
        flip: 'Karte drehen',
        empty: 'Im Moment sind keine Karten faellig.',
        openPlayer: 'Karten oeffnen',
        ratings: {
          again: 'Nochmal',
          hard: 'Schwer',
          good: 'Gut',
          easy: 'Leicht',
        },
      },
      streak: {
        dayCount: '{0} Tag(e)',
      },
      remediation: {
        title: 'Aufarbeitung von Schwachstellen',
        body: 'Erstelle einen kurzen Plan fuer den Bereich, der deine Bereitschaft am meisten bremst.',
        generate: 'Aufarbeitungsplan erstellen',
        refresh: 'Aufarbeitungsplan aktualisieren',
        noWeakDomains: 'Noch keine schwachen Bereiche erkannt.',
        planTitle: 'Aufarbeitungs-Sprint: {0}',
        planDescription: 'Gezielte Wiederholung, Uebung und Abruf fuer {0}.',
        itemsCreated: '{0} Aufarbeitungsaufgabe(n) hinzugefuegt.',
        itemTitles: {
          review: 'Grundlagen wiederholen: {0}',
          practice: 'Schwachen Bereich ueben: {0}',
          recall: 'Abrufcheck: {0}',
        },
        itemDescriptions: {
          review:
            'Gehe Lektionen, Notizen und Erklaerungen zu {0} erneut durch.',
          practice:
            'Beantworte fokussierte Fragen und pruefe Fehlererklaerungen fuer {0}.',
          recall:
            'Nutze Karten oder einen kurzen Selbstcheck, um Behalten fuer {0} zu bestaetigen.',
        },
      },
      schedule: {
        title: 'Kalender-Lernplan',
        empty: 'Noch keine Lernaufgaben geplant.',
        flashcardsTitle: '{0} Karte(n) faellig',
      },
      mockExams: {
        title: 'Probepruefungs-Simulation',
        noExams: 'Fuer diesen Kurs sind noch keine Probepruefungen bereit.',
        available: 'Verfuegbar',
        simulations: 'Simulationen',
        bestScore: 'Bester Score',
        lastScore: 'Letzter Score',
        openPlayer: 'Probepruefungen oeffnen',
      },
    },
    noCoursesTitle: 'Schreibe dich in deinen ersten Kurs ein',
    noCoursesBody:
      'Veröffentlichte Kurse, in die du dich einschreibst, erscheinen hier mit Fortschritt, Aufgaben, Übung und KI-Tutor-Kontext.',
    noHomework: 'Keine anstehenden Aufgaben.',
    noPractice: 'Für diesen Kurs sind noch keine Übungsfragen bereit.',
    noNotes: 'Noch keine Notizen.',
    noStudyPlan: 'Noch keine Lernplaneinträge.',
    emptyPracticeAttempt:
      'Starte eine Übungseinheit, um Kursfragen zu beantworten.',
    noteTitlePlaceholder: 'Notiztitel',
    noteContentPlaceholder: 'Woran möchtest du dich erinnern?',
    studyPlanTitlePlaceholder: 'Lernaufgabe',
    studyPlanDescriptionPlaceholder: 'Optionale Details',
    plannedForDate: 'Geplantes Datum',
    answerOptions: 'Antwortoptionen',
    selectedAnswer: 'Ausgewählte Antwort',
    correctAnswer: 'Richtige Antwort',
    explanation: 'Erklärung',
    score: '{0}%',
    lessonsProgress: '{0} von {1} Lektionen abgeschlossen',
    answeredProgress: '{0} von {1} beantwortet',
    homeworkProgress: '{0} abgeschlossen • {1} offen',
    practiceAccuracy: '{0}% Genauigkeit',
    attemptsCount: '{0} Versuch(e)',
    availableQuestionCount: '{0} verfügbare Frage(n)',
    nextAction: {
      lesson: '{0} fortsetzen',
      homework: 'Aufgabe abschließen: {0}',
      practice: '{0} üben',
      none: 'Kurse erkunden',
    },
    homeworkStatus: {
      open: 'Offen',
      dueSoon: 'Bald fällig',
      overdue: 'Überfällig',
      submitted: 'Eingereicht',
      complete: 'Abgeschlossen',
      needsRevision: 'Überarbeitung nötig',
    },
    practiceStatus: {
      active: 'In Bearbeitung',
      completed: 'Abgeschlossen',
    },
    signals: {
      courseProgress: 'Kursfortschritt',
      homework: 'Aufgaben',
      practice: 'Übung',
      exam: 'Prüfungsversuche',
      recentActivity: 'Aktuelle Aktivität',
    },
    suggestions: {
      lesson: 'Lektion wiederholen: {0}',
      homework: 'An Aufgabe arbeiten: {0}',
      practice: 'Übungsfragen für {0}',
    },
    aiPrompts: [
      'Erkläre meine nächste Lektion',
      'Teste mich zu diesem Kurs',
      'Erstelle einen Lernplan',
    ],
    success: {
      noteSaved: 'Notiz gespeichert.',
      studyPlanSaved: 'Lernplaneintrag gespeichert.',
      studyPlanUpdated: 'Lernplan aktualisiert.',
      adaptivePlanGenerated: 'Adaptiver Lernplan aktualisiert.',
      diagnosticStarted: 'Diagnose gestartet.',
      diagnosticCompleted: 'Diagnose abgeschlossen.',
      flashcardReviewed: 'Kartenwiederholung gespeichert.',
      remediationGenerated: 'Aufarbeitungsplan hinzugefuegt.',
      answerSaved: 'Antwort gespeichert.',
      practiceCompleted: 'Übung abgeschlossen.',
    },
    errors: {
      noPractice:
        'Für diesen Kurs sind keine beantwortbaren Übungsfragen verfügbar.',
      practiceComplete: 'Dieser Übungsversuch ist bereits abgeschlossen.',
      invalidAnswer: 'Wähle eine gültige Antwortoption.',
      diagnosticIncomplete: 'Beantworte alle Diagnosefragen vor dem Abschluss.',
    },
  },

  auth: {
    layout: {
      brandName: 'NexExam',
      heroTitle: 'Schalte räumliches Lernen frei.',
      heroSubtitle:
        'Die nächste Generation der Bildung, entwickelt für das räumliche Web. Intelligenter, intuitiver und nahtlos für dich.',
      authTabsLabel: 'Authentifizierungsoptionen',
      aiTutorTitle: 'KI-Tutor',
      aiTutorDescription: 'Immer verfügbar',
      flowStateTitle: 'Flow-Modus',
      flowStateDescription: 'Ablenkungsfrei',
      insightsTitle: 'Einblicke',
      insightsDescription: 'Metriken in Echtzeit',
      secureFooter: 'Durch fortschrittliche Verschlüsselung geschützt.',
    },
    signIn: {
      oauthError:
        'Anmeldung mit diesem Anbieter nicht möglich. Bitte verwenden Sie einen anderen.',
      title: 'Anmelden',
      cardTitle: 'Willkommen zurück',
      cardSubtitle: 'Gib deine Daten ein, um auf dein Dashboard zuzugreifen.',
      menu: 'Anmelden',
      button: 'Mit E-Mail anmelden',
      success: 'Erfolgreich angemeldet',
      signingIn: 'Anmelden...',
      email: 'E-Mail',
      password: 'Passwort',
      socialHeader: 'Oder fortfahren mit',
      google: 'Google',
      passwordResetRequestLink: 'Passwort vergessen?',
      signUpLink: `Noch kein Konto? Erstellen`,
      studentSignUpLink: `Brauchst du ein Studentenkonto? Als Student registrieren`,
      creatorSignUpLink: `Möchtest du unterrichten? Als Creator registrieren`,
    },
    signUp: {
      title: 'Registrieren',
      menu: 'Registrieren',
      studentMenu: 'Studentenregistrierung',
      creatorMenu: 'Creator-Registrierung',
      studentTab: 'Student',
      creatorTab: 'Creator',
      studentTitle: 'Studentenregistrierung',
      creatorTitle: 'Creator-Registrierung',
      studentCardTitle: 'Als Student beitreten',
      creatorCardTitle: 'Als Creator beitreten',
      cardSubtitle: 'Erstelle ein Konto, um deine Reise zu beginnen.',
      studentSubtitle:
        'Schreibe dich in Prüfungsvorbereitungskurse ein, schließe Lektionen ab, reiche Hausaufgaben ein und lerne mit KI-Unterstützung.',
      creatorSubtitle:
        'Bewirb dich als verifizierte Lehrperson und bereite dich darauf vor, nach Genehmigung NexExam-Kurse zu veröffentlichen.',
      signInLink: 'Bereits ein Konto? Anmelden',
      button: 'Registrieren',
      success: 'Erfolgreich registriert',
      email: 'E-Mail',
      password: 'Passwort',
      invitationEmailLocked:
        'Diese E-Mail ist gesperrt, da Sie sich über eine Einladung registrieren.',
    },
    verifyEmailRequest: {
      title: 'E-Mail-Verifizierung erneut senden',
      button: 'E-Mail-Verifizierung erneut senden',
      message:
        'Bitte bestätigen Sie Ihre E-Mail unter <strong>{0}</strong>, um fortzufahren.',
      success: 'E-Mail-Verifizierung erfolgreich gesendet!',
      noEmail:
        'Keine E-Mail-Adresse angegeben. Bitte registrieren oder anmelden.',
    },
    verifyEmailConfirm: {
      title: 'E-Mail verifizieren',
      success: 'E-Mail erfolgreich verifiziert.',
      loadingMessage: 'Einen Moment, Ihre E-Mail wird verifiziert...',
    },
    passwordResetRequest: {
      title: 'Passwort vergessen',
      signInLink: 'Abbrechen',
      button: 'Passwort-Zurücksetzungs-E-Mail senden',
      email: 'E-Mail',
      success: 'Passwort-Zurücksetzungs-E-Mail erfolgreich gesendet',
    },
    passwordResetConfirm: {
      title: 'Passwort zurücksetzen',
      signInLink: 'Abbrechen',
      button: 'Passwort zurücksetzen',
      password: 'Passwort',
      success: 'Passwort erfolgreich geändert',
    },
    noPermissions: {
      title: 'Keine Berechtigungen',
      message:
        'Sie haben noch keine Berechtigungen. Bitte warten Sie, bis der Administrator Ihnen Rechte gewährt.',
    },
    invitation: {
      title: 'Einladung',
      success: 'Einladung erfolgreich angenommen',
      loadingMessage: 'Einen Moment, wir nehmen die Einladung an...',
      invalidToken: 'Abgelaufenes oder ungültiges Einladungstoken.',
      errors: {
        INVITATION_EMAIL_MISMATCH:
          'Diese Einladung wurde an eine andere E-Mail-Adresse gesendet. Bitte melden Sie sich mit dem richtigen Konto an.',
        INVITATION_EXPIRED: 'Diese Einladung ist abgelaufen',
        INVITATION_NOT_PENDING:
          'Diese Einladung wurde bereits angenommen oder abgebrochen',
      },
    },
    organization: {
      title: 'Organisation',
      create: {
        name: 'Name der Organisation',
        success: 'Organisation erfolgreich erstellt',
        button: 'Organisation erstellen',
      },
      select: {
        organization: 'Organisation auswählen',
        joinSuccess: 'Organisation erfolgreich beigetreten',
        select: 'Organisation auswählen',
        continue: 'Fortfahren',
        autoSelecting: 'Organisation wird ausgewählt...',
      },
      invitationAccepted: 'Einladung erfolgreich angenommen',
      invitationAcceptError: 'Fehler beim Annehmen der Einladung',
      acceptingInvitation: 'Einladung wird angenommen...',
      invitationRejected: 'Einladung abgelehnt',
      invitationRejectError: 'Fehler beim Ablehnen der Einladung',
      rejectingInvitation: 'Einladung wird abgelehnt...',
      rejectInvitation: 'Ablehnen',
      rejectInvitationTitle: 'Einladung ablehnen?',
      rejectInvitationDescription:
        'Sind Sie sicher, dass Sie diese Einladung ablehnen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      invitations: 'Einladungen',
      pendingInvitation: 'Ausstehende Einladung',
    },
    passwordChange: {
      title: 'Passwort ändern',
      menu: 'Passwort ändern',
      oldPassword: 'Altes Passwort',
      newPassword: 'Neues Passwort',
      newPasswordConfirmation: 'Neues Passwort bestätigen',
      button: 'Passwort speichern',
      success: 'Passwort erfolgreich gespeichert',
      mustMatch: 'Passwörter müssen übereinstimmen',
      cancel: 'Abbrechen',
    },
    emailChange: {
      title: 'E-Mail ändern',
      menu: 'E-Mail ändern',
      newEmail: 'Neue E-Mail',
      button: 'E-Mail ändern',
      success:
        'Bestätigungs-E-Mail gesendet. Überprüfen Sie Ihre aktuelle E-Mail zur Genehmigung.',
      confirmSuccess: 'E-Mail erfolgreich geändert',
      confirmStepTwo:
        'Wir haben eine Bestätigungs-E-Mail an <strong>{0}</strong> gesendet. Bitte überprüfen Sie Ihren Posteingang, um die Änderung abzuschließen.',
      cancel: 'Abbrechen',
      loadingMessage: 'Einen Moment, Ihre E-Mail-Änderung wird bestätigt...',
    },
    emailChangeConfirm: {
      title: 'E-Mail-Änderung bestätigen',
      confirmSuccess: 'E-Mail erfolgreich geändert',
      loadingMessage: 'Einen Moment, Ihre E-Mail-Änderung wird bestätigt...',
    },
    profile: {
      title: 'Profil',
      menu: 'Profil',
      email: 'Aktuelle E-Mail',
      firstName: 'Vorname',
      lastName: 'Nachname',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Benachrichtigungen aktivieren',
      isNotificationsEnabledHint:
        'E-Mail- und Push-Benachrichtigungen für wichtige Updates und Aktivitäten in Ihrer Organisation erhalten',
      button: 'Profil speichern',
      success: 'Profil erfolgreich gespeichert',
      cancel: 'Abbrechen',
    },
    profileOnboard: {
      firstName: 'Vorname',
      lastName: 'Nachname',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Benachrichtigungen aktivieren',
      isNotificationsEnabledHint:
        'E-Mail- und Push-Benachrichtigungen für wichtige Updates und Aktivitäten erhalten',
      button: 'Profil speichern',
      success: 'Profil erfolgreich gespeichert',
    },
    signOut: {
      menu: 'Abmelden',
      button: 'Abmelden',
      title: 'Abmelden',
      loading: `Sie werden abgemeldet...`,
    },
    errors: {
      invalidPasswordResetToken:
        'Passwort-Zurücksetzungs-Link ist ungültig oder abgelaufen',
      invalidVerifyEmailToken:
        'E-Mail-Verifizierungs-Link ist ungültig oder abgelaufen',

      USER_NOT_FOUND: 'Benutzer nicht gefunden',
      FAILED_TO_CREATE_USER: 'Fehler beim Erstellen des Benutzers',
      FAILED_TO_CREATE_SESSION: 'Fehler beim Erstellen der Sitzung',
      FAILED_TO_UPDATE_USER: 'Fehler beim Aktualisieren des Benutzers',
      FAILED_TO_GET_SESSION: 'Fehler beim Abrufen der Sitzung',
      INVALID_PASSWORD: 'Ungültiges Passwort',
      INVALID_EMAIL: 'Ungültige E-Mail',
      INVALID_EMAIL_OR_PASSWORD: 'Ungültige E-Mail oder Passwort',
      SOCIAL_ACCOUNT_ALREADY_LINKED: 'Social-Media-Konto bereits verknüpft',
      PROVIDER_NOT_FOUND: 'Anbieter nicht gefunden',
      INVALID_TOKEN: 'Ungültiges Token',
      ID_TOKEN_NOT_SUPPORTED: 'ID-Token nicht unterstützt',
      FAILED_TO_GET_USER_INFO: 'Fehler beim Abrufen der Benutzerinformationen',
      USER_EMAIL_NOT_FOUND: 'Benutzer-E-Mail nicht gefunden',
      EMAIL_NOT_VERIFIED: 'E-Mail nicht verifiziert',
      CANNOT_REMOVE_ADMIN_WITH_SUBSCRIPTION:
        'Administrator kann nicht entfernt oder Admin-Rolle kann nicht entfernt werden, solange die Organisation ein aktives Abonnement hat',
      CANNOT_REMOVE_SELF:
        'Sie können sich nicht selbst aus der Organisation entfernen',
      PASSWORD_TOO_SHORT: 'Passwort zu kurz',
      PASSWORD_TOO_LONG: 'Passwort zu lang',
      USER_ALREADY_EXISTS: 'Benutzer existiert bereits',
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        'Benutzer existiert bereits. Verwenden Sie eine andere E-Mail',
      EMAIL_CAN_NOT_BE_UPDATED: 'E-Mail kann nicht aktualisiert werden',
      CREDENTIAL_ACCOUNT_NOT_FOUND: 'Anmeldekonto nicht gefunden',
      SESSION_EXPIRED: 'Sitzung abgelaufen',
      FAILED_TO_UNLINK_LAST_ACCOUNT: 'Fehler beim Trennen des letzten Kontos',
      ACCOUNT_NOT_FOUND: 'Konto nicht gefunden',
      USER_ALREADY_HAS_PASSWORD: 'Benutzer hat bereits ein Passwort',
      INVALID_METADATA_TYPE: 'Ungültiger Metadatentyp',
      REFILL_AMOUNT_AND_INTERVAL_REQUIRED:
        'Aufladebetrag und -intervall erforderlich',
      REFILL_INTERVAL_AND_AMOUNT_REQUIRED:
        'Aufladeintervall und -betrag erforderlich',
      USER_BANNED: 'Benutzer gesperrt',
      UNAUTHORIZED_SESSION: 'Nicht autorisierte Sitzung',
      KEY_NOT_FOUND: 'Schlüssel nicht gefunden',
      KEY_DISABLED: 'Schlüssel deaktiviert',
      KEY_EXPIRED: 'Schlüssel abgelaufen',
      USAGE_EXCEEDED: 'Nutzung überschritten',
      KEY_NOT_RECOVERABLE: 'Schlüssel nicht wiederherstellbar',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION:
        'Sie dürfen keine neue Organisation erstellen',
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS:
        'Sie haben die maximale Anzahl von Organisationen erreicht',
      ORGANIZATION_ALREADY_EXISTS: 'Organisation existiert bereits',
      ORGANIZATION_NOT_FOUND: 'Organisation nicht gefunden',
      USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION:
        'Benutzer ist kein Mitglied der Organisation',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION:
        'Sie dürfen diese Organisation nicht aktualisieren',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION:
        'Sie dürfen diese Organisation nicht löschen',
      NO_ACTIVE_ORGANIZATION: 'Keine aktive Organisation',
      USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION:
        'Benutzer ist bereits Mitglied dieser Organisation',
      MEMBER_NOT_FOUND: 'Mitglied nicht gefunden',
      ROLE_NOT_FOUND: 'Rolle nicht gefunden',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM:
        'Sie dürfen kein neues Team erstellen',
      TEAM_ALREADY_EXISTS: 'Team existiert bereits',
      TEAM_NOT_FOUND: 'Team nicht gefunden',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER:
        'Sie können die Organisation nicht als einziger Administrator verlassen',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER:
        'Sie können die Organisation nicht ohne Eigentümer verlassen',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER:
        'Sie dürfen dieses Mitglied nicht löschen',
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION:
        'Sie dürfen keine Benutzer in diese Organisation einladen',
      USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION:
        'Benutzer ist bereits in diese Organisation eingeladen',
      INVITATION_NOT_FOUND: 'Einladung nicht gefunden',
      INVITATION_EMAIL_MISMATCH:
        'Diese Einladung wurde an eine andere E-Mail-Adresse gesendet. Bitte melden Sie sich mit dem richtigen Konto an.',
      INVITATION_EXPIRED: 'Diese Einladung ist abgelaufen',
      INVITATION_NOT_PENDING:
        'Diese Einladung wurde bereits angenommen oder abgebrochen',
      YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION:
        'Sie sind nicht der Empfänger der Einladung',
      EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION:
        'E-Mail-Verifizierung erforderlich, bevor Einladung angenommen oder abgelehnt werden kann',
      YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION:
        'Sie dürfen diese Einladung nicht abbrechen',
      INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION:
        'Einladender ist nicht mehr Mitglied der Organisation',
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE:
        'Sie dürfen keinen Benutzer mit dieser Rolle einladen',
      FAILED_TO_RETRIEVE_INVITATION: 'Fehler beim Abrufen der Einladung',
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS:
        'Sie haben die maximale Anzahl von Teams erreicht',
      UNABLE_TO_REMOVE_LAST_TEAM: 'Letztes Team kann nicht entfernt werden',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER:
        'Sie dürfen dieses Mitglied nicht aktualisieren',
      ORGANIZATION_MEMBERSHIP_LIMIT_REACHED:
        'Grenze der Organisationsmitgliedschaft erreicht',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION:
        'Sie dürfen in dieser Organisation keine Teams erstellen',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION:
        'Sie dürfen in dieser Organisation keine Teams löschen',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM:
        'Sie dürfen dieses Team nicht aktualisieren',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM:
        'Sie dürfen dieses Team nicht löschen',
      INVITATION_LIMIT_REACHED: 'Einladungslimit erreicht',
      YOU_CANNOT_BAN_YOURSELF: 'Sie können sich nicht selbst sperren',
      YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE:
        'Sie dürfen die Rolle von Benutzern nicht ändern',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS:
        'Sie dürfen keine Benutzer erstellen',
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: 'Sie dürfen keine Benutzer auflisten',
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS:
        'Sie dürfen keine Benutzersitzungen auflisten',
      YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: 'Sie dürfen keine Benutzer sperren',
      YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS:
        'Sie dürfen sich nicht als Benutzer ausgeben',
      YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS:
        'Sie dürfen keine Benutzersitzungen widerrufen',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: 'Sie dürfen keine Benutzer löschen',
      YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD:
        'Sie dürfen keine Benutzerpasswörter festlegen',
      BANNED_USER: 'Sie wurden von dieser Anwendung gesperrt',
      YOU_ARE_NOT_ALLOWED_TO_GET_USER: 'Sie dürfen keinen Benutzer abrufen',
      NO_DATA_TO_UPDATE: 'Keine Daten zum Aktualisieren',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS:
        'Sie dürfen keine Benutzer aktualisieren',
      YOU_CANNOT_REMOVE_YOURSELF: 'Sie können sich nicht selbst entfernen',
      COULD_NOT_CREATE_SESSION: 'Sitzung konnte nicht erstellt werden',
      ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY:
        'Anonyme Benutzer können sich nicht erneut anonym anmelden',
      CHALLENGE_NOT_FOUND: 'Challenge nicht gefunden',
      YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY:
        'Sie dürfen diesen Passkey nicht registrieren',
      FAILED_TO_VERIFY_REGISTRATION:
        'Fehler beim Verifizieren der Registrierung',
      PASSKEY_NOT_FOUND: 'Passkey nicht gefunden',
      AUTHENTICATION_FAILED: 'Authentifizierung fehlgeschlagen',
      UNABLE_TO_CREATE_SESSION: 'Sitzung kann nicht erstellt werden',
      FAILED_TO_UPDATE_PASSKEY: 'Fehler beim Aktualisieren des Passkeys',
      INVALID_PHONE_NUMBER: 'Ungültige Telefonnummer',
      PHONE_NUMBER_EXIST: 'Telefonnummer existiert',
      INVALID_PHONE_NUMBER_OR_PASSWORD: 'Ungültige Telefonnummer oder Passwort',
      UNEXPECTED_ERROR: 'Unerwarteter Fehler',
      OTP_NOT_FOUND: 'OTP nicht gefunden',
      OTP_EXPIRED: 'OTP abgelaufen',
      INVALID_OTP: 'Ungültiges OTP',
      PHONE_NUMBER_NOT_VERIFIED: 'Telefonnummer nicht verifiziert',
      INVALID_DEVICE_CODE: 'Ungültiger Gerätecode',
      EXPIRED_DEVICE_CODE: 'Gerätecode abgelaufen',
      EXPIRED_USER_CODE: 'Benutzercode abgelaufen',
      AUTHORIZATION_PENDING: 'Autorisierung ausstehend',
      ACCESS_DENIED: 'Zugriff verweigert',
      INVALID_USER_CODE: 'Ungültiger Benutzercode',
      DEVICE_CODE_ALREADY_PROCESSED: 'Gerätecode bereits verarbeitet',
      POLLING_TOO_FREQUENTLY: 'Zu häufiges Abfragen',
      INVALID_DEVICE_CODE_STATUS: 'Ungültiger Gerätecode-Status',
      AUTHENTICATION_REQUIRED: 'Authentifizierung erforderlich',
      OTP_NOT_ENABLED: 'OTP nicht aktiviert',
      OTP_HAS_EXPIRED: 'OTP ist abgelaufen',
      TOTP_NOT_ENABLED: 'TOTP nicht aktiviert',
      TWO_FACTOR_NOT_ENABLED: 'Zwei-Faktor-Authentifizierung nicht aktiviert',
      BACKUP_CODES_NOT_ENABLED: 'Backup-Codes nicht aktiviert',
      INVALID_BACKUP_CODE: 'Ungültiger Backup-Code',
      INVALID_CODE: 'Ungültiger Code',
      TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE:
        'Zu viele Versuche. Neuen Code anfordern',
      INVALID_TWO_FACTOR_COOKIE: 'Ungültiges Zwei-Faktor-Cookie',
      INVALID_USERNAME_OR_PASSWORD: 'Ungültiger Benutzername oder Passwort',
      USERNAME_IS_ALREADY_TAKEN: 'Benutzername ist bereits vergeben',
      USERNAME_TOO_SHORT: 'Benutzername zu kurz',
      USERNAME_TOO_LONG: 'Benutzername zu lang',
      INVALID_USERNAME: 'Ungültiger Benutzername',
      INVALID_DISPLAY_USERNAME: 'Ungültiger Anzeigename',
      TOO_MANY_ATTEMPTS: 'Zu viele Versuche',
      PASSWORD_COMPROMISED: 'Passwort kompromittiert',
      INVALID_OAUTH_CONFIGURATION: 'Ungültige OAuth-Konfiguration',
      INVALID_SESSION_TOKEN: 'Ungültiges Sitzungstoken',

      EXPIRES_IN_IS_TOO_SMALL:
        'Das Ablaufdatum liegt unter dem vordefinierten Mindestwert.',
      EXPIRES_IN_IS_TOO_LARGE:
        'Das Ablaufdatum liegt über dem vordefinierten Maximalwert.',
      INVALID_REMAINING:
        'Die verbleibende Anzahl ist entweder zu groß oder zu klein.',
      INVALID_PREFIX_LENGTH:
        'Die Präfixlänge ist entweder zu groß oder zu klein.',
      INVALID_NAME_LENGTH:
        'Die Namenslänge ist entweder zu groß oder zu klein.',
      METADATA_DISABLED: 'Metadaten sind deaktiviert.',
      RATE_LIMIT_EXCEEDED: 'Ratenlimit überschritten.',
      NO_VALUES_TO_UPDATE: 'Keine Werte zum Aktualisieren.',
      KEY_DISABLED_EXPIRATION:
        'Benutzerdefinierte Schlüssel-Ablaufwerte sind deaktiviert.',
      INVALID_API_KEY: 'Ungültiger API-Schlüssel.',
      INVALID_USER_ID_FROM_API_KEY:
        'Die Benutzer-ID vom API-Schlüssel ist ungültig.',
      INVALID_API_KEY_GETTER_RETURN_TYPE:
        'API-Schlüssel-Getter hat einen ungültigen Schlüsseltyp zurückgegeben. String erwartet.',
      SERVER_ONLY_PROPERTY:
        'Die Eigenschaft, die Sie festlegen möchten, kann nur von der Server-Auth-Instanz festgelegt werden.',
      FAILED_TO_UPDATE_API_KEY: 'Fehler beim Aktualisieren des API-Schlüssels',
      NAME_REQUIRED: 'API-Schlüsselname ist erforderlich.',
    },
  },

  organization: {
    switcher: {
      title: 'Organisationen',
      create: 'Organisation erstellen',
      leave: 'Organisation verlassen',
      leaveConfirmTitle: 'Organisation verlassen?',
      leaveConfirmDescription:
        'Sind Sie sicher, dass Sie {0} verlassen möchten? Sie verlieren den Zugriff auf alle Ressourcen in dieser Organisation.',
      leaveSuccess: 'Organisation erfolgreich verlassen',
      leaveError: 'Fehler beim Verlassen der Organisation',
    },

    invitation: {
      title: `Einladung zu {0} annehmen`,
      message: `Sie wurden zu {0} eingeladen. Sie können wählen, ob Sie annehmen oder ablehnen möchten.`,
    },

    applicationSettings: {
      menu: 'Anwendungseinstellungen',
    },

    form: {
      name: 'Name',
      subdomain: 'Subdomain',
      domain: 'Domain',
      slugPlaceholderDomain: 'organisation.com',
      slugPlaceholderSubdomain: 'organisation',
      slugInvalidSubdomain:
        'Subdomain darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten. Sie darf nicht mit einem Bindestrich beginnen oder enden.',
      slugInvalidDomain:
        'Domain muss ein gültiges Format haben (z.B. beispiel.com). Sie muss mindestens einen Punkt enthalten und darf nur Kleinbuchstaben, Zahlen, Bindestriche und Punkte enthalten.',
      slugReserved:
        'Dieser Slug ist für die Anwendung reserviert und kann nicht verwendet werden',
      logoLight: 'Logo (Heller Modus)',
      logoDark: 'Logo (Dunkler Modus)',
      backgroundImageLight: 'Hintergrundbild (Heller Modus)',
      backgroundImageDark: 'Hintergrundbild (Dunkler Modus)',

      new: {
        title: 'Organisation erstellen',
        success: 'Organisation erfolgreich erstellt',
      },

      edit: {
        title: 'Organisation bearbeiten',
        success: 'Organisation erfolgreich aktualisiert',
      },
    },

    delete: {
      success: 'Organisation erfolgreich gelöscht',
      confirmTitle: 'Organisation löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die Organisation {0} löschen möchten? Diese Aktion ist irreversibel!',
    },

    errors: {
      notFound: 'Organisation nicht gefunden',
      createFailed: 'Fehler beim Erstellen der Organisation',
      updateFailed: 'Fehler beim Aktualisieren der Organisation',
      deleteFailed: 'Fehler beim Löschen der Organisation',
      leaveFailed: 'Fehler beim Verlassen der Organisation',
      setActiveFailed: 'Fehler beim Festlegen der aktiven Organisation',
    },
  },

  member: {
    dashboardCard: {
      title: 'Benutzer',
    },

    view: {
      title: 'Benutzer ansehen',
    },

    showActivity: 'Aktivität',

    list: {
      menu: 'Benutzer',
      title: 'Benutzer',
      noResults: 'Keine Benutzer gefunden.',
      empty:
        'Sie haben noch keine Benutzer erstellt. Beginnen Sie, indem Sie Ihren ersten Benutzer erstellen.',
    },

    importer: {
      title: 'Benutzer importieren',
      menu: 'Benutzer importieren',
    },

    export: {
      success: 'Benutzer erfolgreich exportiert',
    },

    edit: {
      menu: 'Benutzer bearbeiten',
      title: 'Benutzer bearbeiten',
      success: 'Benutzer erfolgreich aktualisiert',
    },

    new: {
      menu: 'Benutzer einladen',
      title: 'Benutzer einladen',
      success: 'Benutzer erfolgreich eingeladen',
    },

    deleteMany: {
      success: 'Benutzer erfolgreich gelöscht',
      noSelection:
        'Sie müssen mindestens einen Benutzer zum Löschen auswählen.',
      confirmTitle: 'Benutzer löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten Benutzer löschen möchten?',
    },

    delete: {
      success: 'Benutzer erfolgreich gelöscht',
      confirmTitle: 'Benutzer löschen?',
    },

    fields: {
      avatars: 'Avatar',
      fullName: 'Vollständiger Name',
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      role: 'Rolle',
      roles: 'Rollen',
      status: 'Status',
      createdAt: 'Erstellt am',
      createdByMember: 'Erstellt von',
      updatedAt: 'Aktualisiert am',
      updatedByMember: 'Aktualisiert von',
    },

    enumerators: {
      roles: {
        admin: 'Administrator',
        member: 'Mitglied',
      },
      status: {
        active: 'Aktiv',
        disabled: 'Deaktiviert',
      },
    },

    errors: {
      cannotRemoveSelfAdminRole:
        'Sie können Ihre eigene Admin-Rolle nicht entfernen',
      cannotRemoveSelf:
        'Sie können sich nicht selbst aus der Organisation entfernen',
      notFound: 'Benutzer nicht gefunden',
      disabledMemberNotFound: 'Deaktiviertes Mitglied nicht gefunden',
      removeFailed: 'Fehler beim Entfernen des Benutzers',
      disableFailed: 'Fehler beim Deaktivieren des Benutzers',
    },

    mcpDescription: {
      list: 'Liste aller Mitglieder in der aktuellen Organisation abrufen. Unterstützt Filterung nach Name, E-Mail und Rolle. Gibt Mitgliederprofile einschließlich ihrer Benutzerinformationen, Rolle, Status und Avatar zurück.',
      get: 'Detaillierte Informationen über ein bestimmtes Mitglied anhand seiner eindeutigen ID abrufen. Gibt das vollständige Mitgliederprofil einschließlich zugehöriger Benutzerdaten und Organisationsdetails zurück.',
      autocomplete:
        'Nach Mitgliedern suchen, um sie in Autocomplete-Feldern zu verwenden. Gibt eine vereinfachte Liste von Mitgliedern zurück, die der Abfrage entsprechen, nützlich für die Zuweisung von Aufgaben, Beziehungen oder Berechtigungen.',
      update:
        'Vorhandenen Mitgliederdatensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung von Mitgliederfeldern einschließlich Vorname, Nachname, Rolle und Avatar. Verfolgt die Aktualisierung automatisch in Audit-Protokollen. Verhindert, dass Mitglieder ihre eigene Admin-Rolle entfernen.',
      disable:
        'Mitgliedskonto vorübergehend deaktivieren. Das Mitglied kann nicht mehr auf die Organisation zugreifen, aber seine Daten werden aufbewahrt. Kann mit der Wiederherstellungsoperation rückgängig gemacht werden.',
      restore:
        'Zuvor deaktiviertes Mitgliedskonto wiederherstellen. Das Mitglied erhält wieder Zugriff auf die Organisation mit seiner vorherigen Rolle und Berechtigungen.',
      remove:
        'Mitglied dauerhaft aus der Organisation entfernen. Diese Aktion kann nicht rückgängig gemacht werden. Das Benutzerkonto des Mitglieds wird gelöscht und alle zugehörigen Daten werden entfernt.',
    },
  },

  invitation: {
    list: {
      title: 'Einladungen',
      noResults: 'Keine Einladungen gefunden.',
    },

    view: {
      title: 'Einladung ansehen',
    },

    resend: {
      success: 'Einladung erfolgreich erneut gesendet',
    },

    cancel: {
      success: 'Einladung erfolgreich abgebrochen',
      confirmTitle:
        'Sind Sie sicher, dass Sie diese Einladung abbrechen möchten?',
    },

    actions: {
      resend: 'Erneut senden',
      cancel: 'Abbrechen',
    },

    fields: {
      email: 'E-Mail',
      role: 'Rolle',
      status: 'Status',
      expiresAt: 'Läuft ab am',
      invitedBy: 'Eingeladen von',
      createdAt: 'Erstellt am',
    },

    enumerators: {
      status: {
        pending: 'Ausstehend',
        accepted: 'Angenommen',
        rejected: 'Abgelehnt',
        expired: 'Abgelaufen',
        cancelled: 'Abgebrochen',
      },
    },

    errors: {
      alreadyProcessed: 'Einladung wurde bereits verarbeitet',
      notFound: 'Einladung nicht gefunden',
      acceptFailed: 'Fehler beim Annehmen der Einladung',
      rejectFailed: 'Fehler beim Ablehnen der Einladung',
      cancelFailed: 'Fehler beim Abbrechen der Einladung',
      createFailed: 'Fehler beim Erstellen der Einladung',
      resendFailed: 'Fehler beim erneuten Senden der Einladung',
    },

    cancelMany: {
      success: 'Einladungen erfolgreich abgebrochen',
      noSelection: 'Bitte wählen Sie mindestens eine Einladung aus',
      confirmTitle: 'Einladungen abbrechen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie {0} Einladung(en) abbrechen möchten?',
    },

    resendMany: {
      success: 'Einladungen erfolgreich erneut gesendet',
      noSelection: 'Bitte wählen Sie mindestens eine Einladung aus',
      confirmTitle: 'Einladungen erneut senden?',
      confirmDescription:
        'Sind Sie sicher, dass Sie {0} Einladung(en) erneut senden möchten?',
    },

    export: {
      success: 'Einladungen erfolgreich exportiert',
    },
  },

  subscription: {
    menu: 'Abonnement',
    title: 'Pläne und Preise',

    subscribe: 'Abonnieren',
    manage: 'Verwalten',
    notPlanUser: 'Sie sind nicht der Verwalter dieses Abonnements.',
    cancelAt: 'Ihr Abonnement wird gekündigt am',
    currentPlan: 'Aktueller Plan:',
    unknown: 'Unbekannt',
    noPlansAvailable: 'Keine Abonnementpläne verfügbar.',
    current: 'Aktuell',
    mobileUnavailableTitle: 'Abonnements nicht verfügbar',
    mobileUnavailable:
      'Abonnements sind auf Mobilgeräten nicht verfügbar. Bitte besuchen Sie unsere Website in einem Desktop-Browser, um Ihr Abonnement zu verwalten.',

    intervals: {
      day: 'Täglich',
      week: 'Wöchentlich',
      month: 'Monatlich',
      year: 'Jährlich',
    },

    errors: {
      disabled: 'Abonnements sind auf dieser Plattform deaktiviert',
      alreadyExistsActive: 'Es existiert bereits ein aktives Abonnement',
      stripeNotConfigured: 'Stripe ENV-Variablen fehlen',
    },

    mcpDescription: {
      checkout:
        'Stripe-Checkout-Sitzung erstellen, um einen Preisplan zu abonnieren. Geben Sie die Stripe-Preis-ID an und das System generiert eine Checkout-URL, wo Benutzer die Zahlung abschließen können. Gibt die Checkout-Sitzungs-URL zurück.',
      portal:
        'Stripe-Kundenportal-URL generieren, wo Benutzer ihr Abonnement verwalten, Zahlungsmethoden aktualisieren, Rechnungen ansehen und ihr Abonnement kündigen können. Erfordert ein aktives Abonnement.',
      plans:
        'Alle verfügbaren Abonnementpläne von Stripe abrufen. Gibt eine Liste von Plänen mit Preisinformationen, Funktionen, Abrechnungsintervallen und Verfügbarkeitsstatus zurück. Enthält sowohl aktive als auch archivierte Pläne.',
    },
  },
  exam: {
    dashboardCard: {
      title: 'Exams',
    },

    list: {
      menu: 'Exams',
      title: 'Exams',
      noResults: 'Keine exams gefunden.',
      empty:
        'Sie haben noch keine exams erstellt. Beginnen Sie, indem Sie Ihren ersten exam erstellen.',
    },

    importer: {
      title: 'Exams importieren',
      menu: 'Exams importieren',
    },

    export: {
      success: 'Exams erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Exam',
      title: 'Neuer Exam',
      success: 'Exam erfolgreich erstellt',
    },

    view: {
      title: 'Exam ansehen',
    },

    edit: {
      menu: 'Exam bearbeiten',
      title: 'Exam bearbeiten',
      success: 'Exam erfolgreich aktualisiert',
    },

    restore: {
      success: 'Exam erfolgreich wiederhergestellt',
      confirmTitle: 'Exam wiederherstellen?',
    },

    restoreMany: {
      success: 'Exam(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen exam zum Wiederherstellen auswählen.',
      confirmTitle: 'Exam(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exams wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Exam(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen exam zum Archivieren auswählen.',
      confirmTitle: 'Exam(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exams archivieren möchten?',
    },

    archive: {
      success: 'Exam erfolgreich archiviert',
      confirmTitle: 'Exam archivieren?',
    },

    deleteMany: {
      success: 'Exam(n) erfolgreich gelöscht',
      noSelection: 'Sie müssen mindestens einen exam zum Löschen auswählen.',
      confirmTitle: 'Exam(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exams löschen möchten?',
    },

    delete: {
      success: 'Exam erfolgreich gelöscht',
      confirmTitle: 'Exam löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von exams mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt exams Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten exam anhand seiner eindeutigen ID abrufen. Gibt vollständiges exam Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen exam Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen exam Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller exam Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere exams dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von exam IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere exams archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte exams können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte exams wieder auf aktiven Status setzen. Macht die exams in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Exams Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von exams zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
    },
  },
  chapter: {
    dashboardCard: {
      title: 'Chapters',
    },

    list: {
      menu: 'Chapters',
      title: 'Chapters',
      noResults: 'Keine chapters gefunden.',
      empty:
        'Sie haben noch keine chapters erstellt. Beginnen Sie, indem Sie Ihren ersten chapter erstellen.',
    },

    importer: {
      title: 'Chapters importieren',
      menu: 'Chapters importieren',
    },

    export: {
      success: 'Chapters erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Chapter',
      title: 'Neuer Chapter',
      success: 'Chapter erfolgreich erstellt',
    },

    view: {
      title: 'Chapter ansehen',
    },

    edit: {
      menu: 'Chapter bearbeiten',
      title: 'Chapter bearbeiten',
      success: 'Chapter erfolgreich aktualisiert',
    },

    restore: {
      success: 'Chapter erfolgreich wiederhergestellt',
      confirmTitle: 'Chapter wiederherstellen?',
    },

    restoreMany: {
      success: 'Chapter(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen chapter zum Wiederherstellen auswählen.',
      confirmTitle: 'Chapter(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten chapters wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Chapter(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen chapter zum Archivieren auswählen.',
      confirmTitle: 'Chapter(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten chapters archivieren möchten?',
    },

    archive: {
      success: 'Chapter erfolgreich archiviert',
      confirmTitle: 'Chapter archivieren?',
    },

    deleteMany: {
      success: 'Chapter(n) erfolgreich gelöscht',
      noSelection: 'Sie müssen mindestens einen chapter zum Löschen auswählen.',
      confirmTitle: 'Chapter(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten chapters löschen möchten?',
    },

    delete: {
      success: 'Chapter erfolgreich gelöscht',
      confirmTitle: 'Chapter löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von chapters mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt chapters Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten chapter anhand seiner eindeutigen ID abrufen. Gibt vollständiges chapter Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen chapter Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen chapter Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller chapter Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere chapters dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von chapter IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere chapters archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte chapters können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte chapters wieder auf aktiven Status setzen. Macht die chapters in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Chapters Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von chapters zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
    },
  },
  lesson: {
    dashboardCard: {
      title: 'Lessons',
    },

    list: {
      menu: 'Lessons',
      title: 'Lessons',
      noResults: 'Keine lessons gefunden.',
      empty:
        'Sie haben noch keine lessons erstellt. Beginnen Sie, indem Sie Ihren ersten lesson erstellen.',
    },

    importer: {
      title: 'Lessons importieren',
      menu: 'Lessons importieren',
    },

    export: {
      success: 'Lessons erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Lesson',
      title: 'Neuer Lesson',
      success: 'Lesson erfolgreich erstellt',
    },

    view: {
      title: 'Lesson ansehen',
    },

    edit: {
      menu: 'Lesson bearbeiten',
      title: 'Lesson bearbeiten',
      success: 'Lesson erfolgreich aktualisiert',
    },

    restore: {
      success: 'Lesson erfolgreich wiederhergestellt',
      confirmTitle: 'Lesson wiederherstellen?',
    },

    restoreMany: {
      success: 'Lesson(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen lesson zum Wiederherstellen auswählen.',
      confirmTitle: 'Lesson(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten lessons wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Lesson(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen lesson zum Archivieren auswählen.',
      confirmTitle: 'Lesson(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten lessons archivieren möchten?',
    },

    archive: {
      success: 'Lesson erfolgreich archiviert',
      confirmTitle: 'Lesson archivieren?',
    },

    deleteMany: {
      success: 'Lesson(n) erfolgreich gelöscht',
      noSelection: 'Sie müssen mindestens einen lesson zum Löschen auswählen.',
      confirmTitle: 'Lesson(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten lessons löschen möchten?',
    },

    delete: {
      success: 'Lesson erfolgreich gelöscht',
      confirmTitle: 'Lesson löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von lessons mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt lessons Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten lesson anhand seiner eindeutigen ID abrufen. Gibt vollständiges lesson Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen lesson Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen lesson Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller lesson Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere lessons dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von lesson IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere lessons archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte lessons können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte lessons wieder auf aktiven Status setzen. Macht die lessons in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Lessons Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von lessons zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
    },
  },
  practiceQuestion: {
    dashboardCard: {
      title: 'Practice Questions',
    },

    list: {
      menu: 'Practice Questions',
      title: 'Practice Questions',
      noResults: 'Keine practice questions gefunden.',
      empty:
        'Sie haben noch keine practice questions erstellt. Beginnen Sie, indem Sie Ihren ersten practice question erstellen.',
    },

    importer: {
      title: 'Practice Questions importieren',
      menu: 'Practice Questions importieren',
    },

    export: {
      success: 'Practice Questions erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Practice Question',
      title: 'Neuer Practice Question',
      success: 'Practice Question erfolgreich erstellt',
    },

    view: {
      title: 'Practice Question ansehen',
    },

    edit: {
      menu: 'Practice Question bearbeiten',
      title: 'Practice Question bearbeiten',
      success: 'Practice Question erfolgreich aktualisiert',
    },

    restore: {
      success: 'Practice Question erfolgreich wiederhergestellt',
      confirmTitle: 'Practice Question wiederherstellen?',
    },

    restoreMany: {
      success: 'Practice Question(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen practice question zum Wiederherstellen auswählen.',
      confirmTitle: 'Practice Question(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten practice questions wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Practice Question(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen practice question zum Archivieren auswählen.',
      confirmTitle: 'Practice Question(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten practice questions archivieren möchten?',
    },

    archive: {
      success: 'Practice Question erfolgreich archiviert',
      confirmTitle: 'Practice Question archivieren?',
    },

    deleteMany: {
      success: 'Practice Question(n) erfolgreich gelöscht',
      noSelection:
        'Sie müssen mindestens einen practice question zum Löschen auswählen.',
      confirmTitle: 'Practice Question(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten practice questions löschen möchten?',
    },

    delete: {
      success: 'Practice Question erfolgreich gelöscht',
      confirmTitle: 'Practice Question löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von practice questions mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt practice questions Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten practice question anhand seiner eindeutigen ID abrufen. Gibt vollständiges practice question Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen practice question Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen practice question Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller practice question Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere practice questions dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von practice question IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere practice questions archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte practice questions können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte practice questions wieder auf aktiven Status setzen. Macht die practice questions in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Practice Questions Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von practice questions zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
    },
  },
  concept: {
    dashboardCard: {
      title: 'Concepts',
    },

    list: {
      menu: 'Concepts',
      title: 'Concepts',
      noResults: 'Keine concepts gefunden.',
      empty:
        'Sie haben noch keine concepts erstellt. Beginnen Sie, indem Sie Ihren ersten concept erstellen.',
    },

    importer: {
      title: 'Concepts importieren',
      menu: 'Concepts importieren',
    },

    export: {
      success: 'Concepts erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Concept',
      title: 'Neuer Concept',
      success: 'Concept erfolgreich erstellt',
    },

    view: {
      title: 'Concept ansehen',
    },

    edit: {
      menu: 'Concept bearbeiten',
      title: 'Concept bearbeiten',
      success: 'Concept erfolgreich aktualisiert',
    },

    restore: {
      success: 'Concept erfolgreich wiederhergestellt',
      confirmTitle: 'Concept wiederherstellen?',
    },

    restoreMany: {
      success: 'Concept(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen concept zum Wiederherstellen auswählen.',
      confirmTitle: 'Concept(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten concepts wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Concept(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen concept zum Archivieren auswählen.',
      confirmTitle: 'Concept(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten concepts archivieren möchten?',
    },

    archive: {
      success: 'Concept erfolgreich archiviert',
      confirmTitle: 'Concept archivieren?',
    },

    deleteMany: {
      success: 'Concept(n) erfolgreich gelöscht',
      noSelection: 'Sie müssen mindestens einen concept zum Löschen auswählen.',
      confirmTitle: 'Concept(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten concepts löschen möchten?',
    },

    delete: {
      success: 'Concept erfolgreich gelöscht',
      confirmTitle: 'Concept löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von concepts mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt concepts Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten concept anhand seiner eindeutigen ID abrufen. Gibt vollständiges concept Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen concept Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen concept Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller concept Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere concepts dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von concept IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere concepts archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte concepts können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte concepts wieder auf aktiven Status setzen. Macht die concepts in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Concepts Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von concepts zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
    },
  },
  examType: {
    dashboardCard: {
      title: 'Exam Types',
    },

    list: {
      menu: 'Exam Types',
      title: 'Exam Types',
      noResults: 'Keine exam types gefunden.',
      empty:
        'Sie haben noch keine exam types erstellt. Beginnen Sie, indem Sie Ihren ersten exam type erstellen.',
    },

    importer: {
      title: 'Exam Types importieren',
      menu: 'Exam Types importieren',
    },

    export: {
      success: 'Exam Types erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Exam Type',
      title: 'Neuer Exam Type',
      success: 'Exam Type erfolgreich erstellt',
    },

    view: {
      title: 'Exam Type ansehen',
    },

    edit: {
      menu: 'Exam Type bearbeiten',
      title: 'Exam Type bearbeiten',
      success: 'Exam Type erfolgreich aktualisiert',
    },

    restore: {
      success: 'Exam Type erfolgreich wiederhergestellt',
      confirmTitle: 'Exam Type wiederherstellen?',
    },

    restoreMany: {
      success: 'Exam Type(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen exam type zum Wiederherstellen auswählen.',
      confirmTitle: 'Exam Type(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exam types wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Exam Type(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen exam type zum Archivieren auswählen.',
      confirmTitle: 'Exam Type(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exam types archivieren möchten?',
    },

    archive: {
      success: 'Exam Type erfolgreich archiviert',
      confirmTitle: 'Exam Type archivieren?',
    },

    deleteMany: {
      success: 'Exam Type(n) erfolgreich gelöscht',
      noSelection:
        'Sie müssen mindestens einen exam type zum Löschen auswählen.',
      confirmTitle: 'Exam Type(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exam types löschen möchten?',
    },

    delete: {
      success: 'Exam Type erfolgreich gelöscht',
      confirmTitle: 'Exam Type löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von exam types mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt exam types Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten exam type anhand seiner eindeutigen ID abrufen. Gibt vollständiges exam type Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen exam type Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen exam type Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller exam type Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere exam types dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von exam type IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere exam types archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte exam types können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte exam types wieder auf aktiven Status setzen. Macht die exam types in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Exam Types Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von exam types zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
    },
  },
  examInstance: {
    dashboardCard: {
      title: 'Exam Attempts',
    },

    list: {
      menu: 'Exam Attempts',
      title: 'Exam Attempts',
      noResults: 'Keine exam attempts gefunden.',
      empty:
        'Sie haben noch keine exam attempts erstellt. Beginnen Sie, indem Sie Ihren ersten exam attempt erstellen.',
    },

    importer: {
      title: 'Exam Attempts importieren',
      menu: 'Exam Attempts importieren',
    },

    export: {
      success: 'Exam Attempts erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Exam Attempt',
      title: 'Neuer Exam Attempt',
      success: 'Exam Attempt erfolgreich erstellt',
    },

    view: {
      title: 'Exam Attempt ansehen',
    },

    edit: {
      menu: 'Exam Attempt bearbeiten',
      title: 'Exam Attempt bearbeiten',
      success: 'Exam Attempt erfolgreich aktualisiert',
    },

    restore: {
      success: 'Exam Attempt erfolgreich wiederhergestellt',
      confirmTitle: 'Exam Attempt wiederherstellen?',
    },

    restoreMany: {
      success: 'Exam Attempt(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen exam attempt zum Wiederherstellen auswählen.',
      confirmTitle: 'Exam Attempt(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exam attempts wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Exam Attempt(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen exam attempt zum Archivieren auswählen.',
      confirmTitle: 'Exam Attempt(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exam attempts archivieren möchten?',
    },

    archive: {
      success: 'Exam Attempt erfolgreich archiviert',
      confirmTitle: 'Exam Attempt archivieren?',
    },

    deleteMany: {
      success: 'Exam Attempt(n) erfolgreich gelöscht',
      noSelection:
        'Sie müssen mindestens einen exam attempt zum Löschen auswählen.',
      confirmTitle: 'Exam Attempt(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten exam attempts löschen möchten?',
    },

    delete: {
      success: 'Exam Attempt erfolgreich gelöscht',
      confirmTitle: 'Exam Attempt löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von exam attempts mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt exam attempts Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten exam attempt anhand seiner eindeutigen ID abrufen. Gibt vollständiges exam attempt Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen exam attempt Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen exam attempt Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller exam attempt Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere exam attempts dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von exam attempt IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere exam attempts archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte exam attempts können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte exam attempts wieder auf aktiven Status setzen. Macht die exam attempts in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Exam Attempts Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von exam attempts zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
    },
  },
  dailyGoal: {
    dashboardCard: {
      title: 'Daily Goals',
    },

    list: {
      menu: 'Daily Goals',
      title: 'Daily Goals',
      noResults: 'Keine daily goals gefunden.',
      empty:
        'Sie haben noch keine daily goals erstellt. Beginnen Sie, indem Sie Ihren ersten daily goal erstellen.',
    },

    importer: {
      title: 'Daily Goals importieren',
      menu: 'Daily Goals importieren',
    },

    export: {
      success: 'Daily Goals erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Daily Goal',
      title: 'Neuer Daily Goal',
      success: 'Daily Goal erfolgreich erstellt',
    },

    view: {
      title: 'Daily Goal ansehen',
    },

    edit: {
      menu: 'Daily Goal bearbeiten',
      title: 'Daily Goal bearbeiten',
      success: 'Daily Goal erfolgreich aktualisiert',
    },

    restore: {
      success: 'Daily Goal erfolgreich wiederhergestellt',
      confirmTitle: 'Daily Goal wiederherstellen?',
    },

    restoreMany: {
      success: 'Daily Goal(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen daily goal zum Wiederherstellen auswählen.',
      confirmTitle: 'Daily Goal(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten daily goals wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Daily Goal(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen daily goal zum Archivieren auswählen.',
      confirmTitle: 'Daily Goal(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten daily goals archivieren möchten?',
    },

    archive: {
      success: 'Daily Goal erfolgreich archiviert',
      confirmTitle: 'Daily Goal archivieren?',
    },

    deleteMany: {
      success: 'Daily Goal(n) erfolgreich gelöscht',
      noSelection:
        'Sie müssen mindestens einen daily goal zum Löschen auswählen.',
      confirmTitle: 'Daily Goal(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten daily goals löschen möchten?',
    },

    delete: {
      success: 'Daily Goal erfolgreich gelöscht',
      confirmTitle: 'Daily Goal löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von daily goals mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt daily goals Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten daily goal anhand seiner eindeutigen ID abrufen. Gibt vollständiges daily goal Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen daily goal Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen daily goal Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller daily goal Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere daily goals dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von daily goal IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere daily goals archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte daily goals können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte daily goals wieder auf aktiven Status setzen. Macht die daily goals in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Daily Goals Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von daily goals zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
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
      noResults: 'Keine document uploads gefunden.',
      empty:
        'Sie haben noch keine document uploads erstellt. Beginnen Sie, indem Sie Ihren ersten document upload erstellen.',
    },

    importer: {
      title: 'Document Uploads importieren',
      menu: 'Document Uploads importieren',
    },

    export: {
      success: 'Document Uploads erfolgreich exportiert',
    },

    new: {
      menu: 'Neuer Document Upload',
      title: 'Neuer Document Upload',
      success: 'Document Upload erfolgreich erstellt',
    },

    view: {
      title: 'Document Upload ansehen',
    },

    edit: {
      menu: 'Document Upload bearbeiten',
      title: 'Document Upload bearbeiten',
      success: 'Document Upload erfolgreich aktualisiert',
    },

    restore: {
      success: 'Document Upload erfolgreich wiederhergestellt',
      confirmTitle: 'Document Upload wiederherstellen?',
    },

    restoreMany: {
      success: 'Document Upload(n) erfolgreich wiederhergestellt',
      noSelection:
        'Sie müssen mindestens einen document upload zum Wiederherstellen auswählen.',
      confirmTitle: 'Document Upload(n) wiederherstellen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten document uploads wiederherstellen möchten?',
    },

    archiveMany: {
      success: 'Document Upload(n) erfolgreich archiviert',
      noSelection:
        'Sie müssen mindestens einen document upload zum Archivieren auswählen.',
      confirmTitle: 'Document Upload(n) archivieren?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten document uploads archivieren möchten?',
    },

    archive: {
      success: 'Document Upload erfolgreich archiviert',
      confirmTitle: 'Document Upload archivieren?',
    },

    deleteMany: {
      success: 'Document Upload(n) erfolgreich gelöscht',
      noSelection:
        'Sie müssen mindestens einen document upload zum Löschen auswählen.',
      confirmTitle: 'Document Upload(n) löschen?',
      confirmDescription:
        'Sind Sie sicher, dass Sie die {0} ausgewählten document uploads löschen möchten?',
    },

    delete: {
      success: 'Document Upload erfolgreich gelöscht',
      confirmTitle: 'Document Upload löschen?',
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
      createdByMember: 'Erstellt von',
      updatedByMember: 'Aktualisiert von',
      archivedByMember: 'Archiviert von',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      archivedAt: 'Archiviert am',
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
      list: 'Paginierte Liste von document uploads mit erweiterten Filteroptionen abrufen. Unterstützt Filterung nach verschiedenen Feldern und verwandten Entitäten. Gibt document uploads Details einschließlich aller Beziehungen und Metadaten zurück.',
      get: 'Detaillierte Informationen über einen bestimmten document upload anhand seiner eindeutigen ID abrufen. Gibt vollständiges document upload Profil einschließlich aller Beziehungen, Anhänge und Audit-Metadaten zurück.',
      create:
        'Neuen document upload Datensatz mit umfassenden Details erstellen. Unterstützt alle definierten Felder einschließlich Beziehungen, Dateianhänge und benutzerdefinierte Eigenschaften.',
      update:
        'Vorhandenen document upload Datensatz mit neuen Informationen aktualisieren. Ermöglicht die Änderung aller document upload Felder einschließlich Beziehungen und Anhänge. Verfolgt die Aktualisierung automatisch in Audit-Protokollen.',
      delete:
        'Einen oder mehrere document uploads dauerhaft aus dem System löschen. Diese Aktion ist irreversibel. Akzeptiert ein Array von document upload IDs und entfernt alle zugehörigen Daten.',
      archive:
        'Einen oder mehrere document uploads archivieren, um sie aus den Standardansichten auszublenden, während ihre Daten erhalten bleiben. Archivierte document uploads können später wiederhergestellt werden. Nützlich für inaktive oder historische Datensätze.',
      restore:
        'Zuvor archivierte document uploads wieder auf aktiven Status setzen. Macht die document uploads in den Standardansichten wieder sichtbar.',
      autocomplete:
        'Document Uploads Vorschläge für Autocomplete-Eingaben suchen und abrufen. Gibt eine vereinfachte Liste von document uploads zurück, die der Suchabfrage entsprechen, optimiert für Auswahl-Dropdowns und Autocomplete-Felder.',
    },
  },

  auditLog: {
    list: {
      menu: 'Audit-Protokolle',
      title: 'Audit-Protokolle',
      noResults: 'Keine Audit-Protokolle gefunden.',
    },

    changesDialog: {
      title: 'Audit-Protokoll',
      changes: 'Änderungen',
      noChanges: 'Es gibt keine Änderungen in diesem Protokoll.',
      showChangesOnly: 'Nur Änderungen anzeigen',
      showFullObject: 'Vollständiges Objekt anzeigen',
    },

    export: {
      success: 'Audit-Protokolle erfolgreich exportiert',
    },

    fields: {
      timestamp: 'Datum',
      entityName: 'Entität',
      entityNames: 'Entitäten',
      entityId: 'Entitäts-ID',
      operation: 'Operation',
      operations: 'Operationen',
      member: 'Benutzer',
      apiKey: 'API-Schlüssel',
      apiEndpoint: 'API-Endpunkt',
      apiHttpResponseCode: 'API-Status',
    },

    enumerators: {
      operation: {
        SI: 'Anmelden',
        SO: 'Abmelden',
        SU: 'Registrieren',
        PRR: 'Passwort-Zurücksetzung angefordert',
        PRC: 'Passwort-Zurücksetzung bestätigt',
        PC: 'Passwort geändert',
        VER: 'E-Mail-Verifizierung angefordert',
        VEC: 'E-Mail-Verifizierung bestätigt',
        C: 'Erstellen',
        U: 'Aktualisieren',
        D: 'Löschen',
        AG: 'API Get',
        APO: 'API Post',
        APU: 'API Put',
        AD: 'API Delete',
      },
    },

    dashboardCard: {
      activityChart: 'Aktivität',
      activityList: 'Letzte Aktivität',
    },

    readableOperations: {
      SI: '{0} hat sich angemeldet',
      SIF: 'Fehlgeschlagener Anmeldeversuch für {0}',
      SU: '{0} hat sich registriert',
      PRR: '{0} hat Passwort-Zurücksetzung angefordert',
      PRC: '{0} hat Passwort-Zurücksetzung bestätigt',
      PC: '{0} hat Passwort geändert',
      VER: '{0} hat E-Mail-Verifizierung angefordert',
      VEC: '{0} hat E-Mail verifiziert',
      ECR: '{0} hat E-Mail-Änderung angefordert',
      ECC: '{0} hat E-Mail-Änderung bestätigt',
      C: '{0} hat {1} {2} erstellt',
      U: '{0} hat {1} {2} aktualisiert',
      D: '{0} hat {1} {2} gelöscht',
      selfSignUp: '{0} hat sich registriert',
      selfUpdate: '{0} hat sein Profil aktualisiert',
      AG: 'API-Key GET-Anfrage',
      APO: 'API-Key POST-Anfrage',
      APU: 'API-Key PUT-Anfrage',
      AD: 'API-Key DELETE-Anfrage',
    },

    mcpDescription: {
      list: 'Audit-Trail abfragen, um Protokolle aller in der Organisation durchgeführten Aktionen abzurufen. Unterstützt Filterung nach Entitätstyp, Entitäts-ID, Operationstyp und Zeitbereich. Gibt detaillierte Datensätze zurück, einschließlich wer die Aktion durchgeführt hat, wann und was sich geändert hat. Wesentlich für Compliance und Sicherheitsüberwachung.',
      activityChart:
        'Aggregierte Aktivitätsstatistiken über einen Zeitraum abrufen. Gibt ein Zeitreihendiagramm der Benutzeraktivitäten und -operationen zurück, nützlich zur Visualisierung von Systemnutzungsmustern und Identifizierung von Spitzenaktivitätszeiten.',
    },
  },

  apiDocs: {
    title: 'API-Dokumentation',
    menu: 'API-Dokumentation',
    featuresApi: 'Features-API',
    authApi: 'Auth-API',
    openapi: {
      title: 'API',
      serverDescription: 'API-Server',
      securitySchemes: {
        apiKeyAuth: {
          description: 'API-Schlüssel-Authentifizierung mit x-api-key-Header',
        },
        bearerAuth: {
          description:
            'API-Schlüssel-Authentifizierung mit Authorization Bearer Token',
        },
      },
    },
  },

  mcp: {
    title: 'MCP-Integration',
    menu: 'MCP-Integration',
    subtitle: 'Externe KI-Assistenten mit dem Model Context Protocol verbinden',
    info: 'Verwenden Sie den unten stehenden Endpunkt, um externe KI-Assistenten wie ChatGPT oder Claude Desktop mit Ihren Organisationsdaten zu verbinden.',
    endpoint: {
      title: 'Ihr MCP-Endpunkt',
      description:
        'Verwenden Sie diesen Endpunkt, um MCP-Clients zu konfigurieren',
      endpointLabel: 'MCP-Endpunkt-URL',
      organizationLabel: 'Organisations-ID',
      languageLabel: 'Sprache',
    },
    usage: {
      title: 'Verwendung',
      description:
        'Folgen Sie diesen Schritten, um mit externen KI-Assistenten zu integrieren:',
      step1: 'Kopieren Sie die Endpunkt-URL von oben',
      step2:
        'Konfigurieren Sie Ihren KI-Assistenten (ChatGPT, Claude Desktop, etc.) mit diesem MCP-Endpunkt',
      step3:
        'Authentifizieren Sie sich mit OAuth, wenn Sie dazu aufgefordert werden',
      step4:
        'Beginnen Sie, Ihre Organisationsdaten über den KI-Chat zu verwenden',
    },
  },

  user: {
    mcpDescription: {
      me: 'Aktuelles authentifiziertes Benutzerprofil und alle Organisationsmitgliedschaften abrufen. Gibt Benutzerdetails, alle Organisationen, denen sie angehören, ihre Rollen in jeder Organisation und alle aktiven Abonnements zurück.',
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
      title: 'Kurs-Player',
      modules: 'Module',
      courseOutline: 'Kursubersicht',
      currentModule: 'Modul: {0}',
      progressComplete: '{0}% abgeschlossen',
      lessonKindVideo: 'Video',
      lessonKindArticle: 'Artikel',
      lessonKindQuiz: 'Quiz',
      durationMinutes: '{0} min',
      durationQuestions: '{0} Fragen',
      readingTime: '{0} min Lesezeit',
      videoUnavailable: 'Fur diese Lektion wurde kein Video hochgeladen.',
      noLessonContent: 'Fur diese Lektion wurde noch kein Inhalt hinzugefugt.',
      articleHint:
        'Bitte den KI-Tutor um eine Erklarung, Zusammenfassung oder Ubungsfragen.',
      completeLesson: 'Als abgeschlossen markieren',
      completedLesson: 'Abgeschlossen',
      saveNote: 'Notiz speichern',
      downloadResources: 'Ressourcen herunterladen',
      openMiniPlayer: 'Mini-Player offnen',
      closeMiniPlayer: 'Mini-Player schliessen',
      playing: 'Wiedergabe',
      assignments: 'Hausaufgabe',
      submitAssignment: 'Hausaufgabe einreichen',
      resubmitAssignment: 'Hausaufgabe erneut einreichen',
      pendingReview: 'Eingereicht und wartet auf Prufung.',
      homeworkComplete: 'Diese Hausaufgabe ist abgeschlossen.',
      resubmissionClosed:
        'Erneute Einreichungen sind fur diese Hausaufgabe geschlossen.',
      maxAttemptsReached: 'Maximale Anzahl an Versuchen erreicht.',
      tutor: 'KI-Kurstutor',
      tutorPrompt: 'Frage zu diesem Kurs oder dieser Lektion...',
      resources: 'Herunterladbare Dateien',
      quizzes: 'Quizze',
      takeQuiz: 'Quiz starten',
    },
    mobile: {
      savedOffline:
        'Offline gespeichert. Es wird synchronisiert, sobald du wieder online bist.',
      outline: 'Kursübersicht',
      nextLesson: 'Nächste Lektion',
      offlineStatus: {
        online: 'Online',
        offline:
          'Offline-Modus: Lektionsarbeit wird auf diesem Gerät gespeichert.',
        syncing: 'Gespeicherte Lektionsarbeit wird synchronisiert...',
        synced: 'Lektionsarbeit synchronisiert.',
        failed:
          'Ein Teil der Lektionsarbeit benötigt einen weiteren Synchronisierungsversuch.',
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
    menu: 'Creator-Bewerbung',
    title: 'Creator-Bewerbung',
    description:
      'Beantrage die Lehrpersonen-Verifizierung mit strukturiertem Profil, Kursplan und privater Identitätsprüfung, bevor du Kurse auf NexExam veröffentlichst.',
    adminTitle: 'Creator-Bewerbungen',
    adminDescription:
      'Prüfe Lehrprofile, Identitätsverifizierung und Creator-Bereitschaft vor der Genehmigung.',
    sections: {
      profile: 'Lehrprofil',
      profileBody:
        'Zeige Lernenden und Prüfern, wer du bist, was du unterrichtest und wen du unterstützt.',
      expertise: 'Expertise und Kursplan',
      expertiseBody:
        'Füge Nachweise, Themenschwerpunkt, Beleg-Links und einen Beispiel-Lektionsplan für die Qualitätsprüfung hinzu.',
      identity: 'Identitätsverifizierung',
      identityBody:
        'Lade amtliche Ausweise oder berufliche Identitätsdokumente in den privaten Verifizierungsbereich hoch.',
      payout: 'Auszahlung und Kontakt',
      payoutBody:
        'Teile Auszahlungshinweise oder den besten Kontaktweg für das Creator-Onboarding.',
      review: 'Zur Prüfung einreichen',
      reviewBody:
        'Speichere deine Bewerbung zuerst und starte danach den Verifizierungsagenten, sobald deine ID-Dokumente hochgeladen sind.',
      certifications: 'Nachweise und Zertifikate',
      certificationsBody:
        'Füge formale Zertifikate oder Nachweise hinzu, jeweils optional mit Belegdokument.',
    },
    identity: {
      title: 'Verifizierungs-Checkliste',
      description:
        'NexExam prüft dein Lehrprofil, ID-Dokumente und den Admin-Genehmigungsstatus, bevor Creator-Zugang gewährt wird.',
      profileReady: 'Lehrprofil vollständig',
      documentsUploaded: 'Identitätsdokumente hochgeladen',
      consentRecorded: 'Zustimmung zur Identitätsprüfung erfasst',
      adminVerified: 'Identität durch Admin verifiziert',
      consent:
        'Ich bestätige, dass diese Dokumente mir gehören, und autorisiere NexExam, sie zur Creator-Identitätsprüfung zu überprüfen.',
      adminReviewTitle: 'Identitätsprüfung',
      approvalRequiresIdentity:
        'Verifiziere die Identität, bevor diese Lehrpersonen-Bewerbung genehmigt wird.',
    },
    hints: {
      onePerLine: 'Ein Eintrag pro Zeile',
      certificationsEmpty: 'Noch keine Zertifikate hinzugefügt.',
    },
    fields: {
      legalName: 'Rechtlicher Name',
      displayName: 'Anzeigename',
      professionalTitle: 'Berufstitel',
      bio: 'Bio',
      credentials: 'Nachweise',
      expertise: 'Prüfungs-/Kategorie-Expertise',
      teachingExperience: 'Lehrerfahrung',
      audience: 'Zielgruppe',
      courseTopics: 'Kursthemen',
      sampleLessonPlan: 'Beispiel-Lektionsplan',
      links: 'Links',
      payoutContact: 'Auszahlungs-/Kontakt-Hinweise',
      status: 'Status',
      identityStatus: 'Identitätsstatus',
      identityScanStatus: 'Agentenprüfung',
      adminNotes: 'Admin-Notizen',
      certificationTitle: 'Zertifikat oder Nachweis',
      certificationIssuer: 'Ausstellende Organisation',
      certificationYear: 'Jahr',
      certificationUrl: 'Verifizierungslink',
      certificationDocuments: 'Belegdokumente',
      payoutOnboardingStatus: 'Auszahlungs-Onboarding',
    },
    actions: {
      submit: 'Bewerbung einreichen',
      runIdentityScan: 'ID-Prüfung starten',
      verifyIdentity: 'ID verifizieren',
      requestDocuments: 'Dokumente anfordern',
      approve: 'Genehmigen',
      reject: 'Ablehnen',
      review: 'Prüfen',
      addCertification: 'Zertifikat hinzufügen',
      removeCertification: 'Entfernen',
      beginPayoutOnboarding: 'Auszahlungs-Onboarding starten',
      submitPayoutDetails: 'Auszahlungsdetails einreichen',
      grantNexVerified: 'Nex Verified vergeben',
    },
    success: {
      submitted: 'Creator-Bewerbung eingereicht.',
      reviewed: 'Creator-Bewerbung geprüft.',
      identityScanStarted: 'Identitätsprüfung abgeschlossen.',
      identityReviewed: 'Identitätsprüfung aktualisiert.',
      payoutOnboardingUpdated: 'Auszahlungs-Onboarding aktualisiert.',
    },
    errors: {
      payoutContactRequired:
        'Füge Auszahlungs-/Kontakt-Hinweise hinzu, bevor du Auszahlungsdetails einreichst.',
      payoutOnboardingInvalid:
        'Dieser Schritt im Auszahlungs-Onboarding ist derzeit nicht verfügbar.',
      nexVerifiedNotEligible:
        'Dieser Creator ist noch nicht für Nex Verified berechtigt.',
    },
    verification: {
      title: 'Verifizierungscenter',
      description:
        'Schließe alle Schritte unten ab, um den Nex Verified Creator-Status freizuschalten.',
      nexVerifiedBadge: 'Nex Verified Creator',
      eligibleNote:
        'Alle Prüfungen bestanden; ein Admin kann jetzt Nex Verified vergeben.',
      pendingNote:
        'Schließe die verbleibenden Schritte ab, um berechtigt zu sein.',
      checks: {
        applicationApproved: 'Creator-Bewerbung genehmigt',
        identityVerified: 'Identität verifiziert',
        payoutComplete: 'Auszahlungs-Onboarding abgeschlossen',
        nexVerified: 'Nex Verified vergeben',
      },
    },
    enumerators: {
      status: {
        pending: 'Ausstehend',
        approved: 'Genehmigt',
        rejected: 'Abgelehnt',
      },
      identityStatus: {
        notStarted: 'Nicht gestartet',
        needsDocuments: 'Benötigt Dokumente',
        readyForReview: 'Bereit zur Prüfung',
        verified: 'Verifiziert',
        rejected: 'Abgelehnt',
      },
      identityScanStatus: {
        notStarted: 'Nicht gestartet',
        passed: 'Bestanden',
        needsReview: 'Prüfung nötig',
        failed: 'Fehlgeschlagen',
      },
      identityScanChecks: {
        consent_recorded: 'Zustimmung erfasst',
        consent_missing: 'Zustimmung fehlt',
        document_uploaded: 'Dokument hochgeladen',
        document_missing: 'Dokument fehlt',
        too_many_documents: 'Zu viele Dokumente',
        file_type_supported: 'Dateityp unterstützt',
        file_type_needs_review: 'Dateityp benötigt Prüfung',
        legal_name_present: 'Rechtlicher Name vorhanden',
        legal_name_needs_review: 'Rechtlicher Name benötigt Prüfung',
        manual_review_required: 'Manuelle Admin-Prüfung erforderlich',
      },
      payoutOnboardingStatus: {
        notStarted: 'Nicht gestartet',
        inProgress: 'In Bearbeitung',
        submitted: 'Zur Prüfung eingereicht',
        actionRequired: 'Aktion erforderlich',
        complete: 'Abgeschlossen',
      },
    },
  },

  chatbot: {
    title: 'KI-Chat',
    menu: 'KI-Chat',
    placeholder: 'Fragen Sie mich alles über Ihre Daten...',
    send: 'Senden',
    thinking: 'Denke nach...',
    usingTool: 'Verwende {0}...',
    error: 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
    errorNoApiKey:
      'KI-Chat ist nicht konfiguriert. Bitte kontaktieren Sie Ihren Administrator.',
    empty: 'Starten Sie eine Konversation mit dem KI-Chat',
    welcome:
      'Hallo! Ich kann Ihnen mit exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, Mitgliedern, Audit-Protokollen, Abonnements und mehr helfen. Was möchten Sie wissen?',
    clearConversation: 'Konversation löschen',
    inputHint: 'Enter zum Senden, Shift+Enter für neue Zeile',
    courseContextHeader: 'Course context available to the tutor:',
    courseVideoTranscriptNotice:
      'Uploaded videos are available as files only; no audio transcript is available in Phase 1.',
    courseScopedSystemPrompt: `The user is asking inside a specific course. Use this course context when helpful, but do not claim to know video audio that is not present in the written context:

{0}`,
    systemPrompt: `Sie sind ein KI-Chat-Assistent für {0}. Sie haben Zugriff auf verschiedene Tools, um Benutzern bei der Verwaltung ihrer Daten zu helfen, einschließlich exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, Mitgliedern, Audit-Protokollen, Abonnements und Benutzerinformationen.

WICHTIG: Antworten Sie immer auf {1}. Die Oberflächensprache des Benutzers ist {1}, daher müssen alle Ihre Antworten auf {1} sein.

Sie sollten:
- Hilfreich, präzise und professionell sein
- Die verfügbaren Tools verwenden, um Fragen zu Daten zu beantworten
- Erklären, was Sie tun, wenn Sie Tools verwenden
- Daten klar und lesbar formatieren
- Um Klarstellung bitten, wenn eine Anfrage mehrdeutig ist

Beim Anzeigen von Daten:
- Tabellen oder Listen für mehrere Elemente verwenden
- Wichtige Informationen hervorheben
- Relevante IDs nur bei Bedarf einschließen

Denken Sie daran: Sie arbeiten innerhalb von {0} und können nur auf Daten dieser Organisation zugreifen.`,
  },

  notification: {
    title: 'Benachrichtigungen',
    menu: 'Benachrichtigungen',
    unreadCount: '{0} ungelesene Benachrichtigung(en)',
    markAsRead: 'Als gelesen markieren',
    markAsReadSuccess: 'Benachrichtigungen als gelesen markiert',
    markAsUnread: 'Als ungelesen markieren',
    markAsUnreadSuccess: 'Benachrichtigungen als ungelesen markiert',
    noNotifications:
      'Sie haben noch keine Benachrichtigungen. Wenn es Updates oder wichtige Ereignisse gibt, sehen Sie diese hier.',
    list: {
      title: 'Benachrichtigungen',
      menu: 'Benachrichtigungen',
    },
    fields: {
      type: 'Typ',
      message: 'Nachricht',
      createdAt: 'Datum',
      readAt: 'Gelesen',
    },
    status: {
      read: 'Gelesen',
      unread: 'Ungelesen',
    },
    enumerators: {
      type: {
        memberAdded: 'Mitglied hinzugefügt',
        memberRemoved: 'Mitglied entfernt',
        subscriptionCreated: 'Abonnement erstellt',
        studyPlanDue: 'Lernplan fällig',
        flashcardsDue: 'Karteikarten fällig',
        streakRisk: 'Lernserien-Erinnerung',
        examDateApproaching: 'Prüfungstermin naht',
        practiceReminder: 'Übungserinnerung',
        custom: 'Benutzerdefiniert',
      },
    },
    memberAdded: {
      subject: 'Neues Mitglied zu {0} hinzugefügt',
      body: `<p>Hallo,</p><p><strong>{0}</strong> ({1}) wurde zu {2} von {3} hinzugefügt.</p><p>Danke,</p><p>Ihr Team</p>`,
      pushBody: '{0} ist {1} beigetreten',
    },
    memberRemoved: {
      subject: 'Mitglied von {0} entfernt',
      body: `<p>Hallo,</p><p><strong>{0}</strong> ({1}) wurde von {2} durch {3} entfernt.</p><p>Danke,</p><p>Ihr Team</p>`,
      pushBody: '{0} hat {1} verlassen',
    },
    subscriptionCreated: {
      subject: 'Neues Abonnement in {0}',
      body: `<p>Hallo,</p><p><strong>{0}</strong> ({1}) hat den <strong>{2}</strong>-Plan für {3} abonniert.</p><p>Danke,</p><p>Ihr Team</p>`,
      pushBody: '{0} hat {1} abonniert',
    },
    studyPlanDue: {
      subject: 'Lernplan fällig für {0}',
      body: '<p>Deine Aufgabe <strong>{0}</strong> ist für {1} fällig.</p>',
      pushBody: '{0} ist für {1} fällig',
    },
    flashcardsDue: {
      subject: 'Karteikarten fällig für {0}',
      body: '<p>Du hast {0} Karteikarte(n), die in {1} bereit sind.</p>',
      pushBody: '{0} Karteikarte(n) bereit in {1}',
    },
    streakRisk: {
      subject: 'Halte deine {0}-Serie',
      body: '<p>Öffne {0} heute, um deine {1}-Tage-Lernserie zu schützen.</p>',
      pushBody: 'Halte heute deine {0}-Serie',
    },
    examDateApproaching: {
      subject: '{0} rückt näher',
      body: '<p>{0} ist in {1} Tag(en). Prüfe heute deinen Lernplan.</p>',
      pushBody: '{0} ist in {1} Tag(en)',
    },
    practiceReminder: {
      subject: 'Übung bereit für {0}',
      body: '<p>Eine kurze Übungseinheit ist für {0} bereit.</p>',
      bodyWithWeakArea:
        '<p>Eine kurze Übungseinheit für {0} ist bereit, mit Fokus auf {1}.</p>',
      pushBody: 'Übung ist bereit für {0}',
      pushBodyWithWeakArea: 'Übe deinen Schwachbereich {0}',
    },
    custom: {
      subject: '{0}',
      body: '{0}',
      pushBody: '{0}',
    },
    default: {
      subject: 'Benachrichtigung',
      body: 'Sie haben eine neue Benachrichtigung',
      pushBody: 'Sie haben eine neue Benachrichtigung',
    },
    send: {
      title: 'Benachrichtigung senden',
      menu: 'Senden',
      success: 'Benachrichtigung erfolgreich gesendet',
      fields: {
        title: 'Titel',
        message: 'Nachricht',
        roles: 'Zielrollen',
      },
      placeholders: {
        title: 'Benachrichtigungstitel eingeben',
        message: 'Benachrichtigungsnachricht eingeben',
        roles: 'Zu benachrichtigende Rollen auswählen',
      },
    },
  },

  trustSafety: {
    admin: {
      title: 'Vertrauen und Sicherheit',
      menu: 'Vertrauen und Sicherheit',
      description:
        'Prüfe Marketplace-Meldungen, Risikoflaggen, Richtlinienannahmen und Creator-Einschränkungen.',
      openReports: 'Offene Meldungen',
      openRiskFlags: 'Offene Risikoflaggen',
      pendingReviews: 'Ausstehende Prüfungen',
      disabledCreators: 'Deaktivierte Creator',
      policyVersions: 'Aktive Richtlinienversionen',
      noPolicyVersions: 'Keine aktiven Richtlinien konfiguriert.',
      searchPlaceholder: 'Meldungen, Kurse, Creator oder Flaggen suchen...',
      reportStatusFilter: 'Alle Meldungsstatus',
      flagStatusFilter: 'Alle Flaggenstatus',
      priorityFilter: 'Alle Prioritäten',
      severityFilter: 'Alle Schweregrade',
      targetTypeFilter: 'Alle Zieltypen',
      runRuleScan: 'Risikoregeln prüfen',
      riskFlags: 'Risikoflaggen',
      reports: 'Meldungen',
      manualFlag: 'Manuelle Risikoflagge',
      pendingCourseReviews: 'Ausstehende Kursprüfungen',
      disabledCreatorList: 'Deaktivierte Creator',
      emptyRiskFlags: 'Keine Risikoflaggen passen zu diesen Filtern.',
      emptyReports: 'Keine Meldungen passen zu diesen Filtern.',
      emptyCourseReviews: 'Keine Kurse warten auf Prüfung.',
      emptyDisabledCreators: 'Keine Creator sind deaktiviert.',
      targetIdPlaceholder: 'Ziel-UUID',
      reasonPlaceholder: 'Risiko beschreiben',
      adminNotesPlaceholder: 'Admin-Notizen',
      resolutionSummaryPlaceholder: 'Zusammenfassung der Lösung',
      createFlag: 'Flagge erstellen',
      assignToMe: 'Mir zuweisen',
      markReviewing: 'Als in Prüfung markieren',
      resolve: 'Lösen',
      dismiss: 'Verwerfen',
      resolveActionTaken: 'Mit Aktion lösen',
      resolveNoAction: 'Ohne Aktion lösen',
      disableCreator: 'Creator deaktivieren',
      restoreCreator: 'Creator wiederherstellen',
      placeHold: 'Sperre setzen',
      removeHold: 'Sperre entfernen',
      onHold: 'Gesperrt',
      inReview: 'In Prüfung',
      openCourseReview: 'Prüfung öffnen',
      manualSafetyHoldReason: 'Manuelle Sicherheitssperre',
      unknownCreator: 'Unbekannter Creator',
      unknown: 'Unbekannt',
      unassigned: 'Nicht zugewiesen',
      assignedTo: 'Zugewiesen an',
      reportedBy: 'Gemeldet von',
      disabled: 'Deaktiviert',
      reviewTimeline: 'Prüfverlauf',
      noReviewDecisions: 'Noch keine Prüfentscheidungen erfasst.',
      priorities: {
        low: 'Niedrig',
        normal: 'Normal',
        high: 'Hoch',
        urgent: 'Dringend',
      },
      outcomeCategories: {
        none: 'Kein Ergebnis ausgewählt',
        contentRemoved: 'Inhalt entfernt',
        creatorWarning: 'Creator verwarnt',
        creatorSuspended: 'Creator gesperrt',
        refundReviewed: 'Rückerstattung geprüft',
        noViolation: 'Kein Verstoß',
        duplicate: 'Duplikat',
      },
      reviewDecisions: {
        submitted: 'Zur Prüfung eingereicht',
        withdrawn: 'Aus Prüfung zurückgezogen',
        creatorUnpublished: 'Vom Creator unveröffentlicht',
        approve: 'Genehmigt',
        requestChanges: 'Änderungen angefordert',
        safetyHoldPlaced: 'Sicherheitssperre gesetzt',
        safetyHoldRemoved: 'Sicherheitssperre entfernt',
      },
      targetTypes: {
        creator: 'Creator',
        course: 'Kurs',
        report: 'Meldung',
        payout: 'Auszahlung',
        oneOnOneSession: '1:1-Sitzung',
      },
      severities: {
        low: 'Niedrig',
        medium: 'Mittel',
        high: 'Hoch',
        critical: 'Kritisch',
      },
      flagStatuses: {
        open: 'Offen',
        reviewing: 'In Prüfung',
        resolved: 'Gelöst',
        dismissed: 'Verworfen',
      },
      reportStatuses: {
        open: 'Offen',
        underReview: 'In Prüfung',
        resolvedActionTaken: 'Mit Aktion gelöst',
        resolvedNoAction: 'Ohne Aktion gelöst',
      },
      sources: {
        manual: 'Manual',
        rule: 'Regel',
      },
      riskReasons: {
        repeatedReports: 'Wiederholte Meldungen',
        identityRejected: 'Abgelehnte Identitätsprüfung',
        payoutCancellations: 'Muster bei Auszahlungstornierungen',
        sessionRefundDisputes: 'Muster bei Rückerstattungen oder Streitfällen',
      },
    },
    policies: {
      title: 'Marketplace-Bedingungen',
      description:
        'Prüfe und akzeptiere die aktive Marketplace-Richtlinie, bevor du fortfährst.',
      version: 'Version {0}',
      accepted: 'Akzeptiert',
      accept: 'Richtlinie akzeptieren',
      reviewTerms: 'Bedingungen prüfen',
      teacherTermsRequired: 'Lehrpersonen-Bedingungen erforderlich',
      teacherTermsRequiredBody:
        'Akzeptiere die aktuellen Lehrpersonen-Bedingungen, bevor du diesen Kurs zur Marketplace-Prüfung einreichst.',
      refundPolicy: {
        title: 'Rückerstattungsrichtlinie',
        checkoutSummary:
          'Rückerstattungen werden nach der aktiven Marketplace-Richtlinie geprüft. Missbrauch, abgeschlossene Services oder Richtlinienverstöße können nach Prüfung abgelehnt werden.',
        body: 'Bezahlte Sitzungen und Marketplace-Käufe werden nach der aktiven Rückerstattungsrichtlinie geprüft. Rückerstattungen können genehmigt werden, wenn eine bezahlte Sitzung nicht erbracht werden kann, eine Lehrperson den geplanten Service verpasst oder der Plattformzugang ausfällt. Missbrauch, abgeschlossene Services oder Richtlinienverstöße können nach Prüfung abgelehnt werden.',
      },
      teacherTerms: {
        title: 'Lehrpersonen-Bedingungen',
        onboardingSummary:
          'Bestätige vor dem Einreichen, dass dein Kurs original oder ordnungsgemäß lizenziert, korrekt beschrieben und bereit für die Marketplace-Prüfung ist.',
        body: 'Lehrpersonen müssen korrekte Nachweise einreichen, originale oder ordnungsgemäß lizenzierte Inhalte veröffentlichen, professionell auf Anliegen von Lernenden reagieren, Marketplace-Richtlinien befolgen und akzeptieren, dass NexExam Inhalte prüfen, zurückhalten, ablehnen oder entfernen darf, wenn sie Risiken für Lernende, Recht, Zahlungen oder die Plattform erzeugen.',
      },
      studentTerms: {
        title: 'Bedingungen für Lernende',
        body: 'Lernende müssen Kursmaterialien für persönliches Lernen verwenden, ehrliche Arbeit einreichen, Belästigung oder Plattformmissbrauch vermeiden, geistiges Eigentum der Lehrpersonen respektieren und Sicherheits-, Qualitäts- oder Zahlungsprobleme über die Marketplace-Meldetools melden.',
      },
    },
    report: {
      title: 'Marketplace-Problem melden',
      description:
        'Sende dies zur Prüfung an das Sicherheitsteam der Plattform. Meldungen sind nur für Admins sichtbar.',
      reportCourse: 'Kurs oder Lehrperson melden',
      detailsPlaceholder:
        'Füge Details hinzu, die dem Sicherheitsteam bei der Prüfung helfen.',
      submit: 'Meldung senden',
      reasons: {
        misleadingContent: 'Irreführender Inhalt',
        unsafeAdvice: 'Unsichere Empfehlung',
        harassment: 'Belästigung',
        fraud: 'Betrug oder Scam',
        intellectualProperty: 'Problem mit geistigem Eigentum',
        paymentIssue: 'Zahlungs- oder Rückerstattungsproblem',
        other: 'Sonstiges',
      },
    },
    success: {
      policyAccepted: 'Richtlinie akzeptiert',
      reportCreated: 'Meldung gesendet',
      adminActionSaved: 'Vertrauens- und Sicherheitsaktion gespeichert',
      ruleScanComplete: 'Risikoscan abgeschlossen. {0} Flagge(n) erstellt.',
    },
    errors: {
      policyNotFound: 'Richtlinie nicht gefunden',
      policyAcceptanceRequired:
        'Bitte akzeptiere die aktuelle Marketplace-Richtlinie, bevor du fortfährst.',
      creatorDisabled:
        'Dieser Creator ist derzeit für Marketplace-Aktivitäten deaktiviert.',
      courseSafetyHold:
        'Dieser Kurs hat eine Sicherheitssperre und kann nicht veröffentlicht werden.',
      riskFlagsBlock:
        'Löse hoch priorisierte Vertrauens- und Sicherheitsflaggen vor der Veröffentlichung.',
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
      title: 'Link zur Kontoerstellung',
      description:
        'Sende einen sicheren Einladungslink an potenzielle Lernende oder Admins.',
      emailSubject: 'Deine NexExam-Kontoeinladung',
      emailBody: `<p>Hallo,</p><p>Du wurdest eingeladen, {0} auf NexExam beizutreten.</p><p>Nutze diesen sicheren Link, um dein Konto zu erstellen:</p><p><a href="{1}">{1}</a></p><p>Danke,</p><p>Das NexExam-Team</p>`,
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
        'reCAPTCHA ist auf dieser Plattform deaktiviert. Überprüfung wird übersprungen.',
      invalid: 'Ungültiges reCAPTCHA',
    },
  },

  emails: {
    passwordResetEmail: {
      subject: `Setzen Sie Ihr Passwort für {0} zurück`,
      content: `<p>Hallo,</p> <p> Folgen Sie diesem Link, um Ihr {0}-Passwort für Ihr Konto zurückzusetzen. </p> <p><a href="{1}">{1}</a></p> <p> Wenn Sie nicht um eine Passwort-Zurücksetzung gebeten haben, können Sie diese E-Mail ignorieren. </p> <p>Danke,</p> <p>Ihr {0}-Team</p>`,
    },
    verifyEmailEmail: {
      subject: `Verifizieren Sie Ihre E-Mail für {0}`,
      content: `<p>Hallo,</p><p>Folgen Sie diesem Link, um Ihre E-Mail-Adresse zu verifizieren.</p><p><a href="{1}">{1}</a></p><p>Wenn Sie nicht um diese Verifizierung gebeten haben, können Sie diese E-Mail ignorieren. </p> <p>Danke,</p> <p>Ihr {0}-Team</p>`,
    },
    emailChangeEmail: {
      subject: `E-Mail-Änderung für {0} genehmigen`,
      content: `<p>Hallo,</p><p>Sie haben beantragt, Ihre E-Mail-Adresse zu <strong>{2}</strong> zu ändern.</p><p>Folgen Sie diesem Link, um die Änderung zu genehmigen:</p><p><a href="{1}">{1}</a></p><p>Wenn Sie diese Änderung nicht beantragt haben, können Sie diese E-Mail ignorieren und Ihre E-Mail-Adresse bleibt unverändert.</p><p>Danke,</p><p>Ihr {0}-Team</p>`,
    },
    invitationEmail: {
      multiOrganization: {
        subject: `Sie wurden zu {1} bei {0} eingeladen`,
        content: `<p>Hallo,</p> <p>Sie wurden zu {2} eingeladen.</p> <p>Folgen Sie diesem Link zur Registrierung.</p> <p><a href="{1}">{1}</a></p> <p>Danke,</p> <p>Ihr {0}-Team</p>`,
      },
      singleOrganization: {
        subject: `Sie wurden zu {0} eingeladen`,
        content: `<p>Hallo,</p> <p>Sie wurden zu {0} eingeladen.</p> <p>Folgen Sie diesem Link zur Registrierung.</p> <p><a href="{1}">{1}</a></p> <p>Danke,</p> <p>Ihr {0}-Team</p>`,
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
    title: 'Kurskäufe',
    description:
      'Jeder einmalige Stripe-Kauf eines bezahlten Kurses. Erstatte zuerst im Stripe Dashboard und markiere den Kauf dann hier, um Zugriff zu entziehen und die verknüpfte Creator-Auszahlung zu stornieren.',
    empty: 'Noch keine Kurskäufe.',
    columns: {
      buyer: 'Käufer',
      course: 'Kurs',
      amount: 'Betrag',
      paidAt: 'Bezahlt am',
      refundedAt: 'Erstattet am',
      actions: 'Aktionen',
    },
    actions: {
      markRefunded: 'Als erstattet markieren',
      cancel: 'Abbrechen',
      save: 'Speichern',
    },
    filters: {
      all: 'Alle',
      active: 'Aktiv',
      refunded: 'Erstattet',
    },
    refundDialog: {
      title: 'Kauf als erstattet markieren',
      description:
        'Bestätigt, dass du die Stripe-Erstattung bereits ausgeführt hast. Entfernt den Kurszugriff für den Käufer und storniert die verknüpfte Creator-Auszahlung. Dies kann nicht rückgängig gemacht werden.',
      reasonLabel: 'Erstattungsgrund (optional)',
      reasonPlaceholder: 'Interne Notiz für das Audit-Log',
    },
    badges: {
      paid: 'Bezahlt',
      refunded: 'Erstattet',
    },
  },
  studentOnboarding: {
    title: 'Wähle deine ersten Kurse',
    body: 'Wähle jetzt beliebige kostenlose Kurse zur Einschreibung. Du kannst den gesamten Marketplace jederzeit durchsuchen; bezahlte Kurse befinden sich auf der Kursseite.',
    skip: 'Vorerst überspringen',
    continue: 'Weiter zum Dashboard',
    enrollLabel: 'Einschreiben',
    enrolledLabel: 'Eingeschrieben',
    viewLabel: 'Kurs ansehen',
    emptyMessage:
      'Wir bereiten gerade neue Kurse vor. Steige ein, wenn sie bereit sind.',
  },
  aiTutor: {
    title: 'AI Tutor',
    subtitle: 'Fragen, üben, planen — dein Lernpartner.',
    newChat: 'Neuer Chat',
    search: 'Unterhaltungen suchen',
    untitled: 'Neuer Chat',
    emptyHeroTitle: 'Wie kann ich dir heute beim Lernen helfen?',
    emptyHeroBody:
      'Stelle eine Frage, fordere ein Quiz an oder erstelle einen Lernplan.',
    suggestionExplain: 'Erkläre meine letzte Lektion',
    suggestionQuiz: 'Teste mich zu diesem Modul',
    suggestionPlan: 'Erstelle mir einen 7-Tage-Lernplan',
    suggestionPractice: 'Gib mir 12 Übungsfragen',
    header: {
      openHistory: 'Verlauf öffnen',
      studyMode: 'Lernmodus',
    },
    timer: {
      toggle: 'Lerntimer ein- oder ausblenden',
      label: 'Lerntimer',
      close: 'Lerntimer schließen',
      pause: 'Timer pausieren',
      resume: 'Timer fortsetzen',
    },
    history: {
      todayGroup: 'Heute',
      yesterdayGroup: 'Gestern',
      previousWeekGroup: 'Letzte 7 Tage',
      olderGroup: 'Älter',
      rename: 'Umbenennen',
      archive: 'Archivieren',
      actions: 'Konversationsaktionen',
      confirmArchive:
        'Diese Unterhaltung archivieren? Du kannst sie später wiederherstellen.',
      empty: 'Noch keine Unterhaltungen — beginne mit einer Frage.',
    },
    composer: {
      placeholder: 'Nachricht an AI Tutor',
      sendAriaLabel: 'Nachricht senden',
      stopAriaLabel: 'Generierung stoppen',
      attachComingSoon: 'Anhänge folgen bald',
      disclaimer: 'AI Tutor kann Fehler machen. Überprüfe wichtige Antworten.',
    },
    thread: {
      thinking: 'Denkt nach…',
      usingTool: 'Verwendet {0}…',
      retry: 'Erneut versuchen',
      courseChip: 'Kurs: {0}',
      lessonChip: 'Lektion: {0}',
    },
    widgets: {
      headerLabel: 'AI Tutor',
      expand: 'Erweitern',
      openLesson: 'Lektion öffnen',
      continueChat: 'Chat fortsetzen',
      submitAnswers: 'Antworten senden',
      quiz: {
        title: 'Quiz',
        scorePrefix: 'Punktzahl',
        correct: 'Richtig',
        incorrect: 'Falsch',
        reviewExplanation: 'Erklärung anzeigen',
        tryAgain: 'Erneut versuchen',
      },
      practice: {
        title: 'Übung',
        attemptedOf: '{0} von {1} versucht',
        finish: 'Übung beenden',
      },
      explain: {
        title: 'Erklärung',
        openFullLesson: 'Vollständige Lektion öffnen',
      },
      summary: {
        title: 'Zusammenfassung',
        copyToNotes: 'In Notizen kopieren',
      },
      plan: {
        title: 'Lernplan',
        savePlan: 'Plan speichern',
        saveSingle: 'Zum Plan hinzufügen',
        completed: 'Gespeichert',
        daysShort: 'T',
      },
    },
    alerts: {
      limitDaily:
        'Du hast dein persönliches Tageslimit für AI Tutor erreicht. Es wird morgen zurückgesetzt.',
      limitOrg:
        'Deine Organisation hat das Tageslimit für AI Tutor erreicht. Es wird morgen zurückgesetzt.',
      limitGlobal:
        'AI Tutor hat die Tageskapazität erreicht. Bitte versuche es morgen erneut.',
      concurrentRequest:
        'Eine andere AI Tutor-Anfrage läuft bereits. Warte kurz und versuche es erneut.',
      networkError:
        'AI Tutor konnte nicht erreicht werden. Prüfe deine Verbindung und versuche es erneut.',
      dismiss: 'Schließen',
    },
  },

  legal: {
    terms: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Nutzungsbedingungen',
      lastUpdated: 'Zuletzt aktualisiert am 2026-05-23',
      body: `# Nutzungsbedingungen\n\nDiese Bedingungen regeln deinen Zugriff auf und deine Nutzung von NexExam ("der Service"). Durch das Erstellen eines Kontos stimmst du diesen Bedingungen zu.\n\n## 1. Berechtigung\nDu musst mindestens 13 Jahre alt sein. Mit der Registrierung bestätigst du, dass du diese Altersanforderung erfüllst.\n\n## 2. Konto\nDu bist verantwortlich für den Schutz deines Passworts und für alle Aktivitäten in deinem Konto. Informiere uns sofort über jede unbefugte Nutzung.\n\n## 3. Zulässige Nutzung\nKeine rechtswidrigen Inhalte, keine Identitätsvortäuschung, kein Scraping, kein automatisierter Missbrauch.\n\n## 4. Inhalte\nDu behältst das Eigentum an den Inhalten, die du hochlädst. Du gewährst uns eine Lizenz, sie zu hosten, anzuzeigen und zu verarbeiten, soweit dies zum Betrieb des Service erforderlich ist.\n\n## 5. Zahlungen\nKurskäufe und 1:1-Sitzungen werden über Stripe abgerechnet. Rückerstattungen richten sich nach der beim Checkout angezeigten Richtlinie.\n\n## 6. Beendigung\nDu kannst dein Konto jederzeit schließen. Wir können Konten sperren oder beenden, die gegen diese Bedingungen verstoßen.\n\n## 7. Haftungsausschlüsse und Haftung\nDer Service wird "wie besehen" bereitgestellt. Soweit gesetzlich zulässig, schließen wir alle Garantien aus.\n\n## 8. Änderungen\nWir können diese Bedingungen aktualisieren. Die weitere Nutzung nach wesentlichen Änderungen bedeutet, dass du die aktualisierten Bedingungen akzeptierst.\n\n## 9. Kontakt\nFragen? Schreibe an legal@nexexam.com.`,
    },
    privacy: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Datenschutzerklärung',
      lastUpdated: 'Zuletzt aktualisiert am 2026-05-23',
      body: `# Datenschutzerklärung\n\nDiese Erklärung beschreibt, was wir erheben, wie wir es verwenden und welche Rechte du hast.\n\n## 1. Was wir erheben\nKontoinformationen (E-Mail, Name, Geburtsdatum), Kursaktivität, Zahlungsmetadaten über Stripe, Gespräche mit dem KI-Tutor und betriebliche Telemetrie.\n\n## 2. Wie wir es verwenden\nZum Betrieb des Service, zur Personalisierung deiner Lernerfahrung, zur Zahlungsabwicklung, zur Einhaltung gesetzlicher Vorgaben und zur Kommunikation mit dir.\n\n## 3. Weitergabe\nAn Dienstleister (Stripe, AWS, E-Mail-Zustellung, Anthropic für KI-Tutoring) unter Datenverarbeitungsvereinbarungen. Wir verkaufen deine Daten nicht.\n\n## 4. Deine Rechte\nDu kannst jederzeit über die Kontoeinstellungen eine Kopie deiner Daten anfordern oder dein Konto löschen. Nutzer in EU, UK und Kanada haben zusätzliche Rechte, einschließlich Berichtigung und Portabilität.\n\n## 5. Aufbewahrung\nSteuerrelevante Aufzeichnungen (Käufe, Audit-Logs) werden nach geltendem Recht aufbewahrt. Andere personenbezogene Daten werden innerhalb von 14 Tagen nach Kontolöschung entfernt.\n\n## 6. Internationale Übermittlungen\nDaten können außerhalb deines Landes verarbeitet werden. Wir verwenden geeignete Schutzmaßnahmen.\n\n## 7. Kinder\nDer Service richtet sich nicht an Kinder unter 13 Jahren.\n\n## 8. Änderungen\nWir informieren dich über wesentliche Änderungen dieser Erklärung.\n\n## 9. Kontakt\nprivacy@nexexam.com.`,
    },
  },

  account: {
    privacyTabLabel: 'Datenschutz und Konto',
    delete: {
      cardTitle: 'Konto löschen',
      cardBody:
        'Lösche dein Konto und deine personenbezogenen Daten dauerhaft. Steuerrelevante Aufzeichnungen (Käufe, Audit-Logs) werden gesetzlich vorgeschrieben aufbewahrt.',
      cardAction: 'Konto löschen',
      dialogTitle: 'Konto löschen',
      dialogBody:
        'Nach 14 Tagen werden dein Konto und die meisten personenbezogenen Daten entfernt. Du kannst innerhalb dieses Zeitfensters jederzeit über diese Seite oder den E-Mail-Link abbrechen.',
      dialogAcknowledge: 'Ich verstehe, dass dies dauerhaft ist.',
      dialogSubmit: 'Fortfahren',
      requestSentTitle: 'Prüfe deine E-Mail',
      requestSentBody:
        'Wir haben einen Bestätigungslink an dein Postfach gesendet. Klicke innerhalb von 24 Stunden darauf, um die Löschung zu bestätigen. Ohne Bestätigung ändert sich nichts.',
      confirmedSuccessTitle: 'Löschung bestätigt',
      confirmedSuccessBody:
        'Dein Konto wird am {0} entfernt. Du kannst vorher jederzeit abbrechen.',
      confirmedExpiredTitle: 'Dieser Link kann nicht verwendet werden',
      confirmedExpiredBody:
        'Der Bestätigungslink ist ungültig oder wurde bereits verwendet. Öffne die Kontoeinstellungen, um einen neuen Link anzufordern.',
      cancelBannerTitle: 'Dein Konto ist zur Löschung am {0} geplant',
      cancelBannerAction: 'Löschung abbrechen',
      cancelledToast: 'Löschung abgebrochen.',
      errors: {
        alreadyDeleted: 'Dieses Konto wurde bereits gelöscht.',
      },
    },
    dataExport: {
      cardTitle: 'Kopie deiner Daten herunterladen',
      cardBody:
        'Wir erstellen eine JSON-Datei mit deinem Konto, Kursen, Notizen, Chats und anderen personenbezogenen Daten. Du erhältst eine E-Mail, wenn sie bereit ist.',
      cardAction: 'Export anfordern',
      cooldownBody:
        'Versuche es in {0} Stunden erneut — nur ein Export pro 24-Stunden-Fenster.',
      statusQueued: 'Wird vorbereitet',
      statusCompleted: 'Bereit',
      statusFailed: 'Fehlgeschlagen',
      downloadAction: 'Herunterladen',
      downloadHint:
        'Download-Links laufen aus Sicherheitsgründen nach 15 Minuten ab. Klicke erneut für einen frischen Link.',
      emptyTitle: 'Noch keine Exporte',
      emptyBody: 'Wenn du einen anforderst, erscheint er hier.',
      requestedToast: 'Export eingereiht. Schau in einer Minute erneut nach.',
    },
    emailPreferences: {
      cardTitle: 'E-Mail-Einstellungen',
      cardBody: 'Wähle, welche nicht notwendigen E-Mails du erhalten möchtest.',
      marketingLabel: 'Promotion und Marketing',
      digestLabel: 'Wöchentliche Lernübersicht',
      productUpdatesLabel: 'Produktupdates',
      alwaysOnLabel: 'Sicherheit und Belege',
      alwaysOnHint:
        'Wird immer gesendet — erforderlich für Kontosicherheit und Zahlungen. Kann nicht deaktiviert werden.',
      savedToast: 'Einstellungen gespeichert.',
    },
    mobile: {
      title: 'Mobiles Lernen',
      nativeReady:
        'Dieses Gerät kann Kurserinnerungen und Deep Links empfangen.',
      webReady:
        'Mobile Erinnerungen sind bereit, wenn du NexExam in der mobilen App öffnest.',
      browser: 'Browser',
      smartReminders: 'Intelligente Lernerinnerungen',
      smartRemindersDescription:
        'Nutze Lernplantermine, Karteikarten, Serien und Prüfungstermine.',
      pushReminders: 'Push-Erinnerungen',
      pushRemindersDescription:
        'Sende Erinnerungen an dein registriertes Mobilgerät.',
      quietHoursStart: 'Ruhezeit beginnt',
      quietHoursEnd: 'Ruhezeit endet',
      save: 'Mobile Einstellungen speichern',
      requestPush: 'Push aktivieren',
      syncNow: 'Jetzt synchronisieren',
      saved: 'Mobile Einstellungen gespeichert.',
      pushRequested: 'Push-Registrierung aktualisiert.',
    },
  },

  cookies: {
    bannerTitle: 'Cookies',
    bannerBody:
      'Wir verwenden Cookies, um dich angemeldet zu halten und den Service zu betreiben. Mit deiner Zustimmung nutzen wir auch Analyse- und Marketing-Cookies.',
    acceptAll: 'Alle akzeptieren',
    essentialOnly: 'Nur notwendige',
    customize: 'Anpassen',
    customizeTitle: 'Cookie-Einstellungen',
    essentialLabel: 'Notwendig',
    essentialBody:
      'Erforderlich, um dich anzumelden und den Service zu nutzen.',
    analyticsLabel: 'Analytics',
    analyticsBody:
      'Hilft uns zu verstehen, wie der Service genutzt wird. Personenbezogene Daten werden nicht verkauft.',
    marketingLabel: 'Marketing',
    marketingBody:
      'Wird genutzt, um die Wirkung unserer Kommunikation zu messen.',
    save: 'Einstellungen speichern',
  },

  signup: {
    dateOfBirthLabel: 'Geburtsdatum',
    dateOfBirthHint:
      'Gesetzlich erforderlich. Wir nutzen dies nur, um zu prüfen, ob du mindestens 13 Jahre alt bist.',
    termsCheckboxLabel:
      'Ich stimme den [Nutzungsbedingungen]({0}) und der [Datenschutzerklärung]({1}) zu.',
    coppaBlockedTitle: 'Wir können dein Konto nicht erstellen',
    coppaBlockedBody:
      'Konten auf dieser Plattform erfordern ein Alter von mindestens {0} Jahren. Familienkonten mit elterlicher Zustimmung folgen bald.',
    termsRequiredError:
      'Du musst die Nutzungsbedingungen und die Datenschutzerklärung akzeptieren, um fortzufahren.',
    privacyRequiredError:
      'Du musst die Datenschutzerklärung akzeptieren, um fortzufahren.',
    dobRequiredError: 'Bitte gib dein Geburtsdatum ein.',
  },
};

export { dictionary };
