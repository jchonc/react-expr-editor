import * as React from 'react';
import { Select } from 'antd';
const Option = Select.Option;

interface ExpressionValueMultiListState {
}

interface ExpressionValueMultiListProps {
    values: any;
    options: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueMultiList extends React.Component<ExpressionValueMultiListProps, ExpressionValueMultiListState> {

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
                // options={this.props.options}
                // multi={true}
                // searchable={false}
                // clearable={false}
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