import * as React from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

interface ExpressionValueDateState {
    focused: boolean;
    date: moment.Moment | null;
}

interface ExpressionValueDateProps {
    values: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueDate extends React.Component<ExpressionValueDateProps, ExpressionValueDateState> {

    constructor(props: any) {
        super(props);
        this.onFocusChanged = this.onFocusChanged.bind(this);
        this.onDateChanged = this.onDateChanged.bind(this);

        let v = null;
        if (this.props.values && this.props.values.length) {
            v = moment(props.values[0]);
            if (!v.isValid) {
                v = null;
            }
        }
        this.state = {
            focused: false,
            date: v
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