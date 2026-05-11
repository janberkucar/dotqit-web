import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../core/api/services/auth-api.service';

@Component({
  selector: 'app-bootstrap-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bootstrap-admin.page.html',
  styleUrl: './bootstrap-admin.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BootstrapAdminPage implements OnInit {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  dateOfBirth = '';

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly statusLoading = signal(true);
  readonly apiUnreachable = signal(false);
  readonly showBootstrapForm = signal(false);

  ngOnInit(): void {
    this.authApi.getBootstrapAdminStatus().subscribe({
      next: (status) => {
        this.statusLoading.set(false);
        this.apiUnreachable.set(false);
        this.showBootstrapForm.set(status.canBootstrap);
      },
      error: () => {
        this.statusLoading.set(false);
        this.apiUnreachable.set(true);
        this.showBootstrapForm.set(false);
      },
    });
  }

  submit(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authApi
      .bootstrapAdmin({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(response.message);
          setTimeout(() => {
            void this.router.navigateByUrl('/login');
          }, 1500);
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message);
        },
      });
  }
}
