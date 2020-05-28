import React from 'react'
import { Prism } from 'react-syntax-highlighter'
import { atomDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism'

class CodeBlock extends React.PureComponent {
    render() {
        const { language, value } = this.props;
        return (
            <Prism language={language} style={style}>
                {value}
            </Prism>
        );
    }
}

export default CodeBlock