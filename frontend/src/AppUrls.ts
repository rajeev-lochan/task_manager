class GlobalAppUrls {
  public Client = {
    Home: "/",
    Register: "/register",
    Login: "/signin",
    Tasks:"/tasks"
  };

  public Server = {
    Account: {
      Register: "/api/v1/user/register",
      Login: "/api/v1/users/login",
    },
  };
}

export const AppUrls = new GlobalAppUrls();
