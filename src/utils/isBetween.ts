export const keepRectInRange = (
  left_value: number,
  left_set: number,
  right_value: number,
  right_set: number,
  left_check: number,
  right_check: number
) => {
  if (left_check < left_value) {
    return left_set
  } else if (right_check >= right_value) {
    return right_set
  }
  return
}
