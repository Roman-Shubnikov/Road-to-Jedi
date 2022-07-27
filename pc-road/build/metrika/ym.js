"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGoal = exports.sendHit = exports.sendEvent = void 0;
const sendEvent = (event_type, value) => {
    window.ym(86951362, event_type, value);
};
exports.sendEvent = sendEvent;
const sendHit = (page) => {
    (0, exports.sendEvent)('hit', page);
};
exports.sendHit = sendHit;
const sendGoal = (goal_id) => {
    (0, exports.sendEvent)('reachGoal', goal_id);
};
exports.sendGoal = sendGoal;
