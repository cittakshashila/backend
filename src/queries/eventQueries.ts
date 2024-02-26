export const createEvent: string = `INSERT INTO
events (id, name, fee, pass_id) VALUES ($1, $2, $3, $4)`;
export const editEvent: string = `UPDATE events SET
    name = $2,
    fee = $3,
    pass_id = $4
WHERE id = $1 returning *`;
