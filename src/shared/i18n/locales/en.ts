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
      templatesBanner: {
        title: 'Template Pack',
        description: 'Archive with templates for all data types. Fill in what you need and upload.',
      },
      processingBanner: {
        title: 'Data processing may take 5-14 days',
        description: 'Track progress directly in the platform',
      },
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
    status: {
      loading: 'Processing',
      success: 'Validated',
      error: 'Issue',
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
      syncing: 'Syncing data with backend...',
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
          'This action cannot be undone. Files will be sent for ML model training. Once submitted, the data cannot be withdrawn. Training will take 5 to 14 days.',
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
};
