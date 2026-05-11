/** Core Imports */
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
/** Service Imports */
import { LanguageService } from '../../core/language/language.service';
import { AuthApiService } from '../../core/api/services/auth-api.service';
import { AuthService } from '../../core/services/auth.service';
import { PortalSurfaceService } from '../../core/services/portal-surface.service';
import { ApiHttpError } from '../../core/api/dto/auth.dto';
/** Type Imports */
import { LanguageKey } from '../../core/language/language.types';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly authApi = inject(AuthApiService);
  private readonly portalSurface = inject(PortalSurfaceService);
  readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly isSubmitting = signal(false);

  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly canResendActivation = signal(false);
  readonly activationEmail = signal<string | null>(null);

  /** Development-only first admin setup when none exists yet. */
  readonly showBootstrapAdminLink = signal(false);

  readonly supportedLanguages = this.languageService.supportedLanguages();

  ngOnInit(): void {
    this.authApi.getBootstrapAdminStatus().subscribe({
      next: (status) => this.showBootstrapAdminLink.set(status.canBootstrap),
      error: () => this.showBootstrapAdminLink.set(false),
    });
  }

  submit(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.canResendActivation.set(false);

    this.authService
      .login({
        email: this.email,
        password: this.password,
      })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          this.successMessage.set(
            `Logged in as ${response.user.name}. Token: ${response.accessToken}`,
          );
          void this.router.navigateByUrl(this.portalSurface.defaultHomePath());
        },
        error: (error: Error) => {
          this.errorMessage.set(error.message);
          if (
            error instanceof ApiHttpError &&
            error.message.toLowerCase().includes('not activated')
          ) {
            this.canResendActivation.set(true);
            this.activationEmail.set(this.email.trim());
          }
        },
      });
  }

  resendActivation(): void {
    const email = this.activationEmail() ?? this.email.trim();
    if (!email) {
      this.errorMessage.set(this.text('auth.error.required'));
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.authService
      .resendActivation({ email })
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

  setLanguage(code: string): void {
    this.languageService.setLanguage(code as LanguageKey);
  }

  text(key: string): string {
    return this.languageService.t(key);
  }
}
