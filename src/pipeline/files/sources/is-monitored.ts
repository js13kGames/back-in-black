export default function (
  path: string
): boolean {
  if (/(?:^|\\|\/)\./.test(path)) {
    return false
  }

  if (/src[\\\/]games[\\\/](?:[a-z]|[a-z][a-z0-9-]{0,48}[a-z0-9])[\\\/]tsconfig\.json/.test(path)) {
    return false
  }

  return true
}
