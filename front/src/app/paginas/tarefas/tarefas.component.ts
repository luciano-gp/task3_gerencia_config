import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ITarefaResponse } from '../../interfaces/ITarefa';
import { TarefasService } from '../../servicos/tarefas.service';

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tarefas.component.html',
  styleUrl: './tarefas.component.scss',
})
export class TarefasComponent {
  private tarefasService = inject(TarefasService);

  protected tarefas = signal<ITarefaResponse | null>(null);
  protected carregando = signal(true);

  ngOnInit() {
    this.tarefasService
      .listar()
      .then((tarefas) => {
        this.tarefas.set(tarefas);
        this.carregando.set(false);
      })
      .catch((erro) => {
        console.error('Erro ao listar tarefas:', erro);
        this.carregando.set(false);
      });
  }
}
