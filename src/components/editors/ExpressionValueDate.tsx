import * as React from 'react';
import { DatePicker } from 'antd';

import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { ExpressionStore } from '../../stores/ExpressionStore';

interface ExpressionValueDateState {
    focused: boolean;
    date: moment.Moment | undefined;
}

interface ExpressionValueDateProps {
    values: any;
    readOnly: boolean;
    onChange: any;
    expressionStore?: ExpressionStore;

}
@inject('expressionStore')
@observer
class ExpressionValueDate extends React.Component<ExpressionValueDateProps, ExpressionValueDateState> {
    constructor(props: any) {
        super(props);
        this.onFocusChanged = this.onFocusChanged.bind(this);
        this.onDateChanged = this.onDateChanged.bind(this);

        let v;
        if (this.props.values && this.props.values.length) {
            v = props.values[0] ? moment(props.values[0]) : moment();
            if (!v.isValid) {
                v = undefined;
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
        this.props.onChange(d.format('YYYY-MM-DD'));
        this.setState({
            date: d
        });
    }
    render() {
        return (
            <DatePicker
                value={this.state.date}
                disabled={this.props.readOnly}

                // numberOfMonths={1}
                // isOutsideRange={() => false}
                // onFocusChange={this.onFocusChanged} 
                onChange={this.onDateChanged}
            />
        );
    }
}

export default ExpressionValueDate;