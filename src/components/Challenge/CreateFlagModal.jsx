import React from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Label,
    Input,
    Alert,
    FormGroup
} from 'reactstrap'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { POST } from '../../actions'

const StyledLabel = styled(Label)`
    margin-bottom: 0 !important
`;

const StyledInput = styled(Input)`
    height: calc(1.2em + 1rem + 2px) !important
`;

class CreateFlagModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            new_flag: {},
            flag_error: ""
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

    createFlag = () => {
        this.setState({
            flag_error: ""
        })
        POST(this.props.oidc.user.access_token, "/challenges/" + this.props.challenge_id + "/flags", {
            flag: this.state.new_flag.flag,
            point_value: this.state.new_flag.point_value
        })
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.props.successCallback()
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

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.closeModal}>
                <ModalHeader toggle={this.props.closeModal}>
                    <h2>Create Flag</h2>
                </ModalHeader>
                <ModalBody>
                    {this.state.flag_error ? <Alert color="danger">{this.state.flag_error}</Alert> : <></>}
                    <FormGroup>
                        <StyledLabel for="flagData">Flag Data</StyledLabel>
                        <StyledInput id="flagData" placeholder="flag{ABCDEFGHIJKLMNOPQRSTUVWXYZ}" onChange={this.modifyStateObject("new_flag", "flag")} value={this.state.new_flag.flag} />
                    </FormGroup>
                    <FormGroup>
                        <StyledLabel for="pointValue">Point Value</StyledLabel>
                        <StyledInput id="pointValue" placeholder="30" onChange={this.modifyStateObject("new_flag", "point_value")} value={this.state.new_flag.point_value} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="float-right" onClick={() => this.createFlag()}>Create Flag</Button>
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
)(CreateFlagModal)
