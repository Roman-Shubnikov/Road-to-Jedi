export const sendEvent = (event_type, value) => {
    window.ym(86951362, event_type, value)
}
export const sendHit = (page) => {
    sendEvent('hit', page)
}
export const sendGoal = (goal_id) => {
    sendEvent('reachGoal', goal_id)
}