import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Client, ClientUpdate, Service } from './models';
import { environment } from 'src/environments/environment';
import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private httpClient: HttpClient) {}

  getClients(): Observable<Client[]> {
    const apiUrl = `${environment.apiUrl}/Clients/GetClients`;
    // return of([
    //   {
    //     id: 1,
    //     name: 'Amine',
    //   },
    // ]);
    return this.httpClient.get<Client[]>(apiUrl);
  }

  getServices(): Observable<Service[]> {
    const apiUrl = `${environment.apiUrl}/Services/GetServices`;

    return this.httpClient.get<Service[]>(apiUrl);
  }
  getClientInfoForUpdate(id: number): Observable<ClientUpdate> {
    const apiUrl = `${environment.apiUrl}/Clients/UpdateClient?id=${id}`;
    return this.httpClient.get<ClientUpdate>(apiUrl);
  }

  updateClient(value: ClientUpdate) {
    const apiUrl = `${environment.apiUrl}/Clients/UpdateClient`;
    return this.httpClient.post<ClientUpdate>(apiUrl, value);
  }
}
