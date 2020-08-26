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
import { connect } from 'react-redux'

class GenericModal extends React.Component {
    exitCallback = () => {
        store.dispatch({
            type: HIDE_MODAL
        })
        if (this.props.exitCallback) {
            this.props.exitCallback()
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.visible} toggle={() => this.exitCallback()}>
                <ModalHeader toggle={() => this.exitCallback()}>
                    { this.props.title }
                </ModalHeader>
                <ModalBody>
                    { this.props.text }
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => store.dispatch({ type: HIDE_MODAL })}>{ this.props.exitButtonText }</Button>
                    { this.props.actionButtonCallback && this.props.actionButtonText
                        && <Button color="primary" onClick={() => this.props.actionButtonCallback()}>{this.props.actionButtonText}</Button> }
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    ...state.modal
})

export default connect(mapStateToProps)(GenericModal)
