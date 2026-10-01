export function toMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100
}
