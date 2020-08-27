import styled from 'styled-components'
import { FaRegTrashAlt } from 'react-icons/fa'
import {
    Input,
    ListGroupItem
} from 'reactstrap'

export const StyledInput = styled(Input)`
    height: calc(1.5em + 1rem + 2px) !important;    
`

export const StyledTrash = styled(FaRegTrashAlt)`
    color: #E51C23;
    visibility: hidden;
    opacity: 0.5;
    transition: opacity .2s;
    
    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`

export const StyledListItem = styled(ListGroupItem)`
    &:hover ${StyledTrash} {
        visibility: visible;
    }
`