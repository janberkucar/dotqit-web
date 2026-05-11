import { LoginResponseDto } from '../api/dto/auth.dto';
import { AuthSession } from '../../shared/models/auth-session.model';

export function mapLoginResponseDtoToSession(
  response: LoginResponseDto,
): AuthSession {
  return {
    accessToken: response.accessToken,
    user: {
      id: response.user.id.toString(),
      name: `${response.user.firstName} ${response.user.lastName}`.trim(),
      email: response.user.email,
      roles: response.user.roles ?? [],
    },
  };
}
