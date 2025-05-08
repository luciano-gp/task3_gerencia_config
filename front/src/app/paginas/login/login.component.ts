import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicos/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  protected erro = '';

  protected titulo = 'Entrar';

  protected formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    nome: [''],
    senha: ['', Validators.required],
  });

  protected async logar() {
    this.erro = '';
    if (this.formulario.invalid) return;

    const { email, senha } = this.formulario.value;

    try {
      await this.auth.login(email!, senha!);
      this.router.navigateByUrl('/tarefas');
    } catch {
      this.erro = 'Credenciais inválidas';
    }
  }

  protected async cadastrar() {
    if (this.titulo === 'Cadastrar') {
      this.erro = '';
      if (this.formulario.invalid) return;

      const { email, senha, nome } = this.formulario.value;

      try {
        await this.auth.cadastrar(email!, senha!, nome!);
        await this.auth.login(email!, senha!);
        this.router.navigateByUrl('/tarefas');
      } catch {
        this.erro = 'Erro ao cadastrar usuário';
      }
    } else {
      this.titulo = 'Cadastrar';
    }
  }

}
