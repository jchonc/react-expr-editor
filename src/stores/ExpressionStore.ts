import { NodeFactory, AbstractNode } from '../types/index';
import { observable, action, IReactionDisposer } from 'mobx';
import utilityStore from './UtilityStore';

export class ExpressionStore {
    handler: IReactionDisposer;
    @observable valid: boolean = true;
    @observable expression: AbstractNode | null;

    entityName: string;
    moduleId: number;
    readOnly: boolean;

    @action setExpression(expression: any) {
        this.expression = NodeFactory.LoadExpression(expression);
    }

    @action clear() {
        this.setExpression({
            name: 'compare',
            isClone: false,
            operands: []
        });
        if (this.moduleId && this.entityName) {
            utilityStore.fetchDictionary(this.moduleId, this.entityName)
                .then(() => {
                    utilityStore.fetchPicklists(utilityStore.usedLists);
                });
        }
    }
}

export default new ExpressionStore();