import { LoginResponseDto } from '../api/dto/auth.dto';
import { AuthSession } from '../../shared/models/auth-session.model';

export function mapLoginResponseDtoToSession(
  response: LoginResponseDto,
): AuthSession {
  return {
    accessToken: response.accessToken,
    user: {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
    },
  };
}
