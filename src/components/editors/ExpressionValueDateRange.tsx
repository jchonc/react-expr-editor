import * as React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { observer } from 'mobx-react';

interface ExpressionValueDateRangeProps {
    values: any;
    readOnly: boolean;
    onChange: any;
}

@observer
class ExpressionValueDateRange extends React.Component<ExpressionValueDateRangeProps> {

    constructor(props: any) {
        super(props);
        this.onChanged = this.onChanged.bind(this);
    }

    onChanged(date: [moment.Moment, moment.Moment], dateString: [string, string]) {
        this.props.onChange(dateString);
    }

    render() {
        const dates = this.props.values.map((s: string) => moment(s, 'YYYY-MM-DD'));
        return (
            <RangePicker 
                disabled={this.props.readOnly}
                value={dates}
                onChange={this.onChanged}
            />
        );
    }
}

export default ExpressionValueDateRange;