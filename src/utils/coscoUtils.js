import http from './request'

export function loginUser (user) {
  return http({
    url: '/cosco/login',
    method: 'POST',
    data: {
      username: user
    }
  })
}

export function getPort (query, c, t) {
  return http({
    url: '/cosco/port',
    method: 'POST',
    data: {
      cityFullName: query,
      cookieValue: c,
      tokenValue: t
    }
  })
}
