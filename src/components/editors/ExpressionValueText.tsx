import * as React from 'react';
import { Input } from 'antd';

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
        if (this.props.values && this.props.values.length) {
            v = this.props.values[0];
        }
        const evtHandler = (this.props.readOnly) ? () => undefined : this.props.onChange;
        return (
            <Input 
                type="text"
                className="expr-simple-value" 
                readOnly={this.props.readOnly}
                value={v} 
                onChange={(e) => { evtHandler([e.target.value]); }}
            />
        );
    }
}

export default ExpressionValueText;