"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
var ocean_roster_json_1 = __importDefault(require("./files/ocean-roster.json"));
var node_schedule_1 = __importDefault(require("node-schedule"));
var axios_1 = __importDefault(require("axios"));
var hello = function (what) {
    return "Hello ".concat(what, "!");
};
exports.hello = hello;
var job = node_schedule_1.default.scheduleJob('*/2 * * * *', function () {
    console.log((0, exports.hello)(ocean_roster_json_1.default.members[0]["name"]));
    console.log(new Date());
    axios_1.default.post('https://hooks.slack.com/workflows/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', {
        standup_lead: ocean_roster_json_1.default.members[0].slackID,
        next: ocean_roster_json_1.default.members[1 + 1].slackID
    }).then(function (response) {
        console.log(response.status);
    }).catch(function (e) {
        console.log(e.response.statusText);
    });
});
job.invoke();
// DISPLAY NAME: need to send a request to fetch it I think
// I will need the app with scopes to read users
// SKIP LEAD: a person is on holidays or sick?
// make it pull a holiday schedule from calendar or something?
// make it check if the person is in first? How?
// both standup lead and next in line are not in today
// then just volunteer can run standup
