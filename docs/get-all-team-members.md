# Get all team members

```bash
GET /api/all-team-member
```

## Example request

<details>
  <summary>CURL</summary>

  ```bash
  $ curl https://roster-rosie.site.com/api/all-team-member
  ```

</details>

<details>
  <summary>Ruby</summary>

  ```ruby
    require "net/http"

    # build request
    uri = URI("https://roster-rosie.site.com/api/all-team-member")
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
      url: 'https://roster-rosie.site.com/api/all-team-member',
      headers: {
      'Content-Type': 'application/json'
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

The successful response will have a `200 OK` response code and a JSON body containing the team [Roster](link):

```json
HTTP/1.1 200 OK
Content-type: application/json

{
  "members": [
    {
      "name": "Walter Goggins",
      "slackID": "12345"
    },
    {
      "name": "Aimee Lou Wood",
      "slackID": "67890"
    },
    // <...>
  ]
}
```
