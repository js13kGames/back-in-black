let saveLoadAvailable: Truthiness

try {
  localStorage.setItem(`${gameName}-check`, `check`)
  saveLoadAvailable = 1
} catch { }

function save<T extends Json>(name: string, content: T): Truthiness {
  return engineSave(`${gameName}-${name}`, content)
}

function engineSave<T extends Json>(key: string, content: T): Truthiness {
  if (saveLoadAvailable) {
    try {
      localStorage.setItem(key, JSON.stringify(content))
      return 1
    } catch { }
  }
  return
}

function load<T extends Json>(name: string): null | T {
  return engineLoad(`${gameName}-${name}`)
}

function engineLoad<T extends Json>(key: string): null | T {
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

function drop(name: string): Truthiness {
  return engineDrop(`${gameName}-${name}`)
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
