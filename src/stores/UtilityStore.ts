import mobx, { observable, computed, action, runInAction } from 'mobx';

mobx.useStrict(true);

export class UtilityStore {

    @observable tasks: number = 0;

    @computed get isBusy(): boolean {
        return this.tasks > 0;
    }

    @observable state: 'pending' | 'done' | 'error' = 'pending';

    @computed get isDictionaryEmpty(): boolean {
        return !this.dictionary.length;
    }

    @computed get isPicklistsEmpty(): boolean {
        return !this.picklists.length;
    }

    @observable dictionary: any[] = [];

    @computed get usedLists(): any[] {
        if (!this.dictionary.length) {
            return [];
        }
        let result = new Set<string>(this.dictionary
            .filter((attr: any) => attr.attrCtrlType === 'picklist' && attr.attrCtrlParams)
            .map((attr: any) => attr.attrCtrlParams));
        return Array.from(result.values());
    }

    @observable picklists: any[] = [];

    @action
    async fetchDictionary(moduleId: number, entityName: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const dictionaryUrl = `/dictionary/${moduleId}/${entityName}`;
                this.tasks += 1;
                let result = await fetch(dictionaryUrl);
                if (result.ok) {
                    let data = await result.json();
                    if (data) {
                        runInAction(() => {
                            this.dictionary = data;
                            resolve(data);
                        });
                    }
                }
                reject(result);
            } catch (e) {
                reject(e);
            }
            finally {
                runInAction(() => {
                    this.tasks = Math.max(this.tasks - 1, 0);
                });
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
                        runInAction(() => {
                            this.picklists = data;
                            resolve(data);
                        });
                    }
                }
                reject(result);
            } catch (e) {
                reject(e);
            }
            finally {
                runInAction(() => {
                    this.tasks = Math.max(this.tasks - 1, 0);
                });
            }
        });
    }
}

export default new UtilityStore();
