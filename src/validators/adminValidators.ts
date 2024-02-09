import { z } from "zod";
const AdminSchema = z.object({
  uname: z
    .string({ required_error: "uname is required" })
    .max(10, "user name should be atmost 10 characters"),
  password: z.string(),
  event_id: z.string(),
  user_email: z
    .string({ required_error: "email is required" })
    .email("email is not valid"),
});
const EventIdValidator = AdminSchema.pick({ event_id: true });
const UserEmailValidator = AdminSchema.pick({ user_email: true });
const EventLoginValidator = AdminSchema.pick({
  event_id: true,
  password: true,
});
const UserSignUpValidator = AdminSchema.pick({ uname: true, password: true });
export {
  EventIdValidator,
  UserSignUpValidator,
  EventLoginValidator,
  UserEmailValidator,
};
