import * as React from 'react';
import { Select } from 'antd';
import { observer } from 'mobx-react';
import { ObservableArray } from 'mobx/lib/types/observablearray';
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
    }

    render() {
        const values = (this.props.values as ObservableArray<string>).peek();
        const opts = (this.props.options as ObservableArray<string>).peek();
        return (
            <Select
                className="expr-simple-value"
                mode="multiple"
                disabled={this.props.readOnly}
                value={values}
                onChange={this.props.onChange}
            >
                {opts.map((o: any, n: number) => <Option key={n + 1} value={o.value}>{o.label}</Option>)}
            </Select>
        );
    }
}

export default ExpressionValueMultiList;