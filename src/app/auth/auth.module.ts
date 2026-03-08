import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthComponent} from "./auth.component";
import {AuthService} from "./auth.service";
import {OAuthFlowService} from "./oauth-flow.service";
import {TuiSharedModuleModule} from "../shared/modules/tui-shared-module.module";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {OAuthCallbackComponent} from "./oauth-callback.component";


@NgModule({
  declarations: [AuthComponent, OAuthCallbackComponent],
  providers: [AuthService, OAuthFlowService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiSharedModuleModule,
    BrowserAnimationsModule
  ]
})
export class AuthModule { }
