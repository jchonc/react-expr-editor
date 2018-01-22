import * as React from 'react';
import { Input } from 'antd';
import { observer, inject } from 'mobx-react';
import { ExpressionStore } from '../../stores/ExpressionStore';

interface ExpressionValueTextState {
}

interface ExpressionValueTextProps {
    values: any[];
    readOnly: boolean;
    onChange: any;
    expressionStore?: ExpressionStore;

}

@inject('expressionStore')
@observer
class ExpressionValueText extends React.Component<ExpressionValueTextProps, ExpressionValueTextState> {

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
                onChange={(evt) => { this.props.onChange(evt.target.value); }}
            />
        );
    }
}

export default ExpressionValueText;