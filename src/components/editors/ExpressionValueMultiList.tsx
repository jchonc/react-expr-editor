import * as React from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react';
const Option = Select.Option;

interface ExpressionValueMultiListProps {
    values: any;
    options: any;
    readOnly: boolean;
    onChange: any;
}

@observer
class ExpressionValueMultiList extends React.Component<ExpressionValueMultiListProps> {

    constructor(props: any) {
        super(props);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    onSelectionChanged(items: any) {
        const results = items.map((item: any) => item.value);
        this.props.onChange(results);
    }

    render() {
        return (
            <Select
                className="expr-simple-value"
                mode="multiple"
                disabled={this.props.readOnly}
                value={this.props.values}
                onChange={this.onSelectionChanged}
            >
                {this.props.options.map((o: any) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
            </Select>
        );
    }
}

export default ExpressionValueMultiList;