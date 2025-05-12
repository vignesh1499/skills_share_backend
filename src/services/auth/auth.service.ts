import { dataSource } from "../../config/db";
import { User } from "../../entities/user.entity";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.util";

export class AuthService {
  private userRepo = dataSource.getRepository(User);

  //Register  -- need tp add Interface instead of userDetails
  async registerUser(userDetails: any) {
    const { email, password, mobile, type, address_street, address_city, address_state, address_post_code, first_name, last_name, address_street_optional, address_city_optional, address_state_optional, address_post_code_optional, role } = userDetails;
    const exists = await this.userRepo.findOneBy({ email });
    if (exists) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    // console.log(email, password, mobile, type, address_street, address_city, address_state, address_post_code, first_name, last_name , address_street_optional, address_city_optional, address_state_optional , address_post_code_optional);
    const user = this.userRepo.create({ email, password: hashed, role, mobile, type, address_street, address_city, address_state, address_post_code, first_name, last_name, address_street_optional, address_city_optional, address_state_optional, address_post_code_optional });
    await this.userRepo.save(user);

    return { id: user.id, email: user.email };
  }

  //Login   -- need tp add Interface instead of userDetails
  async login(loginDetails: any) {
    const { email, password } = loginDetails;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new Error("Invalid mailId");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Password");

    const token = generateToken({ id: user.id, email: user.email, type: user.type, role: user.role });
    return { token };
  }
}
