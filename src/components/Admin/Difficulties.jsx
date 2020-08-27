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
import { DELETE, POST, getDifficulties } from '../../actions'

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

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal,
            backdrop: !this.state.backdrop
        });
    }

    createDifficulty = () => {
        this.setState({
            creationError: ''
        });

        POST(this.props.oidc.user.access_token, '/difficulties', {
            name: this.state.new_difficulty.name,
        })
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.toggleModal("difficultyModal");
                getDifficulties();
            } else {
                this.setState({
                    creationError: response[1].message ? response[1].message : "Something is wrong"
                });
            }
        });
    }

    deleteDifficulty = ( difficultyName ) => {
        this.setState({
            deletionError: ''
        });
        DELETE(this.props.oidc.user.access_token, "/difficulties/" + difficultyName, {})
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 200) {
                getDifficulties();
            } else {
                this.setState({
                    deletionError: response[1].message
                });
            }
        })
    }

    updateStateObject = (event, object, parameter) => {
        let new_object = this.state[object]
        new_object[parameter] = event.target.value
        this.setState({
            [object]: new_object
        });
    }

    render() {
        return (
            <>
                <h1>Difficulties</h1>
                <hr />
                { this.state.deletionError ? <Alert color="danger">{this.state.deletionError}</Alert> : "" }
                <ListGroup style={{"marginBottom": "20px"}}>
                    {
                        this.props.difficulties.map(difficulty => 
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
                            this.state.creationError && <Alert color="danger">{this.state.creationError}</Alert>
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
    oidc: state.oidc,
    difficulties: state.ctf.difficulties
})

export default connect(mapStateToProps)(Difficulties)
