import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container } from 'reactstrap';
import Challenge from './Challenge';
import styled from 'styled-components';

const StyledChallenge = styled(Challenge)`
  box-shadow 0 1px 4px rgba(0, 0, 0, 0.4);
`;

class Home extends Component {
    render () {
      return (
        <Container>
          <StyledChallenge 
              title="Title Here" 
              description="A good description" 
              submitter_username="harmon" 
              submitter_full_name="Harmon Herring" 
              ts="May 11, 2020" 
              flags={{1: {"point_value": 25, "flag": "abc"}, 2: {"point_value": 25}}} 
              tags={["Web", "Wordpress", "PHP"]} />
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
