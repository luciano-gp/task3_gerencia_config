import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ITarefa } from '../../interfaces/ITarefa';

@Component({
  selector: 'app-card-tarefa',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './card-tarefa.component.html',
  styleUrl: './card-tarefa.component.scss'
})
export class CardTarefaComponent {
  tarefa = input.required<ITarefa>();

  concluir = output<void>();
  iniciar = output<void>();
  reabrir = output<void>();
  pausar = output<void>();
  editar = output<void>();
  excluir = output<void>();

  concluirTarefa() {
    this.concluir.emit();
  }

  iniciarTarefa() {
    this.iniciar.emit();
  }

  reabrirTarefa() {
    this.reabrir.emit();
  }

  pausarTarefa() {
    this.pausar.emit();
  }

  editarTarefa() {
    this.editar.emit();
  }

  excluirTarefa() {
    this.excluir.emit();
  }
}
