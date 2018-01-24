import * as React from 'react';
import { InputNumber } from 'antd';
import { observer } from 'mobx-react';

interface ExpressionValueNumberProps {
    values: any[];
    readOnly: boolean;
    onChange: any;
}

@observer
class ExpressionValueNumber extends React.Component<ExpressionValueNumberProps> {
    render() {
        let v = null;
        if (this.props.values && this.props.values.length) {
            v = this.props.values[0];
        }
        return (
            <InputNumber 
                className="expr-simple-value" 
                disabled={this.props.readOnly}
                value={v} 
                onChange={(value: any) => { this.props.onChange([value]); }}
            />
        );
    }
}

export default ExpressionValueNumber;