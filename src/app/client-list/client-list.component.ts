import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { Client, ClientUpdate, Service } from '../models';
import { MatDialog } from '@angular/material/dialog';
import {
  EditClientDialogData,
  EditClientFormComponent,
} from '../edit-client-form/edit-client-form.component';
import { finalize, shareReplay, tap, withLatestFrom } from 'rxjs/operators';
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  services$: Observable<Service[]> = this.dataService
    .getServices()
    .pipe(shareReplay(1));
  subs: Subscription[] = [];
  isLoading$ = this.dataService.isLoading$;
  constructor(private dataService: DataService, private dialog: MatDialog) {}
  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.updateClientList();
  }

  updateClientList() {
    this.isLoading$.next(true);
    this.subs.push(
      this.dataService
        .getClients()
        .pipe(finalize(this.turnLoadingOff))
        .subscribe((clients) => {
          this.clients = clients || [];
        })
    );
  }
  editClient(clientDetails: Client): void {
    this.isLoading$.next(true);
    const sub = this.dataService
      .getClientInfoForUpdate(clientDetails.id)
      .pipe(withLatestFrom(this.services$), finalize(this.turnLoadingOff))
      .subscribe(
        ([clientDetails, services]) => {
          this.openEditDialog(clientDetails, services);
        },
        ({ error }) => {
          console.error(error);
          // check if server formated error
          if ('Detail' in error) {
            const msg = `${error.Title} \nError:${error.Detail}`;
            alert(msg);
          }
        }
      );
    this.subs.push(sub);
  }
  openEditDialog(clientDetails: ClientUpdate, services: Service[]) {
    const data: EditClientDialogData = { clientDetails, services };
    const dialogRef = this.dialog.open(EditClientFormComponent, {
      width: '600px',
      data,
    });
    dialogRef.afterClosed().subscribe(() => this.updateClientList());
  }
  private turnLoadingOff = () => this.isLoading$.next(false);
}
