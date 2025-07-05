import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/models';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password_hash!, salt);

    return this.userRepository.create({
      ...userData,
      password_hash: hashedPassword,
    });
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      user,
      token,
    };
  }

  private generateToken(user: IUser): string {
    const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
    const payload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    };
    const options: SignOptions = {
      expiresIn: '24h',
    };

    return jwt.sign(payload, secret, options);
  }

  async validateToken(token: string): Promise<IUser> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
      ) as any;
      const user = await this.userRepository.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 