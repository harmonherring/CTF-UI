import React from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap'

class CreateSuccessModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>
                    Success
                </ModalHeader>
                <ModalBody>
                    Your challenge was successfully submitted. Once it's been moved to permanent storage it will become available. Thanks!
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className="float-right" onClick={() => this.props.exit()}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default CreateSuccessModal
