# Update Lead by ID

A call to the Update Lead endpoint updates the [Duty](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#duty-object) to a particular [Team Member](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#team-member). To quickly rotate the duty to the next person in line, one can call the [Rotate lead to next in line](https://github.com/chivoi/roster-rosie/wiki/Rotate-lead-to-next-in-line) endpoint instead.

```bash
POST /api/lead/update
```

The API takes a body specifying the event that the lead needs to be rotated for, and the id (index in the [Roster](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#roster) object) of the new lead.

| Name | Required | Type | Description |
| :--- | :---: | :---: |:--- |
| event | yes | string | "standup" or "retro" |
| id | yes | number | the index of the Team Member in the Roster |

## Example request

<details>
  <summary>CURL</summary>

  ```bash
  $ curl -X POST  https://roster-rosie.site.com/api/lead/update \

    -H "Content-Type: application/json" \
    -d '{"event": "standup", "id": 2}'
  ```

</details>

<details>
  <summary>Ruby</summary>

  ```ruby
    require "net/http"

    # build request
    uri = URI("https://roster-rosie.site.com/api/lead/update")
    json_body = '{"event": "standup", "id": 2}'
    request = Net::HTTP::Post.new(uri, "Content-Type": "application/json")
    request.body = json_body
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
      method: 'post',
      url: 'https://roster-rosie.site.com/api/lead/update',
      headers: {
      'Content-Type': 'application/json'
      },
      data: {
        event: 'retro',
        id: 2,
      }
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

A successful request will return `200 OK` response code and a confirmation message containing the name of the new current lead (can be used for logging purposes).

```bash

HTTP/1.1 200 OK

"===== The current lead is updated to Jason Isaacs ====="

```

## Troubleshooting

### 400 Bad Request

This likely means that either your request URL is malformed, or the content type of the request body is incorrect.
* Check the URL and make sure it looks like: `/api/lead/update`.
* Make sure you set the `Content-Type` header to `application/json`.

Please refer to [code examples](#example-request) for request examples in select languages.

### 422 Unprocessable Entity

This may mean that your request body looks good, but the data in it is incorrect. Make sure that your request body contains a valid and [supported event type](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#supported-events) and a valid team member ID as a number:

```javascript
{
  "event": "standup" // or "retro"
  "id": 4
}
```

For a team member ID, refer to your team Roster. The Roster is processed as an array, so your IDs count will start with 0.
