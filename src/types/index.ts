import { observable } from 'mobx';
import { action } from 'mobx';
export type ExpressionType = 'logic' | 'compare';

export type ExpressionBooleanLogic = 'And' | 'Or';

export type ExpressionOperator = ExpressionBooleanLogic | 'Equal' | 'NotEqual' | 'IsBetween' | 'IsNotBetween' | 'is-one-of';

export type ExpressionOperandKind =
  'none' | 'text' | 'number' | 'date' | 'time' | 'datetime' | 'date-range' | 'pick' | 'multi-pick' | 'lookup';

export interface ExpressionOperand {
  name: ExpressionType;
}

export interface NodeOwner {
  addSimpleChild(node: AbstractNode): void;
  removeNode(node: AbstractNode): void;
  replaceNode(oldNode: AbstractNode, newNode: AbstractNode): void;
}

export abstract class AbstractNode {
  @observable name: 'logic' | 'compare'; // revisit later, move to instanceof later
  @observable isClone: boolean;
  @observable parentNode: NodeOwner;
  isValid: boolean = false;

  @action addSibling() {
    if (this.parentNode) {
      this.parentNode.addSimpleChild(new CompareNode());
    }
  }

  @action removeSelf() {
    this.parentNode.removeNode(this);
  }

  isDescedentOf(parentNode: AbstractNode): boolean {
    // do stuff
    return false;
  }

  @action replaceWithComplex(logic: ExpressionBooleanLogic) {
    const parent = this.parentNode;
    const newComplexNode = new LogicNode();

    newComplexNode.operator = logic;
    newComplexNode.operands.push(this);

    this.parentNode = newComplexNode;
    newComplexNode.parentNode = parent;

    parent.replaceNode(this, newComplexNode);

  }
}

export const validCtrlKind: string[] = [
  'none', 'text', 'number', 'date', 'time', 'datetime', 'date-range', 'pick', 'multi-pick', 'lookup'
];
export class CompareNode extends AbstractNode {
  // validate(): boolean {
  //   return ;
  // }

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

  getAllowedOperators(meta: any) {
    // gt; ge; lt; le; between; is-one-of; 
    let results = [
      { value: 'eq', label: 'equals to' },
      { value: 'ne', label: 'not equal to' }
    ];
    if (meta) {
      if (meta.attrCtrlType === 'picklist') {
        results.push({ value: 'is-one-of', label: 'is one of' });
      }
      if (meta.attrCtrlType === 'date') {
        results.push({ value: 'between', label: 'between' });
      }
    }
    return results;
  }

  getOperandKind(meta: any) {
    if (meta) {
      if (meta.attrCtrlType === 'date' && this.operator === 'IsBetween') {
        return 'date-range';
      }
      if (meta.attrCtrlType === 'picklist') {
        return (this.operator === 'is-one-of') ? 'multi-pick' : 'pick';
      }
      if (validCtrlKind.indexOf(meta.attrCtrlType) >= 0) {
        return meta.attrCtrlType;
      }
    }
    return 'none';
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

  replaceNode(oldNode: AbstractNode, newNode: AbstractNode): void {
    const idx = this.operands.indexOf(oldNode);
    if (idx >= 0) {
      this.operands[idx] = newNode;
    } else {
      this.operands.push(newNode);
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
          return simpleResult;
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
