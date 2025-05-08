import { Routes } from '@angular/router';
import { authGuard } from './servicos/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./paginas/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'tarefas',
    canActivate: [authGuard],
    loadComponent: () => import('./paginas/tarefas/tarefas.component').then(m => m.TarefasComponent),
  }
];
