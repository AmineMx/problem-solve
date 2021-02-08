import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientListComponent } from './client-list/client-list.component';
import { MatImportModule } from './mat-import/mat-import.module';
import { HttpClientModule } from '@angular/common/http';
import { EditClientFormComponent } from './edit-client-form/edit-client-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ClientListComponent, EditClientFormComponent],
  imports: [
    BrowserModule,
    MatImportModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
