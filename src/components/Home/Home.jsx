import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Col, Input, UncontrolledButtonDropdown, DropdownItem, DropdownToggle, DropdownMenu, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Challenge from './Challenge'
import styled from 'styled-components'
import { Loader } from '../'
import { GET, DELETE } from '../../actions'
import { FaRegEdit } from 'react-icons/fa'
import { capitalize } from '../../utils'

const StyledChallenge = styled(Challenge)`
    box-shadow 0 1px 4px rgba(0, 0, 0, 0.4);
`;

const StyledInput = styled(Input)`
    background: #FFF;
    height: calc(1em + 1.2rem + 2px) !important;
    border-radius: .2rem;
    padding-left: 5px !important;
    box-shadow: none !important;
    border: 1px solid #DDD !important;

    :focus {
        background: #FFF;
        border: 1px solid #B0197E !important;
        box-shadow: 0 0 0 0.2rem rgba(176, 25, 126, 0.25) !important;
    }
`;

const StyledList = styled(Input)`
    background: #FFF;
    height: calc(1em + 1.2rem + 2px) !important;
    padding: 0.1rem 0.1rem 0.1rem 0.4rem !important;
    box-shadow: none !important;
    border: 1px solid #DDD !important;
    border-radius: .2rem !important;
    width: 72%;

    :focus {
        background-color: #FFF;
        border: 1px solid #B0197E !important;
        box-shadow: 0 0 0 0.2rem rgba(176, 25, 126, 0.25) !important;
    }

    @media (max-width: 991.98px) {
        margin: 0 auto;
    }
`;

const UploadButton = styled(Button)`
    @media (max-width: 991.98px) {
        margin: 0 auto;
        display: block;
    }
`;

const LgCentered = styled.div`
    @media (max-width: 991.98px) {
        margin: 0 auto;
        display: block;
    }
`;

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            showLoader: false,
            sort_by: "",
            dropdownOpen: false,
            categories: {},
            difficulties: {},
            error: "",
            deletionModal: false
        }
    }

    toggle = () => {
        this.setState({dropdownOpen: !this.state.dropdownOpen})
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                showLoader: true
            })
        }, 1000)

        this.getCategories()
        .then(() => this.getDifficulties())
        .then(() => this.getUserInfo())
        .then(() => this.getChallenges())
        .then(() => this.setState({
            isLoading: false
        }))
    }

    getDataForRender = (data) => {
        return Promise.all([this.getChallenges(), this.getCategories(), this.getDifficulties()]) 
    }

    handleChange = (field) => e => {
        this.setState({
            [field]: e.target.value
        })
    }

    getChallenges = () => {
        return GET(this.props.oidc.user.access_token, "/challenges?categories=" + this.getCheckedCategories() + "&difficulties=" + this.getCheckedDifficulties())
        .then(response => response.json())
        .then(jsonresponse => this.setState({
            challenges: jsonresponse
        }))
    }

    getCategories = () => {
        return GET(this.props.oidc.user.access_token, "/categories?")
        .then(response => response.json())
        .then(jsonresponse => {
            let all_categories = {}
            jsonresponse.map(category => 
                all_categories[category.name] = { ...category, checked: true }
            )
            this.setState({
                categories: all_categories
            })
        })
    }

    getDifficulties = () => {
        return GET(this.props.oidc.user.access_token, "/difficulties")
        .then(response => response.json())
        .then(jsonresponse => {
            let all_difficulties = {}
            jsonresponse.map(difficulty => 
                all_difficulties[difficulty.name] = { ...difficulty, checked: true }
            )
            this.setState({
                difficulties: all_difficulties
            })
        })
    }

    toggleCheck = (categoriesOrDifficulties, name) => {
        let val = this.state[categoriesOrDifficulties][name]
        val.checked = !val.checked
        this.setState({
            [categoriesOrDifficulties]: { ...this.state[categoriesOrDifficulties], [name]: val}
        })
        this.getChallenges()
    }

    getCheckedCategories = () => {
        let categories = []
        for (const category in this.state.categories) {
            if (this.state.categories[category].checked) {
                categories.push(category)
            }
        }
        return categories.join()
    }

    getCheckedDifficulties = () => {
        let difficulties = []
        for (const difficulty in this.state.difficulties) {
            if (this.state.difficulties[difficulty].checked) {
                difficulties.push(difficulty)
            }
        }
        return difficulties.join()
    }

    getUserInfo = () => {
        GET(this.props.oidc.user.access_token, "/user")
        .then(response => response.json())
        .then(jsonresponse => this.setState({
            userinfo: jsonresponse
        }))
    }

    setError = (message) => {
        this.setState({
            error: message
        })
    }

    spawnDeleteModal = (challenge_id) => {

    }

    toggleModal = (modal) => {
        this.setState({
            [modal]: !this.state[modal]
        })
    }

    toggleDeleteModal = (id, title) => {
        this.setState({
            deleteChallengeId: id,
            deleteChallengeTitle: title
        })
        this.toggleModal("deletionModal")
    }

    deleteChallenge = (challenge_id) => {
        DELETE(this.props.oidc.user.access_token, "/challenges/" + challenge_id)
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
                if (response[0] === 200) {
                        this.getChallenges()
                } else {
                        this.setError("Unable to delete challenge")
                }
        })
        .then(() => {
            if (this.state.deletionModal) {
                this.setState({
                    deletionModal: false
                })
            }
        })
}

    render () {
        if (this.state.isLoading) {
            return <Loader loading={this.state.showLoader} />
        }
        else {
            return (
                <Container style={{"marginBottom": "40px"}}>
                    <Row>
                        <Col lg={{ size: 4, order: 2}} style={{"margin-bottom": "12px"}}>
                            <StyledInput placeholder="Search" />
                        </Col>
                        <Col lg={{ size: 4, order: 1}} style={{"margin-bottom": "12px"}}>
                            <Row>
                                <StyledList type="select" value={this.state.sort_by} onChange={this.handleChange('sort_by')} style={{"marginBottom": "8px"}}>
                                    {this.state.sort_by === "" && <option value="" disabled>
                                        Sort By    
                                    </option>}
                                    <option value="1">Date Added: New to Old</option>
                                    <option value="2">Date Added: Old to New</option>
                                    <option value="3">Rating: High to Low</option>
                                    <option value="4">Rating: Low to High</option>
                                </StyledList>
                            </Row>
                            <Row>
                                <LgCentered>
                                    <UncontrolledButtonDropdown color="primary" style={{"marginRight": "8px"}}>
                                        <DropdownToggle caret color="primary">
                                            &nbsp;Categories
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {
                                                Object.keys(this.state.categories).map( ( name ) => 
                                                    <DropdownItem toggle={false}>
                                                        <Label check>
                                                            <Input type="checkbox" checked={this.state.categories[name].checked} onChange={() => this.toggleCheck("categories", name)} />{' '}
                                                            {capitalize(name)}
                                                        </Label>
                                                    </DropdownItem>
                                                )
                                            }
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown color="primary">
                                        <DropdownToggle caret color="primary">
                                            &nbsp;Difficulties
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {
                                                Object.keys(this.state.difficulties).map( ( name ) => 
                                                    <DropdownItem toggle={false}>
                                                        <Label check>
                                                            <Input type="checkbox" checked={this.state.difficulties[name].checked} onChange={() => this.toggleCheck("difficulties", name)} />{' '}
                                                            {capitalize(name)}
                                                        </Label>
                                                    </DropdownItem>
                                                )
                                            }
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </LgCentered>
                            </Row>
                        </Col>
                        <Col lg={{ size: 4, order: 3}} style={{"margin-bottom": "12px"}}>
                            <UploadButton color="primary" size="lg" className="float-lg-right">Create <FaRegEdit style={{"marginBottom": "5px"}} size={20} /></UploadButton>
                        </Col>
                    </Row>
                    {
                        this.state.challenges.map(challenge => 
                            <Row>
                                <Col>
                                    <StyledChallenge 
                                        id={challenge.id}
                                        title={challenge.title}
                                        description={challenge.description}
                                        submitter_username={challenge.submitter}
                                        submitter_full_name={challenge.author}
                                        ts="May 21, 2020"
                                        flags={challenge.flags}
                                        tags={challenge.tags}
                                        deleteChallenge={this.toggleDeleteModal}
                                        current_username={this.state.userinfo.preferred_username}
                                        admin={this.state.userinfo.admin}
                                        category={challenge.category}
                                        difficulty={challenge.difficulty}
                                    />
                                </Col>
                            </Row>
                        )
                    }
                    <Modal isOpen={this.state.deletionModal} toggle={() => this.toggleModal("deletionModal")}>
                    <ModalHeader toggle={() => this.toggleModal("deletionModal")}>Confirm Deletion</ModalHeader>
                    <ModalBody>
                        Confirm deletion of Challenge {this.state.deleteChallengeTitle}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.deleteChallenge(this.state.deleteChallengeId)}>Delete</Button>
                        <Button color="secondary" onClick={() => this.toggleModal("deletionModal")}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                </Container>
            );
        }
    }
}

Home.propTypes = {
    oidc: PropTypes.any
}

const mapStateToProps = state => ({
    oidc: state.oidc
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
