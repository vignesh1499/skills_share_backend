import {
  IsEmail,
  IsString,
  Length,
  IsIn,
  IsOptional,
  ValidateIf,
  Matches,
  IsNotEmpty,
} from "class-validator";

export class RegisterUserDto {
  @IsIn(["user", "provider"], {
    message: "Type must be user or provider",
  })
  role: "user" | "provider" = "user";

  @IsIn(["individual", "company"], {
    message: "Type must be individual or company",
  })
  type: "individual" | "company" = "individual";

  //Comman fileds
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  mobile: string;

  @IsString()
  address_street: string;

  @IsString()
  address_city: string;

  @IsString()
  address_state: string;

  @IsString()
  address_post_code: string;

  //Individual-specific fields
  @ValidateIf((o) => o.type === "individual")
  @IsString()
  first_name: string;

  @ValidateIf((o) => o.type === "individual")
  @IsString()
  last_name: string;

  //Company-specific fields
  @ValidateIf((o) => o.type === "company")
  @IsString()
  company_name: string;

  @ValidateIf((o) => o.type === "company")
  @IsString()
  phone_number: string;

  @ValidateIf((o) => o.type === "company")
  @IsString()
  @Matches(/^\d{10}$/, { message: "Business tax number must be 10 digits" })
  business_tax_number: string;

  @ValidateIf((o) => o.type === "company")
  @IsString()
  represntative_full_name: string;

  @IsOptional()
  @IsString()
  address_street_optional?: string;

  @IsOptional()
  @IsString()
  address_city_optional?: string;

  @IsOptional()
  @IsString()
  address_state_optional?: string;

  @IsOptional()
  @IsString()
  address_post_code_optional?: string;

  // Password (assuming it's part of the registration)
  @IsString()
  @Length(6, 20)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
