import { UserRepository } from '../repositories/user.repository';
import { Password } from './password.service';
import { JWT } from './jwt.service';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(username: string, password_plain: string) {
    const user = this.userRepository.findByUsername(username);

    if (!user || !user.password) {
      // In a real app, you might want to use a more generic error message
      // to prevent username enumeration attacks.
      throw new Error("Invalid username or password");
    }

    const passwordMatch = await Password.compare(password_plain, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid username or password");
    }
    
    // Don't include password in the token payload
    const { password, ...payload } = user;

    const token = JWT.sign(payload);

    return {
      token,
      role: user.role,
    };
  }
}
