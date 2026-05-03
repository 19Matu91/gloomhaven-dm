export type Game = {
  id: string;
  name: string;
  defaultClass: string;
  defaultMonster: string;
  routes: Option[];
};

export type Character = {
  class: string;
  colour: string;
  name: string;
  altName?: string;
  game: string;
  matImage: string;
  matImageBack: string;
  source?: string;
  sheetImage: string;
  base?: boolean;
  hidden?: boolean;
  link?: string;
  linkLabel?: string;
};

export interface Card {
  id?: number;
  name: string;
  image: string;
  imageBack?: string;
}

export interface MultiLevelCard {
  id?: number;
  name: string;
  image: string[];
  imageBack?: string[];
}

export type CharacterAbility = {
  id?: number;
  name: string;
  class: string;
  game: string;
  image: string;
  initiative: number;
  level: number;
  imageBack?: string;
  milestone?: boolean;
};

export type CharacterAdditionalCardsSection = {
  label: string;
  cards: CharacterAdditionalCard[];
  horizontal?: boolean;
};

export type CharacterAdditionalCard = {
  name: string;
  image: string;
  imageBack?: string;
};

export type Item = {
  id: number;
  name: string;
  game: string;
  source: string;
  image: string;
  cost: number;
  slot: string;
  imageBack?: string;
  consumed?: boolean;
  spent?: boolean;
  prosperity?: number;
};

export type Monster = {
  id: string;
  name: string;
  game: string;
  statCards: string[];
  abilityCards: string[];
  isVertical: boolean;
};

export type Option = {
  id: string;
  name: string;
};

export type MonsterSearch = {
  monster: Monster;
  monsterList: Option[];
};

export interface SearchResult {
  name: number | string;
}
