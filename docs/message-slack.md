# Message Slack

This endpoint is called to trigger a Slack workflow that posts a message containing a current lead name to the team Slack channel. Learn more about how it works: [Posting messages to Slack channels](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#posting-messages-to-slack-channels).

```bash
POST /api/message-slack
```

The API takes a body specifying the [Event](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#events) that the message is to be posted for.

| Name | Required | Type | Description |
| :--- | :---: | :---: |:--- |
| event | yes | string | "standup" or "retro" |

## Example request

<details>
  <summary>CURL</summary>

  ```bash
  $ curl -X POST  https://roster-rosie.site.com/api/message-slack \
    -H "Content-Type: application/json" \
    -d '{"event": "standup"}'
  ```

</details>

<details>
  <summary>Ruby</summary>

  ```ruby
    require "net/http"

    # build request
    uri = URI("https://roster-rosie.site.com/api/message-slack")
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
      url: 'https://roster-rosie.site.com/api/message-slack',
      headers: {
      'Content-Type': 'application/json'
      },
      data: {
        event: 'retro'
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

A successful request will return `200 OK` response code and a confirmation message containing the name of the new current lead and event (can be used for logging purposes).

```bash

HTTP/1.1 200 OK

"===== Sent slack message, standup lead is Walter Goggins ====="

```

## Troubleshooting

### 400 Bad Request

This likely means that either your request URL is malformed, or the content type of the request body is incorrect.
* Check the URL and make sure it looks like: `/api/message-slack`.
* Make sure you set the `Content-Type` header to `application/json`.

Please refer to [code examples](#example-request) for request examples in select languages.

### 422 Unprocessable Entity

This may mean that your request body looks good, but the data in it is incorrect. Make sure that your request body contains a valid and [supported event type](https://github.com/chivoi/roster-rosie/wiki/Resources-&-Definitions#supported-events):
```javascript
{
  "event": "standup" // or "retro"
}
```
