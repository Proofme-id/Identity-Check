export class AddLabel {
    static readonly type = "[Organisation] AddLabel";

    constructor(public title: string, public description: string,public color: string) {}
}
