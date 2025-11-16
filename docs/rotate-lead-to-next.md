# Rotate lead to next in line

When the person on duty is not able to lead (for example, out sick for the week), calling the Rotate lead endpoint is a quick and handy way to move on to the next person in line.

```bash
POST /api/rotate-lead
```

This endpoint rotates the lead duty to the next [Team Member](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#team-member) in the [Roster](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#roster) by adding 1 to both current and next lead indices in the [Duty Object](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#duty-object), for example `{"current": 0, "next": 1}` will become: `{"current": 1, "next": 2}`.

The API takes a body specifying the [Event](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#events) that the lead is to be rotated for:

| Name | Required | Type | Description |
| :--- | :---: | :---: |:--- |
| event | yes | string | "standup" or "retro" |

## Example request

<details>
  <summary>CURL</summary>

  ```bash
  $ curl -X POST  https://roster-rosie.site.com/api/rotate-lead \
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
    json_body = '{"event": "standup"}'
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
      url: 'https://roster-rosie.site.com/api/rotate-lead',
      headers: {
      'Content-Type': 'application/json'
      },
      data: {
        event: 'retro',
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

A successful request will return `200 OK` response code and a confirmation message containing the name of the current lead after rotation (can be used for logging purposes).

```bash

HTTP/1.1 200 OK

"===== The current lead is updated to Aimee Lou Wood ====="

```

## Troubleshooting

### 400 Bad Request

This likely means that either your request URL is malformed, or the content type of the request body is incorrect.
* Check the URL and make sure it looks like: `/api/rotate-lead`.
* Make sure you set the `Content-Type` header to `application/json`.

Please refer to [code examples](#example-request) for request examples in select languages.

### 422 Unprocessable Entity

This may mean that your request body looks good, but the data in it is incorrect. Make sure that your request body contains a valid and [supported event type](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#supported-events):
```javascript
{
  "event": "standup" // or "retro"
}
```
