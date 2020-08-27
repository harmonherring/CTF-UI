import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap';
import { GET } from '../../actions';
import { Redirect } from 'react-router';
import { Loader } from '../'
import Categories from './Categories'
import Difficulties from './Difficulties'


class Admin extends Component {
    constructor (props) {
        super(props)

        this.state = {
            admin: true,
            isLoading: false,
            showLoader: false
        }
    }

    componentDidMount () {
        setTimeout(() => {
            this.setState({
                showLoader: true
            })
        }, 1000)
        GET(this.props.oidc.user.access_token, "/user")
        .then(response => response.json())
        .then(jsonresponse => {
            if ( !jsonresponse.admin ) {
                this.setState({
                    admin: false
                })
            }
        })
    }

    render () {
        if ( !this.state.admin ) {
            return <Redirect to='/' />
        }
        else if (this.state.isLoading) {
            return <Loader loading={this.state.showLoader} />
        }
        else {
            return (
                <Container>
                    <Row style={{"marginBottom": "50px"}}>
                        <Col sm="5">
                            <Categories />
                        </Col>
    
                        <Col sm={{size: 5, offset: 2}}>
                            <Difficulties />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h1>Active Reports</h1>
                            <hr />
                            <p>To be implemented at a future date</p>
                        </Col>
                    </Row>
                </Container>
            );
        }
    }
}

Admin.propTypes = {
  oidc: PropTypes.any
}

const mapStateToProps = state => ({
  oidc: state.oidc
})

export default connect(
  mapStateToProps,
)(Admin)
