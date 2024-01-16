import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  //guardar la respuesta del api en un array
  resApi: any[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    //obtener el rol del usuario registrado
    let rol = this.auth.getRol();

    //esta parte evita que el usuario regrese al login sin desloguearse detectando su rol correspondiente
    if (this.auth.isLoggedIn()) {
      switch (rol) {
        case 'Administrador':
          this.router.navigate(['/admin']);
          break;
        case 'Recepcionista':
          this.router.navigate(['/recepcion']);
          break;
        case 'SuperAdmin':
          this.router.navigate(['/supAdmin']);
          break;
      }
    }
  }

  

  getErrorMessage() {
    const usernameControl = this.loginForm.get('username');
    if (usernameControl) {
      if (usernameControl.hasError('required')) {
        return 'Por favor ingresa tu correo';
      }
      if (usernameControl.hasError('email')) {
        return 'Por favor ingresa un correo valido';
      }
    }
    return '';
  }

  onSubmit(): void {
    console.log(this.loginForm.value);
    if(this.loginForm.valid){
      this.auth.loginBS(this.loginForm.value).subscribe({
        next: (resultData) => {
          if (resultData.rolUser === 'SuperAdmin') {
            this.auth.loggedIn.next(true);
            this.auth.role.next('SuperAdmin');
            this.auth.userId.next(resultData.id);
            this.router.navigate(['/sup-admin']);
            console.log('eres super admin');
          } else if (resultData.rolUser === 'Administrador') {
            this.auth.loggedIn.next(true);
            this.auth.role.next('Administrador');
            this.auth.userId.next(resultData.id);
            this.router.navigate(['/admin']);
          } else if (resultData.rolUser === 'Recepcionista') {
            this.auth.loggedIn.next(true);
            this.auth.role.next('Recepcionista');
            this.auth.userId.next(resultData.id);
            this.router.navigate(['/recepcion']);
            console.log('soy recepcionista');
          } else {
            this.toastr.error('No cuentas con permisos...', 'Error', {
              positionClass: 'toast-bottom-left',
            });
          }
        }, error: (error) => {
            this.toastr.error(error, 'Error', {
            positionClass: 'toast-bottom-left',
          });
        }
      })
    }
  }


}
