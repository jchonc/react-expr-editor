import { NodeFactory, AbstractNode } from '../types/index';
import { observable, action } from 'mobx';
import utilityStore from './UtilityStore';

export class ExpressionStore {
    @observable valid: boolean = true;
    @observable expression: AbstractNode | null;

    entityName: string;
    moduleId: number;
    readonly: boolean;

    @action setExpression(expression: any) {
        this.expression = NodeFactory.LoadExpression(expression);
    }

    @action reveal() {
        const result = JSON.stringify(NodeFactory.SaveExpression(this.expression));
        document.getElementById('expr_value')!.innerHTML = result;
    }

    @action clear() {
        this.setExpression({
            name: 'compare',
            isClone: false,
            operands: []
        });
        utilityStore.fetchDictionary(this.moduleId, this.entityName)
            .then(() => {
                utilityStore.fetchPicklists(utilityStore.usedLists);
            });
    }

    @action getMeta(attrId: string): any | undefined {
        if (!attrId) {
            return undefined;
        }
        return utilityStore.dictionary.find(function (elm: any) {
            return elm.attrId === attrId;
        });
    }
}

export default new ExpressionStore();