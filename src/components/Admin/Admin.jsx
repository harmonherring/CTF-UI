import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Col, ListGroup, ListGroupItem, Badge, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Label, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { GET } from '../../actions/get';
import { POST } from '../../actions/post';
import { DELETE } from '../../actions/delete';


const StyledInput = styled(Input)`
    height: calc(1.5em + 1rem + 2px) !important;    
`;

const StyledTrash = styled(FaRegTrashAlt)`
    color: #E51C23;
    visibility: hidden;
    opacity: 0.5;
    transition: opacity .2s;
    
    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`;

const StyledListItem = styled(ListGroupItem)`
    &:hover ${StyledTrash} {
        visibility: visible;
    }
`;




class Admin extends Component {
    constructor (props) {
        super(props)

        this.state = {
            categories: [],
            difficulties: [],
            new_difficulty: {
                "name": ""
            },
            new_category: {
                "name": "",
                "description": ""
            },
            difficultyModal: false,
            categoryModal: false,
            backdrop: false,
            deleting_difficulty: "",
            deletionModal: false,
            deletionModalBody: "",
            deletionModalFooter: "",
            categoryDeletionError: "",
        }
    }

    toggleModal = (modal) => {
        this.setState({
            [modal]: !this.state[modal],
            backdrop: !this.state.backdrop
        });
    }

    componentDidMount () {
        this.getCategories();
        this.getDifficulties();
    }

    getCategories = () => {
        GET(this.props.oidc.user.access_token, '/categories')
        .then(response => response.json())
        .then(jsonresponse => this.setState({categories: jsonresponse}));
    }

    getDifficulties = () => {
        GET(this.props.oidc.user.access_token, '/difficulties')
        .then(response => response.json())
        .then(jsonresponse => this.setState({difficulties: jsonresponse}));
    }

    capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    updateStateObject = (event, object, parameter) => {
        let new_object = this.state[object]
        new_object[parameter] = event.target.value
        this.setState({
            [object]: new_object
        });
    }

    createDifficulty = () => {
        this.setState({
            "error": ""
        });

        POST(this.props.oidc.user.access_token, '/difficulties', {
            name: this.state.new_difficulty.name,
        })
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.toggleModal("difficultyModal");
                this.getDifficulties();
            } else {
                this.setState({error: response[1].message ? response[1] : "Something is wrong"});
            }
        });
    }

    deleteDifficulty = ( difficultyName ) => {
        this.setState({
            difficultyDeletionError: ""
        });
        DELETE(this.props.oidc.user.access_token, "/difficulties/" + difficultyName, {})
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 200) {
                this.getDifficulties();
            } else {
                this.setState({
                    difficultyDeletionError: response[1].message
                });
            }
        })
    }

    deleteCategory = ( categoryName ) => {
        this.setState({
            categoryDeletionError: ""
        })
        DELETE(this.props.oidc.user.access_token, "/categories/" + categoryName, {})
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 200) {
                this.getCategories();
            } else {
                this.setState({
                    categoryDeletionError: response[1].message
                });
            }
        })
    }

    createCategory = () => {
        this.setState({
            error: ""
        });

        POST(this.props.oidc.user.access_token, '/categories', {
            name: this.state.new_category.name,
            description: this.state.new_category.description
        })
        .then(response => Promise.all([response.status, response.json()]))
        .then(response => {
            if (response[0] === 201) {
                this.toggleModal("categoryModal");
                this.getCategories();
            } else {
                this.setState({error: response[1].message ? response[1] : "Something is wrong"});
            }
        });
    }

    render () {
        return (
            <Container>
                <Row style={{"margin-bottom": "50px"}}>
                    <Col sm="5">
                        <h1>Categories</h1>
                        <hr />
                        { this.state.categoryDeletionError ? <Alert color="danger">{this.state.categoryDeletionError}</Alert> : "" }
                        <ListGroup style={{"margin-bottom": "20px"}}>
                            {
                                this.state.categories.map(category => 
                                    <>
                                        <StyledListItem key={category.name} id={category.name + "-popover"} onMouseEnter={() => this.setState({[category.name + "-popover"]: true})} onMouseLeave={() => this.setState({[category.name + "-popover"]: false})} >
                                            <h5 style={{"margin": 0}}><span className="float-left">{this.capitalize(category.name)}</span> <span className="float-right"><StyledTrash size={18} onClick={() => this.deleteCategory(category.name)} /> <Badge pill color="primary">{category.count}</Badge></span></h5>
                                        </StyledListItem>
                                        <Popover placement="right" isOpen={this.state[category.name + "-popover"]} target={category.name + "-popover"}>
                                            <PopoverHeader>
                                                {this.capitalize(category.name)}
                                            </PopoverHeader>
                                            <PopoverBody>
                                                {category.description}
                                            </PopoverBody>
                                        </Popover>
                                    </>
                                )
                            }
                        </ListGroup>
                        <Modal isOpen={this.state.categoryModal} toggle={() => this.toggleModal("categoryModal")} backdrop={this.state.backdrop}>
                            <ModalHeader toggle={() => this.toggleModal("categoryModal")}>
                                Create Category
                            </ModalHeader>
                            <ModalBody>
                                <Label for="new_category_name" style={{"margin-bottom": 0}}>Category Name</Label>
                                <StyledInput id="new_category_name" placeholder="Food" onChange={(e) => this.updateStateObject(e, "new_category", "name")} value={this.state.new_category.name} />
                                <br />
                                <Label for="new_category_description">Category Name</Label>
                                <Input style={{"height": "150px"}} type="textarea" id="new_category_description" placeholder="Eat a whole cake" onChange={(e) => this.updateStateObject(e, "new_category", "description")} value={this.state.new_category.description}></Input>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={() => this.createCategory()}>Create Category</Button>
                            </ModalFooter>
                        </Modal>
                        <Button style={{"width": "100%", "margin-bottom": "20px"}} color="primary" onClick={() => this.toggleModal("categoryModal")}>Create Category</Button>
                    </Col>

                    <Col sm={{size: 5, offset: 2}}>
                        <h1>Difficulties</h1>
                        <hr />
                        { this.state.difficultyDeletionError ? <Alert color="danger">{this.state.difficultyDeletionError}</Alert> : "" }
                        <ListGroup style={{"margin-bottom": "20px"}}>
                            {
                                this.state.difficulties.map(difficulty => 
                                    <StyledListItem key={difficulty.name}>
                                        <h5 style={{"margin": 0}}><span className="float-left">{this.capitalize(difficulty.name)}</span><span className="float-right"><StyledTrash size={18} onClick={() => this.deleteDifficulty(difficulty.name)} /> <Badge pill color="primary">{difficulty.count}</Badge></span></h5>
                                    </StyledListItem>
                                )
                            }
                        </ListGroup>
                        <Modal isOpen={this.state.difficultyModal} toggle={() => this.toggleModal("difficultyModal")} backdrop={this.state.backdrop}>
                            <ModalHeader toggle={() => this.toggleModal("difficultyModal")}>
                                Create Difficulty
                            </ModalHeader>
                            <ModalBody>
                                {
                                    this.state.error ? <Alert color="danger">{this.state.error}</Alert> : <span></span>
                                }
                                <Label for="new_difficulty_name">Difficulty Name</Label>
                                <StyledInput id="new_difficulty_name" placeholder="Easy Peasy" onChange={(e) => this.updateStateObject(e, "new_difficulty", "name")} value={this.state.new_difficulty.name} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={() => this.createDifficulty()}>Create Difficulty</Button>
                            </ModalFooter>
                        </Modal>
                        <Button style={{"width": "100%", "margin-bottom": "20px"}} color="primary" onClick={() => this.toggleModal("difficultyModal")}>Create Difficulty</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Active Reports</h1>
                        <hr />
                        <p>To be implemented at a future date</p>
                    </Col>
                </Row>
            </Container>
        );
    }
}

Admin.propTypes = {
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
)(Admin)
