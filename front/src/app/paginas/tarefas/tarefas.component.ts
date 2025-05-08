import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime, Subject } from 'rxjs';
import { CardTarefaComponent } from '../../componentes/card-tarefa/card-tarefa.component';
import { ITarefa, ITarefaResponse } from '../../interfaces/ITarefa';
import { TarefasService } from '../../servicos/tarefas.service';

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CardTarefaComponent,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './tarefas.component.html',
  styleUrl: './tarefas.component.scss',
})
export class TarefasComponent {
  private tarefasService = inject(TarefasService);
  private dialog = inject(MatDialog);

  protected tarefas = signal<ITarefaResponse | null>(null);
  protected carregando = signal(true);
  pagina = signal(1);

  @ViewChild('confirmarExclusaoTemplate')
  confirmarExclusaoTemplate!: TemplateRef<any>;
  tarefaSelecionada: ITarefa | null = null;
  dialogRef!: MatDialogRef<any>;

  private tituloFiltro$ = new Subject<string>();
  private tituloFiltro = '';
  private statusFiltro = '';
  protected dataInicio: Date | null = null;
  protected dataFim: Date | null = null;
  private ordenacao = '';

  ngOnInit() {
    this.listarTarefas();
  }

  constructor() {
    this.tituloFiltro$
      .pipe(debounceTime(300))
      .subscribe((valor) => {
        this.tituloFiltro = valor
        this.listarTarefas();
      });
  }

  protected filtrarTarefas(event: Event) {
    const titulo = (event.target as HTMLInputElement)?.value ?? '';
    this.tituloFiltro$.next(titulo);
  }

  protected filtrarTarefasPorStatus(status: string) {
    this.statusFiltro = status;
    this.listarTarefas();
  }

  protected filtrarDataInicio(data: Date | null) {
    this.dataInicio = data;
    this.listarTarefas();
  }

  protected filtrarDataFim(data: Date | null) {
    this.dataFim = data;
    this.listarTarefas();
  }

  protected ordenarTarefas(campo: string) {
    this.ordenacao = campo;
    this.listarTarefas();
  }

  protected listarTarefas() {
    this.carregando.set(true);

    const params: any = {
      page: this.pagina(),
      limit: 5,
    };

    if (this.tituloFiltro) {
      params.titulo = this.tituloFiltro;
    }
    if (this.statusFiltro) {
      params.situacao = this.statusFiltro;
    }
    if (this.dataInicio) {
      params.data_inicio = this.dataInicio.toISOString().split('T')[0];
    }
    if (this.dataFim) {
      params.data_fim = this.dataFim.toISOString().split('T')[0];
    }
    if (this.ordenacao) {
      params.ordenar_por = this.ordenacao;
    }

    this.tarefasService
      .listar(params)
      .then((tarefas) => {
        this.tarefas.set(tarefas);
        this.carregando.set(false);
      })
      .catch((erro) => {
        console.error('Erro ao listar tarefas:', erro);
        this.carregando.set(false);
      });
  }

  proximaPagina() {
    if (this.pagina() < (this.tarefas()?.totalPages || 1)) {
      this.pagina.update((p) => p + 1);
      this.listarTarefas();
    }
  }

  paginaAnterior() {
    if (this.pagina() > 1) {
      this.pagina.update((p) => p - 1);
      this.listarTarefas();
    }
  }

  protected concluirTarefa(id: string) {
    this.tarefasService
      .concluir(id)
      .then(() => {
        console.log('Tarefa concluída com sucesso');
        this.listarTarefas();
      })
      .catch((erro: unknown) => {
        console.error('Erro ao concluir tarefa:', erro);
      });
  }

  protected editarTarefa(id: string) {
    console.log('Editando tarefa', id);
    // sua lógica de edição
  }

  protected excluirTarefa(id: string) {
    this.tarefaSelecionada =
      this.tarefas()?.tarefas.find((t) => t._id === id) || null;
    this.dialogRef = this.dialog.open(this.confirmarExclusaoTemplate);
  }

  protected confirmarExclusao() {
    if (this.tarefaSelecionada) {
      this.tarefasService
        .excluir(this.tarefaSelecionada._id)
        .then(() => {
          this.listarTarefas();
        })
        .catch((erro: unknown) => {
          console.error('Erro ao excluir tarefa:', erro);
        })
        .finally(() => {
          this.tarefaSelecionada = null;
        });
    }
    this.dialogRef.close();
  }
}
