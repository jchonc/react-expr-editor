
export type ExpressionType = 'logic' | 'compare';

export type ExpressionOperator = 'And' | 'Or' | 'Equal' | 'NotEqual' | 'IsBetween' | 'IsNotBetween';

export type ExpressionOperandKind =
  'none' | 'text' | 'number' | 'date' | 'time' | 'datetime' | 'date-range' | 'pick' | 'multi-pick' | 'lookup';

export interface ExpressionOperand {
  name: ExpressionType;
}

export interface IExpressionTreeNode {
  name: 'logic' | 'compare';
  nodeId: number;
  operator: ExpressionOperator;
  operands?: IExpressionTreeNode[] | string[];
  attrId?: string;
  attrCaption?: string;
}

export interface IExpressionStore {
  expression: IExpressionTreeNode;
  moduleId: number;
  entityName: string;
  readonly: boolean;

  knownMetaDictionary: any[];
  knownPickLists: any[];
  addSimpleChild: () => void;
}