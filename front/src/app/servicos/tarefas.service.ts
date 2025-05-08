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

  async criar(dados: any) {
    return await lastValueFrom(this.http.post(`${this.apiUrl}/tarefas`, dados));
  }

  async atualizar(id: string, dados: any) {
    return await lastValueFrom(this.http.put(`${this.apiUrl}/tarefas/${id}`, dados));
  }

  async concluir(id: string) {
    return await lastValueFrom(
      this.http.patch<ITarefa>(`${this.apiUrl}/tarefas/${id}`, {
        situacao: 'concluida',
        data_encerramento: new Date(),
      })
    );
  }

  async iniciar(id: string) {
    return await lastValueFrom(
      this.http.patch<ITarefa>(`${this.apiUrl}/tarefas/${id}`, {
        situacao: 'em_andamento'
      })
    );
  }

  async reabrir(id: string) {
    return await lastValueFrom(
      this.http.patch<ITarefa>(`${this.apiUrl}/tarefas/${id}`, {
        data_encerramento: null,
        situacao: 'em_andamento'
      })
    );
  }

  async pausar(id: string) {
    return await lastValueFrom(
      this.http.patch<ITarefa>(`${this.apiUrl}/tarefas/${id}`, {
        situacao: 'pendente'
      })
    );
  }

  async excluir(id: string) {
    return await lastValueFrom(
      this.http.delete<ITarefa>(`${this.apiUrl}/tarefas/${id}`)
    );
  }
}
