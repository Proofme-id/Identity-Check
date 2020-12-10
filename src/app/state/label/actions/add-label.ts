export class AddLabel {
    static readonly type = "[Label] AddLabel";

    constructor(public title: string, public description: string,public color: string) {}
}
