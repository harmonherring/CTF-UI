import styled from 'styled-components'
import { FaRegTrashAlt } from 'react-icons/fa'
import { GoPlus } from 'react-icons/go'
import {
    Input,
    ListGroupItem,
    Button,
    Row
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

export const ChallengeContainer = styled.div`
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    background-color: #fff;
    border-radius: .25rem;

    &:hover ${StyledTrash} {
        visibility: visible;
    }
`

export const ChallengeBody = styled.div`
    padding: 1.25rem;
    border-top-left-radius: .25rem;
    border-top-right-radius: .25rem;
`;

export const ChallengeFooter = styled.div`
    background-color: rgba(0, 0, 0, 0.03);
    padding: .75rem 1.25rem;
    border-bottom-left-radius: .25rem;
    border-bottom-right-radius: .25rem;
`

export const BadgeWrapper = styled.h5`
    display: inline-block;
    font-size: 15px;
    margin: 2px;
`

export const Overlay = styled.div`
    position: absolute;
    bottom: calc(2.5rem + 23px);
    left: 0;
    text-align: center;
    margin: 0 35px;
    padding: 0;
    width: 100%;
    background-image: linear-gradient(to bottom, transparent, #FFF);
    height: 100px;
    visibility: ${props => props.clicked ? "hidden !important" : "visible"};

    @media (max-width: 575px) {
        width: 79%;
    }

    @media (min-width: 576px) {
        width: 440px;
    }

    @media (min-width: 768px) {
        width: 620px;
    }

    @media (min-width: 992px) {
        width: 860px;
    }

    @media (min-width: 1200px) { 
        width: 1040px;
    }

    &:hover {
        cursor: pointer
    }
`

export const OverflowContainer = styled.div`
    cursor: ${props => props.clicked ? "inherit" : "pointer !important"};
    max-height: ${props => props.clicked ? "none !important" : "10rem !important"};
    overflow: hidden;
`

export const StyledSearchInput = styled(Input)`
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

export const StyledList = styled(Input)`
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
`

export const UploadButton = styled(Button)`
    @media (max-width: 991.98px) {
        margin: 0 auto;
        display: block;
    }
`

export const LgCentered = styled.div`
    @media (max-width: 991.98px) {
        margin: 0 auto;
        display: block;
    }
`

export const SpacedRow = styled(Row)`
    margin-bottom: 20px;
`;

export const StyledPlus = styled(GoPlus)`
    vertical-align: top !important;
    opacity: 0.5;
    transition: opacity .2s;

    &:hover {
        opacity: 1;
        cursor: pointer;
    }
`;

export const HoverableTr = styled.tr`
    &:hover ${StyledTrash} {
        visibility: visible;
    }
`;

export const DownloadButton = styled.a`
    color: #FFF !important;

    &:hover {
        cursor: pointer;
    }
`;