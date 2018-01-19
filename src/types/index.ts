import { ObservableMap } from "mobx";


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
  parent?: number;
  children?: number[];
}

export interface IExpressionStore {
  expression: IExpressionTreeNode;
  expressionMap: ObservableMap<IExpressionTreeNode>;
  moduleId: number;
  rootId: number;
  entityName: string;
  readonly: boolean;
  valid: boolean;
  knownMetaDictionary: any[];
  knownPickLists: any[];
  getNode: (nodeId: string) => IExpressionTreeNode | undefined;
  getMeta: (attrId: string) =>  IMetaDictionaryElement|undefined;
  addSimpleChild: (parentId: string) => void;
  validate: () => void;
  reveal: () => void;
  fetchStuff: () => Promise<void>;
  getAllowedOperators: (meta: any) => { value: string; label: string }[];
  getOperandKind: (meta: any, operator: any) => ExpressionOperandKind;
  metaLoaded: boolean;
}

export interface IMetaDictionaryElement { 
  attrId: string;
  attrCaption: string;
  attrDataType: string;
  attrCtrlType: string;
  attrCtrlParams: string;
}