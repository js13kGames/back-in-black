let saveLoadAvailable: Truthiness

try {
  localStorage.setItem(`${gameName}-check`, `check`)
  saveLoadAvailable = 1
} catch { }

function engineSave<T extends Json>(name: string, content: T): Truthiness {
  return engineSaveDirect(`${gameName}-${name}`, content)
}

function engineSaveDirect<T extends Json>(key: string, content: T): Truthiness {
  if (saveLoadAvailable) {
    try {
      localStorage.setItem(key, JSON.stringify(content))
      return 1
    } catch { }
  }
  return
}

function engineLoad<T extends Json>(name: string): null | T {
  return engineLoadDirect(`${gameName}-${name}`)
}

function engineLoadDirect<T extends Json>(key: string): null | T {
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

function engineDrop(name: string): Truthiness {
  return engineDropDirect(`${gameName}-${name}`)
}

function engineDropDirect(key: string): Truthiness {
  if (saveLoadAvailable) {
    try {
      localStorage.removeItem(key)
      return 1
    } catch { }
  }
  return
}
