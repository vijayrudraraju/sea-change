export function generateBackgroundColor() {
  const r = Phaser.Math.Between(10, 25);
  const g = Phaser.Math.Between(70, 85);
  const b = Phaser.Math.Between(140, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}

export function generateCircleColor() {
  const r = Phaser.Math.Between(140, 155);
  const g = Phaser.Math.Between(70, 85);
  const b = Phaser.Math.Between(140, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}

export function generateEllipseColor() {
  const r = Phaser.Math.Between(70, 85);
  const g = Phaser.Math.Between(140, 155);
  const b = Phaser.Math.Between(140, 155);

  return Phaser.Display.Color.GetColor(r, g, b);
}
