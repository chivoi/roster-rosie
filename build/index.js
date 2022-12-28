"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ocean_roster_json_1 = __importDefault(require("./files/ocean-roster.json"));
var node_schedule_1 = __importDefault(require("node-schedule"));
var axios_1 = __importDefault(require("axios"));
var path_1 = __importDefault(require("path"));
require('dotenv').config({ path: path_1.default.resolve(__dirname, '../.env') });
var SLACK_WEBHOOK_URL = process.env.WEBHOOK_URL || '';
if (!SLACK_WEBHOOK_URL) {
    throw new Error("Failed to load env config");
}
var rosterMembers = ocean_roster_json_1.default.members;
var currentLeadIndex = 0;
var nextLeadIndex = 1;
var rotateLead = function () {
    currentLeadIndex = nextLeadIndex;
    nextLeadIndex = (nextLeadIndex + 1) % rosterMembers.length;
};
var reportLeadJob = node_schedule_1.default.scheduleJob('*/2 * * * *', function () {
    var currentLead = rosterMembers[currentLeadIndex];
    var nextLead = rosterMembers[nextLeadIndex];
    // rotate the lead on Monday
    var today = new Date();
    if (today.getDay() === 1) {
        rotateLead();
    }
    // post the lead and next info to Slack
    axios_1.default.post(SLACK_WEBHOOK_URL, {
        standup_lead: currentLead.slackID,
        next: nextLead.slackID
    }).then(function (response) {
        console.log(response.status);
    }).catch(function (e) {
        console.log(e.status);
    });
});
reportLeadJob.invoke();
