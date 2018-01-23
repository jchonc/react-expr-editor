import * as React from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react';
const Option = Select.Option;

interface ExpressionValueListProps {
    values: any[];
    options: any;
    readOnly: boolean;
    onChange: any;
}

@observer
class ExpressionValueList extends React.Component<ExpressionValueListProps> {

    render() {
        let v = '';
        if (this.props.values && this.props.values.length) {
            v = this.props.values[0];
        }
        return (
            <Select
                className="expr-simple-value"
                disabled={this.props.readOnly}
                value={v}
                onChange={(value: any) => { this.props.onChange([value]); }}
            >
                {this.props.options.map((o: any) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
            </Select>
        );
    }
}

export default ExpressionValueList;