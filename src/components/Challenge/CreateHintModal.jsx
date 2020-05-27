import React from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Alert,
    Input,
    Label,
    Button
} from 'reactstrap'
import styled from 'styled-components'
import { POST } from '../../actions'
import { connect } from 'react-redux'

const StyledLabel = styled(Label)`
    margin-bottom: 0 !important
`;

const StyledInput = styled(Input)`
    height: calc(1.2em + 1rem + 2px) !important
`;

class CreateHintModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            new_hint: {
                cost: null,
                hint: "",
                flag_id: this.props.flag_id
            },
            new_hint_error: ""
        }
    }

    modifyStateObject = (object, value) => e => {
        this.setState({
            [object]: {
                ...this.state[object],
                [value]: e.target.value
            }
        })
    }

    createHint = () => {
        this.setState({
            new_hint_error: ""
        })
        POST(this.props.oidc.user.access_token, "/flags/" + this.props.flag_id + "/hints", {...this.state.new_hint})
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.props.successCallback()
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

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.closeModal}>
                <ModalHeader toggle={this.props.closeModal}>
                    <h2>Create Hint</h2>
                </ModalHeader>
                <ModalBody>
                    {this.state.new_hint_error ? <Alert color="danger">{this.state.new_hint_error}</Alert> : <></>}
                    <FormGroup>
                        <StyledLabel for="hintCost">Hint Cost</StyledLabel>
                        <StyledInput id="hintCost" placeholder="20" onChange={this.modifyStateObject("new_hint", "cost")} value={this.state.new_hint.cost} />
                    </FormGroup>
                    <FormGroup>
                        <StyledLabel for="hint">Hint</StyledLabel>
                        <Input type="textarea" rows={6} id="hint" placeholder="Try Google?" onChange={this.modifyStateObject("new_hint", "hint")} value={this.state.new_hint.hint} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.createHint()}>Create Hint</Button>
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
)(CreateHintModal)
