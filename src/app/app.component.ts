import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  apiUrl: string = 'http://localhost:8081/api/clientes';
  clientes: any[] = [];
  constructor(
    private httpClient: HttpClient
  ) {
  }


  formCadastro = new FormGroup({
    nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{10,11}$/)
    ])

  });
  //função para verificar se os campos do formulário
  //estão com erro de validação e exibir mensagens
  get fCadastro() {
    return this.formCadastro.controls;
  }

  formEdicao = new FormGroup({
    idCliente: new FormControl(''),
     nomeCliente: new FormControl('', [
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente: new FormControl('', [
      Validators.required, Validators.email
    ]),
    telefoneCliente: new FormControl('', [
      Validators.required, Validators.pattern(/^\d{10,11}$/)
    ])

  });

  get fEditar() {
    return this.formEdicao.controls;

  }

  ngOnInit(): void {
    this.httpClient.get(this.apiUrl + '/consultar')
      .subscribe({
        next: (data) => {
          this.clientes = data as any[];
        }
      })
  }

  cadastrarCliente(): void {
    //fazendo uma requisição POST para api de cadastro de clientes
    this.httpClient.post(this.apiUrl + '/criar', this.formCadastro.value, { responseType: 'text' })
      .subscribe({ //capturando o retorno da API (resposta)
        next: (data) => {
          this.formCadastro.reset(); //limpando o formulário
          this.ngOnInit(); //executando a consulta de clientes
          alert(data); //exibindo a mensagem
        }
      })
  }


  excluirCliente(idCliente: string): void {

    if (confirm('Deseja realmente excluir o cliente selecionado?')) {

      this.httpClient.delete(this.apiUrl + "/excluir/" + idCliente, { responseType: 'text' })
        .subscribe({
          next: (data: any) => {
            this.ngOnInit()
            alert(data);
          }
        })


    }
  }
  obterCliente(c: any): void {
    this.formEdicao.controls['idCliente'].setValue(c.idCliente),
      this.formEdicao.controls['nomeCliente'].setValue(c.nomeCliente),
      this.formEdicao.controls['emailCliente'].setValue(c.emailCliente),
      this.formEdicao.controls['telefoneCliente'].setValue(c.telefoneCliente)
  }

  atualizarCliente(): void {
    this.httpClient.put(this.apiUrl + "/editar", this.formEdicao.value, { responseType: 'text' })
      .subscribe({
        next: (data) => {
          this.ngOnInit();
          alert(data);

        }
      })
  }

}
