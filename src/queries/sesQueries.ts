export const payment: string = `select name,clg_name,id from users where email=$1`;
export const emergency: string = `select user_email from users_events where event_id=$1`;
