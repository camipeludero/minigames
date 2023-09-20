import { COLORS } from "./colors";

const OBlock = {
  shape: [
    [1, 1],
    [1, 1],
  ],
  color: COLORS.Oblock,
};

const IBlock = {
  shape: [[2, 2, 2, 2]],
  color: COLORS.Iblock,
};

const Lblock = {
  shape: [
    [3, 0, 0],
    [3, 3, 3],
  ],
  color: COLORS.Lblock,
};

const Jblock = {
  shape: [
    [0, 0, 4],
    [4, 4, 4],
  ],
  color: COLORS.Jblock,
};

const Sblock = {
  shape: [
    [0, 5, 5],
    [5, 5, 0],
  ],
  color: COLORS.Sblock,
};

const Tblock = {
  shape: [
    [0, 6, 0],
    [6, 6, 6],
  ],
  color: COLORS.Tblock,
};

const Zblock = {
  shape: [
    [7, 7, 0],
    [0, 7, 7],
  ],
  color: COLORS.Zblock,
};

export const PIECES = [OBlock, IBlock, Lblock, Jblock, Sblock, Tblock, Zblock];
