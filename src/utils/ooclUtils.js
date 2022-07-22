import http from './request'

export function getAccountList (a) {
  return http({
    url: '/oocl/account',
    method: 'GET',
    params: {
      isOrderAccount: a
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
