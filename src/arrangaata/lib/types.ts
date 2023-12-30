export type Pixel = Phaser.GameObjects.Ellipse | Phaser.GameObjects.Rectangle;

export interface Screen {
  width: number;
  height: number;
  pixelColorizer: () => number;
  pixelRadius: number;
  pixels: Pixel[][];
  numPixelColumns: number;
  numPixelRows: number;
  gridRadius: number;
  rectangle: Phaser.GameObjects.Rectangle | null;
}

export interface Joystick {
  circle: Phaser.GameObjects.Ellipse | null;
  width: number;
}

export interface Buttons {
  rectangle: Phaser.GameObjects.Rectangle | null;
  width: number;
}

export type GeoShape =
  | Phaser.Geom.Circle
  | Phaser.Geom.Ellipse
  | Phaser.Geom.Line
  // | Phaser.Geom.Polygon
  | Phaser.Geom.Rectangle
  | Phaser.Geom.Triangle;

export enum PixelLayout {
  GRID,
  RANDOM,
}

export interface RgbRange {
  r: { low: number; high: number };
  g: { low: number; high: number };
  b: { low: number; high: number };
}

export interface Entity {
  gameObjects: Phaser.GameObjects.GameObject[];
  key: string;
  pixelColorizer: () => number;
  pixelLayout: PixelLayout;
  pixelJitterAmount: number;
  pixels: Pixel[];
  pixelShapes: GeoShape[];
}

export interface Card {
  name: string;
  entities: Entity[];
}

export interface Game {
  name: string;
  cards: Card[];
  screen: Screen;
}

export interface Console {
  joystick: Joystick;
  buttons: Buttons;
  game: Game;
}
