export default function <TValue>(
  key: string,
  value: TValue
): { readonly [key: string]: TValue } {
  const output: { [key: string]: TValue } = {}
  output[key] = value
  return output
}
