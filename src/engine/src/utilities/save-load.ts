try {
  localStorage.setItem(`${gameName}-check`, `check`)
  saveLoadAvailable = 1
} catch { }

function engineSave<T extends EngineJson>(key: string, content: T): Truthiness {
  if (saveLoadAvailable) {
    try {
      localStorage.setItem(key, JSON.stringify(content))
      return 1
    } catch { }
  }
  return
}

function engineLoad<T extends EngineJson>(key: string): null | T {
  if (saveLoadAvailable) {
    try {
      const json = localStorage.getItem(key)
      if (json !== null) {
        return JSON.parse(json)
      }
    } catch { }
  }
  return null
}

function engineDrop(key: string): Truthiness {
  if (saveLoadAvailable) {
    try {
      localStorage.removeItem(key)
      return 1
    } catch { }
  }
  return
}
