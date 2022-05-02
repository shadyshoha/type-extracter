import * as joi from "joi";

class AdminValidator {
  constructor() {}
  public SignupData = joi.object({
    email: joi
      .string()
      .email()
      .allow(...[""])
      .min(0)
      .max(5000)
      .required(),
    password: joi.string().min(6).max(100).required(),
  });

  public GetConfirmationEmailData = joi.object({
    email: joi
      .string()
      .email()
      .allow(...[""])
      .min(0)
      .max(5000)
      .required(),
  });

  public IsEmailInUseParam = joi.object({
    email: joi
      .string()
      .email()
      .allow(...[""])
      .min(0)
      .max(5000)
      .required(),
  });

  public SigninData = joi.object({
    email: joi
      .string()
      .email()
      .allow(...[""])
      .min(0)
      .max(5000)
      .required(),
    password: joi.string().min(6).max(100).required(),
  });

  public RefreshTokenData = joi.object({
    refreshToken: joi
      .string()
      .allow(...[""])
      .min(0)
      .max(5000)
      .required(),
  });

  public LogoutParam = joi.object({
    all: joi.boolean(),
    refreshToken: joi
      .string()
      .allow(...[""])
      .min(0)
      .max(5000)
      .required(),
  });

  public ChangePasswordData = joi.object({
    oldPassword: joi.string().min(6).max(100).required(),
    newPassword: joi.string().min(6).max(100).required(),
  });

  public GetAccessTokenWithCodeParam = joi.object({
    email: joi
      .string()
      .email()
      .allow(...[""])
      .min(0)
      .max(5000)
      .required(),
    code: joi.number().integer().min(100000).max(999999).required(),
  });

  public ChangeForgottenPasswordParam = joi.object({
    code: joi.number().integer().min(100000).max(999999).required(),
  });

  public ChangeForgottenPasswordData = joi.object({
    email: joi
      .string()
      .email()
      .allow(...[""])
      .min(0)
      .max(5000)
      .required(),
    newPassword: joi.string().min(6).max(100).required(),
  });

  public DeleteMeParam = joi.object({
    password: joi.string().min(6).max(100).required(),
  });
}

export const adminValidator = new AdminValidator();
