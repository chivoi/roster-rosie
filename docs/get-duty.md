# Get duty

This is a test/development endpoint that is called to get the [Duty Object](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#duty-object) for the given [Event](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#events).

```bash
GET /api/duty/{event}
```

`{event}` must be specified, and can be either "standup" or "retro".

## Example request

<details>
  <summary>CURL</summary>

  ```bash
  $ curl https://roster-rosie.site.com/api/duty/standup
  ```

</details>

<details>
  <summary>Ruby</summary>

  ```ruby
    require "net/http"

    # build request
    uri = URI("https://roster-rosie.site.com/api/duty/standup")
    request = Net::HTTP::Get.new(uri, "Content-Type": "application/json")
    # send request
    response = Net::HTTP.start uri.hostname, uri.port, use_ssl: true do |http|
      http.request(request)
    end
  ```

</details>

<details>
  <summary>NodeJS</summary>

  ```javascript
    const axios = require('axios');

    const config = {
      method: 'GET',
      url: 'https://roster-rosie.site.com/api/duty/retro',
      headers: {
      'Content-Type': 'application/json'
      },
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
    });
  ```

</details>

## Example response

A successful request will return `200 OK` response code and the [Duty Object](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#duty-object) for your [Event](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#events):

```bash
HTTP/1.1 200 OK

{ 
  "current": 0,
  "next": 1
}
```

## Troubleshooting

### 400 Bad Request

This means that your request URL might be malformed and/or incomplete. Check the URL and make sure you have specified the event you are requesting a lead for: `/api/duty/standup` or `/api/duty/retro`. Please refer to [code examples](#example-request) for request examples in select languages.
