import React, {Component} from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Badge, Row, Col } from 'reactstrap'
import { FaFlag, FaRegTrashAlt } from 'react-icons/fa'
import { capitalize } from '../../utils'

const StyledTrash = styled(FaRegTrashAlt)`
    color: #E51C23;
    visibility: hidden;
    opacity: 0.5;
    transition: opacity .2s;
    margin-bottom: 5px;
    
    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`;

const ChallengeContainer = styled.div`
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    background-color: #fff;
    border-radius: .25rem;

    &:hover ${StyledTrash} {
        visibility: visible;
    }
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
    getCompletedFlags = () => {
        let count = 0
        for (const data of Object.values(this.props.flags)) {
            if ("flag" in data) {
                count++;
            }
        }
        return count
    }

    render = () => {
        return(
            <ChallengeContainer style={{"marginTop": "20px"}}>
                <ChallengeBody>
                    <Row>
                         <Col>
                            <h1 style={{"display": "block", "marginBottom": "0"}}><a href={window.location.href + "challenge/" + this.props.id} style={{"textDecoration": "none"}}>{this.props.title}</a></h1>
                            <BadgeWrapper><Badge color="primary">{capitalize(this.props.difficulty)}</Badge></BadgeWrapper>
                            <BadgeWrapper><Badge color="primary">{capitalize(this.props.category)}</Badge></BadgeWrapper>
                            <br />
                            {
                                this.props.tags.map((tag) => 
                                    <BadgeWrapper key={tag}><Badge key={tag} color="secondary">{tag}</Badge></BadgeWrapper>
                                )
                            }
                        </Col>
                         <Col>
                            <h2 className="float-right">
                                {
                                    (this.props.admin || this.props.submitter_username === this.props.current_username) && <StyledTrash onClick={() => this.props.deleteChallenge(this.props.id, this.props.title)} />
                                }
                                &nbsp; 
                                <span style={{"color": "#4CAF50"}}>{this.getCompletedFlags()}/{Object.keys(this.props.flags).length} <FaFlag style={{"marginBottom": "5px"}} /></span>
                            </h2>
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

const mapStateToProps = (state) => ({
    oidc: state.oidc
  })

export default connect(
    mapStateToProps
)
(Challenge)
