import React, { Component } from 'react'
import { Container } from 'reactstrap'
import { ConnectedRouter } from 'connected-react-router'
import { Switch, Route } from 'react-router-dom'
import { history } from '../store'
import ProtectedRoute from '../containers/ProtectedRoute'
import OidcCallback from '../containers/OidcCallback'
import PropTypes from 'prop-types'
import {
  Home,
  NavBar,
  Admin
} from './index'
import { GET } from '../actions'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      admin: false
    }
  }

  componentDidMount = () => {
    const waitForOidc = setInterval(() => {
      if (this.props.oidc.user) {
        GET(this.props.oidc.user.access_token, '/user')
          .then(response => response.json())
          .then(jsonresponse => this.setState({
            admin: jsonresponse.admin
          }))
        clearInterval(waitForOidc)
      }
    }, 100)
  }

  render () {
    return (
      <ConnectedRouter history={history}>
        <Container className="main" fluid>
          <NavBar admin={this.state.admin} />
          <Container>
            <Switch>
              <Route exact path="/callback" component={OidcCallback}/>
              <ProtectedRoute exact path="/" component={Home}/>
              <ProtectedRoute exact path="/admin" component={Admin} />
            </Switch>
          </Container>
        </Container>
      </ConnectedRouter>
    )
  }
}

App.propTypes = {
  oidc: PropTypes.shape({
    user: PropTypes.any
  })
}

export default App
