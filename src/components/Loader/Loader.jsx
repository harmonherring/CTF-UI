import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader'
import { Container, Row, Col } from 'reactstrap'

const override = "margin: 50px auto;"

class Loader extends React.Component {
    render() {
        return(
            <Container>
                <Row>
                    <Col sm="12" style={{"textAlign": "center"}}>
                        <div style={{"paddingLeft": "auto", "paddingRight": "auto"}}>
                            <BounceLoader 
                                css={override}
                                color="#B0197E"
                                loading={this.props.loading}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
            
        );
    }
}

export default Loader
