import oceanRoster from "./files/ocean-roster.json";
import schedule from 'node-schedule';
import axios from 'axios';


// Persist current standup lead: write to file, read it from file
// Write into current lead file every day?
// If the app dies on Friday, it will not update.
// Check if it's Friday/Monday => yes => write new current lead to file
// Changes to the list (in case someone's on holiday)

interface OceanList {
  members: {
    name: string;
    slackID: string;
  }[];
}

const getCurrentAndNextLeadAndRotate = (list: OceanList) => {
  const current = list.members.shift();
  let next;
  if (current) {
    list.members.push(current);
    next = list.members[0];
  }
  return { current, next };
};


const job = schedule.scheduleJob('*/2 * * * *', function () {

  const currentLead = getCurrentAndNextLeadAndRotate(oceanRoster);

  axios.post('https://hooks.slack.com/workflows/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', {
    standup_lead: currentLead.slackID,
    next: oceanRoster.members[0].slackID
  }).then(response => {
    console.log(response.status)
  }).catch(e => {
    console.log(e.response.statusText)
  })
})


job.invoke();