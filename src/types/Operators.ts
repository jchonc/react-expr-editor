const basicTextOps = [
    {value: 'EQUALS', label: 'equals'},
    {value: 'NOT_EQUALS', label: 'does not equal'},
    {value: 'GREATER_THAN', label: 'is greater than'},
    {value: 'GREATER_EQUALS', label: 'is greater than or equal to'},
    {value: 'LESS_THAN', label: 'is less than'},
    {value: 'LESS_EQUALS', label: 'is less than or equal to'},
    {value: 'BEGINS_WITH', label: 'begins with'},
    {value: 'NOT_BEGINS_WITH', label: 'does not begin with'},
    {value: 'ENDS_WITH', label: 'ends with'},
    {value: 'NOT_ENDS_WITH', label: 'does not end with'},
    {value: 'CONTAINS', label: 'contains'},
    {value: 'NOT_CONTAINS', label: 'does not contain'},
    {value: 'ONE_OF', label: 'is one of'},
    {value: 'NOT_ONE_OF', label: 'is not one of'},
    {value: 'IS_NULL', label: 'is empty' },
    {value: 'IS_NOT_NULL', label: 'is not empty'}
];

const basicDateTimeOps = [
    {value: 'EQUALS_IS', label: 'is'},
    {value: 'NOT_EQUALS_IS', label: 'is not'},
    {value: 'GREATER_THAN_AFTER', label: 'is after'},
    {value: 'GREATER_EQUALS_AFTER', label: 'is on or after'},
    {value: 'LESS_THAN_BEFORE', label: 'is before'},
    {value: 'LESS_EQUALS_BEFORE', label: 'is on or before'},
    {value: 'BETWEEN', label: 'is between'},
    {value: 'NOT_BETWEEN', label: 'is not between'},
    {value: 'IS_NULL', label: 'is empty' },
    {value: 'IS_NOT_NULL', label: 'is not empty'},
    {value: 'DURING_THE_CURRENT', label: 'is during the current'},
    {value: 'DURING_THE_LAST', label: 'is during the last'},
    {value: 'DURING_THE_NEXT', label: 'is during the next'}
];

export const Operators = {
    'text': basicTextOps,
    'number': basicTextOps,
    'picklist': basicTextOps,
    'multi-pick': basicTextOps,
    'date': basicDateTimeOps,
    'date-range': basicDateTimeOps,
    'time': basicDateTimeOps,
};