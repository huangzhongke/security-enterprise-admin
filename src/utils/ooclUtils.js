import http from './request'

export function getAccountList (isOrderAccount, accountType) {
  return http({
    url: '/spider/account/list',
    method: 'GET',
    params: {
      isOrderAccount: isOrderAccount,
      type: accountType
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
