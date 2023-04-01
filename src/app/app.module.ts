import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FocusableDirective } from './focusable.directive';

import { AppComponent } from './app.component';
import { EditableComponent } from './editable/editable.component';
import { EditModeDirective } from './editable/edit-mode.directive';
import { ViewModeDirective } from './editable/view-mode.directive';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  declarations: [
    AppComponent,
    FocusableDirective,
    EditableComponent,
    EditModeDirective,
    ViewModeDirective,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
