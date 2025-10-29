# Get next lead

This is a test/development endpoint that is called to get the name of the next lead for the given [Event](link).

```bash
GET /api/next-lead/{event}
```

`{event}` must be specified, and can be either "standup" or "retro".

## Example request

<details>
  <summary>CURL</summary>

  ```bash
  $ curl https://roster-rosie.site.com/api/next-lead/standup \
    -H "Authorization: Bearer <your_bearer_token>"
  ```

</details>

<details>
  <summary>Ruby</summary>

  ```ruby
    require "net/http"

    # build request
    uri = URI("https://roster-rosie.site.com/api/next-lead/standup")
    token = "Sample-bearer-token"
    request = Net::HTTP::Get.new(uri, "Content-Type": "application/json")
    request["Authorization"] = "Bearer #{token}"
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
      url: 'https://roster-rosie.site.com/api/next-lead/retro',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <token-value>',
      },
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
      })
      .catch(e => {
        console.log(error);
    });
  ```

</details>

## Example response

Successful request will return `200 OK` response code and the name of the [Team Member](link) that is the next lead of your event:

```json
HTTP/1.1 200 OK

"Aimee Lou Wood"
```
