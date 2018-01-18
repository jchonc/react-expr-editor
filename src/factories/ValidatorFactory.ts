import moment from 'moment';

export default class ValidatorFactory {

    GetValidator(type: string){

        switch (type) {
            case 'number':
                return this.ValidateNumber;
            case 'date':
                return this.ValidateDate;
            case 'date-range':
                return
            case 'multi-pick':
                return this.ValidateMultiPick;
            case 'pick': 
            case 'text': 
            default:
                return this.ValidateText;
        }
    }

    isNotEmpty(value: any): boolean  {
        return !!value;
    }    

    private ValidateText = (values: any[]) => {
        return this.isNotEmpty(values[0]);
    }

    private ValidateMultiPick = (values: any[]) => {
        let result = true;
        for (let i = 0; i < values.length; i++){
            result = result && this.ValidateText(values[i]);
        }
        return result;
    }

    private ValidateNumber = (values: any[]) => {
        return this.isNotEmpty(values[0]) && !isNaN(values[0]);
    }

    private ValidateDate = (values: any[]) => {
        return moment(values[0], 'YYY-MM-DD').isValid();
    }
}