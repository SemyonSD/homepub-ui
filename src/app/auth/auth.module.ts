import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthComponent} from "./auth.component";
import {AuthService} from "./auth.service";
import {TuiSharedModuleModule} from "../shared/modules/tui-shared-module.module";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [AuthComponent],
  providers: [AuthService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiSharedModuleModule,
    BrowserAnimationsModule
  ]
})
export class AuthModule { }
