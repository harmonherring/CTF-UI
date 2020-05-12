import React, {Component} from 'react';
import styled from 'styled-components';

const UpperSection = styled.div`
  background-color: #fff;
`;


class Challenge extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return(
            <>
                <UpperSection>
                    <h1>Title go Here</h1>
                    <hr />
                    <p>Description go here</p>
                </UpperSection>
                <div className="lowerSection">

                </div>
            </>
        );
    }
}

export default Challenge
