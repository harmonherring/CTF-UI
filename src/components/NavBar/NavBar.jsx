import React from 'react'
import PropTypes from 'prop-types'
import { Collapse, Container, Nav, Navbar, NavbarToggler, NavItem } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import UserProfile from '../../containers/UserProfile'

class NavBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isOpen: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render () {
    return (
      <div>
        <Navbar color="primary" dark expand="lg" fixed="top">
          <Container>
            <NavLink to="/" className={'navbar-brand'}>Capture the Flag</NavLink>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink to="/" className={'nav-link'}>Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/about" className={'nav-link'}>About</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/scoreboard" className={'nav-link'}>Scoreboard</NavLink>
                </NavItem>
                { this.props.admin && <NavItem><NavLink to="/admin" className={'nav-link'}>Admin</NavLink></NavItem> }
              </Nav>
              <Nav navbar className="ml-auto">
                <UserProfile/>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    )
  }
}

NavBar.propTypes = {
  admin: PropTypes.bool
}

export default NavBar
