import { observable, computed } from 'mobx';
import { action } from 'mobx';
import ExpressionStore from '../stores/ExpressionStore';
import ValidatorFactory from '../factories/ValidatorFactory';

export type ExpressionType = 'logic' | 'compare';

export type ExpressionBooleanLogic = 'And' | 'Or';

export type ExpressionOperator = ExpressionBooleanLogic | 'Equal' | 'NotEqual' | 'IsBetween' | 'IsNotBetween' | 'IsOneOf';

export type ExpressionOperandKind =
  'none' | 'text' | 'number' | 'date' | 'time' | 'datetime' | 'date-range' | 'pick' | 'multi-pick' | 'lookup';

export interface ExpressionOperand {
  name: ExpressionType;
}

export interface NodeOwner {
  addSimpleChild(node: AbstractNode): void;
  removeNode(node: AbstractNode): void;
  replaceNode(oldNode: AbstractNode, newNode: AbstractNode): void;
  isDescedentOf(parentNode: AbstractNode): boolean;
}

export abstract class AbstractNode {
  @observable isClone: boolean;
  @observable parentNode?: NodeOwner;
  abstract isValid: boolean;

  constructor(parent?: NodeOwner) {
    this.parentNode = parent;
  }

  @action addSibling() {
    if (this.parentNode) {
      this.parentNode.addSimpleChild(new CompareNode(this.parentNode));
    }
  }

  @action removeSelf() {
    if (this.parentNode) {
      this.parentNode.removeNode(this);
    }
  }

  isDescedentOf(parentNode: AbstractNode): boolean {
    return this === parentNode ? true : this.parentNode!.isDescedentOf(parentNode);
  }

  @action replaceWithComplex(logic: ExpressionBooleanLogic) {
    const parent = this.parentNode;
    if (parent) {
      const newComplexNode = new LogicNode(parent);
      newComplexNode.operator = logic;
      newComplexNode.operands.push(this);
      this.parentNode = newComplexNode;
      parent.replaceNode(this, newComplexNode);
    }
  }

}

export const validCtrlKind: string[] = [
  'none', 'text', 'number', 'date', 'time', 'datetime', 'date-range', 'pick', 'multi-pick', 'lookup'
];
export class CompareNode extends AbstractNode {

  @observable
  attrId: string;

  @observable
  attrCaption: string;

  @observable
  operator: ExpressionOperator;

  @observable
  operands: string[];

  constructor(parent?: NodeOwner) {
    super(parent);
    this.operands = new Array<string>();
  }

  getAllowedOperators(meta: any) {
    let results = [
      { value: 'Equal', label: 'equals to' },
      { value: 'NotEqual', label: 'not equal to' }
    ];
    if (meta) {
      if (meta.attrCtrlType === 'picklist') {
        results.push({ value: 'IsOneOf', label: 'is one of' });
      }
      if (meta.attrCtrlType === 'date') {
        results.push({ value: 'IsBetween', label: 'between' });
        results.push({ value: 'IsNotBetween', label: 'is not between' });
      }
    }
    return results;
  }

  getOperandKind(meta: any) {
    if (meta) {
      if (meta.attrCtrlType === 'date' && ( this.operator === 'IsBetween' || this.operator === 'IsNotBetween' )) {
        return 'date-range';
      }
      if (meta.attrCtrlType === 'picklist') {
        return (this.operator === 'IsOneOf') ? 'multi-pick' : 'pick';
      }
      if (validCtrlKind.indexOf(meta.attrCtrlType) >= 0) {
        return meta.attrCtrlType;
      }
    }
    return 'none';
  }

  @computed get meta(): any {
    return ExpressionStore.getMeta(this.attrId);
  }

  @computed get validator(): any {
    return new ValidatorFactory().GetValidator(this.getOperandKind(this.meta));
  }

  @computed get isValid(): boolean {
    return this.validator(this.operands);
  }
}

export class LogicNode extends AbstractNode implements NodeOwner {

  @observable
  operator: ExpressionBooleanLogic;

  @observable
  operands: AbstractNode[];

  constructor(parent?: NodeOwner) {
    super(parent);
    this.operands = new Array<AbstractNode>();
  }

  @action addSimpleChild() {
    const node = new CompareNode(this);
    this.operands.push(node);
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

  @computed get isValid(): boolean {
    return this.operands.every((x) => x.isValid);
  }
}

export class NodeFactory {
  static LoadExpression(jsonExpression: any): AbstractNode | null {
    if (jsonExpression && jsonExpression.name) {

      switch (jsonExpression.name) {
        case 'compare':
          let simpleResult = new CompareNode(undefined);
          simpleResult.attrId = jsonExpression.attrId;
          simpleResult.attrCaption = jsonExpression.attrCaption;
          simpleResult.operator = jsonExpression.operator;
          if (jsonExpression.operands && jsonExpression.operands.length) {
            simpleResult.operands.push(...jsonExpression.operands);
          }
          return simpleResult;
        case 'logic':
          let compositeResult = new LogicNode(undefined);
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

  static SaveExpression( node: AbstractNode | null ): any | null {
    if ( node ) {
      if ( node instanceof CompareNode ) {
        const sn = node as CompareNode;
        return {
          name: 'compare',
          attrId: sn.attrId,
          attrCaption: sn.attrCaption,
          operator: sn.operator,
          operands: sn.operands
        };
      }
      else {
        const cn = node as LogicNode;
        return {
          name: 'logic',
          operator: cn.operator,
          operands: cn.operands.map((c) => NodeFactory.SaveExpression(c))
        };
      }
    }
    return null;
  }
  
}
