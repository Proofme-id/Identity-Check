export type ITYPE = "SUCCESS" | "ERROR" | "INFO" | "WARNING";

export class ToastMessage {

    type: ITYPE;
    message: string;

    constructor(type: ITYPE, message: string) {
        this.type = type || "INFO";
        this.message = message;
    }
}
