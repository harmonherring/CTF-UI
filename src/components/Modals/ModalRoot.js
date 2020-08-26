import GenericModal from './GenericModal'
import { connect } from 'react-redux'
import React from 'react'

const MODAL_COMPONENTS = { 
    'GenericModal': GenericModal
}

const ModalRoot = ({ modal }) => {
    if (!modal.type || !MODAL_COMPONENTS[modal.type]) return null

    const SpecificModal = MODAL_COMPONENTS[modal.type]

    return <SpecificModal
                        visible={!!modal.type}
                        title={modal.title}
                        text={modal.text}
                        successButtonText={modal.successButtonText}
                        successButtonCallback={modal.successButtonCallback} />
}

const mapState = state => ({
    modal: state.modal
})

export default connect(mapState)(ModalRoot)
