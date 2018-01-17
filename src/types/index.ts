
export type ExpressionType = 'logic' | 'compare';

export type ExpressionOperator = 'And' | 'Or' | 'Equal' | 'NotEqual' | 'IsBetween' | 'IsNotBetween';

export type ExpressionOperandKind = 
    'none' | 'text' | 'number' | 'date' | 'time' | 'datetime' | 'date-range' | 'pick' | 'multi-pick' | 'lookup';

export interface ExpressionOperand {
  name: ExpressionType;
}

export type Expression = {
  name: 'logic' | 'compare',
  operator: ExpressionOperator,
  operands?: Expression[] | string[],
  attrId?: string,
  attrCaption?: string
};
