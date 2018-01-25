import moment from 'moment';
import { ExpressionOperandKind } from '../types/index';

export default class ValidatorFactory {

    GetValidator(type: ExpressionOperandKind) {

        switch (type) {
            case 'number':
                return this.ValidateNumber;
            case 'date':
                return this.ValidateDate;
            case 'date-range':
                return this.ValidateDates;
            case 'multi-pick':
                return this.ValidateMultiPick;
            case 'pick':
            case 'text':
            default:
                return this.ValidateText;
        }
    }

    isNotEmpty(value: string): boolean {
        return !!value;
    }

    private ValidateText = (values: string[]) => {
        return (values.length) ? this.isNotEmpty(values[0]) : true;
    }

    private ValidateMultiPick = (values: string[]) => {
        let result = true;
        for (let i = 0; i < values.length; i++) {
            result = result && this.isNotEmpty(values[i]);
        }
        return result;
    }

    private ValidateNumber = (values: string[]) => {
        return this.isNotEmpty(values[0]) && !Number.isNaN(values[0] as any);
    }

    private ValidateDate = (values: any[]) => {
        return moment(values[0], 'YYYY-MM-DD').isValid();
    }

    private ValidateDates = (values: any[]) => {
        return (values.length === 2) &&
            moment(values[0], 'YYYY-MM-DD').isValid() &&
            moment(values[1], 'YYYY-MM-DD').isValid();
    }

}