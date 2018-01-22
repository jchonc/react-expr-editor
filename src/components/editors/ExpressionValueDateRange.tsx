import * as React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import { inject, observer } from 'mobx-react';
import { ExpressionStore } from '../../stores/ExpressionStore';

interface ExpressionValueDateRangeState {
    focusedInput: any;
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
        this.onStartChanged = this.onStartChanged.bind(this);
        this.onEndChanged = this.onEndChanged.bind(this);
        this.state = {
            focusedInput: null,
            startDate: moment(props.values[0]),
            endDate: moment(props.values[1])
        };
    }

    onStartChanged(startDate: moment.Moment) {
        this.props.onChange([startDate, this.state.endDate]);
        this.setState({
            startDate: startDate,
        });
    }

    onEndChanged(endDate: moment.Moment) {
        this.props.onChange([this.state.startDate, endDate]);
        this.setState({
            endDate: endDate
        });
    }

    render() {
        return (
            // <DateRangePicker
            //     startDateId="START_DATE"
            //     endDateId="END_DATE"
            //     startDate={this.state.startDate} 
            //     endDate={this.state.endDate}
            //     readOnly={this.props.readOnly}
            //     focusedInput={this.state.focusedInput} 
            //     onFocusChange={focusedInput => this.setState({ focusedInput })}
            //     isOutsideRange={() => false}
            //     onDatesChange={this.onDatesChanged}
            // />
            <div>
                <DatePicker
                    // disabledDate={this.disabledStartDate}
                    format="YYYY-MM-DD HH:mm:ss"
                    value={this.state.startDate}
                    placeholder="Start"
                    onChange={this.onStartChanged}
                // onOpenChange={this.handleStartOpenChange}
                />
                <DatePicker
                    // disabledDate={this.disabledEndDate}
                    format="YYYY-MM-DD HH:mm:ss"
                    value={this.state.endDate}
                    placeholder="End"
                    onChange={this.onEndChanged}
                // open={endOpen}
                // onOpenChange={this.handleEndOpenChange}
                />
            </div>
        );
    }
}

export default ExpressionValueDateRange;