export const getAllEvents: string = `
SELECT
    event_id,
    name,
    img_link,
    tag_line,
    date,
    description 
FROM events`;
export const getEventDetails: string = `
SELECT
    e.event_id,
    e.name AS event_name,
    e.description,
    e.tag_line,
    e.rules,
    e.img_link,
    e.fee,
    e.team_size,
    e.date,
    e.youtube,
    e.instagram,
    e.first_prize,
    e.second_prize,
    e.third_prize,
    i.name AS incharge_name,
    i.id AS incharge_id,
    i.phone_no
FROM
    events e
LEFT JOIN
    incharge_event ie ON e.event_id = ie.event_id
LEFT JOIN 
    incharges i ON i.id = ie.incharge_id
WHERE 
    e.event_id = $1;
`;
export const createEvent: string = `INSERT INTO
    events (name, description, tag_line, rules, img_link, fee, date, team_size, youtube, instagram, first_prize, second_prize, third_prize, is_paid)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`;
export const deleteEvent: string = "DELETE FROM events WHERE event_id=$1";
export const updateEvent: string = `UPDATE events SET 
     name = $1,
     description = $2,
     tag_line = $3,
     rules = $4,
     img_link = $5,
     fee = $6,
     date = $7,
     team_size = $8,
     youtube = $9,
     instagram = $10,
     first_prize = $11,
     second_prize = $12,
     third_prize = $13,
     is_paid = $14
WHERE event_id=$15`;
