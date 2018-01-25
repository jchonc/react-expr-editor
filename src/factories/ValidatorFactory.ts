import moment from 'moment';
import { ExpressionOperandKind } from '../types/index';

export default class ValidatorFactory {

    static GetValidator(type: ExpressionOperandKind) {

        switch (type) {
            case 'number':
                return ValidatorFactory.validateNumber;
            case 'date':
                return ValidatorFactory.validateDate;
            case 'date-range':
                return ValidatorFactory.validateDates;
            case 'multi-pick':
                return ValidatorFactory.validateMultiPick;
            case 'pick':
            case 'text':
            default:
                return ValidatorFactory.validateText;
        }
    }

    static isNotEmpty(value: string): boolean {
        // return !!value; // doesn't work for '0'
        return value !== undefined && value !== null && value.length > 0 && value !== '';
    }

    private static validateText = (values: string[]) => {
        return ValidatorFactory.isNotEmpty(values[0]);
    }

    private static validateMultiPick = (values: string[]) => {
        return values.every((v) => ValidatorFactory.isNotEmpty(v));
    }

    private static validateNumber = (values: string[]) => {
        return values.every((v) => ValidatorFactory.isNotEmpty(v) && !isNaN(v as any));
    }

    private static validateDate = (values: any[], dateFormat: string = 'YYYY-MM-DD') => {
        return values.every((v) => moment(v, dateFormat).isValid());
    }

    private static validateDates = (values: any[], dateFormat: string = 'YYYY-MM-DD') => {
        return values.every((v) => moment(v, dateFormat).isValid());
    }

}