import type { MessageSchema } from './ru';

export const en: MessageSchema = {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    statusBadge: {
      neutral: 'Processing',
      loading: 'Loading',
      success: 'Success',
      error: 'Error',
    },
  },
  dashboard: {
    dataChart: {
      title: 'Processed data volume',
      period: 'last 30 days',
      rows: 'Row | Rows',
      allTypes: 'All data types',
      error: {
        title: 'Could not load the chart',
        description: 'Try again in a couple of minutes',
        retry: 'Retry',
      },
    },
    productCharts: {
      title: 'ML product metrics',
      period: 'last {n} day | last {n} days',
      subtitles: {
        recommenderSystem: 'Recommendations delivered by scenario',
        playerIntelligence: 'Players by predicted status',
      },
      analyticsLink: 'Go to detailed analytics',
      legend: '{product} chart lines',
      error: {
        title: 'Could not load the chart',
        description: 'Try again in a couple of minutes',
        retry: 'Retry',
      },
    },
    products: {
      title: 'ML Products',
      data: 'Data',
      results: 'Results',
      unavailable: 'Product unavailable',
      descriptions: {
        playerIntelligence: 'Models player behavior and forecasts deposit dynamics',
        recommenderSystem: 'Personalizes game recommendations based on player interests',
      },
      productStatus: {
        awaiting: 'Awaiting',
        training: 'Training',
        active: 'Active',
        error: 'Error',
      },
      dataStatus: {
        awaiting: 'Awaiting',
        processing: 'Processing',
        validated: 'Validated',
        issue: 'Issue',
        invalidUpdate: 'Invalid Update',
        outdated: 'Outdated',
      },
      resultStatus: {
        awaiting: 'Awaiting',
        generating: 'Generating',
        failed: 'Failed',
        ready: 'Ready',
      },
    },
  },
  auth: {
    error: {
      title: 'Sign-in failed',
      descriptions: {
        PortalUserNotProvisionedError:
          "Your account isn't connected to the portal yet. Contact your MICo manager to get access.",
        default: 'Something went wrong while signing in. Please try again.',
      },
      retry: 'Try again',
      code: 'Error code',
    },
  },
  pagination: {
    previousPage: 'Previous page',
    nextPage: 'Next page',
  },
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
      ariaLabel: 'Profile menu',
      profile: 'Profile',
      logout: 'Log out',
      logoutConfirmTitle: 'Log out of your account?',
      logoutConfirmDescription: "You'll need to sign in again to continue.",
    },
    helpMenu: {
      ariaLabel: 'Help',
      title: 'Help',
      description:
        'MiCo AI Platform is a predictive analytics environment for iGaming.\n\nWe analyze player behavior with ML models so you always stay one step ahead.',
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
    n2: { title: 'VIP Churn Predictor 30d run completed', time: '2 h ago' },
    n3: { title: 'Data successfully uploaded via CSV (145,000 rows)', time: '5 h ago' },
    n4: { title: 'Failed to upload payments.csv — invalid column structure', time: '1 d ago' },
    n5: { title: 'VIP CLV Predictor re-run started', time: '1 d ago' },
    n6: { title: 'VIP CLV Predictor run completed (145,000 rows)', time: '2 d ago' },
    n7: { title: 'Recommender System finished training and is ready to launch', time: '3 d ago' },
    n8: { title: 'Recommender System run in progress (98,500 rows)', time: '4 d ago' },
    n9: { title: 'Recommender System re-run started', time: '5 d ago' },
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
      openApiDocsAriaLabel: 'Open service API documentation',
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
  integrations: {
    catalog: {
      title: 'Integrations',
      description:
        'Automate your data uploads with integrations\nManage your sources here, and track upload history and results in the "Data Upload" section',
      connect: 'Configure',
      connectDisabledTooltip: {
        setupInProgress:
          'Your request has already been sent. We will email you as soon as everything is ready',
        connected: 'The integration is connected. Connection details have been sent to your email',
      },
    },
    // Status request failed (GET /project-*-credentials): no tag and no empty state
    // that could be mistaken for «not connected»
    statusError: {
      tag: 'Status unavailable',
      retry: 'Retry',
      title: 'Failed to load the integration status',
      description: 'Check your connection and try again',
    },
    status: {
      notConfigured: 'Not configured',
      pending: 'In progress',
      connected: 'Connected',
      pendingTooltip:
        'Request received.\nOur team has started configuring your Integrations. This usually takes no more than 1 day. We will send you an email notification as soon as everything is ready.',
    },
    detail: {
      pendingTitle: 'Connection is being set up',
      connectedTitle: 'Integration connected',
      connectedDescription: 'Connection details have been sent to your email.',
      emptyStateTitle: 'Integration not connected',
      requestConnection: 'Request connection',
      requestSuccess: 'Request successfully created! Data will be sent to your email',
      requestAlreadySent: 'The request has already been sent',
      requestFailed: 'Failed to send the request. Please try again',
    },
    connectionForm: {
      organization: 'Organization',
      connectionType: 'Connection Type',
      environment: 'Environment',
      cancel: 'Cancel',
      submit: 'Request Connection',
    },
    restApiModal: {
      title: 'REST API Connection',
      description: 'Fill in the request parameters',
      accessType: 'Access Type',
      accessTypeTooltip:
        'Choose an API access method. If you restrict access by IP, please list the allowed IP addresses.',
      ipRestricted: 'Restrict by IP',
      publicAccess: 'Public access',
      ipAddresses: 'Server IP Addresses',
      ipAddressesTooltip:
        'Specify the IP addresses of servers that will be allowed to access the API. Only applicable when IP-based access is selected.',
      ipAddress: 'Server IP Address',
      addIpAddress: 'Add IP address',
      invalidIp: 'Enter a valid IP address',
      maxIpAddresses: 'Maximum {max} IP addresses allowed',
    },
    s3Modal: {
      title: 'Amazon S3 Connection',
      description: 'Review the request parameters',
    },
    credentials: {
      generalInfo: 'General information',
      connectionStatus: 'Connection status',
      copy: 'Copy',
      copied: 'Copied',
      copyAria: 'Copy {field}',
      filters: {
        active: 'Active',
        allEnvironments: 'All environments',
      },
      columns: {
        name: 'Name',
        clientId: 'client_id',
        environment: 'Environment',
        permissions: 'Permissions',
        createdAt: 'Created',
        status: 'Status',
        actions: 'Actions',
      },
      secretStatus: {
        active: 'Active',
        inactive: 'Inactive',
        revoked: 'Revoked',
      },
      form: {
        name: 'Name',
        create: 'Create',
      },
    },
    restApiSecrets: {
      title: 'API Secrets',
      // The backend issues one credential per environment; a secret can only be replaced
      // by a new one (rotate-secret), there are no named keys or revoke (WT-338, 2026-10-22)
      empty: {
        title: 'No keys issued yet',
        description: 'Credentials will appear here once the team finishes the connection',
      },
      rotate: {
        action: 'Get a new key',
        title: 'Get a new API secret for {environment}?',
        description:
          'The current API secret of this environment stops working immediately. Update it in every service that calls the API.',
        confirm: 'Get key',
        failed: 'Failed to get a new key. Please try again',
      },
      logs: {
        action: 'Log',
        title: 'Usage log — {environment}',
        description: 'When and from which IP address access tokens were issued with this key',
        columns: {
          createdAt: 'Date and time',
          action: 'Event',
          clientIp: 'IP address',
        },
        empty: {
          title: 'No requests yet',
          description: 'Token issuances with this key will appear here',
        },
        error: {
          title: 'Failed to load the log',
          description: 'Check your connection and try again',
          retry: 'Retry',
        },
      },
      reveal: {
        title: 'New API secret created!',
        description:
          'Copy the API secret now.\nIt will not be shown again after you close this window.',
        field: 'API secret',
        copied: 'API secret copied successfully!',
      },
    },
    s3KeySecrets: {
      title: 'Key Secrets',
      create: 'Create Key Secret',
      formTitle: 'Create Key secret',
      limitTooltip:
        'You already have {max} active keys, which is the maximum.\nTo create a new one, revoke or delete one of the existing keys.',
      reveal: {
        title: 'Save the Key secret',
        field: 'Key secret',
        warning:
          'The key will not be shown again. It cannot be restored after you close this window.',
        created: 'Key secret created successfully',
      },
      deactivate: {
        aria: 'Deactivate Key Secret',
        title: 'Deactivate Key Secret "{name}"?',
        description: 'The key will stop working. You can activate it again at any time.',
        confirm: 'Deactivate',
        done: 'Key Secret deactivated',
      },
      activate: {
        aria: 'Activate Key Secret',
        done: 'Key Secret activated',
      },
      revoke: {
        aria: 'Revoke Key Secret',
        title: 'Revoke Key Secret "{name}"?',
        descriptionActive:
          'The key is active and will stop working immediately after revocation. It cannot be restored.',
        descriptionInactive: 'The key cannot be restored after revocation.',
        confirm: 'Revoke',
        done: 'Key Secret revoked',
      },
    },
    items: {
      restApi: {
        cardDescription: 'Programmatic data exchange via HTTPS with batch upload support',
        features: {
          sendResults: 'Send results directly to any service',
          errorValidation: 'Instant error validation',
          encryption: 'Secure data exchange with encryption',
        },
        description: 'Programmatic data exchange via HTTPS with batch upload support',
        connectedDescription:
          'Manage the API connection and its parameters for data exchange with the MICO platform.',
        docsLabel: 'API Documentation',
        emptyStateDescription:
          'To get API access, send a connection request. The platform team will set up the integration and issue credentials.',
      },
      s3: {
        cardDescription: 'File-based data exchange via Amazon S3 cloud storage',
        features: {
          largeVolumes: 'Cost-efficient large volume uploads',
          existingStorages: 'Connect to your existing data storages',
          encryption: 'Secure storage with encryption',
        },
        description: 'Automated file uploads via S3 storage.',
        connectedDescription: 'File-based data exchange via Amazon S3 cloud storage.',
        docsLabel: 'S3 Guide Documentation',
        emptyStateDescription:
          'To get access to Amazon S3, send a connection request.\nWe will set up the integration and issue credentials.',
      },
    },
  },
};
