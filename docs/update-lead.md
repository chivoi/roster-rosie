# Update Lead

When the person on duty is not able to lead (for example, out sick for the week), one can call the Update Lead endpoint to update the duty to a particular [Team Member](link). To quickly rotate the duty to the next person in line, one can call the [Rotate Lead](link) endpoint instead.

```bash
POST /api/lead/update
```

The API takes a body specifying the event that the lead needs to be rotated for, and the id (index) of the new lead.

| Name | Required | Type | Description |
| :--- | :---: | :---: |:--- |
| event | yes | string | "standup" or "retro" |
| id | yes | number | the index of the Team Member in the Roster |

## Request headers (optional)

This is a very simple API, and this endpoint does not require any special headers, but for the sake of demonstration let's pretend it might.

| Name | Type |   Description |
| :--- | :---:  |:--- |
| Authorization | string | Bearer token. To learn more about what it is and how to generate it, click this [empty link](empty.link) |

## Example request

<details>
  <summary>CURL</summary>

  ```bash
  $ curl -X POST  https://roster-rosie.site.com/api/lead/update \
    -H "Authorization: Bearer <your_bearer_token>" \
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
    token = "Sample-bearer-token"
    json_body = '{"event": "standup", "id": 2}'
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
      url: 'https://roster-rosie.site.com/api/lead/update',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <token-value>',
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
      .catch(e => {
        console.log(error);
    });
  ```

</details>

## Example response

Successful request will return `200 OK` response code and a confirmation message containing the name of the new current lead (can be used for logging purposes).

```bash

HTTP/1.1 200 OK

"===== The current lead is updated to Jason Isaacs ====="

```
