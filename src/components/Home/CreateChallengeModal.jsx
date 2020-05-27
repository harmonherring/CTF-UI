import React from 'react'
import styled from 'styled-components'
import { capitalize } from '../../utils'
import { connect } from 'react-redux'
import { POST } from '../../actions'
import ReactMarkdown from 'react-markdown'
import {
    Col,
    Badge,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap'

const StyledLabel = styled(Label)`
    margin-bottom: 0 !important;
`;

const StyledInput = styled(Input)`
    height: calc(1.2em + 1rem + 2px) !important
`;

const StyledList = styled(Input)`
    height: calc(1em + 1.2rem + 2px) !important;
    padding: 0.1rem 0.1rem 0.1rem 0.4rem !important;
`;

const NewTag = styled(Badge)`
    margin: 2px !important;
    font-size: 12px !important;

    &:hover {
        cursor: pointer;
    }
`;

class CreateChallengeModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            is_creator: true,
            new_tag: "",
            new_challenge: {
                tags: [],
                author: this.props.current_username,
                title: "",
                difficulty: this.props.difficulties ? Object.keys(this.props.difficulties)[0] : "",
                category: this.props.categories ? Object.keys(this.props.categories)[0] : "",
                description: ""
            },
            create_challenge_error: ""
        }
    }

    toggleCreator = () => {
        this.setState({
            is_creator: !this.state.is_creator
        })
    }

    checkSubmit = (e) => {
        if (e.key === "Enter" && this.state.new_tag && !this.state.new_challenge.tags.includes(this.state.new_tag)) {
            this.addTag(this.state.new_tag)
            this.setState({
                new_tag: ""
            })
        }
    }

    modifyState = (value) => e => {
        this.setState({
            [value]: e.target.value
        })
    }

    modifyStateObject = (object, value) => e => {
        this.setState({
            [object]: {
                ...this.state[object],
                [value]: e.target.value
            }
        })
    }

    addTag = (tag) => {
        this.setState({
            new_challenge: {
                ...this.state.new_challenge,
                tags: [...this.state.new_challenge.tags, tag]
            }
        })
    }

    deleteTag = (tag) => {
        this.setState({
            new_challenge: {
                ...this.state.new_challenge,
                tags: this.state.new_challenge.tags.filter((name) => name !== tag)
            }
        })
    }

    createChallenge = () => {
        this.setState({
            create_challenge_error: ""
        })
        POST(this.props.oidc.user.access_token, "/challenges", {...this.state.new_challenge})
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.props.successCallback()
            } else {
                this.setState({
                    create_challenge_error: response[1].message
                })
            }
        })
    }

    render() {
        return(
            <Modal size="xl" isOpen={this.props.isOpen} toggle={() => this.props.toggle()}>
                <ModalHeader toggle={() => this.props.toggle()}>
                    <h2>Create Challenge</h2>
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <StyledLabel for="title">Title</StyledLabel>
                        <StyledInput id="title" placeholder="My Awesome Challenge" onChange={this.modifyStateObject("new_challenge", "title")} value={this.state.new_challenge.title} />
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="6">
                                <StyledLabel for="category">Category</StyledLabel>
                                <StyledList id="category" type="select" onChange={this.modifyStateObject("new_challenge", "category")} value={this.state.new_challenge.category}>
                                    {
                                        Object.keys(this.props.categories).map( (name) => 
                                            <option key={name}>{capitalize(name)}</option>
                                        )
                                    }
                                </StyledList>
                            </Col>
                            <Col xs="6">
                                <StyledLabel for="difficulty">Difficulty</StyledLabel>
                                <StyledList id="difficulty" type="select" onChange={this.modifyStateObject("new_challenge", "difficulty")} value={this.state.new_challenge.difficulty}>
                                    {
                                        Object.keys(this.props.difficulties).map( (name) => 
                                            <option key={name}>{capitalize(name)}</option>
                                        )
                                    }
                                </StyledList>
                            </Col>
                        </Row>
                    </FormGroup>
                    <Row>
                        <Col lg="6">
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input type="textarea" rows={10} id="description" placeholder="Description of my awesome challenge" onChange={this.modifyStateObject("new_challenge", "description")} value={this.state.new_challenge.description} />
                            </FormGroup>
                        </Col>
                        <Col lg="6">
                            <ReactMarkdown source={this.state.new_challenge.description} escapeHtml={true} />
                        </Col>
                    </Row>
                    
                    <FormGroup>
                        <StyledLabel for="tag">Tags</StyledLabel>
                        <StyledInput style={{"marginBottom": "8px"}} id="tag" onChange={this.modifyState("new_tag")} onKeyPress={this.checkSubmit} placeholder="Web" value={this.state.new_tag} />
                        {
                            this.state.new_challenge.tags.map( (tag) => 
                                <NewTag key={tag} onClick={() => this.deleteTag(tag)} color="primary">{tag}</NewTag>
                            )
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label check style={{"marginLeft": "22px"}}>
                            <Input type="checkbox" checked={this.state.is_creator} onChange={() => {this.toggleCreator(); this.setState({new_challenge: {...this.state.new_challenge, author: this.props.current_username}})}} />{' '}
                            I Created this Content
                        </Label>
                    </FormGroup>
                    <FormGroup style={{"display": this.state.is_creator ? "none" : "block"}}>
                        <StyledLabel for="author">Author</StyledLabel>
                        <Input id="author" placeholder="Jeff Mahoney" onChange={this.modifyStateObject("new_challenge", "author")} value={this.state.new_challenge.author} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.createChallenge()}>Create Challenge</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    oidc: state.oidc
})

export default connect(
    mapStateToProps
)(CreateChallengeModal)
