import { ObservableMap } from 'mobx';
import { observable } from 'mobx';
import { action } from 'mobx/lib/api/action';
import ExpressionItem from '../components/expressionItem';
export type ExpressionType = 'logic' | 'compare';

export type ExpressionBooleanLogic = 'And' | 'Or';

export type ExpressionOperator = ExpressionBooleanLogic | 'Equal' | 'NotEqual' | 'IsBetween' | 'IsNotBetween';

export type ExpressionOperandKind =
  'none' | 'text' | 'number' | 'date' | 'time' | 'datetime' | 'date-range' | 'pick' | 'multi-pick' | 'lookup';

export interface ExpressionOperand {
  name: ExpressionType;
}

export type IExpressionTreeNode = AbstractNode | null | {
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
};

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
  isAncestor(connector: any): boolean;
}

export class AbstractNode {
  @observable name: 'logic' | 'compare';
  @observable isClone: boolean;
  @observable parentNode: NodeOwner;

  @action addSibling() {
    if (this.parentNode) {
      this.parentNode.addSimpleChild();
    }
  }

  @action removeSelf() {
    this.parentNode.removeNode(this);
  }

  @action replaceWithComplex(logic: ExpressionBooleanLogic) {
    // do stuff;
  }

  @action isAncestor(connector: any) {
    // do stuff
  }
}

export class CompareNode extends AbstractNode {

  @observable
  attrId: string;

  @observable
  attrCaption: string;

  @observable
  operator: ExpressionOperator;

  @observable
  operands: string[];

  constructor() {
    super();
    this.operands = new Array<string>();
  }
}

export class LogicNode extends AbstractNode implements NodeOwner {
  @observable
  operator: ExpressionBooleanLogic;

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
