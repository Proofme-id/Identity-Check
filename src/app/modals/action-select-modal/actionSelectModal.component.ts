import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { IAttributeRequest, ISettings } from "../../interfaces/attributeRequest.interface";
import { marker as _ } from "@biesbjerg/ngx-translate-extract-marker";

_("ACTION_SELECT.SCAN")
_("ACTION_SELECT.REQUEST")
_("ACTION_SELECT.SETTINGS")
_("ACTION_SELECT.HELP")

_("PROVIDERS.EPASS")
_("PROVIDERS.IDIN")
_("PROVIDERS.PHONE_NUMBER")
_("PROVIDERS.EMAIL")
_("PROVIDERS.HEALTH")

_("ATTRIBUTE.EPASS.FIRST_NAME")
_("ATTRIBUTE.EPASS.LAST_NAME")
_("ATTRIBUTE.EPASS.PHOTO")
_("ATTRIBUTE.EPASS.GENDER")
_("ATTRIBUTE.EPASS.NATIONALITY")
_("ATTRIBUTE.EPASS.BIRTH_DATE")
_("ATTRIBUTE.EPASS.DOCUMENT_EXPIRY_DATE")
_("ATTRIBUTE.EPASS.PERSONAL_NUMBER")
_("ATTRIBUTE.EPASS.OLDER_THAN_12")
_("ATTRIBUTE.EPASS.OLDER_THAN_16")
_("ATTRIBUTE.EPASS.OLDER_THAN_18")
_("ATTRIBUTE.EPASS.OLDER_THAN_21")
_("ATTRIBUTE.EPASS.DOCUMENT_NUMBER")
_("ATTRIBUTE.EPASS.DOCUMENT_TYPE")
_("ATTRIBUTE.EPASS.ISSUING_AUTHORITY")

_("ATTRIBUTE.IDIN.CUSTOMER_ID")
_("ATTRIBUTE.IDIN.INITIALS")
_("ATTRIBUTE.IDIN.LAST_NAME")
_("ATTRIBUTE.IDIN.LAST_NAME_PREFIX")
_("ATTRIBUTE.IDIN.LAST_NAME_PREFERRED")
_("ATTRIBUTE.IDIN.LAST_NAME_PREFERRED_PREFIX")
_("ATTRIBUTE.IDIN.PARTNER_LAST_NAME")
_("ATTRIBUTE.IDIN.PARTNER_LAST_NAME_PREFIX")
_("ATTRIBUTE.IDIN.STREET")
_("ATTRIBUTE.IDIN.HOUSE_NUMBER")
_("ATTRIBUTE.IDIN.POSTAL_CODE")
_("ATTRIBUTE.IDIN.CITY")
_("ATTRIBUTE.IDIN.COUNTRY_CODE")
_("ATTRIBUTE.IDIN.BIRTH_DATE")
_("ATTRIBUTE.IDIN.OLDER_THAN_12")
_("ATTRIBUTE.IDIN.OLDER_THAN_16")
_("ATTRIBUTE.IDIN.OLDER_THAN_18")
_("ATTRIBUTE.IDIN.OLDER_THAN_21")
_("ATTRIBUTE.IDIN.GENDER")

_("ATTRIBUTE.EMAIL.EMAIL")
_("ATTRIBUTE.EMAIL.EMAIL_HASHED")

_("ATTRIBUTE.PHONE_NUMBER.PHONE_NUMBER")
_("ATTRIBUTE.PHONE_NUMBER.PHONE_NUMBER_HASHED")


_("ATTRIBUTE.HEALTH.VPASS_COR_MODERNA")
_("ATTRIBUTE.HEALTH.VPASS_COR_PFIZER")
_("ATTRIBUTE.HEALTH.VTEST_COR_ANTIGEEN")
_("ATTRIBUTE.HEALTH.VTEST_COR_LAMP")
_("ATTRIBUTE.HEALTH.VTEST_COR_PCR")

@Component({
    selector: "select-account-modal",
    templateUrl: "./actionSelectModal.component.html",
    styleUrls: ["./actionSelectModal.component.scss"]
})
export class ActionSelectModalComponent {

    @Output() requestedData = new EventEmitter<IAttributeRequest>();

    @Output() newSettings = new EventEmitter<ISettings>()

    @Input() settings: ISettings = null

    selectedAction = null;

    actions = [
        {
            key: "SCAN",
            icon: "camera"
        },{
            key: "REQUEST",
            icon: "qrcode"
        },
        {
            key: "SETTINGS",
            icon: "cog"
        },
        {
            key: "HELP",
            icon: "question"
        }
    ]

    providers = [
        {
            key: "EPASS",
            icon: "passport",
            required: false,
            attributes: [
                {
                    key: "FIRST_NAME",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                },
                {
                    key: "LAST_NAME",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                },
                {
                    key: "PHOTO",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                },
                {
                    key: "GENDER",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                },
                {
                    key: "NATIONALITY",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                },
                {
                    key: "BIRTH_DATE",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                }, {
                    key: "DOCUMENT_EXPIRY_DATE",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                }, {
                    key: "PERSONAL_NUMBER",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                }, {
                    key: "DOCUMENT_NUMBER",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                }, {
                    key: "DOCUMENT_TYPE",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                }, {
                    key: "ISSUING_AUTHORITY",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "",
                    required: false
                }, {
                    key: "OLDER_THAN_12",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "true",
                    required: false
                }, {
                    key: "OLDER_THAN_16",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "true",
                    required: false
                }, {
                    key: "OLDER_THAN_18",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "true",
                    required: false
                }, {
                    key: "OLDER_THAN_21",
                    provider: [
                        "EPASS"
                    ],
                    expectedValue: "true",
                    required: false
                }
            ]
        },{
            key: "IDIN",
            icon: "university",
            required: false,
            attributes: [
                {
                    key: "CUSTOMER_ID",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "INITIALS",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "LAST_NAME",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "LAST_NAME_PREFIX",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "LAST_NAME_PREFERRED",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "LAST_NAME_PREFERRED_PREFIX",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "PARTNER_LAST_NAME",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "PARTNER_LAST_NAME_PREFIX",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "STREET",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "HOUSE_NUMBER",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "POSTAL_CODE",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "CITY",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "COUNTRY_CODE",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "BIRTH_DATE",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "GENDER",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "",
                    required: false
                },{
                    key: "OLDER_THAN_12",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "true",
                    required: false
                },{
                    key: "OLDER_THAN_16",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "true",
                    required: false
                },{
                    key: "OLDER_THAN_18",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "true",
                    required: false
                },{
                    key: "OLDER_THAN_21",
                    provider: [
                        "IDIN",
                    ],
                    expectedValue: "true",
                    required: false
                }
            ]
        },{
            key: "PHONE_NUMBER",
            icon: "mobile-alt",
            required: false,
            attributes: [
                {
                    key: "PHONE_NUMBER",
                    provider: ["PHONE_NUMBER"],
                    required: false,
                    expectedValue: "",

                },
                {
                    key: "PHONE_NUMBER_HASHED",
                    provider: ["PHONE_NUMBER"],
                    required: false,
                    expectedValue: "",
                }
            ]
        },{
            key: "EMAIL",
            icon: "envelope",
            required: false,
            attributes: [
                {
                    key: "EMAIL",
                    required: false,
                    expectedValue: "",
                    provider: ["EMAIL"]
                },
                {
                    key: "EMAIL_HASHED",
                    required: false,
                    expectedValue: "",
                    provider: ["EMAIL"]
                }
            ]
        }
        ,{
            key: "HEALTH",
            icon: "medkit",
            required: false,
            attributes: [
                {
                    key: "VPASS_COR_MODERNA",
                    required: false,
                    expectedValue: "true",
                    provider: ["HEALTH"]
                },
                {
                    key: "VPASS_COR_PFIZER",
                    required: false,
                    expectedValue: "true",
                    provider: ["EMAIL"]
                },{
                    key: "VTEST_COR_ANTIGEEN",
                    required: false,
                    expectedValue: "false",
                    provider: ["HEALTH"]
                },
                {
                    key: "VTEST_COR_LAMP",
                    required: false,
                    expectedValue: "false",
                    provider: ["EMAIL"]
                },{
                    key: "VTEST_COR_PCR",
                    required: false,
                    expectedValue: "false",
                    provider: ["HEALTH"]
                }
            ]
        }
    ]

    consortiumList = [
        {
            name: "ProofMe.id",
            key: "0xa6De718CF5031363B40d2756f496E47abBab1515",
            icon: "list",
            required: true
        },
        {
            name: "ProofMe.id Test omgeving",
            key: "0x4746AaA7DA5Ca895C9FEC2A7635dF97fc3C1B045",
            icon: "list",
            required: false
        },
        {
            name: "ProofMe.id Demo omgeving",
            key: "0x708686336db6A465C1161FD716a1d7dc507d1d17",
            icon: "list",
            required: false
        }
    ]

    dataRequest = null;

    constructor(
        private modalService: BsModalService,
    ) {

    }

    ngOnInit() {
        for (const authority of this.settings.trustedAuthorities) {
            this.consortiumList.find(x => x.key === authority).required = true;
        }
    }

    select(action: string): void {
        if (action === "SCAN") {
            this.settings.action = action;
            this.newSettings.emit(this.settings);
            this.modalService.hide();
        } else if (action === "REQUEST") {
            this.createDataRequest();
            this.selectedAction = "REQUEST";
        } else if (action === "SETTINGS") {
            this.selectedAction = "SETTINGS";
        }
    }

    setProvider(provider: string): void {
        this.providers.find(x => x.key === provider).required = !this.providers.find(x => x.key === provider).required;
    }

    requiredProviders(): any {
        return this.providers.filter(x => x.required === true);
    }

    setAttribute(provider: string, attribute: string): void {
        this.providers.find(x => x.key === provider).attributes.find(x => x.key === attribute).required = !this.providers.find(x => x.key === provider).attributes.find(x => x.key === attribute).required;
    }

    setAttributes(): void {
        this.selectedAction = "ATTRIBUTES";
    }

    setDataRequest(): void {
        const minimumRequiredObject = {
            data: [],
            amount: 1
        }
        const requestAttributes = {
            by: "A person",
            description: "identification",
            credentials: [],
            minimumRequired: []
        } as IAttributeRequest;
        for (const provider of this.providers.filter(x => x.required === true)) {
            const addToMinimumRequired = provider.key === "HEALTH";
            for (const attribute of provider.attributes.filter(x => x.required === true)) {
                if (addToMinimumRequired) {
                    minimumRequiredObject.data.push(attribute.key);
                }
                if (requestAttributes.credentials.find(x => x.key === attribute.key)) {
                    requestAttributes.credentials.find(x => x.key === attribute.key).provider.push(...attribute.provider)
                } else {
                    requestAttributes.credentials.push(attribute);
                }
            }
        }

        if (minimumRequiredObject.data.length > 0) {
            requestAttributes.minimumRequired.push(minimumRequiredObject);
        }
        this.requestedData.emit(requestAttributes);
        this.settings.action = "REQUEST"
        this.newSettings.emit(this.settings);
        this.modalService.hide();
    }

    setTrustedConsortiumList(provider: string): void {
        this.consortiumList.find(x => x.key === provider).required = !this.consortiumList.find(x => x.key === provider).required;
    }

    createDataRequest(): void {
        this.dataRequest = {};
    }

    setTrustedConsortiumLists(): void {
        this.selectedAction = null;
        this.settings.trustedAuthorities = this.consortiumList.filter(x => x.required === true).map(x => { return x.key });
        this.newSettings.emit(this.settings)
        if (this.settings.action !== null) {
            this.modalService.hide();
        }
    }
}
