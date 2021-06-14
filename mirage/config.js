import { Response } from "miragejs";
import ENV from "ucentral/config/environment";

export default function () {
  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */

  this.post(
    `${ENV.APP.BASE_API_URL}/api/v1/oauth2`,
    function (schema, request) {
      const payload = JSON.parse(request.requestBody);

      if (payload.userId === "192.168.1.1" && payload.password === "Secret") {
        return new Response(200, {}, { succeeded: true });
      }

      return new Response(400, {}, {});
    }
  );

  this.post(
    `${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber/configure`,
    function () {
      return new Response(200, {}, {});
    }
  );

  this.get(`${ENV.APP.BASE_API_URL}/api/v1/device/:serialNumber`, function () {
    return new Response(
      200,
      {},
      {
        configuration: "",
        serialNumber: "AAAA-CCCC",
        name: "Dummy",
      }
    );
  });

  this.get("/network-settings", function () {
    return new Response(
      400,
      { "content-type": "application/json" },
      {
        ssid: "mynetwork",
        password: "mypass",
        encryption: "wpa2",
        hidden: false,
      }
    );
  });

  this.get(
    `${ENV.APP.BASE_API_URL}/api/v1/devices/:serialNumber/healthchecks`,
    function (schema, request) {
      return new Response(
        200,
        {},
        schema.db.healthchecks.findBy({
          serialNumber: request.params.serialNumber,
        })
      );
    }
  );
}
