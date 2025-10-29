# Resources & Definitions

## Team member

Team Member (or Member) is an object containing a team member name and their Slack ID

```json
  {
    "name": "Walter Goggins",
    "slackID": "12345"
  }
```

## Roster

A Roster object is the collection of Team Members. The `id` of the Team Member is their index in the array.

```json
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
    {
      "name": "Paker Posey",
      "slackID": "98765"
    }
  ]
}
```

## Duty Object

A Duty Object is used under the hood as a handy way to fetch and update current and next leads.

It contains the [Roster](#roster) indices (ids) of the current and the next lead:

```json
  { 
    "current": 0,
    "next": 1
  }
```

Duty Objects come from a Duty Files that are stored and read from the AWS S3 buckets and exist separately for every event.

## Events

Since you are reading docs for this API, you are probably familiar with what Scrum and Scrum ceremonies are. If that's not the case, here is a good place to read about [Standups (or Daily Scrums)](https://www.scrum.org/learning-series/daily-scrum/), [Sprint Retrospectives](https://www.scrum.org/learning-series/sprint-retrospective/) and the [Scrum framework](https://www.scrum.org/learning-series/what-is-scrum/) in general.

### Supported events

The 2 events currently supported are: a Standup (or Daily Standup or Daily Scrum), a Retro (or Sprint Retrospective).

### Event cadence

This API design assumes the following cadence of events:

- **Standup**: happens every day of the week. A Team Member on duty will run standups for one whole week, then the duty is passed on to the next Team Member on the Roster.
- **Retro**: happens once a week every other week. A Team Member on duty will run a single retro, then the duty is passed on to the next Team Member on the Roster.

## Current VS Next Lead

Current lead is the Team Member that leads current week's Standups / the upcoming Retrospective. Next lead is the Team Member that comes after them in the Roster.

## Posting messages to Slack channels

### How Rosie works with Slack webhooks

Roster Rosie can post messages to Slack, however she is only the part of the setup: calling [Message Slack](link) endpoint triggers a custom Slack webhook, which does the rest of the work.

The request body Rosie sends to Slack looks like a [Duty Object](link) with Slack IDs of the members on duty:

```javascript
{
  current: 12345, 
  next: 67890,
}
```

The channel to post messages to, message text and formatting are configured on the Slack side. More information on using Slack webhooks to send messages is available in [Slack Developer docs](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/)

### Configuring webhooks

Roster Rosie was built with a single purpose and team in mind, so the Slack channel is not configurable at the moment.

However, Slack config comes from the `ENV` object (as `SLACK_WEBHOOK_URL` for standups and `RETRO_SLACK_WEBHOOK_URL` for retros), so if you would like to use the app with your webhooks, you can configure those variables in your `ENV` object locally or during deployment via your hosting site.
