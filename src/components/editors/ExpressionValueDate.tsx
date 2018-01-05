import * as React from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

interface ExpressionValueDateState {
    focused: boolean;
    date: moment.Moment;
}

interface ExpressionValueDateProps {
    value: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueDate extends React.Component<ExpressionValueDateProps, ExpressionValueDateState> {

    constructor(props: any) {
        super(props);
        this.onFocusChanged = this.onFocusChanged.bind(this);
        this.onDateChanged = this.onDateChanged.bind(this);
        this.state = {
            focused: false,
            date: moment(props.value)
        };
    }

    onFocusChanged(f: any) {
        this.setState(f);
    }

    onDateChanged(d: moment.Moment) {
        this.props.onChange([d.format('YYYY-MM-DD')]);
        this.setState({
            date: d
        });
    }

    render() {
        return (
            <SingleDatePicker
                id="sdp"
                date={this.state.date} 
                readOnly={this.props.readOnly}
                focused={this.state.focused} 
                numberOfMonths={1}
                isOutsideRange={() => false}
                onFocusChange={this.onFocusChanged} 
                onDateChange={this.onDateChanged}
            />
        );
    }
}

export default ExpressionValueDate;