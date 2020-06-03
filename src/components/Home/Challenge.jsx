import React, {Component} from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Badge, Row, Col } from 'reactstrap'
import { FaFlag, FaRegTrashAlt, FaAngleDown } from 'react-icons/fa'
import { capitalize } from '../../utils'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '../CodeBlock'
import Moment from 'react-moment'

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

const Overlay = styled.div`
    position: absolute;
    bottom: calc(2.5rem + 23px);
    left: 0;
    text-align: center;
    margin: 0 35px;
    padding: 0;
    width: 100%;
    background-image: linear-gradient(to bottom, transparent, #FFF);
    height: 100px;
    visibility: ${props => props.clicked ? "hidden !important" : "visible"};

    @media (max-width: 575px) {
        width: 79%;
    }

    @media (min-width: 576px) {
        width: 440px;
    }

    @media (min-width: 768px) {
        width: 620px;
    }

    @media (min-width: 992px) {
        width: 860px;
    }

    @media (min-width: 1200px) { 
        width: 1040px;
    }

    &:hover {
        cursor: pointer
    }
`;

const OverflowContainer = styled.div`
    max-height: ${props => props.clicked ? "none !important" : "10rem !important"};
    overflow: hidden;
`;

class Challenge extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false
        }
    }
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
                    <OverflowContainer clicked={this.state.clicked}>
                        <ReactMarkdown renderers={{ code: CodeBlock }} source={this.props.description} escapeHtml={true} />
                        <Overlay onClick={() => this.setState({clicked: true})} clicked={this.state.clicked}><FaAngleDown style={{"bottom": "0", "position": "absolute"}} size={30} /></Overlay>
                    </OverflowContainer>
                </ChallengeBody>
                <ChallengeFooter>
                    Submitted by <a href={window.location.href}>{this.props.submitter_username}</a> on <Moment utc local format="LLL">{this.props.ts}</Moment>
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
