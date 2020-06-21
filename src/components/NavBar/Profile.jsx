import React from 'react'
import PropTypes from 'prop-types'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }

  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render () {
    if (!this.props.username) return null

    const { username } = this.props

    return (
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret className="navbar-user">
          <img
            className="rounded-circle"
            src={`https://profiles.csh.rit.edu/image/${username}`}
            alt=""
            aria-hidden={true}
            width={32}
            height={32}
          />
          {username}
          <span className="caret"/>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <a style={{"textDecoration": "None", "color": "#212121"}} href="https://members.csh.rit.edu">Members Dashboard</a>
          </DropdownItem>
          <DropdownItem divider/>
          <DropdownItem>
            <a style={{"textDecoration": "None", "color": "#212121"}} href="https://members.csh.rit.edu/sso/logout">Logout</a>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
}

Profile.propTypes = {
  username: PropTypes.string
}

export default Profile
