import React from 'react'
import { Alert, Badge, Container, Row, Col, Card, CardHeader, CardBody, Button, Table, InputGroup, InputGroupAddon, Input, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label } from 'reactstrap'
import { connect } from 'react-redux'
import Loader from '../Loader'
import { GET, POST, DELETE } from '../../actions'
import { FaRegArrowAltCircleDown as Download, FaFlag, FaTimes, FaCheck, FaRegTrashAlt } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import styled from 'styled-components'
import BounceLoader from 'react-spinners/BounceLoader'
import { capitalize } from '../../utils'

const SpacedRow = styled(Row)`
    margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
    border: 1px solid #DDD !important;
    border-top-left-radius: 0.25rem !important;
    border-bottom-left-radius: 0.25rem !important;
    box-shadow: none !important;
    padding-left: 5px !important;
`;

const StyledPlus = styled(GoPlus)`
    vertical-align: top !important;
    opacity: 0.5;
    transition: opacity .2s;

    &:hover {
        opacity: 1;
        cursor: pointer;
    }
`;

const StyledTrash = styled(FaRegTrashAlt)`
    color: #E51C23;
    visibility: hidden;
    opacity: 0.5;
    transition: opacity .2s;
    
    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`;

const HoverableTr = styled.tr`
    &:hover ${StyledTrash} {
        visibility: visible;
    }
`;

class Challenge extends React.Component {
    constructor(props) {
        super(props)

        const { challenge_id } = this.props.match.params

        this.state = {
            is_loading: true,
            show_loader: false,
            challenge_id: challenge_id,
            data: {},
            completed_flags: 0,
            flag_attempt: "",
            flag_loading: false,
            flag_result: null,
            hint_error: "",
            show_modal: null,
            userinfo: {},
            new_flag: {},
            flag_error: "",
            new_hint: {},
            new_tag: "",
            tag_error: ""
        }
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({
                show_loader: true
            })
        }, 1000)

        this.getChallenge(this.state.challenge_id)
        .then(() => this.getUserInfo())
        .then(() => this.setState({
            is_loading: false
        }))
    }

    closeModal = () => {
        this.setState({
            show_modal: null
        })
    }

    showModal = (id) => {
        this.setState({
            show_modal: id
        })
    }

    getChallenge = ( challenge_id ) => {
        return GET(this.props.oidc.user.access_token, "/challenges/" + challenge_id)
        .then(response => response.json())
        .then(jsonresponse => { 
            this.setState({
                data: jsonresponse
            }); 
            return Promise.resolve("success")})
        .then(() => this.calculateCompletedFlags())
        .then(() => this.assignRelativeIds())
    }

    calculateCompletedFlags = () => {
        let count = 0
        for (const data of Object.values(this.state.data.flags)) {
            if ("flag" in data) {
                count++;
            }
        }

        this.setState({
            completed_flags: count
        }) 
        return Promise.resolve("Success")
    }

    assignRelativeIds = () => {
        let data = this.state.data
        let ids = Object.keys(this.state.data.flags).map(id => +id)
        ids.sort(function(a, b) {return a-b})
        for (let i = 0; i < ids.length; i++) {
            data.flags[ids[i]].relative_id = i + 1
        }
        this.setState({
            data: data
        })
        return Promise.resolve("Success")
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

    modifyNewHint = (flag_id, field) => e => {
        this.setState({
            new_hint: {
                ...this.state.new_hint,
                flag_id: flag_id,
                [field]: e.target.value
            }
        })
    }
    
    attemptFlag = () => {
        this.setState({
            flag_loading: true,
            flag_result: null
        })
        POST(this.props.oidc.user.access_token, "/challenges/" + this.state.data.id + "/solved", {
            flag: this.state.flag_attempt
        })
        .then(response => {
            if (response.status === 201) {
                this.setState({
                    flag_loading: false,
                    flag_result: true
                })
                this.getFlags()
            } else {
                this.setState({
                    flag_loading: false,
                    flag_result: false
                })
            }
        })
    }

    getFlags = () => {
        return GET(this.props.oidc.user.access_token, "/challenges/" + this.state.challenge_id + "/flags")
        .then(response => response.json())
        .then(jsonresponse => {
            let data = this.state.data
            data.flags = jsonresponse
            this.setState({
                data: data
            })
            return Promise.resolve("Success")
        })
        .then(() => this.calculateCompletedFlags())
        .then(() => this.assignRelativeIds())
    }

    createFlag = () => {
        this.setState({
            flag_error: ""
        })
        POST(this.props.oidc.user.access_token, "/challenges/" + this.state.challenge_id + "/flags", {
            flag: this.state.new_flag.flag,
            point_value: this.state.new_flag.point_value
        })
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.getFlags()
                this.closeModal()
                this.setState({
                    new_flag: {}
                })
            } else {
                this.setState({
                    flag_error: response[1].message
                })
            }
        })
    }

    deleteFlag = (flag_id) => {
        DELETE(this.props.oidc.user.access_token, "/flags/" + flag_id)
        .then(() => this.getFlags())
    }

    createHint = () => {
        this.setState({
            new_hint_error: ""
        })
        POST(this.props.oidc.user.access_token, "/flags/" + this.state.new_hint.flag_id + "/hints", {...this.state.new_hint})
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.getFlags()
                .then(() => this.closeModal())
                this.setState({
                    new_hint: {}
                })
            } else {
                this.setState({
                    new_hint_error: response[1].message
                })
            }
        })
    }

    purchaseHint = (hint_id) => {
        POST(this.props.oidc.user.access_token, "/hints/" + hint_id + "/used")
        .then(response => {
            if (response.status === 201) {
                this.getFlags()
            } else {
                this.setState({
                    hint_error: "Unable to purchase hint"
                })
            }
        })
    }

    deleteHint = (hint_id) => {
        DELETE(this.props.oidc.user.access_token, "/hints/" + hint_id)
        .then((response) => {
            if (response.status === 200) {
                this.getFlags()
            }
        })
    }

    getTags = () => {
        return GET(this.props.oidc.user.access_token, "/challenges/" + this.state.challenge_id + "/tags")
        .then(response => response.json())
        .then(tags => this.setState({
            data: {
                ...this.state.data,
                tags: tags
            }
        }))
    }

    createTag = () => {
        this.setState({
            tag_error: ""
        })
        POST(this.props.oidc.user.access_token, "/challenges/" + this.state.challenge_id + "/tags/" + this.state.new_tag, {})
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.getTags()
                .then(() => this.closeModal())
            } else {
                this.setState({
                    tag_error: response[1].message
                })
            }
        })
    }

    getUserInfo = () => {
        GET(this.props.oidc.user.access_token, "/user")
        .then(response => response.json())
        .then(jsonresponse => this.setState({
          userinfo: jsonresponse
        }))
    }

    render() {
        if (this.state.is_loading) {
            return <Loader loading={this.state.show_loader} />
        }
        else {
            return(
                <Container>
                    <SpacedRow>
                        <Col lg="9">
                            <h1 style={{"marginBottom": "0"}}><a style={{"textDecoration": "none"}} href={window.location.href}>{this.state.data.title}</a></h1>
                            <Badge style={{"margin": "2px", "fontSize": "12px"}} color="primary">{capitalize(this.state.data.difficulty)}</Badge>
                            <Badge style={{"margin": "2px", "fontSize": "12px"}} color="primary">{capitalize(this.state.data.category)}</Badge>
                            <br />
                            {
                                this.state.data.tags.map(tag => 
                                    <Badge key={tag} style={{"margin": "2px", "fontSize": "12px"}} color="secondary">{tag}</Badge>  
                                )
                            }
                            {
                                this.state.data.submitter === this.state.userinfo.preferred_username || this.state.userinfo.admin ? <StyledPlus color="#4CAF50" size={22} onClick={() => this.showModal("create_tag")} /> : <></>
                            }
                            <Modal isOpen={this.state.show_modal === "create_tag"} toggle={this.closeModal}>
                                <ModalHeader toggle={this.closeModal}>
                                    Create Tag
                                </ModalHeader>
                                <ModalBody>
                                    {this.state.tag_error ? <Alert color="danger">{this.state.tag_error}</Alert> : <></>}
                                    <FormGroup>
                                        <Label styled={{"marginBottom": "0"}} for="tag">Tag</Label>
                                        <Input style={{"height": "calc(1.2em + 1rem + 2px"}} id="tag" placeholder="Web" onChange={this.modifyState("new_tag")} value={this.state.new_tag} />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" className="float-right" onClick={() => this.createTag()}>Create Tag</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                        <Col lg="3">
                            <Button color="primary" className="float-lg-right"><Download size={18} style={{"marginBottom": "1px"}} /> Download</Button>
                        </Col>
                        <hr style={{"width": "97%"}} />
                    </SpacedRow>
                    <SpacedRow>
                        <Col>
                            <Card>
                                <CardHeader><h2>Description</h2></CardHeader>
                                <CardBody>
                                    {this.state.data.description}
                                </CardBody>
                            </Card>
                        </Col>
                    </SpacedRow>
                    <SpacedRow>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <h2 style={{"marginBottom": "0"}}>
                                        Flags { this.state.data.submitter === this.state.userinfo.preferred_username || this.state.userinfo.admin ? <StyledPlus size={32} color="#4CAF50" onClick={() => this.showModal("create_flag")} /> : ""}
                                        <span className="float-right" style={{"color": "#4CAF50"}}>
                                            {this.state.completed_flags}/{Object.keys(this.state.data.flags).length} <FaFlag style={{"verticalAlign": "top"}} />
                                        </span>
                                    </h2>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Key</th>
                                                <th>Point Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Object.entries(this.state.data.flags).map( ([id, data]) => 
                                                    <HoverableTr key={id} className={data.flag ? "table-success" : "table-danger"}>
                                                        <th>{data.relative_id}</th><td>{data.flag ? data.flag : "NOT FOUND"}</td>
                                                        <td>{data.point_value} <StyledTrash onClick={() => this.deleteFlag(data.id)} className="float-right" size={18} /></td>
                                                    </HoverableTr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                    <Row>
                                        <Col lg={{size: 4, offset: 8}}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend" style={{"height": "calc(1.2em + 1rem + 2px"}}>
                                                    <InputGroupText style={{"paddingRight": "10px"}}>
                                                        {this.state.flag_loading ? <BounceLoader color="#B0197E" size={30} /> : this.state.flag_result === false ? <FaTimes color="#E51C23" size={20} /> : this.state.flag_result === true ? <FaCheck color="#4CAF50" size={20} /> : <FaCheck color="#FFF" size={20} />}
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <StyledInput style={{"height": "calc(1.2em + 1rem - 1px"}} placeholder="Flag Attempt" onChange={this.modifyState("flag_attempt")} value={this.state.key_attempt} />
                                                <InputGroupAddon style={{"height": "calc(1.2em + 1rem + 2px"}} addonType="append"><Button color="primary" onClick={() => this.attemptFlag()} >Submit</Button></InputGroupAddon>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Modal isOpen={this.state.show_modal === "create_flag"} toggle={this.closeModal}>
                                <ModalHeader toggle={this.closeModal}>
                                    <h2>Create Flag</h2>
                                </ModalHeader>
                                <ModalBody>
                                    {this.state.flag_error ? <Alert color="danger">{this.state.flag_error}</Alert> : <></>}
                                    <FormGroup>
                                        <Label styled={{"marginBottom": "0"}} for="flagData">Flag Data</Label>
                                        <Input style={{"height": "calc(1.2em + 1rem + 2px"}} id="flagData" placeholder="flag{ABCDEFGHIJKLMNOPQRSTUVWXYZ}" onChange={this.modifyStateObject("new_flag", "flag")} value={this.state.new_flag.flag} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label styled={{"marginBottom": "0"}} for="pointValue">Point Value</Label>
                                        <Input style={{"height": "calc(1.2em + 1rem + 2px"}} id="pointValue" placeholder="30" onChange={this.modifyStateObject("new_flag", "point_value")} value={this.state.new_flag.point_value} />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" className="float-right" onClick={() => this.createFlag()}>Create Flag</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </SpacedRow>
                    <SpacedRow>
                        <Col>
                            <Card>
                                <CardHeader><h2>Hints</h2></CardHeader>
                                <CardBody>
                                    {this.state.hint_error ? <Alert color="danger">{this.state.hint_error}</Alert> : <></>}
                                    {
                                        Object.entries(this.state.data.flags).map( ([id, flag_data]) => 
                                            <section key={id}>
                                                <h3>Flag {flag_data.relative_id} <StyledPlus color="#4CAF50" size={26} onClick={() => {this.showModal("create_hint"); this.setState({new_hint: {flag_id: flag_data.id}})}} /></h3>
                                                <Table responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Hint</th>
                                                            <th className="text-right">Purchase</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.entries(this.state.data.flags[id].hints).map( ([id, hint_data]) => 
                                                                <HoverableTr key={id}>
                                                                    {hint_data.hint ? <td>{hint_data.hint}</td> : <th>NOT PURCHASED</th>}
                                                                    <td className="text-right">
                                                                        {this.state.data.submitter === this.state.userinfo.preferred_username || this.state.userinfo.admin ? <StyledTrash onClick={() => this.deleteHint(hint_data.id)} size={20} /> : <></>} &nbsp;
                                                                        <Button color="primary" onClick={() => this.purchaseHint(hint_data.id)} disabled={hint_data.hint ? true : false}>{hint_data.cost} Points</Button>
                                                                    </td>
                                                                </HoverableTr>
                                                            )
                                                        }
                                                    </tbody>
                                                </Table>
                                            </section>
                                        )
                                    }
                                </CardBody>
                                <Modal isOpen={this.state.show_modal === "create_hint"} toggle={this.closeModal}>
                                    <ModalHeader toggle={this.closeModal}>
                                        <h2>Create Hint</h2>
                                    </ModalHeader>
                                    <ModalBody>
                                        {this.state.new_hint_error ? <Alert color="danger">{this.state.new_hint_error}</Alert> : <></>}
                                        <FormGroup>
                                            <Label styled={{"marginBottom": "0"}} for="hintCost">Hint Cost</Label>
                                            <Input style={{"height": "calc(1.2em + 1rem + 2px"}} id="hintCost" placeholder="20" onChange={this.modifyStateObject("new_hint", "cost")} value={this.state.new_flag.flag} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label styled={{"marginBottom": "0"}} for="hint">Hint</Label>
                                            <Input type="textarea" rows={6} id="hint" placeholder="Try Google?" onChange={this.modifyStateObject("new_hint", "hint")} value={this.state.new_flag.point_value} />
                                        </FormGroup>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={() => this.createHint()}>Create Hint</Button>
                                    </ModalFooter>
                                </Modal>
                            </Card>
                        </Col>
                    </SpacedRow>
                </Container>
            )
        }
    }
}

const mapStateToProps = state => ({
    oidc: state.oidc
})

export default connect(
    mapStateToProps,
)(Challenge)
