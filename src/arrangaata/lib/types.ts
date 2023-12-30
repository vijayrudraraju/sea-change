export type Pixel = Phaser.GameObjects.Ellipse | Phaser.GameObjects.Rectangle;

export interface Screen {
  width: number;
  height: number;
  pixels: Pixel[][];
  numPixelColumns: number;
  numPixelRows: number;
  pixelRadius: number;
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
  | Phaser.Geom.Point
  | Phaser.Geom.Polygon
  | Phaser.Geom.Rectangle
  | Phaser.Geom.Triangle;

export enum PixelLayout {
  GRID,
  RANDOM,
}

export interface Entity {
  gameObjects: Phaser.GameObjects.GameObject[];
  key: string;
  pixelLayout: PixelLayout;
  pixelJitterAmount: number;
  pixels: Pixel[];
  pixelShape: GeoShape[];
}

export interface Game {
  entities: Entity[];
}

export interface Console {
  screen: Screen;
  joystick: Joystick;
  buttons: Buttons;
  game: Game;
}
