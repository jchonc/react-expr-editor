import * as React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

import { inject, observer } from 'mobx-react';
import { ExpressionStore } from '../../stores/ExpressionStore';

interface ExpressionValueDateRangeState {
    startDate: moment.Moment;
    endDate: moment.Moment;
}

interface ExpressionValueDateRangeProps {
    values: any;
    readOnly: boolean;
    onChange: any;
    expressionStore?: ExpressionStore;
}

@inject('expressionStore')
@observer
class ExpressionValueDateRange extends React.Component<ExpressionValueDateRangeProps, ExpressionValueDateRangeState> {

    constructor(props: any) {
        super(props);
        this.onChanged = this.onChanged.bind(this);
    }

    onChanged(date: [moment.Moment, moment.Moment], dateString: [string, string]) {
        this.props.onChange(dateString);
    }

    render() {
        const dates = this.props.values.map((s: string) => moment(s));
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