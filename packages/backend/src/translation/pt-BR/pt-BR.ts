const dictionary = {
  projectName: 'NexExam',

  shared: {
    showArchived: 'Mostrar arquivados?',
    viewArchived: 'Ver arquivados',
    archive: 'Arquivar',
    restore: 'Restaurar',
    archived: 'Arquivado',
    yes: 'Sim',
    no: 'Não',
    cancel: 'Cancelar',
    save: 'Salvar',
    done: 'Concluído',
    clear: 'Limpar',
    accept: 'Aceitar',
    dashboard: 'Painel',
    new: 'Novo',
    all: 'Todos',
    searchNotFound: 'Nada encontrado.',
    searchPlaceholder: 'Buscar...',
    selectPlaceholder: 'Selecionar uma opção',
    dateFormat: 'DD/MM/YYYY',
    datetimeFormat: 'DD/MM/YYYY HH:mm',
    tagsPlaceholder: 'Digite e pressione Enter para adicionar',
    edit: 'Editar',
    delete: 'Excluir',
    openMenu: 'Abrir menu',
    search: 'Buscar',
    reset: 'Redefinir',
    min: 'Mín',
    max: 'Máx',
    view: 'Visualizar',
    copiedToClipboard: 'Copiado para área de transferência',
    exportToCsv: 'Exportar para CSV',
    import: 'Importar',
    pause: 'Pausar',
    discard: 'Descartar',
    deleted: 'Excluído',
    remove: 'Remover',
    startDate: 'Data inicial',
    endDate: 'Data final',
    close: 'Fechar',
    loading: 'Carregando',
    toggleSidebar: 'Alternar barra lateral',
    breadcrumb: 'navegação estrutural',
    more: 'Mais',
    previousSlide: 'Slide anterior',
    nextSlide: 'Próximo slide',
    refresh: 'Atualizar',

    unsavedChanges: {
      title: 'Alterações não salvas',
      message:
        'Você tem alterações não salvas que serão perdidas se sair desta página.',
      proceed: 'Descartar',
      dismiss: 'Cancelar',
      saveChanges: 'Salvar alterações',
    },

    importer: {
      importHashAlreadyExists: 'Os dados já foram importados',
      title: 'Importar arquivo CSV',
      menu: 'Importar arquivo CSV',
      line: 'Linha',
      status: 'Status',
      pending: 'Pendente',
      success: 'Importado',
      error: 'Erro',
      importedMessage: `Processado {0} de {1}.`,
      noValidRows: 'Não há linhas válidas.',
      noNavigateAwayMessage:
        'Não saia desta página ou a importação será interrompida.',
      uploadFiles: 'Enviar arquivos',
      uploadFilesDisclaimer:
        'Esta importação contém campos de arquivo. Os arquivos serão enviados durante a importação.',
      completed: {
        success:
          'Importação concluída. Todas as linhas foram importadas com sucesso.',
        someErrors:
          'Processamento concluído, mas algumas linhas não puderam ser importadas.',
        allErrors: 'Importação falhou. Não há linhas válidas.',
      },
      form: {
        downloadTemplate: 'Baixar o modelo',
        description:
          'Envie um arquivo CSV para importar dados. Você pode baixar o modelo para ver o formato necessário.',
      },
      list: {
        newConfirm: 'Tem certeza?',
        discardConfirm: 'Tem certeza? Os dados não importados serão perdidos.',
      },
      errors: {
        invalidFileEmpty: 'O arquivo está vazio',
        fileRequired: 'Arquivo é obrigatório',
        uploadFailed: 'Falha ao enviar arquivos',
        partialUpload: 'Apenas {0} de {1} arquivos enviados',
      },
      fileUpload: {
        title: 'Enviando arquivos',
        progress: 'Progresso: {0} / {1}',
        uploading: '{0} enviando',
        completed: '{0} concluído',
        failed: '{0} falhou',
        rowLabel: 'Linha {0} - {1}',
      },
    },

    dataTable: {
      filters: 'Filtros',
      noResults: 'Nenhum resultado encontrado.',
      viewOptions: 'Visualização',
      toggleColumns: 'Alternar colunas',

      sortAscending: 'Asc',
      sortDescending: 'Desc',
      clearSort: 'Limpar',
      hide: 'Ocultar',

      selectAll: 'Selecionar tudo',
      selectRow: 'Selecionar linha',
      paginationRange: '{0}-{1} de {2}',
      paginationSelected: '{0} selecionado(s)',
      paginationRowsPerPage: 'por página',
      pagination: 'paginação',
      goToPreviousPage: 'Ir para página anterior',
      goToNextPage: 'Ir para próxima página',
      morePages: 'Mais páginas',
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
      placeholder: 'Selecionar um idioma',
      searchEmpty: 'Nenhum idioma encontrado.',
    },

    theme: {
      toggle: 'Tema',
      light: 'Claro',
      dark: 'Escuro',
      system: 'Sistema',
    },

    errors: {
      previewMode: 'Este recurso não está disponível no modo de visualização.',
      timezone: 'Fuso horário inválido',
      invalid: `{0} é inválido`,
      unknown: 'Ocorreu um erro',
      unique: `{0} deve ser único`,
      staleData:
        'O registro foi atualizado por outro usuário. Por favor, atualize e tente novamente.',
      copyToClipboard: 'Falha ao copiar para a área de transferência',
      tooManyRequests: 'Muitas solicitações. Tente novamente mais tarde.',
    },
  },

  apiKey: {
    docs: {
      menu: 'Documentação da API',
    },
    edit: {
      menu: 'Editar chave de API',
      title: 'Editar chave de API',
      success: 'Chave de API atualizada com sucesso',
      error: 'Falha ao atualizar chave de API',
    },
    new: {
      menu: 'Nova chave de API',
      title: 'Nova chave de API',
      success: 'Chave de API criada com sucesso',
      error: 'Falha ao criar chave de API',
      warning: {
        title: 'Salve sua chave de API',
        message:
          'Esta é a única vez que você verá esta chave de API. Por favor, copie e armazene com segurança.',
      },
      restrictPermissions: 'Restringir permissões',
      allowAllPermissions: 'Permitir todas as permissões',
      permissionsDisclaimer:
        'Nota: Você deve ter as permissões selecionadas na organização para que sejam efetivas.',
    },
    list: {
      menu: 'Chaves de API',
      title: 'Chaves de API',
      noResults: 'Nenhuma chave de API encontrada.',
    },
    delete: {
      confirmTitle: 'Excluir chave de API?',
      confirmDescription:
        'Tem certeza de que deseja excluir esta chave de API? Esta ação não pode ser desfeita.',
      success: 'Chave de API excluída com sucesso',
    },
    enumerators: {
      status: {
        enabled: 'Habilitada',
        disabled: 'Desabilitada',
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
        permission: 'permissão',
        permissions: 'permissões',
        invalid: 'Inválido',
      },
    },
    fields: {
      apiKey: 'Chave de API',
      member: 'Usuário',
      name: 'Nome',
      namePlaceholder: 'Minha chave de API',
      keyPreview: 'Visualização da chave',
      expiresAt: 'Expira em',
      expiresAtPlaceholder: 'Nunca expira (deixar vazio)',
      expiresAtMin:
        'A data de expiração deve ser pelo menos {0} dia(s) no futuro',
      expiresAtMax:
        'A data de expiração não pode ser mais de {0} dia(s) no futuro',
      status: 'Status',
      enabled: 'Habilitada',
      remaining: 'Restante',
      lastUsed: 'Último uso',
      createdAt: 'Criado em',
      permissions: 'Permissões',
      permissionsPlaceholder: 'Selecionar permissões',
      permissionsRequired: 'Pelo menos uma permissão é necessária',
    },
    errors: {
      fetch: 'Falha ao buscar chaves de API',
      delete: 'Falha ao excluir chave de API',
      notFound: 'Chave de API não encontrada',
      permissionDenied: 'Você não tem permissão para conceder {0}:{1}',
      organizationRequired: 'ID da organização é obrigatório',
      createFailed: 'Falha ao criar chave de API',
      listFailed: 'Falha ao listar chaves de API',
    },
  },

  file: {
    button: 'Enviar',
    delete: 'Excluir',
    dropzone: {
      dragAndDrop: 'Arrastar e soltar arquivos aqui',
      dropFiles: 'Soltar arquivos aqui',
      uploadFiles: 'Você pode enviar {0} arquivo{1}.',
      upTo: 'Até {0}.',
      eachUpTo: 'Cada um até {0}.',
      accepted: '{0} aceito(s).',
      uploading: 'Enviando...',
      uploadSuccessful: 'Envio bem-sucedido',
    },
    errors: {
      formats: `Formato inválido. Deve ser um de: {0}.`,
      notImage: `O arquivo deve ser uma imagem`,
      tooBig: `O arquivo é muito grande. O tamanho atual é {0} bytes, o tamanho máximo é {1} bytes`,
      invalidFilename: 'Nome de arquivo inválido',
    },
  },

  dashboard: {
    searchLabel: 'Pesquisar conteúdo de aprendizagem',
    searchPlaceholder: 'Pesquise cursos, tópicos, recursos...',
    notifications: 'Notificações',
    learnerRole: 'Estudante',
    superAdminRole: 'Superadministrador',
    fallbackName: 'Estudante',
    viewSwitcher: {
      title: 'Trocar visualização',
      superAdmin: 'Admin',
      student: 'Estudante',
      creator: 'Professor',
    },
    student: {
      menu: 'Painel do estudante',
      role: 'Estudante',
    },
    creator: {
      menu: 'Painel do criador',
      role: 'Professor criador',
      welcome: 'Boas-vindas de volta, {0}',
      title: 'Construa sua jornada como professor criador',
      subtitle:
        'Solicite verificação, acompanhe o status e prepare cursos para o catálogo de aprendizagem da NexExam.',
      applicationTitle: 'Status da verificação',
      applicationEmpty:
        'Inicie sua solicitação de criador para que a equipe da NexExam revise suas credenciais e foco de ensino.',
      applicationPending:
        'Sua solicitação de criador está em análise. Você pode atualizar os detalhes enquanto a equipe avalia.',
      applicationApproved:
        'Seu perfil de criador foi aprovado. A publicação de cursos controlada por administradores continua ativa na Fase 1.',
      applicationRejected:
        'Sua solicitação precisa de alterações antes da aprovação. Revise as notas do administrador e reenvie o perfil.',
      startApplication: 'Iniciar solicitação',
      editApplication: 'Atualizar solicitação',
      workspaceTitle: 'Espaço de cursos',
      workspaceBody:
        'A criação de cursos por criadores fica separada da experiência dos estudantes. A publicação self-service abre depois que os fluxos de verificação estiverem estáveis.',
      reviewTitle: 'Revisão administrativa',
      reviewBody:
        'Superadministradores da NexExam revisam solicitações, qualidade dos cursos, matrículas e pagamentos pelo painel de administração.',
      deferredTitle: 'Limite da Fase 1',
      deferredBody:
        'Criação com arrastar e soltar e divisão automática de receita ficam adiadas enquanto o ciclo de matrícula é lançado.',
      metricsTitle: 'Creator metrics',
      metricsBody:
        'Track enrollments, completion, AI usage, ratings, and earnings across your courses.',
    },
    welcome: 'Boas-vindas de volta, {0}',
    heroTitle: 'Continue sua jornada de aprendizagem com IA',
    heroSubtitle: 'Aprendizagem personalizada. Mais inteligente a cada dia.',
    continueLearning: 'Continuar aprendendo',
    askTutor: 'Perguntar ao tutor de IA',
    viewAllCourses: 'Ver todos os cursos',
    viewAll: 'Ver tudo',
    recommendedForYou: 'Recomendado para você',
    aiTutorTitle: 'Tutor de IA',
    online: 'Online',
    aiTutorGreeting: 'Olá! Sou seu tutor de IA.',
    aiTutorPrompt: 'Como posso ajudar hoje?',
    tutorActions: [
      'Explicar um conceito',
      'Criar um quiz sobre este tópico',
      'Recomendar recursos',
    ],
    learningProgress: 'Progresso de aprendizagem',
    thisWeek: 'Esta semana',
    totalStudyTime: 'Tempo total de estudo',
    noEnrolledCoursesTitle: 'Comece seu primeiro curso',
    noEnrolledCoursesDescription:
      'Matricule-se em um curso publicado para ver suas aulas, tarefas e progresso com o tutor de IA aqui.',
    noRecommendationsTitle: 'Ainda não há recomendações',
    noRecommendationsDescription:
      'Novos cursos publicados aparecerão aqui quando estiverem disponíveis para matrícula.',
    enrolledCoursesStat: 'Cursos matriculados',
    completedLessonsStat: 'Aulas concluídas',
    submittedAssignmentsStat: 'Tarefas enviadas',
    averageProgressStat: 'Progresso médio',
    lessonProgress: '{0} de {1} aulas',
    assignmentProgress: '{0} de {1} tarefas',
    progressComplete: '{0}% concluído',
    recommendationMeta: '{0} aulas • {1} tarefas',
    nextLesson: 'Próxima aula',
    noLessons: 'Todas as aulas concluídas',
    weekdays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    courses: [
      {
        title: 'Introdução à inteligência artificial',
        meta: 'Módulo 4 • Fundamentos de machine learning',
        progress: '65%',
      },
      {
        title: 'Estruturas de dados e algoritmos',
        meta: 'Módulo 3 • Árvores e grafos',
        progress: '40%',
      },
      {
        title: 'Fundamentos de design UI/UX',
        meta: 'Módulo 2 • Princípios de design',
        progress: '20%',
      },
    ],
    recommendations: [
      {
        title: 'Fundamentos de deep learning',
        meta: 'Curso • Intermediário',
        rating: '4.8 (320)',
      },
      {
        title: 'SQL para análise de dados',
        meta: 'Curso • Iniciante',
        rating: '4.7 (210)',
      },
      {
        title: 'Masterclass de programação em Python',
        meta: 'Curso • Iniciante',
        rating: '4.9 (421)',
      },
    ],
  },

  studentExperience: {
    menu: {
      myCourses: 'Meus cursos',
      practice: 'Prática',
      notesStudyPlan: 'Notas / Plano de estudo',
      aiTutor: 'AI Tutor',
      courseOverview: 'Visão geral do curso',
    },
    title: 'Painel do estudante',
    subtitle:
      'Mantenha o foco na próxima aula, nas tarefas, na prática e no apoio de IA para seus cursos inscritos.',
    heroTitle: 'Seu próximo melhor passo de estudo está pronto',
    heroSubtitle:
      'O NexExam mantém progresso do curso, tarefas, prática, notas e preparo em um só lugar.',
    continueLesson: 'Continuar aula',
    continueCourse: 'Continuar curso',
    askCourseTutor: 'Perguntar ao tutor do curso',
    openCourseOverview: 'Abrir visão geral',
    startPractice: 'Iniciar prática',
    continuePractice: 'Continuar prática',
    completePractice: 'Concluir prática',
    submitAnswer: 'Enviar resposta',
    viewCoursePlayer: 'Abrir player',
    addNote: 'Adicionar nota',
    saveNote: 'Salvar nota',
    addStudyPlanItem: 'Adicionar item ao plano',
    saveStudyPlanItem: 'Salvar item do plano',
    markComplete: 'Marcar como concluído',
    readinessScore: 'Pontuação de preparo para o exame',
    readinessInsufficient: 'Precisa de mais prática ou dados do exame',
    readinessReady: 'Dados suficientes disponíveis',
    myCourses: 'Meus cursos',
    upcomingHomework: 'Tarefas próximas',
    practiceQuestions: 'Perguntas de prática',
    notesAndStudyPlan: 'Notas + Plano de estudo',
    recentNotes: 'Notas recentes',
    todayPlan: 'Plano de hoje',
    progress: 'Progresso',
    homework: 'Tarefas',
    notes: 'Notas',
    studyPlan: 'Plano de estudo',
    mobile: {
      savedOffline:
        'Salvo offline. Será sincronizado quando você voltar a ficar online.',
      syncFailed: 'Falha na sincronização',
      continueLearning: 'Continuar aprendendo',
      offlineStatus: {
        online: 'Online',
        offline: 'Modo offline: as alterações são salvas neste dispositivo.',
        syncing: 'Sincronizando trabalho móvel salvo...',
        synced: 'Trabalho móvel sincronizado.',
        failed:
          'Parte do trabalho móvel precisa de outra tentativa de sincronização.',
      },
    },
    adaptivePlan: {
      title: 'Plano de estudo adaptativo',
      body: 'Defina seu objetivo e o NexExam transforma preparo, pontos fracos, tarefas e historico de pratica em acoes focadas.',
      badge: 'Guiado por IA',
      examNameLabel: 'Exame ou objetivo',
      examNamePlaceholder: 'Certificacao, prova final ou resultado desejado',
      targetExamDateLabel: 'Data-alvo do exame',
      weakAreasLabel: 'Pontos fracos atuais',
      noWeakAreas: 'Complete praticas para revelar pontos fracos.',
      generate: 'Gerar plano adaptativo',
      regenerate: 'Atualizar plano adaptativo',
      itemsCreated: '{0} tarefa(s) adaptativa(s) adicionada(s).',
      itemTitles: {
        diagnostic: 'Complete seu diagnostico inicial',
        weakArea: 'Fortalecer ponto fraco: {0}',
        homework: 'Concluir tarefa: {0}',
        lesson: 'Continuar aula: {0}',
        practice: 'Perguntas de pratica para {0}',
        maintain: 'Manter preparo para {0}',
      },
      itemDescriptions: {
        diagnostic:
          'Responda perguntas de pratica de {0} para o NexExam calibrar seu preparo.',
        weakArea: 'Revise explicacoes e refaca pratica focada em {0}.',
        homework: 'Conclua ou revise {0} antes de adicionar novo conteudo.',
        lesson: 'Avance por {0} e marque a aula como concluida ao terminar.',
        practice:
          'Use uma sessao de pratica focada para confirmar seu dominio de {0}.',
        maintain:
          'Mantenha o ritmo com uma revisao curta, notas e pratica para {0}.',
      },
    },
    learningOutcomes: {
      title: 'Resultados de aprendizagem',
      body: 'Use diagnosticos, dominio, revisao, remediacao e simulacao de exame para transformar progresso em preparo mensuravel.',
      badge: 'Motor de resultados',
      summary: {
        masteryAverage: 'Media de dominio',
        dueFlashcards: 'Cards pendentes',
        streak: 'Sequencia de estudo',
        mockExam: 'Simulado',
      },
      diagnostic: {
        title: 'Diagnostico adaptativo',
        body: 'Inicie uma linha de base para o NexExam mapear seus dominios fortes e fracos.',
        start: 'Iniciar diagnostico',
        restart: 'Refazer diagnostico',
        submit: 'Salvar resposta',
        complete: 'Concluir diagnostico',
        answered: '{0} de {1} respondidas',
        lastScore: 'Ultimo diagnostico: {0}% em {1} perguntas',
        noQuestions:
          'Adicione perguntas aprovadas antes de executar diagnosticos.',
      },
      mastery: {
        title: 'Mapa de dominio por area',
        empty:
          'Complete diagnosticos, praticas ou simulados para criar um mapa de dominio.',
        evidence: '{0} ponto(s) de evidencia',
        confidence: {
          low: 'Baixa confianca',
          medium: 'Media confianca',
          high: 'Alta confianca',
        },
        actions: {
          diagnose: 'Precisa de uma linha de base diagnostica.',
          remediate: 'Priorize remediacao antes de novas aulas.',
          practice: 'Pratique ate estabilizar a pontuacao.',
          maintain: 'Mantenha com revisao espacada.',
        },
      },
      flashcards: {
        title: 'Repeticao espacada',
        dueCount: '{0} de {1} card(s) pendente(s)',
        nextDue: 'Proximo em {0}',
        inSet: 'De {0}',
        flip: 'Virar card',
        empty: 'Nenhum card pendente agora.',
        openPlayer: 'Abrir cards',
        ratings: {
          again: 'De novo',
          hard: 'Dificil',
          good: 'Bom',
          easy: 'Facil',
        },
      },
      streak: {
        dayCount: '{0} dia(s)',
      },
      remediation: {
        title: 'Remediacao de pontos fracos',
        body: 'Gere um plano curto para o dominio que mais reduz seu preparo.',
        generate: 'Gerar plano de remediacao',
        refresh: 'Atualizar plano de remediacao',
        noWeakDomains: 'Nenhum dominio fraco detectado ainda.',
        planTitle: 'Sprint de remediacao: {0}',
        planDescription: 'Revisao, pratica e recordacao focadas para {0}.',
        itemsCreated: '{0} tarefa(s) de remediacao adicionada(s).',
        itemTitles: {
          review: 'Revisar fundamentos: {0}',
          practice: 'Praticar dominio fraco: {0}',
          recall: 'Checagem de recordacao: {0}',
        },
        itemDescriptions: {
          review: 'Reveja aulas, notas e explicacoes relacionadas a {0}.',
          practice:
            'Responda perguntas focadas e revise explicacoes de erros em {0}.',
          recall:
            'Use cards ou uma autoavaliacao curta para confirmar retencao em {0}.',
        },
      },
      schedule: {
        title: 'Calendario de estudo',
        empty: 'Ainda nao ha tarefas de estudo agendadas.',
        flashcardsTitle: '{0} card(s) pendente(s)',
      },
      mockExams: {
        title: 'Simulacao de exame',
        noExams: 'Ainda nao ha simulados prontos para este curso.',
        available: 'Disponiveis',
        simulations: 'Simulacoes',
        bestScore: 'Melhor pontuacao',
        lastScore: 'Ultima pontuacao',
        openPlayer: 'Abrir simulados',
      },
    },
    noCoursesTitle: 'Inscreva-se no seu primeiro curso',
    noCoursesBody:
      'Os cursos publicados em que você se inscrever aparecerão aqui com progresso, tarefas, prática e contexto do tutor de IA.',
    noHomework: 'Não há tarefas próximas.',
    noPractice: 'Ainda não há perguntas de prática prontas para este curso.',
    noNotes: 'Ainda não há notas.',
    noStudyPlan: 'Ainda não há itens no plano de estudo.',
    emptyPracticeAttempt:
      'Inicie uma sessão de prática para responder perguntas do curso.',
    noteTitlePlaceholder: 'Título da nota',
    noteContentPlaceholder: 'O que você quer lembrar?',
    studyPlanTitlePlaceholder: 'Tarefa de estudo',
    studyPlanDescriptionPlaceholder: 'Detalhes opcionais',
    plannedForDate: 'Data planejada',
    answerOptions: 'Opções de resposta',
    selectedAnswer: 'Resposta selecionada',
    correctAnswer: 'Resposta correta',
    explanation: 'Explicação',
    score: '{0}%',
    lessonsProgress: '{0} de {1} aulas concluídas',
    answeredProgress: '{0} de {1} respondidas',
    homeworkProgress: '{0} concluídas • {1} abertas',
    practiceAccuracy: '{0}% de precisão',
    attemptsCount: '{0} tentativa(s)',
    availableQuestionCount: '{0} pergunta(s) disponível(is)',
    nextAction: {
      lesson: 'Continuar {0}',
      homework: 'Finalizar tarefa: {0}',
      practice: 'Praticar {0}',
      none: 'Explorar cursos',
    },
    homeworkStatus: {
      open: 'Aberta',
      dueSoon: 'Vence em breve',
      overdue: 'Atrasada',
      submitted: 'Enviada',
      complete: 'Concluída',
      needsRevision: 'Precisa de revisão',
    },
    practiceStatus: {
      active: 'Em andamento',
      completed: 'Concluída',
    },
    signals: {
      courseProgress: 'Progresso do curso',
      homework: 'Tarefas',
      practice: 'Prática',
      exam: 'Tentativas de exame',
      recentActivity: 'Atividade recente',
    },
    suggestions: {
      lesson: 'Revisar aula: {0}',
      homework: 'Trabalhar na tarefa: {0}',
      practice: 'Perguntas de prática para {0}',
    },
    aiPrompts: [
      'Explique minha próxima aula',
      'Faça um quiz deste curso',
      'Crie um plano de estudo',
    ],
    success: {
      noteSaved: 'Nota salva.',
      studyPlanSaved: 'Item do plano de estudo salvo.',
      studyPlanUpdated: 'Plano de estudo atualizado.',
      adaptivePlanGenerated: 'Plano de estudo adaptativo atualizado.',
      diagnosticStarted: 'Diagnostico iniciado.',
      diagnosticCompleted: 'Diagnostico concluido.',
      flashcardReviewed: 'Revisao do card salva.',
      remediationGenerated: 'Plano de remediacao adicionado.',
      answerSaved: 'Resposta salva.',
      practiceCompleted: 'Prática concluída.',
    },
    errors: {
      noPractice:
        'Não há perguntas de prática respondíveis disponíveis para este curso.',
      practiceComplete: 'Esta tentativa de prática já foi concluída.',
      invalidAnswer: 'Escolha uma opção de resposta válida.',
      diagnosticIncomplete:
        'Responda todas as perguntas do diagnostico antes de concluir.',
    },
  },

  auth: {
    layout: {
      brandName: 'NexExam',
      heroTitle: 'Desbloqueie seu aprendizado espacial.',
      heroSubtitle:
        'A próxima geração da educação, criada para a web espacial. Mais inteligente, intuitiva e perfeitamente sua.',
      authTabsLabel: 'Opções de autenticação',
      aiTutorTitle: 'Tutor de IA',
      aiTutorDescription: 'Sempre disponível',
      flowStateTitle: 'Estado de fluxo',
      flowStateDescription: 'Sem distrações',
      insightsTitle: 'Insights',
      insightsDescription: 'Métricas em tempo real',
      secureFooter: 'Protegido por criptografia avançada.',
    },
    signIn: {
      oauthError:
        'Não é possível fazer login com este provedor. Por favor, use outro.',
      title: 'Entrar',
      cardTitle: 'Bem-vindo de volta',
      cardSubtitle: 'Insira seus dados para acessar seu painel.',
      menu: 'Entrar',
      button: 'Entrar com e-mail',
      success: 'Login realizado com sucesso',
      signingIn: 'Entrando...',
      email: 'E-mail',
      password: 'Senha',
      socialHeader: 'Ou continuar com',
      google: 'Google',
      passwordResetRequestLink: 'Esqueceu a senha?',
      signUpLink: `Não tem conta? Criar uma`,
      studentSignUpLink: `Precisa de uma conta de estudante? Cadastre-se como estudante`,
      creatorSignUpLink: `Quer ensinar? Cadastre-se como criador`,
    },
    signUp: {
      title: 'Cadastrar',
      menu: 'Cadastrar',
      studentMenu: 'Cadastro de estudante',
      creatorMenu: 'Cadastro de criador',
      studentTab: 'Estudante',
      creatorTab: 'Criador',
      studentTitle: 'Cadastro de estudante',
      creatorTitle: 'Cadastro de criador',
      studentCardTitle: 'Entrar como estudante',
      creatorCardTitle: 'Entrar como criador',
      cardSubtitle: 'Crie uma conta para iniciar sua jornada.',
      studentSubtitle:
        'Matricule-se em cursos preparatórios, conclua aulas, envie tarefas e estude com apoio de IA.',
      creatorSubtitle:
        'Solicite ser um professor verificado e prepare-se para publicar cursos da NexExam após a aprovação.',
      signInLink: 'Já tem conta? Entrar',
      button: 'Cadastrar',
      success: 'Cadastro realizado com sucesso',
      email: 'E-mail',
      password: 'Senha',
      invitationEmailLocked:
        'Este e-mail está bloqueado porque você está se cadastrando via convite.',
    },
    verifyEmailRequest: {
      title: 'Reenviar verificação de e-mail',
      button: 'Reenviar verificação de e-mail',
      message:
        'Por favor, confirme seu e-mail em <strong>{0}</strong> para continuar.',
      success: 'Verificação de e-mail enviada com sucesso!',
      noEmail:
        'Nenhum endereço de e-mail fornecido. Por favor, cadastre-se ou faça login.',
    },
    verifyEmailConfirm: {
      title: 'Verificar e-mail',
      success: 'E-mail verificado com sucesso.',
      loadingMessage: 'Aguarde um momento, seu e-mail está sendo verificado...',
    },
    passwordResetRequest: {
      title: 'Esqueci a senha',
      signInLink: 'Cancelar',
      button: 'Enviar e-mail de redefinição de senha',
      email: 'E-mail',
      success: 'E-mail de redefinição de senha enviado com sucesso',
    },
    passwordResetConfirm: {
      title: 'Redefinir senha',
      signInLink: 'Cancelar',
      button: 'Redefinir senha',
      password: 'Senha',
      success: 'Senha alterada com sucesso',
    },
    noPermissions: {
      title: 'Sem permissões',
      message:
        'Você ainda não tem permissões. Por favor, aguarde o administrador conceder privilégios.',
    },
    invitation: {
      title: 'Convite',
      success: 'Convite aceito com sucesso',
      loadingMessage: 'Aguarde um momento, estamos aceitando o convite...',
      invalidToken: 'Token de convite expirado ou inválido.',
      errors: {
        INVITATION_EMAIL_MISMATCH:
          'Este convite foi enviado para outro endereço de e-mail. Por favor, faça login com a conta correta.',
        INVITATION_EXPIRED: 'Este convite expirou',
        INVITATION_NOT_PENDING: 'Este convite já foi aceito ou cancelado',
      },
    },
    organization: {
      title: 'Organização',
      create: {
        name: 'Nome da organização',
        success: 'Organização criada com sucesso',
        button: 'Criar organização',
      },
      select: {
        organization: 'Selecionar uma organização',
        joinSuccess: 'Organização acessada com sucesso',
        select: 'Selecionar organização',
        continue: 'Continuar',
        autoSelecting: 'Selecionando organização...',
      },
      invitationAccepted: 'Convite aceito com sucesso',
      invitationAcceptError: 'Falha ao aceitar convite',
      acceptingInvitation: 'Aceitando convite...',
      invitationRejected: 'Convite rejeitado',
      invitationRejectError: 'Falha ao rejeitar convite',
      rejectingInvitation: 'Rejeitando convite...',
      rejectInvitation: 'Rejeitar',
      rejectInvitationTitle: 'Rejeitar convite?',
      rejectInvitationDescription:
        'Tem certeza de que deseja rejeitar este convite? Esta ação não pode ser desfeita.',
      invitations: 'Convites',
      pendingInvitation: 'Convite pendente',
    },
    passwordChange: {
      title: 'Alterar senha',
      menu: 'Alterar senha',
      oldPassword: 'Senha antiga',
      newPassword: 'Nova senha',
      newPasswordConfirmation: 'Confirmação da nova senha',
      button: 'Salvar senha',
      success: 'Senha salva com sucesso',
      mustMatch: 'As senhas devem coincidir',
      cancel: 'Cancelar',
    },
    emailChange: {
      title: 'Alterar e-mail',
      menu: 'Alterar e-mail',
      newEmail: 'Novo e-mail',
      button: 'Alterar e-mail',
      success:
        'E-mail de verificação enviado. Verifique seu e-mail atual para aprovar.',
      confirmSuccess: 'E-mail alterado com sucesso',
      confirmStepTwo:
        'Enviamos um e-mail de verificação para <strong>{0}</strong>. Verifique sua caixa de entrada para concluir a alteração.',
      cancel: 'Cancelar',
      loadingMessage:
        'Aguarde um momento, sua alteração de e-mail está sendo confirmada...',
    },
    emailChangeConfirm: {
      title: 'Confirmar alteração de e-mail',
      confirmSuccess: 'E-mail alterado com sucesso',
      loadingMessage:
        'Aguarde um momento, sua alteração de e-mail está sendo confirmada...',
    },
    profile: {
      title: 'Perfil',
      menu: 'Perfil',
      email: 'E-mail atual',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Habilitar notificações',
      isNotificationsEnabledHint:
        'Receber notificações por e-mail e push para atualizações e atividades importantes em sua organização',
      button: 'Salvar perfil',
      success: 'Perfil salvo com sucesso',
      cancel: 'Cancelar',
    },
    profileOnboard: {
      firstName: 'Nome',
      lastName: 'Sobrenome',
      avatars: 'Avatar',
      isNotificationsEnabled: 'Habilitar notificações',
      isNotificationsEnabledHint:
        'Receber notificações por e-mail e push para atualizações e atividades importantes',
      button: 'Salvar perfil',
      success: 'Perfil salvo com sucesso',
    },
    signOut: {
      menu: 'Sair',
      button: 'Sair',
      title: 'Sair',
      loading: `Saindo...`,
    },
    errors: {
      invalidPasswordResetToken:
        'O link de redefinição de senha é inválido ou expirou',
      invalidVerifyEmailToken:
        'O link de verificação de e-mail é inválido ou expirou',

      USER_NOT_FOUND: 'Usuário não encontrado',
      FAILED_TO_CREATE_USER: 'Falha ao criar usuário',
      FAILED_TO_CREATE_SESSION: 'Falha ao criar sessão',
      FAILED_TO_UPDATE_USER: 'Falha ao atualizar usuário',
      FAILED_TO_GET_SESSION: 'Falha ao obter sessão',
      INVALID_PASSWORD: 'Senha inválida',
      INVALID_EMAIL: 'E-mail inválido',
      INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha inválido',
      SOCIAL_ACCOUNT_ALREADY_LINKED: 'Conta social já vinculada',
      PROVIDER_NOT_FOUND: 'Provedor não encontrado',
      INVALID_TOKEN: 'Token inválido',
      ID_TOKEN_NOT_SUPPORTED: 'Token de ID não suportado',
      FAILED_TO_GET_USER_INFO: 'Falha ao obter informações do usuário',
      USER_EMAIL_NOT_FOUND: 'E-mail do usuário não encontrado',
      EMAIL_NOT_VERIFIED: 'E-mail não verificado',
      CANNOT_REMOVE_ADMIN_WITH_SUBSCRIPTION:
        'Não é possível excluir administrador ou remover função de administrador enquanto a organização tiver uma assinatura ativa',
      CANNOT_REMOVE_SELF: 'Você não pode se remover da organização',
      PASSWORD_TOO_SHORT: 'Senha muito curta',
      PASSWORD_TOO_LONG: 'Senha muito longa',
      USER_ALREADY_EXISTS: 'Usuário já existe',
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        'Usuário já existe. Use outro e-mail',
      EMAIL_CAN_NOT_BE_UPDATED: 'O e-mail não pode ser atualizado',
      CREDENTIAL_ACCOUNT_NOT_FOUND: 'Conta de credencial não encontrada',
      SESSION_EXPIRED: 'Sessão expirada',
      FAILED_TO_UNLINK_LAST_ACCOUNT: 'Falha ao desvincular última conta',
      ACCOUNT_NOT_FOUND: 'Conta não encontrada',
      USER_ALREADY_HAS_PASSWORD: 'Usuário já possui senha',
      INVALID_METADATA_TYPE: 'Tipo de metadados inválido',
      REFILL_AMOUNT_AND_INTERVAL_REQUIRED:
        'Valor e intervalo de recarga obrigatórios',
      REFILL_INTERVAL_AND_AMOUNT_REQUIRED:
        'Intervalo e valor de recarga obrigatórios',
      USER_BANNED: 'Usuário banido',
      UNAUTHORIZED_SESSION: 'Sessão não autorizada',
      KEY_NOT_FOUND: 'Chave não encontrada',
      KEY_DISABLED: 'Chave desabilitada',
      KEY_EXPIRED: 'Chave expirada',
      USAGE_EXCEEDED: 'Uso excedido',
      KEY_NOT_RECOVERABLE: 'Chave não recuperável',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION:
        'Você não tem permissão para criar uma nova organização',
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS:
        'Você atingiu o número máximo de organizações',
      ORGANIZATION_ALREADY_EXISTS: 'Organização já existe',
      ORGANIZATION_NOT_FOUND: 'Organização não encontrada',
      USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION:
        'Usuário não é membro da organização',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION:
        'Você não tem permissão para atualizar esta organização',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION:
        'Você não tem permissão para excluir esta organização',
      NO_ACTIVE_ORGANIZATION: 'Nenhuma organização ativa',
      USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION:
        'Usuário já é membro desta organização',
      MEMBER_NOT_FOUND: 'Membro não encontrado',
      ROLE_NOT_FOUND: 'Função não encontrada',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM:
        'Você não tem permissão para criar uma nova equipe',
      TEAM_ALREADY_EXISTS: 'Equipe já existe',
      TEAM_NOT_FOUND: 'Equipe não encontrada',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER:
        'Você não pode deixar a organização como único administrador',
      YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER:
        'Você não pode deixar a organização sem um proprietário',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER:
        'Você não tem permissão para excluir este membro',
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION:
        'Você não tem permissão para convidar usuários para esta organização',
      USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION:
        'Usuário já foi convidado para esta organização',
      INVITATION_NOT_FOUND: 'Convite não encontrado',
      INVITATION_EMAIL_MISMATCH:
        'Este convite foi enviado para outro endereço de e-mail. Por favor, faça login com a conta correta.',
      INVITATION_EXPIRED: 'Este convite expirou',
      INVITATION_NOT_PENDING: 'Este convite já foi aceito ou cancelado',
      YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION:
        'Você não é o destinatário do convite',
      EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION:
        'Verificação de e-mail necessária antes de aceitar ou rejeitar o convite',
      YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION:
        'Você não tem permissão para cancelar este convite',
      INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION:
        'O remetente do convite não é mais membro da organização',
      YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE:
        'Você não tem permissão para convidar usuário com esta função',
      FAILED_TO_RETRIEVE_INVITATION: 'Falha ao recuperar convite',
      YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS:
        'Você atingiu o número máximo de equipes',
      UNABLE_TO_REMOVE_LAST_TEAM: 'Não é possível remover a última equipe',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER:
        'Você não tem permissão para atualizar este membro',
      ORGANIZATION_MEMBERSHIP_LIMIT_REACHED:
        'Limite de membros da organização atingido',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION:
        'Você não tem permissão para criar equipes nesta organização',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION:
        'Você não tem permissão para excluir equipes nesta organização',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM:
        'Você não tem permissão para atualizar esta equipe',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM:
        'Você não tem permissão para excluir esta equipe',
      INVITATION_LIMIT_REACHED: 'Limite de convites atingido',
      YOU_CANNOT_BAN_YOURSELF: 'Você não pode banir a si mesmo',
      YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE:
        'Você não tem permissão para alterar função de usuários',
      YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS:
        'Você não tem permissão para criar usuários',
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS:
        'Você não tem permissão para listar usuários',
      YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS:
        'Você não tem permissão para listar sessões de usuários',
      YOU_ARE_NOT_ALLOWED_TO_BAN_USERS:
        'Você não tem permissão para banir usuários',
      YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS:
        'Você não tem permissão para personificar usuários',
      YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS:
        'Você não tem permissão para revogar sessões de usuários',
      YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS:
        'Você não tem permissão para excluir usuários',
      YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD:
        'Você não tem permissão para definir senha de usuários',
      BANNED_USER: 'Você foi banido desta aplicação',
      YOU_ARE_NOT_ALLOWED_TO_GET_USER:
        'Você não tem permissão para obter usuário',
      NO_DATA_TO_UPDATE: 'Nenhum dado para atualizar',
      YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS:
        'Você não tem permissão para atualizar usuários',
      YOU_CANNOT_REMOVE_YOURSELF: 'Você não pode se remover',
      COULD_NOT_CREATE_SESSION: 'Não foi possível criar sessão',
      ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY:
        'Usuários anônimos não podem fazer login novamente anonimamente',
      CHALLENGE_NOT_FOUND: 'Desafio não encontrado',
      YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY:
        'Você não tem permissão para registrar esta chave de acesso',
      FAILED_TO_VERIFY_REGISTRATION: 'Falha ao verificar registro',
      PASSKEY_NOT_FOUND: 'Chave de acesso não encontrada',
      AUTHENTICATION_FAILED: 'Autenticação falhou',
      UNABLE_TO_CREATE_SESSION: 'Não é possível criar sessão',
      FAILED_TO_UPDATE_PASSKEY: 'Falha ao atualizar chave de acesso',
      INVALID_PHONE_NUMBER: 'Número de telefone inválido',
      PHONE_NUMBER_EXIST: 'Número de telefone já existe',
      INVALID_PHONE_NUMBER_OR_PASSWORD: 'Número de telefone ou senha inválido',
      UNEXPECTED_ERROR: 'Erro inesperado',
      OTP_NOT_FOUND: 'OTP não encontrado',
      OTP_EXPIRED: 'OTP expirado',
      INVALID_OTP: 'OTP inválido',
      PHONE_NUMBER_NOT_VERIFIED: 'Número de telefone não verificado',
      INVALID_DEVICE_CODE: 'Código de dispositivo inválido',
      EXPIRED_DEVICE_CODE: 'Código de dispositivo expirado',
      EXPIRED_USER_CODE: 'Código de usuário expirado',
      AUTHORIZATION_PENDING: 'Autorização pendente',
      ACCESS_DENIED: 'Acesso negado',
      INVALID_USER_CODE: 'Código de usuário inválido',
      DEVICE_CODE_ALREADY_PROCESSED: 'Código de dispositivo já processado',
      POLLING_TOO_FREQUENTLY: 'Consultando com muita frequência',
      INVALID_DEVICE_CODE_STATUS: 'Status de código de dispositivo inválido',
      AUTHENTICATION_REQUIRED: 'Autenticação necessária',
      OTP_NOT_ENABLED: 'OTP não habilitado',
      OTP_HAS_EXPIRED: 'OTP expirou',
      TOTP_NOT_ENABLED: 'TOTP não habilitado',
      TWO_FACTOR_NOT_ENABLED: 'Autenticação de dois fatores não habilitada',
      BACKUP_CODES_NOT_ENABLED: 'Códigos de backup não habilitados',
      INVALID_BACKUP_CODE: 'Código de backup inválido',
      INVALID_CODE: 'Código inválido',
      TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE:
        'Muitas tentativas. Solicitar novo código',
      INVALID_TWO_FACTOR_COOKIE: 'Cookie de dois fatores inválido',
      INVALID_USERNAME_OR_PASSWORD: 'Nome de usuário ou senha inválido',
      USERNAME_IS_ALREADY_TAKEN: 'Nome de usuário já está em uso',
      USERNAME_TOO_SHORT: 'Nome de usuário muito curto',
      USERNAME_TOO_LONG: 'Nome de usuário muito longo',
      INVALID_USERNAME: 'Nome de usuário inválido',
      INVALID_DISPLAY_USERNAME: 'Nome de exibição inválido',
      TOO_MANY_ATTEMPTS: 'Muitas tentativas',
      PASSWORD_COMPROMISED: 'Senha comprometida',
      INVALID_OAUTH_CONFIGURATION: 'Configuração OAuth inválida',
      INVALID_SESSION_TOKEN: 'Token de sessão inválido',

      EXPIRES_IN_IS_TOO_SMALL:
        'A data de expiração é menor que o valor mínimo predefinido.',
      EXPIRES_IN_IS_TOO_LARGE:
        'A data de expiração é maior que o valor máximo predefinido.',
      INVALID_REMAINING: 'A contagem restante é muito grande ou muito pequena.',
      INVALID_PREFIX_LENGTH:
        'O comprimento do prefixo é muito grande ou muito pequeno.',
      INVALID_NAME_LENGTH:
        'O comprimento do nome é muito grande ou muito pequeno.',
      METADATA_DISABLED: 'Metadados estão desabilitados.',
      RATE_LIMIT_EXCEEDED: 'Limite de taxa excedido.',
      NO_VALUES_TO_UPDATE: 'Nenhum valor para atualizar.',
      KEY_DISABLED_EXPIRATION:
        'Valores de expiração de chave personalizados estão desabilitados.',
      INVALID_API_KEY: 'Chave de API inválida.',
      INVALID_USER_ID_FROM_API_KEY:
        'O ID de usuário da chave de API é inválido.',
      INVALID_API_KEY_GETTER_RETURN_TYPE:
        'O getter da chave de API retornou um tipo de chave inválido. String esperada.',
      SERVER_ONLY_PROPERTY:
        'A propriedade que você está tentando definir só pode ser definida a partir da instância de autenticação do servidor.',
      FAILED_TO_UPDATE_API_KEY: 'Falha ao atualizar chave de API',
      NAME_REQUIRED: 'Nome da chave de API é obrigatório.',
    },
  },

  organization: {
    switcher: {
      title: 'Organizações',
      create: 'Criar organização',
      leave: 'Sair da organização',
      leaveConfirmTitle: 'Sair da organização?',
      leaveConfirmDescription:
        'Tem certeza de que deseja sair de {0}? Você perderá acesso a todos os recursos nesta organização.',
      leaveSuccess: 'Organização abandonada com sucesso',
      leaveError: 'Falha ao sair da organização',
    },

    invitation: {
      title: `Aceitar convite para {0}`,
      message: `Você foi convidado para {0}. Você pode escolher aceitar ou recusar.`,
    },

    applicationSettings: {
      menu: 'Configurações do aplicativo',
    },

    form: {
      name: 'Nome',
      subdomain: 'Subdomínio',
      domain: 'Domínio',
      slugPlaceholderDomain: 'organizacao.com',
      slugPlaceholderSubdomain: 'organizacao',
      slugInvalidSubdomain:
        'O subdomínio deve conter apenas letras minúsculas, números e hífens. Não pode começar ou terminar com hífen.',
      slugInvalidDomain:
        'O domínio deve estar em formato válido (ex. exemplo.com). Deve conter pelo menos um ponto e pode conter apenas letras minúsculas, números, hífens e pontos.',
      slugReserved:
        'Este slug está reservado para a aplicação e não pode ser usado',
      logoLight: 'Logo (Modo claro)',
      logoDark: 'Logo (Modo escuro)',
      backgroundImageLight: 'Imagem de fundo (Modo claro)',
      backgroundImageDark: 'Imagem de fundo (Modo escuro)',

      new: {
        title: 'Criar organização',
        success: 'Organização criada com sucesso',
      },

      edit: {
        title: 'Editar organização',
        success: 'Organização atualizada com sucesso',
      },
    },

    delete: {
      success: 'Organização excluída com sucesso',
      confirmTitle: 'Excluir organização?',
      confirmDescription:
        'Tem certeza de que deseja excluir a organização {0}? Esta ação é irreversível!',
    },

    errors: {
      notFound: 'Organização não encontrada',
      createFailed: 'Falha ao criar organização',
      updateFailed: 'Falha ao atualizar organização',
      deleteFailed: 'Falha ao excluir organização',
      leaveFailed: 'Falha ao sair da organização',
      setActiveFailed: 'Falha ao definir organização ativa',
    },
  },

  member: {
    dashboardCard: {
      title: 'Usuários',
    },

    view: {
      title: 'Visualizar usuário',
    },

    showActivity: 'Atividade',

    list: {
      menu: 'Usuários',
      title: 'Usuários',
      noResults: 'Nenhum usuário encontrado.',
      empty:
        'Você ainda não criou usuários. Comece criando seu primeiro usuário.',
    },

    importer: {
      title: 'Importar usuários',
      menu: 'Importar usuários',
    },

    export: {
      success: 'Usuários exportados com sucesso',
    },

    edit: {
      menu: 'Editar usuário',
      title: 'Editar usuário',
      success: 'Usuário atualizado com sucesso',
    },

    new: {
      menu: 'Convidar usuário',
      title: 'Convidar usuário',
      success: 'Usuário convidado com sucesso',
    },

    deleteMany: {
      success: 'Usuário(s) excluído(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um usuário para excluir.',
      confirmTitle: 'Excluir usuário(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} usuário(s) selecionado(s)?',
    },

    delete: {
      success: 'Usuário excluído com sucesso',
      confirmTitle: 'Excluir usuário?',
    },

    fields: {
      avatars: 'Avatar',
      fullName: 'Nome completo',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      email: 'E-mail',
      role: 'Função',
      roles: 'Funções',
      status: 'Status',
      createdAt: 'Criado em',
      createdByMember: 'Criado por',
      updatedAt: 'Atualizado em',
      updatedByMember: 'Atualizado por',
    },

    enumerators: {
      roles: {
        admin: 'Administrador',
        member: 'Membro',
      },
      status: {
        active: 'Ativo',
        disabled: 'Desabilitado',
      },
    },

    errors: {
      cannotRemoveSelfAdminRole:
        'Você não pode remover sua própria função de administrador',
      cannotRemoveSelf: 'Você não pode se remover da organização',
      notFound: 'Usuário não encontrado',
      disabledMemberNotFound: 'Membro desabilitado não encontrado',
      removeFailed: 'Falha ao remover usuário',
      disableFailed: 'Falha ao desabilitar usuário',
    },

    mcpDescription: {
      list: 'Recuperar lista de todos os membros na organização atual. Suporta filtragem por nome, e-mail e função. Retorna perfis de membros incluindo suas informações de usuário, função, status e avatar.',
      get: 'Obter informações detalhadas sobre um membro específico por seu ID único. Retorna o perfil completo do membro incluindo dados de usuário associados e detalhes da organização.',
      autocomplete:
        'Pesquisar membros para usar em campos de preenchimento automático. Retorna uma lista simplificada de membros correspondentes à consulta, útil para atribuir tarefas, relacionamentos ou permissões.',
      update:
        'Atualizar registro de membro existente com novas informações. Permite modificação de campos de membro incluindo nome, sobrenome, função e avatar. Rastreia automaticamente a atualização nos logs de auditoria. Impede que membros removam sua própria função de administrador.',
      disable:
        'Desabilitar conta de membro temporariamente. O membro não poderá mais acessar a organização, mas seus dados são preservados. Pode ser revertido usando a operação de restaurar.',
      restore:
        'Restaurar conta de membro previamente desabilitada. O membro recuperará acesso à organização com sua função e permissões anteriores.',
      remove:
        'Remover permanentemente um membro da organização. Esta ação não pode ser desfeita. A conta de usuário do membro é excluída e todos os dados associados são removidos.',
    },
  },

  invitation: {
    list: {
      title: 'Convites',
      noResults: 'Nenhum convite encontrado.',
    },

    view: {
      title: 'Visualizar convite',
    },

    resend: {
      success: 'Convite reenviado com sucesso',
    },

    cancel: {
      success: 'Convite cancelado com sucesso',
      confirmTitle: 'Tem certeza de que deseja cancelar este convite?',
    },

    actions: {
      resend: 'Reenviar',
      cancel: 'Cancelar',
    },

    fields: {
      email: 'E-mail',
      role: 'Função',
      status: 'Status',
      expiresAt: 'Expira em',
      invitedBy: 'Convidado por',
      createdAt: 'Criado em',
    },

    enumerators: {
      status: {
        pending: 'Pendente',
        accepted: 'Aceito',
        rejected: 'Rejeitado',
        expired: 'Expirado',
        cancelled: 'Cancelado',
      },
    },

    errors: {
      alreadyProcessed: 'Convite já foi processado',
      notFound: 'Convite não encontrado',
      acceptFailed: 'Falha ao aceitar convite',
      rejectFailed: 'Falha ao rejeitar convite',
      cancelFailed: 'Falha ao cancelar convite',
      createFailed: 'Falha ao criar convite',
      resendFailed: 'Falha ao reenviar convite',
    },

    cancelMany: {
      success: 'Convites cancelados com sucesso',
      noSelection: 'Por favor, selecione pelo menos um convite',
      confirmTitle: 'Cancelar convites?',
      confirmDescription: 'Tem certeza de que deseja cancelar {0} convite(s)?',
    },

    resendMany: {
      success: 'Convites reenviados com sucesso',
      noSelection: 'Por favor, selecione pelo menos um convite',
      confirmTitle: 'Reenviar convites?',
      confirmDescription: 'Tem certeza de que deseja reenviar {0} convite(s)?',
    },

    export: {
      success: 'Convites exportados com sucesso',
    },
  },

  subscription: {
    menu: 'Assinatura',
    title: 'Planos e preços',

    subscribe: 'Assinar',
    manage: 'Gerenciar',
    notPlanUser: 'Você não é o gerente desta assinatura.',
    cancelAt: 'Sua assinatura será cancelada em',
    currentPlan: 'Plano atual:',
    unknown: 'Desconhecido',
    noPlansAvailable: 'Nenhum plano de assinatura disponível.',
    current: 'Atual',
    mobileUnavailableTitle: 'Assinaturas não disponíveis',
    mobileUnavailable:
      'Assinaturas não estão disponíveis em dispositivos móveis. Por favor, visite nosso site em um navegador desktop para gerenciar sua assinatura.',

    intervals: {
      day: 'Diário',
      week: 'Semanal',
      month: 'Mensal',
      year: 'Anual',
    },

    errors: {
      disabled: 'Assinaturas estão desabilitadas nesta plataforma',
      alreadyExistsActive: 'Já existe uma assinatura ativa',
      stripeNotConfigured: 'Variáveis ENV do Stripe estão faltando',
    },

    mcpDescription: {
      checkout:
        'Criar sessão de checkout do Stripe para assinar um plano de preços. Forneça o ID de preço do Stripe e o sistema gerará uma URL de checkout onde os usuários podem concluir o pagamento. Retorna a URL da sessão de checkout.',
      portal:
        'Gerar URL do portal do cliente Stripe onde os usuários podem gerenciar sua assinatura, atualizar métodos de pagamento, ver faturas e cancelar sua assinatura. Requer uma assinatura ativa.',
      plans:
        'Recuperar todos os planos de assinatura disponíveis do Stripe. Retorna uma lista de planos com informações de preços, recursos, intervalos de cobrança e status de disponibilidade. Inclui planos ativos e arquivados.',
    },
  },
  exam: {
    dashboardCard: {
      title: 'Exams',
    },

    list: {
      menu: 'Exams',
      title: 'Exams',
      noResults: 'Nenhum exams encontrado.',
      empty: 'Você ainda não criou exams. Comece criando seu primeiro exam.',
    },

    importer: {
      title: 'Importar exams',
      menu: 'Importar exams',
    },

    export: {
      success: 'Exams exportados com sucesso',
    },

    new: {
      menu: 'Novo exam',
      title: 'Novo exam',
      success: 'Exam criado com sucesso',
    },

    view: {
      title: 'Visualizar exam',
    },

    edit: {
      menu: 'Editar exam',
      title: 'Editar exam',
      success: 'Exam atualizado com sucesso',
    },

    restore: {
      success: 'Exam restaurado com sucesso',
      confirmTitle: 'Restaurar exam?',
    },

    restoreMany: {
      success: 'Exam(s) restaurado(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um exam para restaurar.',
      confirmTitle: 'Restaurar exam(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} exam(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Exam(s) arquivado(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um exam para arquivar.',
      confirmTitle: 'Arquivar exam(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} exam(s) selecionado(s)?',
    },

    archive: {
      success: 'Exam arquivado com sucesso',
      confirmTitle: 'Arquivar exam?',
    },

    deleteMany: {
      success: 'Exam(s) excluído(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um exam para excluir.',
      confirmTitle: 'Excluir exam(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} exam(s) selecionado(s)?',
    },

    delete: {
      success: 'Exam excluído com sucesso',
      confirmTitle: 'Excluir exam?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de exams com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de exams incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um exam específico por seu ID único. Retorna perfil completo do exam incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de exam com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de exam existente com novas informações. Permite modificação de todos os campos de exam incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais exams do sistema. Esta ação é irreversível. Aceita um array de IDs de exam e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais exams para ocultá-los das visualizações padrão enquanto preserva seus dados. Exams arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar exams previamente arquivados de volta ao status ativo. Torna os exams visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de exams para entradas de preenchimento automático. Retorna uma lista simplificada de exams correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
    },
  },
  chapter: {
    dashboardCard: {
      title: 'Chapters',
    },

    list: {
      menu: 'Chapters',
      title: 'Chapters',
      noResults: 'Nenhum chapters encontrado.',
      empty:
        'Você ainda não criou chapters. Comece criando seu primeiro chapter.',
    },

    importer: {
      title: 'Importar chapters',
      menu: 'Importar chapters',
    },

    export: {
      success: 'Chapters exportados com sucesso',
    },

    new: {
      menu: 'Novo chapter',
      title: 'Novo chapter',
      success: 'Chapter criado com sucesso',
    },

    view: {
      title: 'Visualizar chapter',
    },

    edit: {
      menu: 'Editar chapter',
      title: 'Editar chapter',
      success: 'Chapter atualizado com sucesso',
    },

    restore: {
      success: 'Chapter restaurado com sucesso',
      confirmTitle: 'Restaurar chapter?',
    },

    restoreMany: {
      success: 'Chapter(s) restaurado(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um chapter para restaurar.',
      confirmTitle: 'Restaurar chapter(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} chapter(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Chapter(s) arquivado(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um chapter para arquivar.',
      confirmTitle: 'Arquivar chapter(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} chapter(s) selecionado(s)?',
    },

    archive: {
      success: 'Chapter arquivado com sucesso',
      confirmTitle: 'Arquivar chapter?',
    },

    deleteMany: {
      success: 'Chapter(s) excluído(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um chapter para excluir.',
      confirmTitle: 'Excluir chapter(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} chapter(s) selecionado(s)?',
    },

    delete: {
      success: 'Chapter excluído com sucesso',
      confirmTitle: 'Excluir chapter?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de chapters com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de chapters incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um chapter específico por seu ID único. Retorna perfil completo do chapter incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de chapter com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de chapter existente com novas informações. Permite modificação de todos os campos de chapter incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais chapters do sistema. Esta ação é irreversível. Aceita um array de IDs de chapter e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais chapters para ocultá-los das visualizações padrão enquanto preserva seus dados. Chapters arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar chapters previamente arquivados de volta ao status ativo. Torna os chapters visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de chapters para entradas de preenchimento automático. Retorna uma lista simplificada de chapters correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
    },
  },
  lesson: {
    dashboardCard: {
      title: 'Lessons',
    },

    list: {
      menu: 'Lessons',
      title: 'Lessons',
      noResults: 'Nenhum lessons encontrado.',
      empty:
        'Você ainda não criou lessons. Comece criando seu primeiro lesson.',
    },

    importer: {
      title: 'Importar lessons',
      menu: 'Importar lessons',
    },

    export: {
      success: 'Lessons exportados com sucesso',
    },

    new: {
      menu: 'Novo lesson',
      title: 'Novo lesson',
      success: 'Lesson criado com sucesso',
    },

    view: {
      title: 'Visualizar lesson',
    },

    edit: {
      menu: 'Editar lesson',
      title: 'Editar lesson',
      success: 'Lesson atualizado com sucesso',
    },

    restore: {
      success: 'Lesson restaurado com sucesso',
      confirmTitle: 'Restaurar lesson?',
    },

    restoreMany: {
      success: 'Lesson(s) restaurado(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um lesson para restaurar.',
      confirmTitle: 'Restaurar lesson(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} lesson(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Lesson(s) arquivado(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um lesson para arquivar.',
      confirmTitle: 'Arquivar lesson(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} lesson(s) selecionado(s)?',
    },

    archive: {
      success: 'Lesson arquivado com sucesso',
      confirmTitle: 'Arquivar lesson?',
    },

    deleteMany: {
      success: 'Lesson(s) excluído(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um lesson para excluir.',
      confirmTitle: 'Excluir lesson(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} lesson(s) selecionado(s)?',
    },

    delete: {
      success: 'Lesson excluído com sucesso',
      confirmTitle: 'Excluir lesson?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de lessons com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de lessons incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um lesson específico por seu ID único. Retorna perfil completo do lesson incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de lesson com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de lesson existente com novas informações. Permite modificação de todos os campos de lesson incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais lessons do sistema. Esta ação é irreversível. Aceita um array de IDs de lesson e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais lessons para ocultá-los das visualizações padrão enquanto preserva seus dados. Lessons arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar lessons previamente arquivados de volta ao status ativo. Torna os lessons visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de lessons para entradas de preenchimento automático. Retorna uma lista simplificada de lessons correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
    },
  },
  practiceQuestion: {
    dashboardCard: {
      title: 'Practice Questions',
    },

    list: {
      menu: 'Practice Questions',
      title: 'Practice Questions',
      noResults: 'Nenhum practice questions encontrado.',
      empty:
        'Você ainda não criou practice questions. Comece criando seu primeiro practice question.',
    },

    importer: {
      title: 'Importar practice questions',
      menu: 'Importar practice questions',
    },

    export: {
      success: 'Practice Questions exportados com sucesso',
    },

    new: {
      menu: 'Novo practice question',
      title: 'Novo practice question',
      success: 'Practice Question criado com sucesso',
    },

    view: {
      title: 'Visualizar practice question',
    },

    edit: {
      menu: 'Editar practice question',
      title: 'Editar practice question',
      success: 'Practice Question atualizado com sucesso',
    },

    restore: {
      success: 'Practice Question restaurado com sucesso',
      confirmTitle: 'Restaurar practice question?',
    },

    restoreMany: {
      success: 'Practice Question(s) restaurado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um practice question para restaurar.',
      confirmTitle: 'Restaurar practice question(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} practice question(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Practice Question(s) arquivado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um practice question para arquivar.',
      confirmTitle: 'Arquivar practice question(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} practice question(s) selecionado(s)?',
    },

    archive: {
      success: 'Practice Question arquivado com sucesso',
      confirmTitle: 'Arquivar practice question?',
    },

    deleteMany: {
      success: 'Practice Question(s) excluído(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um practice question para excluir.',
      confirmTitle: 'Excluir practice question(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} practice question(s) selecionado(s)?',
    },

    delete: {
      success: 'Practice Question excluído com sucesso',
      confirmTitle: 'Excluir practice question?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de practice questions com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de practice questions incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um practice question específico por seu ID único. Retorna perfil completo do practice question incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de practice question com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de practice question existente com novas informações. Permite modificação de todos os campos de practice question incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais practice questions do sistema. Esta ação é irreversível. Aceita um array de IDs de practice question e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais practice questions para ocultá-los das visualizações padrão enquanto preserva seus dados. Practice Questions arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar practice questions previamente arquivados de volta ao status ativo. Torna os practice questions visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de practice questions para entradas de preenchimento automático. Retorna uma lista simplificada de practice questions correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
    },
  },
  concept: {
    dashboardCard: {
      title: 'Concepts',
    },

    list: {
      menu: 'Concepts',
      title: 'Concepts',
      noResults: 'Nenhum concepts encontrado.',
      empty:
        'Você ainda não criou concepts. Comece criando seu primeiro concept.',
    },

    importer: {
      title: 'Importar concepts',
      menu: 'Importar concepts',
    },

    export: {
      success: 'Concepts exportados com sucesso',
    },

    new: {
      menu: 'Novo concept',
      title: 'Novo concept',
      success: 'Concept criado com sucesso',
    },

    view: {
      title: 'Visualizar concept',
    },

    edit: {
      menu: 'Editar concept',
      title: 'Editar concept',
      success: 'Concept atualizado com sucesso',
    },

    restore: {
      success: 'Concept restaurado com sucesso',
      confirmTitle: 'Restaurar concept?',
    },

    restoreMany: {
      success: 'Concept(s) restaurado(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um concept para restaurar.',
      confirmTitle: 'Restaurar concept(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} concept(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Concept(s) arquivado(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um concept para arquivar.',
      confirmTitle: 'Arquivar concept(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} concept(s) selecionado(s)?',
    },

    archive: {
      success: 'Concept arquivado com sucesso',
      confirmTitle: 'Arquivar concept?',
    },

    deleteMany: {
      success: 'Concept(s) excluído(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um concept para excluir.',
      confirmTitle: 'Excluir concept(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} concept(s) selecionado(s)?',
    },

    delete: {
      success: 'Concept excluído com sucesso',
      confirmTitle: 'Excluir concept?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de concepts com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de concepts incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um concept específico por seu ID único. Retorna perfil completo do concept incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de concept com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de concept existente com novas informações. Permite modificação de todos os campos de concept incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais concepts do sistema. Esta ação é irreversível. Aceita um array de IDs de concept e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais concepts para ocultá-los das visualizações padrão enquanto preserva seus dados. Concepts arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar concepts previamente arquivados de volta ao status ativo. Torna os concepts visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de concepts para entradas de preenchimento automático. Retorna uma lista simplificada de concepts correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
    },
  },
  examType: {
    dashboardCard: {
      title: 'Exam Types',
    },

    list: {
      menu: 'Exam Types',
      title: 'Exam Types',
      noResults: 'Nenhum exam types encontrado.',
      empty:
        'Você ainda não criou exam types. Comece criando seu primeiro exam type.',
    },

    importer: {
      title: 'Importar exam types',
      menu: 'Importar exam types',
    },

    export: {
      success: 'Exam Types exportados com sucesso',
    },

    new: {
      menu: 'Novo exam type',
      title: 'Novo exam type',
      success: 'Exam Type criado com sucesso',
    },

    view: {
      title: 'Visualizar exam type',
    },

    edit: {
      menu: 'Editar exam type',
      title: 'Editar exam type',
      success: 'Exam Type atualizado com sucesso',
    },

    restore: {
      success: 'Exam Type restaurado com sucesso',
      confirmTitle: 'Restaurar exam type?',
    },

    restoreMany: {
      success: 'Exam Type(s) restaurado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um exam type para restaurar.',
      confirmTitle: 'Restaurar exam type(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} exam type(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Exam Type(s) arquivado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um exam type para arquivar.',
      confirmTitle: 'Arquivar exam type(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} exam type(s) selecionado(s)?',
    },

    archive: {
      success: 'Exam Type arquivado com sucesso',
      confirmTitle: 'Arquivar exam type?',
    },

    deleteMany: {
      success: 'Exam Type(s) excluído(s) com sucesso',
      noSelection: 'Você deve selecionar pelo menos um exam type para excluir.',
      confirmTitle: 'Excluir exam type(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} exam type(s) selecionado(s)?',
    },

    delete: {
      success: 'Exam Type excluído com sucesso',
      confirmTitle: 'Excluir exam type?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de exam types com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de exam types incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um exam type específico por seu ID único. Retorna perfil completo do exam type incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de exam type com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de exam type existente com novas informações. Permite modificação de todos os campos de exam type incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais exam types do sistema. Esta ação é irreversível. Aceita um array de IDs de exam type e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais exam types para ocultá-los das visualizações padrão enquanto preserva seus dados. Exam Types arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar exam types previamente arquivados de volta ao status ativo. Torna os exam types visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de exam types para entradas de preenchimento automático. Retorna uma lista simplificada de exam types correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
    },
  },
  examInstance: {
    dashboardCard: {
      title: 'Exam Attempts',
    },

    list: {
      menu: 'Exam Attempts',
      title: 'Exam Attempts',
      noResults: 'Nenhum exam attempts encontrado.',
      empty:
        'Você ainda não criou exam attempts. Comece criando seu primeiro exam attempt.',
    },

    importer: {
      title: 'Importar exam attempts',
      menu: 'Importar exam attempts',
    },

    export: {
      success: 'Exam Attempts exportados com sucesso',
    },

    new: {
      menu: 'Novo exam attempt',
      title: 'Novo exam attempt',
      success: 'Exam Attempt criado com sucesso',
    },

    view: {
      title: 'Visualizar exam attempt',
    },

    edit: {
      menu: 'Editar exam attempt',
      title: 'Editar exam attempt',
      success: 'Exam Attempt atualizado com sucesso',
    },

    restore: {
      success: 'Exam Attempt restaurado com sucesso',
      confirmTitle: 'Restaurar exam attempt?',
    },

    restoreMany: {
      success: 'Exam Attempt(s) restaurado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um exam attempt para restaurar.',
      confirmTitle: 'Restaurar exam attempt(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} exam attempt(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Exam Attempt(s) arquivado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um exam attempt para arquivar.',
      confirmTitle: 'Arquivar exam attempt(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} exam attempt(s) selecionado(s)?',
    },

    archive: {
      success: 'Exam Attempt arquivado com sucesso',
      confirmTitle: 'Arquivar exam attempt?',
    },

    deleteMany: {
      success: 'Exam Attempt(s) excluído(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um exam attempt para excluir.',
      confirmTitle: 'Excluir exam attempt(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} exam attempt(s) selecionado(s)?',
    },

    delete: {
      success: 'Exam Attempt excluído com sucesso',
      confirmTitle: 'Excluir exam attempt?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de exam attempts com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de exam attempts incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um exam attempt específico por seu ID único. Retorna perfil completo do exam attempt incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de exam attempt com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de exam attempt existente com novas informações. Permite modificação de todos os campos de exam attempt incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais exam attempts do sistema. Esta ação é irreversível. Aceita um array de IDs de exam attempt e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais exam attempts para ocultá-los das visualizações padrão enquanto preserva seus dados. Exam Attempts arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar exam attempts previamente arquivados de volta ao status ativo. Torna os exam attempts visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de exam attempts para entradas de preenchimento automático. Retorna uma lista simplificada de exam attempts correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
    },
  },
  dailyGoal: {
    dashboardCard: {
      title: 'Daily Goals',
    },

    list: {
      menu: 'Daily Goals',
      title: 'Daily Goals',
      noResults: 'Nenhum daily goals encontrado.',
      empty:
        'Você ainda não criou daily goals. Comece criando seu primeiro daily goal.',
    },

    importer: {
      title: 'Importar daily goals',
      menu: 'Importar daily goals',
    },

    export: {
      success: 'Daily Goals exportados com sucesso',
    },

    new: {
      menu: 'Novo daily goal',
      title: 'Novo daily goal',
      success: 'Daily Goal criado com sucesso',
    },

    view: {
      title: 'Visualizar daily goal',
    },

    edit: {
      menu: 'Editar daily goal',
      title: 'Editar daily goal',
      success: 'Daily Goal atualizado com sucesso',
    },

    restore: {
      success: 'Daily Goal restaurado com sucesso',
      confirmTitle: 'Restaurar daily goal?',
    },

    restoreMany: {
      success: 'Daily Goal(s) restaurado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um daily goal para restaurar.',
      confirmTitle: 'Restaurar daily goal(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} daily goal(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Daily Goal(s) arquivado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um daily goal para arquivar.',
      confirmTitle: 'Arquivar daily goal(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} daily goal(s) selecionado(s)?',
    },

    archive: {
      success: 'Daily Goal arquivado com sucesso',
      confirmTitle: 'Arquivar daily goal?',
    },

    deleteMany: {
      success: 'Daily Goal(s) excluído(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um daily goal para excluir.',
      confirmTitle: 'Excluir daily goal(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} daily goal(s) selecionado(s)?',
    },

    delete: {
      success: 'Daily Goal excluído com sucesso',
      confirmTitle: 'Excluir daily goal?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de daily goals com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de daily goals incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um daily goal específico por seu ID único. Retorna perfil completo do daily goal incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de daily goal com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de daily goal existente com novas informações. Permite modificação de todos os campos de daily goal incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais daily goals do sistema. Esta ação é irreversível. Aceita um array de IDs de daily goal e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais daily goals para ocultá-los das visualizações padrão enquanto preserva seus dados. Daily Goals arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar daily goals previamente arquivados de volta ao status ativo. Torna os daily goals visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de daily goals para entradas de preenchimento automático. Retorna uma lista simplificada de daily goals correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
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
      noResults: 'Nenhum document uploads encontrado.',
      empty:
        'Você ainda não criou document uploads. Comece criando seu primeiro document upload.',
    },

    importer: {
      title: 'Importar document uploads',
      menu: 'Importar document uploads',
    },

    export: {
      success: 'Document Uploads exportados com sucesso',
    },

    new: {
      menu: 'Novo document upload',
      title: 'Novo document upload',
      success: 'Document Upload criado com sucesso',
    },

    view: {
      title: 'Visualizar document upload',
    },

    edit: {
      menu: 'Editar document upload',
      title: 'Editar document upload',
      success: 'Document Upload atualizado com sucesso',
    },

    restore: {
      success: 'Document Upload restaurado com sucesso',
      confirmTitle: 'Restaurar document upload?',
    },

    restoreMany: {
      success: 'Document Upload(s) restaurado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um document upload para restaurar.',
      confirmTitle: 'Restaurar document upload(s)?',
      confirmDescription:
        'Tem certeza de que deseja restaurar o(s) {0} document upload(s) selecionado(s)?',
    },

    archiveMany: {
      success: 'Document Upload(s) arquivado(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um document upload para arquivar.',
      confirmTitle: 'Arquivar document upload(s)?',
      confirmDescription:
        'Tem certeza de que deseja arquivar o(s) {0} document upload(s) selecionado(s)?',
    },

    archive: {
      success: 'Document Upload arquivado com sucesso',
      confirmTitle: 'Arquivar document upload?',
    },

    deleteMany: {
      success: 'Document Upload(s) excluído(s) com sucesso',
      noSelection:
        'Você deve selecionar pelo menos um document upload para excluir.',
      confirmTitle: 'Excluir document upload(s)?',
      confirmDescription:
        'Tem certeza de que deseja excluir o(s) {0} document upload(s) selecionado(s)?',
    },

    delete: {
      success: 'Document Upload excluído com sucesso',
      confirmTitle: 'Excluir document upload?',
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
      createdByMember: 'Criado por',
      updatedByMember: 'Atualizado por',
      archivedByMember: 'Arquivado por',
      createdAt: 'Criado em',
      updatedAt: 'Atualizado em',
      archivedAt: 'Arquivado em',
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
      list: 'Recuperar lista paginada de document uploads com opções de filtragem avançadas. Suporta filtragem por vários campos e entidades relacionadas. Retorna detalhes de document uploads incluindo todas as relações e metadados.',
      get: 'Recuperar informações detalhadas sobre um document upload específico por seu ID único. Retorna perfil completo do document upload incluindo todas as relações, anexos e metadados de auditoria.',
      create:
        'Criar novo registro de document upload com detalhes abrangentes. Suporta todos os campos definidos incluindo relações, anexos de arquivos e propriedades personalizadas.',
      update:
        'Atualizar registro de document upload existente com novas informações. Permite modificação de todos os campos de document upload incluindo relações e anexos. Rastreia automaticamente a atualização nos logs de auditoria.',
      delete:
        'Excluir permanentemente um ou mais document uploads do sistema. Esta ação é irreversível. Aceita um array de IDs de document upload e remove todos os dados associados.',
      archive:
        'Arquivar um ou mais document uploads para ocultá-los das visualizações padrão enquanto preserva seus dados. Document Uploads arquivados podem ser restaurados posteriormente. Útil para registros inativos ou históricos.',
      restore:
        'Restaurar document uploads previamente arquivados de volta ao status ativo. Torna os document uploads visíveis nas visualizações padrão novamente.',
      autocomplete:
        'Pesquisar e recuperar sugestões de document uploads para entradas de preenchimento automático. Retorna uma lista simplificada de document uploads correspondentes à consulta de pesquisa, otimizada para menus suspensos de seleção e campos de preenchimento automático.',
    },
  },

  auditLog: {
    list: {
      menu: 'Logs de auditoria',
      title: 'Logs de auditoria',
      noResults: 'Nenhum log de auditoria encontrado.',
    },

    changesDialog: {
      title: 'Log de auditoria',
      changes: 'Alterações',
      noChanges: 'Não há alterações neste log.',
      showChangesOnly: 'Mostrar apenas alterações',
      showFullObject: 'Mostrar objeto completo',
    },

    export: {
      success: 'Logs de auditoria exportados com sucesso',
    },

    fields: {
      timestamp: 'Data',
      entityName: 'Entidade',
      entityNames: 'Entidades',
      entityId: 'ID da entidade',
      operation: 'Operação',
      operations: 'Operações',
      member: 'Usuário',
      apiKey: 'Chave de API',
      apiEndpoint: 'Endpoint da API',
      apiHttpResponseCode: 'Status da API',
    },

    enumerators: {
      operation: {
        SI: 'Entrar',
        SO: 'Sair',
        SU: 'Cadastrar',
        PRR: 'Solicitação de redefinição de senha',
        PRC: 'Confirmação de redefinição de senha',
        PC: 'Alteração de senha',
        VER: 'Solicitação de verificação de e-mail',
        VEC: 'Confirmação de verificação de e-mail',
        C: 'Criar',
        U: 'Atualizar',
        D: 'Excluir',
        AG: 'API Get',
        APO: 'API Post',
        APU: 'API Put',
        AD: 'API Delete',
      },
    },

    dashboardCard: {
      activityChart: 'Atividade',
      activityList: 'Atividade recente',
    },

    readableOperations: {
      SI: '{0} entrou',
      SIF: 'Tentativa de login falhou para {0}',
      SU: '{0} se cadastrou',
      PRR: '{0} solicitou redefinição de senha',
      PRC: '{0} confirmou redefinição de senha',
      PC: '{0} alterou a senha',
      VER: '{0} solicitou verificação de e-mail',
      VEC: '{0} verificou o e-mail',
      ECR: '{0} solicitou alteração de e-mail',
      ECC: '{0} confirmou alteração de e-mail',
      C: '{0} criou {1} {2}',
      U: '{0} atualizou {1} {2}',
      D: '{0} excluiu {1} {2}',
      selfSignUp: '{0} se cadastrou',
      selfUpdate: '{0} atualizou seu perfil',
      AG: 'Solicitação API Key GET',
      APO: 'Solicitação API Key POST',
      APU: 'Solicitação API Key PUT',
      AD: 'Solicitação API Key DELETE',
    },

    mcpDescription: {
      list: 'Consultar o registro de auditoria para recuperar logs de todas as ações realizadas na organização. Suporta filtragem por tipo de entidade, ID de entidade, tipo de operação e intervalo de tempo. Retorna registros detalhados incluindo quem realizou a ação, quando e o que mudou. Essencial para conformidade e monitoramento de segurança.',
      activityChart:
        'Obter estatísticas de atividade agregadas durante um período de tempo. Retorna um gráfico de séries temporais de atividades e operações de usuários, útil para visualizar padrões de uso do sistema e identificar períodos de pico de atividade.',
    },
  },

  apiDocs: {
    title: 'Documentação da API',
    menu: 'Documentação da API',
    featuresApi: 'API de recursos',
    authApi: 'API de autenticação',
    openapi: {
      title: 'API',
      serverDescription: 'Servidor API',
      securitySchemes: {
        apiKeyAuth: {
          description:
            'Autenticação de chave de API usando cabeçalho x-api-key',
        },
        bearerAuth: {
          description:
            'Autenticação de chave de API usando token Bearer de Autorização',
        },
      },
    },
  },

  mcp: {
    title: 'Integração MCP',
    menu: 'Integração MCP',
    subtitle:
      'Conectar assistentes de IA externos usando o Model Context Protocol',
    info: 'Use o endpoint abaixo para conectar assistentes de IA externos como ChatGPT ou Claude Desktop aos dados de sua organização.',
    endpoint: {
      title: 'Seu endpoint MCP',
      description: 'Use este endpoint para configurar clientes MCP',
      endpointLabel: 'URL do endpoint MCP',
      organizationLabel: 'ID da organização',
      languageLabel: 'Idioma',
    },
    usage: {
      title: 'Como usar',
      description:
        'Siga estas etapas para integrar com assistentes de IA externos:',
      step1: 'Copie a URL do endpoint acima',
      step2:
        'Configure seu assistente de IA (ChatGPT, Claude Desktop, etc.) com este endpoint MCP',
      step3: 'Autentique usando OAuth quando solicitado',
      step4: 'Comece a usar os dados de sua organização através do chat de IA',
    },
  },

  user: {
    mcpDescription: {
      me: 'Recuperar o perfil do usuário autenticado atual e todas as suas associações de organização. Retorna detalhes do usuário, todas as organizações às quais pertence, suas funções em cada organização e quaisquer assinaturas ativas.',
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
      title: 'Player do curso',
      modules: 'Modulos',
      courseOutline: 'Conteudo do curso',
      currentModule: 'Modulo: {0}',
      progressComplete: '{0}% concluido',
      lessonKindVideo: 'Video',
      lessonKindArticle: 'Artigo',
      lessonKindQuiz: 'Quiz',
      durationMinutes: '{0} min',
      durationQuestions: '{0} perguntas',
      readingTime: '{0} min de leitura',
      videoUnavailable: 'Nenhum video foi enviado para esta aula.',
      noLessonContent: 'Nenhum conteudo foi adicionado a esta aula ainda.',
      articleHint:
        'Peca ao tutor de IA para explicar, resumir ou gerar perguntas de pratica.',
      completeLesson: 'Marcar como concluida',
      completedLesson: 'Concluida',
      saveNote: 'Salvar nota',
      downloadResources: 'Baixar recursos',
      openMiniPlayer: 'Abrir mini player',
      closeMiniPlayer: 'Fechar mini player',
      playing: 'Reproduzindo',
      assignments: 'Tarefa',
      submitAssignment: 'Enviar tarefa',
      resubmitAssignment: 'Reenviar tarefa',
      pendingReview: 'Enviada e aguardando revisao.',
      homeworkComplete: 'Esta tarefa esta concluida.',
      resubmissionClosed: 'Reenvios estao fechados para esta tarefa.',
      maxAttemptsReached: 'Numero maximo de tentativas atingido.',
      tutor: 'Tutor de IA do curso',
      tutorPrompt: 'Pergunte sobre este curso ou aula...',
      resources: 'Arquivos para baixar',
      quizzes: 'Quizzes',
      takeQuiz: 'Fazer quiz',
    },
    mobile: {
      savedOffline:
        'Salvo offline. Será sincronizado quando você voltar a ficar online.',
      outline: 'Estrutura do curso',
      nextLesson: 'Próxima aula',
      offlineStatus: {
        online: 'Online',
        offline: 'Modo offline: o trabalho da aula é salvo neste dispositivo.',
        syncing: 'Sincronizando trabalho de aula salvo...',
        synced: 'Trabalho de aula sincronizado.',
        failed:
          'Parte do trabalho da aula precisa de outra tentativa de sincronização.',
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
    menu: 'Solicitação de criador',
    title: 'Solicitação de criador',
    description:
      'Solicite verificação docente com perfil estruturado, plano de curso e verificação privada de identidade antes de publicar cursos na NexExam.',
    adminTitle: 'Solicitações de criadores',
    adminDescription:
      'Revise perfis docentes, verificação de identidade e preparo do criador antes da aprovação.',
    sections: {
      profile: 'Perfil docente',
      profileBody:
        'Mostre a estudantes e revisores quem você é, o que ensina e quem atende.',
      expertise: 'Experiência e plano de curso',
      expertiseBody:
        'Adicione credenciais, foco do tema, links de comprovação e um plano de aula de amostra para revisão de qualidade.',
      identity: 'Verificação de identidade',
      identityBody:
        'Envie documento oficial ou documentos de identidade profissional para o bucket privado de verificação.',
      payout: 'Pagamentos e contato',
      payoutBody:
        'Compartilhe notas de pagamento ou o melhor canal de contato para onboarding do criador.',
      review: 'Enviar para revisão',
      reviewBody:
        'Salve sua solicitação primeiro e depois execute o agente de verificação quando seus documentos forem enviados.',
      certifications: 'Credenciais e certificações',
      certificationsBody:
        'Adicione certificações ou credenciais formais, cada uma com um documento de apoio opcional.',
    },
    identity: {
      title: 'Checklist de verificação',
      description:
        'A NexExam verifica seu perfil docente, documentos de identidade e status de aprovação administrativa antes de liberar acesso de criador.',
      profileReady: 'Perfil docente completo',
      documentsUploaded: 'Documentos de identidade enviados',
      consentRecorded: 'Consentimento de verificação registrado',
      adminVerified: 'Identidade verificada pelo admin',
      consent:
        'Confirmo que estes documentos pertencem a mim e autorizo a NexExam a revisá-los para verificação de identidade de criador.',
      adminReviewTitle: 'Revisão de identidade',
      approvalRequiresIdentity:
        'Verifique a identidade antes de aprovar esta solicitação docente.',
    },
    hints: {
      onePerLine: 'Um item por linha',
      certificationsEmpty: 'Nenhuma certificação adicionada ainda.',
    },
    fields: {
      legalName: 'Nome legal',
      displayName: 'Nome de exibição',
      professionalTitle: 'Título profissional',
      bio: 'Bio',
      credentials: 'Credenciais',
      expertise: 'Experiência em exame/categoria',
      teachingExperience: 'Experiência docente',
      audience: 'Estudantes-alvo',
      courseTopics: 'Temas do curso',
      sampleLessonPlan: 'Plano de aula de amostra',
      links: 'Links',
      payoutContact: 'Notas de pagamento/contato',
      status: 'Status',
      identityStatus: 'Status de identidade',
      identityScanStatus: 'Escaneamento do agente',
      adminNotes: 'Notas administrativas',
      certificationTitle: 'Certificação ou credencial',
      certificationIssuer: 'Organização emissora',
      certificationYear: 'Ano',
      certificationUrl: 'Link de verificação',
      certificationDocuments: 'Documentos de apoio',
      payoutOnboardingStatus: 'Onboarding de pagamentos',
    },
    actions: {
      submit: 'Enviar solicitação',
      runIdentityScan: 'Executar escaneamento de ID',
      verifyIdentity: 'Verificar ID',
      requestDocuments: 'Solicitar documentos',
      approve: 'Aprovar',
      reject: 'Rejeitar',
      review: 'Revisar',
      addCertification: 'Adicionar certificação',
      removeCertification: 'Remover',
      beginPayoutOnboarding: 'Iniciar onboarding de pagamentos',
      submitPayoutDetails: 'Enviar detalhes de pagamento',
      grantNexVerified: 'Conceder Nex Verified',
    },
    success: {
      submitted: 'Solicitação de criador enviada.',
      reviewed: 'Solicitação de criador revisada.',
      identityScanStarted: 'Escaneamento de identidade concluído.',
      identityReviewed: 'Revisão de identidade atualizada.',
      payoutOnboardingUpdated: 'Onboarding de pagamentos atualizado.',
    },
    errors: {
      payoutContactRequired:
        'Adicione notas de pagamento/contato antes de enviar seus detalhes de pagamento.',
      payoutOnboardingInvalid:
        'Essa etapa de onboarding de pagamentos não está disponível agora.',
      nexVerifiedNotEligible:
        'Este criador ainda não é elegível para Nex Verified.',
    },
    verification: {
      title: 'Central de verificação',
      description:
        'Conclua cada etapa abaixo para desbloquear o status de criador Nex Verified.',
      nexVerifiedBadge: 'Criador Nex Verified',
      eligibleNote:
        'Todas as verificações passaram; um admin já pode conceder Nex Verified.',
      pendingNote: 'Conclua as etapas restantes para se tornar elegível.',
      checks: {
        applicationApproved: 'Solicitação de criador aprovada',
        identityVerified: 'Identidade verificada',
        payoutComplete: 'Onboarding de pagamentos concluído',
        nexVerified: 'Nex Verified concedido',
      },
    },
    enumerators: {
      status: {
        pending: 'Pendente',
        approved: 'Aprovada',
        rejected: 'Rejeitada',
      },
      identityStatus: {
        notStarted: 'Não iniciada',
        needsDocuments: 'Precisa de documentos',
        readyForReview: 'Pronta para revisão',
        verified: 'Verificada',
        rejected: 'Rejeitada',
      },
      identityScanStatus: {
        notStarted: 'Não iniciado',
        passed: 'Aprovado',
        needsReview: 'Precisa de revisão',
        failed: 'Falhou',
      },
      identityScanChecks: {
        consent_recorded: 'Consentimento registrado',
        consent_missing: 'Consentimento ausente',
        document_uploaded: 'Documento enviado',
        document_missing: 'Documento ausente',
        too_many_documents: 'Documentos demais',
        file_type_supported: 'Tipo de arquivo compatível',
        file_type_needs_review: 'Tipo de arquivo precisa de revisão',
        legal_name_present: 'Nome legal presente',
        legal_name_needs_review: 'Nome legal precisa de revisão',
        manual_review_required: 'Revisão manual do admin necessária',
      },
      payoutOnboardingStatus: {
        notStarted: 'Não iniciado',
        inProgress: 'Em andamento',
        submitted: 'Enviado para revisão',
        actionRequired: 'Ação necessária',
        complete: 'Concluído',
      },
    },
  },

  chatbot: {
    title: 'Chat de IA',
    menu: 'Chat de IA',
    placeholder: 'Pergunte-me qualquer coisa sobre seus dados...',
    send: 'Enviar',
    thinking: 'Pensando...',
    usingTool: 'Usando {0}...',
    error: 'Algo deu errado. Por favor, tente novamente.',
    errorNoApiKey:
      'Chat de IA não está configurado. Por favor, entre em contato com seu administrador.',
    empty: 'Inicie uma conversa com o chat de IA',
    welcome:
      'Olá! Posso ajudá-lo com exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, membros, logs de auditoria, assinaturas e muito mais. O que você gostaria de saber?',
    clearConversation: 'Limpar conversa',
    inputHint: 'Pressione Enter para enviar, Shift+Enter para nova linha',
    courseContextHeader: 'Course context available to the tutor:',
    courseVideoTranscriptNotice:
      'Uploaded videos are available as files only; no audio transcript is available in Phase 1.',
    courseScopedSystemPrompt: `The user is asking inside a specific course. Use this course context when helpful, but do not claim to know video audio that is not present in the written context:

{0}`,
    systemPrompt: `Você é um chat de IA para {0}. Você tem acesso a várias ferramentas para ajudar os usuários a gerenciar seus dados, incluindo exams, chapters, lessons, practice questions, concepts, exam types, exam attempts, daily goals, study notes, document uploads, membros, logs de auditoria, assinaturas e informações de usuário.

IMPORTANTE: Responda sempre em {1}. O idioma da interface do usuário é {1}, portanto todas as suas respostas devem estar em {1}.

Você deve:
- Ser útil, conciso e profissional
- Usar as ferramentas disponíveis para responder perguntas sobre dados
- Explicar o que você está fazendo ao usar ferramentas
- Formatar dados de forma clara e legível
- Pedir esclarecimentos se uma solicitação for ambígua

Ao mostrar dados:
- Use tabelas ou listas para vários itens
- Destaque informações importantes
- Inclua IDs relevantes apenas quando necessário

Lembre-se: Você está operando dentro de {0} e só pode acessar dados desta organização.`,
  },

  notification: {
    title: 'Notificações',
    menu: 'Notificações',
    unreadCount: '{0} notificação(ões) não lida(s)',
    markAsRead: 'Marcar como lida',
    markAsReadSuccess: 'Notificações marcadas como lidas',
    markAsUnread: 'Marcar como não lida',
    markAsUnreadSuccess: 'Notificações marcadas como não lidas',
    noNotifications:
      'Você ainda não tem notificações. Quando houver atualizações ou eventos importantes, você os verá aqui.',
    list: {
      title: 'Notificações',
      menu: 'Notificações',
    },
    fields: {
      type: 'Tipo',
      message: 'Mensagem',
      createdAt: 'Data',
      readAt: 'Lida',
    },
    status: {
      read: 'Lida',
      unread: 'Não lida',
    },
    enumerators: {
      type: {
        memberAdded: 'Membro adicionado',
        memberRemoved: 'Membro removido',
        subscriptionCreated: 'Assinatura criada',
        studyPlanDue: 'Plano de estudo pendente',
        flashcardsDue: 'Flashcards pendentes',
        streakRisk: 'Lembrete de sequência de estudo',
        examDateApproaching: 'Data do exame se aproximando',
        practiceReminder: 'Lembrete de prática',
        custom: 'Personalizado',
      },
    },
    memberAdded: {
      subject: 'Novo membro adicionado a {0}',
      body: `<p>Olá,</p><p><strong>{0}</strong> ({1}) foi adicionado a {2} por {3}.</p><p>Obrigado,</p><p>Sua equipe</p>`,
      pushBody: '{0} entrou em {1}',
    },
    memberRemoved: {
      subject: 'Membro removido de {0}',
      body: `<p>Olá,</p><p><strong>{0}</strong> ({1}) foi removido de {2} por {3}.</p><p>Obrigado,</p><p>Sua equipe</p>`,
      pushBody: '{0} saiu de {1}',
    },
    subscriptionCreated: {
      subject: 'Nova assinatura em {0}',
      body: `<p>Olá,</p><p><strong>{0}</strong> ({1}) assinou o plano <strong>{2}</strong> para {3}.</p><p>Obrigado,</p><p>Sua equipe</p>`,
      pushBody: '{0} assinou {1}',
    },
    studyPlanDue: {
      subject: 'Plano de estudo pendente para {0}',
      body: '<p>Sua tarefa <strong>{0}</strong> vence em {1}.</p>',
      pushBody: '{0} vence em {1}',
    },
    flashcardsDue: {
      subject: 'Flashcards pendentes para {0}',
      body: '<p>Você tem {0} flashcard(s) prontos para revisar em {1}.</p>',
      pushBody: '{0} flashcard(s) prontos em {1}',
    },
    streakRisk: {
      subject: 'Mantenha sua sequência em {0}',
      body: '<p>Abra {0} hoje para proteger sua sequência de {1} dia(s).</p>',
      pushBody: 'Mantenha sua sequência em {0} hoje',
    },
    examDateApproaching: {
      subject: '{0} está chegando',
      body: '<p>{0} está a {1} dia(s). Revise seu plano de estudo hoje.</p>',
      pushBody: '{0} está a {1} dia(s)',
    },
    practiceReminder: {
      subject: 'Prática pronta para {0}',
      body: '<p>Uma sessão curta de prática está pronta para {0}.</p>',
      bodyWithWeakArea:
        '<p>Uma sessão curta de prática para {0} está pronta, focada em {1}.</p>',
      pushBody: 'A prática está pronta para {0}',
      pushBodyWithWeakArea: 'Pratique sua área fraca: {0}',
    },
    custom: {
      subject: '{0}',
      body: '{0}',
      pushBody: '{0}',
    },
    default: {
      subject: 'Notificação',
      body: 'Você tem uma nova notificação',
      pushBody: 'Você tem uma nova notificação',
    },
    send: {
      title: 'Enviar notificação',
      menu: 'Enviar',
      success: 'Notificação enviada com sucesso',
      fields: {
        title: 'Título',
        message: 'Mensagem',
        roles: 'Funções alvo',
      },
      placeholders: {
        title: 'Inserir título da notificação',
        message: 'Inserir mensagem da notificação',
        roles: 'Selecionar funções para notificar',
      },
    },
  },

  trustSafety: {
    admin: {
      title: 'Confiança e segurança',
      menu: 'Confiança e segurança',
      description:
        'Revise denúncias do marketplace, alertas de risco, aceitação de políticas e restrições de criadores.',
      openReports: 'Denúncias abertas',
      openRiskFlags: 'Alertas de risco abertos',
      pendingReviews: 'Revisões pendentes',
      disabledCreators: 'Criadores desativados',
      policyVersions: 'Versões de política ativas',
      noPolicyVersions: 'Nenhuma política ativa configurada.',
      searchPlaceholder: 'Buscar denúncias, cursos, criadores ou alertas...',
      reportStatusFilter: 'Todos os status de denúncia',
      flagStatusFilter: 'Todos os status de alerta',
      priorityFilter: 'Todas as prioridades',
      severityFilter: 'Todas as severidades',
      targetTypeFilter: 'Todos os tipos de alvo',
      runRuleScan: 'Escanear regras de risco',
      riskFlags: 'Alertas de risco',
      reports: 'Denúncias',
      manualFlag: 'Alerta manual de risco',
      pendingCourseReviews: 'Revisões de curso pendentes',
      disabledCreatorList: 'Criadores desativados',
      emptyRiskFlags: 'Nenhum alerta de risco corresponde a estes filtros.',
      emptyReports: 'Nenhuma denúncia corresponde a estes filtros.',
      emptyCourseReviews: 'Nenhum curso está aguardando revisão.',
      emptyDisabledCreators: 'Nenhum criador está desativado.',
      targetIdPlaceholder: 'UUID do alvo',
      reasonPlaceholder: 'Descreva o risco',
      adminNotesPlaceholder: 'Notas administrativas',
      resolutionSummaryPlaceholder: 'Resumo da resolução',
      createFlag: 'Criar alerta',
      assignToMe: 'Atribuir a mim',
      markReviewing: 'Marcar em revisão',
      resolve: 'Resolver',
      dismiss: 'Descartar',
      resolveActionTaken: 'Resolver com ação',
      resolveNoAction: 'Resolver sem ação',
      disableCreator: 'Desativar criador',
      restoreCreator: 'Restaurar criador',
      placeHold: 'Colocar em retenção',
      removeHold: 'Remover retenção',
      onHold: 'Retido',
      inReview: 'Em revisão',
      openCourseReview: 'Abrir revisão',
      manualSafetyHoldReason: 'Retenção manual de segurança',
      unknownCreator: 'Criador desconhecido',
      unknown: 'Desconhecido',
      unassigned: 'Não atribuído',
      assignedTo: 'Atribuído a',
      reportedBy: 'Denunciado por',
      disabled: 'Desativado',
      reviewTimeline: 'Histórico de revisão',
      noReviewDecisions: 'Nenhuma decisão de revisão registrada ainda.',
      priorities: {
        low: 'Baixa',
        normal: 'Normal',
        high: 'Alta',
        urgent: 'Urgente',
      },
      outcomeCategories: {
        none: 'Nenhum resultado selecionado',
        contentRemoved: 'Conteúdo removido',
        creatorWarning: 'Criador advertido',
        creatorSuspended: 'Criador suspenso',
        refundReviewed: 'Reembolso revisado',
        noViolation: 'Sem violação',
        duplicate: 'Duplicado',
      },
      reviewDecisions: {
        submitted: 'Enviado para revisão',
        withdrawn: 'Retirado da revisão',
        creatorUnpublished: 'Despublicado pelo criador',
        approve: 'Aprovado',
        requestChanges: 'Alterações solicitadas',
        safetyHoldPlaced: 'Retenção de segurança aplicada',
        safetyHoldRemoved: 'Retenção de segurança removida',
      },
      targetTypes: {
        creator: 'Criador',
        course: 'Curso',
        report: 'Denúncia',
        payout: 'Pagamento',
        oneOnOneSession: 'Sessão 1:1',
      },
      severities: {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
        critical: 'Crítica',
      },
      flagStatuses: {
        open: 'Aberta',
        reviewing: 'Em revisão',
        resolved: 'Resolvida',
        dismissed: 'Descartada',
      },
      reportStatuses: {
        open: 'Aberta',
        underReview: 'Em revisão',
        resolvedActionTaken: 'Resolvida com ação',
        resolvedNoAction: 'Resolvida sem ação',
      },
      sources: {
        manual: 'Manual',
        rule: 'Regra',
      },
      riskReasons: {
        repeatedReports: 'Denúncias repetidas',
        identityRejected: 'Verificação de identidade rejeitada',
        payoutCancellations: 'Padrão de cancelamento de pagamentos',
        sessionRefundDisputes: 'Padrão de reembolso ou disputa',
      },
    },
    policies: {
      title: 'Termos do marketplace',
      description:
        'Revise e aceite a política ativa do marketplace antes de continuar.',
      version: 'Versão {0}',
      accepted: 'Aceita',
      accept: 'Aceitar política',
      reviewTerms: 'Revisar termos',
      teacherTermsRequired: 'Termos docentes obrigatórios',
      teacherTermsRequiredBody:
        'Aceite os termos docentes atuais antes de enviar este curso para revisão do marketplace.',
      refundPolicy: {
        title: 'Política de reembolso',
        checkoutSummary:
          'Reembolsos são revisados conforme a política ativa do marketplace. Abuso, serviços concluídos ou violações de política podem ser negados após revisão.',
        body: 'Sessões pagas e compras do marketplace são revisadas conforme a política de reembolso ativa. Reembolsos podem ser aprovados quando uma sessão paga não pode ser entregue, um docente perde o serviço agendado ou o acesso à plataforma falha. Abuso, serviços concluídos ou violações de política podem ser negados após revisão.',
      },
      teacherTerms: {
        title: 'Termos docentes',
        onboardingSummary:
          'Antes de enviar, confirme que seu curso é original ou devidamente licenciado, descrito com precisão e pronto para revisão do marketplace.',
        body: 'Docentes devem enviar credenciais precisas, publicar conteúdo original ou devidamente licenciado, responder profissionalmente a problemas de estudantes, seguir as políticas do marketplace e aceitar que a NexExam pode revisar, reter, rejeitar ou remover conteúdo que crie risco para estudantes, jurídico, de pagamento ou da plataforma.',
      },
      studentTerms: {
        title: 'Termos do estudante',
        body: 'Estudantes devem usar materiais do curso para aprendizado pessoal, enviar trabalhos honestos, evitar assédio ou abuso da plataforma, respeitar a propriedade intelectual dos docentes e relatar preocupações de segurança, qualidade ou pagamento pelas ferramentas de denúncia do marketplace.',
      },
    },
    report: {
      title: 'Denunciar um problema do marketplace',
      description:
        'Envie isto para a equipe de segurança da plataforma revisar. Denúncias são privadas para administradores.',
      reportCourse: 'Denunciar curso ou docente',
      detailsPlaceholder:
        'Adicione detalhes que ajudem a equipe de segurança a revisar.',
      submit: 'Enviar denúncia',
      reasons: {
        misleadingContent: 'Conteúdo enganoso',
        unsafeAdvice: 'Orientação insegura',
        harassment: 'Assédio',
        fraud: 'Fraude ou golpe',
        intellectualProperty: 'Questão de propriedade intelectual',
        paymentIssue: 'Problema de pagamento ou reembolso',
        other: 'Outro',
      },
    },
    success: {
      policyAccepted: 'Política aceita',
      reportCreated: 'Denúncia enviada',
      adminActionSaved: 'Ação de confiança e segurança salva',
      ruleScanComplete:
        'Escaneamento de risco concluído. {0} alerta(s) criado(s).',
    },
    errors: {
      policyNotFound: 'Política não encontrada',
      policyAcceptanceRequired:
        'Aceite a política atual do marketplace antes de continuar.',
      creatorDisabled:
        'Este criador está desativado para atividade no marketplace.',
      courseSafetyHold:
        'Este curso tem uma retenção de segurança e não pode ser publicado.',
      riskFlagsBlock:
        'Resolva alertas de confiança e segurança de alta prioridade antes de publicar.',
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
      title: 'Link de criação de conta',
      description:
        'Envie um link de convite seguro para um possível estudante ou administrador.',
      emailSubject: 'Seu convite de conta da NexExam',
      emailBody: `<p>Olá,</p><p>Você foi convidado a participar de {0} na NexExam.</p><p>Use este link seguro para criar sua conta:</p><p><a href="{1}">{1}</a></p><p>Obrigado,</p><p>Equipe NexExam</p>`,
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
        'reCAPTCHA está desabilitado nesta plataforma. Pulando verificação.',
      invalid: 'reCAPTCHA inválido',
    },
  },

  emails: {
    passwordResetEmail: {
      subject: `Redefina sua senha para {0}`,
      content: `<p>Olá,</p> <p> Siga este link para redefinir sua senha do {0} para sua conta. </p> <p><a href="{1}">{1}</a></p> <p> Se você não solicitou a redefinição de sua senha, pode ignorar este e-mail. </p> <p>Obrigado,</p> <p>Sua equipe {0}</p>`,
    },
    verifyEmailEmail: {
      subject: `Verifique seu e-mail para {0}`,
      content: `<p>Olá,</p><p>Siga este link para verificar seu endereço de e-mail.</p><p><a href="{1}">{1}</a></p><p>Se você não solicitou a verificação deste endereço, pode ignorar este e-mail. </p> <p>Obrigado,</p> <p>Sua equipe {0}</p>`,
    },
    emailChangeEmail: {
      subject: `Aprovar alteração de e-mail para {0}`,
      content: `<p>Olá,</p><p>Você solicitou a alteração de seu endereço de e-mail para <strong>{2}</strong>.</p><p>Siga este link para aprovar a alteração:</p><p><a href="{1}">{1}</a></p><p>Se você não solicitou esta alteração, pode ignorar este e-mail e seu endereço de e-mail permanecerá inalterado.</p><p>Obrigado,</p><p>Sua equipe {0}</p>`,
    },
    invitationEmail: {
      multiOrganization: {
        subject: `Você foi convidado para {1} em {0}`,
        content: `<p>Olá,</p> <p>Você foi convidado para {2}.</p> <p>Siga este link para se cadastrar.</p> <p><a href="{1}">{1}</a></p> <p>Obrigado,</p> <p>Sua equipe {0}</p>`,
      },
      singleOrganization: {
        subject: `Você foi convidado para {0}`,
        content: `<p>Olá,</p> <p>Você foi convidado para {0}.</p> <p>Siga este link para se cadastrar.</p> <p><a href="{1}">{1}</a></p> <p>Obrigado,</p> <p>Sua equipe {0}</p>`,
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
      'Cada compra única no Stripe de um curso pago. Emita reembolsos primeiro no Stripe Dashboard e depois marque aqui para revogar o acesso e cancelar o pagamento vinculado ao criador.',
    empty: 'Ainda não há compras de cursos.',
    columns: {
      buyer: 'Comprador',
      course: 'Curso',
      amount: 'Valor',
      paidAt: 'Pago em',
      refundedAt: 'Reembolsado em',
      actions: 'Ações',
    },
    actions: {
      markRefunded: 'Marcar reembolsado',
      cancel: 'Cancelar',
      save: 'Salvar',
    },
    filters: {
      all: 'Todas',
      active: 'Ativas',
      refunded: 'Reembolsadas',
    },
    refundDialog: {
      title: 'Marcar compra reembolsada',
      description:
        'Confirma que você já emitiu o reembolso no Stripe. Remove o acesso ao curso do comprador e cancela o pagamento vinculado ao criador. Isso não pode ser desfeito.',
      reasonLabel: 'Motivo do reembolso (opcional)',
      reasonPlaceholder: 'Nota interna para o log de auditoria',
    },
    badges: {
      paid: 'Paga',
      refunded: 'Reembolsada',
    },
  },
  studentOnboarding: {
    title: 'Escolha seus primeiros cursos',
    body: 'Escolha qualquer curso gratuito para se inscrever agora. Você pode explorar o marketplace completo a qualquer momento; cursos pagos ficam na página do curso.',
    skip: 'Pular por enquanto',
    continue: 'Continuar para o painel',
    enrollLabel: 'Inscrever-se',
    enrolledLabel: 'Inscrito',
    viewLabel: 'Ver curso',
    emptyMessage:
      'Estamos preparando uma nova leva de cursos. Entre quando estiver pronta.',
  },
  aiTutor: {
    title: 'AI Tutor',
    subtitle: 'Pergunte, pratique, planeje — seu parceiro de estudo.',
    newChat: 'Novo chat',
    search: 'Buscar conversas',
    untitled: 'Novo chat',
    emptyHeroTitle: 'Como posso ajudar você a estudar hoje?',
    emptyHeroBody:
      'Faça uma pergunta, peça um quiz ou crie um plano de estudo.',
    suggestionExplain: 'Explique minha última aula',
    suggestionQuiz: 'Faça um quiz deste módulo',
    suggestionPlan: 'Crie um plano de estudo de 7 dias',
    suggestionPractice: 'Dê-me 12 perguntas de prática',
    header: {
      openHistory: 'Abrir histórico',
      studyMode: 'Modo de estudo',
    },
    timer: {
      toggle: 'Mostrar ou ocultar temporizador de estudo',
      label: 'Temporizador de estudo',
      close: 'Fechar temporizador de estudo',
      pause: 'Pausar temporizador',
      resume: 'Retomar temporizador',
    },
    history: {
      todayGroup: 'Hoje',
      yesterdayGroup: 'Ontem',
      previousWeekGroup: 'Últimos 7 dias',
      olderGroup: 'Mais antigas',
      rename: 'Renomear',
      archive: 'Arquivar',
      actions: 'Ações da conversa',
      confirmArchive: 'Arquivar esta conversa? Você pode restaurá-la depois.',
      empty: 'Ainda não há conversas — comece fazendo uma pergunta.',
    },
    composer: {
      placeholder: 'Mensagem para AI Tutor',
      sendAriaLabel: 'Enviar mensagem',
      stopAriaLabel: 'Parar geração',
      attachComingSoon: 'Anexos em breve',
      disclaimer:
        'AI Tutor pode cometer erros. Verifique respostas importantes.',
    },
    thread: {
      thinking: 'Pensando…',
      usingTool: 'Usando {0}…',
      retry: 'Tentar novamente',
      courseChip: 'Curso: {0}',
      lessonChip: 'Aula: {0}',
    },
    widgets: {
      headerLabel: 'AI Tutor',
      expand: 'Expandir',
      openLesson: 'Abrir aula',
      continueChat: 'Continuar chat',
      submitAnswers: 'Enviar respostas',
      quiz: {
        title: 'Quiz',
        scorePrefix: 'Pontuação',
        correct: 'Correta',
        incorrect: 'Incorreta',
        reviewExplanation: 'Mostrar explicação',
        tryAgain: 'Tentar novamente',
      },
      practice: {
        title: 'Prática',
        attemptedOf: '{0} de {1} tentadas',
        finish: 'Finalizar prática',
      },
      explain: {
        title: 'Explicação',
        openFullLesson: 'Abrir aula completa',
      },
      summary: {
        title: 'Resumo',
        copyToNotes: 'Copiar para notas',
      },
      plan: {
        title: 'Plano de estudo',
        savePlan: 'Salvar plano',
        saveSingle: 'Adicionar ao plano',
        completed: 'Salvo',
        daysShort: 'd',
      },
    },
    alerts: {
      limitDaily:
        'Você atingiu seu limite diário pessoal do AI Tutor. Ele reinicia amanhã.',
      limitOrg:
        'Sua organização atingiu o limite diário do AI Tutor. Ele reinicia amanhã.',
      limitGlobal:
        'AI Tutor atingiu sua capacidade diária. Tente novamente amanhã.',
      concurrentRequest:
        'Outra solicitação do AI Tutor está em andamento. Aguarde um momento e tente novamente.',
      networkError:
        'Não foi possível acessar o AI Tutor. Verifique sua conexão e tente novamente.',
      dismiss: 'Dispensar',
    },
  },

  legal: {
    terms: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Termos de serviço',
      lastUpdated: 'Última atualização em 2026-05-23',
      body: `# Termos de serviço\n\nEstes Termos regem seu acesso e uso da NexExam ("o Serviço"). Ao criar uma conta, você concorda com estes Termos.\n\n## 1. Elegibilidade\nVocê deve ter pelo menos 13 anos. Ao se cadastrar, confirma que atende a esse requisito de idade.\n\n## 2. Conta\nVocê é responsável por proteger sua senha e por toda atividade em sua conta. Avise-nos imediatamente sobre qualquer uso não autorizado.\n\n## 3. Uso aceitável\nSem conteúdo ilegal, sem falsidade ideológica, sem scraping e sem abuso automatizado.\n\n## 4. Conteúdo\nVocê mantém a propriedade do conteúdo enviado. Você nos concede uma licença para hospedar, exibir e processar esse conteúdo conforme necessário para operar o Serviço.\n\n## 5. Pagamentos\nCompras de cursos e sessões 1:1 são cobradas via Stripe. Reembolsos seguem a política exibida no checkout.\n\n## 6. Encerramento\nVocê pode fechar sua conta a qualquer momento. Podemos suspender ou encerrar contas que violem estes Termos.\n\n## 7. Isenções e responsabilidade\nO Serviço é fornecido "como está". Na máxima medida permitida por lei, rejeitamos todas as garantias.\n\n## 8. Alterações\nPodemos atualizar estes Termos. O uso contínuo após alterações materiais significa que você aceita os Termos atualizados.\n\n## 9. Contato\nDúvidas? Envie email para legal@nexexam.com.`,
    },
    privacy: {
      version: '2026-05-23',
      legalReviewRequired: true,
      title: 'Política de privacidade',
      lastUpdated: 'Última atualização em 2026-05-23',
      body: `# Política de privacidade\n\nEsta Política descreve o que coletamos, como usamos e seus direitos.\n\n## 1. O que coletamos\nInformações da conta (email, nome, data de nascimento), atividade do curso, metadados de pagamento via Stripe, conversas com tutor de IA e telemetria operacional.\n\n## 2. Como usamos\nPara operar o Serviço, personalizar sua experiência de estudo, processar pagamentos, cumprir a lei e nos comunicar com você.\n\n## 3. Compartilhamento\nCom provedores de serviço (Stripe, AWS, entrega de email, Anthropic para tutoria de IA) sob acordos de processamento de dados. Não vendemos seus dados.\n\n## 4. Seus direitos\nVocê pode solicitar uma cópia dos seus dados ou excluir sua conta a qualquer momento em Configurações da conta. Usuários da UE, Reino Unido e Canadá têm direitos adicionais, incluindo correção e portabilidade.\n\n## 5. Retenção\nRegistros relevantes para impostos (compras, logs de auditoria) são mantidos conforme a lei aplicável. Outros dados pessoais são removidos em até 14 dias após a exclusão da conta.\n\n## 6. Transferências internacionais\nDados podem ser processados fora do seu país. Usamos salvaguardas adequadas.\n\n## 7. Crianças\nO Serviço não é direcionado a menores de 13 anos.\n\n## 8. Alterações\nNotificaremos você sobre alterações materiais nesta Política.\n\n## 9. Contato\nprivacy@nexexam.com.`,
    },
  },

  account: {
    privacyTabLabel: 'Privacidade e conta',
    delete: {
      cardTitle: 'Excluir sua conta',
      cardBody:
        'Remova permanentemente sua conta e seus dados pessoais. Registros fiscais (compras, logs de auditoria) são mantidos conforme exigido por lei.',
      cardAction: 'Excluir conta',
      dialogTitle: 'Excluir sua conta',
      dialogBody:
        'Após 14 dias, sua conta e a maioria dos dados pessoais serão removidos. Você pode cancelar a qualquer momento dentro desse período nesta página ou pelo link de email que enviaremos.',
      dialogAcknowledge: 'Entendo que isso é permanente.',
      dialogSubmit: 'Continuar',
      requestSentTitle: 'Verifique seu email',
      requestSentBody:
        'Enviamos um link de confirmação para sua caixa de entrada. Clique em até 24 horas para confirmar a exclusão. Sem confirmação, nada muda.',
      confirmedSuccessTitle: 'Exclusão confirmada',
      confirmedSuccessBody:
        'Sua conta será removida em {0}. Você pode cancelar a qualquer momento antes disso.',
      confirmedExpiredTitle: 'Este link não pode ser usado',
      confirmedExpiredBody:
        'O link de confirmação é inválido ou já foi usado. Abra Configurações da conta para solicitar um novo link.',
      cancelBannerTitle: 'Sua conta está programada para exclusão em {0}',
      cancelBannerAction: 'Cancelar exclusão',
      cancelledToast: 'Exclusão cancelada.',
      errors: {
        alreadyDeleted: 'Esta conta já foi excluída.',
      },
    },
    dataExport: {
      cardTitle: 'Baixar uma cópia dos seus dados',
      cardBody:
        'Vamos preparar um arquivo JSON com sua conta, cursos, notas, chats e outros dados pessoais. Você receberá um email quando estiver pronto.',
      cardAction: 'Solicitar exportação',
      cooldownBody:
        'Tente novamente em {0} horas — apenas uma exportação por janela de 24 horas.',
      statusQueued: 'Preparando',
      statusCompleted: 'Pronta',
      statusFailed: 'Falhou',
      downloadAction: 'Baixar',
      downloadHint:
        'Links de download expiram após 15 minutos por segurança. Clique novamente para gerar um novo link.',
      emptyTitle: 'Ainda não há exportações',
      emptyBody: 'Quando você solicitar uma, ela aparecerá aqui.',
      requestedToast: 'Exportação enfileirada. Verifique em um minuto.',
    },
    emailPreferences: {
      cardTitle: 'Preferências de email',
      cardBody: 'Escolha quais emails não essenciais deseja receber.',
      marketingLabel: 'Promoções e marketing',
      digestLabel: 'Resumo semanal de estudos',
      productUpdatesLabel: 'Atualizações do produto',
      alwaysOnLabel: 'Segurança e recibos',
      alwaysOnHint:
        'Sempre enviados — necessários para segurança da conta e pagamentos. Não podem ser desativados.',
      savedToast: 'Preferências salvas.',
    },
    mobile: {
      title: 'Aprendizado móvel',
      nativeReady:
        'Este dispositivo pode receber lembretes de cursos e links diretos.',
      webReady:
        'Os lembretes móveis ficam prontos quando você abre o NexExam pelo app móvel.',
      browser: 'Navegador',
      smartReminders: 'Lembretes inteligentes de estudo',
      smartRemindersDescription:
        'Usa datas do plano, flashcards, sequências e datas de exame.',
      pushReminders: 'Lembretes push',
      pushRemindersDescription:
        'Envia lembretes ao seu dispositivo móvel registrado.',
      quietHoursStart: 'Início do horário silencioso',
      quietHoursEnd: 'Fim do horário silencioso',
      save: 'Salvar configurações móveis',
      requestPush: 'Ativar push',
      syncNow: 'Sincronizar agora',
      saved: 'Configurações móveis salvas.',
      pushRequested: 'Registro push atualizado.',
    },
  },

  cookies: {
    bannerTitle: 'Cookies',
    bannerBody:
      'Usamos cookies para manter sua sessão ativa e operar o Serviço. Com seu consentimento, também usaremos cookies de análise e marketing.',
    acceptAll: 'Aceitar tudo',
    essentialOnly: 'Apenas essenciais',
    customize: 'Personalizar',
    customizeTitle: 'Preferências de cookies',
    essentialLabel: 'Essenciais',
    essentialBody: 'Necessárias para entrar e usar o Serviço.',
    analyticsLabel: 'Analytics',
    analyticsBody:
      'Ajuda-nos a entender como o Serviço é usado. Nenhum dado pessoal é vendido.',
    marketingLabel: 'Marketing',
    marketingBody: 'Usado para medir o impacto das nossas comunicações.',
    save: 'Salvar preferências',
  },

  signup: {
    dateOfBirthLabel: 'Data de nascimento',
    dateOfBirthHint:
      'Obrigatória por lei. Usamos apenas para verificar se você tem 13 anos ou mais.',
    termsCheckboxLabel:
      'Concordo com os [Termos de serviço]({0}) e a [Política de privacidade]({1}).',
    coppaBlockedTitle: 'Não podemos criar sua conta',
    coppaBlockedBody:
      'Contas nesta plataforma exigem idade de {0} anos ou mais. Contas familiares com consentimento parental chegarão em breve.',
    termsRequiredError:
      'Você deve aceitar os Termos de serviço e a Política de privacidade para continuar.',
    privacyRequiredError:
      'Você deve aceitar a Política de privacidade para continuar.',
    dobRequiredError: 'Informe sua data de nascimento.',
  },
};

export { dictionary };
