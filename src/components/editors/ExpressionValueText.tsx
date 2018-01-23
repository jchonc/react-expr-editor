import * as React from 'react';
import { Input } from 'antd';
import { observer } from 'mobx-react';

interface ExpressionValueTextProps {
    values: any[];
    readOnly: boolean;
    onChange: any;
}

@observer
class ExpressionValueText extends React.Component<ExpressionValueTextProps> {

    render() {
        let v = '';
        if (this.props.values && this.props.values.length) {
            v = this.props.values[0];
        }
        return (
            <Input 
                type="text"
                className="expr-simple-value" 
                readOnly={this.props.readOnly}
                value={v} 
                onChange={(evt) => { if (!this.props.readOnly) { this.props.onChange([evt.target.value]); } }}
            />
        );
    }
}

export default ExpressionValueText;