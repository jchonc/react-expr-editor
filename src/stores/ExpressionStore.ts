import { IExpressionTreeNode, IExpressionStore } from '../types/index';
import { observable, ObservableMap, action } from 'mobx';
import { AttrIdSingleton } from '../constants/constants';

class ExpressionStore implements IExpressionStore {
    @observable metaLoaded: boolean = false;

    @observable valid: boolean = true;
    @observable expression: IExpressionTreeNode;
    expressionMap: ObservableMap<IExpressionTreeNode> = observable.map();
    entityName: string;
    moduleId: number;
    readonly: boolean;

    @observable knownPickLists = [{
        listName: 'Gender',
        items: [
            { value: 'GD_MALE', label: 'Male', description: 'Gentleman' },
            { value: 'GD_FEMALE', label: 'Female', description: 'Lady' }
        ]
    }];

    @observable knownMetaDictionary = [{
        attrId: '11001',
        attrCaption: 'First Name',
        attrDataType: 'string',
        attrCtrlType: 'text',
        attrCtrlParams: ''
    }, {
        attrId: '11002',
        attrCaption: 'Last Name',
        attrDataType: 'string',
        attrCtrlType: 'text',
        attrCtrlParams: ''
    }, {
        attrId: '11003',
        attrCaption: 'Gender',
        attrDataType: 'string',
        attrCtrlType: 'picklist',
        attrCtrlParams: 'Gender'
    }, {
        attrId: '11004',
        attrCaption: 'Birthday',
        attrDataType: 'date',
        attrCtrlType: 'date',
        attrCtrlParams: ''

    }];

    @action setExpressionMapNode(this: any, id: string, expressionNode: IExpressionTreeNode) {

        this.expressionMap!.set(
            expressionNode.nodeId.toString(),
            expressionNode);
        if (expressionNode.operands && expressionNode.operands.length) {
            for (let node of (expressionNode.operands as IExpressionTreeNode[])) {
                if (node) {
                    if (typeof node === 'object') {
                        this.setExpressionMapNode(node.nodeId.toString(), node);
                    }
                }
            }
        }
    }

    @action setExpressionTree(this: any, expressionTree: IExpressionTreeNode): void {
        if (expressionTree) {
            this.expressionMap!.set(
                expressionTree.nodeId.toString(),
                expressionTree
            );
            if (expressionTree.operands && expressionTree.operands.length) {
                for (let node of (expressionTree.operands as IExpressionTreeNode[])) {
                    if (node) {
                        this.setExpressionMapNode.call(this, node.nodeId.toString(), node);
                    }
                }
            }
        }

        this.expression = expressionTree;
    }
    @action getExpressionMap(): any {
        if (this.expressionMap) {
            return this.expressionMap;
        }
        return;
    }

    @action addSimpleChild() {
        this.expression = {
            name: 'compare',
            attrId: '',
            nodeId: AttrIdSingleton.NextUniqueNodeId,
            attrCaption: '',
            operator: 'And',
            operands: ['']
        };
    }

    @action fetchStuff() {
        const dictionaryUrl = `/dictionary/${this.moduleId}/${this.entityName}`;
        fetch(dictionaryUrl)
            .then((res) => res.json())
            .then((resData) => {
                const dictionray = resData;
                let usedLists: string[] = [];
                resData.map(function (attr: any) {
                    if (attr.attrCtrlType === 'picklist' && attr.attrCtrlParams) {
                        if (usedLists.indexOf(attr.attrCtrlParams) < 0) {
                            usedLists.push(attr.attrCtrlParams);
                        }
                    }
                });
                if (usedLists && usedLists.length) {
                    const picklistUrl = '/picklists';
                    fetch(picklistUrl, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify(usedLists)
                    })
                        .then((res) => res.json())
                        .then((resLists) => {
                            this.knownMetaDictionary = dictionray;
                            this.knownPickLists = resLists;
                            this.metaLoaded = true;
                        });
                }
                else {
                    this.knownMetaDictionary = dictionray;
                    this.knownPickLists = [];
                    this.metaLoaded = true;
                }
            });
    }
}

export default new ExpressionStore();