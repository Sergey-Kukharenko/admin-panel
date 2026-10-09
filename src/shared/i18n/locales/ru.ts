export const ru = {
  auth: {
    error: {
      title: 'Не удалось войти',
      descriptions: {
        PortalUserNotProvisionedError:
          'Ваш аккаунт ещё не подключён к порталу. Обратитесь к менеджеру MICo, чтобы получить доступ.',
        default: 'Во время входа произошла ошибка. Попробуйте войти снова.',
      },
      retry: 'Попробовать снова',
      code: 'Код ошибки',
    },
  },
  pagination: {
    previousPage: 'Предыдущая страница',
    nextPage: 'Следующая страница',
  },
  layout: {
    nav: {
      dashboard: 'Главная',
      integrations: 'Интеграции',
      datasets: 'Загрузка данных',
      predictions: 'Предсказания',
      billing: 'Тарифы',
    },
    breadcrumbIntegrationFallback: 'Интеграция',
    sidebar: {
      collapse: 'Свернуть меню',
      expand: 'Развернуть меню',
    },
    userMenu: {
      profile: 'Профиль',
      logout: 'Выйти',
      logoutConfirmTitle: 'Выйти из профиля?',
      logoutConfirmDescription: 'Для продолжения работы потребуется снова войти в систему.',
    },
    helpMenu: {
      ariaLabel: 'Помощь',
      title: 'Помощь',
      description:
        'ML Portal — продвинутая среда для iGaming. Анализ поведения игроков на основе ML-моделей.',
      docs: 'Документация',
      contactManager: 'Связаться с менеджером',
    },
    notifications: {
      ariaLabel: 'Уведомления',
      title: 'Уведомления ({count})',
      markAllRead: 'Прочитать все',
      empty: 'Уведомлений пока нет',
    },
    languageSwitcher: {
      ariaLabel: 'Выбрать язык',
    },
  },
  notificationsMock: {
    n1: {
      title: 'VIP Churn Predictor 30d завершил обучение и готов к запуску',
      time: '5 мин назад',
    },
    n2: { title: 'Прогон завершён', time: '2 ч назад' },
    n3: { title: 'Данные успешно загружены через CSV (145,000 строк)', time: '5 ч назад' },
    n4: {
      title: 'Ошибка загрузки файла payments.csv — неверная структура колонок',
      time: '1 д назад',
    },
    n5: { title: 'VIP Churn Predictor 30d завершил обучение и готов к запуску', time: '1 д назад' },
    n6: { title: 'Прогон VIP CLV Predictor завершён (145,000 строк)', time: '2 д назад' },
    n7: { title: 'Recommender System завершил обучение и готов к запуску', time: '3 д назад' },
    n8: { title: 'Прогон Recommender System завершён (98,500 строк)', time: '4 д назад' },
    n9: { title: 'Достигнуто 80% лимита по тарифу VIP Intelligence', time: '5 д назад' },
  },
  datasets: {
    page: {
      title: 'Загрузка данных',
      description:
        'Загружайте или подключайте данные из доступных источников, включая файл, S3 и API.',
    },
    toolbar: {
      dataType: 'Тип данных',
      status: 'Статус',
      period: 'Период',
      uploadButton: 'Загрузить CSV',
    },
    filters: {
      period: {
        allTime: 'За всё время',
        last7Days: 'Последние 7 дней',
        last30Days: 'Последние 30 дней',
      },
    },
    table: {
      header: {
        name: 'Наименование',
        rowCount: 'Объём строк',
        status: 'Статус',
      },
      viewErrorDetails: 'Посмотреть детали ошибки',
      source: 'Источник: {source}',
      updating: 'Обновление...',
      emptyNotFound: {
        title: 'Ничего не найдено',
        description: 'Попробуйте изменить параметры фильтров',
        resetButton: 'Сбросить фильтры',
      },
    },
    emptyState: {
      title: 'Нет загрузок',
      description: 'Загрузите данные, чтобы начать работу с ML-продуктами',
      uploadButton: 'Загрузить CSV',
    },
    upload: {
      title: 'Загрузка данных',
      bannerTitle: 'Архив шаблонов',
      bannerDescription:
        'Шаблоны и примеры для всех типов данных. Используйте их при подготовке файлов.',
      sectionTitle: 'Загруженные файлы {count}',
      sectionDescriptionLine1: 'Загрузите данные для запуска и работы ML-продуктов.',
      sectionDescriptionLine2: 'CSV-файлы до 512 МБ.',
      confirmDialog: {
        title: 'Подтвердите отправку',
        description:
          'После отправки данные будут использованы для обработки и запуска ML-процессов.\nОтмена или изменение невозможны.',
        confirmLabel: 'Да, отправить',
      },
      footer: {
        cancel: 'Отмена',
        submit: 'Загрузить и обработать',
        submitting: 'Загрузка...',
      },
      templateItem: {
        getTemplate: 'Скачать шаблон',
        removeFiles: 'Удалить файлы',
      },
      zone: {
        empty: 'Нет добавленных файлов',
        chooseFiles: 'Выбрать файлы',
      },
      status: {
        queued: 'В процессе',
      },
    },
    errorDialog: {
      defaultTitle: 'Ошибки валидации',
      checkDate: 'Дата проверки',
      dataType: 'Тип данных',
      checkedRows: 'Проверено записей',
      errorsFound: 'Найдено ошибок',
      downloadFile: 'Скачать отчет с ошибками',
    },
    validation: {
      tooLarge: 'Размер превышает 512 МБ',
      empty: 'Файл не содержит данных',
      unsupportedFormat: 'Поддерживается только CSV',
      uploadFailed: 'Ошибка загрузки файла',
      uploadFailedFile: 'Ошибка загрузки файла «{fileName}»',
      totalSizeExceeded: 'Превышен лимит загрузки — 100 ГБ на клиента',
    },
    templates: {
      users: { description: 'Профили и регистрационные данные пользователей' },
      vip_users: { description: 'Данные VIP-сегментации с уровнями и идентификаторами' },
      bets: { description: 'Ставки и результаты' },
      cumulative_bets: { description: 'Кумулятивные (накопительные) показатели по ставкам' },
      cumulative_sports_bets: { description: 'Накопительные показатели по ставкам на спорт' },
      sports_bets: { description: 'Детальные данные по ставкам на спортивные события' },
      balances_daily: { description: 'Дневной финансовый срез и изменения баланса' },
      payments: { description: 'Платежи и транзакции с деталями операций' },
      cumulative_payments: { description: 'Кумулятивные финансовые показатели и объемы платежей' },
      providers_fees: { description: 'Комиссии провайдеров и операционные расходы' },
      web_analytics: { description: 'Метрики веб-аналитики, трафик и поведение на платформе' },
      wins: { description: 'Данные по выигрышам и выплатам пользователям' },
      default: { description: 'Описание данного типа датасета подгружается...' },
    },
  },
  predictions: {
    // Системные названия продуктов/сервисов из бэкенда -> человекочитаемые (WT-296).
    // Ключи — id из entities/product/model/displayNames.ts, а не сырые slug'и бэкенда
    names: {
      products: {
        playerIntelligence: 'Player Intelligence',
        recommenderSystem: 'Recommender System',
      },
      services: {
        earlyVipDetection: 'Early VIP Detection',
        vipChurn: 'VIP Churn',
        nonPromisingVipFiltering: 'Non-Promising VIP Filtering',
        vipSegmentPrediction: 'VIP Segment Prediction',
        recommendedForYou: 'Recommended for You',
        newForYou: 'New for You',
        similarToYourTop: 'Similar to Your Top',
        similarGames: 'Similar Games',
      },
    },
    manager: {
      resultStatus: 'Статус результата',
      nextRun: 'Следующий расчет',
      lastRun: 'Последний расчет',
      serviceInfoAriaLabel: 'Информация о статусе {name}',
      // Тултипы info-иконки сервиса — отражают статус подготовки/обучения (макеты Figma)
      serviceTooltip: {
        awaitingData:
          'Мы ожидаем полный набор данных для запуска продукта. После загрузки начнется его подготовка.',
        training:
          'Подготовка продукта уже началась. Сейчас выполняется обучение модели и обработка данных.',
        ready:
          'Продукт полностью готов к работе. Новые результаты будут формироваться после обработки поступающих данных.',
        trainingFailed:
          'Не удалось завершить подготовку продукта и обучить модель.\n\nМы уже разбираемся в причинах и отправим вам уведомление на почту, как только всё будет готово.',
      },
      // Тултипы бейджа «Статус результата»
      badgeTooltip: {
        training: 'Training',
        generating: 'Generating',
        failed:
          'Ошибка генерации результата.\n\nМы уже ищем причину. Пришлем вам на email разбор ошибки или уведомление о том, что всё успешно исправлено.',
      },
      empty: {
        title: 'Продукты пока недоступны',
        description: 'Продукты и сервисы появятся здесь после настройки проекта',
      },
      error: {
        title: 'Не удалось загрузить менеджер прогнозов',
        description: 'Проверьте соединение и повторите попытку',
        retry: 'Повторить',
      },
    },
    history: {
      title: 'История результатов',
      allProducts: 'Все продукты',
      columns: {
        id: 'ID',
        product: 'Продукт',
        service: 'Сервис',
        startedAt: 'Начало расчета',
        finishedAt: 'Завершение расчета',
        records: 'Записей',
        status: 'Статус',
        result: 'Результат',
      },
      status: {
        ready: 'Ready',
        generating: 'Generating',
        failed: 'Failed',
      },
      failedTooltip:
        'Ошибка генерации результата.\n\nМы уже ищем причину. Пришлем вам на email разбор ошибки или уведомление о том, что всё успешно исправлено.',
      inProgress: 'Расчет в процессе',
      downloadCsvAriaLabel: 'Скачать CSV',
      openApiDocsAriaLabel: 'Открыть документацию API сервиса',
      empty: {
        title: 'Результаты пока недоступны',
        description: 'Результаты появятся после завершения обработки данных',
      },
      error: {
        title: 'Не удалось загрузить историю результатов',
        description: 'Проверьте соединение и повторите попытку',
        retry: 'Повторить',
      },
    },
  },
  integrations: {
    catalog: {
      title: 'Интеграции',
      description:
        'Переведите загрузку данных в автоматический режим с помощью интеграций.\nУправляйте источниками здесь, а историю и результаты поступлений отслеживайте в разделе «Загрузка данных».',
      connect: 'Перейти к подключению',
      connectDisabledTooltip: {
        pending: 'Заявка уже отправлена. Мы пришлём письмо, когда всё будет готово',
        connected: 'Интеграция подключена. Данные для подключения отправлены на почту',
      },
    },
    status: {
      notConfigured: 'Не настроено',
      pending: 'Настройка',
      connected: 'Подключено',
      pendingTooltip:
        'Заявка принята. Наша команда уже приступила к настройке интеграции. Обычно это занимает не более 1 дня.\nКак только всё будет готово, мы пришлем вам уведомление на почту.',
    },
    detail: {
      pendingTitle: 'Подключение настраивается',
      connectedTitle: 'Интеграция подключена',
      connectedDescription: 'Данные для подключения отправлены на почту.',
      emptyStateTitle: 'Интеграция не подключена',
      requestConnection: 'Запросить подключение',
      requestSuccess: 'Заявка успешно создана! Данные будут направлены на почту',
    },
    connectionForm: {
      organization: 'Организация',
      connectionType: 'Тип подключения',
      environment: 'Среда',
      cancel: 'Отмена',
      submit: 'Запросить подключение',
    },
    restApiModal: {
      title: 'Подключение REST API',
      description: 'Заполните параметры заявки.',
      accessType: 'Тип доступа',
      accessTypeTooltip:
        'Выберите способ доступа к API. При ограничении по IP необходимо указать разрешенные IP-адреса.',
      ipRestricted: 'Ограничить по IP',
      publicAccess: 'Публичный доступ',
      ipAddresses: 'IP-адреса серверов',
      ipAddressesTooltip:
        'Укажите IP-адреса серверов, которым будет разрешен доступ к API. Заполняется только при выборе доступа по IP.',
      ipAddress: 'IP-адрес сервера',
      addIpAddress: 'Добавить IP-адрес',
      invalidIp: 'Введите корректный IP-адрес',
      maxIpAddresses: 'Максимум {max} IP-адресов',
    },
    s3Modal: {
      title: 'Подключение Amazon S3',
      description: 'Ознакомьтесь с параметрами заявки.',
    },
    items: {
      restApi: {
        cardDescription:
          'Программный обмен данными через HTTPS с поддержкой пакетной передачи данных',
        features: {
          sendResults: 'Отправляйте результаты напрямую в любые сервисы',
          errorValidation: 'Мгновенная проверка ошибок',
          encryption: 'Защищенный обмен данными с шифрованием',
        },
        description: 'Программный обмен данными через HTTPS с поддержкой пакетной передачи данных',
        docsLabel: 'Документация API',
        emptyStateDescription:
          'Для получения доступа к API отправьте запрос на подключение. Команда платформы настроит интеграцию и выдаст учётные данные.',
      },
      s3: {
        cardDescription: 'Файловый обмен данными через облачное хранилище Amazon S3',
        features: {
          largeVolumes: 'Экономичная выгрузка больших объемов',
          existingStorages: 'Подключение к вашим существующим хранилищам данных',
          encryption: 'Безопасное хранение с шифрованием',
        },
        description: 'Автоматическая загрузка файлов через S3-хранилище.',
        docsLabel: 'Документация S3 Guide',
        emptyStateDescription:
          'Для получения доступа к Amazon S3 отправьте запрос на подключение.\nНастроим интеграцию и выдадим учётные данные.',
      },
    },
  },
};

export type MessageSchema = typeof ru;
