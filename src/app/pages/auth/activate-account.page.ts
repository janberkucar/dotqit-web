import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-activate-account-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './activate-account.page.html',
  styleUrl: './activate-account.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivateAccountPage {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  code = '';
  email = this.route.snapshot.queryParamMap.get('email') ?? '';

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  submit(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.auth
      .activate({ code: this.code.trim() })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (message) => {
          this.successMessage.set(message);
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message);
        },
      });
  }

  resendActivation(): void {
    if (!this.email.trim()) {
      this.errorMessage.set('Email is required to resend activation code.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.auth
      .resendActivation({ email: this.email.trim() })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (message) => {
          this.successMessage.set(message);
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message);
        },
      });
  }
}
