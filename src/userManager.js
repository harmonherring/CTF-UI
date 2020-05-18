import { createUserManager } from 'redux-oidc'

const userManagerConfig = {
  client_id: process.env.REACT_APP_SSO_CLIENT_ID,
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback?ctf_redirect=${window.location.pathname}`,
  response_type: 'code',
  scope: 'openid profile',
  authority: process.env.REACT_APP_SSO_AUTHORITY,
  silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true
}

const userManager = createUserManager(userManagerConfig)

export default userManager
