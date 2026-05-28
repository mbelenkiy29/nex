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
    backHome: 'Voltar ao início',
    sidebar: 'Barra lateral',
    sidebarDescription: 'Exibe a barra lateral móvel.',
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
        'Seu perfil de criador foi aprovado. Você pode criar cursos e enviá-los para análise da NexExam.',
      applicationRejected:
        'Sua solicitação precisa de alterações antes da aprovação. Revise as notas do administrador e reenvie o perfil.',
      startApplication: 'Iniciar solicitação',
      editApplication: 'Atualizar solicitação',
      workspaceTitle: 'Espaço de cursos',
      workspaceBody:
        'Use o construtor de cursos para organizar currículo, aulas, questionários, simulados e resultados antes de enviar para análise.',
      reviewTitle: 'Revisão de publicação',
      reviewBody:
        'Administradores da NexExam aprovam cursos enviados, gerenciam a publicação no catálogo e revisam matrículas, pagamentos e ajustes de receita.',
      deferredTitle: 'Ajustes de receita',
      deferredBody:
        'A participação na receita e os detalhes de pagamento são configurados nas ferramentas administrativas de cada curso.',
      metricsTitle: 'Métricas do criador',
      metricsBody:
        'Acompanhe matrículas, conclusão, avaliações e atividade de receita nos seus cursos.',
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
      masteryMap: 'Mapa de dominio',
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
    nextUnlock: {
      badge: 'Próximo desbloqueio',
      activeBadge: 'Premium ativo',
      title: 'Desbloqueie seu ciclo de aprendizagem com IA',
      activeTitle: 'Seu ciclo de aprendizagem premium está pronto',
      body: 'O Premium transforma cursos, prática, notas e tutor IA em uma trilha guiada.',
      activeBody:
        'Use as ferramentas de IA desbloqueadas para transformar progresso em preparo mensurável.',
      aiPlanTitle: 'Plano de estudo com IA',
      aiPlanBody:
        'Transforme pontos fracos e prazos em tarefas diárias focadas.',
      practiceTitle: 'Prática premium',
      practiceBody:
        'Revele mais perguntas direcionadas e revisão no estilo do exame.',
      certificateTitle: 'Caminho para certificado',
      certificateBody: 'Acompanhe o trabalho que leva à conclusão verificada.',
      subscriptionCta: 'Ver planos premium',
      coursesCta: 'Explorar cursos',
      aiTutorCta: 'Abrir tutor IA',
    },
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
    masteryMap: {
      badge: 'Mapa de dominio',
      title: 'Proteja seu progresso',
      body: 'Acompanhe preparo, pontos fracos, desbloqueios, sequencias e certificados que mostram que seu aprendizado esta crescendo.',
      emptyBody:
        'Inscreva-se em um curso para criar sua tendencia de preparo, mapa de habilidades, desbloqueios, sequencia e caminho de certificado.',
      browseCourses: 'Explorar cursos',
      readinessScore: 'Pontuacao de preparo',
      points: 'pontos',
      openCta: 'Abrir Mapa de dominio',
      nextMilestone: 'Proximo marco de preparo',
      milestoneTarget: '{0} pontos de preparo',
      milestoneProgress: '{0}% deste marco protegido',
      unlockedModulesValue: '{0} / {1}',
      certificatesValue: '{0} / {1}',
      streakValue: '{0} dia(s)',
      milestonesTitle: 'Marcos de preparo para exame',
      milestonesBody:
        'Cada marco torna o progresso visivel antes do certificado final.',
      milestoneLabels: {
        baseline: 'Linha de base mapeada',
        momentum: 'Impulso construido',
        ready: 'Pronto para exame',
        examReady: 'Preparo final',
        mastered: 'Dominio protegido',
      },
      metrics: {
        weakSkills: 'Pontos fracos',
        weakSkillsHelper: 'Habilidades que podem reduzir o preparo.',
        unlockedModules: 'Modulos desbloqueados',
        unlockedModulesHelper: 'Areas do curso abertas pelo progresso.',
        certificates: 'Certificados',
        certificatesHelper: 'Caminhos de prova ganhos ou em andamento.',
        streak: 'Sequencia de estudo',
        streakHelper: 'Melhor sequencia: {0} dia(s)',
      },
      trend: {
        title: 'Tendencia de preparo',
        body: 'Capturas diarias mostram se o estudo protege ou acelera o progresso.',
        chartLabel: 'Grafico de tendencia de preparo',
        delta: '+{0}',
        direction: {
          up: 'Subindo',
          down: 'Precisa de atencao',
          flat: 'Estavel',
          none: 'Nova tendencia',
        },
      },
      premium: {
        title: 'A economia completa de progresso desbloqueia com premium',
        body: 'Premium conecta o mapa entre cursos, proximos passos com IA e pratica profunda ao progresso que voce esta criando.',
        cta: 'Ver planos premium',
      },
      weakSkills: {
        title: 'Pontos fracos para proteger',
        body: 'Foque nas habilidades que podem reduzir o preparo antes de adicionar novo conteudo.',
        empty:
          'Nenhum ponto fraco detectado ainda. Complete praticas ou diagnosticos para revelar.',
        practiceCta: 'Praticar',
      },
      modules: {
        title: 'Modulos desbloqueados',
        body: 'Veja quais secoes estao abertas, atuais, completas ou esperando progresso anterior.',
        empty: 'Ainda nao ha modulos disponiveis.',
        lessons: '{0} de {1} aulas',
        status: {
          complete: 'Completo',
          current: 'Atual',
          unlocked: 'Desbloqueado',
          locked: 'Bloqueado',
        },
      },
      streaks: {
        title: 'Sequencias que protegem progresso',
        body: 'Sequencias mostram onde a atividade recente mantem o impulso.',
        dayCount: '{0} dia(s)',
        lastActivity: 'Ultima atividade {0}',
        noActivity: 'Sem atividade ainda',
      },
      certificates: {
        title: 'Caminhos de certificado',
        body: 'Certificados transformam aprendizado concluido em prova que usuarios mantem.',
        lessons: '{0} de {1} aulas',
        view: 'Ver',
        status: {
          earned: 'Ganho',
          inProgress: 'Em andamento',
          locked: 'Bloqueado',
          unavailable: 'Indisponivel',
          revoked: 'Revogado',
        },
      },
      preview: {
        badge: 'Economia de progresso',
        title: 'Mapa de dominio',
        body: 'Mostre o progresso que usuarios querem proteger antes de pagar por mais aceleracao.',
        readiness: 'Preparo',
        streak: 'Sequencia',
        weakestSkill: 'Ponto mais fraco',
        noWeakSkill: 'Nenhum ponto fraco ainda',
        nextMilestone: 'Proximo marco',
        noMilestone: 'Nenhum marco ainda',
        cta: 'Abrir mapa',
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

    disable: {
      success: 'Usuário desabilitado com sucesso',
      confirmTitle: 'Desabilitar usuário?',
      label: 'Desabilitar',
    },

    restore: {
      success: 'Usuário restaurado com sucesso',
      confirmTitle: 'Restaurar usuário?',
      label: 'Restaurar',
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
    activation: {
      title: 'Premium desbloqueado',
      unlockingTitle: 'Desbloqueando seu plano premium',
      unlockingBody:
        'O pagamento foi concluído. O NexExam está abrindo suas ferramentas premium agora.',
      retryUnlock: 'Verificar novamente',
      unlockedPlan: 'Seu plano desbloqueado',
      titleWithPlan: '{0} está ativo',
      body: 'As ferramentas de estudo premium agora estão disponíveis no seu espaço de aprendizagem.',
      exploreCourses: 'Explorar cursos',
      aiCoachTitle: 'Coach de IA',
      aiCoachBody:
        'Gere planos de estudo e receba ajuda guiada quando ficar travado.',
      readinessTitle: 'Indicadores de preparo',
      readinessBody:
        'Acompanhe progresso, pontos fracos e próximas ações em um só lugar.',
      practiceTitle: 'Prática mais profunda',
      practiceBody:
        'Use fluxos premium para transformar pontos fracos em revisão focada.',
      openTutor: 'Abrir tutor IA',
      openPractice: 'Iniciar prática',
      openMasteryMap: 'Abrir mapa de dominio',
      openDashboard: 'Ir para meu aprendizado',
    },
    mobileUnavailableTitle: 'Assinaturas não disponíveis',
    mobileUnavailable:
      'Assinaturas não estão disponíveis em dispositivos móveis. Por favor, visite nosso site em um navegador desktop para gerenciar sua assinatura.',
    value: {
      eyebrow: 'Sistema de aprendizagem premium',
      title: 'Assine quando quiser que o NexExam guie toda a jornada.',
      body: 'Compre um curso para um objetivo específico ou desbloqueie a camada premium com planejamento IA, progresso entre cursos e prática mais profunda.',
      courseTitle: 'Comprar um curso',
      courseBody:
        'Ideal para uma certificação, aula ou resultado guiado por criador.',
      subscriptionTitle: 'Assinar premium',
      subscriptionBody:
        'Ideal para coaching IA contínuo, acompanhamento de preparo e ferramentas premium em vários cursos.',
      includedTitle: 'Premium desbloqueia',
      included: [
        'Coach de estudo IA e planos adaptativos',
        'Insights de preparo entre cursos',
        'Prática premium e revisão de pontos fracos',
        'Contexto prioritário do tutor IA e histórico de estudo salvo',
      ],
      comparisonTitle: 'Escolha o caminho que combina com seu objetivo',
      comparisonRows: [
        {
          label: 'Valor principal',
          course: 'Desbloquear um curso especializado',
          subscription:
            'Desbloquear o sistema de aprendizagem ao redor dos cursos',
        },
        {
          label: 'Ideal para',
          course: 'Um exame ou habilidade específica',
          subscription: 'Preparação contínua e estudo guiado',
        },
        {
          label: 'Sensação premium',
          course: 'Currículo completo, certificado e tarefas',
          subscription:
            'Coach IA, plano adaptativo, preparo e prática mais profunda',
        },
      ],
      cardUnlockLabel: 'Desbloqueios incluídos',
    },

    intervals: {
      day: 'Diário',
      week: 'Semanal',
      month: 'Mensal',
      year: 'Anual',
    },
    intervalUnits: {
      day: 'dia',
      week: 'semana',
      month: 'mes',
      year: 'ano',
    },
    intervalUnitsPlural: {
      day: 'dias',
      week: 'semanas',
      month: 'meses',
      year: 'anos',
    },
    priceInterval: '/{0}',
    intervalCountLabel: '{0} {1}',

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
  checkoutTrust: {
    badge: 'Checkout seguro com Stripe',
    finalTotal: 'Total final mostrado antes do pagamento: {0}',
    subscriptionRenewal:
      'Renova a cada {0}. Gerencie ou cancele antes da próxima renovação.',
    courseOneTime:
      'Compra única do curso. O acesso abre depois que o pagamento é confirmado.',
    courseBundleOneTime:
      'Compra única do pacote. Os cursos incluídos são liberados depois que o pagamento é confirmado.',
    aiCreditOneTime:
      'Compra única de créditos de IA. Os créditos são adicionados depois que o pagamento é confirmado.',
    courseRefund: 'A política de reembolso é revisada antes do checkout.',
    oneOnOneOneTime:
      'Pagamento único da reserva. Sua sessão confirma depois que o pagamento é confirmado.',
    oneOnOneHold:
      'Seu horário fica reservado por 30 minutos enquanto o checkout é concluído.',
    couponReview:
      'Cupom inserido. O Stripe mostrará o total com desconto antes do pagamento.',
    paymentMethods:
      'Cartões, carteiras e métodos de pagamento locais aparecem quando disponíveis para sua localização.',
    noSurpriseFees:
      'Sem taxas surpresa da NexExam. Impostos ou taxas obrigatórias aparecem antes do pagamento.',
    secureAfterPayment: 'Pago com segurança pelo Stripe',
    checkoutCancelled:
      'O checkout foi cancelado. Nenhum pagamento foi concluído e nenhum acesso mudou.',
    sessionPaymentSuccess:
      'Pagamento concluído. Sua sessão está sendo confirmada.',
    stripeCustomText: {
      subscriptionSubmit:
        'Checkout seguro de assinatura com Stripe. Os termos de renovação e o total final aparecem antes de assinar.',
      courseSubmit:
        'Checkout único seguro com Stripe. O total final aparece antes de pagar.',
      courseBundleSubmit:
        'Checkout seguro de pacote com Stripe. O total final aparece antes de pagar.',
      aiCreditPackSubmit:
        'Checkout seguro de créditos de IA com Stripe. O total final aparece antes de pagar.',
      oneOnOneSessionSubmit:
        'Checkout seguro de reserva com Stripe. Seu horário fica reservado enquanto o pagamento é concluído.',
      afterSubmit:
        'A NexExam libera o acesso somente depois que o Stripe confirma o pagamento.',
    },
  },
  pricing: {
    recommended: 'Recomendado',
    savingsBadge: 'Economize {0}%',
    oneTime: 'Pagamento único',
    perMonth: 'por mês',
    perYear: 'por ano',
    choosePackage: 'Escolher pacote',
    buyCredits: 'Comprar créditos',
    buyBundle: 'Comprar pacote',
    addAiCredits: 'Adicionar créditos de IA',
    aiTokensIncluded: '{0} tokens de IA incluídos',
    aiCreditShelfTitle: 'Pacotes de créditos de IA',
    aiCreditShelfBody:
      'Para uso mais intenso do tutor de IA e planos de estudo, adicione capacidade de tokens sem mudar de plano.',
    aiCreditPurchaseSuccess:
      'Créditos de IA comprados. Sua capacidade extra de IA já está disponível.',
    bundlePurchaseSuccess:
      'Pacote comprado. Os cursos incluídos estão sendo liberados.',
    coursePurchaseDescription:
      'Um pagamento libera este curso, práticas, prompts do tutor de IA e caminho de certificado.',
    lifetimeAccessName: 'Acesso vitalício: {0}',
    lifetimeAccessDescription:
      'Acesso vitalício a um curso selecionado sem renovação.',
    benefits: {
      coursePurchase: [
        'Aulas do curso e práticas',
        'Prompts iniciais do tutor de IA',
        'Caminho de certificado',
      ],
      lifetime: [
        'Acesso vitalício para este curso selecionado',
        'Atualizações futuras do curso incluídas',
        'Sem data de renovação',
      ],
      bundle: [
        'Todos os cursos incluídos',
        'Um checkout para a trilha completa',
        'Certificados para cursos elegíveis',
      ],
      aiCredits: [
        'Capacidade extra para o tutor de IA',
        'Funciona com planos de estudo e explicações',
        'Créditos não usados permanecem na sua conta',
      ],
    },
  },
  contextualPaywall: {
    badges: {
      personalized_onboarding_result: 'Plano pessoal pronto',
      diagnostic_result: 'Diagnóstico completo',
      preview_lesson_complete: 'Prévia concluída',
      ai_full_plan: 'Plano completo de IA',
      locked_certificate: 'Caminho de certificado',
      locked_practice_exam: 'Simulado',
    },
    titles: {
      personalized_onboarding_result:
        'Transforme seu objetivo em uma trilha desbloqueada',
      diagnostic_result: 'Transforme este resultado em um plano focado',
      preview_lesson_complete: 'Continue aprendendo com o curso completo',
      ai_full_plan: 'Libere o plano de estudo completo de IA',
      locked_certificate: 'Acelere este caminho de certificado',
      locked_practice_exam: 'Libere preparação de exame mais profunda',
    },
    bodies: {
      personalized_onboarding_result:
        'Seu plano mostra o ritmo inicial. O acesso pago libera currículo completo, orientação adaptativa, prática aprofundada e caminho de certificado ligado a esse objetivo.',
      diagnostic_result:
        'Premium transforma sua pontuação diagnóstica em prioridades de habilidades fracas, foco de prática e marcos de preparação.',
      preview_lesson_complete:
        'A prévia mostrou o ponto de partida. Libere as aulas restantes, práticas, prompts do tutor e caminho de certificado.',
      ai_full_plan:
        'Um plano completo usa sua preparação, habilidades fracas, progresso nas aulas e histórico de prática para orientar os próximos passos.',
      locked_certificate:
        'Premium mantém este caminho de certificado conectado a preparação, lembretes e orientação de IA enquanto o progresso libera o certificado.',
      locked_practice_exam:
        'Premium adiciona simulação de exame, sinais de preparação e acompanhamento de IA para tornar a prática uma trilha mensurável.',
    },
    bullets: {
      personalized_onboarding_result: [
        'Marcos conectados ao seu prazo',
        'Cursos recomendados para seu objetivo',
        'Orientação de IA e prática aprofundada após desbloquear',
      ],
      diagnostic_result: [
        'Habilidades fracas priorizadas pelas suas respostas',
        'Prática recomendada ligada à preparação',
        'Coaching de IA para a próxima sessão de estudo',
      ],
      preview_lesson_complete: [
        'Currículo completo e aulas bloqueadas',
        'Simulados e atividades de tarefa',
        'Contexto do tutor de IA e caminho de certificado',
      ],
      ai_full_plan: [
        'Tarefas de estudo criadas a partir do progresso',
        'Áreas fracas e histórico de prática incluídos',
        'Raciocínio transparente da IA e controles de privacidade',
      ],
      locked_certificate: [
        'Marcos do certificado sempre visíveis',
        'Preparação e sequências conectadas ao progresso',
        'Orientação de IA sobre o que concluir depois',
      ],
      locked_practice_exam: [
        'Fluxo realista de simulação de exame',
        'Sinais de preparação após tentativas',
        'Acompanhamento de IA focado em áreas fracas',
      ],
    },
    cta: {
      subscription: 'Liberar Premium',
      course: 'Liberar curso',
      aiCredits: 'Adicionar créditos de IA',
      viewPlans: 'Ver planos',
      checkoutPending: 'Preparando checkout...',
    },
    errors: {
      checkoutUnavailable: 'O checkout não está disponível para este pacote.',
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
      name: 'Nome do exame (ex.: FINRA SIE)',
      code: 'Código curto do exame (ex.: SIE, SERIES7)',
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
      aiTutorPrompt: 'Prompt do AI Tutor',
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
      aiTutorPrompt: 'Prompt de sistema para o tutor de IA do capítulo',
      objectives: 'Objetivos de aprendizagem deste capítulo',
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
      content: 'Conteúdo da aula (Markdown compatível)',
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
      correctAnswerIndex: 'Índice da resposta correta',
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
      correctAnswerIndex: 'Índice com base zero da opção correta',
      answerOptions:
        'Digite uma opção por linha. A prática do estudante usa apenas perguntas com opções de resposta.',
      explanation: 'Por que a resposta correta está correta',
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
      conceptCode: 'Identificador estável (estilo slug)',
      explanation: 'Explicação completa (Markdown)',
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
      timeLimitMinutes: 'Limite de tempo (minutos)',
      passingScore: 'Passing Score',
      maxAttempts: 'Max Attempts',
      shuffleQuestions: 'Shuffle Questions',
      showAnswersImmediately: 'Mostrar respostas imediatamente',
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
      name: 'ex.: Simulado completo, Quiz rápido, Treino por domínio',
      passingScore: 'Percentual necessário para aprovação',
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
      timeSpentSeconds: 'Tempo gasto (segundos)',
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
      noResults: 'Nenhuma nota de estudo encontrada.',
      empty:
        'Você ainda não criou notas de estudo. Comece criando sua primeira nota.',
    },

    importer: {
      title: 'Importar notas de estudo',
      menu: 'Importar notas de estudo',
    },

    export: {
      success: 'Notas de estudo exportadas com sucesso',
    },

    new: {
      menu: 'Nova nota de estudo',
      title: 'Nova nota de estudo',
      success: 'Nota de estudo criada com sucesso',
    },

    view: {
      title: 'Ver nota de estudo',
    },

    edit: {
      menu: 'Editar nota de estudo',
      title: 'Editar nota de estudo',
      success: 'Nota de estudo atualizada com sucesso',
    },

    restore: {
      success: 'Nota de estudo restaurada com sucesso',
      confirmTitle: 'Restaurar nota de estudo?',
    },

    restoreMany: {
      success: 'Notas de estudo restauradas com sucesso',
      noSelection: 'Selecione pelo menos uma nota de estudo para restaurar.',
      confirmTitle: 'Restaurar notas de estudo?',
      confirmDescription:
        'Tem certeza de que deseja restaurar as {0} notas de estudo selecionadas?',
    },

    archiveMany: {
      success: 'Notas de estudo arquivadas com sucesso',
      noSelection: 'Selecione pelo menos uma nota de estudo para arquivar.',
      confirmTitle: 'Arquivar notas de estudo?',
      confirmDescription:
        'Tem certeza de que deseja arquivar as {0} notas de estudo selecionadas?',
    },

    archive: {
      success: 'Nota de estudo arquivada com sucesso',
      confirmTitle: 'Arquivar nota de estudo?',
    },

    deleteMany: {
      success: 'Notas de estudo excluídas com sucesso',
      noSelection: 'Selecione pelo menos uma nota de estudo para excluir.',
      confirmTitle: 'Excluir notas de estudo?',
      confirmDescription:
        'Tem certeza de que deseja excluir as {0} notas de estudo selecionadas?',
    },

    delete: {
      success: 'Nota de estudo excluída com sucesso',
      confirmTitle: 'Excluir nota de estudo?',
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
      content: 'Corpo da nota (Markdown compatível)',
    },

    mcpDescription: {
      list: 'Recupera uma lista paginada de notas de estudo com filtros avançados. Permite filtrar por campos e entidades relacionadas. Retorna detalhes das notas, relações e metadados.',
      get: 'Recupera informações detalhadas de uma nota de estudo pelo ID único, incluindo relações, anexos e metadados de auditoria.',
      create:
        'Cria uma nova nota de estudo com campos, relações, anexos e propriedades personalizadas.',
      update:
        'Atualiza uma nota de estudo existente e registra automaticamente a alteração nos logs de auditoria.',
      delete:
        'Exclui permanentemente uma ou mais notas de estudo. Esta ação não pode ser desfeita.',
      archive:
        'Arquiva uma ou mais notas de estudo para ocultá-las das visualizações padrão sem excluir seus dados.',
      restore:
        'Restaura notas de estudo arquivadas para que voltem a aparecer nas visualizações padrão.',
      autocomplete:
        'Busca sugestões de notas de estudo para campos de preenchimento automático e seletores.',
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
      sourceFiles: 'Envie documentos-fonte do currículo (máx. 50 MB cada)',
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
      noResults: 'Nenhum curso encontrado.',
      empty: 'Os cursos publicados aparecerão aqui quando estiverem prontos.',
      sortLabel: 'Sort',
      sortTrending: 'Trending',
      sortTopRated: 'Top rated',
      sortNewest: 'Newest',
      sortMostPopular: 'Most popular',
      sortPriceAsc: 'Preço (menor para maior)',
      sortPriceDesc: 'Preço (maior para menor)',
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
      allCourses: 'Todos os cursos',
      viewModeLabel: 'Visualização do catálogo',
      cardView: 'Cartões',
      listView: 'Lista',
      page: 'Page',
    },
    freeSample: {
      badge: 'Amostra grátis',
      title: 'Tenha uma conquista real antes de pagar',
      body: 'Pré-visualize uma aula real e depois faça um diagnóstico curto para que o desbloqueio pareça seu próximo passo.',
      loading: 'Preparando sua amostra grátis...',
      previewLesson: 'Aula de prévia',
      startPreview: 'Iniciar aula de prévia',
      completePreview: 'Concluir prévia',
      previewComplete: 'Prévia concluída',
      emptyPreview:
        'Esta aula de prévia está pronta, mas o criador ainda não adicionou blocos de conteúdo.',
      resourcesTitle: 'Recursos da prévia',
      diagnosticBadge: 'Verificação inicial',
      diagnosticTitle: 'Faça o diagnóstico curto',
      diagnosticBody:
        'Responda algumas perguntas para ver onde o curso completo pode acelerar seu progresso.',
      signInTitle: 'Salve seu resultado de amostra',
      signInBody:
        'Entre para fazer o diagnóstico e manter a pontuação conectada a este curso.',
      signInCta: 'Entrar para continuar',
      noQuestions:
        'Este curso ainda não tem perguntas diagnósticas respondíveis.',
      previewFirstTitle: 'Termine a prévia primeiro',
      previewFirstBody:
        'Conclua a aula de amostra para desbloquear seu resultado diagnóstico curto.',
      questionCount: '{0} perguntas diagnósticas',
      startDiagnostic: 'Iniciar diagnóstico',
      answered: '{0} de {1} respondidas',
      saveAnswer: 'Salvar resposta',
      readyToScoreTitle: 'Pronto para pontuar',
      readyToScoreBody:
        'Todas as perguntas de amostra foram respondidas. Pontue o diagnóstico para ver seu próximo desbloqueio.',
      completeDiagnostic: 'Pontuar diagnóstico',
      resultTitle: 'Seu resultado inicial',
      resultBody:
        'Agora você tem um ponto de partida. Desbloqueie o curso completo para continuar esse impulso.',
      scoreLabel: 'Pontuação',
      weakDomains: 'Habilidades fracas',
      noWeakDomains:
        'Nenhuma habilidade fraca foi detectada nesta amostra curta.',
      reviewAnswers: 'Revisão das respostas',
      correct: 'Correta',
      incorrect: 'Revisar',
      errors: {
        premiumOnly:
          'Amostras grátis estão disponíveis apenas para cursos premium.',
      },
    },
    marketplace: {
      savedDefaultName: 'Saved courses',
      duration: 'Duration',
      noDuration: 'Sem duração definida',
      durationHours: '{0} hr',
      durationBuckets: {
        short: 'Under 2 hours',
        medium: '2-8 hours',
        long: '8+ hours',
      },
      learners: 'learners',
      creator: 'Creator',
      creatorProfile: 'Creator profile',
      viewCreator: 'Ver perfil do criador',
      couponCode: 'Coupon code',
      couponPlaceholder: 'Digite um código de cupom',
      unsave: 'Remover curso salvo',
      compare: 'Compare',
      compareLimit: 'Você pode comparar até 4 cursos.',
      compareSelected: '{0} selected',
      compareHint:
        'Compare preço, resultados, comprovações e estrutura do curso.',
      noCompareCourses: 'Selecione cursos do catálogo para comparar.',
      bundles: 'Course bundles',
      bundle: 'Bundle',
      coursesIncluded: 'courses included',
      creatorStats: '{0} cursos · {1} alunos',
      creatorCourses: 'Published courses',
      proof: {
        badge: 'Prova do curso',
        title: 'Por que alunos pagam por este curso',
        outcomeLabel: 'Resultado de amostra',
        outcomeValue: 'Resultado claro',
        outcomeFallback:
          'Veja a promessa do curso antes de desbloquear a trilha completa.',
        completionLabel: 'Prova de conclusão',
        completionRateValue: '{0}% de conclusão',
        completionRateHelper: '{0} de {1} alunos concluíram este curso.',
        learnerCountValue: '{0} alunos',
        learnerCountHelper:
          'A contagem de alunos aparece até haver conclusões suficientes.',
        reviewsLabel: 'Avaliações verificadas',
        reviewsValue: '{0} avaliações',
        reviewsEmptyValue: 'Avaliações em formação',
        reviewsEmptyHelper:
          'Avaliações públicas aparecem depois que alunos inscritos compartilham feedback.',
        previewLabel: 'Prévia do currículo',
        previewValue: '{0} prévias grátis',
        previewHelper: '{0} lições visíveis antes da compra.',
        creatorVerified: 'Verificado pela NexExam',
        creatorProfileFallback: 'Criador do curso',
        credentials: 'Credenciais',
        expertise: 'Especialidade',
        refundTitle: 'Política de reembolso',
        refundBadge: 'Política revisada',
        previewCurriculumTitle: 'Veja a prévia do currículo',
        previewCurriculumBody:
          '{0} lições de prévia grátis e {1} lições disponíveis após a compra.',
        certificatesIssued: '{0} certificados emitidos',
        standaloneLessons: 'Lições adicionais',
        freePreview: 'Prévia grátis',
        lockedAfterPurchase: 'Desbloquear após a compra',
        reviewsTitle: 'Avaliações de alunos verificados',
        reviewsBody:
          'Avaliações públicas de alunos inscritos ou compradores deste curso.',
        verifiedLearner: 'Aluno verificado',
        noReviewsTitle: 'As avaliações ainda estão em formação',
        noReviewsBody:
          'Feedback de alunos verificados aparecerá aqui depois que eles publicarem uma avaliação pública.',
      },
      unlock: {
        badge: 'Desbloquear',
        title: 'O que você desbloqueia',
        paidTitle: 'Desbloqueie a experiência completa do curso',
        subscriptionTitle: 'Incluído no acesso premium',
        body: 'Veja o resultado antes de pagar e depois desbloqueie a trilha completa.',
        paidBody:
          'Sua compra desbloqueia lições, prática, tarefas e caminho de conclusão deste curso.',
        subscriptionBody:
          'O Premium mantém este curso conectado a planejamento IA, preparo e prática contínua.',
        courseCardPaid:
          'Desbloqueia currículo completo, prática e caminho para certificado',
        courseCardSubscription:
          'O acesso premium desbloqueia a camada de estudo guiado',
        courseCardFree: 'Comece grátis e ganhe ritmo',
        previewLesson: 'Prévia grátis',
        lockedLesson: 'Bloqueado',
        availableAfterPurchase: 'Disponível após a compra',
        previewAvailable: 'Prévia disponível',
        items: [
          'Biblioteca completa de lições e recursos',
          'Tarefas, quizzes e exames de prática',
          'Contexto do tutor IA e coach de estudo do curso',
          'Caminho para certificado e prova de progresso',
        ],
      },
    },
    certificate: {
      title: 'Certificado de conclusão',
      view: 'View certificate',
      print: 'Print certificate',
      verified: 'Verified completion',
      awardedTo: 'Awarded to',
      learner: 'Learner',
      completedCourse: 'for completing',
      issuedAt: 'Issued',
      number: 'Certificate number',
      verificationCode: 'Verification code',
      verifyHint: 'Verifique este certificado com o código {0}.',
    },
    detail: {
      title: 'Course Detail',
      enrolled: 'Enrolled',
      notEnrolled: 'Not enrolled',
    },
    activation: {
      title: 'Curso desbloqueado',
      loading: 'Preparando seu curso desbloqueado...',
      unlockingTitle: 'Desbloqueando seu curso',
      unlockingBody:
        'O pagamento foi concluído. O NexExam está abrindo {0} e fazendo sua inscrição agora.',
      retryUnlock: 'Verificar novamente',
      viewCourse: 'Ver curso',
      unlockedPlan: 'Seu plano desbloqueado',
      startLesson: 'Iniciar lição recomendada',
      openPlayer: 'Abrir player do curso',
      whatUnlocked: 'O que foi liberado',
      aiTutor: 'Tutor IA',
      included: 'Incluído',
      recommendedLesson: 'Primeira lição recomendada',
      noLesson: 'Este curso ainda não tem uma lição visível.',
      practiceSet: 'Primeiro conjunto de prática',
      practiceQuestions: '{0} perguntas de prática prontas',
      startPractice: 'Iniciar prática',
      practiceUnavailable: 'Prática ainda não disponível',
      certificatePath: 'Caminho do certificado',
      certificateProgress: '{0} de {1} lições concluídas',
      certificateLocked: 'Conclua o curso para desbloquear seu certificado.',
      certificateUnavailable:
        'Este curso não inclui um certificado no momento.',
      aiTutorStarter: 'Prompt inicial do tutor IA',
      aiTutorPromptLesson:
        'Acabei de desbloquear {0}. Ajude-me a começar com {1} e me dê um primeiro passo claro de estudo.',
      aiTutorPromptCourse:
        'Acabei de desbloquear {0}. Ajude-me a criar um primeiro passo claro de estudo.',
      askTutor: 'Perguntar ao tutor IA',
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
      description: 'Crie, publique e gerencie cursos em toda a plataforma.',
      content: 'Course content',
      enrollments: 'Enrollments',
      reviewSubmission: 'Review submission',
      newCourse: 'New course',
      linkedContent: 'Conteúdo de curso vinculado',
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
      stripePriceId: 'ID de preço do Stripe',
      lifetimeAccessEnabled: 'Acesso vitalício disponível',
      lifetimePriceCents: 'Preço vitalício (centavos)',
      lifetimeStripePriceId: 'ID de preço Stripe vitalício',
      subscriptionPlanKey: 'Chave do plano de assinatura',
      creatorRevenueShareBps: 'Participação do criador (bps)',
      platformRevenueShare: 'Participação da plataforma (bps)',
      nexVerified: 'Nex Verified',
      creatorUserId: 'ID de usuário do criador',
      creatorMemberId: 'ID de membro do criador',
      creatorOrganizationId: 'ID da organização do criador',
      modules: 'Modules',
      lessons: 'Lessons',
      assignments: 'Assignments',
      lessonContent: 'Lesson text',
      videoFiles: 'Video files',
      prompt: 'Prompt',
      dueDate: 'Due date',
      dueDaysAfterEnroll: 'Dias até o prazo após a matrícula',
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
      lessonCompleted: 'Aula marcada como concluída.',
      assignmentSubmitted: 'Homework submitted.',
      courseSaved: 'Course saved.',
      courseUnsaved: 'Curso removido dos salvos.',
      studentEnrolled: 'Student enrolled.',
      submissionReviewed: 'Submission reviewed.',
      quizSubmitted: 'Quiz submitted.',
      ratingSaved: 'Avaliação do curso salva.',
      purchased: 'Compra concluída: você está matriculado.',
    },
    notify: {
      coursePurchaseConfirmedTitle: 'Compra do curso confirmada',
      coursePurchaseConfirmedBody:
        'Você está matriculado em {0}. Comece a aprender quando quiser.',
      courseRefundedTitle: 'Course refunded',
      courseRefundedBody:
        'Sua compra de {0} foi reembolsada. O acesso foi removido.',
    },
    errors: {
      manualEnrollmentOnly:
        'Este curso exige acesso manual, pago ou por assinatura antes da matrícula.',
      invalidCourseLink:
        'Este curso não pode ser vinculado pela organização atual.',
      submissionRequired:
        'Adicione texto ou arquivos antes de enviar a tarefa.',
      submissionPendingReview: 'Esta tarefa já foi enviada e aguarda revisão.',
      submissionComplete: 'Esta tarefa já foi concluída.',
      resubmissionNotAllowed: 'Reenvios não são permitidos para esta tarefa.',
      maxAttemptsReached:
        'Você atingiu o número máximo de tentativas para esta tarefa.',
      invalidRubricScore:
        'As pontuações da rubrica devem corresponder aos critérios e limites de pontos.',
      invalidSubmissionReviewStatus:
        'Escolha concluída ou precisa de revisão ao avaliar a tarefa.',
      ratingRequiresEnrollment: 'Matricule-se neste curso antes de avaliá-lo.',
      reviewNotPending: 'Este curso não está aguardando revisão.',
      editLockedNotDraft:
        'Retorne o curso para rascunho antes de editar seu conteúdo.',
      submitNotDraft:
        'Somente um curso em rascunho pode ser enviado para revisão.',
      submitNeedsContent:
        'Conclua a lista de publicação (título, descrição, miniatura, um módulo, mais de 3 aulas, uma avaliação e resultados) antes de enviar.',
      cannotWithdraw:
        'Somente um curso em revisão ou publicado pode ser retirado.',
      examAlreadySubmitted: 'Esta tentativa de exame prático já foi enviada.',
      categoryInUse:
        'Esta categoria não pode ser removida enquanto houver cursos atribuídos a ela.',
      coursePaymentNotConfigured:
        'Este curso ainda não está pronto para compra. Tente novamente mais tarde.',
      alreadyEnrolled: 'Você já está matriculado neste curso.',
      invalidCoupon: 'Este cupom não pode ser aplicado a este curso.',
      couponLimitReached: 'Este cupom já foi usado.',
      videoTranscriptNoVideo:
        'Envie um vídeo da aula antes de solicitar uma transcrição.',
    },
    ratings: {
      title: 'Course rating',
      summary: '{0} ({1})',
      noRatings: 'Ainda não há avaliações',
      commentPlaceholder:
        'Compartilhe o que ajudou ou o que poderia melhorar...',
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
      outline: 'Estrutura do curso e conteúdo de estudo:',
      focusedLesson: 'Current lesson',
      completed: 'completed',
      assignment: 'Assignment',
      linkedContent: 'Recursos vinculados de exame, prática e estudo:',
      videoTranscript: 'Transcrição do vídeo',
    },
    videoTranscript: {
      title: 'Transcrição do vídeo',
      statusLabel: 'Transcrição',
      retry: 'Tentar transcrição novamente',
      retryQueued: 'Nova tentativa de transcrição enfileirada.',
      status: {
        notRequested: 'Nenhuma transcrição solicitada',
        queued: 'Transcrição na fila',
        processing: 'Transcrição em processamento',
        ready: 'Transcrição pronta',
        failed: 'Falha na transcrição',
      },
    },
    studyAi: {
      actions: {
        sectionTitle: 'Ferramentas de estudo com IA',
        explainLesson: 'Explicar esta aula',
        summarizeLesson: 'Resumir esta aula',
        quizMe: 'Faça um quiz deste módulo',
        generatePractice: 'Practice questions',
      },
      result: {
        explainTitle: 'Lesson explained',
        summarizeTitle: 'Lesson summary',
        generating: 'Thinking…',
        streamError: 'Algo deu errado ao gerar. Tente novamente.',
        retry: 'Try again',
      },
      quiz: {
        quizTitle: 'Quick quiz',
        practiceTitle: 'Practice questions',
        generating: 'Criando suas perguntas…',
        intro: 'Responda cada pergunta e depois veja seus resultados.',
        start: 'Start',
        submit: 'Check answers',
        next: 'Next',
        previous: 'Back',
        retake: 'New set',
        questionProgress: 'Question {0} of {1}',
        yourScore: 'You scored {0}%',
        correctCount: '{0} of {1} correct',
        passed: 'Great work!',
        failed: 'Continue praticando: revise os tópicos abaixo.',
        domainBreakdown: 'By topic',
        correct: 'Correct',
        incorrect: 'Incorrect',
        noQuestions:
          'Não foi possível gerar perguntas. Tente um módulo com mais conteúdo de aulas.',
        aiDisclaimer: 'Prática gerada por IA; não conta para a nota do curso.',
      },
      coach: {
        title: 'Study coach',
        weakAreasTab: 'Weak areas',
        whatNextTab: 'What next',
        studyPlanTab: 'Study plan',
      },
      weakness: {
        heading: 'Onde você está perdendo pontos',
        empty:
          'Faça um quiz ou exame prático e seus pontos fracos aparecerão aqui.',
        weakest: 'Weakest topic',
        scoreLabel: '{0}% ({1}/{2})',
      },
      whatNext: {
        heading: 'O que devo estudar agora?',
        generate: 'Get a recommendation',
        regenerate: 'Refresh recommendation',
        generating: 'Pensando nisso…',
        empty:
          'Receba uma recomendação de IA com base no seu progresso e pontos fracos.',
      },
      studyPlan: {
        heading: 'Study plan',
        empty:
          'Ainda não há plano de estudos. Gere um ou adicione suas tarefas.',
        generate: 'Gerar plano de estudos',
        regenerate: 'Regenerate plan',
        generating: 'Criando seu plano…',
        addItem: 'Add task',
        addPlaceholder: 'Nova tarefa de estudo',
        markDone: 'Mark done',
        markTodo: 'Marcar como não concluída',
        deleteItem: 'Delete',
        aiBadge: 'AI',
        noDate: 'No date',
        remaining: '{0} of {1} done',
      },
      examDate: {
        title: 'Data-alvo do exame',
        set: 'Definir data do exame',
        edit: 'Edit',
        dateLabel: 'Exam date',
        nameLabel: 'Nome do exame (opcional)',
        namePlaceholder: 'e.g. SIE exam',
        save: 'Save',
        none: 'Nenhuma data de exame definida.',
        daysRemaining: '{0} dias até seu exame',
        examToday: 'Seu exame é hoje. Boa sorte!',
        examPast: 'A data do seu exame já passou.',
      },
      errors: {
        busy: 'Outra solicitação de estudo com IA ainda está em andamento. Aguarde terminar.',
        limitReached:
          'O limite diário de uso de IA foi atingido. Ele será redefinido amanhã.',
        notConfigured:
          'As ferramentas de estudo com IA não estão disponíveis no momento.',
        parseFailed: 'A IA retornou uma resposta ilegível. Tente novamente.',
        unexpectedQuizFormat:
          'A IA retornou perguntas que não puderam ser usadas. Tente um módulo com mais conteúdo.',
        moduleNoContentQuiz:
          'Este módulo ainda não tem conteúdo de aulas para um quiz.',
        moduleNoContentPractice:
          'Este módulo ainda não tem conteúdo de aulas para perguntas de prática.',
        enrollToSetExamDate:
          'Matricule-se no curso antes de definir uma data de exame.',
        unexpectedResponse:
          'A IA retornou uma recomendação inesperada. Tente novamente.',
        unexpectedStudyPlan:
          'A IA retornou um plano de estudos inesperado. Tente novamente.',
        courseScopedRequired:
          'Esta ferramenta de estudo só pode ser usada em um curso ativo.',
        lessonRequired:
          'Selecione uma aula antes de usar esta ferramenta de estudo.',
        moduleRequired:
          'Selecione um módulo antes de usar esta ferramenta de estudo.',
        signInStudyPlan: 'Entre para criar um plano de estudos.',
        unknownStudyTool: 'Ferramenta de estudo desconhecida: {0}',
        generic: 'Algo deu errado. Tente novamente.',
      },
    },
    builder: {
      menu: 'My Courses',
      title: 'Course Builder',
      description: 'Crie, visualize e publique seus próprios cursos.',
      newCourse: 'New course',
      emptyCourses: 'Você ainda não criou cursos.',
      createFirst: 'Crie seu primeiro curso',
      continueBuilding: 'Continue building',
      updatedAt: 'Updated {0}',
      completionLabel: '{0}% ready',
      nextRecommended: 'Next: {0}',
      verifyRequired:
        'Conclua a verificação de criador para criar e publicar cursos.',
      verifyCta: 'Ir para verificação de criador',
      loadError: 'Não foi possível carregar este curso.',
      backToCourses: 'Voltar para meus cursos',
      details: 'Course details',
      detailsBody:
        'O título, resumo e mídia de capa que os alunos veem primeiro.',
      curriculum: 'Curriculum',
      curriculumBody:
        'Adicione módulos e depois arraste aulas, quizzes e tarefas para ordenar.',
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
        'Ainda não há módulos. Adicione seu primeiro módulo para começar.',
      noItems: 'Ainda não há aulas, quizzes ou tarefas neste módulo.',
      noQuestions: 'Ainda não há perguntas. Adicione sua primeira pergunta.',
      rubricCriterionLabel: 'Rubric criterion',
      noRubricCriteria: 'Ainda não há critérios de rubrica.',
      submissionsTitle: 'Homework review',
      submissionsBody:
        'Revise entregas de alunos, pontue critérios da rubrica e envie feedback.',
      dragHint: 'Arraste para reordenar',
      videoUpload: 'Upload video',
      videoEmbedHint:
        'Ou cole um link do YouTube ou Vimeo para incorporar em vez de enviar.',
      resourcesHint:
        'Anexe planilhas, slides ou outros arquivos que os alunos possam baixar.',
      contentHint: 'O texto da aula aceita formatação Markdown.',
      isPreviewLesson: 'Aula de prévia gratuita',
      correctOption: 'Correct answer',
      previewBanner:
        'Prévia do aluno: é assim que os alunos vivenciam seu curso.',
      backToBuilder: 'Voltar ao construtor',
      statusDraft: 'Rascunho: apenas você pode ver este curso.',
      statusInReview: 'Em revisão: um administrador está revisando este curso.',
      statusPublished: 'Publicado: os alunos podem se matricular neste curso.',
      statusArchived: 'Archived.',
      reviewNotesTitle: 'Alterações solicitadas pelo revisor',
      submitConfirm: 'Enviar este curso para revisão administrativa?',
      withdrawConfirm: 'Retirar este curso da revisão e retorná-lo a rascunho?',
      unpublishConfirm:
        'Ao despublicar, o curso volta a rascunho e remove o acesso dos alunos matriculados. Continuar?',
      unsavedChanges: 'Você tem alterações não salvas.',
      saveFirst: 'Salve suas alterações antes de continuar.',
      actions: {
        save: 'Save draft',
        submitForReview: 'Enviar para revisão',
        withdraw: 'Retirar da revisão',
        unpublish: 'Unpublish',
        preview: 'Prévia como aluno',
        edit: 'Edit course',
        addModule: 'Add module',
        addLesson: 'Add lesson',
        addQuiz: 'Add quiz',
        addAssignment: 'Add homework',
        addRubricCriterion: 'Adicionar critério de rubrica',
        saveFeedback: 'Save feedback',
        addQuestion: 'Add question',
        addOption: 'Add option',
        remove: 'Remove',
        addPracticeExam: 'Adicionar exame prático',
        addExamRule: 'Adicionar regra de domínio',
        addOutcome: 'Add outcome',
        addRequirement: 'Add requirement',
        addFlashcardSet: 'Adicionar conjunto de flashcards',
        addFlashcard: 'Add card',
        applyMiniTemplate: 'Aplicar modelo de minicurso',
        create: 'Create course',
      },
      quizSettings: {
        timeLimit: 'Limite de tempo (min)',
        maxAttempts: 'Max attempts',
        randomizeQuestions: 'Shuffle questions',
        randomizeAnswers: 'Shuffle answers',
        showExplanations: 'Show explanations',
        allowRetries: 'Allow retries',
      },
      examSettings: {
        totalQuestions: 'Total questions',
        questionCount: 'Question count',
        simulateRealExam: 'Simular exame real',
      },
      difficulty: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
      },
      practiceExams: 'Practice exams',
      practiceExamsBody:
        'Crie exames práticos cronometrados e ponderados por domínio a partir do seu banco de perguntas.',
      noPracticeExams: 'Ainda não há exames práticos.',
      practiceExamLabel: 'Practice exam',
      examRules: 'Domain rules',
      examRulesHint:
        'Adicione uma regra por domínio do exame para ponderar como as perguntas são selecionadas.',
      anyDifficulty: 'Any difficulty',
      questionType: {
        multipleChoice: 'Multiple choice',
        trueFalse: 'True / false',
        multiSelect: 'Selecione todas as opções corretas',
      },
      setup: {
        difficulty: 'Difficulty',
        language: 'Language',
        certificateEnabled: 'Emitir certificado de conclusão',
        visibility: 'Visibility',
        audience: 'Intended audience',
        audienceHint: 'Uma descrição de público por linha.',
        promoVideo: 'Promo video',
        outcomes: 'Learning outcomes',
        outcomesBody: 'O que os alunos poderão fazer após concluir o curso.',
        requirements: 'Requirements',
        requirementsBody:
          'O que os alunos devem saber ou ter antes de começar.',
        outcomePlaceholder: 'Learning outcome',
        requirementPlaceholder: 'Requirement',
      },
      visibility: {
        private: 'Private',
        unlisted: 'Unlisted',
        public: 'Public',
      },
      flashcards: 'Flashcards',
      flashcardsBody: 'Crie conjuntos de flashcards para os alunos estudarem.',
      noFlashcardSets: 'Ainda não há conjuntos de flashcards.',
      flashcardSetLabel: 'Flashcard set',
      flashcardFront: 'Front',
      flashcardBack: 'Back',
      flashcardHint: 'Hint (optional)',
      noCards: 'Ainda não há cartões.',
      lessonHidden: 'Oculta para alunos',
      ai: {
        title: 'AI assistant',
        body: 'Gere rascunhos de conteúdo do curso com IA; você revisa tudo antes de adicionar.',
        promptPlaceholder: 'Descreva o tema, exame ou estrutura…',
        generateOutline: 'Generate outline',
        generateQuiz: 'Generate quiz',
        generateFlashcards: 'Generate flashcards',
        generateLesson: 'Generate lesson',
        improveLesson: 'Improve lesson',
        targetLessonLabel: 'Aula para melhorar',
        targetLessonPlaceholder: 'Select a lesson',
        generating: 'Generating…',
        queued: 'Queued',
        processing: 'Processing',
        completed: 'Completed',
        failed: 'Failed',
        progressLabel: '{0}% complete',
        addToCourse: 'Adicionar ao curso',
        discard: 'Discard',
        generated:
          'A IA produziu um rascunho. Revise abaixo e depois adicione ao curso.',
        qualityTitle: 'Review checklist',
        qualityBody:
          'A IA verifica cobertura de fontes, qualidade dos quizzes, duplicatas e estrutura antes de você aceitar o rascunho.',
        noQualityIssues: 'Nenhum problema de revisão encontrado.',
        sourcesTitle: 'Fontes e base',
        sourceFallback: 'Prompt do curso ou material de aula existente',
        sourceNoteFallback: 'Nenhuma nota fornecida.',
        issueTarget: 'Target: {0}',
        draftNotice:
          'O conteúdo de IA é adicionado como rascunho editável e nunca é publicado automaticamente.',
        saveFirst: 'Salve o curso uma vez antes de usar o assistente de IA.',
        notConfigured: 'A geração com IA não está disponível no momento.',
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
            'Adicione citações ou notas de fonte antes de aceitar este rascunho.',
          outlineEmpty: 'A estrutura não incluiu módulos.',
          outlineThin:
            'A estrutura pode ser limitada demais para uma experiência completa.',
          emptyTitle: 'Um item gerado está sem título.',
          questionInvalidCorrectCount:
            'Uma pergunta não tem exatamente uma resposta correta.',
          questionTooFewOptions: 'Uma pergunta tem menos de três opções.',
          questionMissingExplanation:
            'Uma pergunta não tem explicação da resposta.',
          questionMissingDomain: 'Uma pergunta não tem domínio do exame.',
          duplicateQuestion:
            'Uma pergunta gerada parece duplicar uma pergunta existente ou gerada.',
          flashcardsThin:
            'O conjunto de flashcards pode precisar de mais cartões antes de ser usado pelos alunos.',
          lessonNoBlocks:
            'O rascunho da aula não incluiu blocos de conteúdo editáveis.',
        },
        errors: {
          notConfigured: 'A geração com IA não está disponível no momento.',
          lessonRequired: 'Selecione uma aula para melhorar.',
          queueFailed:
            'Não foi possível enfileirar a geração com IA. Tente novamente.',
          courseAiNotConfigured:
            'A geração com IA não está disponível no momento.',
          courseAiParseFailed:
            'A IA retornou um rascunho ilegível. Tente novamente.',
          courseAiGenerationFailed: 'A geração com IA falhou. Tente novamente.',
          courseAiQueueFailed:
            'Não foi possível enfileirar a geração com IA. Tente novamente.',
        },
      },
      blocks: {
        title: 'Content blocks',
        body: 'Adicione blocos de conteúdo ricos e tipados à aula.',
        empty: 'Ainda não há blocos de conteúdo.',
        add: 'Add block',
        headingLevel: 'Heading level',
        textPlaceholder: 'Text…',
        listHint: 'Um item por linha.',
        calloutVariant: 'Style',
        videoUrlPlaceholder: 'Link do YouTube / Vimeo',
        selectQuiz: 'Select a quiz',
        selectFlashcardSet: 'Selecione um conjunto de flashcards',
        embeddedQuiz: 'Questionário incorporado',
        embeddedFlashcards: 'Flashcards incorporados',
        lessonVideoTitle: 'Vídeo da aula',
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
      landingPage: 'Página de destino do curso',
      landingPageBody:
        'A miniatura, vídeo promocional e público que os alunos veem antes de se matricular.',
      createBody:
        'Dê ao curso um título provisório; você poderá ajustar todo o restante depois.',
      createFlow: {
        title: 'Começar com um blueprint de curso',
        body: 'Escolha uma estrutura inicial, revise o esboço e continue refinando no construtor completo.',
        stepDetails: 'Course basics',
        stepDetailsBody:
          'Defina a identidade inicial do curso. Esses detalhes continuarão editáveis após a criação.',
        stepTemplate: 'Escolher modelo inicial',
        stepTemplateBody:
          'Os modelos criam um primeiro esboço útil para você não começar do zero.',
        stepReview: 'Outline preview',
        stepReviewBody:
          'Este rascunho será salvo imediatamente e poderá ser editado seção por seção.',
        examGoal: 'Exame ou objetivo de aprendizagem',
        createWithTemplate: 'Criar blueprint do curso',
      },
      templates: {
        examPrep: {
          title: 'Exam prep',
          badge: 'Structured',
          description:
            'Ideal para preparação para certificação, nivelamento, licenciamento ou exame final.',
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
            'Ideal para ensinar uma habilidade prática com demonstrações, tarefas e feedback.',
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
          title: 'Minicurso rápido',
          badge: 'Fast start',
          description:
            'Ideal para um tema focado que os alunos possam concluir em uma sessão curta.',
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
        title: 'Melhor próximo passo',
        ready: 'Pronto para revisão',
        fix: 'Go there',
        review: 'Review course',
      },
      recovery: {
        title: 'Restaurar rascunho não salvo?',
        body: 'Um rascunho mais recente foi encontrado. Restaure-o para continuar das últimas edições ou mantenha a versão salva.',
        restore: 'Restore draft',
        discard: 'Manter versão do servidor',
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
        submit: 'Enviar para revisão',
      },
      autosave: {
        saving: 'Saving…',
        saved: 'Saved',
        error: 'Save failed',
        retry: 'Retry',
      },
      checkpoints: {
        title: 'Version history',
        body: 'Crie pontos de restauração manuais e recupere rascunhos recentes.',
        label: 'Checkpoint label',
        labelPlaceholder: 'ex.: antes das edições do quiz final',
        create: 'Create checkpoint',
        restore: 'Restore',
        delete: 'Delete checkpoint',
        empty: 'Ainda não há checkpoints.',
        loading: 'Loading checkpoints…',
        created: 'Checkpoint created.',
        restored: 'Checkpoint restored.',
        deleted: 'Checkpoint deleted.',
        submitSnapshotLabel: 'Antes de enviar para revisão',
        sources: {
          autosave: 'Autosave',
          manual: 'Manual',
          restore: 'Restore',
          submitSnapshot: 'Submit snapshot',
        },
      },
      checklist: {
        title: 'Enviar para revisão',
        intro:
          'Seu curso deve atender a estes requisitos antes da revisão administrativa.',
        required: 'Required',
        recommended: 'Recommended',
        ready: 'Tudo parece certo; envie quando estiver pronto.',
        notReady: 'Conclua os itens acima antes de enviar.',
        fix: 'Fix',
        titleItem: 'Adicionar título do curso',
        descriptionItem: 'Escrever descrição do curso',
        thumbnailItem: 'Enviar miniatura do curso',
        moduleItem: 'Adicionar pelo menos um módulo',
        lessonsItem: 'Adicionar pelo menos três aulas',
        assessmentItem: 'Adicionar pelo menos um quiz ou exame prático',
        outcomeItem: 'Adicionar pelo menos um resultado de aprendizagem',
        audienceItem: 'Descrever para quem é este curso',
        requirementItem: 'Adicionar requisitos do curso',
        lessonContentItem: 'Adicionar conteúdo, blocos ou mídia a uma aula',
        previewLessonRecommendedItem:
          'Marque uma aula como prévia grátis antes de publicar cursos pagos',
        flashcardRecommendedItem:
          'Adicionar flashcards para prática de revisão',
      },
      success: {
        created: 'Course created.',
        saved: 'Draft saved.',
        submitted: 'Curso enviado para revisão.',
        withdrawn: 'Curso retornado para rascunho.',
      },
    },
    quiz: {
      heading: 'Quiz',
      passingScore: 'Passing score',
      noPassingScore: 'Nenhuma pontuação mínima exigida.',
      yourScore: 'Your score',
      lastScore: 'Last attempt',
      passed: 'Passed',
      failed: 'Ainda não aprovado',
      correct: 'Correct',
      incorrect: 'Incorrect',
      explanation: 'Explanation',
      selectAll: 'Selecione todas as opções corretas.',
      selectOne: 'Selecione uma resposta.',
      answerAll: 'Responda todas as perguntas antes de enviar.',
      points: 'points',
      empty: 'Este quiz ainda não tem perguntas.',
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
      empty: 'Este exame ainda não tem perguntas disponíveis.',
      answerAll: 'Responda todas as perguntas antes de enviar.',
    },
    flashcards: {
      heading: 'Flashcards',
      flip: 'Flip card',
      next: 'Next',
      previous: 'Previous',
      cardLabel: 'Card',
      showHint: 'Show hint',
      empty: 'Este conjunto ainda não tem cartões.',
    },
    review: {
      menu: 'Course Reviews',
      title: 'Cursos aguardando revisão',
      empty: 'Não há cursos aguardando revisão.',
      pending: 'Awaiting review',
      submittedAt: 'Enviado para revisão',
      decision: 'Review decision',
      notesLabel: 'Notas para o criador',
      notesHint:
        'Obrigatório ao solicitar alterações; isso é compartilhado com o criador.',
      approveBody: 'A aprovação publica o curso no catálogo imediatamente.',
      approve: 'Approve & publish',
      requestChanges: 'Request changes',
      filterAll: 'All courses',
      filterPending: 'Awaiting review',
      success: 'Revisão do curso salva.',
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
    courseContextHeader: 'Contexto do curso disponível para o tutor:',
    courseVideoTranscriptNotice:
      'As transcrições de vídeos enviados são incluídas quando o processamento termina.',
    courseScopedSystemPrompt:
      'O usuário está perguntando dentro de um curso específico. Use este contexto do curso quando for útil. Use transcrições de vídeo quando estiverem disponíveis.',
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
      badge: 'Controles de superadministrador',
      title: 'Monitorar operações da NexExam',
      description:
        'Gerencie estudantes, links de criação de conta, promoções para estudantes e pagamentos manuais a criadores em todas as organizações.',
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
      title: 'Central de comando de métricas',
      description:
        'Acompanhe crescimento, resultados de aprendizagem, receita, reembolsos, uso de IA e qualidade dos cursos.',
      range: 'Range',
      loading: 'Loading metrics...',
      empty: 'Ainda não há métricas de cursos disponíveis.',
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
        'Compare matrículas, progresso, resultados de quizzes, avaliações e receita.',
      course: 'Course',
      enrollments: 'Enrollments',
      homework: 'Homework',
      quiz: 'Quiz',
      rating: 'Rating',
      revenue: 'Revenue',
      funnelTitle: 'Funil de monetização',
      funnelDescription:
        'Meça como o interesse em cursos vira checkout, acesso pago e primeiro valor desbloqueado.',
      funnelEmpty: 'Ainda não há atividade de funil disponível.',
      viewToCheckout: 'Visualização para checkout',
      checkoutToPaid: 'Checkout para pago',
      paidToFirstValue: 'Pago para primeiro valor',
      funnelEvents: '{0} eventos',
      fromPrevious: '{0} do passo anterior',
      courseViews: 'Visualizações',
      paywallSeen: 'Paywall',
      checkoutStarted: 'Checkout',
      paid: 'Pago',
      firstValue: 'Primeiro valor',
      paidRate: 'Taxa paga',
      funnelSteps: {
        course_view: 'Visualização do curso',
        preview_start: 'Prévia',
        value_sample_started: 'Amostra iniciada',
        value_sample_completed: 'Amostra concluída',
        sample_diagnostic_started: 'Diagnóstico iniciado',
        sample_diagnostic_completed: 'Diagnóstico concluído',
        paywall_seen: 'Paywall visto',
        cta_click: 'Clique no CTA',
        checkout_started: 'Checkout',
        paid: 'Pago',
        first_value_after_payment: 'Primeiro valor',
      },
    },
    dashboard: {
      shortcut: 'Cmd K',
      adminName: 'NexExam Admin',
      adminRole: 'Super Admin',
      daily: 'Daily',
      noValue: '$0',
      loading: 'Loading users...',
      emptyUsers: 'Nenhum usuário corresponde a estes filtros.',
      showingUsers: 'Mostrando {0} de {1} usuários',
      platformWide: 'Platform-wide',
      manualPlan: 'Manual',
    },
    students: {
      title: 'Student accounts',
      description:
        'Pesquise usuários em todas as organizações e gerencie suas associações.',
    },
    invitation: {
      title: 'Link de criação de conta',
      description:
        'Envie um link de convite seguro para um possível estudante ou administrador.',
      emailSubject: 'Seu convite de conta da NexExam',
      emailBody: `<p>Olá,</p><p>Você foi convidado a participar de {0} na NexExam.</p><p>Use este link seguro para criar sua conta:</p><p><a href="{1}">{1}</a></p><p>Obrigado,</p><p>Equipe NexExam</p>`,
    },
    promotions: {
      title: 'Promoções e avisos',
      description:
        'Publique notificações toast, banners e mensagens de desconto para estudantes.',
    },
    payouts: {
      title: 'Creator payouts',
      description:
        'Acompanhe registros de pagamento manual para criadores antes de marcá-los como pagos.',
      unassigned: 'Unassigned creator',
      totalMtd: 'Total payouts',
      pendingAmount: 'Pending amount',
      successfulPayouts: 'Successful payouts',
      cancelledPayouts: 'Cancelled payouts',
      trend: 'Payout trend',
      pendingQueue: 'Fila de pagamentos pendentes',
      createTitle: 'Create payout',
      createDescription:
        'Adicione um registro de pagamento manual e acompanhe até a conclusão.',
    },
    roles: {
      title: 'Funções e permissões',
      description: 'Monitore o controle de acesso da plataforma.',
      adminDescription: 'Gerenciar configurações e usuários da organização',
      memberDescription: 'Usar o espaço de aprendizagem',
    },
    activity: {
      title: 'Recent activity',
      description: 'Acompanhe ações administrativas importantes.',
      system: 'System',
      auditLine: '{0} on {1}',
    },
    risk: {
      title: 'Visão geral de fraude e risco',
      description: 'Contas sinalizadas e riscos de pagamentos.',
      disabledMembers: 'Disabled members',
      pendingPayouts: 'Pending payouts',
      cancelledAmount: 'Valor de pagamentos cancelados',
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
      creatorUserId: 'ID de usuário do criador',
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
      email: 'estudante@example.com',
      globalSearch:
        'Pesquisar usuários, criadores, pagamentos, notificações...',
      searchStudents: 'Pesquisar estudantes por nome ou e-mail...',
      title: 'Promotion title',
      message: 'Promotion message',
      ctaLabel: 'Rótulo da chamada para ação',
      ctaHref: 'Link da chamada para ação',
      creatorUserId: 'Cole o ID de usuário do criador',
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
      backToDashboard: 'Voltar ao painel',
    },
    success: {
      invitationSent: 'Convite enviado com sucesso',
      promotionCreated: 'Promoção criada com sucesso',
      payoutCreated: 'Pagamento criado com sucesso',
    },
    errors: {
      inviteExists: 'Já existe um convite pendente para este e-mail.',
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
      subject: 'Confirme a exclusão da sua conta',
      content:
        '<p>Olá {0},</p><p>Você solicitou excluir sua conta. Para confirmar, clique neste link em até 24 horas:</p><p><a href="{1}">{1}</a></p><p>Sua conta está programada para remoção permanente em <strong>{2}</strong>, a menos que você cancele antes. Você pode cancelar nas Configurações da conta.</p><p>Se você não solicitou isso, ignore este e-mail; nada acontecerá.</p>',
    },
    accountDeletionConfirmedEmail: {
      subject: 'Sua conta está programada para exclusão',
      content:
        '<p>Olá {0},</p><p>A exclusão da sua conta foi confirmada. Removeremos permanentemente seus dados em <strong>{1}</strong>. Você ainda pode cancelar nas Configurações da conta antes dessa data.</p>',
    },
    dataExportReadyEmail: {
      subject: 'Sua exportação de dados está pronta',
      content:
        '<p>Olá {0},</p><p>Sua exportação de dados está pronta para download.</p><p><a href="{1}">{1}</a></p><p>Links de download expiram após 15 minutos por segurança; acesse as Configurações da conta para solicitar um novo link.</p>',
    },
  },
  oneOnOneCall: {
    entryCard: {
      title: '1:1 com seu instrutor',
      description: 'Agende uma videochamada com o instrutor do curso.',
      actionOpen: 'Book a 1:1',
      noAvailability: 'Seu instrutor ainda não abriu sessões 1:1.',
    },
    availability: {
      title: 'Availability',
      description:
        'Escolha as janelas semanais em que você pode atender chamadas 1:1.',
      timezoneLabel: 'Timezone',
      addWindow: 'Add window',
      removeWindow: 'Remove',
      dayOfWeek: 'Day',
      startTime: 'Start',
      endTime: 'End',
      save: 'Save availability',
      saved: 'Availability saved',
      empty:
        'Ainda não há janelas de disponibilidade. Adicione uma para começar a receber sessões.',
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
      description: 'Defina o que os estudantes podem agendar.',
      add: 'Adicionar tipo de sessão',
      fields: {
        title: 'Title',
        description: 'Description (optional)',
        durationMinutes: 'Duration (minutes)',
        isFree: 'Sessão gratuita',
        priceAmount: 'Preço',
        currency: 'Moeda',
        bufferMinutes: 'Buffer (minutes)',
        minNoticeHours: 'Aviso mínimo (horas)',
      },
      pricingModeLabel: 'Modo de preço',
      freeMode: 'Grátis',
      paidMode: 'Pago',
      freeLabel: 'Grátis',
      durationMinutesShort: '{0} min',
      priceAmountPlaceholder: '25.00',
      paidHelper:
        'Os estudantes pagam pelo Stripe antes que a sessão seja confirmada.',
      priceInvalid: 'Informe um preço entre US$ 0,50 e US$ 10.000,00.',
      currencyInvalid: 'Informe um código de moeda com 3 letras.',
      save: 'Save',
      cancel: 'Cancelar',
      disable: 'Disable',
      empty: 'Ainda não há tipos de sessão.',
    },
    booking: {
      title: 'Book a 1:1',
      pickSessionType: 'Choose a session',
      pickDate: 'Pick a date',
      pickTime: 'Pick a time',
      confirm: 'Confirm booking',
      submitting: 'Booking…',
      noSessionTypes: 'Seu instrutor ainda não abriu sessões 1:1.',
      noSlots: 'Não há horários disponíveis neste intervalo.',
      success: 'Agendado: veja a sessão na sua lista de sessões.',
      close: 'Fechar',
      freeLabel: 'Grátis',
      durationMinutesShort: '{0} min',
      sessionTypeOptionLabel: '{0} ({1}, {2})',
      paidBookingNotice:
        'Sessões pagas redirecionam para o Stripe Checkout. O horário fica reservado até o pagamento ser concluído.',
      stripeProductName: '1:1 com {0}: {1}',
    },
    session: {
      title: 'Your 1:1 sessions',
      tabs: { upcoming: 'Upcoming', past: 'Past' },
      role: { student: 'As student', instructor: 'As instructor' },
      emptyUpcoming: 'Não há sessões futuras.',
      emptyPast: 'Não há sessões passadas.',
      join: 'Join call',
      joinHint: 'O link é liberado 10 minutos antes do início.',
      cancel: 'Cancel session',
      statusLabel: 'Status',
      statuses: {
        confirmed: 'Confirmada',
        pendingPayment: 'Aguardando pagamento',
        completed: 'Concluída',
        cancelledByStudent: 'Cancelada pelo estudante',
        cancelledByInstructor: 'Cancelada pelo instrutor',
        noShow: 'Ausência',
        expired: 'Expirada',
        disputed: 'Em disputa',
        refunded: 'Reembolsada',
      },
    },
    notes: {
      title: 'Notes',
      placeholder: 'Adicione uma nota privada ou compartilhada…',
      add: 'Add note',
      shared: 'Compartilhar com a outra pessoa',
      edit: 'Edit',
      delete: 'Delete',
      empty: 'Ainda não há notas.',
    },
    cancel: {
      title: 'Cancelar esta sessão?',
      reasonLabel: 'Reason (optional)',
      confirm: 'Yes, cancel',
      keep: 'Keep session',
      lateCancelWarning:
        'Você está cancelando dentro de 24 horas do início; isso conta como cancelamento tardio.',
    },
    errors: {
      noInstructor: 'Este curso não tem instrutor disponível para sessões 1:1.',
      cannotBookSelf: 'Você não pode agendar um 1:1 consigo mesmo.',
      paidNotAvailable:
        'Sessões 1:1 pagas exigem que o processamento de pagamentos do Stripe esteja configurado.',
      slotUnavailable:
        'Esse horário não está na disponibilidade do instrutor ou viola o aviso mínimo.',
      slotTaken:
        'Esse horário acabou de ser reservado por outra pessoa. Escolha outro.',
      rangeTooLarge:
        'O intervalo de horários é grande demais; reduza as datas e tente novamente.',
      notCourseOwner: 'Você não é proprietário deste curso.',
      cannotCancel: 'Esta sessão não pode mais ser cancelada.',
    },
    notify: {
      bookingConfirmedTitle: '1:1 session booked',
      bookingConfirmedStudentBody:
        'Sua sessão 1:1 de {0} está confirmada para {1}.',
      bookingConfirmedInstructorBody: '{0} agendou um 1:1 para {1} em {2}.',
      cancelledTitle: '1:1 session cancelled',
      cancelledByStudentBody: '{0} cancelou o 1:1 de {1} em {2}.',
      cancelledByInstructorBody: '{0} cancelou seu 1:1 de {1} em {2}.',
      reminderTitle: '1:1 session reminder',
      reminderBody: 'Seu 1:1 de {0} começa em breve: {1}.',
      disputeOpenedTitle: '1:1 session disputed',
      disputeResolvedTitle: '1:1 dispute resolved',
    },
    dispute: {
      open: 'Disputar esta sessão',
      reasonLabel: 'O que deu errado?',
      reasonPlaceholder: 'Descreva o problema em detalhes.',
      submit: 'Open dispute',
      alreadyDisputed: 'Já existe uma disputa aberta para esta sessão.',
      notEligible:
        'Somente sessões pagas concluídas ou marcadas como ausência podem ser disputadas.',
      outcomeRefund: 'Um reembolso foi emitido.',
      outcomeNoRefund:
        'A disputa foi analisada e nenhum reembolso foi emitido.',
      admin: {
        title: 'Análise de disputa 1:1',
        list: 'Disputas abertas',
        statusFilter: 'Filtrar por status',
        statuses: {
          all: 'Todos',
          open: 'Aberta',
          underReview: 'Em análise',
          resolvedRefund: 'Resolvida: reembolso',
          resolvedNoRefund: 'Resolvida: sem reembolso',
        },
        detail: 'Detalhes da disputa',
        sessionLabel: 'Sessão',
        courseLabel: 'Curso',
        studentLabel: 'Estudante',
        instructorLabel: 'Instrutor',
        scheduledLabel: 'Agendada',
        priceLabel: 'Preço',
        paidAtLabel: 'Pago em',
        refundedLabel: 'Reembolsada',
        refundedValue: '{0} em {1}',
        statusLabel: 'Status',
        reasonLabel: 'Motivo',
        resolutionLabel: 'Resolução',
        refund: 'Emitir reembolso',
        noRefund: 'Sem reembolso',
        refundAmount: 'Valor do reembolso (centavos)',
        notes: 'Notas da resolução',
        resolve: 'Resolver',
        resolved: 'Resolvida',
        empty: 'Nenhuma disputa corresponde a este filtro.',
        emptyValue: '—',
        resolveError: 'Não foi possível resolver a disputa.',
      },
    },
  },
  creatorEarnings: {
    title: 'Your earnings',
    summary: {
      title: 'Earnings summary',
      totalEarned: 'Total paid',
      pending: 'Pending',
      paidThisMonth: 'Pago este mês',
    },
    list: {
      title: 'Payouts',
      empty:
        'Ainda não há pagamentos. Os registros aparecerão aqui assim que você ganhar.',
      status: {
        pending: 'Pending',
        paid: 'Paid',
        cancelled: 'Cancelled',
      },
    },
    payoutMethod: {
      title: 'Payout method',
      description:
        'Como você quer receber? Dados bancários ACH, e-mail Wise, PayPal etc. Texto simples; administradores leem ao transferir seus fundos.',
      edit: 'Edit',
      save: 'Save',
      placeholder: 'ex.: ACH — Chase ****1234 — agência/rota 021000021',
      empty: 'Ainda não há método de pagamento definido.',
    },
    notify: {
      payoutPaidTitle: 'Seu pagamento foi enviado',
      payoutPaidBody: 'Seu pagamento de {0} {1} foi marcado como pago.',
      payoutCancelledTitle: 'Seu pagamento foi cancelado',
      payoutCancelledBody: 'Seu pagamento de {0} {1} foi cancelado.',
    },
  },
  adminCourseCategories: {
    title: 'Course categories',
    description:
      'Taxonomia curada que alimenta a linha de chips do marketplace e o menu do construtor de cursos.',
    empty:
      'Ainda não há categorias. Adicione uma para começar a organizar o marketplace.',
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
      iconName: 'Ícone (chave Lucide, ex.: LuBookOpen)',
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
        'Desativar esta categoria? Os cursos vinculados manterão a atribuição, mas a categoria não aparecerá no marketplace.',
      enable: 'Mostrar esta categoria novamente no marketplace?',
    },
    errors: {
      statusRequired: 'Escolha ativar ou desativar.',
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
    badge: 'Onboarding personalizado',
    title: 'Crie sua trilha de exame',
    body: 'Responda cinco perguntas rápidas para que o NexExam transforme preços e recomendações em um plano ligado ao seu objetivo.',
    skip: 'Pular por enquanto',
    continue: 'Continuar para o painel',
    enrollLabel: 'Inscrever-se',
    enrolledLabel: 'Inscrito',
    viewLabel: 'Ver curso',
    generatePlan: 'Gerar meu plano',
    editAnswers: 'Editar respostas',
    emptyMessage:
      'Estamos preparando uma nova leva de cursos. Seu plano ainda pode começar pelo diagnóstico e ritmo de estudo.',
    fields: {
      examGoal: 'Exame ou objetivo de aprendizagem',
      timeline: 'Prazo',
      currentLevel: 'Nível atual',
      studyTime: 'Tempo semanal de estudo',
      targetScore: 'Pontuação-alvo',
    },
    placeholders: {
      examGoal: 'Prova final de Álgebra 1, SAT Math, exame de enfermagem...',
      targetScore: '90%, 700+, passar na primeira tentativa...',
    },
    timeline: {
      two_weeks: '2 semanas',
      one_month: '1 mês',
      two_months: '2 meses',
      three_months: '3 meses',
      six_months: '6 meses',
      not_sure: 'Não sei',
    },
    timelineBody: {
      two_weeks: 'Plano sprint',
      one_month: 'Mês focado',
      two_months: 'Construção constante',
      three_months: 'Preparo profundo',
      six_months: 'Longo prazo',
      not_sure: 'Início flexível',
    },
    currentLevel: {
      new: 'Novo nisso',
      some_background: 'Alguma base',
      practicing: 'Já praticando',
      almost_ready: 'Quase pronto',
    },
    currentLevelBody: {
      new: 'Comece com fundamentos e primeiras vitórias.',
      some_background: 'Encontre lacunas e crie um ritmo repetível.',
      practicing: 'Priorize áreas fracas e prática de exame.',
      almost_ready: 'Refine tempo, precisão e revisão final.',
    },
    studyTime: {
      '120': 'Leve',
      '240': 'Constante',
      '420': 'Comprometido',
      '600': 'Intensivo',
      '900': 'Imersivo',
    },
    duration: {
      minutes: '{0} min',
      hours: '{0} h',
      hoursMinutes: '{0} h {1} min',
    },
    unlockPreview: {
      badge: 'Prévia de desbloqueio',
      title: 'Pagar deve parecer abrir o próximo passo',
      body: 'O plano mostrará o que você pode fazer agora e o que aparece ao assinar ou comprar um curso.',
      items: [
        'Um ritmo de estudo alinhado ao seu tempo disponível',
        'Cursos recomendados ligados ao seu objetivo',
        'Separação clara entre valor grátis e desbloqueios pagos',
      ],
    },
    plan: {
      title: 'Seu plano pessoal está pronto',
      body: 'Revise ritmo, marcos e cursos antes de escolher o que desbloquear.',
      readyBadge: 'Plano gerado',
      personalTitle: 'Plano para {0}',
      summary:
        'Prazo de {0} até {1}, com a primeira ação escolhida pelo seu nível e cursos disponíveis.',
      sessionRhythm: '{0} sessões/semana de {1}',
      today: 'Hoje',
      days: 'Dia {0}',
      milestonesTitle: 'Trilha de marcos',
      metrics: {
        timeline: 'Prazo',
        weeklyTime: 'Tempo semanal',
        rhythm: 'Ritmo de estudo',
        targetScore: 'Objetivo',
      },
      milestones: {
        baseline: {
          title: 'Linha de base',
          body: 'Comece com diagnóstico ou primeira aula para ter um sinal real.',
        },
        firstWin: {
          title: 'Primeira vitória',
          body: 'Conclua uma aula ou prática focada para criar impulso.',
        },
        practiceRhythm: {
          title: 'Ritmo de prática',
          body: 'Repita prática de habilidades fracas toda semana.',
        },
        examReadiness: {
          title: 'Checagem de preparo',
          body: 'Use sinais de preparo para decidir o que revisar antes da prova.',
        },
        finalReview: {
          title: 'Revisão final',
          body: 'Proteja seus temas fortes e ajuste os pontos fracos restantes.',
        },
      },
    },
    courses: {
      title: 'Cursos recomendados',
      body: 'Classificados por objetivo, nível e prazo.',
      browseAll: 'Ver todos os cursos',
    },
    unlocks: {
      title: 'O que se abre',
      includedTitle: 'Incluído agora',
      paidTitle: 'Liberado com acesso pago',
      includedItems: [
        'Objetivo e prazo salvos',
        'Primeiro curso ou prévia recomendada',
        'Uma trilha simples de marcos',
      ],
      items: {
        fullCurriculum: 'Currículo completo e recursos do curso',
        adaptivePlan: 'Plano adaptativo que muda com seu progresso',
        aiTutor: 'Prompts do tutor IA ligados a aulas e prática',
        practiceExams: 'Simulados e checagens de preparo mais profundas',
        certificatePath: 'Caminho de certificado e prova de conclusão',
      },
    },
    errors: {
      noRecommendations:
        'Ainda não há recomendações de cursos. Tente novamente quando houver cursos publicados.',
    },
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
      disclaimer:
        'AI Tutor pode cometer erros. Verifique respostas importantes.',
    },
    attachments: {
      add: 'Anexar arquivos',
      remove: 'Remover anexo',
      tooMany: 'Anexe até 5 arquivos por mensagem.',
      tooLarge: 'Cada anexo deve ter 10 MB ou menos.',
      unsupported: 'Anexe arquivos PDF, DOCX, TXT, Markdown, CSV ou JSON.',
      invalid: 'Este anexo não está disponível para esta conversa.',
      uploadFailed: 'Falha ao enviar o anexo. Tente novamente.',
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

  aiTrust: {
    title: 'Transparencia da IA',
    openControls: 'Controles de privacidade da IA',
    settingsTitle: 'Controles de privacidade da IA',
    settingsDescription:
      'Escolha quais sinais de estudo a NexExam pode usar em futuras respostas de IA.',
    saved: 'Controles de privacidade da IA salvos.',
    saving: 'Salvando...',
    controls: {
      lessonContent: {
        label: 'Conteudo das aulas',
        description:
          'Usar textos, transcricoes e tarefas das aulas para explicacoes, quizzes e planos.',
      },
      lessonProgress: {
        label: 'Progresso das aulas',
        description:
          'Usar aulas concluidas e pendentes para personalizar recomendacoes.',
      },
      practiceResults: {
        label: 'Resultados de pratica',
        description:
          'Usar pontuacoes de quizzes e pratica para identificar temas fracos.',
      },
      chatHistory: {
        label: 'Historico do chat',
        description:
          'Usar mensagens anteriores na mesma conversa com o Tutor IA.',
      },
      attachments: {
        label: 'Anexos',
        description: 'Usar arquivos enviados ao responder sua mensagem atual.',
      },
    },
    panel: {
      trigger: 'Por que isso?',
      title: 'Camada de confianca da IA',
      why: 'Por que foi gerado',
      influencedBy: 'Influenciado por',
      confidence: 'Confianca',
      limitations: 'Limitacoes',
      privacy: 'Privacidade',
      used: 'Usado',
      omitted: 'Nao usado',
      unavailable: 'Sem dados ainda',
      generated: 'Gerado',
      model: 'Modelo',
      noSignals: 'Nenhum detalhe de confianca da IA disponivel.',
      privacyNote: 'Os controles de privacidade afetam futuras geracoes de IA.',
    },
    confidence: {
      high: 'Evidencia alta',
      medium: 'Evidencia parcial',
      low: 'Evidencia limitada',
    },
    sources: {
      studentPrompt: 'Sua mensagem',
      courseOutline: 'Estrutura do curso',
      lessonContent: 'Conteudo das aulas',
      lessonProgress: 'Progresso das aulas',
      practiceResults: 'Resultados de pratica',
      examDate: 'Data do exame',
      chatHistory: 'Historico do chat',
      attachments: 'Anexos',
    },
    reasons: {
      studyPlan:
        'Este plano foi gerado para priorizar temas fracos, aulas pendentes e seu calendario de exame.',
      nextStep:
        'Esta recomendacao foi gerada com base no seu progresso e temas fracos.',
      lessonExplain:
        'Esta explicacao foi gerada com o contexto da aula selecionada.',
      lessonSummary:
        'Este resumo foi gerado com o contexto da aula selecionada.',
      quiz: 'Este quiz foi gerado a partir das aulas do modulo selecionado.',
      practice:
        'Esta pratica foi gerada a partir das aulas do modulo selecionado.',
      aiTutor:
        'Esta resposta foi gerada a partir da sua mensagem e do contexto de estudo habilitado.',
    },
    limitations: {
      general:
        'A IA pode cometer erros. Verifique respostas importantes com o material do curso.',
      noPracticeData: 'Nenhum resultado de quiz ou pratica estava disponivel.',
      noLessonProgress:
        'Nenhum historico de aulas concluidas estava disponivel.',
      noLessonContent:
        'A aula selecionada tem pouco ou nenhum conteudo legivel.',
      lessonContentOff:
        'O conteudo das aulas nao foi usado porque voce o desativou.',
      lessonProgressOff:
        'O progresso das aulas nao foi usado porque voce o desativou.',
      practiceOff:
        'Os resultados de pratica nao foram usados porque voce os desativou.',
      historyOff: 'O historico do chat nao foi usado porque voce o desativou.',
      attachmentsOff: 'Os anexos nao foram usados porque voce os desativou.',
      verifyAnswers:
        'Revise perguntas e explicacoes geradas antes de confiar nelas.',
    },
    units: {
      days: 'dias',
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
