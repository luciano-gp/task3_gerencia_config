import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ITarefaResponse } from '../interfaces/ITarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefasService {
  private http = inject(HttpClient);

  apiUrl = environment.apiUrl;

  async listar() {
    return await lastValueFrom(this.http.get<ITarefaResponse>(`${this.apiUrl}/tarefas`));
  }
}
