import * as React from 'react';

interface ExpressionValueNumberState {
}

interface ExpressionValueNumberProps {
    value: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueNumber extends React.Component<ExpressionValueNumberProps, ExpressionValueNumberState> {

    render() {
        return (
            <input 
                type="Number" 
                className="expr-simple-value" 
                readOnly={this.props.readOnly}
                value={this.props.value} 
                onChange={(evt) => { this.props.onChange(evt.target.value); }}
            />
        );
    }
}

export default ExpressionValueNumber;