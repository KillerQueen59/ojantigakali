export const ICON_SIZE = 22;

export const BRICK_BG =
  'url("data:image/svg+xml,' +
  "%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E" +
  "%3Crect width='120' height='60' fill='%231a1440'/%3E" +
  "%3Crect x='0' y='1' width='57' height='27' fill='%23060412'/%3E" +
  "%3Crect x='60' y='1' width='57' height='27' fill='%23060412'/%3E" +
  "%3Crect x='0' y='31' width='27' height='27' fill='%23060412'/%3E" +
  "%3Crect x='30' y='31' width='57' height='27' fill='%23060412'/%3E" +
  "%3Crect x='90' y='31' width='30' height='27' fill='%23060412'/%3E" +
  '%3C/svg%3E")';

export const SCORE_CYCLE = [100, 150, 200, 300, 500];
export const SPARK_COLORS = ['#00dfff', '#ff00ff', '#ffee00', '#00ff88'];

export type Spark = { tx: number; ty: number; color: string };
export type ArcadeHit = {
  id: number;
  x: number;
  y: number;
  pts: number;
  sparks: Spark[];
};
