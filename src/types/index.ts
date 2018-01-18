
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
  isValid?: boolean;
  isClone: boolean;
  parent?: IExpressionTreeNode;
  children?: IExpressionTreeNode[];
}

export interface IExpressionStore {
  expression: IExpressionTreeNode;
  moduleId: number;
  entityName: string;
  readonly: boolean;
  valid: boolean;
  knownMetaDictionary: any[];
  knownPickLists: any[];
  getNode: (nodeId: string) => IExpressionTreeNode|undefined;
  addSimpleChild: () => void;
  validate: () => void;
  reveal: () => void;
  fetchStuff: () => Promise<void>;
  metaLoaded: boolean;
}
