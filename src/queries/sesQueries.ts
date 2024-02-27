export const payment: string = `SELECT name, clg_name, id FROM users WHERE email=$1`;
export const emergency: string = `SELECT user_email FROM users_events WHERE event_id=$1`;
