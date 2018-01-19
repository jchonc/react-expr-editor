import * as React from 'react';
import { DatePicker } from 'antd';

import moment from 'moment';

interface ExpressionValueDateState {
    date: moment.Moment | undefined;
}

interface ExpressionValueDateProps {
    values: any;
    readOnly: boolean;
    onChange: any;
}

class ExpressionValueDate extends React.Component<ExpressionValueDateProps, ExpressionValueDateState> {

    constructor(props: any) {
        super(props);
        this.onDateChanged = this.onDateChanged.bind(this);
        let v;
        if (this.props.values && this.props.values.length) {
            v = moment(props.values[0]);
            if (!v.isValid) {
                v = undefined;
            }
        }
        this.state = {
            date: v
        };
    }

    onDateChanged(d: moment.Moment) {
        if (!this.props.readOnly) {
            if (d) {
                this.props.onChange([d.format('YYYY-MM-DD')]);
                this.setState({
                    date: d
                });
            }
        }
    }

    render() {
        return (
            <DatePicker
                value={this.state.date}
                disabled={this.props.readOnly}
                onChange={this.onDateChanged}
            />
        );
    }
}

export default ExpressionValueDate;