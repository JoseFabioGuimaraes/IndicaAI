import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuncionarioService } from '../services/funcionario';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  cadastroForm: FormGroup;

  // Variáveis visuais
  cameraAtiva: 'rosto' | 'doc' | null = null;
  fotoRostoPreview: string | null = null;
  fotoDocPreview: string | null = null;

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  stream: MediaStream | null = null;

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService
  ) {
    this.cadastroForm = this.fb.group({
      nomeCompleto: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      senha: ['', Validators.required],
      fotoRostoUrl: ['', Validators.required],
      fotoDocumentoUrl: ['', Validators.required]
    });
  }

  formatarCPF(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    this.cadastroForm.get('cpf')?.setValue(valor, { emitEvent: false });
  }

  // --- LÓGICA DE UPLOAD (Arquivo) ---
  onFileSelected(event: any, campo: 'rosto' | 'doc') {
    const file = event.target.files[0];
    if (file) {
      this.converterParaBase64(file).then((base64: string) => {
        if (campo === 'rosto') {
          this.fotoRostoPreview = base64;
          this.cadastroForm.patchValue({ fotoRostoUrl: base64 });
        } else {
          this.fotoDocPreview = base64;
          this.cadastroForm.patchValue({ fotoDocumentoUrl: base64 });
        }
      });
    }
  }

  // --- LÓGICA DA CÂMERA (Webcam) ---
  async iniciarCamera(tipo: 'rosto' | 'doc') {
    this.cameraAtiva = tipo;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setTimeout(() => {
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
      }, 100);
    } catch (erro) {
      console.error('Erro:', erro);
      alert('Não foi possível acessar a câmera.');
      this.cameraAtiva = null;
    }
  }

  tirarFoto() {
    if (!this.videoElement || !this.cameraAtiva) return;
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL('image/png');

    if (this.cameraAtiva === 'rosto') {
      this.fotoRostoPreview = base64;
      this.cadastroForm.patchValue({ fotoRostoUrl: base64 });
    } else {
      this.fotoDocPreview = base64;
      this.cadastroForm.patchValue({ fotoDocumentoUrl: base64 });
    }

    this.pararCamera();
  }

  pararCamera() {
    this.cameraAtiva = null;
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }

  converterParaBase64(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      console.log('Iniciando envio para o servidor...');

      this.funcionarioService.cadastrar(this.cadastroForm.value).subscribe({

        next: (resposta) => {
          console.log('Sucesso:', resposta);
          alert(`Funcionário cadastrado com sucesso! ID: ${resposta.id}`);

          this.cadastroForm.reset();
          this.fotoRostoPreview = null;
          this.fotoDocPreview = null;
        },

        error: (erro) => {
          console.error('Erro na requisição:', erro);

          const mensagemErro = erro.error?.message || 'Erro ao conectar com o servidor.';

          alert(`Falha ao cadastrar: ${mensagemErro}`);
        }
      });

    } else {
      alert('Por favor, preencha todos os campos corretamente antes de enviar.');
    }
  }
}