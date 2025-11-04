export const pixelHeight = 20;
export const pixelPadding = 3;

export const topRight =  `top: ${pixelHeight}px`;
export const bottomRight = `top: ${pixelHeight * 2 + pixelPadding}px`;

export const a = 'a', b = 'b', c = 'c', d = 'd', e = 'e', f = 'f', g = 'g';
export const segments = [a, b, c, d, e, f, g];
export const sevenSegmentBits: Record<number, number> = {
    0: 0b0111111,
    1: 0b0000110,
    2: 0b1011011,
    3: 0b1001111,
    4: 0b1100110,
    5: 0b1101101,
    6: 0b1111101,
    7: 0b0000111,
    8: 0b1111111,
    9: 0b1101111,
};