
export class AttrIdSingleton {
    private static _instance: AttrIdSingleton;

    private static _nextUniqueNodeId =  Math.floor(Math.random() * (10000000 - 100000 + 1)) + 100000;

    public static get Instance() {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }

    public static get NextUniqueNodeId() {
        return this._nextUniqueNodeId++;
    }
}