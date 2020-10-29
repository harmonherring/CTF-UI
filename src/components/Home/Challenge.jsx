import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Badge, Row, Col } from 'reactstrap'
import { FaFlag, FaAngleDown } from 'react-icons/fa'
import { capitalize } from '../../utils'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '../CodeBlock'
import Moment from 'react-moment'
import {
    ChallengeContainer,
    ChallengeBody,
    BadgeWrapper,
    StyledTrash,
    OverflowContainer,
    Overlay,
    ChallengeFooter
} from '../styled'

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
                            <h1 style={{"display": "block", "marginBottom": "0"}}><Link to={`challenge/${this.props.id}`} style={{"textDecoration": "none"}}>{this.props.title}</Link></h1>
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
                                    (this.props.submitter_username === this.props.current_username) && <StyledTrash style={{'marginBottom': '5px'}} onClick={() => this.props.deleteChallenge(this.props.id, this.props.title)} />
                                }
                                &nbsp; 
                                {
                                    !(this.props.submitter_username === this.props.current_username) && 
                                    <span style={{"color": "#4CAF50"}}>{this.getCompletedFlags()}/{Object.keys(this.props.flags).length} <FaFlag style={{"marginBottom": "5px"}} /></span>
                                }
                            </h2>
                        </Col>
                    </Row>
                    <hr />
                    <OverflowContainer onClick={() => this.setState({clicked: true})} clicked={this.state.clicked}>
                        <ReactMarkdown renderers={{ code: CodeBlock }} source={this.props.description} escapeHtml={true} />
                        <Overlay onClick={() => this.setState({clicked: true})} clicked={this.state.clicked}>
                            <div style={{ width: '100%', position: 'absolute', bottom: '20px' }}>
                                <FaAngleDown style={{bottom: "0", display: 'block', margin: '0 auto -100px'}} size={30} />
                            </div>
                        </Overlay>
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
