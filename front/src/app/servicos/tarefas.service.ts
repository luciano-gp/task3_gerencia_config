import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ITarefa, ITarefaResponse } from '../interfaces/ITarefa';

@Injectable({
  providedIn: 'root',
})
export class TarefasService {
  private http = inject(HttpClient);

  apiUrl = environment.apiUrl;

  async listar(params: any) {
    return await lastValueFrom(
      this.http.get<ITarefaResponse>(`${this.apiUrl}/tarefas`, { params })
    );
  }

  async concluir(id: string) {
    return await lastValueFrom(
      this.http.patch<ITarefa>(`${this.apiUrl}/tarefas/${id}`, {
        status: 'concluida',
        data_encerramento: new Date(),
      })
    );
  }

  async excluir(id: string) {
    return await lastValueFrom(
      this.http.delete<ITarefa>(`${this.apiUrl}/tarefas/${id}`)
    );
  }
}
