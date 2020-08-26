import React from 'react'
import store from '../../store'
import { HIDE_MODAL } from '../../constants'
import { 
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap'

export default class GenericModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.visible} toggle={() => store.dispatch({ type: HIDE_MODAL })}>
                <ModalHeader toggle={() => store.dispatch({ type: HIDE_MODAL })}>
                    { this.props.title }
                </ModalHeader>
                <ModalBody>
                    { this.props.text }
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => store.dispatch({ type: HIDE_MODAL })}>Cancel</Button>{' '}
                    { this.props.successButtonCallback && this.props.successButtonText 
                        ? <Button color="primary" onClick={() => this.props.successButtonCallback()}>{this.props.successButtonText}</Button> : '' }
                </ModalFooter>
            </Modal>
        )
    }
}
