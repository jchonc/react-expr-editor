import * as React from 'react';

interface ExpressionValueTextState {
}

interface ExpressionValueTextProps {
    values: any[];
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueText extends React.Component<ExpressionValueTextProps, ExpressionValueTextState> {

    render() {
        let v = '';
        if ( this.props.values && this.props.values.length ) {
            v = this.props.values[0];
        }
        return (
            <input 
                type="text" 
                className="expr-simple-value" 
                readOnly={this.props.readOnly}
                value={v} 
                onChange={(evt) => { this.props.onChange(evt.target.value); }}
            />
        );
    }
}

export default ExpressionValueText;