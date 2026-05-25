const dictionary = {
  projectName: 'NexExam',

  shared: {
    showArchived: '¿Mostrar archivados?',
    viewArchived: 'Ver archivados',
    archive: 'Archivar',
    restore: 'Restaurar',
    archived: 'Archivado',
    yes: 'Sí',
    no: 'No',
    cancel: 'Cancelar',
    save: 'Guardar',
    done: 'Hecho',
    clear: 'Limpiar',
    accept: 'Aceptar',
    dashboard: 'Panel',
    new: 'Nuevo',
    all: 'Todos',
    searchNotFound: 'No se encontró nada.',
    searchPlaceholder: 'Buscar...',
    selectPlaceholder: 'Seleccionar una opción',
    dateFormat: 'DD MMM YYYY',
    datetimeFormat: 'DD MMM YYYY HH:mm',
    tagsPlaceholder: 'Escribir y presionar Enter para agregar',
    edit: 'Editar',
    delete: 'Eliminar',
    openMenu: 'Abrir menú',
    search: 'Buscar',
    reset: 'Restablecer',
    min: 'Mín',
    max: 'Máx',
    view: 'Ver',
    copiedToClipboard: 'Copiado al portapapeles',
    exportToCsv: 'Exportar a CSV',
    import: 'Importar',
    pause: 'Pausar',
    discard: 'Descartar',
    deleted: 'Eliminado',
    remove: 'Remover',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha de fin',
    close: 'Cerrar',
    loading: 'Cargando',
    toggleSidebar: 'Mostrar/ocultar barra lateral',
    breadcrumb: 'ruta de navegación',
    more: 'Más',
    previousSlide: 'Diapositiva anterior',
    nextSlide: 'Diapositiva siguiente',
    refresh: 'Actualizar',

    unsavedChanges: {
      title: 'Cambios sin guardar',
      message:
        'Tiene cambios sin guardar que se perderán si abandona esta página.',
      proceed: 'Descartar',
      dismiss: 'Cancelar',
      saveChanges: 'Guardar cambios',
    },

    importer: {
      importHashAlreadyExists: 'Los datos ya han sido importados',
      title: 'Importar archivo CSV',
      menu: 'Importar archivo CSV',
      line: 'Línea',
      status: 'Estado',
      pending: 'Pendiente',
      success: 'Importado',
      error: 'Error',
      importedMessage: `Procesado {0} de {1}.`,
      noValidRows: 'No hay filas válidas.',
      noNavigateAwayMessage:
        'No abandone esta página o la importación se detendrá.',
      uploadFiles: 'Subir archivos',
      uploadFilesDisclaimer:
        'Esta importación contiene campos de archivo. Los archivos se subirán durante la importación.',
      completed: {
        success:
          'Importación completada. Todas las filas fueron importadas exitosamente.',
        someErrors:
          'Procesamiento completado, pero algunas filas no pudieron ser importadas.',
        allErrors: 'Importación fallida. No hay filas válidas.',
      },
      form: {
        downloadTemplate: 'Descargar la plantilla',
        description:
          'Suba un archivo CSV para importar datos. Puede descargar la plantilla para ver el formato requerido.',
      },
      list: {
        newConfirm: '¿Está seguro?',
        discardConfirm: '¿Está seguro? Los datos no importados se perderán.',
      },
      errors: {
        invalidFileEmpty: 'El archivo está vacío',
        fileRequired: 'El archivo es requerido',
        uploadFailed: 'Fallo al subir archivos',
        partialUpload: 'Solo {0} de {1} archivos subidos',
      },
      fileUpload: {
        title: 'Subiendo archivos',
        progress: 'Progreso: {0} / {1}',
        uploading: '{0} subiendo',
        completed: '{0} completado',
        failed: '{0} fallido',
        rowLabel: 'Fila {0} - {1}',
      },
    },

    dataTable: {
      filters: 'Filtros',
      noResults: 'No se encontraron resultados.',
      viewOptions: 'Vista',
      toggleColumns: 'Mostrar/ocultar columnas',

      sortAscending: 'Asc',
      sortDescending: 'Desc',
      clearSort: 'Limpiar',
      hide: 'Ocultar',

      selectAll: 'Seleccionar todo',
      selectRow: 'Seleccionar fila',
      paginationRange: '{0}-{1} de {2}',
      paginationSelected: '{0} seleccionado(s)',
      paginationRowsPerPage: 'por página',
      pagination: 'paginación',
      goToPreviousPage: 'Ir a página anterior',
      goToNextPage: 'Ir a página siguiente',
      morePages: 'Más páginas',
    },

    locales: {
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
      'pt-BR': 'Português (Brasil)',
      fr: 'Français',
    },

    localeSwitcher: {
      searchPlaceholder: 'Buscar idioma...',
      title: 'Idioma',
      placeholder: 'Seleccionar un idioma',
      searchEmpty: 'No se encontró ningún idioma.',
    },

    theme: {
      toggle: 'Tema',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
    },

    errors: {
      previewMode: 'Esta función no está disponible en modo de vista previa.',
      timezone: 'Zona horaria inválida',
      invalid: `{0} es inválido`,
      unknown: 'Ocurrió un error',
      unique: `{0} debe ser único`,
      staleData:
        'El registro ha sido actualizado por otro usuario. Por favor actualice e intente nuevamente.',
      copyToClipboard: 'No se pudo copiar al portapapeles',
      tooManyRequests: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
    },
  },

  apiKey: {
    docs: {
      menu: 'Documentación API',
    },
    edit: {
      menu: 'Editar clave API',
      title: 'Editar clave API',
      success: 'Clave API actualizada exitosamente',
      error: 'Fallo al actualizar clave API',
    },
    new: {
      menu: 'Nueva clave API',
      title: 'Nueva clave API',
      success: 'Clave API creada exitosamente',
      error: 'Fallo al crear clave API',
      warning: {
        title: 'Guarde su clave API',
        message:
          'Esta es la única vez que verá esta clave API. Por favor cópiela y guárdela de forma segura.',
      },
      restrictPermissions: 'Restringir permisos',
      allowAllPermissions: 'Permitir todos los permisos',
      permissionsDisclaimer:
        'Nota: Debe tener los permisos seleccionados en la organización para que sean efectivos.',
    },
    list: {
      menu: 'Claves API',
      title: 'Claves API',
      noResults: 'No se encontraron claves API.',
    },
    delete: {
      confirmTitle: '¿Eliminar clave API?',
      confirmDescription:
        '¿Está seguro de que desea eliminar esta clave API? Esta acción no se puede deshacer.',
      success: 'Clave API eliminada exitosamente',
    },
    enumerators: {
      status: {
        enabled: 'Habilitada',
        disabled: 'Deshabilitada',
      },
      remaining: {
        unlimited: 'Ilimitado',
      },
      lastUsed: {
        never: 'Nunca',
      },
      expiresAt: {
        never: 'Nunca',
      },
      permissions: {
        permission: 'permiso',
        permissions: 'permisos',
        invalid: 'Inválido',
      },
    },
    fields: {
      apiKey: 'Clave API',
      member: 'Usuario',
      name: 'Nombre',
      namePlaceholder: 'Mi clave API',
      keyPreview: 'Vista previa de la clave',
      expiresAt: 'Expira',
      expiresAtPlaceholder: 'Nunca expira (dejar vacío)',
      expiresAtMin:
        'La fecha de expiración debe ser al menos {0} día(s) en el futuro',
      expiresAtMax:
        'La fecha de expiración no puede ser más de {0} día(s) en el futuro',
      status: 'Estado',
      enabled: 'Habilitada',
      remaining: 'Restante',
      lastUsed: 'Último uso',
      createdAt: 'Creado el',
      permissions: 'Permisos',
      permissionsPlaceholder: 'Seleccionar permisos',
      permissionsRequired: 'Se requiere al menos un permiso',
    },
    errors: {
      fetch: 'Fallo al obtener claves API',
      delete: 'Fallo al eliminar clave API',
      notFound: 'Clave API no encontrada',
      permissionDenied: 'No tiene permiso para otorgar {0}:{1}',
      organizationRequired: 'Se requiere ID de organización',
      createFailed: 'Fallo al crear clave API',
      listFailed: 'Fallo al listar claves API',
    },
  },

  file: {
    button: 'Subir',
    delete: 'Eliminar',
    dropzone: {
      dragAndDrop: 'Arrastrar y soltar archivos aquí',
      dropFiles: 'Soltar archivos aquí',
      uploadFiles: 'Puede subir {0} archivo{1}.',
      upTo: 'Hasta {0}.',
      eachUpTo: 'Cada uno hasta {0}.',
      accepted: '{0} aceptado(s).',
      uploading: 'Subiendo...',
      uploadSuccessful: 'Subida exitosa',
    },
    errors: {
      formats: `Formato inválido. Debe ser uno de: {0}.`,
      notImage: `El archivo debe ser una imagen`,
      tooBig: `El archivo es demasiado grande. El tamaño actual es {0} bytes, el tamaño máximo es {1} bytes`,
      invalidFilename: 'Nombre de archivo inválido',
    },
  },

  dashboard: {
    searchLabel: 'Buscar contenido de aprendizaje',
    searchPlaceholder: 'Busca cursos, temas, recursos...',
    notifications: 'Notificaciones',
    learnerRole: 'Estudiante',
    superAdminRole: 'Superadministrador',
    fallbackName: 'Estudiante',
    viewSwitcher: {
      title: 'Cambiar vista',
      superAdmin: 'Admin',
      student: 'Estudiante',
      creator: 'Profesor',
    },
    student: {
      menu: 'Panel de estudiante',
      role: 'Estudiante',
    },
    creator: {
      menu: 'Panel de creador',
      role: 'Profesor creador',
      welcome: 'Te damos la bienvenida, {0}',
      title: 'Construye tu ruta como profesor creador',
      subtitle:
        'Solicita verificación, revisa el estado y prepara cursos para el catálogo de aprendizaje de NexExam.',
      applicationTitle: 'Estado de verificación',
      applicationEmpty:
        'Inicia tu solicitud de creador para que el equipo de NexExam revise tus credenciales y enfoque de enseñanza.',
      applicationPending:
        'Tu solicitud de creador está en revisión. Puedes actualizar los detalles mientras el equipo la evalúa.',
      applicationApproved:
        'Tu perfil de creador está aprobado. La publicación de cursos controlada por administradores sigue activa en la Fase 1.',
      applicationRejected:
        'Tu solicitud necesita cambios antes de aprobarse. Revisa las notas del administrador y vuelve a enviarla.',
      startApplication: 'Iniciar solicitud',
      editApplication: 'Actualizar solicitud',
      workspaceTitle: 'Espacio de cursos',
      workspaceBody:
        'La creación de cursos para creadores está separada del aprendizaje de estudiantes. La publicación autoservicio se abrirá cuando el flujo de verificación sea estable.',
      reviewTitle: 'Revisión administrativa',
      reviewBody:
        'Los superadministradores de NexExam revisan solicitudes, calidad de cursos, inscripciones y pagos desde el panel de administración.',
      deferredTitle: 'Límite de Fase 1',
      deferredBody:
        'La creación por arrastrar y soltar y los repartos automáticos de ingresos quedan diferidos mientras se publica el ciclo de inscripción.',
      metricsTitle: 'Creator metrics',
      metricsBody:
        'Track enrollments, completion, AI usage, ratings, and earnings across your courses.',
    },
    welcome: 'Te damos la bienvenida, {0}',
    heroTitle: 'Continúa tu aprendizaje con IA',
    heroSubtitle: 'Aprendizaje personalizado. Más inteligente cada día.',
    continueLearning: 'Continuar aprendiendo',
    askTutor: 'Preguntar al tutor de IA',
    viewAllCourses: 'Ver todos los cursos',
    viewAll: 'Ver todo',
    recommendedForYou: 'Recomendado para ti',
    aiTutorTitle: 'Tutor de IA',
    online: 'En línea',
    aiTutorGreeting: '¡Hola! Soy tu tutor de IA.',
    aiTutorPrompt: '¿Cómo puedo ayudarte hoy?',
    tutorActions: [
      'Explicar un concepto',
      'Hacerme un cuestionario',
      'Recomendar recursos',
    ],
    learningProgress: 'Progreso de aprendizaje',
    thisWeek: 'Esta semana',
    totalStudyTime: 'Tiempo total de estudio',
    noEnrolledCoursesTitle: 'Comienza tu primer curso',
    noEnrolledCoursesDescription:
      'Inscríbete en un curso publicado para ver aquí tus lecciones, tareas y progreso con el tutor de IA.',
    noRecommendationsTitle: 'Aún no hay recomendaciones',
    noRecommendationsDescription:
      'Los nuevos cursos publicados aparecerán aquí cuando estén disponibles para inscripción.',
    enrolledCoursesStat: 'Cursos inscritos',
    completedLessonsStat: 'Lecciones completadas',
    submittedAssignmentsStat: 'Tareas enviadas',
    averageProgressStat: 'Progreso promedio',
    lessonProgress: '{0} de {1} lecciones',
    assignmentProgress: '{0} de {1} tareas',
    progressComplete: '{0}% completado',
    recommendationMeta: '{0} lecciones • {1} tareas',
    nextLesson: 'Siguiente lección',
    noLessons: 'Todas las lecciones completadas',
    weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    courses: [
      {
        title: 'Introducción a la inteligencia artificial',
        meta: 'Módulo 4 • Fundamentos de aprendizaje automático',
        progress: '65%',
      },
      {
        title: 'Estructuras de datos y algoritmos',
        meta: 'Módulo 3 • Árboles y grafos',
        progress: '40%',
      },
      {
        title: 'Fundamentos de diseño UI/UX',
        meta: 'Módulo 2 • Principios de diseño',
        progress: '20%',
      },
    ],
    recommendations: [
      {
        title: 'Fundamentos de aprendizaje profundo',
        meta: 'Curso • Intermedio',
        rating: '4.8 (320)',
      },
      {
        title: 'SQL para análisis de datos',
        meta: 'Curso • Principiante',
        rating: '4.7 (210)',
      },
      {
        title: 'Clase magistral de programación en Python',
        meta: 'Curso • Principiante',
        rating: '4.9 (421)',
      },
    ],
  },

  studentExperience: {
    menu: {
      myCourses: 'Mis cursos',
      practice: 'Práctica',
      notesStudyPlan: 'Notas / Plan de estudio',
      aiTutor: 'AI Tutor',
      courseOverview: 'Resumen del curso',
    },
    title: 'Panel del estudiante',
    subtitle:
      'Mantente enfocado en la próxima lección, las tareas, la práctica y el apoyo de IA para tus cursos inscritos.',
    heroTitle: 'Tu próximo mejor paso de estudio está listo',
    heroSubtitle:
      'NexExam mantiene el progreso del curso, las tareas, la práctica, las notas y la preparación en un solo lugar.',
    continueLesson: 'Continuar lección',
    continueCourse: 'Continuar curso',
    askCourseTutor: 'Preguntar al tutor del curso',
    openCourseOverview: 'Abrir resumen',
    startPractice: 'Iniciar práctica',
    continuePractice: 'Continuar práctica',
    completePractice: 'Completar práctica',
    submitAnswer: 'Enviar respuesta',
    viewCoursePlayer: 'Abrir reproductor',
    addNote: 'Agregar nota',
    saveNote: 'Guardar nota',
    addStudyPlanItem: 'Agregar elemento al plan',
    saveStudyPlanItem: 'Guardar elemento del plan',
    markComplete: 'Marcar como completo',
    readinessScore: 'Puntaje de preparación para el examen',
    readinessInsufficient: 'Necesita más práctica o datos del examen',
    readinessReady: 'Hay suficientes datos disponibles',
    myCourses: 'Mis cursos',
    upcomingHomework: 'Tareas próximas',
    practiceQuestions: 'Preguntas de práctica',
    notesAndStudyPlan: 'Notas + Plan de estudio',
    recentNotes: 'Notas recientes',
    todayPlan: 'Plan de hoy',
    progress: 'Progreso',
    homework: 'Tareas',
    notes: 'Notes',
    studyPlan: 'Plan de estudio',
    mobile: {
      savedOffline:
        'Guardado sin conexión. Se sincronizará cuando vuelvas a estar en línea.',
      syncFailed: 'Falló la sincronización',
      continueLearning: 'Continuar aprendiendo',
      offlineStatus: {
        online: 'En línea',
        offline:
          'Modo sin conexión: los cambios se guardan en este dispositivo.',
        syncing: 'Sincronizando trabajo móvil guardado...',
        synced: 'Trabajo móvil sincronizado.',
        failed:
          'Parte del trabajo móvil necesita otro intento de sincronización.',
      },
    },
    adaptivePlan: {
      title: 'Plan de estudio adaptativo',
      body: 'Define tu objetivo y NexExam convertirá tu preparación, áreas débiles, tareas y práctica en acciones enfocadas.',
      badge: 'Guiado por IA',
      examNameLabel: 'Examen u objetivo',
      examNamePlaceholder: 'Certificación, final o resultado esperado',
      targetExamDateLabel: 'Fecha objetivo del examen',
      weakAreasLabel: 'Áreas débiles actuales',
      noWeakAreas: 'Completa práctica para revelar áreas débiles.',
      generate: 'Generar plan adaptativo',
      regenerate: 'Actualizar plan adaptativo',
      itemsCreated: '{0} tarea(s) adaptativa(s) agregada(s).',
      itemTitles: {
        diagnostic: 'Completa tu diagnóstico inicial',
        weakArea: 'Refuerza el área débil: {0}',
        homework: 'Termina la tarea: {0}',
        lesson: 'Continúa la lección: {0}',
        practice: 'Preguntas de práctica para {0}',
        maintain: 'Mantén la preparación para {0}',
      },
      itemDescriptions: {
        diagnostic:
          'Responde preguntas de práctica de {0} para que NexExam calibre tu preparación.',
        weakArea: 'Revisa explicaciones y repite práctica enfocada en {0}.',
        homework: 'Completa o revisa {0} antes de agregar más material nuevo.',
        lesson: 'Avanza por {0} y márcala como completa al terminar.',
        practice:
          'Usa una sesión de práctica enfocada para confirmar tu dominio de {0}.',
        maintain:
          'Mantén el impulso con una revisión breve, notas y práctica para {0}.',
      },
    },
    learningOutcomes: {
      title: 'Resultados de aprendizaje',
      body: 'Usa diagnosticos, dominio, recuerdo, remediacion y simulacion de examen para convertir el progreso en preparacion medible.',
      badge: 'Motor de resultados',
      summary: {
        masteryAverage: 'Promedio de dominio',
        dueFlashcards: 'Tarjetas pendientes',
        streak: 'Racha de estudio',
        mockExam: 'Simulacro',
      },
      diagnostic: {
        title: 'Diagnostico adaptativo',
        body: 'Inicia una linea base para que NexExam mapee tus dominios fuertes y debiles.',
        start: 'Iniciar diagnostico',
        restart: 'Repetir diagnostico',
        submit: 'Guardar respuesta',
        complete: 'Completar diagnostico',
        answered: '{0} de {1} respondidas',
        lastScore: 'Ultimo diagnostico: {0}% en {1} preguntas',
        noQuestions:
          'Agrega preguntas aprobadas antes de ejecutar diagnosticos.',
      },
      mastery: {
        title: 'Mapa de dominio por area',
        empty:
          'Completa diagnosticos, practica o simulacros para crear un mapa de dominio.',
        evidence: '{0} punto(s) de evidencia',
        confidence: {
          low: 'Confianza baja',
          medium: 'Confianza media',
          high: 'Confianza alta',
        },
        actions: {
          diagnose: 'Necesita una linea base diagnostica.',
          remediate: 'Prioriza remediacion antes de nuevas lecciones.',
          practice: 'Practica hasta estabilizar el puntaje.',
          maintain: 'Mantener con repaso espaciado.',
        },
      },
      flashcards: {
        title: 'Repeticion espaciada',
        dueCount: '{0} de {1} tarjeta(s) pendientes',
        nextDue: 'Proxima {0}',
        inSet: 'De {0}',
        flip: 'Voltear tarjeta',
        empty: 'No hay tarjetas pendientes ahora.',
        openPlayer: 'Abrir tarjetas',
        ratings: {
          again: 'Otra vez',
          hard: 'Dificil',
          good: 'Bien',
          easy: 'Facil',
        },
      },
      streak: {
        dayCount: '{0} dia(s)',
      },
      remediation: {
        title: 'Remediacion de puntos debiles',
        body: 'Genera un plan corto para el dominio que mas afecta tu preparacion.',
        generate: 'Generar plan de remediacion',
        refresh: 'Actualizar plan de remediacion',
        noWeakDomains: 'Aun no se detectan dominios debiles.',
        planTitle: 'Sprint de remediacion: {0}',
        planDescription: 'Repaso, practica y recuerdo enfocados para {0}.',
        itemsCreated: '{0} tarea(s) de remediacion agregada(s).',
        itemTitles: {
          review: 'Repasar fundamentos: {0}',
          practice: 'Practicar dominio debil: {0}',
          recall: 'Chequeo de recuerdo: {0}',
        },
        itemDescriptions: {
          review:
            'Vuelve a lecciones, notas y explicaciones relacionadas con {0}.',
          practice: 'Responde preguntas enfocadas y revisa errores de {0}.',
          recall:
            'Usa tarjetas o una autoevaluacion breve para confirmar retencion de {0}.',
        },
      },
      schedule: {
        title: 'Calendario de estudio',
        empty: 'Aun no hay tareas de estudio programadas.',
        flashcardsTitle: '{0} tarjeta(s) pendientes',
      },
      mockExams: {
        title: 'Simulacion de examen',
        noExams: 'Aun no hay simulacros listos para este curso.',
        available: 'Disponibles',
        simulations: 'Simulaciones',
        bestScore: 'Mejor puntaje',
        lastScore: 'Ultimo puntaje',
        openPlayer: 'Abrir simulacros',
      },
    },
    noCoursesTitle: 'Inscríbete en tu primer curso',
    noCoursesBody:
      'Los cursos publicados en los que te inscribas aparecerán aquí con progreso, tareas, práctica y contexto del tutor de IA.',
    noHomework: 'No hay tareas próximas.',
    noPractice: 'Todavía no hay preguntas de práctica listas para este curso.',
    noNotes: 'Aún no hay notas.',
    noStudyPlan: 'Aún no hay elementos en el plan de estudio.',
    emptyPracticeAttempt:
      'Inicia una sesión de práctica para responder preguntas del curso.',
    noteTitlePlaceholder: 'Título de la nota',
    noteContentPlaceholder: '¿Qué quieres recordar?',
    studyPlanTitlePlaceholder: 'Tarea de estudio',
    studyPlanDescriptionPlaceholder: 'Detalles opcionales',
    plannedForDate: 'Fecha planificada',
    answerOptions: 'Opciones de respuesta',
    selectedAnswer: 'Respuesta seleccionada',
    correctAnswer: 'Respuesta correcta',
    explanation: 'Explicación',
    score: '{0}%',
    lessonsProgress: '{0} de {1} lecciones completadas',
    answeredProgress: '{0} de {1} respondidas',
    homeworkProgress: '{0} completas • {1} abiertas',
    practiceAccuracy: '{0}% de precisión',
    attemptsCount: '{0} intento(s)',
    availableQuestionCount: '{0} pregunta(s) disponible(s)',
    nextAction: {
      lesson: 'Continuar {0}',
      homework: 'Terminar tarea: {0}',
      practice: 'Practicar {0}',
      none: 'Explorar cursos',
    },
    homeworkStatus: {
      open: 'Abierta',
      dueSoon: 'Vence pronto',
      overdue: 'Vencida',
      submitted: 'Enviada',
      complete: 'Completa',
      needsRevision: 'Necesita revisión',
    },
    practiceStatus: {
      active: 'En progreso',
      completed: 'Completada',
    },
    signals: {
      courseProgress: 'Progreso del curso',
      homework: 'Tareas',
      practice: 'Práctica',
      exam: 'Intentos de examen',
      recentActivity: 'Actividad reciente',
    },
    suggestions: {
      lesson: 'Repasar lección: {0}',
      homework: 'Trabajar en la tarea: {0}',
      practice: 'Preguntas de práctica para {0}',
    },
    aiPrompts: [
      'Explica mi próxima lección',
      'Hazme un cuestionario de este curso',
      'Crea un plan de estudio',
    ],
    success: {
      noteSaved: 'Nota guardada.',
      studyPlanSaved: 'Elemento del plan de estudio guardado.',
      studyPlanUpdated: 'Plan de estudio actualizado.',
      adaptivePlanGenerated: 'Plan de estudio adaptativo actualizado.',
      diagnosticStarted: 'Diagnostico iniciado.',
      diagnosticCompleted: 'Diagnostico completado.',
      flashcardReviewed: 'Repaso de tarjeta guardado.',
      remediationGenerated: 'Plan de remediacion agregado.',
      answerSaved: 'Respuesta guardada.',
      practiceCompleted: 'Práctica completada.',
    },
    errors: {
      noPractice:
        'No hay preguntas de práctica disponibles para responder en este curso.',
      practiceComplete: 'Este intento de práctica ya está completo.',
      invalidAnswer: 'Elige una opción de respuesta válida.',
      diagnosticIncomplete:
        'Responde todas las preguntas del diagnostico antes de completarlo.',
    },
  },

  auth: {
    layout: {
      brandName: 'NexExam',
      heroTitle: 'Desbloquea tu aprendizaje espacial.',
      heroSubtitle:
        'La próxima generación de educación, creada para la web espacial. Más inteligente, intuitiva y completamente tuya.',
      authTabsLabel: 'Opciones de autenticación',
      aiTutorTitle: 'Tutor de IA',
      aiTutorDescription: 'Siempre disponible',
      flowStateTitle: 'Estado de concentración',
      flowStateDescription: 'Sin distracciones',
      insightsTitle: 'Información',
      insightsDescription: 'Métricas en tiempo real',
      secureFooter: 'Protegido con cifrado avanzado.',
    },
    signIn: {
      oauthError:
        'No es posible iniciar sesión con este proveedor. Por favor use otro.',
      title: 'Iniciar sesión',
      cardTitle: 'Bienvenido de nuevo',
      cardSubtitle: 'Ingresa tus datos para acceder a tu panel.',
      menu: 'Iniciar sesión',
      button: 'Iniciar sesión con correo',
      success: 'Sesión iniciada exitosamente',
      signingIn: 'Iniciando sesión...',
      email: 'Correo',
      password: 'Contraseña',
      socialHeader: 'O continuar con',
      google: 'Google',
      passwordResetRequestLink: '¿Olvidó su contraseña?',
      signUpLink: `¿No tiene cuenta? Crear una`,
      studentSignUpLink: `¿Necesitas una cuenta de estudiante? Regístrate como estudiante`,
      creatorSignUpLink: `¿Quieres enseñar? Regístrate como creador`,
    },
    signUp: {
      title: 'Registrarse',
      menu: 'Registrarse',
      studentMenu: 'Registro de estudiante',
      creatorMenu: 'Registro de creador',
      studentTab: 'Estudiante',
      creatorTab: 'Creador',
      studentTitle: 'Registro de estudiante',
      creatorTitle: 'Registro de creador',
      studentCardTitle: 'Únete como estudiante',
      creatorCardTitle: 'Únete como creador',
      cardSubtitle: 'Crea una cuenta para comenzar tu camino.',
      studentSubtitle:
        'Inscríbete en cursos de preparación, completa lecciones, entrega tareas y estudia con apoyo de IA.',
      creatorSubtitle:
        'Solicita convertirte en profesor verificado y prepárate para publicar cursos de NexExam después de la aprobación.',
      signInLink: '¿Ya tiene cuenta? Iniciar sesión',
      button: 'Registrarse',
      success: 'Registro exitoso',
      email: 'Correo',
      password: 'Contraseña',
      invitationEmailLocked:
        'Este correo está bloqueado porque se está registrando mediante invitación.',
    },
    verifyEmailRequest: {
      title: 'Reenviar verificación de correo',
      button: 'Reenviar verificación de correo',
      message:
        'Por favor confirme su correo en <strong>{0}</strong> para continuar.',
      success: '¡Verificación de correo enviada exitosamente!',
      noEmail:
        'No se proporcionó dirección de correo. Por favor regístrese o inicie sesión.',
    },
    verifyEmailConfirm: {
      title: 'Verificar correo',
      success: 'Correo verificado exitosamente.',
      loadingMessage: 'Un momento, su correo está siendo verificado...',
    },
    passwordResetRequest: {
      title: 'Contraseña olvidada',
      signInLink: 'Cancelar',
      button: 'Enviar correo de restablecimiento',
      email: 'Correo',
      success: 'Correo de restablecimiento enviado exitosamente',
    },
    passwordResetConfirm: {
      title: 'Restablecer contraseña',
      signInLink: 'Cancelar',
      button: 'Restablecer contraseña',
      password: 'Contraseña',
      success: 'Contraseña cambiada exitosamente',
    },
    noPermissions: {
      title: 'Sin permisos',
      message:
        'Aún no tiene permisos. Por favor espere a que el administrador le otorgue privilegios.',
    },
    invitation: {
      title: 'Invitación',
      success: 'Invitación aceptada exitosamente',
      loadingMessage: 'Un momento, estamos aceptando la invitación...',
      invalidToken: 'Token de invitación expirado o inválido.',
      errors: {
        INVITATION_EMAIL_MISMATCH:
          'Esta invitación fue enviada a otra dirección de correo. Por favor inicie sesión con la cuenta correcta.',
        INVITATION_EXPIRED: 'Esta invitación ha expirado',
        INVITATION_NOT_PENDING:
          'Esta invitación ya ha sido aceptada o cancelada',
      },
    },
    organization: {
      title: 'Organización',
      create: {
        name: 'Nombre de la organización',
        success: 'Organización creada exitosamente',
        button: 'Crear organización',
      },
      select: {
        organization: 'Seleccionar una organización',
        joinSuccess: 'Organización unida exitosamente',
        select: 'Seleccionar organización',
        continue: 'Continuar',
        autoSelecting: 'Seleccionando organización...',
      },
      invitationAccepted: 'Invitación aceptada exitosamente',
      invitationAcceptError: 'Fallo al aceptar invitación',
      acceptingInvitation: 'Aceptando invitación...',
      invitationRejected: 'Invitación rechazada',
      invitationRejectError: 'Fallo al rechazar invitación',
      rejectingInvitation: 'Rechazando invitación...',
      rejectInvitation: 'Rechazar',
      rejectInvitationTitle: '¿Rechazar invitación?',
      rejectInvitationDescription:
        '¿Está seguro de que desea rechazar esta invitación? Esta acción no se puede deshacer.',
      invitations: 'Invitaciones',
      pendingInvitation: 'Invitación pendiente',
    },
    passwordChange: {
      title: 'Cambiar contraseña',
      menu: 'Cambiar contraseña',
      oldPassword: 'Contraseña anterior',
      newPassword: 'Nueva contraseña',
      newPasswordConfirmation: 'Confirmación de nueva contraseña',
      button: 'Guardar contraseña',
      success: 'Contraseña guardada exitosamente',
      mustMatch: 'Las contraseñas deben coincidir',
      cancel: 'Cancelar',
    },
    emailChange: {
      title: 'Cambiar correo',
      menu: 'Cambiar correo',
      newEmail: 'Nuevo correo',
      button: 'Cambiar correo',
      success:
        'Correo de verificación enviado. Revise su correo actual para aprobar.',
      confirmSuccess: 'Correo cambiado exitosamente',
      confirmStepTwo:
        'Enviamos un correo de verificación a <strong>{0}</strong>. Revise su bandeja de entrada para completar el cambio.',
      cancel: 'Cancelar',
      loadingMessage:
        'Un momento, su cambio de correo está siendo confirmado...',
    },
    emailChangeConfirm: {
      title: 'Confirmar cambio de correo',
      confirmSuccess: 'Correo cambiado exitosamente',
      loadingMessage:
        'Un momento, su cambio de correo está siendo confirmado...',
    },
    profile: {
      title: 'Perfil',
      menu: 'Perfil',
      email: 'Correo actual',
      firstName: 'Nombre',
      lastName: 'Apellido',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Habilitar notificaciones',
      isNotificationsEnabledHint:
        'Recibir notificaciones por correo y push para actualizaciones y actividades importantes en su organización',
      button: 'Guardar perfil',
      success: 'Perfil guardado exitosamente',
      cancel: 'Cancelar',
    },
    profileOnboard: {
      firstName: 'Nombre',
      lastName: 'Apellido',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Habilitar notificaciones',
      isNotificationsEnabledHint:
        'Recibir notificaciones por correo y push para actualizaciones y actividades importantes',
      button: 'Guardar perfil',
      success: 'Perfil guardado exitosamente',
    },
    signOut: {
      menu: 'Cerrar sesión',
      button: 'Cerrar sesión',
      title: 'Cerrar sesión',
      loading: `Cerrando sesión...`,
    },
    errors: {
      invalidPasswordResetToken:
        'El enlace de restablecimiento de contraseña es inválido o ha expirado',
      invalidVerifyEmailToken:
        'El enlace de verificación de correo es inválido o ha expirado',

      USER_NOT_FOUND: 'Usuario no encontrado',
      FAILED_TO_CREATE_USER: 'Fallo al crear usuario',
      FAILED_TO_CREATE_SESSION: 'Fallo al crear sesión',
      FAILED_TO_UPDATE_USER: 'Fallo al actualizar usuario',
      FAILED_TO_GET_SESSION: 'Fallo al obtener sesión',
      INVALID_PASSWORD: 'Contraseña inválida',
      INVALID_EMAIL: 'Correo inválido',
      INVALID_EMAIL_OR_PASSWORD: 'Correo o contraseña inválido',
      SOCIAL_ACCOUNT_ALREADY_LINKED: 'Cuenta social ya vinculada',
      PROVIDER_NOT_FOUND: 'Proveedor no encontrado',
      INVALID_TOKEN: 'Token inválido',
      ID_TOKEN_NOT_SUPPORTED: 'Token de ID no soportado',
      FAILED_TO_GET_USER_INFO: 'Fallo al obtener información del usuario',
      USER_EMAIL_NOT_FOUND: 'Correo de usuario no encontrado',
      EMAIL_NOT_VERIFIED: 'Correo no verificado',
      CANNOT_REMOVE_ADMIN_WITH_SUBSCRIPTION:
        'No se puede eliminar administrador o remover rol de administrador mientras la organización tiene una suscripción activa',
      CANNOT_REMOVE_SELF: 'No puede removerse a sí mismo de la organización',
      PASSWORD_TOO_SHORT: 'Contraseña demasiado corta',
      PASSWORD_TOO_LONG: 'Contraseña demasiado larga',
      USER_ALREADY_EXISTS: 'El usuario ya existe',
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        'El usuario ya existe. Use otro correo',
      EMAIL_CAN_NOT_BE_UPDATED: 'El correo no puede ser actualizado',
      CREDENTIAL_ACCOUNT_NOT_FOUND: 'Cuenta de credencial no encontrada',
      SESSION_EXPIRED: 'Sesión expirada',
      FAILED_TO_UNLINK_LAST_ACCOUNT: 'Fallo al desvincular última cuenta',
      ACCOUNT_NOT_FOUND: 'Cuenta no encontrada',
      USER_ALREADY_HAS_PASSWORD: 'El usuario ya tiene contraseña',
      INVALID_METADATA_TYPE: 'Tipo de metadatos inválido',
      REFILL_AMOUNT_AND_INTERVAL_REQUIRED:
        'Se requiere monto e intervalo de recarga',
      REFILL_INTERVAL_AND_AMOUNT_REQUIRED:
        'Se requiere intervalo y monto de recarga',
      USER_BANNED: 'Usuario baneado',
      UNAUTHORIZED_SESSION: 'Sesión no autorizada',
      KEY_NOT_FOUND: 'Clave no encontrada',
      KEY_DISABLED: 'Clave deshabilitada',
      KEY_EXPIRED: 'Clave expirada',
      USAGE_EXCEEDED: 'Uso excedido',
      KEY_NOT_RECOVERABLE: 'Clave no recuperable',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION:
        'No está autorizado a crear una nueva organización',
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS:
        'Ha alcanzado el número máximo de organizaciones',
      ORGANIZATION_ALREADY_EXISTS: 'La organización ya existe',
      ORGANIZATION_NOT_FOUND: 'Organización no encontrada',
      USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION:
        'El usuario no es miembro de la organización',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION:
        'No está autorizado a actualizar esta organización',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION:
        'No está autorizado a eliminar esta organización',
      NO_ACTIVE_ORGANIZATION: 'No hay organización activa',
      USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION:
        'El usuario ya es miembro de esta organización',
      MEMBER_NOT_FOUND: 'Miembro no encontrado',
      ROLE_NOT_FOUND: 'Rol no encontrado',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM:
        'No está autorizado a crear un nuevo equipo',
      TEAM_ALREADY_EXISTS: 'El equipo ya existe',
      TEAM_NOT_FOUND: 'Equipo no encontrado',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER:
        'No puede abandonar la organización como único administrador',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER:
        'No puede abandonar la organización sin un propietario',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER:
        'No está autorizado a eliminar este miembro',
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION:
        'No está autorizado a invitar usuarios a esta organización',
      USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION:
        'El usuario ya está invitado a esta organización',
      INVITATION_NOT_FOUND: 'Invitación no encontrada',
      INVITATION_EMAIL_MISMATCH:
        'Esta invitación fue enviada a otra dirección de correo. Por favor inicie sesión con la cuenta correcta.',
      INVITATION_EXPIRED: 'Esta invitación ha expirado',
      INVITATION_NOT_PENDING: 'Esta invitación ya ha sido aceptada o cancelada',
      YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION:
        'No es el destinatario de la invitación',
      EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION:
        'Se requiere verificación de correo antes de aceptar o rechazar la invitación',
      YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION:
        'No está autorizado a cancelar esta invitación',
      INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION:
        'El invitador ya no es miembro de la organización',
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE:
        'No está autorizado a invitar usuario con este rol',
      FAILED_TO_RETRIEVE_INVITATION: 'Fallo al recuperar invitación',
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS:
        'Ha alcanzado el número máximo de equipos',
      UNABLE_TO_REMOVE_LAST_TEAM: 'No se puede remover el último equipo',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER:
        'No está autorizado a actualizar este miembro',
      ORGANIZATION_MEMBERSHIP_LIMIT_REACHED:
        'Límite de membresía de organización alcanzado',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION:
        'No está autorizado a crear equipos en esta organización',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION:
        'No está autorizado a eliminar equipos en esta organización',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM:
        'No está autorizado a actualizar este equipo',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM:
        'No está autorizado a eliminar este equipo',
      INVITATION_LIMIT_REACHED: 'Límite de invitaciones alcanzado',
      YOU_CANNOT_BAN_YOURSELF: 'No puede banearse a sí mismo',
      YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE:
        'No está autorizado a cambiar el rol de usuarios',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS:
        'No está autorizado a crear usuarios',
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: 'No está autorizado a listar usuarios',
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS:
        'No está autorizado a listar sesiones de usuarios',
      YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: 'No está autorizado a banear usuarios',
      YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS:
        'No está autorizado a suplantar usuarios',
      YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS:
        'No está autorizado a revocar sesiones de usuarios',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS:
        'No está autorizado a eliminar usuarios',
      YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD:
        'No está autorizado a establecer contraseña de usuarios',
      BANNED_USER: 'Ha sido baneado de esta aplicación',
      YOU_ARE_NOT_ALLOWED_TO_GET_USER: 'No está autorizado a obtener usuario',
      NO_DATA_TO_UPDATE: 'No hay datos para actualizar',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS:
        'No está autorizado a actualizar usuarios',
      YOU_CANNOT_REMOVE_YOURSELF: 'No puede removerse a sí mismo',
      COULD_NOT_CREATE_SESSION: 'No se pudo crear sesión',
      ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY:
        'Los usuarios anónimos no pueden iniciar sesión nuevamente de forma anónima',
      CHALLENGE_NOT_FOUND: 'Desafío no encontrado',
      YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY:
        'No está autorizado a registrar esta llave de acceso',
      FAILED_TO_VERIFY_REGISTRATION: 'Fallo al verificar registro',
      PASSKEY_NOT_FOUND: 'Llave de acceso no encontrada',
      AUTHENTICATION_FAILED: 'Autenticación fallida',
      UNABLE_TO_CREATE_SESSION: 'No se puede crear sesión',
      FAILED_TO_UPDATE_PASSKEY: 'Fallo al actualizar llave de acceso',
      INVALID_PHONE_NUMBER: 'Número de teléfono inválido',
      PHONE_NUMBER_EXIST: 'El número de teléfono existe',
      INVALID_PHONE_NUMBER_OR_PASSWORD:
        'Número de teléfono o contraseña inválido',
      UNEXPECTED_ERROR: 'Error inesperado',
      OTP_NOT_FOUND: 'OTP no encontrado',
      OTP_EXPIRED: 'OTP expirado',
      INVALID_OTP: 'OTP inválido',
      PHONE_NUMBER_NOT_VERIFIED: 'Número de teléfono no verificado',
      INVALID_DEVICE_CODE: 'Código de dispositivo inválido',
      EXPIRED_DEVICE_CODE: 'Código de dispositivo expirado',
      EXPIRED_USER_CODE: 'Código de usuario expirado',
      AUTHORIZATION_PENDING: 'Autorización pendiente',
      ACCESS_DENIED: 'Acceso denegado',
      INVALID_USER_CODE: 'Código de usuario inválido',
      DEVICE_CODE_ALREADY_PROCESSED: 'Código de dispositivo ya procesado',
      POLLING_TOO_FREQUENTLY: 'Consultando demasiado frecuentemente',
      INVALID_DEVICE_CODE_STATUS: 'Estado de código de dispositivo inválido',
      AUTHENTICATION_REQUIRED: 'Autenticación requerida',
      OTP_NOT_ENABLED: 'OTP no habilitado',
      OTP_HAS_EXPIRED: 'OTP ha expirado',
      TOTP_NOT_ENABLED: 'TOTP no habilitado',
      TWO_FACTOR_NOT_ENABLED: 'Autenticación de dos factores no habilitada',
      BACKUP_CODES_NOT_ENABLED: 'Códigos de respaldo no habilitados',
      INVALID_BACKUP_CODE: 'Código de respaldo inválido',
      INVALID_CODE: 'Código inválido',
      TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE:
        'Demasiados intentos. Solicitar nuevo código',
      INVALID_TWO_FACTOR_COOKIE: 'Cookie de dos factores inválida',
      INVALID_USERNAME_OR_PASSWORD: 'Nombre de usuario o contraseña inválido',
      USERNAME_IS_ALREADY_TAKEN: 'El nombre de usuario ya está en uso',
      USERNAME_TOO_SHORT: 'Nombre de usuario demasiado corto',
      USERNAME_TOO_LONG: 'Nombre de usuario demasiado largo',
      INVALID_USERNAME: 'Nombre de usuario inválido',
      INVALID_DISPLAY_USERNAME: 'Nombre de usuario para mostrar inválido',
      TOO_MANY_ATTEMPTS: 'Demasiados intentos',
      PASSWORD_COMPROMISED: 'Contraseña comprometida',
      INVALID_OAUTH_CONFIGURATION: 'Configuración OAuth inválida',
      INVALID_SESSION_TOKEN: 'Token de sesión inválido',

      EXPIRES_IN_IS_TOO_SMALL:
        'La fecha de expiración es menor que el valor mínimo predefinido.',
      EXPIRES_IN_IS_TOO_LARGE:
        'La fecha de expiración es mayor que el valor máximo predefinido.',
      INVALID_REMAINING:
        'El conteo restante es demasiado grande o demasiado pequeño.',
      INVALID_PREFIX_LENGTH:
        'La longitud del prefijo es demasiado grande o demasiado pequeña.',
      INVALID_NAME_LENGTH:
        'La longitud del nombre es demasiado grande o demasiado pequeña.',
      METADATA_DISABLED: 'Los metadatos están deshabilitados.',
      RATE_LIMIT_EXCEEDED: 'Límite de tasa excedido.',
      NO_VALUES_TO_UPDATE: 'No hay valores para actualizar.',
      KEY_DISABLED_EXPIRATION:
        'Los valores de expiración de clave personalizada están deshabilitados.',
      INVALID_API_KEY: 'Clave API inválida.',
      INVALID_USER_ID_FROM_API_KEY:
        'El ID de usuario de la clave API es inválido.',
      INVALID_API_KEY_GETTER_RETURN_TYPE:
        'El getter de clave API devolvió un tipo de clave inválido. Se esperaba cadena.',
      SERVER_ONLY_PROPERTY:
        'La propiedad que está intentando establecer solo se puede establecer desde la instancia de autenticación del servidor únicamente.',
      FAILED_TO_UPDATE_API_KEY: 'Fallo al actualizar clave API',
      NAME_REQUIRED: 'Se requiere nombre de clave API.',
    },
  },

  organization: {
    switcher: {
      title: 'Organizaciones',
      create: 'Crear organización',
      leave: 'Abandonar organización',
      leaveConfirmTitle: '¿Abandonar organización?',
      leaveConfirmDescription:
        '¿Está seguro de que desea abandonar {0}? Perderá acceso a todos los recursos en esta organización.',
      leaveSuccess: 'Organización abandonada exitosamente',
      leaveError: 'Fallo al abandonar organización',
    },

    invitation: {
      title: `Aceptar invitación a {0}`,
      message: `Ha sido invitado a {0}. Puede elegir aceptar o rechazar.`,
    },

    applicationSettings: {
      menu: 'Configuración de la aplicación',
    },

    form: {
      name: 'Nombre',
      subdomain: 'Subdominio',
      domain: 'Dominio',
      slugPlaceholderDomain: 'organizacion.com',
      slugPlaceholderSubdomain: 'organizacion',
      slugInvalidSubdomain:
        'El subdominio debe contener solo letras minúsculas, números y guiones. No puede comenzar o terminar con un guion.',
      slugInvalidDomain:
        'El dominio debe ser un formato válido (ej. ejemplo.com). Debe contener al menos un punto y solo puede contener letras minúsculas, números, guiones y puntos.',
      slugReserved:
        'Este slug está reservado para la aplicación y no puede ser usado',
      logoLight: 'Logo (Modo claro)',
      logoDark: 'Logo (Modo oscuro)',
      backgroundImageLight: 'Imagen de fondo (Modo claro)',
      backgroundImageDark: 'Imagen de fondo (Modo oscuro)',

      new: {
        title: 'Crear organización',
        success: 'Organización creada exitosamente',
      },

      edit: {
        title: 'Editar organización',
        success: 'Organización actualizada exitosamente',
      },
    },

    delete: {
      success: 'Organización eliminada exitosamente',
      confirmTitle: '¿Eliminar organización?',
      confirmDescription:
        '¿Está seguro de que desea eliminar la organización {0}? ¡Esta acción es irreversible!',
    },

    errors: {
      notFound: 'Organización no encontrada',
      createFailed: 'Fallo al crear organización',
      updateFailed: 'Fallo al actualizar organización',
      deleteFailed: 'Fallo al eliminar organización',
      leaveFailed: 'Fallo al abandonar organización',
      setActiveFailed: 'Fallo al establecer organización activa',
    },
  },

  member: {
    dashboardCard: {
      title: 'Usuarios',
    },

    view: {
      title: 'Ver usuario',
    },

    showActivity: 'Actividad',

    list: {
      menu: 'Usuarios',
      title: 'Usuarios',
      noResults: 'No se encontraron usuarios.',
      empty: 'Aún no ha creado usuarios. Comience creando su primer usuario.',
    },

    importer: {
      title: 'Importar usuarios',
      menu: 'Importar usuarios',
    },

    export: {
      success: 'Usuarios exportados exitosamente',
    },

    edit: {
      menu: 'Editar usuario',
      title: 'Editar usuario',
      success: 'Usuario actualizado exitosamente',
    },

    new: {
      menu: 'Invitar usuario',
      title: 'Invitar usuario',
      success: 'Usuario invitado exitosamente',
    },

    deleteMany: {
      success: 'Usuario(s) eliminado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un usuario para eliminar.',
      confirmTitle: '¿Eliminar usuario(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} usuario(s) seleccionado(s)?',
    },

    delete: {
      success: 'Usuario eliminado exitosamente',
      confirmTitle: '¿Eliminar usuario?',
    },

    fields: {
      avatars: 'Avatar',
      fullName: 'Nombre completo',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo',
      role: 'Rol',
      roles: 'Roles',
      status: 'Estado',
      createdAt: 'Creado el',
      createdByMember: 'Creado por',
      updatedAt: 'Actualizado el',
      updatedByMember: 'Actualizado por',
    },

    enumerators: {
      roles: {
        admin: 'Administrador',
        member: 'Miembro',
      },
      status: {
        active: 'Activo',
        disabled: 'Deshabilitado',
      },
    },

    errors: {
      cannotRemoveSelfAdminRole:
        'No puede remover su propio rol de administrador',
      cannotRemoveSelf: 'No puede removerse a sí mismo de la organización',
      notFound: 'Usuario no encontrado',
      disabledMemberNotFound: 'Miembro deshabilitado no encontrado',
      removeFailed: 'Fallo al remover usuario',
      disableFailed: 'Fallo al deshabilitar usuario',
    },

    mcpDescription: {
      list: 'Recuperar lista de todos los miembros en la organización actual. Soporta filtrado por nombre, correo y rol. Devuelve perfiles de miembros incluyendo su información de usuario, rol, estado y avatar.',
      get: 'Obtener información detallada sobre un miembro específico por su ID único. Devuelve el perfil completo del miembro incluyendo datos de usuario asociados y detalles de organización.',
      autocomplete:
        'Buscar miembros para usar en campos de autocompletado. Devuelve una lista simplificada de miembros que coinciden con la consulta, útil para asignar tareas, relaciones o permisos.',
      update:
        'Actualizar registro de miembro existente con nueva información. Permite modificación de campos de miembro incluyendo nombre, apellido, rol y avatar. Rastrea automáticamente la actualización en registros de auditoría. Previene que miembros remuevan su propio rol de administrador.',
      disable:
        'Deshabilitar cuenta de miembro temporalmente. El miembro ya no podrá acceder a la organización pero sus datos se preservan. Puede revertirse usando la operación de restaurar.',
      restore:
        'Restaurar cuenta de miembro previamente deshabilitada. El miembro recuperará acceso a la organización con su rol y permisos previos.',
      remove:
        'Remover permanentemente un miembro de la organización. Esta acción no se puede deshacer. La cuenta de usuario del miembro es eliminada y todos los datos asociados son removidos.',
    },
  },

  invitation: {
    list: {
      title: 'Invitaciones',
      noResults: 'No se encontraron invitaciones.',
    },

    view: {
      title: 'Ver invitación',
    },

    resend: {
      success: 'Invitación reenviada exitosamente',
    },

    cancel: {
      success: 'Invitación cancelada exitosamente',
      confirmTitle: '¿Está seguro de que desea cancelar esta invitación?',
    },

    actions: {
      resend: 'Reenviar',
      cancel: 'Cancelar',
    },

    fields: {
      email: 'Correo',
      role: 'Rol',
      status: 'Estado',
      expiresAt: 'Expira el',
      invitedBy: 'Invitado por',
      createdAt: 'Creado el',
    },

    enumerators: {
      status: {
        pending: 'Pendiente',
        accepted: 'Aceptado',
        rejected: 'Rechazado',
        expired: 'Expirado',
        cancelled: 'Cancelado',
      },
    },

    errors: {
      alreadyProcessed: 'La invitación ya ha sido procesada',
      notFound: 'Invitación no encontrada',
      acceptFailed: 'Fallo al aceptar invitación',
      rejectFailed: 'Fallo al rechazar invitación',
      cancelFailed: 'Fallo al cancelar invitación',
      createFailed: 'Fallo al crear invitación',
      resendFailed: 'Fallo al reenviar invitación',
    },

    cancelMany: {
      success: 'Invitaciones canceladas exitosamente',
      noSelection: 'Por favor seleccione al menos una invitación',
      confirmTitle: '¿Cancelar invitaciones?',
      confirmDescription:
        '¿Está seguro de que desea cancelar {0} invitación(es)?',
    },

    resendMany: {
      success: 'Invitaciones reenviadas exitosamente',
      noSelection: 'Por favor seleccione al menos una invitación',
      confirmTitle: '¿Reenviar invitaciones?',
      confirmDescription:
        '¿Está seguro de que desea reenviar {0} invitación(es)?',
    },

    export: {
      success: 'Invitaciones exportadas exitosamente',
    },
  },

  subscription: {
    menu: 'Suscripción',
    title: 'Planes y precios',

    subscribe: 'Suscribirse',
    manage: 'Gestionar',
    notPlanUser: 'No es el gestor de esta suscripción.',
    cancelAt: 'Su suscripción será cancelada el',
    currentPlan: 'Plan actual:',
    unknown: 'Desconocido',
    noPlansAvailable: 'No hay planes de suscripción disponibles.',
    current: 'Actual',
    mobileUnavailableTitle: 'Suscripciones no disponibles',
    mobileUnavailable:
      'Las suscripciones no están disponibles en móvil. Por favor visite nuestro sitio web en un navegador de escritorio para gestionar su suscripción.',

    intervals: {
      day: 'Diario',
      week: 'Semanal',
      month: 'Mensual',
      year: 'Anual',
    },

    errors: {
      disabled: 'Las suscripciones están deshabilitadas en esta plataforma',
      alreadyExistsActive: 'Ya existe una suscripción activa',
      stripeNotConfigured: 'Faltan variables ENV de Stripe',
    },

    mcpDescription: {
      checkout:
        'Crear sesión de pago Stripe para suscribirse a un plan de precios. Proporcione el ID de precio Stripe y el sistema generará una URL de pago donde los usuarios pueden completar el pago. Devuelve la URL de sesión de pago.',
      portal:
        'Generar URL del portal de cliente Stripe donde los usuarios pueden gestionar su suscripción, actualizar métodos de pago, ver facturas y cancelar su suscripción. Requiere una suscripción activa.',
      plans:
        'Recuperar todos los planes de suscripción disponibles desde Stripe. Devuelve una lista de planes con información de precios, características, intervalos de facturación y estado de disponibilidad. Incluye planes activos y archivados.',
    },
  },
  exam: {
    dashboardCard: {
      title: 'Exams',
    },

    list: {
      menu: 'Exams',
      title: 'Exams',
      noResults: 'No se encontraron exams.',
      empty: 'Aún no ha creado exams. Comience creando su primer exam.',
    },

    importer: {
      title: 'Importar exams',
      menu: 'Importar exams',
    },

    export: {
      success: 'Exams exportados exitosamente',
    },

    new: {
      menu: 'Nuevo exam',
      title: 'Nuevo exam',
      success: 'Exam creado exitosamente',
    },

    view: {
      title: 'Ver exam',
    },

    edit: {
      menu: 'Editar exam',
      title: 'Editar exam',
      success: 'Exam actualizado exitosamente',
    },

    restore: {
      success: 'Exam restaurado exitosamente',
      confirmTitle: '¿Restaurar exam?',
    },

    restoreMany: {
      success: 'Exam(s) restaurado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam para restaurar.',
      confirmTitle: '¿Restaurar exam(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} exam(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Exam(s) archivado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam para archivar.',
      confirmTitle: '¿Archivar exam(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} exam(s) seleccionado(s)?',
    },

    archive: {
      success: 'Exam archivado exitosamente',
      confirmTitle: '¿Archivar exam?',
    },

    deleteMany: {
      success: 'Exam(s) eliminado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam para eliminar.',
      confirmTitle: '¿Eliminar exam(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} exam(s) seleccionado(s)?',
    },

    delete: {
      success: 'Exam eliminado exitosamente',
      confirmTitle: '¿Eliminar exam?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de exams con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de exams incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un exam específico por su ID único. Devuelve perfil completo del exam incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de exam con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de exam existente con nueva información. Permite modificación de todos los campos de exam incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más exams del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de exam y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más exams para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los exams archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar exams previamente archivados de vuelta a estado activo. Hace los exams visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de exams para entradas de autocompletado. Devuelve una lista simplificada de exams que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
    },
  },
  chapter: {
    dashboardCard: {
      title: 'Chapters',
    },

    list: {
      menu: 'Chapters',
      title: 'Chapters',
      noResults: 'No se encontraron chapters.',
      empty: 'Aún no ha creado chapters. Comience creando su primer chapter.',
    },

    importer: {
      title: 'Importar chapters',
      menu: 'Importar chapters',
    },

    export: {
      success: 'Chapters exportados exitosamente',
    },

    new: {
      menu: 'Nuevo chapter',
      title: 'Nuevo chapter',
      success: 'Chapter creado exitosamente',
    },

    view: {
      title: 'Ver chapter',
    },

    edit: {
      menu: 'Editar chapter',
      title: 'Editar chapter',
      success: 'Chapter actualizado exitosamente',
    },

    restore: {
      success: 'Chapter restaurado exitosamente',
      confirmTitle: '¿Restaurar chapter?',
    },

    restoreMany: {
      success: 'Chapter(s) restaurado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un chapter para restaurar.',
      confirmTitle: '¿Restaurar chapter(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} chapter(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Chapter(s) archivado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un chapter para archivar.',
      confirmTitle: '¿Archivar chapter(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} chapter(s) seleccionado(s)?',
    },

    archive: {
      success: 'Chapter archivado exitosamente',
      confirmTitle: '¿Archivar chapter?',
    },

    deleteMany: {
      success: 'Chapter(s) eliminado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un chapter para eliminar.',
      confirmTitle: '¿Eliminar chapter(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} chapter(s) seleccionado(s)?',
    },

    delete: {
      success: 'Chapter eliminado exitosamente',
      confirmTitle: '¿Eliminar chapter?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de chapters con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de chapters incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un chapter específico por su ID único. Devuelve perfil completo del chapter incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de chapter con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de chapter existente con nueva información. Permite modificación de todos los campos de chapter incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más chapters del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de chapter y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más chapters para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los chapters archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar chapters previamente archivados de vuelta a estado activo. Hace los chapters visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de chapters para entradas de autocompletado. Devuelve una lista simplificada de chapters que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
    },
  },
  lesson: {
    dashboardCard: {
      title: 'Lessons',
    },

    list: {
      menu: 'Lessons',
      title: 'Lessons',
      noResults: 'No se encontraron lessons.',
      empty: 'Aún no ha creado lessons. Comience creando su primer lesson.',
    },

    importer: {
      title: 'Importar lessons',
      menu: 'Importar lessons',
    },

    export: {
      success: 'Lessons exportados exitosamente',
    },

    new: {
      menu: 'Nuevo lesson',
      title: 'Nuevo lesson',
      success: 'Lesson creado exitosamente',
    },

    view: {
      title: 'Ver lesson',
    },

    edit: {
      menu: 'Editar lesson',
      title: 'Editar lesson',
      success: 'Lesson actualizado exitosamente',
    },

    restore: {
      success: 'Lesson restaurado exitosamente',
      confirmTitle: '¿Restaurar lesson?',
    },

    restoreMany: {
      success: 'Lesson(s) restaurado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un lesson para restaurar.',
      confirmTitle: '¿Restaurar lesson(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} lesson(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Lesson(s) archivado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un lesson para archivar.',
      confirmTitle: '¿Archivar lesson(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} lesson(s) seleccionado(s)?',
    },

    archive: {
      success: 'Lesson archivado exitosamente',
      confirmTitle: '¿Archivar lesson?',
    },

    deleteMany: {
      success: 'Lesson(s) eliminado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un lesson para eliminar.',
      confirmTitle: '¿Eliminar lesson(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} lesson(s) seleccionado(s)?',
    },

    delete: {
      success: 'Lesson eliminado exitosamente',
      confirmTitle: '¿Eliminar lesson?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de lessons con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de lessons incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un lesson específico por su ID único. Devuelve perfil completo del lesson incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de lesson con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de lesson existente con nueva información. Permite modificación de todos los campos de lesson incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más lessons del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de lesson y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más lessons para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los lessons archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar lessons previamente archivados de vuelta a estado activo. Hace los lessons visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de lessons para entradas de autocompletado. Devuelve una lista simplificada de lessons que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
    },
  },
  practiceQuestion: {
    dashboardCard: {
      title: 'Practice Questions',
    },

    list: {
      menu: 'Practice Questions',
      title: 'Practice Questions',
      noResults: 'No se encontraron practice questions.',
      empty:
        'Aún no ha creado practice questions. Comience creando su primer practice question.',
    },

    importer: {
      title: 'Importar practice questions',
      menu: 'Importar practice questions',
    },

    export: {
      success: 'Practice Questions exportados exitosamente',
    },

    new: {
      menu: 'Nuevo practice question',
      title: 'Nuevo practice question',
      success: 'Practice Question creado exitosamente',
    },

    view: {
      title: 'Ver practice question',
    },

    edit: {
      menu: 'Editar practice question',
      title: 'Editar practice question',
      success: 'Practice Question actualizado exitosamente',
    },

    restore: {
      success: 'Practice Question restaurado exitosamente',
      confirmTitle: '¿Restaurar practice question?',
    },

    restoreMany: {
      success: 'Practice Question(s) restaurado(s) exitosamente',
      noSelection:
        'Debe seleccionar al menos un practice question para restaurar.',
      confirmTitle: '¿Restaurar practice question(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} practice question(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Practice Question(s) archivado(s) exitosamente',
      noSelection:
        'Debe seleccionar al menos un practice question para archivar.',
      confirmTitle: '¿Archivar practice question(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} practice question(s) seleccionado(s)?',
    },

    archive: {
      success: 'Practice Question archivado exitosamente',
      confirmTitle: '¿Archivar practice question?',
    },

    deleteMany: {
      success: 'Practice Question(s) eliminado(s) exitosamente',
      noSelection:
        'Debe seleccionar al menos un practice question para eliminar.',
      confirmTitle: '¿Eliminar practice question(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} practice question(s) seleccionado(s)?',
    },

    delete: {
      success: 'Practice Question eliminado exitosamente',
      confirmTitle: '¿Eliminar practice question?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de practice questions con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de practice questions incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un practice question específico por su ID único. Devuelve perfil completo del practice question incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de practice question con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de practice question existente con nueva información. Permite modificación de todos los campos de practice question incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más practice questions del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de practice question y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más practice questions para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los practice questions archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar practice questions previamente archivados de vuelta a estado activo. Hace los practice questions visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de practice questions para entradas de autocompletado. Devuelve una lista simplificada de practice questions que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
    },
  },
  concept: {
    dashboardCard: {
      title: 'Concepts',
    },

    list: {
      menu: 'Concepts',
      title: 'Concepts',
      noResults: 'No se encontraron concepts.',
      empty: 'Aún no ha creado concepts. Comience creando su primer concept.',
    },

    importer: {
      title: 'Importar concepts',
      menu: 'Importar concepts',
    },

    export: {
      success: 'Concepts exportados exitosamente',
    },

    new: {
      menu: 'Nuevo concept',
      title: 'Nuevo concept',
      success: 'Concept creado exitosamente',
    },

    view: {
      title: 'Ver concept',
    },

    edit: {
      menu: 'Editar concept',
      title: 'Editar concept',
      success: 'Concept actualizado exitosamente',
    },

    restore: {
      success: 'Concept restaurado exitosamente',
      confirmTitle: '¿Restaurar concept?',
    },

    restoreMany: {
      success: 'Concept(s) restaurado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un concept para restaurar.',
      confirmTitle: '¿Restaurar concept(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} concept(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Concept(s) archivado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un concept para archivar.',
      confirmTitle: '¿Archivar concept(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} concept(s) seleccionado(s)?',
    },

    archive: {
      success: 'Concept archivado exitosamente',
      confirmTitle: '¿Archivar concept?',
    },

    deleteMany: {
      success: 'Concept(s) eliminado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un concept para eliminar.',
      confirmTitle: '¿Eliminar concept(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} concept(s) seleccionado(s)?',
    },

    delete: {
      success: 'Concept eliminado exitosamente',
      confirmTitle: '¿Eliminar concept?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de concepts con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de concepts incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un concept específico por su ID único. Devuelve perfil completo del concept incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de concept con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de concept existente con nueva información. Permite modificación de todos los campos de concept incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más concepts del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de concept y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más concepts para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los concepts archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar concepts previamente archivados de vuelta a estado activo. Hace los concepts visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de concepts para entradas de autocompletado. Devuelve una lista simplificada de concepts que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
    },
  },
  examType: {
    dashboardCard: {
      title: 'Exam Types',
    },

    list: {
      menu: 'Exam Types',
      title: 'Exam Types',
      noResults: 'No se encontraron exam types.',
      empty:
        'Aún no ha creado exam types. Comience creando su primer exam type.',
    },

    importer: {
      title: 'Importar exam types',
      menu: 'Importar exam types',
    },

    export: {
      success: 'Exam Types exportados exitosamente',
    },

    new: {
      menu: 'Nuevo exam type',
      title: 'Nuevo exam type',
      success: 'Exam Type creado exitosamente',
    },

    view: {
      title: 'Ver exam type',
    },

    edit: {
      menu: 'Editar exam type',
      title: 'Editar exam type',
      success: 'Exam Type actualizado exitosamente',
    },

    restore: {
      success: 'Exam Type restaurado exitosamente',
      confirmTitle: '¿Restaurar exam type?',
    },

    restoreMany: {
      success: 'Exam Type(s) restaurado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam type para restaurar.',
      confirmTitle: '¿Restaurar exam type(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} exam type(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Exam Type(s) archivado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam type para archivar.',
      confirmTitle: '¿Archivar exam type(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} exam type(s) seleccionado(s)?',
    },

    archive: {
      success: 'Exam Type archivado exitosamente',
      confirmTitle: '¿Archivar exam type?',
    },

    deleteMany: {
      success: 'Exam Type(s) eliminado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam type para eliminar.',
      confirmTitle: '¿Eliminar exam type(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} exam type(s) seleccionado(s)?',
    },

    delete: {
      success: 'Exam Type eliminado exitosamente',
      confirmTitle: '¿Eliminar exam type?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de exam types con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de exam types incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un exam type específico por su ID único. Devuelve perfil completo del exam type incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de exam type con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de exam type existente con nueva información. Permite modificación de todos los campos de exam type incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más exam types del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de exam type y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más exam types para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los exam types archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar exam types previamente archivados de vuelta a estado activo. Hace los exam types visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de exam types para entradas de autocompletado. Devuelve una lista simplificada de exam types que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
    },
  },
  examInstance: {
    dashboardCard: {
      title: 'Exam Attempts',
    },

    list: {
      menu: 'Exam Attempts',
      title: 'Exam Attempts',
      noResults: 'No se encontraron exam attempts.',
      empty:
        'Aún no ha creado exam attempts. Comience creando su primer exam attempt.',
    },

    importer: {
      title: 'Importar exam attempts',
      menu: 'Importar exam attempts',
    },

    export: {
      success: 'Exam Attempts exportados exitosamente',
    },

    new: {
      menu: 'Nuevo exam attempt',
      title: 'Nuevo exam attempt',
      success: 'Exam Attempt creado exitosamente',
    },

    view: {
      title: 'Ver exam attempt',
    },

    edit: {
      menu: 'Editar exam attempt',
      title: 'Editar exam attempt',
      success: 'Exam Attempt actualizado exitosamente',
    },

    restore: {
      success: 'Exam Attempt restaurado exitosamente',
      confirmTitle: '¿Restaurar exam attempt?',
    },

    restoreMany: {
      success: 'Exam Attempt(s) restaurado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam attempt para restaurar.',
      confirmTitle: '¿Restaurar exam attempt(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} exam attempt(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Exam Attempt(s) archivado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam attempt para archivar.',
      confirmTitle: '¿Archivar exam attempt(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} exam attempt(s) seleccionado(s)?',
    },

    archive: {
      success: 'Exam Attempt archivado exitosamente',
      confirmTitle: '¿Archivar exam attempt?',
    },

    deleteMany: {
      success: 'Exam Attempt(s) eliminado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un exam attempt para eliminar.',
      confirmTitle: '¿Eliminar exam attempt(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} exam attempt(s) seleccionado(s)?',
    },

    delete: {
      success: 'Exam Attempt eliminado exitosamente',
      confirmTitle: '¿Eliminar exam attempt?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de exam attempts con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de exam attempts incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un exam attempt específico por su ID único. Devuelve perfil completo del exam attempt incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de exam attempt con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de exam attempt existente con nueva información. Permite modificación de todos los campos de exam attempt incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más exam attempts del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de exam attempt y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más exam attempts para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los exam attempts archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar exam attempts previamente archivados de vuelta a estado activo. Hace los exam attempts visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de exam attempts para entradas de autocompletado. Devuelve una lista simplificada de exam attempts que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
    },
  },
  dailyGoal: {
    dashboardCard: {
      title: 'Daily Goals',
    },

    list: {
      menu: 'Daily Goals',
      title: 'Daily Goals',
      noResults: 'No se encontraron daily goals.',
      empty:
        'Aún no ha creado daily goals. Comience creando su primer daily goal.',
    },

    importer: {
      title: 'Importar daily goals',
      menu: 'Importar daily goals',
    },

    export: {
      success: 'Daily Goals exportados exitosamente',
    },

    new: {
      menu: 'Nuevo daily goal',
      title: 'Nuevo daily goal',
      success: 'Daily Goal creado exitosamente',
    },

    view: {
      title: 'Ver daily goal',
    },

    edit: {
      menu: 'Editar daily goal',
      title: 'Editar daily goal',
      success: 'Daily Goal actualizado exitosamente',
    },

    restore: {
      success: 'Daily Goal restaurado exitosamente',
      confirmTitle: '¿Restaurar daily goal?',
    },

    restoreMany: {
      success: 'Daily Goal(s) restaurado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un daily goal para restaurar.',
      confirmTitle: '¿Restaurar daily goal(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} daily goal(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Daily Goal(s) archivado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un daily goal para archivar.',
      confirmTitle: '¿Archivar daily goal(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} daily goal(s) seleccionado(s)?',
    },

    archive: {
      success: 'Daily Goal archivado exitosamente',
      confirmTitle: '¿Archivar daily goal?',
    },

    deleteMany: {
      success: 'Daily Goal(s) eliminado(s) exitosamente',
      noSelection: 'Debe seleccionar al menos un daily goal para eliminar.',
      confirmTitle: '¿Eliminar daily goal(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} daily goal(s) seleccionado(s)?',
    },

    delete: {
      success: 'Daily Goal eliminado exitosamente',
      confirmTitle: '¿Eliminar daily goal?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de daily goals con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de daily goals incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un daily goal específico por su ID único. Devuelve perfil completo del daily goal incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de daily goal con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de daily goal existente con nueva información. Permite modificación de todos los campos de daily goal incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más daily goals del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de daily goal y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más daily goals para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los daily goals archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar daily goals previamente archivados de vuelta a estado activo. Hace los daily goals visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de daily goals para entradas de autocompletado. Devuelve una lista simplificada de daily goals que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
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
      noResults: 'No se encontraron document uploads.',
      empty:
        'Aún no ha creado document uploads. Comience creando su primer document upload.',
    },

    importer: {
      title: 'Importar document uploads',
      menu: 'Importar document uploads',
    },

    export: {
      success: 'Document Uploads exportados exitosamente',
    },

    new: {
      menu: 'Nuevo document upload',
      title: 'Nuevo document upload',
      success: 'Document Upload creado exitosamente',
    },

    view: {
      title: 'Ver document upload',
    },

    edit: {
      menu: 'Editar document upload',
      title: 'Editar document upload',
      success: 'Document Upload actualizado exitosamente',
    },

    restore: {
      success: 'Document Upload restaurado exitosamente',
      confirmTitle: '¿Restaurar document upload?',
    },

    restoreMany: {
      success: 'Document Upload(s) restaurado(s) exitosamente',
      noSelection:
        'Debe seleccionar al menos un document upload para restaurar.',
      confirmTitle: '¿Restaurar document upload(s)?',
      confirmDescription:
        '¿Está seguro de que desea restaurar el/los {0} document upload(s) seleccionado(s)?',
    },

    archiveMany: {
      success: 'Document Upload(s) archivado(s) exitosamente',
      noSelection:
        'Debe seleccionar al menos un document upload para archivar.',
      confirmTitle: '¿Archivar document upload(s)?',
      confirmDescription:
        '¿Está seguro de que desea archivar el/los {0} document upload(s) seleccionado(s)?',
    },

    archive: {
      success: 'Document Upload archivado exitosamente',
      confirmTitle: '¿Archivar document upload?',
    },

    deleteMany: {
      success: 'Document Upload(s) eliminado(s) exitosamente',
      noSelection:
        'Debe seleccionar al menos un document upload para eliminar.',
      confirmTitle: '¿Eliminar document upload(s)?',
      confirmDescription:
        '¿Está seguro de que desea eliminar el/los {0} document upload(s) seleccionado(s)?',
    },

    delete: {
      success: 'Document Upload eliminado exitosamente',
      confirmTitle: '¿Eliminar document upload?',
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
      createdByMember: 'Creado por',
      updatedByMember: 'Actualizado por',
      archivedByMember: 'Archivado por',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      archivedAt: 'Archivado el',
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
      list: 'Recuperar lista paginada de document uploads con opciones de filtrado avanzadas. Soporta filtrado por varios campos y entidades relacionadas. Devuelve detalles de document uploads incluyendo todas las relaciones y metadatos.',
      get: 'Recuperar información detallada sobre un document upload específico por su ID único. Devuelve perfil completo del document upload incluyendo todas las relaciones, adjuntos y metadatos de auditoría.',
      create:
        'Crear nuevo registro de document upload con detalles completos. Soporta todos los campos definidos incluyendo relaciones, adjuntos de archivos y propiedades personalizadas.',
      update:
        'Actualizar registro de document upload existente con nueva información. Permite modificación de todos los campos de document upload incluyendo relaciones y adjuntos. Rastrea automáticamente la actualización en registros de auditoría.',
      delete:
        'Eliminar permanentemente uno o más document uploads del sistema. Esta acción es irreversible. Acepta un arreglo de IDs de document upload y remueve todos los datos asociados.',
      archive:
        'Archivar uno o más document uploads para ocultarlos de las vistas predeterminadas mientras se preservan sus datos. Los document uploads archivados pueden ser restaurados después. Útil para registros inactivos o históricos.',
      restore:
        'Restaurar document uploads previamente archivados de vuelta a estado activo. Hace los document uploads visibles en vistas predeterminadas nuevamente.',
      autocomplete:
        'Buscar y recuperar sugerencias de document uploads para entradas de autocompletado. Devuelve una lista simplificada de document uploads que coinciden con la consulta de búsqueda, optimizada para desplegables de selección y campos de autocompletado.',
    },
  },

  auditLog: {
    list: {
      menu: 'Registros de auditoría',
      title: 'Registros de auditoría',
      noResults: 'No se encontraron registros de auditoría.',
    },

    changesDialog: {
      title: 'Registro de auditoría',
      changes: 'Cambios',
      noChanges: 'No hay cambios en este registro.',
      showChangesOnly: 'Mostrar solo cambios',
      showFullObject: 'Mostrar objeto completo',
    },

    export: {
      success: 'Registros de auditoría exportados exitosamente',
    },

    fields: {
      timestamp: 'Fecha',
      entityName: 'Entidad',
      entityNames: 'Entidades',
      entityId: 'ID de entidad',
      operation: 'Operación',
      operations: 'Operaciones',
      member: 'Usuario',
      apiKey: 'Clave API',
      apiEndpoint: 'Punto final API',
      apiHttpResponseCode: 'Estado API',
    },

    enumerators: {
      operation: {
        SI: 'Iniciar sesión',
        SO: 'Cerrar sesión',
        SU: 'Registrarse',
        PRR: 'Solicitud de restablecimiento de contraseña',
        PRC: 'Confirmación de restablecimiento de contraseña',
        PC: 'Cambio de contraseña',
        VER: 'Solicitud de verificación de correo',
        VEC: 'Confirmación de verificación de correo',
        C: 'Crear',
        U: 'Actualizar',
        D: 'Eliminar',
        AG: 'API Get',
        APO: 'API Post',
        APU: 'API Put',
        AD: 'API Delete',
      },
    },

    dashboardCard: {
      activityChart: 'Actividad',
      activityList: 'Actividad reciente',
    },

    readableOperations: {
      SI: '{0} inició sesión',
      SIF: 'Intento fallido de inicio de sesión para {0}',
      SU: '{0} se registró',
      PRR: '{0} solicitó restablecer la contraseña',
      PRC: '{0} confirmó restablecimiento de contraseña',
      PC: '{0} cambió la contraseña',
      VER: '{0} solicitó verificar el correo',
      VEC: '{0} verificó el correo',
      ECR: '{0} solicitó cambiar el correo',
      ECC: '{0} confirmó cambio de correo',
      C: '{0} creó {1} {2}',
      U: '{0} actualizó {1} {2}',
      D: '{0} eliminó {1} {2}',
      selfSignUp: '{0} se registró',
      selfUpdate: '{0} actualizó su perfil',
      AG: 'Solicitud API Key GET',
      APO: 'Solicitud API Key POST',
      APU: 'Solicitud API Key PUT',
      AD: 'Solicitud API Key DELETE',
    },

    mcpDescription: {
      list: 'Consultar el registro de auditoría para recuperar registros de todas las acciones realizadas en la organización. Soporta filtrado por tipo de entidad, ID de entidad, tipo de operación y rango de tiempo. Devuelve registros detallados incluyendo quién realizó la acción, cuándo y qué cambió. Esencial para cumplimiento y monitoreo de seguridad.',
      activityChart:
        'Obtener estadísticas de actividad agregadas durante un período de tiempo. Devuelve un gráfico de series de tiempo de actividades y operaciones de usuarios, útil para visualizar patrones de uso del sistema e identificar períodos de actividad máxima.',
    },
  },

  apiDocs: {
    title: 'Documentación de API',
    menu: 'Documentación de API',
    featuresApi: 'API de características',
    authApi: 'API de autenticación',
    openapi: {
      title: 'API',
      serverDescription: 'Servidor API',
      securitySchemes: {
        apiKeyAuth: {
          description: 'Autenticación de clave API usando encabezado x-api-key',
        },
        bearerAuth: {
          description:
            'Autenticación de clave API usando token Bearer de Autorización',
        },
      },
    },
  },

  mcp: {
    title: 'Integración MCP',
    menu: 'Integración MCP',
    subtitle:
      'Conectar asistentes de IA externos usando el Model Context Protocol',
    info: 'Use el punto final a continuación para conectar asistentes de IA externos como ChatGPT o Claude Desktop a los datos de su organización.',
    endpoint: {
      title: 'Su punto final MCP',
      description: 'Use este punto final para configurar clientes MCP',
      endpointLabel: 'URL del punto final MCP',
      organizationLabel: 'ID de organización',
      languageLabel: 'Idioma',
    },
    usage: {
      title: 'Cómo usar',
      description:
        'Siga estos pasos para integrar con asistentes de IA externos:',
      step1: 'Copie la URL del punto final de arriba',
      step2:
        'Configure su asistente de IA (ChatGPT, Claude Desktop, etc.) con este punto final MCP',
      step3: 'Autentique usando OAuth cuando se le solicite',
      step4:
        'Comience a usar los datos de su organización a través del chat IA',
    },
  },

  user: {
    mcpDescription: {
      me: 'Recuperar el perfil del usuario autenticado actual y todas sus membresías de organización. Devuelve detalles del usuario, todas las organizaciones a las que pertenece, sus roles en cada organización y cualquier suscripción activa.',
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
      title: 'Reproductor del curso',
      modules: 'Modulos',
      courseOutline: 'Temario del curso',
      currentModule: 'Modulo: {0}',
      progressComplete: '{0}% completado',
      lessonKindVideo: 'Video',
      lessonKindArticle: 'Articulo',
      lessonKindQuiz: 'Cuestionario',
      durationMinutes: '{0} min',
      durationQuestions: '{0} preguntas',
      readingTime: '{0} min de lectura',
      videoUnavailable: 'No se ha subido ningun video para esta leccion.',
      noLessonContent: 'Aun no se ha agregado contenido a esta leccion.',
      articleHint:
        'Pide al tutor de IA que explique, resuma o genere preguntas de practica.',
      completeLesson: 'Marcar como completada',
      completedLesson: 'Completada',
      saveNote: 'Guardar nota',
      downloadResources: 'Descargar recursos',
      openMiniPlayer: 'Abrir mini reproductor',
      closeMiniPlayer: 'Cerrar mini reproductor',
      playing: 'Reproduciendo',
      assignments: 'Tarea',
      submitAssignment: 'Enviar tarea',
      resubmitAssignment: 'Reenviar tarea',
      pendingReview: 'Enviada y en espera de revision.',
      homeworkComplete: 'Esta tarea esta completa.',
      resubmissionClosed: 'Los reenvios estan cerrados para esta tarea.',
      maxAttemptsReached: 'Se alcanzo el numero maximo de intentos.',
      tutor: 'Tutor de IA del curso',
      tutorPrompt: 'Pregunta sobre este curso o leccion...',
      resources: 'Archivos descargables',
      quizzes: 'Cuestionarios',
      takeQuiz: 'Hacer cuestionario',
    },
    mobile: {
      savedOffline:
        'Guardado sin conexión. Se sincronizará cuando vuelvas a estar en línea.',
      outline: 'Temario del curso',
      nextLesson: 'Siguiente lección',
      offlineStatus: {
        online: 'En línea',
        offline:
          'Modo sin conexión: el trabajo de la lección se guarda en este dispositivo.',
        syncing: 'Sincronizando trabajo de lección guardado...',
        synced: 'Trabajo de lección sincronizado.',
        failed:
          'Parte del trabajo de la lección necesita otro intento de sincronización.',
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
    menu: 'Solicitud de creador',
    title: 'Solicitud de creador',
    description:
      'Solicita verificación docente con un perfil estructurado, plan de curso y revisión privada de identidad antes de publicar cursos en NexExam.',
    adminTitle: 'Solicitudes de creadores',
    adminDescription:
      'Revisa perfiles docentes, verificación de identidad y preparación del creador antes de aprobar.',
    sections: {
      profile: 'Perfil docente',
      profileBody:
        'Muestra a estudiantes y revisores quién eres, qué enseñas y a quién ayudas.',
      expertise: 'Experiencia y plan de curso',
      expertiseBody:
        'Agrega credenciales, enfoque temático, enlaces de prueba y un plan de clase de muestra para revisión de calidad.',
      identity: 'Verificación de identidad',
      identityBody:
        'Sube identificación oficial o documentos de identidad profesional al espacio privado de verificación.',
      payout: 'Pagos y contacto',
      payoutBody:
        'Comparte notas de pago o el mejor canal de contacto para la incorporación del creador.',
      review: 'Enviar a revisión',
      reviewBody:
        'Guarda tu solicitud primero y luego ejecuta el agente de verificación cuando tus documentos estén cargados.',
      certifications: 'Credenciales y certificaciones',
      certificationsBody:
        'Agrega certificaciones o credenciales formales, cada una con un documento de respaldo opcional.',
    },
    identity: {
      title: 'Lista de verificación',
      description:
        'NexExam revisa tu perfil docente, documentos de identidad y estado de aprobación administrativa antes de conceder acceso como creador.',
      profileReady: 'Perfil docente completo',
      documentsUploaded: 'Documentos de identidad cargados',
      consentRecorded: 'Consentimiento de verificación registrado',
      adminVerified: 'Identidad verificada por administración',
      consent:
        'Confirmo que estos documentos me pertenecen y autorizo a NexExam a revisarlos para verificar mi identidad como creador.',
      adminReviewTitle: 'Revisión de identidad',
      approvalRequiresIdentity:
        'Verifica la identidad antes de aprobar esta solicitud docente.',
    },
    hints: {
      onePerLine: 'Un elemento por línea',
      certificationsEmpty: 'Aún no se agregaron certificaciones.',
    },
    fields: {
      legalName: 'Nombre legal',
      displayName: 'Nombre público',
      professionalTitle: 'Título profesional',
      bio: 'Bio',
      credentials: 'Credenciales',
      expertise: 'Experiencia en examen/categoría',
      teachingExperience: 'Experiencia docente',
      audience: 'Estudiantes objetivo',
      courseTopics: 'Temas del curso',
      sampleLessonPlan: 'Plan de clase de muestra',
      links: 'Enlaces',
      payoutContact: 'Notas de pago/contacto',
      status: 'Estado',
      identityStatus: 'Estado de identidad',
      identityScanStatus: 'Escaneo del agente',
      adminNotes: 'Notas administrativas',
      certificationTitle: 'Certificación o credencial',
      certificationIssuer: 'Organización emisora',
      certificationYear: 'Año',
      certificationUrl: 'Enlace de verificación',
      certificationDocuments: 'Documentos de respaldo',
      payoutOnboardingStatus: 'Incorporación de pagos',
    },
    actions: {
      submit: 'Enviar solicitud',
      runIdentityScan: 'Ejecutar escaneo de ID',
      verifyIdentity: 'Verificar ID',
      requestDocuments: 'Solicitar documentos',
      approve: 'Aprobar',
      reject: 'Rechazar',
      review: 'Revisar',
      addCertification: 'Agregar certificación',
      removeCertification: 'Quitar',
      beginPayoutOnboarding: 'Iniciar incorporación de pagos',
      submitPayoutDetails: 'Enviar detalles de pago',
      grantNexVerified: 'Conceder Nex Verified',
    },
    success: {
      submitted: 'Solicitud de creador enviada.',
      reviewed: 'Solicitud de creador revisada.',
      identityScanStarted: 'Escaneo de verificación de identidad completado.',
      identityReviewed: 'Revisión de identidad actualizada.',
      payoutOnboardingUpdated: 'Incorporación de pagos actualizada.',
    },
    errors: {
      payoutContactRequired:
        'Agrega notas de pago/contacto antes de enviar tus detalles de pago.',
      payoutOnboardingInvalid:
        'Ese paso de incorporación de pagos no está disponible ahora.',
      nexVerifiedNotEligible:
        'Este creador aún no es elegible para Nex Verified.',
    },
    verification: {
      title: 'Centro de verificación',
      description:
        'Completa cada paso para desbloquear el estado de creador Nex Verified.',
      nexVerifiedBadge: 'Creador Nex Verified',
      eligibleNote:
        'Todas las verificaciones pasaron; un administrador ya puede conceder Nex Verified.',
      pendingNote: 'Completa los pasos restantes para ser elegible.',
      checks: {
        applicationApproved: 'Solicitud de creador aprobada',
        identityVerified: 'Identidad verificada',
        payoutComplete: 'Incorporación de pagos completa',
        nexVerified: 'Nex Verified concedido',
      },
    },
    enumerators: {
      status: {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada',
      },
      identityStatus: {
        notStarted: 'No iniciada',
        needsDocuments: 'Necesita documentos',
        readyForReview: 'Lista para revisión',
        verified: 'Verificada',
        rejected: 'Rechazada',
      },
      identityScanStatus: {
        notStarted: 'No iniciado',
        passed: 'Aprobado',
        needsReview: 'Necesita revisión',
        failed: 'Fallido',
      },
      identityScanChecks: {
        consent_recorded: 'Consentimiento registrado',
        consent_missing: 'Falta consentimiento',
        document_uploaded: 'Documento cargado',
        document_missing: 'Falta documento',
        too_many_documents: 'Demasiados documentos',
        file_type_supported: 'Tipo de archivo compatible',
        file_type_needs_review: 'Tipo de archivo requiere revisión',
        legal_name_present: 'Nombre legal presente',
        legal_name_needs_review: 'Nombre legal requiere revisión',
        manual_review_required: 'Revisión manual administrativa requerida',
      },
      payoutOnboardingStatus: {
        notStarted: 'No iniciada',
        inProgress: 'En progreso',
        submitted: 'Enviada para revisión',
        actionRequired: 'Acción requerida',
        complete: 'Completa',
      },
    },
  },

  chatbot: {
    title: 'Chat IA',
    menu: 'Chat IA',
    placeholder: 'Pregúntame cualquier cosa sobre tus datos...',
    send: 'Enviar',
    thinking: 'Pensando...',
    usingTool: 'Usando {0}...',
    error: 'Algo salió mal. Por favor intente nuevamente.',
    errorNoApiKey:
      'El Chat IA no está configurado. Por favor contacte a su administrador.',
    empty: 'Inicie una conversación con el chat IA',
    welcome:
      '¡Hola! Puedo ayudarle con exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, miembros, registros de auditoría, suscripciones y más. ¿Qué le gustaría saber?',
    clearConversation: 'Limpiar conversación',
    inputHint: 'Presione Enter para enviar, Shift+Enter para nueva línea',
    courseContextHeader: 'Course context available to the tutor:',
    courseVideoTranscriptNotice:
      'Uploaded videos are available as files only; no audio transcript is available in Phase 1.',
    courseScopedSystemPrompt: `The user is asking inside a specific course. Use this course context when helpful, but do not claim to know video audio that is not present in the written context:

{0}`,
    systemPrompt: `Eres un chat IA para {0}. Tienes acceso a varias herramientas para ayudar a los usuarios a gestionar sus datos incluyendo exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, miembros, registros de auditoría, suscripciones e información de usuario.

IMPORTANTE: Responde siempre en {1}. El idioma de la interfaz del usuario es {1}, por lo que todas tus respuestas deben estar en {1}.

Deberías:
- Ser útil, conciso y profesional
- Usar las herramientas disponibles para responder preguntas sobre datos
- Explicar lo que estás haciendo al usar herramientas
- Formatear datos de forma clara y legible
- Pedir aclaraciones si una solicitud es ambigua

Al mostrar datos:
- Usar tablas o listas para múltiples elementos
- Resaltar información importante
- Incluir IDs relevantes solo cuando sea necesario

Recuerda: Estás operando dentro de {0} y solo puedes acceder a datos de esta organización.`,
  },

  notification: {
    title: 'Notificaciones',
    menu: 'Notificaciones',
    unreadCount: '{0} notificación(es) no leída(s)',
    markAsRead: 'Marcar como leído',
    markAsReadSuccess: 'Notificaciones marcadas como leídas',
    markAsUnread: 'Marcar como no leído',
    markAsUnreadSuccess: 'Notificaciones marcadas como no leídas',
    noNotifications:
      'Aún no tiene notificaciones. Cuando haya actualizaciones o eventos importantes, los verá aquí.',
    list: {
      title: 'Notificaciones',
      menu: 'Notificaciones',
    },
    fields: {
      type: 'Tipo',
      message: 'Mensaje',
      createdAt: 'Fecha',
      readAt: 'Leído',
    },
    status: {
      read: 'Leído',
      unread: 'No leído',
    },
    enumerators: {
      type: {
        memberAdded: 'Miembro agregado',
        memberRemoved: 'Miembro removido',
        subscriptionCreated: 'Suscripción creada',
        studyPlanDue: 'Plan de estudio pendiente',
        flashcardsDue: 'Tarjetas pendientes',
        streakRisk: 'Recordatorio de racha de estudio',
        examDateApproaching: 'Se acerca la fecha del examen',
        practiceReminder: 'Recordatorio de práctica',
        custom: 'Personalizado',
      },
    },
    memberAdded: {
      subject: 'Nuevo miembro agregado a {0}',
      body: `<p>Hola,</p><p><strong>{0}</strong> ({1}) ha sido agregado a {2} por {3}.</p><p>Gracias,</p><p>Tu equipo</p>`,
      pushBody: '{0} se unió a {1}',
    },
    memberRemoved: {
      subject: 'Miembro removido de {0}',
      body: `<p>Hola,</p><p><strong>{0}</strong> ({1}) ha sido removido de {2} por {3}.</p><p>Gracias,</p><p>Tu equipo</p>`,
      pushBody: '{0} abandonó {1}',
    },
    subscriptionCreated: {
      subject: 'Nueva suscripción en {0}',
      body: `<p>Hola,</p><p><strong>{0}</strong> ({1}) se ha suscrito al plan <strong>{2}</strong> para {3}.</p><p>Gracias,</p><p>Tu equipo</p>`,
      pushBody: '{0} se suscribió a {1}',
    },
    studyPlanDue: {
      subject: 'Plan de estudio pendiente para {0}',
      body: '<p>Tu tarea <strong>{0}</strong> vence para {1}.</p>',
      pushBody: '{0} vence para {1}',
    },
    flashcardsDue: {
      subject: 'Tarjetas pendientes para {0}',
      body: '<p>Tienes {0} tarjeta(s) listas para repasar en {1}.</p>',
      pushBody: '{0} tarjeta(s) listas en {1}',
    },
    streakRisk: {
      subject: 'Mantén tu racha de {0}',
      body: '<p>Abre {0} hoy para proteger tu racha de estudio de {1} día(s).</p>',
      pushBody: 'Mantén hoy tu racha de {0}',
    },
    examDateApproaching: {
      subject: '{0} se acerca',
      body: '<p>{0} está a {1} día(s). Revisa tu plan de estudio hoy.</p>',
      pushBody: '{0} está a {1} día(s)',
    },
    practiceReminder: {
      subject: 'Práctica lista para {0}',
      body: '<p>Hay una sesión corta de práctica lista para {0}.</p>',
      bodyWithWeakArea:
        '<p>Hay una sesión corta de práctica para {0}, enfocada en {1}.</p>',
      pushBody: 'La práctica está lista para {0}',
      pushBodyWithWeakArea: 'Practica tu área débil: {0}',
    },
    custom: {
      subject: '{0}',
      body: '{0}',
      pushBody: '{0}',
    },
    default: {
      subject: 'Notificación',
      body: 'Tiene una nueva notificación',
      pushBody: 'Tiene una nueva notificación',
    },
    send: {
      title: 'Enviar notificación',
      menu: 'Enviar',
      success: 'Notificación enviada exitosamente',
      fields: {
        title: 'Título',
        message: 'Mensaje',
        roles: 'Roles objetivo',
      },
      placeholders: {
        title: 'Ingresar título de notificación',
        message: 'Ingresar mensaje de notificación',
        roles: 'Seleccionar roles a notificar',
      },
    },
  },

  trustSafety: {
    admin: {
      title: 'Confianza y seguridad',
      menu: 'Confianza y seguridad',
      description:
        'Revisa reportes del marketplace, alertas de riesgo, aceptación de políticas y restricciones de creadores.',
      openReports: 'Reportes abiertos',
      openRiskFlags: 'Alertas de riesgo abiertas',
      pendingReviews: 'Revisiones pendientes',
      disabledCreators: 'Creadores deshabilitados',
      policyVersions: 'Versiones de políticas activas',
      noPolicyVersions: 'No hay políticas activas configuradas.',
      searchPlaceholder: 'Buscar reportes, cursos, creadores o alertas...',
      reportStatusFilter: 'Todos los estados de reporte',
      flagStatusFilter: 'Todos los estados de alerta',
      priorityFilter: 'Todas las prioridades',
      severityFilter: 'Todas las severidades',
      targetTypeFilter: 'Todos los tipos de objetivo',
      runRuleScan: 'Escanear reglas de riesgo',
      riskFlags: 'Alertas de riesgo',
      reports: 'Reportes',
      manualFlag: 'Alerta manual de riesgo',
      pendingCourseReviews: 'Revisiones de cursos pendientes',
      disabledCreatorList: 'Creadores deshabilitados',
      emptyRiskFlags: 'Ninguna alerta de riesgo coincide con estos filtros.',
      emptyReports: 'Ningún reporte coincide con estos filtros.',
      emptyCourseReviews: 'No hay cursos esperando revisión.',
      emptyDisabledCreators: 'No hay creadores deshabilitados.',
      targetIdPlaceholder: 'UUID del objetivo',
      reasonPlaceholder: 'Describe el riesgo',
      adminNotesPlaceholder: 'Notas administrativas',
      resolutionSummaryPlaceholder: 'Resumen de resolución',
      createFlag: 'Crear alerta',
      assignToMe: 'Asignarme',
      markReviewing: 'Marcar en revisión',
      resolve: 'Resolver',
      dismiss: 'Descartar',
      resolveActionTaken: 'Resolver con acción',
      resolveNoAction: 'Resolver sin acción',
      disableCreator: 'Deshabilitar creador',
      restoreCreator: 'Restaurar creador',
      placeHold: 'Aplicar retención',
      removeHold: 'Quitar retención',
      onHold: 'Retenido',
      inReview: 'En revisión',
      openCourseReview: 'Abrir revisión',
      manualSafetyHoldReason: 'Retención manual de seguridad',
      unknownCreator: 'Creador desconocido',
      unknown: 'Desconocido',
      unassigned: 'Sin asignar',
      assignedTo: 'Asignado a',
      reportedBy: 'Reportado por',
      disabled: 'Deshabilitado',
      reviewTimeline: 'Historial de revisión',
      noReviewDecisions: 'Aún no hay decisiones de revisión registradas.',
      priorities: {
        low: 'Baja',
        normal: 'Normal',
        high: 'Alta',
        urgent: 'Urgente',
      },
      outcomeCategories: {
        none: 'Sin resultado seleccionado',
        contentRemoved: 'Contenido eliminado',
        creatorWarning: 'Creador advertido',
        creatorSuspended: 'Creador suspendido',
        refundReviewed: 'Reembolso revisado',
        noViolation: 'Sin infracción',
        duplicate: 'Duplicado',
      },
      reviewDecisions: {
        submitted: 'Enviado a revisión',
        withdrawn: 'Retirado de revisión',
        creatorUnpublished: 'Despublicado por el creador',
        approve: 'Aprobado',
        requestChanges: 'Cambios solicitados',
        safetyHoldPlaced: 'Retención de seguridad aplicada',
        safetyHoldRemoved: 'Retención de seguridad retirada',
      },
      targetTypes: {
        creator: 'Creador',
        course: 'Curso',
        report: 'Reporte',
        payout: 'Pago',
        oneOnOneSession: 'Sesión 1:1',
      },
      severities: {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        critical: 'Crítica',
      },
      flagStatuses: {
        open: 'Abierta',
        reviewing: 'En revisión',
        resolved: 'Resuelta',
        dismissed: 'Descartada',
      },
      reportStatuses: {
        open: 'Abierto',
        underReview: 'En revisión',
        resolvedActionTaken: 'Resuelto con acción',
        resolvedNoAction: 'Resuelto sin acción',
      },
      sources: {
        manual: 'Manual',
        rule: 'Regla',
      },
      riskReasons: {
        repeatedReports: 'Reportes repetidos',
        identityRejected: 'Verificación de identidad rechazada',
        payoutCancellations: 'Patrón de cancelaciones de pago',
        sessionRefundDisputes: 'Patrón de reembolsos o disputas',
      },
    },
    policies: {
      title: 'Términos del marketplace',
      description:
        'Revisa y acepta la política activa del marketplace antes de continuar.',
      version: 'Versión {0}',
      accepted: 'Aceptada',
      accept: 'Aceptar política',
      reviewTerms: 'Revisar términos',
      teacherTermsRequired: 'Términos docentes requeridos',
      teacherTermsRequiredBody:
        'Acepta los términos docentes actuales antes de enviar este curso a revisión del marketplace.',
      refundPolicy: {
        title: 'Política de reembolsos',
        checkoutSummary:
          'Los reembolsos se revisan según la política activa del marketplace. El abuso, servicios completados o infracciones de política pueden denegarse tras revisión.',
        body: 'Las sesiones pagadas y compras del marketplace se revisan según la política de reembolsos activa. Los reembolsos pueden aprobarse cuando una sesión pagada no se puede entregar, un docente no asiste al servicio programado o falla el acceso a la plataforma. El abuso, los servicios completados o las infracciones de política pueden denegarse después de la revisión.',
      },
      teacherTerms: {
        title: 'Términos docentes',
        onboardingSummary:
          'Antes de enviar, confirma que tu curso es original o tiene licencia adecuada, está descrito con precisión y está listo para revisión.',
        body: 'Los docentes deben enviar credenciales precisas, publicar contenido original o con licencia adecuada, responder profesionalmente a problemas de estudiantes, seguir las políticas del marketplace y aceptar que NexExam puede revisar, retener, rechazar o eliminar contenido que genere riesgo para estudiantes, legal, de pagos o de la plataforma.',
      },
      studentTerms: {
        title: 'Términos para estudiantes',
        body: 'Los estudiantes deben usar los materiales del curso para aprendizaje personal, enviar trabajos honestos, evitar acoso o abuso de la plataforma, respetar la propiedad intelectual del docente y reportar problemas de seguridad, calidad o pagos mediante las herramientas de reporte del marketplace.',
      },
    },
    report: {
      title: 'Reportar un problema del marketplace',
      description:
        'Envía esto al equipo de seguridad de la plataforma para revisión. Los reportes son privados para administradores.',
      reportCourse: 'Reportar curso o docente',
      detailsPlaceholder:
        'Agrega detalles que ayuden al equipo de seguridad a revisarlo.',
      submit: 'Enviar reporte',
      reasons: {
        misleadingContent: 'Contenido engañoso',
        unsafeAdvice: 'Consejo inseguro',
        harassment: 'Acoso',
        fraud: 'Fraude o estafa',
        intellectualProperty: 'Problema de propiedad intelectual',
        paymentIssue: 'Problema de pago o reembolso',
        other: 'Otro',
      },
    },
    success: {
      policyAccepted: 'Política aceptada',
      reportCreated: 'Reporte enviado',
      adminActionSaved: 'Acción de confianza y seguridad guardada',
      ruleScanComplete: 'Escaneo de riesgo completo. {0} alerta(s) creada(s).',
    },
    errors: {
      policyNotFound: 'Política no encontrada',
      policyAcceptanceRequired:
        'Acepta la política actual del marketplace antes de continuar.',
      creatorDisabled:
        'Este creador está deshabilitado actualmente para actividad del marketplace.',
      courseSafetyHold:
        'Este curso tiene una retención de seguridad y no se puede publicar.',
      riskFlagsBlock:
        'Resuelve las alertas de confianza y seguridad de alta prioridad antes de publicar.',
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
      title: 'Enlace de creación de cuenta',
      description:
        'Envía un enlace de invitación seguro a un posible estudiante o administrador.',
      emailSubject: 'Tu invitación de cuenta de NexExam',
      emailBody: `<p>Hola,</p><p>Te invitaron a unirte a {0} en NexExam.</p><p>Usa este enlace seguro para crear tu cuenta:</p><p><a href="{1}">{1}</a></p><p>Gracias,</p><p>El equipo de NexExam</p>`,
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
        'reCAPTCHA está deshabilitado en esta plataforma. Omitiendo verificación.',
      invalid: 'reCAPTCHA inválido',
    },
  },

  emails: {
    passwordResetEmail: {
      subject: `Restablezca su contraseña para {0}`,
      content: `<p>Hola,</p> <p> Siga este enlace para restablecer su contraseña de {0} para su cuenta. </p> <p><a href="{1}">{1}</a></p> <p> Si no solicitó restablecer su contraseña, puede ignorar este correo. </p> <p>Gracias,</p> <p>Tu equipo de {0}</p>`,
    },
    verifyEmailEmail: {
      subject: `Verifique su correo para {0}`,
      content: `<p>Hola,</p><p>Siga este enlace para verificar su dirección de correo.</p><p><a href="{1}">{1}</a></p><p>Si no solicitó verificar esta dirección, puede ignorar este correo. </p> <p>Gracias,</p> <p>Tu equipo de {0}</p>`,
    },
    emailChangeEmail: {
      subject: `Aprobar cambio de correo para {0}`,
      content: `<p>Hola,</p><p>Ha solicitado cambiar su dirección de correo a <strong>{2}</strong>.</p><p>Siga este enlace para aprobar el cambio:</p><p><a href="{1}">{1}</a></p><p>Si no solicitó este cambio, puede ignorar este correo y su dirección de correo permanecerá sin cambios.</p><p>Gracias,</p><p>Tu equipo de {0}</p>`,
    },
    invitationEmail: {
      multiOrganization: {
        subject: `Ha sido invitado a {1} en {0}`,
        content: `<p>Hola,</p> <p>Ha sido invitado a {2}.</p> <p>Siga este enlace para registrarse.</p> <p><a href="{1}">{1}</a></p> <p>Gracias,</p> <p>Tu equipo de {0}</p>`,
      },
      singleOrganization: {
        subject: `Ha sido invitado a {0}`,
        content: `<p>Hola,</p> <p>Ha sido invitado a {0}.</p> <p>Siga este enlace para registrarse.</p> <p><a href="{1}">{1}</a></p> <p>Gracias,</p> <p>Tu equipo de {0}</p>`,
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
    title: 'Compras de cursos',
    description:
      'Cada compra única de Stripe de un curso pagado. Emite primero los reembolsos en Stripe Dashboard y luego márcalos aquí para revocar el acceso y cancelar el pago vinculado al creador.',
    empty: 'Aún no hay compras de cursos.',
    columns: {
      buyer: 'Comprador',
      course: 'Curso',
      amount: 'Importe',
      paidAt: 'Pagado el',
      refundedAt: 'Reembolsado el',
      actions: 'Acciones',
    },
    actions: {
      markRefunded: 'Marcar reembolsado',
      cancel: 'Cancelar',
      save: 'Guardar',
    },
    filters: {
      all: 'Todos',
      active: 'Activas',
      refunded: 'Reembolsadas',
    },
    refundDialog: {
      title: 'Marcar compra reembolsada',
      description:
        'Confirma que ya emitiste el reembolso en Stripe. Quita el acceso al curso al comprador y cancela el pago vinculado al creador. Esto no se puede deshacer.',
      reasonLabel: 'Motivo del reembolso (opcional)',
      reasonPlaceholder: 'Nota interna para el registro de auditoría',
    },
    badges: {
      paid: 'Pagada',
      refunded: 'Reembolsada',
    },
  },
  studentOnboarding: {
    title: 'Elige tus primeros cursos',
    body: 'Elige cualquier curso gratuito para inscribirte ahora. Puedes explorar el marketplace completo en cualquier momento; los cursos pagados se abren desde la página del curso.',
    skip: 'Omitir por ahora',
    continue: 'Continuar al panel',
    enrollLabel: 'Inscribirse',
    enrolledLabel: 'Inscrito',
    viewLabel: 'Ver curso',
    emptyMessage:
      'Estamos preparando una nueva tanda de cursos. Entra cuando esté lista.',
  },
  aiTutor: {
    title: 'AI Tutor',
    subtitle: 'Pregunta, practica, planifica: tu compañero de estudio.',
    newChat: 'Nuevo chat',
    search: 'Buscar conversaciones',
    untitled: 'Nuevo chat',
    emptyHeroTitle: '¿Cómo puedo ayudarte a estudiar hoy?',
    emptyHeroBody:
      'Haz una pregunta, solicita un cuestionario o crea un plan de estudio.',
    suggestionExplain: 'Explica mi última lección',
    suggestionQuiz: 'Hazme un cuestionario de este módulo',
    suggestionPlan: 'Crea un plan de estudio de 7 días',
    suggestionPractice: 'Dame 12 preguntas de práctica',
    header: {
      openHistory: 'Abrir historial',
      studyMode: 'Modo de estudio',
    },
    timer: {
      toggle: 'Mostrar u ocultar temporizador de estudio',
      label: 'Temporizador de estudio',
      close: 'Cerrar temporizador de estudio',
      pause: 'Pausar temporizador',
      resume: 'Reanudar temporizador',
    },
    history: {
      todayGroup: 'Hoy',
      yesterdayGroup: 'Ayer',
      previousWeekGroup: 'Últimos 7 días',
      olderGroup: 'Anteriores',
      rename: 'Renombrar',
      archive: 'Archivar',
      actions: 'Acciones de conversación',
      confirmArchive:
        '¿Archivar esta conversación? Puedes restaurarla más tarde.',
      empty: 'Aún no hay conversaciones; empieza haciendo una pregunta.',
    },
    composer: {
      placeholder: 'Mensaje para AI Tutor',
      sendAriaLabel: 'Enviar mensaje',
      stopAriaLabel: 'Detener generación',
      attachComingSoon: 'Adjuntos próximamente',
      disclaimer: 'AI Tutor puede equivocarse. Verifica las respuestas clave.',
    },
    thread: {
      thinking: 'Pensando…',
      usingTool: 'Usando {0}…',
      retry: 'Reintentar',
      courseChip: 'Curso: {0}',
      lessonChip: 'Lección: {0}',
    },
    widgets: {
      headerLabel: 'AI Tutor',
      expand: 'Expandir',
      openLesson: 'Abrir lección',
      continueChat: 'Continuar chat',
      submitAnswers: 'Enviar respuestas',
      quiz: {
        title: 'Quiz',
        scorePrefix: 'Puntaje',
        correct: 'Correcto',
        incorrect: 'Incorrecto',
        reviewExplanation: 'Mostrar explicación',
        tryAgain: 'Intentar de nuevo',
      },
      practice: {
        title: 'Práctica',
        attemptedOf: '{0} de {1} intentadas',
        finish: 'Finalizar práctica',
      },
      explain: {
        title: 'Explicación',
        openFullLesson: 'Abrir lección completa',
      },
      summary: {
        title: 'Resumen',
        copyToNotes: 'Copiar a notas',
      },
      plan: {
        title: 'Plan de estudio',
        savePlan: 'Guardar plan',
        saveSingle: 'Agregar al plan',
        completed: 'Guardado',
        daysShort: 'd',
      },
    },
    alerts: {
      limitDaily:
        'Alcanzaste tu límite diario personal de AI Tutor. Se restablece mañana.',
      limitOrg:
        'Tu organización alcanzó su límite diario de AI Tutor. Se restablece mañana.',
      limitGlobal:
        'AI Tutor alcanzó su capacidad diaria. Inténtalo de nuevo mañana.',
      concurrentRequest:
        'Hay otra solicitud de AI Tutor en curso. Espera un momento e inténtalo de nuevo.',
      networkError:
        'No se pudo conectar con AI Tutor. Revisa tu conexión y vuelve a intentar.',
      dismiss: 'Descartar',
    },
  },

  legal: {
    terms: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Términos de servicio',
      lastUpdated: 'Última actualización 2026-05-23',
      body: `# Términos de servicio\n\nEstos Términos regulan tu acceso y uso de NexExam ("el Servicio"). Al crear una cuenta, aceptas estos Términos.\n\n## 1. Elegibilidad\nDebes tener al menos 13 años. Al registrarte confirmas que cumples este requisito de edad.\n\n## 2. Cuenta\nEres responsable de proteger tu contraseña y de toda actividad en tu cuenta. Notifícanos de inmediato cualquier uso no autorizado.\n\n## 3. Uso aceptable\nNo contenido ilegal, no suplantación, no scraping, no abuso automatizado.\n\n## 4. Contenido\nConservas la propiedad del contenido que subes. Nos otorgas una licencia para alojarlo, mostrarlo y procesarlo según sea necesario para operar el Servicio.\n\n## 5. Pagos\nLas compras de cursos y sesiones 1:1 se cobran mediante Stripe. Los reembolsos se rigen por la política mostrada al finalizar la compra.\n\n## 6. Terminación\nPuedes cerrar tu cuenta en cualquier momento. Podemos suspender o cancelar cuentas que infrinjan estos Términos.\n\n## 7. Exenciones y responsabilidad\nEl Servicio se proporciona "tal cual". En la máxima medida permitida por la ley, rechazamos todas las garantías.\n\n## 8. Cambios\nPodemos actualizar estos Términos. El uso continuo después de actualizaciones importantes significa que aceptas los Términos actualizados.\n\n## 9. Contacto\n¿Preguntas? Escribe a legal@nexexam.com.`,
    },
    privacy: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Política de privacidad',
      lastUpdated: 'Última actualización 2026-05-23',
      body: `# Política de privacidad\n\nEsta Política describe qué recopilamos, cómo lo usamos y tus derechos.\n\n## 1. Qué recopilamos\nInformación de cuenta (correo, nombre, fecha de nacimiento), actividad del curso, metadatos de pago mediante Stripe, conversaciones con tutor de IA y telemetría operativa.\n\n## 2. Cómo lo usamos\nPara operar el Servicio, personalizar tu experiencia de estudio, procesar pagos, cumplir la ley y comunicarnos contigo.\n\n## 3. Compartición\nCon proveedores de servicios (Stripe, AWS, entrega de correo, Anthropic para tutoría de IA) bajo acuerdos de procesamiento de datos. No vendemos tus datos.\n\n## 4. Tus derechos\nPuedes solicitar una copia de tus datos o eliminar tu cuenta en cualquier momento desde Configuración de cuenta. Usuarios de la UE, Reino Unido y Canadá tienen derechos adicionales como corrección y portabilidad.\n\n## 5. Retención\nLos registros relevantes para impuestos (compras, auditorías) se conservan según la ley aplicable. Otros datos personales se eliminan dentro de los 14 días posteriores a la eliminación de la cuenta.\n\n## 6. Transferencias internacionales\nLos datos pueden procesarse fuera de tu país. Usamos salvaguardas adecuadas.\n\n## 7. Menores\nEl Servicio no está dirigido a menores de 13 años.\n\n## 8. Cambios\nTe notificaremos cambios importantes en esta Política.\n\n## 9. Contacto\nprivacy@nexexam.com.`,
    },
  },

  account: {
    privacyTabLabel: 'Privacidad y cuenta',
    delete: {
      cardTitle: 'Eliminar tu cuenta',
      cardBody:
        'Elimina permanentemente tu cuenta y datos personales. Los registros fiscales (compras, auditorías) se conservan según exige la ley.',
      cardAction: 'Eliminar cuenta',
      dialogTitle: 'Eliminar tu cuenta',
      dialogBody:
        'Después de 14 días, tu cuenta y la mayoría de los datos personales se eliminarán. Puedes cancelar en cualquier momento dentro de ese plazo desde esta página o desde el enlace de correo que enviaremos.',
      dialogAcknowledge: 'Entiendo que esto es permanente.',
      dialogSubmit: 'Continuar',
      requestSentTitle: 'Revisa tu correo',
      requestSentBody:
        'Enviamos un enlace de confirmación a tu bandeja. Haz clic dentro de 24 horas para confirmar la eliminación. Sin confirmación, nada cambia.',
      confirmedSuccessTitle: 'Eliminación confirmada',
      confirmedSuccessBody:
        'Tu cuenta se eliminará el {0}. Puedes cancelar en cualquier momento antes de esa fecha.',
      confirmedExpiredTitle: 'Este enlace no se puede usar',
      confirmedExpiredBody:
        'El enlace de confirmación no es válido o ya se usó. Abre Configuración de cuenta para solicitar un enlace nuevo.',
      cancelBannerTitle: 'Tu cuenta está programada para eliminarse el {0}',
      cancelBannerAction: 'Cancelar eliminación',
      cancelledToast: 'Eliminación cancelada.',
      errors: {
        alreadyDeleted: 'Esta cuenta ya se eliminó.',
      },
    },
    dataExport: {
      cardTitle: 'Descargar una copia de tus datos',
      cardBody:
        'Prepararemos un archivo JSON con tu cuenta, cursos, notas, chats y otros datos personales. Recibirás un correo cuando esté listo.',
      cardAction: 'Solicitar exportación',
      cooldownBody:
        'Intenta de nuevo en {0} horas; solo se permite una exportación cada 24 horas.',
      statusQueued: 'Preparando',
      statusCompleted: 'Lista',
      statusFailed: 'Fallida',
      downloadAction: 'Descargar',
      downloadHint:
        'Los enlaces de descarga vencen después de 15 minutos por seguridad. Haz clic de nuevo para obtener un enlace actualizado.',
      emptyTitle: 'Aún no hay exportaciones',
      emptyBody: 'Cuando solicites una, aparecerá aquí.',
      requestedToast: 'Exportación en cola. Vuelve a revisar en un minuto.',
    },
    emailPreferences: {
      cardTitle: 'Preferencias de correo',
      cardBody: 'Elige qué correos no esenciales quieres recibir.',
      marketingLabel: 'Promociones y marketing',
      digestLabel: 'Resumen semanal de estudio',
      productUpdatesLabel: 'Actualizaciones del producto',
      alwaysOnLabel: 'Seguridad y recibos',
      alwaysOnHint:
        'Siempre se envían; son necesarios para la seguridad de la cuenta y los pagos. No se pueden desactivar.',
      savedToast: 'Preferencias guardadas.',
    },
    mobile: {
      title: 'Aprendizaje móvil',
      nativeReady:
        'Este dispositivo puede recibir recordatorios de cursos y enlaces profundos.',
      webReady:
        'Los recordatorios móviles estarán listos cuando abras NexExam desde la app móvil.',
      browser: 'Navegador',
      smartReminders: 'Recordatorios inteligentes de estudio',
      smartRemindersDescription:
        'Usa fechas del plan, tarjetas, rachas y fechas de examen.',
      pushReminders: 'Recordatorios push',
      pushRemindersDescription:
        'Envía recordatorios a tu dispositivo móvil registrado.',
      quietHoursStart: 'Inicio de horas silenciosas',
      quietHoursEnd: 'Fin de horas silenciosas',
      save: 'Guardar ajustes móviles',
      requestPush: 'Activar push',
      syncNow: 'Sincronizar ahora',
      saved: 'Ajustes móviles guardados.',
      pushRequested: 'Registro push actualizado.',
    },
  },

  cookies: {
    bannerTitle: 'Cookies',
    bannerBody:
      'Usamos cookies para mantener tu sesión iniciada y operar el Servicio. Con tu consentimiento también usaremos cookies de analítica y marketing.',
    acceptAll: 'Aceptar todo',
    essentialOnly: 'Solo esenciales',
    customize: 'Personalizar',
    customizeTitle: 'Preferencias de cookies',
    essentialLabel: 'Esenciales',
    essentialBody: 'Necesarias para iniciar sesión y usar el Servicio.',
    analyticsLabel: 'Analytics',
    analyticsBody:
      'Nos ayudan a entender cómo se usa el Servicio. No se venden datos personales.',
    marketingLabel: 'Marketing',
    marketingBody: 'Se usan para medir el impacto de nuestras comunicaciones.',
    save: 'Guardar preferencias',
  },

  signup: {
    dateOfBirthLabel: 'Fecha de nacimiento',
    dateOfBirthHint:
      'Requerida por ley. Solo la usamos para verificar que tienes 13 años o más.',
    termsCheckboxLabel:
      'Acepto los [Términos de servicio]({0}) y la [Política de privacidad]({1}).',
    coppaBlockedTitle: 'No podemos crear tu cuenta',
    coppaBlockedBody:
      'Las cuentas en esta plataforma requieren una edad de {0} años o más. Las cuentas familiares con consentimiento parental llegarán pronto.',
    termsRequiredError:
      'Debes aceptar los Términos de servicio y la Política de privacidad para continuar.',
    privacyRequiredError:
      'Debes aceptar la Política de privacidad para continuar.',
    dobRequiredError: 'Ingresa tu fecha de nacimiento.',
  },
};

export { dictionary };
