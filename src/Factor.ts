export class Factor{
    get factor(): number {
        return this._factor;
    }
    set factor(value: number) {
        this._factor = value;
    }

    private _factor: number;

    constructor(factor: number) {
        this._factor = factor;
    }
}
