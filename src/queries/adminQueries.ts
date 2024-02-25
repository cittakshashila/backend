export const updatePaid: string =
  "UPDATE users_events SET paid = true WHERE user_email = $1";
export const allowIfPaid: string = `UPDATE users_events
SET is_present = true WHERE user_email = $1 AND event_id = $2 AND paid = true AND is_present = false RETURNING *`;
export const insertAdmin: string =
  "INSERT INTO admin (uname, password) VALUES ($1, $2)";
export const getAdminPassword: string =
  "SELECT password FROM admin WHERE uname = $1";
export const getUsersforEvent: string = `select u.name, u.phone_no, u.clg_name, ue.is_present, ue.paid from users u join
users_events ue on ue.user_email = u.email where ue.event_id = $1`;
export const insertEvent: string = `insert into events (name, id, fee, pass_id, password) values
($1, $2, $3, $4, $5)`;
export const addEventAdmin: string = `insert into event_admin (id, password) values ($1, $2);`
export const insertEvents4Admin: string = `
    INSERT INTO admin_events(admin_id, event_id)
    SELECT $1::varchar, unnest($2::varchar[])
    ON CONFLICT (admin_id, event_id) DO NOTHING`;
export const getEventAdminPassword: string = `SELECT password FROM event_admin WHERE id = $1`;
export const getAdminEvents: string = `SELECT event_id FROM admin_events WHERE admin_id = $1`;
