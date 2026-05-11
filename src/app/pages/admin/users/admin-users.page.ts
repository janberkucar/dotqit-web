import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminConsoleStore } from '../../../core/state/admin-console.store';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-users.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPage implements OnInit {
  readonly admin = inject(AdminConsoleStore);

  /** Maps user id → role input draft */
  readonly roleDraft = new Map<number, string>();

  ngOnInit(): void {
    void this.admin.refreshUsers();
  }

  draftFor(userId: number): string {
    return this.roleDraft.get(userId) ?? '';
  }

  setDraft(userId: number, value: string): void {
    this.roleDraft.set(userId, value);
  }

  async addRole(userId: number): Promise<void> {
    const role = (this.roleDraft.get(userId) ?? '').trim();
    if (!role) {
      return;
    }
    await this.admin.addUserRole(userId, role);
    this.roleDraft.delete(userId);
  }

  async removeRole(userId: number, role: string): Promise<void> {
    await this.admin.removeUserRole(userId, role);
  }

  displayName(user: { firstName: string; lastName: string; email: string }): string {
    const name = `${user.firstName} ${user.lastName}`.trim();
    return name.length > 0 ? name : user.email;
  }
}
