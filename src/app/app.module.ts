import { NgModule, Provider } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NGXS_PLUGINS, NgxsModule } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToastrModule } from "ngx-toastr";
import { BrowserModule } from "@angular/platform-browser";
import { ComponentsModule } from "./components/components.module";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSelectModule } from "ngx-select-ex";
import { MODALS_COMPONENT } from "./modals/modals.module";
import { StoragePlugin } from "./ngxs-plugins/storage/storage.plugin";
import { NGXS_STORAGE_PLUGIN_OPTIONS, STORAGE_ENGINE } from "@ngxs-labs/async-storage-plugin";
import { PopoverModule } from "ngx-bootstrap/popover";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SafeHtmlPipeImage } from "./pipes/safe-html-pipe-image";
import { StorageProvider } from "./providers/storage/capacitor-storage.provider";
import { WebRtcProvider, ProofmeUtilsProvider } from "@proofmeid/webrtc-web";
import { ModalModule } from "ngx-bootstrap/modal";
import { UtilsProvider } from "./providers/utils/utils";
import { AppStateModule } from "./state/app/app.module";
import { BouwplaatsStateModule } from "./state/bouwplaats/bouwplaats.module";


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http);
}

const NGXS_MODULES = [
    NgxsModule.forRoot([], {
        developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxSelectModule,
    AppStateModule,
    BouwplaatsStateModule
];

const NGXS_PROVIDERS: Provider[] = [
    StoragePlugin,
    {
        provide: STORAGE_ENGINE,
        useClass: StorageProvider
    },
    {
        provide: NGXS_STORAGE_PLUGIN_OPTIONS,
        useValue: {
            key: environment.stateStorageKeys,
            serialize: JSON.stringify,
            deserialize: JSON.parse
        }
    },
    {
        provide: NGXS_PLUGINS,
        useClass: StoragePlugin,
        multi: true
    }
];

@NgModule({
    declarations: [
        AppComponent,
        SafeHtmlPipeImage,
        ...MODALS_COMPONENT
    ],
    imports: [
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxSelectModule,
        AppRoutingModule,
        ComponentsModule,
        BrowserModule,
        ToastrModule.forRoot(),
        NgbModule,
        FontAwesomeModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ...NGXS_MODULES,
        PopoverModule.forRoot(),
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
    ],
    providers: [
        ...NGXS_PROVIDERS,
        WebRtcProvider,
        ProofmeUtilsProvider,
        UtilsProvider,
        SafeHtmlPipeImage
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas, far);
    }
}
