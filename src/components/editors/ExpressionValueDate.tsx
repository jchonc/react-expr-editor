import * as React from 'react';
import { DatePicker } from 'antd';

import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { ExpressionStore } from '../../stores/ExpressionStore';

interface ExpressionValueDateState {
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
        this.onDateChanged = this.onDateChanged.bind(this);
    }
    onDateChanged(d: moment.Moment, ds: string) {
        this.props.onChange([ds]);
    }
    render() {
        let v;
        const props = this.props;
        if (props.values && props.values.length) {
            v = props.values[0] ? moment(props.values[0]) : moment();
            if (!v.isValid) {
                v = undefined;
            }
        }
        return (
            <DatePicker
                value={v}
                disabled={this.props.readOnly}
                onChange={this.onDateChanged}
            />
        );
    }
}

export default ExpressionValueDate;