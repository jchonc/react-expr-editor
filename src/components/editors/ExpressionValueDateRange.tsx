import * as React from 'react';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';

import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';

interface ExpressionValueDateRangeState {
    focusedInput: any;
    startDate: moment.Moment;
    endDate: moment.Moment;
}

interface ExpressionValueDateRangeProps {
    values: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueDateRange extends React.Component<ExpressionValueDateRangeProps, ExpressionValueDateRangeState> {

    constructor(props: any) {
        super(props);
        this.onDatesChanged = this.onDatesChanged.bind(this);
        this.state = {
            focusedInput: null,
            startDate: moment(props.values[0]),
            endDate: moment(props.values[1])
        };
    }

    onDatesChanged( arg: {startDate: moment.Moment, endDate: moment.Moment}  ) {
        this.props.onChange([arg.startDate.format('YYYY-MM-DD'), arg.endDate.format('YYYY-MM-DD')]);
        this.setState({
            startDate: arg.startDate,
            endDate: arg.endDate
        });
    }

    render() {
        return (
            <DateRangePicker
                startDateId="START_DATE"
                endDateId="END_DATE"
                startDate={this.state.startDate} 
                endDate={this.state.endDate}
                readOnly={this.props.readOnly}
                focusedInput={this.state.focusedInput} 
                onFocusChange={focusedInput => this.setState({ focusedInput })}
                isOutsideRange={() => false}
                onDatesChange={this.onDatesChanged}
            />
        );
    }
}

export default ExpressionValueDateRange;