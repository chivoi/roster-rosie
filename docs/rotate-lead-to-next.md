# Rotate Lead to Next

When the person on duty is not able to lead (for example, out sick for the week), calling the Rotate Lead to Next endpoint is a quick and handy way to move on to the next person in line.

```bash
POST /api/rotate-lead
```

This endpoint rotates the lead duty to the next [Team Member](link) in the [Roster](link) by adding 1 to both current and next lead indices in the [Duty Object](link), for example `{"current": 0, "next": 1}` will become: `{"current": 1, "next": 2}`.

The API takes a body specifying the event that the lead needs to be rotated for:

| Name | Required | Type | Description |
| :--- | :---: | :---: |:--- |
| event | yes | string | "standup" or "retro" |

## Request headers (optional)

This is a very simple API, and this endpoint does not require any special headers, but for the sake of demonstration let's pretend it might.

| Name | Type |   Description |
| :--- | :---:  |:--- |
| Authorization | string | Bearer token. To learn more about what it is and how to generate it, click this [empty link](empty.link) |

## Example request

<details>
  <summary>CURL</summary>

  ```bash
  $ curl -X POST  https://roster-rosie.site.com/api/rotate-lead \
    -H "Authorization: Bearer <your_bearer_token>" \
    -H "Content-Type: application/json" \
    -d '{"event": "standup"}'
  ```

</details>

<details>
  <summary>Ruby</summary>

  ```ruby
    require "net/http"

    # build request
    uri = URI("https://roster-rosie.site.com/api/rotate-lead")
    token = "Sample-bearer-token"
    json_body = '{"event": "standup"}'
    request = Net::HTTP::Post.new(uri, "Content-Type": "application/json")
    request["Authorization"] = "Bearer #{token}"
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
      url: 'https://roster-rosie.site.com/api/rotate-lead',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <token-value>',
      },
      data: {
        event: 'retro',
      }
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

Successful request will return `200 OK` response code and a confirmation message containing the name of the current lead after rotation (can be used for logging purposes).

```bash

HTTP/1.1 200 OK

"===== The current lead is updated to Aimee Lou Wood ====="

```
