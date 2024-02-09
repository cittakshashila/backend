export const createUser: string = `INSERT INTO users (name,email,phone_no,clg_name) VALUES ($1,$2,$3,$4)`;
export const getUserDetails: string = `SELECT * FROM users WHERE email=$1`;
export const deleteFromCart: string = `
    DELETE FROM users_events
    WHERE user_email = $1
    AND event_id NOT IN (SELECT unnest($2::varchar[])) AND users_events.paid = false;
`;
export const insertMissingOnes: string = `
    INSERT INTO users_events (user_email, event_id)
    SELECT $1::varchar, unnest($2::varchar[])
    ON CONFLICT (event_id, user_email) DO NOTHING`;
export const getCart: string = `SELECT
    ue.event_id,
    e.name,
    p.name,
    ue.user_email
FROM users_events ue
JOIN events e ON ue.event_id = e.id
JOIN pass p ON e.pass_id = p.id
WHERE ue.user_email= $1;
`;
export const begin: string = "BEGIN";
export const commit: string = "COMMIT";
export const rollback: string = "ROLLBACK";
