import * as React from 'react';
import Select from 'react-select';

interface ExpressionValueListState {
}

interface ExpressionValueListProps {
    values: any[];
    options: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueList extends React.Component<ExpressionValueListProps, ExpressionValueListState> {

    render() {
        let v = '';
        if (this.props.values && this.props.values.length) {
            v = this.props.values[0];
        }
        return (
            <Select 
                className="expr-simple-value"
                options={this.props.options}
                searchable={false}
                clearable={false}
                disabled={this.props.readOnly}
                value={v}
                onChange={(evt: any) => {this.props.onChange(evt.value); }}
            />
        );
    }
}

export default ExpressionValueList;