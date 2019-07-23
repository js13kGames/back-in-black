let saveLoadAvailable = false

try {
  localStorage.setItem(`${gameName}-check`, `check`)
  saveLoadAvailable = true
} catch { }

function engineSave<T extends Json>(name: string, content: T): boolean {
  return engineSaveDirect(`${gameName}-${name}`, content)
}

function engineSaveDirect<T extends Json>(key: string, content: T): boolean {
  if (saveLoadAvailable) {
    try {
      localStorage.setItem(key, JSON.stringify(content))
      return true
    } catch { }
  }
  return false
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

function engineDrop(name: string): boolean {
  return engineDropDirect(`${gameName}-${name}`)
}

function engineDropDirect(key: string): boolean {
  if (saveLoadAvailable) {
    try {
      localStorage.removeItem(key)
      return true
    } catch { }
  }
  return false
}
