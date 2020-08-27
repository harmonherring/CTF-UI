import React from 'react'
import { connect } from 'react-redux'
import {
    Alert,
    ListGroup,
    Badge,
    Popover,
    PopoverBody,
    PopoverHeader,
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Button
} from 'reactstrap'
import {
    StyledListItem,
    StyledTrash,
    StyledInput
} from '../styled'
import { remove_spaces, capitalize } from '../../utils'
import { GET, POST, DELETE } from '../../actions'

class Categories extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: [],
            modal: false,
            backdrop: false,
            new_category: {
                name: '',
                description: '',
                upload_required: false
            }
        }
    }

    componentDidMount = () => {
        this.getCategories()
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal,
            backdrop: !this.state.backdrop
        });
    }

    getCategories = () => {
        return GET(this.props.oidc.user.access_token, '/categories')
        .then(response => response.json())
        .then(jsonresponse => this.setState({categories: jsonresponse}));
    }
    
    updateStateObject = (event, object, parameter) => {
        let new_object = this.state[object]
        new_object[parameter] = event.target.value
        this.setState({
            [object]: new_object
        });
    }
    
    createCategory = () => {
        this.setState({
            error: ""
        });

        POST(this.props.oidc.user.access_token, '/categories', {
            ...this.state.new_category
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

    toggleUploadRequirement = (e) => {
        this.setState({
            new_category: {
                ...this.state.new_category,
                upload_required: !this.state.new_category.upload_required
            }
        })
    }

    render() {
        return (
            <>
                <h1>Categories</h1>
                <hr />
                { this.state.categoryDeletionError ? <Alert color="danger">{this.state.categoryDeletionError}</Alert> : "" }
                <ListGroup style={{"marginBottom": "20px"}}>
                    {
                        this.state.categories.map(category => 
                            <React.Fragment key={category.name}>
                                <StyledListItem id={remove_spaces(category.name) + "-popover"} onMouseEnter={() => this.setState({[remove_spaces(category.name) + "-popover"]: true})} onMouseLeave={() => this.setState({[remove_spaces(category.name) + "-popover"]: false})} >
                                    <h5 style={{"margin": 0}}><span className="float-left">{capitalize(category.name)}</span> <span className="float-right"><StyledTrash size={18} onClick={() => this.deleteCategory(category.name)} /> <Badge pill color="primary">{category.count}</Badge></span></h5>
                                </StyledListItem>
                                <Popover placement="right" isOpen={this.state[remove_spaces(category.name) + "-popover"]} target={remove_spaces(category.name) + "-popover"}>
                                    <PopoverHeader>
                                        {capitalize(category.name)}
                                    </PopoverHeader>
                                    <PopoverBody>
                                        {category.description}
                                    </PopoverBody>
                                </Popover>
                            </React.Fragment>
                        )
                    }
                </ListGroup>
                <Modal isOpen={this.state.modal} toggle={() => this.toggleModal()} backdrop={this.state.backdrop}>
                    <ModalHeader toggle={() => this.toggleModal()}>
                        Create Category
                    </ModalHeader>
                    <ModalBody>
                        <Label for="new_category_name" style={{"marginBottom": 0}}>Category Name</Label>
                        <StyledInput id="new_category_name" placeholder="Food" onChange={(e) => this.updateStateObject(e, "new_category", "name")} value={this.state.new_category.name} />
                        <br />
                        <Label for="new_category_description">Category Name</Label>
                        <Input style={{"height": "150px", "marginBottom": "10px"}} type="textarea" id="new_category_description" placeholder="Eat a whole cake" onChange={(e) => this.updateStateObject(e, "new_category", "description")} value={this.state.new_category.description}></Input>
                        <Label check>
                            <Input style={{"marginLeft": "1px"}} type="checkbox" onChange={this.toggleUploadRequirement} checked={this.state.new_category.upload_required} />{' '}
                            File Upload Required
                        </Label>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.createCategory()}>Create Category</Button>
                    </ModalFooter>
                </Modal>
                <Button style={{"width": "100%", "marginBottom": "20px"}} color="primary" onClick={() => this.toggleModal("categoryModal")}>Create Category</Button>
            </>
        )
    }
}

const mapStateToProps = state => ({
    oidc: state.oidc
})

export default connect(mapStateToProps)(Categories)
