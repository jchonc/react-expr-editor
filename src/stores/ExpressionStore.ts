import { NodeFactory, AbstractNode } from '../types/index';
import { observable, action, computed } from 'mobx';

export class UtilityStore {

    @observable tasks: number = 0;

    @computed get isBusy() {
        return this.tasks !== 0 || !this.dictionary || !this.picklists;
    }

    @observable dictionary: any;

    @computed get usedLists() {
        let result = new Set<string>(this.dictionary
            .filter((attr: any) => attr.attrCtrlType === 'picklist' && attr.attrCtrlParams)
            .map((attr: any) => attr.attrCtrlParams));
        return Array.from(result.values());
    }

    @observable picklists: any;

    @action async fetchDictionary(moduleId: number, entityName: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const dictionaryUrl = `/dictionary/${moduleId}/${entityName}`;
                this.tasks += 1;
                let result = await fetch(dictionaryUrl);
                if (result.ok) {
                    let data = await result.json();
                    if (data) {
                        this.dictionary = data;
                        resolve(data);
                    }
                }
                reject(result);
            } catch (e) {
                reject(e);
            }
            finally {
                this.tasks -= 1;
            }
        });
    }

    @action async fetchPicklists(usedLists: string[]): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const picklistUrl = '/picklists';
                this.tasks += 1;
                let result = await fetch(picklistUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(usedLists)
                });
                if (result.ok) {
                    let data = await result.json();
                    if (data) {
                        this.picklists = data;
                        resolve(data);
                    }
                }
                reject(result);
            } catch (e) {
                reject(e);
            }
            finally {
                this.tasks -= 1;
            }
        });
    }
}

export const utilityStore = new UtilityStore();

export class ExpressionStore {
    @observable metaLoaded: boolean = false;

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