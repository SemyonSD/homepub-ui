import { NgModule } from '@angular/core';
import {
  TuiAlertModule, TuiButtonModule,
  TuiDialogModule, TuiErrorModule, TuiExpandModule, TuiGroupModule, TuiHintModule, TuiHostedDropdownModule,
  TuiModeModule,
  TuiRootModule, TuiScrollbarModule,
  TuiSvgModule, TuiTextfieldControllerModule,
  TuiThemeNightModule
} from "@taiga-ui/core";
import {TuiBlockStatusModule} from "@taiga-ui/layout";
import {
  TuiActionModule, TuiCarouselModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule,
  TuiInputModule, TuiInputNumberModule, TuiInputPasswordModule,
  TuiInputTagModule, TuiIslandModule, TuiMultiSelectModule,
  TuiRoutableDialogModule, TuiSelectModule,
  TuiTagModule,
  TuiTextAreaModule
} from "@taiga-ui/kit";



@NgModule({
  declarations: [],
  imports: [
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiThemeNightModule,
    TuiModeModule,
    TuiSvgModule,
    TuiBlockStatusModule,
    TuiTagModule,
    TuiButtonModule,
    TuiActionModule,
    TuiRoutableDialogModule,
    TuiInputModule,
    TuiInputTagModule,
    TuiTextfieldControllerModule,
    TuiHostedDropdownModule,
    TuiExpandModule,
    TuiTextAreaModule,
    TuiErrorModule,
    TuiHintModule,
    TuiInputPasswordModule,
    TuiCarouselModule,
    TuiIslandModule,
    TuiScrollbarModule,
    TuiFieldErrorPipeModule,
    TuiGroupModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiMultiSelectModule,
    TuiInputNumberModule,
  ],
  exports: [
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiThemeNightModule,
    TuiModeModule,
    TuiSvgModule,
    TuiBlockStatusModule,
    TuiTagModule,
    TuiButtonModule,
    TuiActionModule,
    TuiRoutableDialogModule,
    TuiInputModule,
    TuiInputTagModule,
    TuiTextfieldControllerModule,
    TuiHostedDropdownModule,
    TuiExpandModule,
    TuiTextAreaModule,
    TuiErrorModule,
    TuiHintModule,
    TuiInputPasswordModule,
    TuiCarouselModule,
    TuiIslandModule,
    TuiScrollbarModule,
    TuiFieldErrorPipeModule,
    TuiGroupModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiMultiSelectModule,
    TuiInputNumberModule,
  ]
})
export class TuiSharedModuleModule { }
