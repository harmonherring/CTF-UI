import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container } from 'reactstrap';
import Challenge from './Challenge';
<<<<<<< HEAD
=======
import styled from 'styled-components';
import { GET } from '../../actions/get';

const StyledChallenge = styled(Challenge)`
  box-shadow 0 1px 4px rgba(0, 0, 0, 0.4);
`;
>>>>>>> b01f6c8... Placeholder Home page, create Admin page, allow OidcCallback to redirect to any page

class Home extends Component {
  constructor (props) {
    super(props)
    console.log(props)
  }

  componentDidMount () {
    GET(this.props.oidc.user.access_token, '/challenges')
    .then(response => response.json())
    .then(jsonresponse => console.log(jsonresponse));
    console.log(window.location.href);
  }

    handleSelect = (event) => {

    }

    render () {
      return (
        <Container>
          <Challenge />
        </Container>
      );
    }
}

Home.propTypes = {
  oidc: PropTypes.any
}

const mapStateToProps = state => ({
  oidc: state.oidc
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
