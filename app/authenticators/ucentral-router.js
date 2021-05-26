import Base from "ember-simple-auth/authenticators/base";
import fetch from "fetch";

export default class UcentralRouterAuthenticator extends Base {
  async restore(data) {
    if (!data || !Object.keys(data).length) {
      throw new Error("UcentralRouterAuthenticator was provided empty session");
    }
    return data;
  }

  async authenticate(userId, password) {
    const authenticateResponse = await fetch("/authenticate", {
      method: "POST",
      body: JSON.stringify({ userId, password }),
    });

    if (!authenticateResponse.ok) {
      throw authenticateResponse;
    }

    const data = await authenticateResponse.json();
    return data;
  }
}
