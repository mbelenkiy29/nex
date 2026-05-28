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
    backHome: 'Zur Startseite',
    sidebar: 'Seitenleiste',
    sidebarDescription: 'Zeigt die mobile Seitenleiste an.',
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
        'Dein Creator-Profil ist genehmigt. Du kannst Kurse erstellen und zur NexExam-Prüfung einreichen.',
      applicationRejected:
        'Deine Bewerbung benötigt Änderungen vor der Genehmigung. Prüfe die Admin-Notizen und reiche dein Profil erneut ein.',
      startApplication: 'Bewerbung starten',
      editApplication: 'Bewerbung aktualisieren',
      workspaceTitle: 'Kursarbeitsbereich',
      workspaceBody:
        'Nutze den Kurs-Builder, um Lehrplan, Lektionen, Quizze, Übungsprüfungen und Ergebnisse vor der Einreichung zu organisieren.',
      reviewTitle: 'Veröffentlichungsprüfung',
      reviewBody:
        'NexExam-Admins genehmigen eingereichte Kurse, verwalten die Katalogveröffentlichung und prüfen Einschreibungen, Auszahlungen und Umsatzaufteilung.',
      deferredTitle: 'Umsatzeinstellungen',
      deferredBody:
        'Umsatzbeteiligung und Auszahlungsdetails werden pro Kurs über Admin-Werkzeuge konfiguriert.',
      metricsTitle: 'Creator-Metriken',
      metricsBody:
        'Verfolge Einschreibungen, Abschlüsse, Bewertungen und Umsatzaktivität über deine Kurse hinweg.',
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
      masteryMap: 'Kompetenzkarte',
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
    nextUnlock: {
      badge: 'Nächste Freischaltung',
      activeBadge: 'Premium aktiv',
      title: 'Schalte deinen KI-Lernkreislauf frei',
      activeTitle: 'Dein Premium-Lernkreislauf ist bereit',
      body: 'Premium verbindet Kurse, Übungen, Notizen und KI-Tutor zu einem geführten Pfad.',
      activeBody:
        'Nutze die freigeschalteten KI-Tools, um Fortschritt in messbare Prüfungsbereitschaft zu verwandeln.',
      aiPlanTitle: 'KI-Lernplan',
      aiPlanBody:
        'Verwandle Schwächen und Fristen in fokussierte Tagesaufgaben.',
      practiceTitle: 'Premium-Übung',
      practiceBody:
        'Schalte gezieltere Fragen und prüfungsnahe Wiederholung frei.',
      certificateTitle: 'Zertifikatspfad',
      certificateBody:
        'Verfolge die Arbeit, die dich zum verifizierten Abschluss bringt.',
      subscriptionCta: 'Premium-Pläne ansehen',
      coursesCta: 'Kurse durchsuchen',
      aiTutorCta: 'KI-Tutor öffnen',
    },
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
    masteryMap: {
      badge: 'Kompetenzkarte',
      title: 'Schuetze deinen Fortschritt',
      body: 'Verfolge Bereitschaft, Schwachstellen, Freischaltungen, Serien und Zertifikate, die zeigen, dass Lernen sich aufbaut.',
      emptyBody:
        'Schreibe dich in einen Kurs ein, um Bereitschaftstrend, Kompetenzkarte, Freischaltungen, Serie und Zertifikatspfad aufzubauen.',
      browseCourses: 'Kurse durchsuchen',
      readinessScore: 'Bereitschaftsscore',
      points: 'Punkte',
      openCta: 'Kompetenzkarte oeffnen',
      nextMilestone: 'Naechster Bereitschaftsmeilenstein',
      milestoneTarget: '{0} Bereitschaftspunkte',
      milestoneProgress: '{0}% dieses Meilensteins geschuetzt',
      unlockedModulesValue: '{0} / {1}',
      certificatesValue: '{0} / {1}',
      streakValue: '{0} Tag(e)',
      milestonesTitle: 'Meilensteine fuer Pruefungsbereitschaft',
      milestonesBody:
        'Jeder Meilenstein macht Fortschritt vor dem finalen Zertifikat sichtbar.',
      milestoneLabels: {
        baseline: 'Basis kartiert',
        momentum: 'Schwung aufgebaut',
        ready: 'Pruefungsbereit',
        examReady: 'Finale Bereitschaft',
        mastered: 'Kompetenz geschuetzt',
      },
      metrics: {
        weakSkills: 'Schwache Kompetenzen',
        weakSkillsHelper: 'Kompetenzen, die Bereitschaft bremsen koennen.',
        unlockedModules: 'Freigeschaltete Module',
        unlockedModulesHelper:
          'Kursbereiche, die durch Fortschritt offen sind.',
        certificates: 'Zertifikate',
        certificatesHelper: 'Nachweispfade verdient oder in Arbeit.',
        streak: 'Lernserie',
        streakHelper: 'Beste Serie: {0} Tag(e)',
      },
      trend: {
        title: 'Bereitschaftstrend',
        body: 'Taegliche Snapshots zeigen, ob Lernen Fortschritt schuetzt oder beschleunigt.',
        chartLabel: 'Bereitschaftstrend-Diagramm',
        delta: '+{0}',
        direction: {
          up: 'Steigt',
          down: 'Braucht Aufmerksamkeit',
          flat: 'Bleibt stabil',
          none: 'Neuer Trend',
        },
      },
      premium: {
        title: 'Die volle Fortschrittswirtschaft wird mit Premium frei',
        body: 'Premium verbindet kursuebergreifende Karte, KI-Naechstschritte und tiefere Uebung mit deinem aufgebauten Fortschritt.',
        cta: 'Premium-Plaene ansehen',
      },
      weakSkills: {
        title: 'Schwache Kompetenzen schuetzen',
        body: 'Fokussiere Kompetenzen, die Bereitschaft bremsen koennen, bevor neues Material dazukommt.',
        empty:
          'Noch keine schwachen Kompetenzen erkannt. Schliesse Uebungen oder Diagnosen ab.',
        practiceCta: 'Ueben',
      },
      modules: {
        title: 'Freigeschaltete Module',
        body: 'Sieh, welche Abschnitte offen, aktuell, abgeschlossen oder von vorherigem Fortschritt abhaengig sind.',
        empty: 'Noch keine Module verfuegbar.',
        lessons: '{0} von {1} Lektionen',
        status: {
          complete: 'Abgeschlossen',
          current: 'Aktuell',
          unlocked: 'Freigeschaltet',
          locked: 'Gesperrt',
        },
      },
      streaks: {
        title: 'Serien, die Fortschritt schuetzen',
        body: 'Serien zeigen, wo aktuelle Aktivitaet den Schwung erhaelt.',
        dayCount: '{0} Tag(e)',
        lastActivity: 'Letzte Aktivitaet {0}',
        noActivity: 'Noch keine Aktivitaet',
      },
      certificates: {
        title: 'Zertifikatspfade',
        body: 'Zertifikate machen abgeschlossenes Lernen zu einem bleibenden Nachweis.',
        lessons: '{0} von {1} Lektionen',
        view: 'Ansehen',
        status: {
          earned: 'Verdient',
          inProgress: 'In Arbeit',
          locked: 'Gesperrt',
          unavailable: 'Nicht verfuegbar',
          revoked: 'Widerrufen',
        },
      },
      preview: {
        badge: 'Fortschrittswirtschaft',
        title: 'Kompetenzkarte',
        body: 'Zeige den Fortschritt, den Nutzer schuetzen wollen, bevor sie fuer mehr Beschleunigung zahlen.',
        readiness: 'Bereitschaft',
        streak: 'Serie',
        weakestSkill: 'Schwaechste Kompetenz',
        noWeakSkill: 'Noch keine Schwachstelle',
        nextMilestone: 'Naechster Meilenstein',
        noMilestone: 'Noch kein Meilenstein',
        cta: 'Karte oeffnen',
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

    disable: {
      success: 'Benutzer erfolgreich deaktiviert',
      confirmTitle: 'Benutzer deaktivieren?',
      label: 'Deaktivieren',
    },

    restore: {
      success: 'Benutzer erfolgreich wiederhergestellt',
      confirmTitle: 'Benutzer wiederherstellen?',
      label: 'Wiederherstellen',
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
    activation: {
      title: 'Premium freigeschaltet',
      unlockingTitle: 'Dein Premium-Plan wird freigeschaltet',
      unlockingBody:
        'Die Zahlung ist abgeschlossen. NexExam öffnet jetzt deine Premium-Tools.',
      retryUnlock: 'Erneut prüfen',
      unlockedPlan: 'Dein freigeschalteter Plan',
      titleWithPlan: '{0} ist aktiv',
      body: 'Premium-Lernwerkzeuge sind jetzt in deinem Lernbereich verfügbar.',
      exploreCourses: 'Kurse entdecken',
      aiCoachTitle: 'KI-Coach',
      aiCoachBody:
        'Erstelle Lernpläne und erhalte geführte Hilfe, wenn du feststeckst.',
      readinessTitle: 'Bereitschaftseinblicke',
      readinessBody:
        'Verfolge Fortschritt, Schwächen und nächste Schritte an einem Ort.',
      practiceTitle: 'Tieferes Üben',
      practiceBody:
        'Nutze Premium-Übungsabläufe, um Schwächen gezielt zu wiederholen.',
      openTutor: 'KI-Tutor öffnen',
      openPractice: 'Übung starten',
      openMasteryMap: 'Kompetenzkarte oeffnen',
      openDashboard: 'Zu meinem Lernen',
    },
    mobileUnavailableTitle: 'Abonnements nicht verfügbar',
    mobileUnavailable:
      'Abonnements sind auf Mobilgeräten nicht verfügbar. Bitte besuchen Sie unsere Website in einem Desktop-Browser, um Ihr Abonnement zu verwalten.',
    value: {
      eyebrow: 'Premium-Lernsystem',
      title: 'Abonniere, wenn NexExam die gesamte Lernreise führen soll.',
      body: 'Kaufe einen Kurs für ein konkretes Ziel oder schalte die Premium-Ebene mit KI-Planung, kursübergreifendem Fortschritt und tieferer Übung frei.',
      courseTitle: 'Einen Kurs kaufen',
      courseBody:
        'Ideal für eine Zertifizierung, Klasse oder ein Creator-geführtes Ziel.',
      subscriptionTitle: 'Premium abonnieren',
      subscriptionBody:
        'Ideal für laufendes KI-Coaching, Bereitschaftsverfolgung und Premium-Tools über mehrere Kurse.',
      includedTitle: 'Premium schaltet frei',
      included: [
        'KI-Lerncoach und adaptive Lernpläne',
        'Bereitschaftseinblicke über Kurse hinweg',
        'Premium-Übung und Schwächen-Wiederholung',
        'Priorisierter KI-Tutor-Kontext und gespeicherte Lernhistorie',
      ],
      comparisonTitle: 'Wähle den Pfad, der zu deinem Ziel passt',
      comparisonRows: [
        {
          label: 'Hauptwert',
          course: 'Einen Expertenkurs freischalten',
          subscription: 'Das Lernsystem rund um deine Kurse freischalten',
        },
        {
          label: 'Ideal für',
          course: 'Eine bestimmte Prüfung oder Fähigkeit',
          subscription: 'Laufende Prüfungsvorbereitung und geführtes Lernen',
        },
        {
          label: 'Premium-Gefühl',
          course: 'Vollständiger Lehrplan, Zertifikatspfad und Aufgaben',
          subscription:
            'KI-Coach, adaptiver Plan, Bereitschaft und tiefere Übung',
        },
      ],
      cardUnlockLabel: 'Enthaltene Freischaltungen',
    },

    intervals: {
      day: 'Täglich',
      week: 'Wöchentlich',
      month: 'Monatlich',
      year: 'Jährlich',
    },
    intervalUnits: {
      day: 'Tag',
      week: 'Woche',
      month: 'Monat',
      year: 'Jahr',
    },
    intervalUnitsPlural: {
      day: 'Tage',
      week: 'Wochen',
      month: 'Monate',
      year: 'Jahre',
    },
    priceInterval: '/{0}',
    intervalCountLabel: '{0} {1}',

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
  checkoutTrust: {
    badge: 'Sicherer Stripe-Checkout',
    finalTotal: 'Endbetrag vor der Zahlung sichtbar: {0}',
    subscriptionRenewal:
      'Verlängert sich alle {0}. Vor der nächsten Verlängerung verwalten oder kündigen.',
    courseOneTime:
      'Einmaliger Kurskauf. Der Zugriff wird nach erfolgreicher Zahlung freigeschaltet.',
    courseBundleOneTime:
      'Einmaliger Paketkauf. Enthaltene Kurse werden nach erfolgreicher Zahlung freigeschaltet.',
    aiCreditOneTime:
      'Einmaliger Kauf von KI-Credits. Credits werden nach erfolgreicher Zahlung hinzugefügt.',
    courseRefund:
      'Die Rückerstattungsrichtlinie wird vor dem Checkout geprüft.',
    oneOnOneOneTime:
      'Einmalige Buchungszahlung. Deine Sitzung wird nach erfolgreicher Zahlung bestätigt.',
    oneOnOneHold:
      'Dein Termin wird 30 Minuten reserviert, während der Checkout abgeschlossen wird.',
    couponReview:
      'Coupon eingegeben. Stripe zeigt den rabattierten Endbetrag vor der Zahlung.',
    paymentMethods:
      'Karten, Wallets und lokale Zahlungsmethoden erscheinen, wenn sie für deinen Standort verfügbar sind.',
    noSurpriseFees:
      'Keine überraschenden NexExam-Gebühren. Steuern oder Pflichtgebühren werden vor der Zahlung angezeigt.',
    secureAfterPayment: 'Sicher mit Stripe bezahlt',
    checkoutCancelled:
      'Der Checkout wurde abgebrochen. Es wurde keine Zahlung abgeschlossen und kein Zugriff geändert.',
    sessionPaymentSuccess:
      'Zahlung abgeschlossen. Deine Sitzung wird bestätigt.',
    stripeCustomText: {
      subscriptionSubmit:
        'Sicherer Abo-Checkout mit Stripe. Verlängerungsbedingungen und Endbetrag werden vor dem Abonnieren angezeigt.',
      courseSubmit:
        'Sicherer einmaliger Checkout mit Stripe. Der Endbetrag wird vor der Zahlung angezeigt.',
      courseBundleSubmit:
        'Sicherer Paket-Checkout mit Stripe. Der Endbetrag wird vor der Zahlung angezeigt.',
      aiCreditPackSubmit:
        'Sicherer KI-Credit-Checkout mit Stripe. Der Endbetrag wird vor der Zahlung angezeigt.',
      oneOnOneSessionSubmit:
        'Sicherer Buchungs-Checkout mit Stripe. Dein Termin bleibt reserviert, während die Zahlung abgeschlossen wird.',
      afterSubmit:
        'NexExam schaltet Zugriff erst frei, nachdem Stripe die Zahlung bestätigt.',
    },
  },
  pricing: {
    recommended: 'Empfohlen',
    savingsBadge: '{0}% sparen',
    oneTime: 'Einmalig',
    perMonth: 'pro Monat',
    perYear: 'pro Jahr',
    choosePackage: 'Paket wählen',
    buyCredits: 'Credits kaufen',
    buyBundle: 'Paket kaufen',
    addAiCredits: 'KI-Credits hinzufügen',
    aiTokensIncluded: '{0} KI-Tokens enthalten',
    aiCreditShelfTitle: 'KI-Credit-Pakete',
    aiCreditShelfBody:
      'Für intensivere Nutzung von KI-Tutor und Lernplänen kannst du zusätzliche Token-Kapazität hinzufügen, ohne den Plan zu wechseln.',
    aiCreditPurchaseSuccess:
      'KI-Credits gekauft. Deine zusätzliche KI-Kapazität ist jetzt verfügbar.',
    bundlePurchaseSuccess:
      'Paket gekauft. Die enthaltenen Kurse werden freigeschaltet.',
    coursePurchaseDescription:
      'Eine Zahlung schaltet diesen Kurs, Übungen, KI-Tutor-Prompts und den Zertifikatspfad frei.',
    lifetimeAccessName: 'Lebenslanger Zugriff: {0}',
    lifetimeAccessDescription:
      'Lebenslanger Zugriff auf einen ausgewählten Kurs ohne Verlängerung.',
    benefits: {
      coursePurchase: [
        'Kurslektionen und Übungen',
        'Start-Prompts für den KI-Tutor',
        'Zertifikatspfad',
      ],
      lifetime: [
        'Lebenslanger Zugriff auf diesen ausgewählten Kurs',
        'Künftige Kursaktualisierungen inklusive',
        'Kein Verlängerungsdatum',
      ],
      bundle: [
        'Alle enthaltenen Kurse',
        'Ein Checkout für den gesamten Pfad',
        'Zertifikate für berechtigte Kurse',
      ],
      aiCredits: [
        'Zusätzliche KI-Tutor-Kapazität',
        'Funktioniert mit Lernplänen und Erklärungen',
        'Nicht genutzte Credits bleiben in deinem Konto',
      ],
    },
  },
  contextualPaywall: {
    badges: {
      personalized_onboarding_result: 'Persönlicher Plan bereit',
      diagnostic_result: 'Diagnose abgeschlossen',
      preview_lesson_complete: 'Vorschau abgeschlossen',
      ai_full_plan: 'Vollständiger KI-Plan',
      locked_certificate: 'Zertifikatspfad',
      locked_practice_exam: 'Probeprüfung',
    },
    titles: {
      personalized_onboarding_result:
        'Verwandle dein Ziel in einen freigeschalteten Pfad',
      diagnostic_result: 'Verwandle dieses Ergebnis in einen fokussierten Plan',
      preview_lesson_complete: 'Lerne mit dem vollständigen Kurs weiter',
      ai_full_plan: 'Schalte den vollständigen KI-Lernplan frei',
      locked_certificate: 'Beschleunige diesen Zertifikatspfad',
      locked_practice_exam: 'Schalte tiefere Prüfungsvorbereitung frei',
    },
    bodies: {
      personalized_onboarding_result:
        'Dein Plan zeigt den Startrhythmus. Bezahlter Zugriff schaltet vollständigen Lehrplan, adaptive Anleitung, tiefere Übung und Zertifikatspfad passend zu diesem Ziel frei.',
      diagnostic_result:
        'Premium verwandelt deine Diagnosepunktzahl in Prioritäten für schwache Fähigkeiten, Übungsfokus und Bereitschafts-Checkpoints.',
      preview_lesson_complete:
        'Die Vorschau hat den Startpunkt gezeigt. Schalte die restlichen Lektionen, Übungen, Tutor-Prompts und den Zertifikatspfad frei.',
      ai_full_plan:
        'Ein vollständiger Plan nutzt deine Bereitschaft, schwache Fähigkeiten, Lektionsfortschritt und Übungshistorie für die nächsten Schritte.',
      locked_certificate:
        'Premium verbindet diesen Zertifikatspfad mit Bereitschaft, Erinnerungen und KI-Anleitung, während dein Fortschritt das Zertifikat freischaltet.',
      locked_practice_exam:
        'Premium ergänzt Prüfungssimulation, Bereitschaftssignale und KI-Nachbereitung, damit Übung zu einem messbaren Pfad wird.',
    },
    bullets: {
      personalized_onboarding_result: [
        'Meilensteine passend zu deinem Zeitplan',
        'Kurse, die zu deinem Ziel passen',
        'KI-Anleitung und tiefere Übung nach dem Freischalten',
      ],
      diagnostic_result: [
        'Schwache Fähigkeiten aus deinen Antworten priorisiert',
        'Empfohlene Übung mit Bereitschaft verknüpft',
        'KI-Coaching für die nächste Lerneinheit',
      ],
      preview_lesson_complete: [
        'Vollständiger Lehrplan und gesperrte Lektionen',
        'Probeprüfungen und Hausaufgabenaktivitäten',
        'KI-Tutor-Kontext und Zertifikatspfad',
      ],
      ai_full_plan: [
        'Lernaufgaben aus dem Kursfortschritt',
        'Schwache Bereiche und Übungshistorie enthalten',
        'Transparente KI-Begründung und Datenschutzkontrollen',
      ],
      locked_certificate: [
        'Zertifikatsmeilensteine bleiben sichtbar',
        'Bereitschaft und Serien mit Fortschritt verbunden',
        'KI-Anleitung für den nächsten Abschluss',
      ],
      locked_practice_exam: [
        'Realistischer Ablauf für Prüfungssimulation',
        'Bereitschaftssignale nach Versuchen',
        'Fokussierte KI-Nachbereitung für schwache Bereiche',
      ],
    },
    cta: {
      subscription: 'Premium freischalten',
      course: 'Kurs freischalten',
      aiCredits: 'KI-Credits hinzufügen',
      viewPlans: 'Pläne ansehen',
      checkoutPending: 'Checkout wird vorbereitet...',
    },
    errors: {
      checkoutUnavailable: 'Checkout ist für dieses Paket nicht verfügbar.',
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
      name: 'Prüfungsname (z. B. FINRA SIE)',
      code: 'Kurzer Prüfungscode (z. B. SIE, SERIES7)',
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
      aiTutorPrompt: 'AI Tutor-Prompt',
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
      aiTutorPrompt: 'System-Prompt für den KI-Tutor dieses Kapitels',
      objectives: 'Lernziele für dieses Kapitel',
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
      content: 'Lektionstext (Markdown unterstützt)',
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
      correctAnswerIndex: 'Index der richtigen Antwort',
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
      correctAnswerIndex: 'Nullbasierter Index der richtigen Option',
      answerOptions:
        'Gib eine Option pro Zeile ein. Die Übung für Lernende nutzt nur Fragen mit Antwortoptionen.',
      explanation: 'Warum die richtige Antwort richtig ist',
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
      conceptCode: 'Stabile Kennung (slug-ähnlich)',
      explanation: 'Vollständige Erklärung (Markdown)',
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
      timeLimitMinutes: 'Zeitlimit (Minuten)',
      passingScore: 'Passing Score',
      maxAttempts: 'Max Attempts',
      shuffleQuestions: 'Shuffle Questions',
      showAnswersImmediately: 'Antworten sofort anzeigen',
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
      name: 'z. B. Vollständige Prüfung, Kurzquiz, Domain-Drill',
      passingScore: 'Zum Bestehen erforderlicher Prozentsatz',
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
      timeSpentSeconds: 'Aufgewendete Zeit (Sekunden)',
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
      noResults: 'Keine Lernnotizen gefunden.',
      empty:
        'Du hast noch keine Lernnotizen erstellt. Erstelle deine erste Lernnotiz.',
    },

    importer: {
      title: 'Lernnotizen importieren',
      menu: 'Lernnotizen importieren',
    },

    export: {
      success: 'Lernnotizen erfolgreich exportiert',
    },

    new: {
      menu: 'Neue Lernnotiz',
      title: 'Neue Lernnotiz',
      success: 'Lernnotiz erfolgreich erstellt',
    },

    view: {
      title: 'Lernnotiz ansehen',
    },

    edit: {
      menu: 'Lernnotiz bearbeiten',
      title: 'Lernnotiz bearbeiten',
      success: 'Lernnotiz erfolgreich aktualisiert',
    },

    restore: {
      success: 'Lernnotiz erfolgreich wiederhergestellt',
      confirmTitle: 'Lernnotiz wiederherstellen?',
    },

    restoreMany: {
      success: 'Lernnotizen erfolgreich wiederhergestellt',
      noSelection:
        'Du musst mindestens eine Lernnotiz zum Wiederherstellen auswählen.',
      confirmTitle: 'Lernnotizen wiederherstellen?',
      confirmDescription:
        'Möchtest du die {0} ausgewählten Lernnotizen wirklich wiederherstellen?',
    },

    archiveMany: {
      success: 'Lernnotizen erfolgreich archiviert',
      noSelection:
        'Du musst mindestens eine Lernnotiz zum Archivieren auswählen.',
      confirmTitle: 'Lernnotizen archivieren?',
      confirmDescription:
        'Möchtest du die {0} ausgewählten Lernnotizen wirklich archivieren?',
    },

    archive: {
      success: 'Lernnotiz erfolgreich archiviert',
      confirmTitle: 'Lernnotiz archivieren?',
    },

    deleteMany: {
      success: 'Lernnotizen erfolgreich gelöscht',
      noSelection: 'Du musst mindestens eine Lernnotiz zum Löschen auswählen.',
      confirmTitle: 'Lernnotizen löschen?',
      confirmDescription:
        'Möchtest du die {0} ausgewählten Lernnotizen wirklich löschen?',
    },

    delete: {
      success: 'Lernnotiz erfolgreich gelöscht',
      confirmTitle: 'Lernnotiz löschen?',
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
      content: 'Notizinhalt (Markdown unterstützt)',
    },

    mcpDescription: {
      list: 'Ruft eine paginierte Liste von Lernnotizen mit erweiterten Filtern ab. Unterstützt Filter nach Feldern und verwandten Entitäten. Gibt Notizdetails, Beziehungen und Metadaten zurück.',
      get: 'Ruft detaillierte Informationen zu einer Lernnotiz anhand ihrer eindeutigen ID ab, einschließlich Beziehungen, Anhängen und Audit-Metadaten.',
      create:
        'Erstellt eine neue Lernnotiz mit Feldern, Beziehungen, Anhängen und benutzerdefinierten Eigenschaften.',
      update:
        'Aktualisiert eine vorhandene Lernnotiz und protokolliert die Änderung automatisch im Audit-Log.',
      delete:
        'Löscht eine oder mehrere Lernnotizen dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.',
      archive:
        'Archiviert eine oder mehrere Lernnotizen, um sie aus Standardansichten auszublenden, ohne ihre Daten zu löschen.',
      restore:
        'Stellt archivierte Lernnotizen wieder her, damit sie erneut in den Standardansichten erscheinen.',
      autocomplete:
        'Sucht Lernnotiz-Vorschläge für Autocomplete-Felder und Auswahlmenüs.',
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
      sourceFiles:
        'Lade Quelldokumente für den Lehrplan hoch (max. 50 MB pro Datei)',
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
      noResults: 'Keine Kurse gefunden.',
      empty: 'Veröffentlichte Kurse erscheinen hier, sobald sie bereit sind.',
      sortLabel: 'Sort',
      sortTrending: 'Trending',
      sortTopRated: 'Top rated',
      sortNewest: 'Newest',
      sortMostPopular: 'Most popular',
      sortPriceAsc: 'Preis (aufsteigend)',
      sortPriceDesc: 'Preis (absteigend)',
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
      allCourses: 'Alle Kurse',
      viewModeLabel: 'Katalogansicht',
      cardView: 'Karten',
      listView: 'Liste',
      page: 'Page',
    },
    freeSample: {
      badge: 'Kostenlose Probe',
      title: 'Erreiche einen echten Erfolg, bevor du zahlst',
      body: 'Sieh dir eine echte Lektion an und mache danach einen kurzen Diagnosetest, damit das Freischalten wie der nächste Schritt wirkt.',
      loading: 'Deine kostenlose Probe wird vorbereitet...',
      previewLesson: 'Vorschaulektion',
      startPreview: 'Vorschaulektion starten',
      completePreview: 'Vorschau abschließen',
      previewComplete: 'Vorschau abgeschlossen',
      emptyPreview:
        'Diese Vorschaulektion ist bereit, aber der Creator hat noch keine Inhaltsblöcke hinzugefügt.',
      resourcesTitle: 'Vorschau-Ressourcen',
      diagnosticBadge: 'Basischeck',
      diagnosticTitle: 'Mache den kurzen Diagnosetest',
      diagnosticBody:
        'Beantworte ein paar Fragen, um zu sehen, wo dich der vollständige Kurs am schnellsten weiterbringt.',
      signInTitle: 'Speichere dein Probenergebnis',
      signInBody:
        'Melde dich an, um den Diagnosetest zu machen und die Punktzahl mit diesem Kurs zu verbinden.',
      signInCta: 'Anmelden und fortfahren',
      noQuestions: 'Dieser Kurs hat noch keine beantwortbaren Diagnosefragen.',
      previewFirstTitle: 'Schließe zuerst die Vorschau ab',
      previewFirstBody:
        'Schließe die Probelelektion ab, um dein kurzes Diagnostikergebnis freizuschalten.',
      questionCount: '{0} Diagnosefragen',
      startDiagnostic: 'Diagnosetest starten',
      answered: '{0} von {1} beantwortet',
      saveAnswer: 'Antwort speichern',
      readyToScoreTitle: 'Bereit zur Auswertung',
      readyToScoreBody:
        'Alle Probefragen sind beantwortet. Werte den Diagnosetest aus, um deine nächste Freischaltung zu sehen.',
      completeDiagnostic: 'Diagnosetest auswerten',
      resultTitle: 'Dein Basisergebnis',
      resultBody:
        'Du hast jetzt einen Startpunkt. Schalte den vollständigen Kurs frei, um mit diesem Schwung weiterzumachen.',
      scoreLabel: 'Punktzahl',
      weakDomains: 'Schwache Fähigkeiten',
      noWeakDomains:
        'In dieser kurzen Probe wurde keine schwache Fähigkeit erkannt.',
      reviewAnswers: 'Antwortprüfung',
      correct: 'Richtig',
      incorrect: 'Prüfen',
      errors: {
        premiumOnly: 'Kostenlose Proben sind nur für Premium-Kurse verfügbar.',
      },
    },
    marketplace: {
      savedDefaultName: 'Saved courses',
      duration: 'Duration',
      noDuration: 'Keine Dauer festgelegt',
      durationHours: '{0} hr',
      durationBuckets: {
        short: 'Under 2 hours',
        medium: '2-8 hours',
        long: '8+ hours',
      },
      learners: 'learners',
      creator: 'Creator',
      creatorProfile: 'Creator profile',
      viewCreator: 'Creator-Profil ansehen',
      couponCode: 'Coupon code',
      couponPlaceholder: 'Gutscheincode eingeben',
      unsave: 'Gespeicherten Kurs entfernen',
      compare: 'Compare',
      compareLimit: 'Du kannst bis zu 4 Kurse vergleichen.',
      compareSelected: '{0} selected',
      compareHint: 'Vergleiche Preis, Ergebnisse, Nachweise und Kursstruktur.',
      noCompareCourses: 'Wähle Kurse aus dem Katalog zum Vergleichen aus.',
      bundles: 'Course bundles',
      bundle: 'Bundle',
      coursesIncluded: 'courses included',
      creatorStats: '{0} Kurse · {1} Lernende',
      creatorCourses: 'Published courses',
      proof: {
        badge: 'Kursnachweis',
        title: 'Warum Lernende für diesen Kurs bezahlen',
        outcomeLabel: 'Beispielergebnis',
        outcomeValue: 'Klares Ergebnis',
        outcomeFallback:
          'Sieh dir das Kursversprechen an, bevor du den vollständigen Lernpfad freischaltest.',
        completionLabel: 'Abschlussnachweis',
        completionRateValue: '{0}% Abschlussrate',
        completionRateHelper:
          '{0} von {1} Lernenden haben diesen Kurs abgeschlossen.',
        learnerCountValue: '{0} Lernende',
        learnerCountHelper:
          'Die Zahl der Lernenden wird angezeigt, bis genug Abschlüsse vorliegen.',
        reviewsLabel: 'Verifizierte Bewertungen',
        reviewsValue: '{0} Bewertungen',
        reviewsEmptyValue: 'Bewertungen entstehen',
        reviewsEmptyHelper:
          'Öffentliche Bewertungen erscheinen, nachdem eingeschriebene Lernende Feedback teilen.',
        previewLabel: 'Lehrplanvorschau',
        previewValue: '{0} kostenlose Vorschauen',
        previewHelper: '{0} Lektionen vor dem Kauf sichtbar.',
        creatorVerified: 'Von NexExam verifiziert',
        creatorProfileFallback: 'Kursersteller',
        credentials: 'Qualifikationen',
        expertise: 'Expertise',
        refundTitle: 'Rückerstattungsrichtlinie',
        refundBadge: 'Geprüfte Richtlinie',
        previewCurriculumTitle: 'Lehrplan ansehen',
        previewCurriculumBody:
          '{0} kostenlose Vorschaulektionen und {1} Lektionen nach dem Kauf verfügbar.',
        certificatesIssued: '{0} Zertifikate ausgestellt',
        standaloneLessons: 'Zusätzliche Lektionen',
        freePreview: 'Kostenlose Vorschau',
        lockedAfterPurchase: 'Nach Kauf freischalten',
        reviewsTitle: 'Bewertungen verifizierter Lernender',
        reviewsBody:
          'Öffentliche Bewertungen von Lernenden, die diesen Kurs belegt oder gekauft haben.',
        verifiedLearner: 'Verifizierter Lernender',
        noReviewsTitle: 'Bewertungen entstehen noch',
        noReviewsBody:
          'Feedback verifizierter Lernender erscheint hier, nachdem sie eine öffentliche Bewertung veröffentlichen.',
      },
      unlock: {
        badge: 'Freischalten',
        title: 'Was du freischaltest',
        paidTitle: 'Schalte das vollständige Kurserlebnis frei',
        subscriptionTitle: 'Im Premium-Zugang enthalten',
        body: 'Sieh das Ergebnis vor dem Bezahlen und schalte danach den vollständigen Lernpfad frei.',
        paidBody:
          'Dein Kauf schaltet Lektionen, Übungen, Aufgaben und Abschlussweg dieses Kurses frei.',
        subscriptionBody:
          'Premium verbindet diesen Kurs mit KI-Planung, Bereitschaft und laufender Übung.',
        courseCardPaid:
          'Schaltet vollständigen Lehrplan, Übung und Zertifikatspfad frei',
        courseCardSubscription:
          'Premium-Zugang schaltet die geführte Lernebene frei',
        courseCardFree: 'Kostenlos starten und Schwung aufbauen',
        previewLesson: 'Kostenlose Vorschau',
        lockedLesson: 'Gesperrt',
        availableAfterPurchase: 'Nach dem Kauf verfügbar',
        previewAvailable: 'Vorschau verfügbar',
        items: [
          'Vollständige Lektionen und Kursressourcen',
          'Aufgaben, Quizze und Übungsprüfungen',
          'Kurskontext für KI-Tutor und Lerncoach',
          'Zertifikatspfad und Fortschrittsnachweis',
        ],
      },
    },
    certificate: {
      title: 'Abschlusszertifikat',
      view: 'View certificate',
      print: 'Print certificate',
      verified: 'Verified completion',
      awardedTo: 'Awarded to',
      learner: 'Learner',
      completedCourse: 'for completing',
      issuedAt: 'Issued',
      number: 'Certificate number',
      verificationCode: 'Verification code',
      verifyHint: 'Verifiziere dieses Zertifikat mit dem Code {0}.',
    },
    detail: {
      title: 'Course Detail',
      enrolled: 'Enrolled',
      notEnrolled: 'Not enrolled',
    },
    activation: {
      title: 'Kurs freigeschaltet',
      loading: 'Dein freigeschalteter Kurs wird vorbereitet...',
      unlockingTitle: 'Dein Kurs wird freigeschaltet',
      unlockingBody:
        'Die Zahlung ist abgeschlossen. NexExam öffnet {0} und schreibt dich jetzt ein.',
      retryUnlock: 'Erneut prüfen',
      viewCourse: 'Kurs ansehen',
      unlockedPlan: 'Dein freigeschalteter Plan',
      startLesson: 'Empfohlene Lektion starten',
      openPlayer: 'Kurs-Player öffnen',
      whatUnlocked: 'Was geöffnet wurde',
      aiTutor: 'KI-Tutor',
      included: 'Enthalten',
      recommendedLesson: 'Erste empfohlene Lektion',
      noLesson: 'Dieser Kurs hat noch keine sichtbare Lektion.',
      practiceSet: 'Erste Übungseinheit',
      practiceQuestions: '{0} Übungsfragen bereit',
      startPractice: 'Übung starten',
      practiceUnavailable: 'Übung noch nicht verfügbar',
      certificatePath: 'Zertifikatspfad',
      certificateProgress: '{0} von {1} Lektionen abgeschlossen',
      certificateLocked:
        'Schließe den Kurs ab, um dein Zertifikat freizuschalten.',
      certificateUnavailable: 'Dieser Kurs enthält derzeit kein Zertifikat.',
      aiTutorStarter: 'Startprompt für den KI-Tutor',
      aiTutorPromptLesson:
        'Ich habe {0} gerade freigeschaltet. Hilf mir mit {1} zu beginnen und gib mir einen klaren ersten Lernschritt.',
      aiTutorPromptCourse:
        'Ich habe {0} gerade freigeschaltet. Hilf mir, einen klaren ersten Lernschritt zu erstellen.',
      askTutor: 'KI-Tutor fragen',
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
      description:
        'Erstelle, veröffentliche und verwalte plattformweite Kurse.',
      content: 'Course content',
      enrollments: 'Enrollments',
      reviewSubmission: 'Review submission',
      newCourse: 'New course',
      linkedContent: 'Verknüpfte Kursinhalte',
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
      stripePriceId: 'Stripe-Preis-ID',
      lifetimeAccessEnabled: 'Lebenslanger Zugriff verfügbar',
      lifetimePriceCents: 'Lebenslanger Preis (Cent)',
      lifetimeStripePriceId: 'Stripe-Preis-ID für lebenslangen Zugriff',
      subscriptionPlanKey: 'Schlüssel des Abonnementplans',
      creatorRevenueShareBps: 'Creator-Umsatzanteil (bps)',
      platformRevenueShare: 'Plattform-Umsatzanteil (bps)',
      nexVerified: 'Nex Verified',
      creatorUserId: 'Benutzer-ID des Creators',
      creatorMemberId: 'Mitglieds-ID des Creators',
      creatorOrganizationId: 'Organisations-ID des Creators',
      modules: 'Modules',
      lessons: 'Lessons',
      assignments: 'Assignments',
      lessonContent: 'Lesson text',
      videoFiles: 'Video files',
      prompt: 'Prompt',
      dueDate: 'Due date',
      dueDaysAfterEnroll: 'Fällig in Tagen nach Einschreibung',
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
      lessonCompleted: 'Lektion als abgeschlossen markiert.',
      assignmentSubmitted: 'Homework submitted.',
      courseSaved: 'Course saved.',
      courseUnsaved: 'Kurs aus gespeicherten Kursen entfernt.',
      studentEnrolled: 'Student enrolled.',
      submissionReviewed: 'Submission reviewed.',
      quizSubmitted: 'Quiz submitted.',
      ratingSaved: 'Kursbewertung gespeichert.',
      purchased: 'Kauf abgeschlossen: Du bist jetzt eingeschrieben.',
    },
    notify: {
      coursePurchaseConfirmedTitle: 'Kurskauf bestätigt',
      coursePurchaseConfirmedBody:
        'Du bist jetzt in {0} eingeschrieben. Beginne jederzeit mit dem Lernen.',
      courseRefundedTitle: 'Course refunded',
      courseRefundedBody:
        'Dein Kauf von {0} wurde erstattet. Der Zugriff wurde entfernt.',
    },
    errors: {
      manualEnrollmentOnly:
        'Dieser Kurs erfordert vor der Einschreibung manuellen, bezahlten oder Abonnementzugriff.',
      invalidCourseLink:
        'Dieser Kurs kann nicht aus der aktuellen Organisation verknüpft werden.',
      submissionRequired:
        'Füge vor dem Einreichen der Hausaufgabe Text oder Dateien hinzu.',
      submissionPendingReview:
        'Diese Hausaufgabe wurde bereits eingereicht und wartet auf Überprüfung.',
      submissionComplete: 'Diese Hausaufgabe wurde bereits abgeschlossen.',
      resubmissionNotAllowed:
        'Erneute Einreichungen sind für diese Hausaufgabe nicht erlaubt.',
      maxAttemptsReached:
        'Du hast die maximale Anzahl von Versuchen für diese Hausaufgabe erreicht.',
      invalidRubricScore:
        'Rubrikbewertungen müssen den Kriterien und Punktelimits entsprechen.',
      invalidSubmissionReviewStatus:
        'Wähle beim Bewerten der Hausaufgabe abgeschlossen oder Überarbeitung nötig.',
      ratingRequiresEnrollment:
        'Schreibe dich in diesen Kurs ein, bevor du ihn bewertest.',
      reviewNotPending: 'Dieser Kurs wartet nicht auf Überprüfung.',
      editLockedNotDraft:
        'Setze den Kurs vor dem Bearbeiten seiner Inhalte zurück auf Entwurf.',
      submitNotDraft:
        'Nur ein Kursentwurf kann zur Überprüfung eingereicht werden.',
      submitNeedsContent:
        'Schließe vor dem Einreichen die Veröffentlichungscheckliste ab: Titel, Beschreibung, Thumbnail, ein Modul, mindestens 3 Lektionen, eine Bewertung und Lernergebnisse.',
      cannotWithdraw:
        'Nur ein Kurs in Überprüfung oder ein veröffentlichter Kurs kann zurückgezogen werden.',
      examAlreadySubmitted:
        'Dieser Übungsprüfungsversuch wurde bereits eingereicht.',
      categoryInUse:
        'Diese Kategorie kann nicht entfernt werden, solange ihr Kurse zugeordnet sind.',
      coursePaymentNotConfigured:
        'Dieser Kurs ist noch nicht kaufbereit. Bitte versuche es später erneut.',
      alreadyEnrolled: 'Du bist bereits in diesen Kurs eingeschrieben.',
      invalidCoupon:
        'Dieser Gutschein kann nicht auf diesen Kurs angewendet werden.',
      couponLimitReached: 'Dieser Gutschein wurde bereits verwendet.',
      videoTranscriptNoVideo:
        'Lade ein Lektionsvideo hoch, bevor du ein Transkript anforderst.',
    },
    ratings: {
      title: 'Course rating',
      summary: '{0} ({1})',
      noRatings: 'Noch keine Bewertungen',
      commentPlaceholder:
        'Teile, was geholfen hat oder was besser sein könnte...',
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
      outline: 'Kursübersicht und Lerninhalte:',
      focusedLesson: 'Current lesson',
      completed: 'completed',
      assignment: 'Assignment',
      linkedContent: 'Verknüpfte Prüfungs-, Übungs- und Lernressourcen:',
      videoTranscript: 'Videotranskript',
    },
    videoTranscript: {
      title: 'Videotranskript',
      statusLabel: 'Transkript',
      retry: 'Transkript erneut versuchen',
      retryQueued: 'Transkript erneut in die Warteschlange gestellt.',
      status: {
        notRequested: 'Kein Transkript angefordert',
        queued: 'Transkript in Warteschlange',
        processing: 'Transkript wird verarbeitet',
        ready: 'Transkript bereit',
        failed: 'Transkript fehlgeschlagen',
      },
    },
    studyAi: {
      actions: {
        sectionTitle: 'KI-Lernwerkzeuge',
        explainLesson: 'Diese Lektion erklären',
        summarizeLesson: 'Diese Lektion zusammenfassen',
        quizMe: 'Teste mich zu diesem Modul',
        generatePractice: 'Practice questions',
      },
      result: {
        explainTitle: 'Lesson explained',
        summarizeTitle: 'Lesson summary',
        generating: 'Thinking…',
        streamError:
          'Beim Generieren ist etwas schiefgelaufen. Bitte erneut versuchen.',
        retry: 'Try again',
      },
      quiz: {
        quizTitle: 'Quick quiz',
        practiceTitle: 'Practice questions',
        generating: 'Deine Fragen werden erstellt…',
        intro: 'Beantworte jede Frage und prüfe anschließend deine Ergebnisse.',
        start: 'Start',
        submit: 'Check answers',
        next: 'Next',
        previous: 'Back',
        retake: 'New set',
        questionProgress: 'Question {0} of {1}',
        yourScore: 'You scored {0}%',
        correctCount: '{0} of {1} correct',
        passed: 'Great work!',
        failed: 'Übe weiter: Wiederhole die folgenden Themen.',
        domainBreakdown: 'By topic',
        correct: 'Correct',
        incorrect: 'Incorrect',
        noQuestions:
          'Es konnten keine Fragen generiert werden. Versuche ein Modul mit mehr Lektionsinhalt.',
        aiDisclaimer: 'KI-generierte Übung: zählt nicht zur Kursbewertung.',
      },
      coach: {
        title: 'Study coach',
        weakAreasTab: 'Weak areas',
        whatNextTab: 'What next',
        studyPlanTab: 'Study plan',
      },
      weakness: {
        heading: 'Wo du Punkte verlierst',
        empty:
          'Mache ein Quiz oder eine Übungsprüfung, dann erscheinen hier deine Schwachstellen.',
        weakest: 'Weakest topic',
        scoreLabel: '{0}% ({1}/{2})',
      },
      whatNext: {
        heading: 'Was sollte ich als Nächstes lernen?',
        generate: 'Get a recommendation',
        regenerate: 'Refresh recommendation',
        generating: 'Denke darüber nach…',
        empty:
          'Erhalte eine KI-Empfehlung basierend auf Fortschritt und Schwächen.',
      },
      studyPlan: {
        heading: 'Study plan',
        empty:
          'Noch kein Lernplan. Generiere einen oder füge eigene Aufgaben hinzu.',
        generate: 'Lernplan generieren',
        regenerate: 'Regenerate plan',
        generating: 'Dein Plan wird erstellt…',
        addItem: 'Add task',
        addPlaceholder: 'Neue Lernaufgabe',
        markDone: 'Mark done',
        markTodo: 'Als nicht erledigt markieren',
        deleteItem: 'Delete',
        aiBadge: 'AI',
        noDate: 'No date',
        remaining: '{0} of {1} done',
      },
      examDate: {
        title: 'Zieltermin der Prüfung',
        set: 'Prüfungstermin festlegen',
        edit: 'Edit',
        dateLabel: 'Exam date',
        nameLabel: 'Prüfungsname (optional)',
        namePlaceholder: 'e.g. SIE exam',
        save: 'Save',
        none: 'Kein Prüfungstermin festgelegt.',
        daysRemaining: '{0} Tage bis zu deiner Prüfung',
        examToday: 'Deine Prüfung ist heute. Viel Erfolg!',
        examPast: 'Dein Prüfungstermin ist vorbei.',
      },
      errors: {
        busy: 'Eine andere KI-Lernanfrage läuft noch. Bitte warte, bis sie fertig ist.',
        limitReached:
          'Das tägliche KI-Nutzungslimit wurde erreicht. Es wird morgen zurückgesetzt.',
        notConfigured: 'KI-Lernwerkzeuge sind derzeit nicht verfügbar.',
        parseFailed:
          'Die KI hat eine unlesbare Antwort zurückgegeben. Bitte erneut versuchen.',
        unexpectedQuizFormat:
          'Die KI hat Fragen zurückgegeben, die nicht verwendbar waren. Versuche ein Modul mit mehr Inhalt.',
        moduleNoContentQuiz:
          'Dieses Modul hat noch keinen Lektionsinhalt für ein Quiz.',
        moduleNoContentPractice:
          'Dieses Modul hat noch keinen Lektionsinhalt für Übungsfragen.',
        enrollToSetExamDate:
          'Schreibe dich in den Kurs ein, bevor du einen Prüfungstermin festlegst.',
        unexpectedResponse:
          'Die KI hat eine unerwartete Empfehlung zurückgegeben. Bitte erneut versuchen.',
        unexpectedStudyPlan:
          'Die KI hat einen unerwarteten Lernplan zurückgegeben. Bitte erneut versuchen.',
        courseScopedRequired:
          'Dieses Lernwerkzeug kann nur aus einem aktiven Kurs verwendet werden.',
        lessonRequired:
          'Wähle eine Lektion aus, bevor du dieses Lernwerkzeug nutzt.',
        moduleRequired:
          'Wähle ein Modul aus, bevor du dieses Lernwerkzeug nutzt.',
        signInStudyPlan: 'Melde dich an, um einen Lernplan zu erstellen.',
        unknownStudyTool: 'Unbekanntes Lernwerkzeug: {0}',
        generic: 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
      },
    },
    builder: {
      menu: 'My Courses',
      title: 'Course Builder',
      description: 'Erstelle, prüfe und veröffentliche deine eigenen Kurse.',
      newCourse: 'New course',
      emptyCourses: 'Du hast noch keine Kurse erstellt.',
      createFirst: 'Erstelle deinen ersten Kurs',
      continueBuilding: 'Continue building',
      updatedAt: 'Updated {0}',
      completionLabel: '{0}% ready',
      nextRecommended: 'Next: {0}',
      verifyRequired:
        'Schließe die Creator-Verifizierung ab, um Kurse zu erstellen und zu veröffentlichen.',
      verifyCta: 'Zur Creator-Verifizierung',
      loadError: 'Dieser Kurs konnte nicht geladen werden.',
      backToCourses: 'Zurück zu meinen Kursen',
      details: 'Course details',
      detailsBody:
        'Titel, Zusammenfassung und Titelmedien, die Lernende zuerst sehen.',
      curriculum: 'Curriculum',
      curriculumBody:
        'Füge Module hinzu und ziehe dann Lektionen, Quizze und Hausaufgaben in die richtige Reihenfolge.',
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
        'Noch keine Module. Füge dein erstes Modul hinzu, um zu beginnen.',
      noItems:
        'In diesem Modul gibt es noch keine Lektionen, Quizze oder Hausaufgaben.',
      noQuestions: 'Noch keine Fragen. Füge deine erste Frage hinzu.',
      rubricCriterionLabel: 'Rubric criterion',
      noRubricCriteria: 'Noch keine Rubrikkriterien.',
      submissionsTitle: 'Homework review',
      submissionsBody:
        'Prüfe Einreichungen, bewerte Rubrikkriterien und sende Feedback.',
      dragHint: 'Zum Neuordnen ziehen',
      videoUpload: 'Upload video',
      videoEmbedHint:
        'Oder füge einen YouTube- oder Vimeo-Link ein, statt hochzuladen.',
      resourcesHint:
        'Hänge Arbeitsblätter, Folien oder andere Dateien an, die Lernende herunterladen können.',
      contentHint: 'Lektionstext unterstützt Markdown-Formatierung.',
      isPreviewLesson: 'Kostenlose Vorschaulektion',
      correctOption: 'Correct answer',
      previewBanner: 'Studentenvorschau: So erleben Lernende deinen Kurs.',
      backToBuilder: 'Zurück zum Builder',
      statusDraft: 'Entwurf: Nur du kannst diesen Kurs sehen.',
      statusInReview: 'In Überprüfung: Ein Admin prüft diesen Kurs.',
      statusPublished:
        'Veröffentlicht: Lernende können sich in diesen Kurs einschreiben.',
      statusArchived: 'Archived.',
      reviewNotesTitle: 'Vom Prüfer angeforderte Änderungen',
      submitConfirm: 'Diesen Kurs zur Admin-Überprüfung einreichen?',
      withdrawConfirm:
        'Diesen Kurs aus der Überprüfung zurückziehen und in den Entwurf zurücksetzen?',
      unpublishConfirm:
        'Durch das Zurückziehen der Veröffentlichung wird der Kurs zum Entwurf und der Zugriff eingeschriebener Lernender entfernt. Fortfahren?',
      unsavedChanges: 'Du hast ungespeicherte Änderungen.',
      saveFirst: 'Speichere deine Änderungen, bevor du fortfährst.',
      actions: {
        save: 'Save draft',
        submitForReview: 'Zur Überprüfung einreichen',
        withdraw: 'Aus Überprüfung zurückziehen',
        unpublish: 'Unpublish',
        preview: 'Als Lernender ansehen',
        edit: 'Edit course',
        addModule: 'Add module',
        addLesson: 'Add lesson',
        addQuiz: 'Add quiz',
        addAssignment: 'Add homework',
        addRubricCriterion: 'Rubrikkriterium hinzufügen',
        saveFeedback: 'Save feedback',
        addQuestion: 'Add question',
        addOption: 'Add option',
        remove: 'Remove',
        addPracticeExam: 'Übungsprüfung hinzufügen',
        addExamRule: 'Domain-Regel hinzufügen',
        addOutcome: 'Add outcome',
        addRequirement: 'Add requirement',
        addFlashcardSet: 'Karteikartenset hinzufügen',
        addFlashcard: 'Add card',
        applyMiniTemplate: 'Mini-Kursvorlage anwenden',
        create: 'Create course',
      },
      quizSettings: {
        timeLimit: 'Zeitlimit (Min.)',
        maxAttempts: 'Max attempts',
        randomizeQuestions: 'Shuffle questions',
        randomizeAnswers: 'Shuffle answers',
        showExplanations: 'Show explanations',
        allowRetries: 'Allow retries',
      },
      examSettings: {
        totalQuestions: 'Total questions',
        questionCount: 'Question count',
        simulateRealExam: 'Echte Prüfung simulieren',
      },
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
      practiceExams: 'Practice exams',
      practiceExamsBody:
        'Erstelle zeitgesteuerte, nach Domain gewichtete Übungsprüfungen aus deiner Fragenbank.',
      noPracticeExams: 'Noch keine Übungsprüfungen.',
      practiceExamLabel: 'Practice exam',
      examRules: 'Domain rules',
      examRulesHint:
        'Füge pro Prüfungsdomain eine Regel hinzu, um die Fragenauswahl zu gewichten.',
      anyDifficulty: 'Any difficulty',
      questionType: {
        multipleChoice: 'Multiple choice',
        trueFalse: 'True / false',
        multiSelect: 'Alle zutreffenden auswählen',
      },
      setup: {
        difficulty: 'Difficulty',
        language: 'Language',
        certificateEnabled: 'Abschlusszertifikat ausstellen',
        visibility: 'Visibility',
        audience: 'Intended audience',
        audienceHint: 'Eine Zielgruppenbeschreibung pro Zeile.',
        promoVideo: 'Promo video',
        outcomes: 'Learning outcomes',
        outcomesBody: 'Was Lernende nach dem Kurs können werden.',
        requirements: 'Requirements',
        requirementsBody:
          'Was Lernende vor dem Start wissen oder haben sollten.',
        outcomePlaceholder: 'Learning outcome',
        requirementPlaceholder: 'Requirement',
      },
      visibility: {
        private: 'Private',
        unlisted: 'Unlisted',
        public: 'Public',
      },
      flashcards: 'Flashcards',
      flashcardsBody: 'Erstelle Karteikartensets zum Lernen.',
      noFlashcardSets: 'Noch keine Karteikartensets.',
      flashcardSetLabel: 'Flashcard set',
      flashcardFront: 'Front',
      flashcardBack: 'Back',
      flashcardHint: 'Hint (optional)',
      noCards: 'Noch keine Karten.',
      lessonHidden: 'Für Lernende verborgen',
      ai: {
        title: 'AI assistant',
        body: 'Generiere Kursinhaltsentwürfe mit KI; du prüfst alles, bevor es hinzugefügt wird.',
        promptPlaceholder: 'Beschreibe Thema, Prüfung oder Gliederung…',
        generateOutline: 'Generate outline',
        generateQuiz: 'Generate quiz',
        generateFlashcards: 'Generate flashcards',
        generateLesson: 'Generate lesson',
        improveLesson: 'Improve lesson',
        targetLessonLabel: 'Zu verbessernde Lektion',
        targetLessonPlaceholder: 'Select a lesson',
        generating: 'Generating…',
        queued: 'Queued',
        processing: 'Processing',
        completed: 'Completed',
        failed: 'Failed',
        progressLabel: '{0}% complete',
        addToCourse: 'Zum Kurs hinzufügen',
        discard: 'Discard',
        generated:
          'Die KI hat einen Entwurf erstellt. Prüfe ihn unten und füge ihn dann deinem Kurs hinzu.',
        qualityTitle: 'Review checklist',
        qualityBody:
          'Die KI prüft Quellenabdeckung, Quizqualität, Duplikate und Kursstruktur, bevor du den Entwurf annimmst.',
        noQualityIssues: 'Keine Prüfprobleme gefunden.',
        sourcesTitle: 'Quellen und Grundlage',
        sourceFallback: 'Kurs-Prompt oder vorhandenes Lektionsmaterial',
        sourceNoteFallback: 'Keine Notiz angegeben.',
        issueTarget: 'Target: {0}',
        draftNotice:
          'KI-Inhalte werden als bearbeitbarer Entwurf hinzugefügt und nie automatisch veröffentlicht.',
        saveFirst:
          'Speichere den Kurs einmal, bevor du den KI-Assistenten nutzt.',
        notConfigured: 'KI-Generierung ist derzeit nicht verfügbar.',
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
            'Füge Quellenangaben oder Quellnotizen hinzu, bevor du diesen Entwurf annimmst.',
          outlineEmpty: 'Die Gliederung enthielt keine Module.',
          outlineThin:
            'Die Gliederung könnte für eine vollständige Kurserfahrung zu dünn sein.',
          emptyTitle: 'Ein generiertes Element hat keinen Titel.',
          questionInvalidCorrectCount:
            'Eine Frage hat nicht genau eine richtige Antwort.',
          questionTooFewOptions: 'Eine Frage hat weniger als drei Optionen.',
          questionMissingExplanation: 'Einer Frage fehlt die Antworterklärung.',
          questionMissingDomain: 'Einer Frage fehlt die Prüfungsdomain.',
          duplicateQuestion:
            'Eine generierte Frage scheint eine vorhandene oder generierte Frage zu duplizieren.',
          flashcardsThin:
            'Das Karteikartenset braucht möglicherweise mehr Karten, bevor Lernende es nutzen.',
          lessonNoBlocks:
            'Der Lektionsentwurf enthielt keine bearbeitbaren Inhaltsblöcke.',
        },
        errors: {
          notConfigured: 'KI-Generierung ist derzeit nicht verfügbar.',
          lessonRequired: 'Wähle eine Lektion zum Verbessern aus.',
          queueFailed:
            'KI-Generierung konnte nicht eingereiht werden. Bitte erneut versuchen.',
          courseAiNotConfigured: 'KI-Generierung ist derzeit nicht verfügbar.',
          courseAiParseFailed:
            'Die KI hat einen unlesbaren Entwurf zurückgegeben. Bitte erneut versuchen.',
          courseAiGenerationFailed:
            'KI-Generierung fehlgeschlagen. Bitte erneut versuchen.',
          courseAiQueueFailed:
            'KI-Generierung konnte nicht eingereiht werden. Bitte erneut versuchen.',
        },
      },
      blocks: {
        title: 'Content blocks',
        body: 'Füge der Lektion umfangreiche, typisierte Inhaltsblöcke hinzu.',
        empty: 'Noch keine Inhaltsblöcke.',
        add: 'Add block',
        headingLevel: 'Heading level',
        textPlaceholder: 'Text…',
        listHint: 'Ein Element pro Zeile.',
        calloutVariant: 'Style',
        videoUrlPlaceholder: 'YouTube-/Vimeo-Link',
        selectQuiz: 'Select a quiz',
        selectFlashcardSet: 'Karteikartenset auswählen',
        embeddedQuiz: 'Eingebettetes Quiz',
        embeddedFlashcards: 'Eingebettete Karteikarten',
        lessonVideoTitle: 'Lektionsvideo',
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
      landingPage: 'Kurs-Landingpage',
      landingPageBody:
        'Thumbnail, Promo-Video und Zielgruppe, die Lernende vor der Einschreibung sehen.',
      createBody:
        'Gib deinem Kurs einen Arbeitstitel; alles andere kannst du später verfeinern.',
      createFlow: {
        title: 'Mit einem Kursentwurf starten',
        body: 'Wähle eine Startstruktur, prüfe die Gliederung und verfeinere sie dann im vollständigen Builder.',
        stepDetails: 'Course basics',
        stepDetailsBody:
          'Lege die Arbeitsidentität des Kurses fest. Diese Details bleiben nach der Erstellung bearbeitbar.',
        stepTemplate: 'Startvorlage auswählen',
        stepTemplateBody:
          'Vorlagen erstellen eine nützliche erste Gliederung, damit du nicht leer startest.',
        stepReview: 'Outline preview',
        stepReviewBody:
          'Dieser Entwurf wird sofort gespeichert und kann Abschnitt für Abschnitt bearbeitet werden.',
        examGoal: 'Prüfung oder Lernziel',
        createWithTemplate: 'Kursentwurf erstellen',
      },
      templates: {
        examPrep: {
          title: 'Exam prep',
          badge: 'Structured',
          description:
            'Ideal für Zertifizierungs-, Einstufungs-, Lizenz- oder Abschlussprüfungsvorbereitung.',
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
            'Ideal zum Vermitteln praktischer Fähigkeiten mit Demos, Hausaufgaben und Feedback.',
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
          title: 'Schneller Mini-Kurs',
          badge: 'Fast start',
          description:
            'Ideal für ein fokussiertes Thema, das Lernende in einer kurzen Sitzung abschließen können.',
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
        title: 'Bester nächster Schritt',
        ready: 'Bereit zur Überprüfung',
        fix: 'Go there',
        review: 'Review course',
      },
      recovery: {
        title: 'Ungespeicherten Entwurf wiederherstellen?',
        body: 'Ein neuerer Builder-Entwurf wurde gefunden. Stelle ihn wieder her, um mit den letzten Änderungen fortzufahren, oder behalte die gespeicherte Version.',
        restore: 'Restore draft',
        discard: 'Serverversion behalten',
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
        submit: 'Zur Überprüfung einreichen',
      },
      autosave: {
        saving: 'Saving…',
        saved: 'Saved',
        error: 'Save failed',
        retry: 'Retry',
      },
      checkpoints: {
        title: 'Version history',
        body: 'Erstelle manuelle Wiederherstellungspunkte und stelle aktuelle Entwürfe wieder her.',
        label: 'Checkpoint label',
        labelPlaceholder: 'z. B. vor den finalen Quiz-Änderungen',
        create: 'Create checkpoint',
        restore: 'Restore',
        delete: 'Delete checkpoint',
        empty: 'Noch keine Wiederherstellungspunkte.',
        loading: 'Loading checkpoints…',
        created: 'Checkpoint created.',
        restored: 'Checkpoint restored.',
        deleted: 'Checkpoint deleted.',
        submitSnapshotLabel: 'Vor dem Einreichen zur Überprüfung',
        sources: {
          autosave: 'Autosave',
          manual: 'Manual',
          restore: 'Restore',
          submitSnapshot: 'Submit snapshot',
        },
      },
      checklist: {
        title: 'Zur Überprüfung einreichen',
        intro:
          'Dein Kurs muss diese Anforderungen erfüllen, bevor ein Admin ihn prüfen kann.',
        required: 'Required',
        recommended: 'Recommended',
        ready: 'Alles sieht gut aus: Reiche ein, wenn du bereit bist.',
        notReady: 'Schließe die Punkte oben ab, bevor du einreichst.',
        fix: 'Fix',
        titleItem: 'Kursttitel hinzufügen',
        descriptionItem: 'Kursbeschreibung schreiben',
        thumbnailItem: 'Kurs-Thumbnail hochladen',
        moduleItem: 'Mindestens ein Modul hinzufügen',
        lessonsItem: 'Mindestens drei Lektionen hinzufügen',
        assessmentItem:
          'Mindestens ein Quiz oder eine Übungsprüfung hinzufügen',
        outcomeItem: 'Mindestens ein Lernergebnis hinzufügen',
        audienceItem: 'Beschreiben, für wen dieser Kurs ist',
        requirementItem: 'Kursanforderungen hinzufügen',
        lessonContentItem:
          'Inhalt, Blöcke oder Medien zu einer Lektion hinzufügen',
        previewLessonRecommendedItem:
          'Markiere eine Lektion als kostenlose Vorschau, bevor du bezahlte Kurse veröffentlichst',
        flashcardRecommendedItem:
          'Karteikarten für Wiederholungsübungen hinzufügen',
      },
      success: {
        created: 'Course created.',
        saved: 'Draft saved.',
        submitted: 'Kurs zur Überprüfung eingereicht.',
        withdrawn: 'Kurs in den Entwurf zurückgesetzt.',
      },
    },
    quiz: {
      heading: 'Quiz',
      passingScore: 'Passing score',
      noPassingScore: 'Keine Bestehenspunktzahl erforderlich.',
      yourScore: 'Your score',
      lastScore: 'Last attempt',
      passed: 'Passed',
      failed: 'Noch nicht bestanden',
      correct: 'Correct',
      incorrect: 'Incorrect',
      explanation: 'Explanation',
      selectAll: 'Alle zutreffenden auswählen.',
      selectOne: 'Wähle eine Antwort aus.',
      answerAll: 'Beantworte alle Fragen, bevor du einreichst.',
      points: 'points',
      empty: 'Dieses Quiz hat noch keine Fragen.',
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
      empty: 'Für diese Prüfung sind noch keine Fragen verfügbar.',
      answerAll: 'Beantworte alle Fragen, bevor du einreichst.',
    },
    flashcards: {
      heading: 'Flashcards',
      flip: 'Flip card',
      next: 'Next',
      previous: 'Previous',
      cardLabel: 'Card',
      showHint: 'Show hint',
      empty: 'Dieses Set hat noch keine Karten.',
    },
    review: {
      menu: 'Course Reviews',
      title: 'Kurse zur Überprüfung',
      empty: 'Es warten keine Kurse auf Überprüfung.',
      pending: 'Awaiting review',
      submittedAt: 'Zur Überprüfung eingereicht',
      decision: 'Review decision',
      notesLabel: 'Notizen für den Creator',
      notesHint:
        'Erforderlich beim Anfordern von Änderungen; wird mit dem Creator geteilt.',
      approveBody: 'Genehmigen veröffentlicht den Kurs sofort im Katalog.',
      approve: 'Approve & publish',
      requestChanges: 'Request changes',
      filterAll: 'All courses',
      filterPending: 'Awaiting review',
      success: 'Kursüberprüfung gespeichert.',
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
    courseContextHeader: 'Kurskontext für den Tutor verfügbar:',
    courseVideoTranscriptNotice:
      'Transkripte hochgeladener Videos werden einbezogen, sobald die Verarbeitung abgeschlossen ist.',
    courseScopedSystemPrompt:
      'Der Benutzer fragt innerhalb eines bestimmten Kurses. Nutze diesen Kurskontext, wenn er hilfreich ist. Verwende Videotranskripte, wenn sie verfügbar sind.',
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
      badge: 'Superadmin-Steuerung',
      title: 'NexExam-Betrieb überwachen',
      description:
        'Verwalte Lernende, Kontoerstellungslinks, studentische Promotionen und manuelle Creator-Auszahlungen organisationsübergreifend.',
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
      title: 'Metrik-Kommandozentrale',
      description:
        'Verfolge Wachstum, Lernergebnisse, Umsatz, Erstattungen, KI-Nutzung und Kursqualität.',
      range: 'Range',
      loading: 'Loading metrics...',
      empty: 'Noch keine Kursmetriken verfügbar.',
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
        'Vergleiche Einschreibungen, Lernfortschritt, Quiz-Ergebnisse, Bewertungen und Umsatz.',
      course: 'Course',
      enrollments: 'Enrollments',
      homework: 'Homework',
      quiz: 'Quiz',
      rating: 'Rating',
      revenue: 'Revenue',
      funnelTitle: 'Monetarisierungs-Funnel',
      funnelDescription:
        'Miss, wie Kursinteresse zu Checkout, bezahltem Zugriff und erstem freigeschaltetem Wert wird.',
      funnelEmpty: 'Noch keine Funnel-Aktivität verfügbar.',
      viewToCheckout: 'Ansicht zu Checkout',
      checkoutToPaid: 'Checkout zu bezahlt',
      paidToFirstValue: 'Bezahlt zu erstem Wert',
      funnelEvents: '{0} Ereignisse',
      fromPrevious: '{0} vom vorherigen Schritt',
      courseViews: 'Ansichten',
      paywallSeen: 'Paywall',
      checkoutStarted: 'Checkout',
      paid: 'Bezahlt',
      firstValue: 'Erster Wert',
      paidRate: 'Zahlrate',
      funnelSteps: {
        course_view: 'Kursansicht',
        preview_start: 'Vorschau',
        value_sample_started: 'Probe gestartet',
        value_sample_completed: 'Probe abgeschlossen',
        sample_diagnostic_started: 'Diagnose gestartet',
        sample_diagnostic_completed: 'Diagnose abgeschlossen',
        paywall_seen: 'Paywall gesehen',
        cta_click: 'CTA-Klick',
        checkout_started: 'Checkout',
        paid: 'Bezahlt',
        first_value_after_payment: 'Erster Wert',
      },
    },
    dashboard: {
      shortcut: 'Cmd K',
      adminName: 'NexExam Admin',
      adminRole: 'Super Admin',
      daily: 'Daily',
      noValue: '$0',
      loading: 'Loading users...',
      emptyUsers: 'Keine Benutzer passen zu diesen Filtern.',
      showingUsers: '{0} von {1} Benutzern werden angezeigt',
      platformWide: 'Platform-wide',
      manualPlan: 'Manual',
    },
    students: {
      title: 'Student accounts',
      description:
        'Suche Benutzer organisationsübergreifend und verwalte ihre Mitgliedschaften.',
    },
    invitation: {
      title: 'Link zur Kontoerstellung',
      description:
        'Sende einen sicheren Einladungslink an potenzielle Lernende oder Admins.',
      emailSubject: 'Deine NexExam-Kontoeinladung',
      emailBody: `<p>Hallo,</p><p>Du wurdest eingeladen, {0} auf NexExam beizutreten.</p><p>Nutze diesen sicheren Link, um dein Konto zu erstellen:</p><p><a href="{1}">{1}</a></p><p>Danke,</p><p>Das NexExam-Team</p>`,
    },
    promotions: {
      title: 'Promotionen und Hinweise',
      description:
        'Veröffentliche Toast-Benachrichtigungen, Banner und Rabattnachrichten für Lernende.',
    },
    payouts: {
      title: 'Creator payouts',
      description:
        'Verfolge manuelle Auszahlungen an Creator, bevor du sie als bezahlt markierst.',
      unassigned: 'Unassigned creator',
      totalMtd: 'Total payouts',
      pendingAmount: 'Pending amount',
      successfulPayouts: 'Successful payouts',
      cancelledPayouts: 'Cancelled payouts',
      trend: 'Payout trend',
      pendingQueue: 'Warteschlange ausstehender Auszahlungen',
      createTitle: 'Create payout',
      createDescription:
        'Füge einen manuellen Auszahlungseintrag hinzu und verfolge ihn bis zum Abschluss.',
    },
    roles: {
      title: 'Rollen und Berechtigungen',
      description: 'Überwache die Plattform-Zugriffskontrolle.',
      adminDescription: 'Organisationseinstellungen und Benutzer verwalten',
      memberDescription: 'Den Lernbereich nutzen',
    },
    activity: {
      title: 'Recent activity',
      description: 'Verfolge wichtige Admin-Aktionen.',
      system: 'System',
      auditLine: '{0} on {1}',
    },
    risk: {
      title: 'Betrugs- und Risikoübersicht',
      description: 'Markierte Konten und Auszahlungsrisiken.',
      disabledMembers: 'Disabled members',
      pendingPayouts: 'Pending payouts',
      cancelledAmount: 'Betrag stornierter Auszahlungen',
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
      creatorUserId: 'Benutzer-ID des Creators',
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
      email: 'lernender@example.com',
      globalSearch:
        'Benutzer, Creator, Auszahlungen, Benachrichtigungen suchen...',
      searchStudents: 'Lernende nach Name oder E-Mail suchen...',
      title: 'Promotion title',
      message: 'Promotion message',
      ctaLabel: 'Beschriftung des Handlungsaufrufs',
      ctaHref: 'Link des Handlungsaufrufs',
      creatorUserId: 'Creator-Benutzer-ID einfügen',
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
      backToDashboard: 'Zurück zum Dashboard',
    },
    success: {
      invitationSent: 'Einladung erfolgreich gesendet',
      promotionCreated: 'Promotion erfolgreich erstellt',
      payoutCreated: 'Auszahlung erfolgreich erstellt',
    },
    errors: {
      inviteExists:
        'Für diese E-Mail gibt es bereits eine ausstehende Einladung.',
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
      subject: 'Bestätige deine Kontolöschung',
      content:
        '<p>Hallo {0},</p><p>Du hast die Löschung deines Kontos angefordert. Klicke zur Bestätigung innerhalb von 24 Stunden auf diesen Link:</p><p><a href="{1}">{1}</a></p><p>Dein Konto ist zur dauerhaften Entfernung am <strong>{2}</strong> geplant, sofern du vorher nicht abbrichst. Du kannst jederzeit in den Kontoeinstellungen abbrechen.</p><p>Wenn du dies nicht angefordert hast, ignoriere diese E-Mail; es passiert nichts.</p>',
    },
    accountDeletionConfirmedEmail: {
      subject: 'Dein Konto ist zur Löschung geplant',
      content:
        '<p>Hallo {0},</p><p>Deine Kontolöschung ist bestätigt. Wir entfernen deine Daten dauerhaft am <strong>{1}</strong>. Du kannst bis dahin weiterhin in den Kontoeinstellungen abbrechen.</p>',
    },
    dataExportReadyEmail: {
      subject: 'Dein Datenexport ist bereit',
      content:
        '<p>Hallo {0},</p><p>Dein Datenexport steht zum Download bereit.</p><p><a href="{1}">{1}</a></p><p>Download-Links laufen aus Sicherheitsgründen nach 15 Minuten ab; öffne die Kontoeinstellungen, um einen neuen Link anzufordern.</p>',
    },
  },
  oneOnOneCall: {
    entryCard: {
      title: '1:1 mit deinem Kursleiter',
      description: 'Buche einen Videoanruf mit deinem Kursleiter.',
      actionOpen: 'Book a 1:1',
      noAvailability: 'Dein Kursleiter hat noch keine 1:1-Sitzungen geöffnet.',
    },
    availability: {
      title: 'Availability',
      description:
        'Wähle die wöchentlichen Zeitfenster, in denen du 1:1-Anrufe annehmen kannst.',
      timezoneLabel: 'Timezone',
      addWindow: 'Add window',
      removeWindow: 'Remove',
      dayOfWeek: 'Day',
      startTime: 'Start',
      endTime: 'End',
      save: 'Save availability',
      saved: 'Availability saved',
      empty:
        'Noch keine Verfügbarkeitsfenster. Füge eines hinzu, um Sitzungen anzunehmen.',
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
      description: 'Lege fest, was Lernende buchen können.',
      add: 'Sitzungstyp hinzufügen',
      fields: {
        title: 'Title',
        description: 'Description (optional)',
        durationMinutes: 'Duration (minutes)',
        isFree: 'Kostenlose Sitzung',
        priceAmount: 'Preis',
        currency: 'Währung',
        bufferMinutes: 'Buffer (minutes)',
        minNoticeHours: 'Mindestvorlauf (Stunden)',
      },
      pricingModeLabel: 'Preismodell',
      freeMode: 'Kostenlos',
      paidMode: 'Kostenpflichtig',
      freeLabel: 'Kostenlos',
      durationMinutesShort: '{0} min',
      priceAmountPlaceholder: '25.00',
      paidHelper:
        'Teilnehmende bezahlen über Stripe, bevor die Sitzung bestätigt wird.',
      priceInvalid: 'Gib einen Preis zwischen 0,50 USD und 10.000,00 USD ein.',
      currencyInvalid: 'Gib einen 3-stelligen Währungscode ein.',
      save: 'Save',
      cancel: 'Abbrechen',
      disable: 'Disable',
      empty: 'Noch keine Sitzungstypen.',
    },
    booking: {
      title: 'Book a 1:1',
      pickSessionType: 'Choose a session',
      pickDate: 'Pick a date',
      pickTime: 'Pick a time',
      confirm: 'Confirm booking',
      submitting: 'Booking…',
      noSessionTypes: 'Dein Kursleiter hat noch keine 1:1-Sitzungen geöffnet.',
      noSlots: 'In diesem Zeitraum gibt es keine freien Termine.',
      success: 'Gebucht: Sieh deine Sitzung in deiner Sitzungsliste.',
      close: 'Schließen',
      freeLabel: 'Kostenlos',
      durationMinutesShort: '{0} min',
      sessionTypeOptionLabel: '{0} ({1}, {2})',
      paidBookingNotice:
        'Kostenpflichtige Sitzungen leiten zu Stripe Checkout weiter. Der Termin bleibt reserviert, bis die Zahlung abgeschlossen ist.',
      stripeProductName: '1:1 mit {0}: {1}',
    },
    session: {
      title: 'Your 1:1 sessions',
      tabs: { upcoming: 'Upcoming', past: 'Past' },
      role: { student: 'As student', instructor: 'As instructor' },
      emptyUpcoming: 'Keine kommenden Sitzungen.',
      emptyPast: 'Keine vergangenen Sitzungen.',
      join: 'Join call',
      joinHint: 'Der Teilnahmelink wird 10 Minuten vor Beginn freigeschaltet.',
      cancel: 'Cancel session',
      statusLabel: 'Status',
      statuses: {
        confirmed: 'Bestätigt',
        pendingPayment: 'Zahlung ausstehend',
        completed: 'Abgeschlossen',
        cancelledByStudent: 'Von Lernendem storniert',
        cancelledByInstructor: 'Vom Kursleiter storniert',
        noShow: 'Nicht erschienen',
        expired: 'Abgelaufen',
        disputed: 'Angefochten',
        refunded: 'Erstattet',
      },
    },
    notes: {
      title: 'Notes',
      placeholder: 'Private oder geteilte Notiz hinzufügen…',
      add: 'Add note',
      shared: 'Mit der anderen Person teilen',
      edit: 'Edit',
      delete: 'Delete',
      empty: 'Noch keine Notizen.',
    },
    cancel: {
      title: 'Diese Sitzung stornieren?',
      reasonLabel: 'Reason (optional)',
      confirm: 'Yes, cancel',
      keep: 'Keep session',
      lateCancelWarning:
        'Du stornierst innerhalb von 24 Stunden vor Beginn; das zählt als späte Stornierung.',
    },
    errors: {
      noInstructor:
        'Für diesen Kurs ist kein Kursleiter für 1:1-Sitzungen verfügbar.',
      cannotBookSelf: 'Du kannst kein 1:1 mit dir selbst buchen.',
      paidNotAvailable:
        'Kostenpflichtige 1:1-Sitzungen erfordern eine konfigurierte Stripe-Zahlungsabwicklung.',
      slotUnavailable:
        'Diese Zeit liegt nicht in der Verfügbarkeit des Kursleiters oder verletzt den Mindestvorlauf.',
      slotTaken:
        'Dieser Termin wurde gerade von jemand anderem gebucht. Bitte wähle eine andere Zeit.',
      rangeTooLarge:
        'Der Zeitraum ist zu groß; grenze die Daten ein und versuche es erneut.',
      notCourseOwner: 'Du besitzt diesen Kurs nicht.',
      cannotCancel: 'Diese Sitzung kann nicht mehr storniert werden.',
    },
    notify: {
      bookingConfirmedTitle: '1:1 session booked',
      bookingConfirmedStudentBody:
        'Deine 1:1-Sitzung für {0} ist für {1} bestätigt.',
      bookingConfirmedInstructorBody: '{0} hat ein 1:1 für {1} am {2} gebucht.',
      cancelledTitle: '1:1 session cancelled',
      cancelledByStudentBody: '{0} hat das 1:1 für {1} am {2} storniert.',
      cancelledByInstructorBody: '{0} hat dein 1:1 für {1} am {2} storniert.',
      reminderTitle: '1:1 session reminder',
      reminderBody: 'Dein 1:1 für {0} beginnt bald: {1}.',
      disputeOpenedTitle: '1:1 session disputed',
      disputeResolvedTitle: '1:1 dispute resolved',
    },
    dispute: {
      open: 'Diese Sitzung anfechten',
      reasonLabel: 'Was ist schiefgelaufen?',
      reasonPlaceholder: 'Beschreibe das Problem ausführlich.',
      submit: 'Open dispute',
      alreadyDisputed: 'Für diese Sitzung ist bereits ein Streitfall offen.',
      notEligible:
        'Nur bezahlte Sitzungen, die abgeschlossen oder als Nichterscheinen markiert wurden, können angefochten werden.',
      outcomeRefund: 'Eine Erstattung wurde ausgestellt.',
      outcomeNoRefund:
        'Der Streitfall wurde geprüft und es wurde keine Erstattung ausgestellt.',
      admin: {
        title: '1:1-Streitfallprüfung',
        list: 'Offene Streitfälle',
        statusFilter: 'Nach Status filtern',
        statuses: {
          all: 'Alle',
          open: 'Offen',
          underReview: 'In Prüfung',
          resolvedRefund: 'Gelöst: Erstattung',
          resolvedNoRefund: 'Gelöst: keine Erstattung',
        },
        detail: 'Streitfalldetail',
        sessionLabel: 'Sitzung',
        courseLabel: 'Kurs',
        studentLabel: 'Lernender',
        instructorLabel: 'Kursleiter',
        scheduledLabel: 'Geplant',
        priceLabel: 'Preis',
        paidAtLabel: 'Bezahlt am',
        refundedLabel: 'Erstattet',
        refundedValue: '{0} am {1}',
        statusLabel: 'Status',
        reasonLabel: 'Grund',
        resolutionLabel: 'Entscheidung',
        refund: 'Erstattung ausstellen',
        noRefund: 'Keine Erstattung',
        refundAmount: 'Erstattungsbetrag (Cent)',
        notes: 'Entscheidungsnotizen',
        resolve: 'Entscheiden',
        resolved: 'Gelöst',
        empty: 'Keine Streitfälle passen zu diesem Filter.',
        emptyValue: '—',
        resolveError: 'Der Streitfall konnte nicht gelöst werden.',
      },
    },
  },
  creatorEarnings: {
    title: 'Your earnings',
    summary: {
      title: 'Earnings summary',
      totalEarned: 'Total paid',
      pending: 'Pending',
      paidThisMonth: 'Diesen Monat bezahlt',
    },
    list: {
      title: 'Payouts',
      empty:
        'Noch keine Auszahlungen. Einträge erscheinen hier, sobald du etwas verdienst.',
      status: {
        pending: 'Pending',
        paid: 'Paid',
        cancelled: 'Cancelled',
      },
    },
    payoutMethod: {
      title: 'Payout method',
      description:
        'Wie möchtest du bezahlt werden? Bank-ACH-Daten, Wise-E-Mail, PayPal usw. Einfacher Text; Admins lesen dies beim Überweisen deiner Gelder.',
      edit: 'Edit',
      save: 'Save',
      placeholder: 'z. B. ACH — Chase ****1234 — Routing 021000021',
      empty: 'Noch keine Auszahlungsmethode festgelegt.',
    },
    notify: {
      payoutPaidTitle: 'Deine Auszahlung wurde gesendet',
      payoutPaidBody:
        'Deine Auszahlung über {0} {1} wurde als bezahlt markiert.',
      payoutCancelledTitle: 'Deine Auszahlung wurde storniert',
      payoutCancelledBody: 'Deine Auszahlung über {0} {1} wurde storniert.',
    },
  },
  adminCourseCategories: {
    title: 'Course categories',
    description:
      'Kuratierte Taxonomie für die Chip-Leiste des Marketplace und das Dropdown im Kurs-Builder.',
    empty:
      'Noch keine Kategorien. Füge eine hinzu, um den Marketplace zu kuratieren.',
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
      iconName: 'Symbol (Lucide-Schlüssel, z. B. LuBookOpen)',
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
        'Diese Kategorie deaktivieren? Verknüpfte Kurse behalten ihre Zuordnung, aber die Kategorie erscheint nicht im Marketplace.',
      enable: 'Diese Kategorie wieder im Marketplace anzeigen?',
    },
    errors: {
      statusRequired: 'Wähle aktivieren oder deaktivieren.',
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
    badge: 'Personalisiertes Onboarding',
    title: 'Erstelle deinen Prüfungspfad',
    body: 'Beantworte fünf kurze Fragen, damit NexExam Preise und Kursempfehlungen in einen Plan zu deinem Ziel verwandelt.',
    skip: 'Vorerst überspringen',
    continue: 'Weiter zum Dashboard',
    enrollLabel: 'Einschreiben',
    enrolledLabel: 'Eingeschrieben',
    viewLabel: 'Kurs ansehen',
    generatePlan: 'Meinen Plan erstellen',
    editAnswers: 'Antworten bearbeiten',
    emptyMessage:
      'Wir bereiten gerade neue Kurse vor. Dein Plan kann trotzdem mit Diagnose und Lernrhythmus starten.',
    fields: {
      examGoal: 'Prüfung oder Lernziel',
      timeline: 'Zeitplan',
      currentLevel: 'Aktuelles Niveau',
      studyTime: 'Wöchentliche Lernzeit',
      targetScore: 'Zielpunktzahl',
    },
    placeholders: {
      examGoal: 'Algebra-1-Abschluss, SAT Math, Pflegeaufnahmeprüfung...',
      targetScore: '90 %, 700+, beim ersten Versuch bestehen...',
    },
    timeline: {
      two_weeks: '2 Wochen',
      one_month: '1 Monat',
      two_months: '2 Monate',
      three_months: '3 Monate',
      six_months: '6 Monate',
      not_sure: 'Unsicher',
    },
    timelineBody: {
      two_weeks: 'Sprint-Plan',
      one_month: 'Fokussierter Monat',
      two_months: 'Stetiger Aufbau',
      three_months: 'Tiefe Vorbereitung',
      six_months: 'Langer Vorlauf',
      not_sure: 'Flexibler Start',
    },
    currentLevel: {
      new: 'Ganz neu',
      some_background: 'Etwas Vorwissen',
      practicing: 'Schon am Üben',
      almost_ready: 'Fast bereit',
    },
    currentLevelBody: {
      new: 'Beginne mit Grundlagen und ersten Erfolgen.',
      some_background: 'Finde Lücken und baue einen wiederholbaren Rhythmus.',
      practicing: 'Priorisiere Schwächen und prüfungsnahe Übung.',
      almost_ready: 'Verfeinere Timing, Genauigkeit und Abschlussreview.',
    },
    studyTime: {
      '120': 'Leicht',
      '240': 'Stetig',
      '420': 'Engagiert',
      '600': 'Intensiv',
      '900': 'Immersiv',
    },
    duration: {
      minutes: '{0} Min.',
      hours: '{0} Std.',
      hoursMinutes: '{0} Std. {1} Min.',
    },
    unlockPreview: {
      badge: 'Freischaltvorschau',
      title: 'Bezahlen sollte sich wie der nächste offene Schritt anfühlen',
      body: 'Der Plan zeigt, was jetzt möglich ist und was durch Abo oder Kurskauf dazukommt.',
      items: [
        'Ein Lernrhythmus passend zu deiner verfügbaren Zeit',
        'Kursempfehlungen passend zu deinem Ziel',
        'Eine klare Trennung zwischen Gratiswert und bezahlten Freischaltungen',
      ],
    },
    plan: {
      title: 'Dein persönlicher Plan ist bereit',
      body: 'Prüfe Rhythmus, Meilensteine und Kursmatches, bevor du entscheidest, was du freischaltest.',
      readyBadge: 'Plan erstellt',
      personalTitle: 'Plan für {0}',
      summary:
        '{0}-Zeitplan bis {1}, mit einer ersten Aktion passend zu Niveau und verfügbaren Kursen.',
      sessionRhythm: '{0} Sitzungen/Woche à {1}',
      today: 'Heute',
      days: 'Tag {0}',
      milestonesTitle: 'Meilensteinpfad',
      metrics: {
        timeline: 'Zeitplan',
        weeklyTime: 'Wöchentliche Zeit',
        rhythm: 'Lernrhythmus',
        targetScore: 'Ziel',
      },
      milestones: {
        baseline: {
          title: 'Baseline',
          body: 'Starte mit Diagnose oder erster Lektion, damit der Plan ein echtes Signal hat.',
        },
        firstWin: {
          title: 'Erster Erfolg',
          body: 'Schließe eine fokussierte Lektion oder Übung ab, um Momentum aufzubauen.',
        },
        practiceRhythm: {
          title: 'Übungsrhythmus',
          body: 'Wiederhole Übungen zu Schwächen in einem festen Wochenrhythmus.',
        },
        examReadiness: {
          title: 'Bereitschaftscheck',
          body: 'Nutze Bereitschaftssignale, um Reviews vor dem Testtag zu planen.',
        },
        finalReview: {
          title: 'Abschlussreview',
          body: 'Schütze starke Themen und schärfe die übrigen Schwachstellen.',
        },
      },
    },
    courses: {
      title: 'Empfohlene Kursmatches',
      body: 'Sortiert nach Ziel, Niveau und Zeitplan.',
      browseAll: 'Alle Kurse durchsuchen',
    },
    unlocks: {
      title: 'Was sich öffnet',
      includedTitle: 'Jetzt enthalten',
      paidTitle: 'Mit bezahltem Zugriff freigeschaltet',
      includedItems: [
        'Gespeichertes Ziel und Zeitplan',
        'Empfohlener erster Kurs oder Vorschau',
        'Ein einfacher Meilensteinpfad',
      ],
      items: {
        fullCurriculum: 'Vollständiger Lehrplan und Kursressourcen',
        adaptivePlan: 'Adaptiver Plan, der sich mit Fortschritt ändert',
        aiTutor: 'KI-Tutor-Prompts zu Lektionen und Übungen',
        practiceExams: 'Probeprüfungen und tiefere Bereitschaftschecks',
        certificatePath: 'Zertifikatspfad und Abschlussnachweis',
      },
    },
    errors: {
      noRecommendations:
        'Noch keine Kursempfehlungen verfügbar. Versuche es erneut, nachdem Kurse veröffentlicht wurden.',
    },
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
      disclaimer: 'AI Tutor kann Fehler machen. Überprüfe wichtige Antworten.',
    },
    attachments: {
      add: 'Dateien anhängen',
      remove: 'Anhang entfernen',
      tooMany: 'Hänge bis zu 5 Dateien pro Nachricht an.',
      tooLarge: 'Jeder Anhang darf höchstens 10 MB groß sein.',
      unsupported:
        'Hänge PDF-, DOCX-, TXT-, Markdown-, CSV- oder JSON-Dateien an.',
      invalid: 'Dieser Anhang ist für diese Unterhaltung nicht verfügbar.',
      uploadFailed:
        'Anhang konnte nicht hochgeladen werden. Bitte erneut versuchen.',
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

  aiTrust: {
    title: 'KI-Transparenz',
    openControls: 'KI-Datenschutzkontrollen',
    settingsTitle: 'KI-Datenschutzkontrollen',
    settingsDescription:
      'Wahlen Sie, welche Lernsignale NexExam fur zukunftige KI-Antworten verwenden darf.',
    saved: 'KI-Datenschutzkontrollen gespeichert.',
    saving: 'Speichern...',
    controls: {
      lessonContent: {
        label: 'Lektionsinhalte',
        description:
          'Lektionstexte, Transkripte und Aufgaben fur Erklarungen, Quizze und Plane verwenden.',
      },
      lessonProgress: {
        label: 'Lektionsfortschritt',
        description:
          'Abgeschlossene und offene Lektionen fur personalisierte Empfehlungen verwenden.',
      },
      practiceResults: {
        label: 'Ubungsergebnisse',
        description:
          'Quiz- und Ubungsergebnisse verwenden, um schwache Themen zu erkennen.',
      },
      chatHistory: {
        label: 'Chatverlauf',
        description:
          'Vorherige Nachrichten derselben KI-Tutor-Konversation verwenden.',
      },
      attachments: {
        label: 'Anhange',
        description:
          'Hochgeladene Dateien beim Beantworten Ihrer aktuellen Nachricht verwenden.',
      },
    },
    panel: {
      trigger: 'Warum das?',
      title: 'KI-Vertrauensschicht',
      why: 'Warum generiert',
      influencedBy: 'Beeinflusst durch',
      confidence: 'Vertrauen',
      limitations: 'Einschrankungen',
      privacy: 'Datenschutz',
      used: 'Verwendet',
      omitted: 'Nicht verwendet',
      unavailable: 'Noch keine Daten',
      generated: 'Generiert',
      model: 'Modell',
      noSignals: 'Keine KI-Vertrauensdetails verfugbar.',
      privacyNote:
        'Datenschutzkontrollen wirken sich auf zukunftige KI-Generierungen aus.',
    },
    confidence: {
      high: 'Starke Evidenz',
      medium: 'Teilweise Evidenz',
      low: 'Begrenzte Evidenz',
    },
    sources: {
      studentPrompt: 'Ihre Eingabe',
      courseOutline: 'Kursgliederung',
      lessonContent: 'Lektionsinhalte',
      lessonProgress: 'Lektionsfortschritt',
      practiceResults: 'Ubungsergebnisse',
      examDate: 'Prufungsdatum',
      chatHistory: 'Chatverlauf',
      attachments: 'Anhange',
    },
    reasons: {
      studyPlan:
        'Dieser Plan wurde generiert, um schwache Themen, offene Lektionen und Ihren Prufungszeitplan zu priorisieren.',
      nextStep:
        'Diese Empfehlung wurde aus Ihrem Kursfortschritt und schwachen Themen generiert.',
      lessonExplain:
        'Diese Erklarung wurde aus dem Kontext der ausgewahlten Lektion generiert.',
      lessonSummary:
        'Diese Zusammenfassung wurde aus dem Kontext der ausgewahlten Lektion generiert.',
      quiz: 'Dieses Quiz wurde aus den Lektionen des ausgewahlten Moduls generiert.',
      practice:
        'Diese Ubung wurde aus den Lektionen des ausgewahlten Moduls generiert.',
      aiTutor:
        'Diese Antwort wurde aus Ihrer Eingabe und dem aktivierten Lernkontext generiert.',
    },
    limitations: {
      general:
        'KI kann Fehler machen. Prufen Sie wichtige Antworten mit dem Kursmaterial.',
      noPracticeData: 'Es waren keine Quiz- oder Ubungsergebnisse verfugbar.',
      noLessonProgress:
        'Es war kein Verlauf abgeschlossener Lektionen verfugbar.',
      noLessonContent:
        'Die ausgewahlte Lektion hat wenig oder keinen lesbaren Inhalt.',
      lessonContentOff:
        'Lektionsinhalte wurden nicht verwendet, weil Sie sie deaktiviert haben.',
      lessonProgressOff:
        'Lektionsfortschritt wurde nicht verwendet, weil Sie ihn deaktiviert haben.',
      practiceOff:
        'Ubungsergebnisse wurden nicht verwendet, weil Sie sie deaktiviert haben.',
      historyOff:
        'Chatverlauf wurde nicht verwendet, weil Sie ihn deaktiviert haben.',
      attachmentsOff:
        'Anhange wurden nicht verwendet, weil Sie sie deaktiviert haben.',
      verifyAnswers:
        'Generierte Fragen und Erklarungen sollten gepruft werden, bevor Sie sich darauf verlassen.',
    },
    units: {
      days: 'Tage',
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
