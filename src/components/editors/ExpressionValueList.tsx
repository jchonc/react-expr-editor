import * as React from 'react';
import { Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { IExpressionStore } from '../../types/index';
const Option = Select.Option;

interface ExpressionValueListState {
}

interface ExpressionValueListProps {
    values: any[];
    options: any;
    readOnly: boolean;
    onChange: any;
    expressionStore?: IExpressionStore;

}
@inject('expressionStore')
@observer
class ExpressionValueList extends React.Component<ExpressionValueListProps, ExpressionValueListState> {

    render() {
        let v = '';
        if (this.props.values && this.props.values.length) {
            v = this.props.values[0];
        }
        return (
            <Select
                className="expr-simple-value"
                // searchable={false}
                // clearable={false}
                disabled={this.props.readOnly}
                value={v}
                onChange={(value: any) => { this.props.onChange(value); }}
            >
                {this.props.options.map((o: any) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
            </Select>
        );
    }
}

export default ExpressionValueList;