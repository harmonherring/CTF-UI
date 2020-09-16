import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CallbackComponent } from 'redux-oidc'
import { push } from 'connected-react-router'
import userManager from '../userManager'

class OidcCallback extends React.Component {
  constructor(props) {
    super(props)

    this.ctfRedirect = new URLSearchParams(this.props.location.search).get('ctf_redirect')
    if (!this.ctfRedirect) {
      this.ctfRedirect = '/'
    }
  }

  render () {
    const { dispatch } = this.props

    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={() => dispatch(push(this.ctfRedirect))}
        errorCallback={(error) => {
          // TODO: Redirect to a more friendly error page
          dispatch(push('/'))
          console.error(error)
        }}
      >
        <></>
      </CallbackComponent>
    )
  }
}

OidcCallback.propTypes = {
  dispatch: PropTypes.any,
  location: PropTypes.shape({
    search: PropTypes.any.isRequired
  }).isRequired
}

export default connect()(OidcCallback)
