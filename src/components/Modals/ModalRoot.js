import GenericModal from './GenericModal'
import { connect } from 'react-redux'
import React from 'react'

const MODAL_COMPONENTS = { 
    'GenericModal': GenericModal
}

const ModalRoot = ({ modalType }) => {
    if (!modalType || !MODAL_COMPONENTS[modalType]) return null

    const SpecificModal = MODAL_COMPONENTS[modalType]

    return <SpecificModal />
}

const mapState = state => ({
    modalType: state.modal.type
})

export default connect(mapState)(ModalRoot)
