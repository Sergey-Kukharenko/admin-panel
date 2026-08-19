import recommenderSystemImage from '../assets/recommender-system.png';
import vipIntelligenceImage from '../assets/vip-intelligence.png';
import type { DashboardProduct } from './types';

export const DASHBOARD_PRODUCTS: DashboardProduct[] = [
  {
    id: 'vip-intelligence',
    name: 'VIP Intelligence',
    description: 'Предсказывает отток VIP-игроков и их CLV на горизонте 30/60/90 дней.',
    isActive: true,
    dataStatusLabel: 'Validated',
    resultsDate: '16 Feb 2026, 12:15',
    imageSrc: vipIntelligenceImage,
  },
  {
    id: 'recommender-system',
    name: 'Recommender System',
    description: 'Настраивает выдачу игр казино под каждого игрока для роста вовлечённости и выручки.',
    isActive: true,
    dataStatusLabel: 'Awaiting',
    resultsDate: '16 Feb 2026, 12:15',
    imageSrc: recommenderSystemImage,
  },
];
