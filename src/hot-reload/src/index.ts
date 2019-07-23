declare const engineUuid: string
setInterval(() => {
  let engineRequest: XMLHttpRequest
  try {
    engineRequest = new XMLHttpRequest()
  } catch (ex) {
    engineRequest = new ActiveXObject(`Microsoft.XMLHTTP`)
  }
  engineRequest.open(`GET`, `${location.href}/uuid`, true)
  engineRequest.onreadystatechange = () => {
    if (engineRequest.readyState === 4 && engineRequest.status === 200) {
      if (engineRequest.responseText !== engineUuid) {
        location.reload()
      }
    }
  }
  engineRequest.send()
}, 1000)
