import { observable, action, computed } from 'mobx';
import { ExpressionBooleanLogic, ExpressionOperator, validCtrlKind, Operators } from './index';
import ExpressionStore from '../stores/ExpressionStore';
import ValidatorFactory from '../factories/ValidatorFactory';

export interface NodeOwner {
    addSimpleChild(node: AbstractNode): void;
    removeNode(node: AbstractNode): void;
    replaceNode(oldNode: AbstractNode, newNode: AbstractNode): void;
    isDescedentOf(parentNode: AbstractNode): boolean;
}

export abstract class AbstractNode {
    @observable
    isClone: boolean;

    @observable
    parentNode?: NodeOwner;

    abstract isValid: boolean;

    constructor(parent?: NodeOwner) {
        if (parent) {
            this.parentNode = parent;
        }
    }

    @action
    toggleIsClone(value: boolean) {
        this.isClone = value;
    }

    @action
    addSibling() {
        if (this.parentNode) {
            this.parentNode.addSimpleChild(new CompareNode(this.parentNode));
        }
    }

    @action
    removeSelf() {
        if (this.parentNode) {
            this.parentNode.removeNode(this);
        }
    }

    isDescedentOf(parentNode: AbstractNode): boolean {
        return this === parentNode ? true : this.parentNode!.isDescedentOf(parentNode);
    }

    @action
    replaceWithComplex(logic: ExpressionBooleanLogic) {
        const parent = this.parentNode;
        if (parent) {
            const newComplexNode = new LogicNode(parent);
            newComplexNode.operator = logic;
            newComplexNode.operands.push(this);
            newComplexNode.operands.push(new CompareNode(newComplexNode));
            this.parentNode = newComplexNode;
            parent.replaceNode(this, newComplexNode);
        }
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

    constructor(parent?: NodeOwner) {
        super(parent);
        this.operands = new Array<string>();
    }

    getAllowedOperators(meta: any) {
        if (meta){
            return Operators[meta.attrCtrlType];
        }
        return [{value: '', label: ''}];
        
    }

    getOperandKind(meta: any) {
        if (meta) {
            if (meta.attrCtrlType === 'date' && (this.operator === 'IsBetween' || this.operator === 'IsNotBetween')) {
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

    @action
    setMeta(elmId: string, meta: any): void {
        this.attrId = elmId;
        this.attrCaption = meta.attrCaption;
        this.operands = ['', ''];
    }

    @action
    setValues(values: string[]) {
        this.operands = observable(values);
    }

    @action
    setOperator(operator: ExpressionOperator) {
        this.operator = operator;
    }

    @action
    copyLine() {
        let newNode = new CompareNode(this.parentNode);
        newNode.attrId = this.attrId;
        newNode.attrCaption = this.attrCaption;
        newNode.operator = this.operator;
        if (this.operands && this.operands.length) {
            newNode.operands.push(...this.operands);
        }
        let index = (this.parentNode as LogicNode).operands.findIndex(n => n === this);
        (this.parentNode as LogicNode).operands.splice(index, 0, newNode);
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

    @action
    setOperator(operator: ExpressionBooleanLogic) {
        this.operator = operator;
    }

    @action
    removeOperandAt(index: number) {
        this.operands!.splice(index, 1);
    }

    @action
    addOperandAt(index: number, newOperand: any) {
        this.operands.splice(index, 0, newOperand);
        newOperand.parentNode = this;
    }

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

    @action
    copyGroup() {
        let newNode = new LogicNode(this.parentNode);
        newNode.operator = this.operator;
        if (this.operands && this.operands.length) {
            this.operands.map(function (se: any) {
                se.name = se instanceof LogicNode ? 'logic' : 'compare';
                const childExpression = NodeFactory.LoadExpression(se);
                if (childExpression) {
                    (childExpression.parentNode as LogicNode) = newNode;
                    newNode.operands.push(childExpression);
                }
            });
        }
        if (this.isRoot() && this.operands && this.operands.length) {
            this.operands.push(newNode);
        } else {
            let index = (this.parentNode as LogicNode).operands.findIndex(n => n === this);
            (this.parentNode as LogicNode).operands.splice(index, 0, newNode);
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

    isRoot() {
        return !(this.parentNode instanceof LogicNode);
    }

    @computed get isValid(): boolean {
        if (this.operands && this.operands.length) {
            return this.operands.every((x) => x!.isValid);
        } else {
            return true;
        }
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

    static SaveExpression(node: AbstractNode | null): any | null {
        if (node) {
            if (node instanceof CompareNode) {
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