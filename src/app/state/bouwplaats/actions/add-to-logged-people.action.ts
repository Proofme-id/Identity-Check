import { ICredentialObject } from "@proofmeid/webrtc-web";

export class AddToLoggedPeopleAction {
    static readonly type = "[Bouwplaats] AddToLoggedPeople";

    constructor(public credentialObject: ICredentialObject) {}
}
