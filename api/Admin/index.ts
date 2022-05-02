class AdminApi {
  private readonly r: string = "admin";

  constructor() {}

  public Signup = (data: {
    data: {
      email: string;
      password: string;
    };
  }) => {
    return true;
  };
}

export const adminApi = new AdminApi();
