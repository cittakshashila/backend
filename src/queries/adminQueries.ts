export const updatePaid : string = 'UPDATE users_events SET paid = true WHERE user_email = $1'
export const allowIfPaid : string = `UPDATE users_events
SET is_present = true WHERE user_email = $1 AND event_id = $2 AND paid = true AND is_present = false RETURNING *`
export const insertAdmin : string = "INSERT INTO admin (uname, password) VALUES ($1, $2)"
export const getAdminPassword : string = "SELECT password FROM admin WHERE uname = $1"
export const getEventAdminPassword : string = `SELECT password FROM events WHERE id = $1`
export const getUsersforEvent : string = `select u.name, u.phone_no, u.clg_name, ue.is_present from users u join
users_events ue on ue.user_email = u.email where ue.event_id = $1`
