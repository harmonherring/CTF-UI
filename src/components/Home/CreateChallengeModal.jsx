import React from 'react'
import styled from 'styled-components'
import { capitalize } from '../../utils'
import { connect } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import {
    Alert,
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
    Button,
    Progress
} from 'reactstrap'
import CodeBlock from '../CodeBlock'

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

const RequiredStar = () => (<span style={{"color": "red"}}>*</span>)

class CreateChallengeModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            is_creator: true,
            new_tag: "",
            new_challenge: {
                tags: [],
                author: props.oidc.user.profile.preferred_username,
                title: "",
                difficulty: "",
                category: "",
                description: ""
            },
            create_challenge_error: "",
            progress: 0
        }
    }

    componentDidMount = () => {
        this.setState({
            new_challenge: {
                ...this.state.new_challenge,
                category: this.props.categories ? Object.keys(this.props.categories)[0] : "",
                difficulty: this.props.difficulties ? Object.keys(this.props.difficulties)[0] : "",
            }
        })
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

    onFileChange = e => {
        this.setState({
            selectedFile: e.target.files[0]
        })
    }

    createChallenge = () => {
        this.setState({
            create_challenge_error: "",
            progress: 0
        })
        let formData = new FormData();
        formData.append(
            "file",
            this.state.selectedFile,
        )
        for (let [key, value] of Object.entries(this.state.new_challenge)) {
            formData.append(key, value)
        }

        let request = new XMLHttpRequest();

        request.upload.onprogress = ((e) => {
            this.setState({
                progress: ((e.loaded / e.total) * 100).toFixed(2)
            })
        })
        request.onload = (() => {
            if (request.status === 202) {
                this.props.successCallback()
            } else {
                try {
                    this.setState({
                        create_challenge_error: JSON.parse(request.response).message
                    })
                } catch (e) {
                    this.setState({
                        create_challenge_error: "Something went extra wrong. I'm sorry :("
                    })
                }
            }
        })

        request.open("POST", process.env.REACT_APP_API_ROUTE + "/challenges")
        request.setRequestHeader("Authorization", "Bearer " + this.props.oidc.user.access_token)

        request.send(formData)
    }

    getSelectedCategory = () => {
        for (let category of Object.values(this.props.categories)) {
            if (category.name === this.state.new_challenge.category.toLowerCase()) {
                return category
            }
        }
        return {
            name: "",
            id: -1,
            upload_required: false
        }
    }

    render() {
        return(
            <Modal size="xl" isOpen={this.props.isOpen} toggle={() => this.props.toggle()}>
                <ModalHeader toggle={() => this.props.toggle()}>
                    <span style={{"fontSize": "1.625rem"}}>Create Challenge</span>
                </ModalHeader>
                <ModalBody>
                    { this.state.create_challenge_error && <Alert color="danger">{this.state.create_challenge_error}</Alert>}
                    <FormGroup>
                        <StyledLabel for="title">Title <RequiredStar /></StyledLabel>
                        <StyledInput id="title" placeholder="My Awesome Challenge" onChange={this.modifyStateObject("new_challenge", "title")} value={this.state.new_challenge.title} />
                    </FormGroup>
                    <FormGroup>
                        <Row>
                            <Col xs="6">
                                <StyledLabel for="category">Category <RequiredStar /></StyledLabel>
                                <StyledList id="category" type="select" onChange={this.modifyStateObject("new_challenge", "category")} value={this.state.new_challenge.category}>
                                    {
                                        Object.keys(this.props.categories).map( (name) => 
                                            <option key={name}>{capitalize(name)}</option>
                                        )
                                    }
                                </StyledList>
                            </Col>
                            <Col xs="6">
                                <StyledLabel for="difficulty">Difficulty <RequiredStar /></StyledLabel>
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
                                <Label for="description">Description <RequiredStar /></Label>
                                <Input type="textarea" rows={10} id="description" placeholder="Description of my awesome challenge" onChange={this.modifyStateObject("new_challenge", "description")} value={this.state.new_challenge.description} />
                            </FormGroup>
                        </Col>
                        <Col lg="6">
                            <ReactMarkdown renderers={{ code: CodeBlock }} source={this.state.new_challenge.description} escapeHtml={true} />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <FormGroup>
                                <StyledLabel for="tag">Tags</StyledLabel>
                                <StyledInput style={{"marginBottom": "8px"}} id="tag" onChange={this.modifyState("new_tag")} onKeyPress={this.checkSubmit} placeholder="Web" value={this.state.new_tag} />
                                {
                                    this.state.new_challenge.tags.map( (tag) => 
                                        <NewTag key={tag} onClick={() => this.deleteTag(tag)} color="primary">{tag}</NewTag>
                                    )
                                }
                            </FormGroup>
                        </Col>
                        <Col lg="6">
                            <FormGroup>
                            <Label for="upload">Upload File {this.getSelectedCategory().upload_required && <RequiredStar />}</Label>
                                <StyledInput name="challengeFile" type="file" id="upload" onChange={this.onFileChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    
                    <FormGroup>
                        <Label check style={{"marginLeft": "22px"}}>
                            <Input type="checkbox" checked={this.state.is_creator} onChange={() => {this.toggleCreator(); this.setState({new_challenge: {...this.state.new_challenge, author: this.props.current_username}})}} />{' '}
                            I Created this Content
                        </Label>
                    </FormGroup>
                    <FormGroup style={{"display": this.state.is_creator ? "none" : "block"}}>
                        <StyledLabel for="author">Author <RequiredStar /></StyledLabel>
                        <Input id="author" placeholder="Jeff Mahoney" onChange={this.modifyStateObject("new_challenge", "author")} value={this.state.new_challenge.author} />
                    </FormGroup>
                    { this.state.progress !== 0 && <Progress style={{"height": "16px", "borderRadius": ".25rem"}} animated color="primary" value={this.state.progress}>{this.state.progress + "%"}</Progress> }
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
