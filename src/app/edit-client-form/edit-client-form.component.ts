import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Client, ClientUpdate, Service } from '../models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../data.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export type EditClientDialogData = {
  clientDetails: ClientUpdate;
  services: Service[];
};

@Component({
  selector: 'app-edit-client-form',
  templateUrl: './edit-client-form.component.html',
  styleUrls: ['./edit-client-form.component.scss'],
})
export class EditClientFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  services: Service[];
  sub: Subscription;

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<EditClientFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: EditClientDialogData
  ) {
    const clientDetails = this.data.clientDetails;
    this.services = this.data.services || [];
    this.form = new FormGroup({
      id: new FormControl(clientDetails.id),
      name: new FormControl(clientDetails.name),
      services: new FormControl(clientDetails.services),
    });
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {}
  save(): void {
    this.dataService.isLoading$.next(true);
    this.sub = this.dataService
      .updateClient(this.form.value)

      .pipe(
        finalize(() => {
          this.dataService.isLoading$.next(false);
        }),
        catchError((errorRes: HttpErrorResponse) => {
          const { error } = errorRes;
          // check if its server error
          if ('Errors' in error) {
            error.Errors.forEach((element) => {
              const elName = (element.Name as string).toLowerCase();
              const control = this.form.get(elName);
              if (control == null) return;
              control.setErrors({
                error: element.Description,
              });
            });
          } else {
            alert(error);
          }
          return throwError(error);
        })
      )
      .subscribe(() => this.dialogRef.close());
  }
}
