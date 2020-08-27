import React from 'react'
import { connect } from 'react-redux'
import {
    Alert,
    ListGroup,
    Badge,
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    ModalFooter,
    Button
} from 'reactstrap'
import {
    StyledTrash,
    StyledInput,
    StyledListItem
} from '../styled'
import { capitalize } from '../../utils'
import { DELETE, POST, GET } from '../../actions'

class Difficulties extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            difficulties: [],
            modal: false,
            backdrop: false,
            error: '',
            new_difficulty: {
                name: ''
            }
        }
    }

    componentDidMount = () => {
        this.getDifficulties()
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal,
            backdrop: !this.state.backdrop
        });
    }

    createDifficulty = () => {
        this.setState({
            "error": ""
        });

        POST(this.props.oidc.user.access_token, '/difficulties', {
            name: this.state.new_difficulty.name,
        })
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.toggleModal("difficultyModal");
                this.getDifficulties();
            } else {
                this.setState({error: response[1].message ? response[1] : "Something is wrong"});
            }
        });
    }

    deleteDifficulty = ( difficultyName ) => {
        this.setState({
            difficultyDeletionError: ""
        });
        DELETE(this.props.oidc.user.access_token, "/difficulties/" + difficultyName, {})
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 200) {
                this.getDifficulties();
            } else {
                this.setState({
                    difficultyDeletionError: response[1].message
                });
            }
        })
    }

    getDifficulties = () => {
        return GET(this.props.oidc.user.access_token, '/difficulties')
        .then(response => response.json())
        .then(jsonresponse => this.setState({difficulties: jsonresponse}));
    }

    render() {
        return (
            <>
                <h1>Difficulties</h1>
                <hr />
                { this.state.error ? <Alert color="danger">{this.state.error}</Alert> : "" }
                <ListGroup style={{"marginBottom": "20px"}}>
                    {
                        this.state.difficulties.map(difficulty => 
                            <StyledListItem key={difficulty.name}>
                                <h5 style={{"margin": 0}}><span className="float-left">{capitalize(difficulty.name)}</span><span className="float-right"><StyledTrash size={18} onClick={() => this.deleteDifficulty(difficulty.name)} /> <Badge pill color="primary">{difficulty.count}</Badge></span></h5>
                            </StyledListItem>
                        )
                    }
                </ListGroup>
                <Modal isOpen={this.state.modal} toggle={() => this.toggleModal()} backdrop={this.state.backdrop}>
                    <ModalHeader toggle={() => this.toggleModal()}>
                        Create Difficulty
                    </ModalHeader>
                    <ModalBody>
                        {
                            this.state.error ? <Alert color="danger">{this.state.error}</Alert> : <span></span>
                        }
                        <Label for="new_difficulty_name">Difficulty Name</Label>
                        <StyledInput id="new_difficulty_name" placeholder="Easy Peasy" onChange={(e) => this.updateStateObject(e, "new_difficulty", "name")} value={this.state.new_difficulty.name} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.createDifficulty()}>Create Difficulty</Button>
                    </ModalFooter>
                </Modal>
                <Button style={{"width": "100%", "marginBottom": "20px"}} color="primary" onClick={() => this.toggleModal()}>Create Difficulty</Button>
            </>
        )
    }
}

const mapStateToProps = state => ({
    oidc: state.oidc
})

export default connect(mapStateToProps)(Difficulties)