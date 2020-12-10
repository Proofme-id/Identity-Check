export class UpdateLabel {
    static readonly type = "[Label] UpdateLabel";
    constructor(public title: string, public description: string,public color: string, public labelId: number) { }
}