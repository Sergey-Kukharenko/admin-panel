import gameRecommenderImage from '../assets/game-recommender.png';
import playerIntelligenceImage from '../assets/player-intelligence.png';

interface ProductCardContent {
  /** i18n id of the short description under the name */
  descriptionKey: string;
  /** 190px illustration, exported with the crop of the Figma "image" component (2x) */
  image: string;
}

// Descriptions and illustrations stay on the frontend (PM decision, 2026-10-16: the backend has no
// place to store them); the card takes them by the product slug, like the names in entities/product
export const PRODUCT_CARD_CONTENT: Record<string, ProductCardContent> = {
  'game-recommender': {
    descriptionKey: 'dashboard.products.descriptions.recommenderSystem',
    image: gameRecommenderImage,
  },
  'player-intelligence': {
    descriptionKey: 'dashboard.products.descriptions.playerIntelligence',
    image: playerIntelligenceImage,
  },
};
