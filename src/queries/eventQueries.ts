export const createEvent: string = `INSERT INTO
events (id, name, fee, pass_id) VALUES ($1, $2, $3, $4)`;
