import * as React from 'react';
import Select from 'react-select';

interface ExpressionValueListState {
}

interface ExpressionValueListProps {
    value: any;
    options: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueList extends React.Component<ExpressionValueListProps, ExpressionValueListState> {

    render() {
        return (
            <Select 
                className="expr-simple-value"
                options={this.props.options}
                searchable={false}
                clearable={false}
                disabled={this.props.readOnly}
                value={this.props.value}
                onChange={(evt: any) => {this.props.onChange(evt.value); }}
            />
        );
    }
}

export default ExpressionValueList;