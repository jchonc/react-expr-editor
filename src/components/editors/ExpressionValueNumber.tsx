import * as React from 'react';

interface ExpressionValueNumberState {
}

interface ExpressionValueNumberProps {
    values: any[];
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueNumber extends React.Component<ExpressionValueNumberProps, ExpressionValueNumberState> {
    render() {
        let v = null;
        if (this.props.values && this.props.values.length) {
            v = this.props.values[0];
        }
        return (
            <input 
                type="Number" 
                className="expr-simple-value" 
                readOnly={this.props.readOnly}
                value={v} 
                onChange={(evt) => { this.props.onChange(evt.target.value); }}
            />
        );
    }
}

export default ExpressionValueNumber;