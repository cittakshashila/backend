export interface PostgresError extends Error {
  code : string;
}
 
export interface cartType {
  event_id : string,
  fee : number,
  is_present : boolean,
  paid : boolean,
  pass_id : string,
  user_email : string,
  name : string
}
