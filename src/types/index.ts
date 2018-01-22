import { ObservableMap } from 'mobx';
import { observable } from 'mobx';
import { action } from 'mobx/lib/api/action';
export type ExpressionType = 'logic' | 'compare';

export type ExpressionBooleanLogic = 'And' | 'Or';

export type ExpressionOperator = ExpressionBooleanLogic | 'Equal' | 'NotEqual' | 'IsBetween' | 'IsNotBetween';

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
  getMeta: (attrId: string) => IMetaDictionaryElement | undefined;
  addSimpleChild: (parentId: string) => void;
  removeChild: (node: IExpressionTreeNode) => void;
  validate: () => void;
  reveal: () => void;
  fetchStuff: () => Promise<void>;
  getAllowedOperators: (meta: any) => { value: string; label: string }[];
  getOperandKind: (meta: any, operator: any) => ExpressionOperandKind;
  replaceWithComplex: (logic: ExpressionBooleanLogic, node: IExpressionTreeNode) => void;
  metaLoaded: boolean;
}

export interface IMetaDictionaryElement {
  attrId: string;
  attrCaption: string;
  attrDataType: string;
  attrCtrlType: string;
  attrCtrlParams: string;
}



export interface NodeOwner {
  addSimpleChild(): void;
  removeNode(node: AbstractNode): void;
}

export class AbstractNode {
  name: string;
  parentNode: NodeOwner;

  @action addSibling() {
    if (this.parentNode) {
      this.parentNode.addSimpleChild();
    }
  }

  @action removeSelf() {
    this.parentNode.removeNode(this);
  }
}

export class CompareNode extends AbstractNode {

  @observable
  attrId: string;

  @observable
  attrCaption: string;

  @observable
  operator: string;

  @observable
  operands: string[];

  constructor() {
    super();
    this.operands = new Array<string>();
  }
}

export class LogicNode extends AbstractNode implements NodeOwner {
  @observable
  operator: string;

  @observable
  operands: AbstractNode[];

  constructor() {
    super();
    this.operands = new Array<AbstractNode>();
  }

  @action addSimpleChild() {
    this.operands.push(new CompareNode());
  }

  @action removeNode(node: AbstractNode) {
    const idx = this.operands.indexOf(node);
    if (idx >= 0) {
      this.operands.splice(idx, 1);
    }
  }
}

export class NodeFactory {
  static LoadExpression(jsonExpression: any): AbstractNode | null {
    if (jsonExpression && jsonExpression.name) {


      switch (jsonExpression.name) {
        case 'compare':
          let simpleResult = new CompareNode();
          simpleResult.name = jsonExpression.name;
          simpleResult.attrId = jsonExpression.attrId;
          simpleResult.attrCaption = jsonExpression.attrCaption;
          simpleResult.operator = jsonExpression.operator;
          if (jsonExpression.operands && jsonExpression.operands.length) {
            simpleResult.operands.push(...jsonExpression.operands);
          }
          break;
        case 'logic':
          let compositeResult = new LogicNode();
          compositeResult.name = jsonExpression.name;
          compositeResult.operator = jsonExpression.operator;
          if (jsonExpression.operands && jsonExpression.operands.length) {
            jsonExpression.operands.map(function (se: any) {
              const childExpression = NodeFactory.LoadExpression(se);
              if (childExpression) {
                childExpression.parentNode = compositeResult;
                compositeResult.operands.push(childExpression);
              }
            });
          }
          return compositeResult;
        default:
          break;
      }
    }
    return null;
  }
}
