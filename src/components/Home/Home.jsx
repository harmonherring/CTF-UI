import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container } from 'reactstrap';
import Challenge from './Challenge';

class Home extends Component {
  constructor (props) {
    super(props)
    console.log(props)
  }

  componentDidMount () {

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
