import * as React from 'react';

interface ExpressionValueTextState {
}

interface ExpressionValueTextProps {
    value: any;
    onChange: any;
}

class ExpressionValueText extends React.Component<ExpressionValueTextProps, ExpressionValueTextState> {

    render() {
        return (
            <input 
                type="text" 
                className="form-control" 
                value={this.props.value} 
                onChange={(evt) => { this.props.onChange(evt.target.value); }}
            />
        );
    }
}

export default ExpressionValueText;