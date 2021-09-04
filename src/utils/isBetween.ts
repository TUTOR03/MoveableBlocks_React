/**
 * Проверяет находится ли value между l и r
 */
export const isBetween = (l: number, r: number, value: number): boolean => {
  return value > l && value < r
}
