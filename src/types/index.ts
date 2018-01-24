export type ExpressionType = 'logic' | 'compare';

export type ExpressionBooleanLogic = 'And' | 'Or';

export type ExpressionOperator = ExpressionBooleanLogic | 'Equal' | 'NotEqual' | 'IsBetween' | 'IsNotBetween' | 'IsOneOf';

export type ExpressionOperandKind =
  'none' | 'text' | 'number' | 'date' | 'time' | 'datetime' | 'date-range' | 'pick' | 'multi-pick' | 'lookup';

export interface ExpressionOperand {
  name: ExpressionType;
}

export const validCtrlKind: string[] = [
  'none', 'text', 'number', 'date', 'time', 'datetime', 'date-range', 'pick', 'multi-pick', 'lookup'
];

export * from './AbstractNode';
export * from './Operators';