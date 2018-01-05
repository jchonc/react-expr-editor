import * as React from 'react';

interface ExpressionValueTextState {
}

interface ExpressionValueTextProps {
    value: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueText extends React.Component<ExpressionValueTextProps, ExpressionValueTextState> {

    render() {
        return (
            <input 
                type="text" 
                className="expr-simple-value" 
                readOnly={this.props.readOnly}
                value={this.props.value} 
                onChange={(evt) => { this.props.onChange(evt.target.value); }}
            />
        );
    }
}

export default ExpressionValueText;