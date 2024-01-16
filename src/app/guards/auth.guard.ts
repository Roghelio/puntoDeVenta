import { AuthService } from '../service/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedInBS()) {
    router.navigate(['/login']);
  }

  return auth.isLoggedInBS();
};