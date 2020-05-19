import React, {Component} from 'react';
import styled from 'styled-components';
import { Badge, Row, Col } from 'reactstrap';
import { FaFlag } from 'react-icons/fa';

const ChallengeContainer = styled.div`
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    background-color: #fff;
    border-radius: .25rem;
`;

const ChallengeBody = styled.div`
    padding: 1.25rem;
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
`;

const ChallengeFooter = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    padding: .75rem 1.25rem;
    border-bottom-left-radius: .25rem;
    border-bottom-right-radius: .25rem;
`;

const BadgeWrapper = styled.h5`
    display: inline-block;
    font-size: 15px;
    margin: 2px;
`;

class Challenge extends Component {
    constructor(props) {
        super(props);

        let count = 0
        for (const key of Object.keys(this.props.flags)) {
            if ("flag" in this.props.flags[key]) {
                count++;
            }
        }

        this.state = {
            completedFlags: count,

        }
    }

    render = () => {
        return(
            <ChallengeContainer>
                <ChallengeBody>
                    <Row>
                         <Col>
                            <h1 style={{"display": "inline-block"}}><a href={window.location.href} style={{"textDecoration": "none"}}>{this.props.title}</a></h1>
                        </Col>
                         <Col>
                            <h2 className="float-right" style={{"color": "#4CAF50"}}>{this.state.completedFlags}/{Object.keys(this.props.flags).length} <FaFlag /></h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        {
                            this.props.tags.map((tag) => 
                                <BadgeWrapper key={tag}><Badge key={tag} color="secondary">{tag}</Badge></BadgeWrapper>
                            )
                        }
                        </Col>
                    </Row>
                    <hr />
                    <p>{this.props.description}</p>
                </ChallengeBody>
                <ChallengeFooter>
                    Submitted by <a href={window.location.href}>{this.props.submitter_username}</a> on {this.props.ts}
                </ChallengeFooter>
            </ChallengeContainer>
        );
    }
}

export default Challenge
