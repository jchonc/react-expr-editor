import * as React from 'react';
import { InputNumber } from 'antd';
import { inject, observer } from 'mobx-react';
import { IExpressionStore } from '../../types/index';

interface ExpressionValueNumberState {
}

interface ExpressionValueNumberProps {
    values: any[];
    readOnly: boolean;
    onChange: any;
    expressionStore?: IExpressionStore;

}
@inject('expressionStore')
@observer
class ExpressionValueNumber extends React.Component<ExpressionValueNumberProps, ExpressionValueNumberState> {
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
                onChange={(value) => { this.props.onChange(value); }}
            />
        );
    }
}

export default ExpressionValueNumber;