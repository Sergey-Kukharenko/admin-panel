export const ru = {
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
        'Загружайте данные для работы платформы и получения предсказаний — через файл, S3 или API.',
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
    pagination: {
      showing: 'Показывать:',
      of: 'из',
      rowsPerPage: 'Строк на стр:',
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
        earlyVip: 'Early VIP Identification',
        churnPrediction: 'Churn Prediction',
        nonPromisingVip: 'Non-promising VIP',
        growingVip: 'Growing VIP',
        gameRecommendations: 'Game Recommendations',
        similarGames: 'Similar Games',
        newGames: 'New Games',
        similarToSelectedGame: 'Similar to Selected Game',
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
      copyTokenAriaLabel: 'Скопировать токен интеграции',
      copied: 'Скопировано',
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
};

export type MessageSchema = typeof ru;
