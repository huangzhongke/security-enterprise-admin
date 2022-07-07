import http from './request'
export function savePJarams (form) {
  return http({
    url: '/spider/line/save',
    method: 'POST',
    data: {
      id: null,
      params: JSON.stringify(form),
      jobId: '',
      authorization: form.authorization
    }
  })
}
export function getFromPort (authorization, startPort) {
  return http({
    url: '/one/startPort',
    method: 'GET',
    params: {
      authorization: authorization,
      startPort: startPort
    }
  })
}

export function getToPort (obj, authorization, query) {
  return http({
    url: '/one/endPort',
    method: 'GET',
    params: {
      authorization: authorization,
      matched: obj.matched,
      matchedCountry: obj.matchedCountry,
      mode: obj.mode,
      query: query
    }
  })
}
export function getAddress (authorization, query) {
  return http({
    url: '/one/addresses',
    method: 'GET',
    params: {
      authorization: authorization,
      query: query
    }
  })
}
export function updateParams (form, dataForm) {
  return http({
    url: '/spider/line/update',
    method: 'put',
    data: {
      id: form.id,
      params: JSON.stringify(form),
      jobId: dataForm.id,
      authorization: form.authorization,
    }
  })
}
