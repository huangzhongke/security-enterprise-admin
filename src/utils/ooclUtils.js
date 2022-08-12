import http from './request'

export function getAccountList (a, b) {
  return http({
    url: '/spider/account/oocl',
    method: 'GET',
    params: {
      isOrderAccount: a,
      type: b
    }
  })
}

export function loginUser (user) {
  return http({
    url: '/oocl/login',
    method: 'POST',
    data: {
      username: user
    }
  })
}

export function getPort (query, c, t) {
  return http({
    url: '/oocl/port',
    method: 'POST',
    data: {
      cityFullName: query,
      cookieValue: c,
      tokenValue: t
    }
  })
}
