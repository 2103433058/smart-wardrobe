// ========== Enums & Literals ==========
export type BodyShape = 'inverted-triangle' | 'hourglass' | 'rectangle' | 'pear' | 'apple';
export type HeightRange = 'short' | 'average' | 'tall';
export type SkinTone = 'warm' | 'cool' | 'neutral';
export type Budget = 'budget' | 'mid' | 'premium' | 'flexible';
export type FitPreference = 'loose' | 'regular' | 'slim' | 'oversized';
export type AccessoryLevel = 'none' | 'minimal' | 'moderate' | 'statement';
export type ItemSource = 'camera' | 'upload' | 'avatar';
export type Occasion = 'commute' | 'date' | 'travel' | 'sports' | 'formal' | 'casual';
export type StyleLabel = 'minimalist' | 'sweet' | 'tomboy' | 'street' | 'elegant' | 'sporty';

// ========== Clothing Attributes ==========
export interface ClothingAttributes {
  primaryColor: string;
  secondaryColor?: string;
  pattern: string;
  material: string;
  season: string;
  formality: string;
}

// ========== Wardrobe Item ==========
export interface WardrobeItem {
  id: string;
  imageDataUrl: string;
  thumbnailDataUrl: string;
  source: ItemSource;
  category: string;
  attributes: ClothingAttributes;
  styleTags: StyleLabel[];
  tags: string[];
  notes: string;
  createdAt: number;
  wearCount: number;
  isFavorite: boolean;
}

// ========== User Profile ==========
export interface UserProfile {
  body: {
    shape: BodyShape;
    heightRange: HeightRange;
    highlightAreas: string[];
    downplayAreas: string[];
  };
  color: {
    skinTone: SkinTone;
    hairColor: string;
    avoidColors: string[];
  };
  styleProfile: {
    primaryStyle: StyleLabel;
    secondaryStyle: StyleLabel;
    styleScores: Record<StyleLabel, number>;
  };
  lifestyle: {
    workEnv: string;
    weekendActivity: string;
    topOccasions: Occasion[];
    budget: Budget;
  };
  preferences: {
    patternPreference: string[];
    fitPreference: FitPreference;
    accessoryLevel: AccessoryLevel;
  };
}

// ========== Avatar Outfit ==========
export interface AvatarPiece {
  type: string;
  color: string;
  pattern: string;
  size: string;
}

export interface AvatarOutfit {
  id: string;
  pieces: {
    top?: AvatarPiece;
    bottom?: AvatarPiece;
    dress?: AvatarPiece;
    outer?: AvatarPiece;
    shoes?: { type: string; color: string };
    accessories: Array<{ type: string; color: string }>;
  };
  savedAt: number;
}

// ========== Recommendation ==========
export interface MatchResult {
  bodyScore: number;
  colorScore: number;
  styleScore: number;
  occasionScore: number;
  totalScore: number;
  analysis: {
    body: string;
    color: string;
    style: string;
    occasion: string;
    suggestions: string[];
  };
}

export interface OutfitCombo {
  id: string;
  items: WardrobeItem[];
  matchResult: MatchResult;
}

// ========== Quiz ==========
export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; value: string }[];
}

// ========== Recognition Result ==========
export interface RecognitionResult {
  category: string;
  confidence: number;
  attributes: ClothingAttributes;
  styleTags: StyleLabel[];
}
