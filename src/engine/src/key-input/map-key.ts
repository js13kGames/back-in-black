function mapKey(
  key: KeyCode,
  callback: EngineMutationCallback
): void {
  engineKeyInputCallbacks[key] = callback
}
