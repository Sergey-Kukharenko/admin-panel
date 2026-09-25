import type { MessageSchema } from './ru';

export const en: MessageSchema = {
  layout: {
    nav: {
      dashboard: 'Dashboard',
      integrations: 'Integrations',
      datasets: 'Data Upload',
      predictions: 'Predictions',
      billing: 'Plans & Limits',
    },
    breadcrumbIntegrationFallback: 'Integration',
    sidebar: {
      collapse: 'Collapse menu',
      expand: 'Expand menu',
    },
    userMenu: {
      profile: 'Profile',
      logout: 'Log out',
      logoutConfirmTitle: 'Log out of your account?',
      logoutConfirmDescription: "You'll need to sign in again to continue.",
    },
    helpMenu: {
      ariaLabel: 'Help',
      title: 'Help',
      description:
        'ML Portal — an advanced environment for iGaming. Player behavior analysis powered by ML models.',
      docs: 'Documentation',
      contactManager: 'Contact manager',
    },
    notifications: {
      ariaLabel: 'Notifications',
      title: 'Notifications ({count})',
      markAllRead: 'Mark all as read',
      empty: 'No notifications yet',
    },
    languageSwitcher: {
      ariaLabel: 'Select language',
    },
  },
  notificationsMock: {
    n1: {
      title: 'VIP Churn Predictor 30d finished training and is ready to launch',
      time: '5 min ago',
    },
    n2: { title: 'Run completed', time: '2 h ago' },
    n3: { title: 'Data successfully uploaded via CSV (145,000 rows)', time: '5 h ago' },
    n4: { title: 'Failed to upload payments.csv — invalid column structure', time: '1 d ago' },
    n5: {
      title: 'VIP Churn Predictor 30d finished training and is ready to launch',
      time: '1 d ago',
    },
    n6: { title: 'VIP CLV Predictor run completed (145,000 rows)', time: '2 d ago' },
    n7: { title: 'Recommender System finished training and is ready to launch', time: '3 d ago' },
    n8: { title: 'Recommender System run completed (98,500 rows)', time: '4 d ago' },
    n9: { title: 'Reached 80% of the VIP Intelligence plan limit', time: '5 d ago' },
  },
  datasets: {
    page: {
      title: 'Data Upload',
      description: 'Upload or connect data from available sources, including files, S3, and APIs.',
    },
    toolbar: {
      dataType: 'Data Type',
      status: 'Status',
      period: 'Period',
      uploadButton: 'Upload CSV',
    },
    filters: {
      period: {
        allTime: 'All Time',
        last7Days: 'Last 7 Days',
        last30Days: 'Last 30 Days',
      },
    },
    table: {
      header: {
        name: 'Name',
        rowCount: 'Row Count',
        status: 'Status',
      },
      viewErrorDetails: 'View error details',
      source: 'Source: {source}',
      updating: 'Updating...',
      emptyNotFound: {
        title: 'No results found',
        description: 'Try adjusting your filters',
        resetButton: 'Reset Filters',
      },
    },
    emptyState: {
      title: 'No uploads',
      description: 'Upload data to get started with ML products',
      uploadButton: 'Upload CSV',
    },
    upload: {
      title: 'Data Upload',
      bannerTitle: 'Template Pack',
      bannerDescription:
        'Templates and sample files for all data types. Use them as a reference when preparing your data.',
      sectionTitle: 'Uploaded Files {count}',
      sectionDescriptionLine1: 'Upload data required for ML-products.',
      sectionDescriptionLine2: 'CSV only, up to 512 MB.',
      confirmDialog: {
        title: 'Confirm submission',
        description:
          'Once submitted, the data will be used for processing and launching ML processes.\nThis cannot be cancelled or changed.',
        confirmLabel: 'Yes, submit',
      },
      footer: {
        cancel: 'Cancel',
        submit: 'Submit Data',
        submitting: 'Uploading...',
      },
      templateItem: {
        getTemplate: 'Get Template',
        removeFiles: 'Remove Files',
      },
      zone: {
        empty: 'No files added',
        chooseFiles: 'Choose Files',
      },
      status: {
        queued: 'In progress',
      },
    },
    errorDialog: {
      defaultTitle: 'Validation errors',
      checkDate: 'Check date',
      dataType: 'Data type',
      checkedRows: 'Records checked',
      errorsFound: 'Errors found',
      downloadFile: 'Download error report',
    },
    pagination: {
      showing: 'Showing:',
      of: 'of',
      rowsPerPage: 'Rows per page:',
    },
    validation: {
      tooLarge: 'File size exceeds 512 MB',
      empty: 'File contains no data',
      unsupportedFormat: 'Only CSV files are supported',
      uploadFailed: 'Failed to upload file',
      uploadFailedFile: 'Failed to upload file "{fileName}"',
      totalSizeExceeded: 'Upload limit reached — 100 GB per client',
    },
    templates: {
      users: { description: 'User profiles and registration data' },
      vip_users: { description: 'VIP segmentation data with tiers and IDs' },
      bets: { description: 'Betting activity and outcomes' },
      cumulative_bets: { description: 'Cumulative betting metrics' },
      cumulative_sports_bets: { description: 'Cumulative sports betting metrics' },
      sports_bets: { description: 'Detailed data on sports betting events' },
      balances_daily: { description: 'Daily balances and balance changes' },
      payments: { description: 'Payments and transactions with operation details' },
      cumulative_payments: { description: 'Cumulative financial metrics and payment volumes' },
      providers_fees: { description: 'Provider fees and operating costs' },
      web_analytics: { description: 'Web analytics metrics, traffic, and on-platform behavior' },
      wins: { description: 'Data on user wins and payouts' },
      default: { description: 'Loading description for this dataset type...' },
    },
  },
  predictions: {
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
        recommendedForYou: 'Recommended for You',
        newForYou: 'New for You',
        similarToYourTop: 'Similar to Your Top',
        similarGames: 'Similar Games',
      },
    },
    manager: {
      resultStatus: 'Result status',
      nextRun: 'Next run',
      lastRun: 'Last run',
      serviceInfoAriaLabel: '{name} status info',
      serviceTooltip: {
        awaitingData:
          "We're waiting for the complete dataset. Product preparation will begin as soon as all required data is available.",
        training:
          "Product preparation is in progress. We're currently training the models and processing your data.",
        ready:
          'The product is fully operational. New results will be generated automatically as new data is processed.',
        trainingFailed:
          "Product preparation couldn't be completed.\n\nWe're already investigating the issue and will notify you by email as soon as everything is ready.",
      },
      badgeTooltip: {
        training: 'Training',
        generating: 'Generating',
        failed:
          "Result generation failed.\n\nWe're already investigating the issue and will notify you by email as soon as it's resolved.",
      },
      empty: {
        title: 'No products available yet',
        description: 'Products and services will appear here once your project is set up',
      },
      error: {
        title: "Couldn't load the predictions manager",
        description: 'Check your connection and try again',
        retry: 'Retry',
      },
    },
    history: {
      title: 'Result History',
      allProducts: 'All Products',
      columns: {
        id: 'ID',
        product: 'Product',
        service: 'Service',
        startedAt: 'Run Started',
        finishedAt: 'Run Completed',
        records: 'Records',
        status: 'Status',
        result: 'Output',
      },
      status: {
        ready: 'Ready',
        generating: 'Generating',
        failed: 'Failed',
      },
      failedTooltip:
        "Result generation failed.\n\nWe're already investigating the issue and will notify you by email as soon as it's resolved.",
      inProgress: 'Run in progress',
      downloadCsvAriaLabel: 'Download CSV',
      copyTokenAriaLabel: 'Copy integration token',
      copied: 'Copied',
      empty: {
        title: 'No results yet',
        description: 'Results will appear once data processing is complete',
      },
      error: {
        title: "Couldn't load result history",
        description: 'Check your connection and try again',
        retry: 'Retry',
      },
    },
  },
};
