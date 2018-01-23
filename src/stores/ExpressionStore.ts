import { NodeFactory, AbstractNode } from '../types/index';
import { observable, action } from 'mobx';

export class ExpressionStore {
    @observable metaLoaded: boolean = false;

    @observable valid: boolean = true;
    @observable expression: AbstractNode | null;

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

    @observable knownMetaDictionary: any[] = [{
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

    @action setExpression(expression: any) {
        this.expression = NodeFactory.LoadExpression(expression);
    }

    @action fetchStuff() {
        const dictionaryUrl = `/dictionary/${this.moduleId}/${this.entityName}`;
        return fetch(dictionaryUrl)
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

    @action reveal() {
        const result = JSON.stringify(NodeFactory.SaveExpression(this.expression));
        document.getElementById('expr_value')!.innerHTML = result;
    }

    @action getMeta(attrId: string): any | undefined {
        if (!attrId) {
            return undefined;
        }
        return this.knownMetaDictionary.find(function (elm: any) {
            return elm.attrId === attrId;
        });
    }
}

export default new ExpressionStore();