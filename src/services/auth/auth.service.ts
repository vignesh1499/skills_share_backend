import { dataSource } from "../../config/db";
import { User } from "../../entities/user.entity";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt.util";
import { LoginDto, RegisterUserDto } from "../../validators/user.dto";


export class AuthService {
  
  private readonly SALT_ROUNDS = 10;

  constructor(private userRepo = dataSource.getRepository(User)) {}
  //Register
  async registerUser(details: RegisterUserDto) {
    const { email, password, ...rest } = details;

    const existingUser = await this.userRepo.findOneBy({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    await this.userRepo.save(user);

    return {
      id: user.id,
      email: user.email,
    };
  }

  //Login
  async login({ email, password }: LoginDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new Error("Invalid email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      type: user.type,
      role: user.role,
    });

    return { token };
  }

  //Refresh Token
  async refreshToken(refreshToken: string) {
    const decoded = verifyToken(refreshToken);
    const newAccessToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role,
    });

    return { accessToken: newAccessToken };
  }
}
