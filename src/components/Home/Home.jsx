import React from 'react'
import { connect } from 'react-redux'
import Challenge from './Challenge'
import styled from 'styled-components'
import { Loader } from '../'
import { GET, DELETE } from '../../actions'
import { FaRegEdit } from 'react-icons/fa'
import CreateChallengeModal from './CreateChallengeModal'
import { capitalize } from '../../utils'
import {
    createModal,
    hideModal,
    categoryCheckToggle,
    difficultyCheckToggle,
    getCategories,
    getDifficulties,
    getChallenges
} from '../../actions'
import {
    Container,
    Row,
    Col,
    Input,
    UncontrolledButtonDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    Label } from 'reactstrap'
import {
    StyledList,
    LgCentered,
    UploadButton
} from '../styled'

const StyledChallenge = styled(Challenge)`
    box-shadow 0 1px 4px rgba(0, 0, 0, 0.4);
`

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
`

class Home extends React.Component {
    constructor(props) {
        super(props)

        this.canExtend = true

        this.state = {
            limit: 10,
            offset: 1,
            showLoader: false,
            sort_by: '',
            order_by: '',
            search_query: '',
            userinfo: {
                preferred_username: ''
            },
            showCreateChallengeModal: false,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                showLoader: true
            })
        }, 1000)

        window.addEventListener('scroll', this.handleBottomScroll)

        getCategories()
        getDifficulties()

        if (this.props.ctf.challenges.length === 0) {
            this.getChallenges(true)
        } else {
            this.setState({
                offset: (this.props.ctf.challenges.length / this.state.limit)
            })
        }

        // TODO: Remove userinfo query once 'ctf_admin' becomes an actual role
        this.getUserInfo()
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleBottomScroll)
    }

    handleBottomScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.canExtend) {
            if (this.oldScroll < window.scrollY) {
                this.canExtend = false
                Promise.all([this.setState({
                    offset: this.state.offset + 1
                })])
                .then(() => this.getChallenges(false))
                setTimeout(() => {
                    this.canExtend = true
                }, 1000)
            }
        }
        this.oldScroll = window.scrollY
    }

    toggleCreateChallengeModal = () => {
        this.setState({
            showCreateChallengeModal: !this.state.showCreateChallengeModal
        })
    }

    getChallenges = (reset) => {
        getChallenges(
            this.getCheckedCategories(),
            this.getCheckedDifficulties(),
            this.state.search_query,
            this.state.sort_by,
            this.state.order_by,
            this.state.limit,
            this.state.offset,
            'nonBlockingLoad',
            reset
        )
        .then((isEmpty) => {
            if ((Object.keys(this.props.ctf.challenges).length % this.state.limit !== 0) || isEmpty) {
                this.canExtend = false
            }
        })
    }

    getCheckedCategories = () => {
        let categories = []
        for (const category in this.props.ctf.categories) {
            if (this.props.ctf.categories[category].checked) {
                categories.push(category)
            }
        }
        return categories.join()
    }

    getCheckedDifficulties = () => {
        let difficulties = []
        for (const difficulty in this.props.ctf.difficulties) {
            if (this.props.ctf.difficulties[difficulty].checked) {
                difficulties.push(difficulty)
            }
        }
        return difficulties.join()
    }

    getUserInfo = () => {
        return GET(this.props.oidc.user.access_token, "/user")
        .then(response => response.json())
        .then(jsonresponse => this.setState({
            userinfo: jsonresponse
        }))
    }

    setError = (message) => {
        
    }

    toggleDeleteModal = (id, title) => {
        createModal(
            'GenericModal',
            'Confirm Deletion',
            `Confirm deletion of CHallenge "${title}"`,
            'Delete',
            () => this.deleteChallenge(id),
            'Cancel',
        )
    }

    deleteChallenge = (challenge_id) => {
        DELETE(this.props.oidc.user.access_token, "/challenges/" + challenge_id)
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
                if (response[0] === 200) {
                    this.setState({
                        challenges: this.state.challenges.filter(challenge => challenge.id !== challenge_id)
                    })
                } else {
                    this.setError("Unable to delete challenge")
                }
        })
        .then(() => {
            hideModal()
        })
    }

    onSearchChange = e => {
        clearTimeout(this.timer)
        this.setState({
            search_query: e.target.value
        })
        this.timer = setTimeout(() => {
            this.getChallenges(true)
        }, 350)
    }

    handleSortChange = (e) => {
        const sortParams = JSON.parse(e.target.value)
        Promise.all([
        this.setState({
            sort_by: sortParams.sort_by,
            order_by: sortParams.order_by
        })])
        .then(() => this.getChallenges(true))
    }

    render () {
        if (this.props.loaders.blockingLoad > 0) {
            return <Loader loading={this.state.showLoader} />
        }
        else {
            return (
                <Container style={{"marginBottom": "40px", "minHeight": window.innerHeight + "px"}}>
                    <CreateChallengeModal 
                        isOpen={this.state.showCreateChallengeModal}
                        toggle={this.toggleCreateChallengeModal} 
                        categories={this.props.ctf.categories}
                        difficulties={this.props.ctf.difficulties}
                        current_username={this.state.userinfo.preferred_username}
                        // TODO: Implement SocketIO, give user popup that new challenge was added, allow them to reload
                        successCallback={() => {
                            this.toggleCreateChallengeModal()
                            createModal(
                                'GenericModal',
                                'Success',
                                'Your challenge was successfully submitted. Once it\'s been moved to permanent storage it will become available. Thanks!',
                                undefined,
                                undefined,
                                'Close'
                            )}
                        }
                    />
                    <Row>
                        <Col lg={{ size: 4, order: 2}} style={{"marginBottom": "12px"}}>
                            <StyledInput placeholder="Search" onChange={this.onSearchChange} />
                        </Col>
                        <Col lg={{ size: 4, order: 1}} style={{"marginBottom": "12px"}}>
                            <Row>
                                <StyledList type="select" value={JSON.stringify({sort_by: this.state.sort_by, order_by: this.state.order_by})} onChange={this.handleSortChange} style={{"marginBottom": "8px"}}>
                                    {this.state.sort_by === "" && <option value={JSON.stringify({sort_by: "", order_by: ""})} disabled>
                                        Sort By
                                    </option>}
                                    <option value={JSON.stringify({sort_by: "ts", order_by: "desc"})}>Date Added: New to Old</option>
                                    <option value={JSON.stringify({sort_by: "ts", order_by: "asc"})}>Date Added: Old to New</option>
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
                                                Object.keys(this.props.ctf.categories).map( ( name ) => 
                                                    <DropdownItem toggle={false} key={name}>
                                                        <Label check>
                                                            <Input type="checkbox" checked={this.props.ctf.categories[name].checked} onChange={() => categoryCheckToggle(name).then(() => this.getChallenges(true))} />{' '}
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
                                                Object.keys(this.props.ctf.difficulties).map( ( name ) => 
                                                    <DropdownItem toggle={false} key={name}>
                                                        <Label check>
                                                            <Input type="checkbox" checked={this.props.ctf.difficulties[name].checked} onChange={() => difficultyCheckToggle(name).then(() => this.getChallenges(true))} />{' '}
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
                        <Col lg={{ size: 4, order: 3}} style={{"marginBottom": "12px"}}>
                            <UploadButton onClick={() => this.toggleCreateChallengeModal()} color="primary" size="lg" className="float-lg-right">Create <FaRegEdit style={{"marginBottom": "5px"}} size={20} /></UploadButton>
                        </Col>
                    </Row>
                    {
                        this.props.ctf.challenges.map(challenge => 
                            <Row key={challenge.id}>
                                <Col>
                                    <StyledChallenge 
                                        id={challenge.id}
                                        title={challenge.title}
                                        description={challenge.description}
                                        submitter_username={challenge.submitter}
                                        submitter_full_name={challenge.author}
                                        ts={challenge.ts}
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
                </Container>
            );
        }
    }
}

const mapStateToProps = state => ({
    oidc: state.oidc,
    loaders: state.loaders,
    ctf: state.ctf
})

export default connect(
    mapStateToProps
)(Home)
