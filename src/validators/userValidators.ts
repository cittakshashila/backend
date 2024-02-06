import { z } from "zod";

const UserSchema = z
  .object({
    id: z.string(),
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(4, "Name should be atleast 4 characters")
      .max(15, "Name should be atmost 15 characters"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Not a valid email"),
    clg_name: z.string()
      .min(4, "Collage Name should be atleast 4 characters")
      .max(50, "Collage Name should be atmost 50 characters"),
    phone_no: z.string()
      .length(10, "Mobile number should be 10 digits long"),
  });

const createUserValidator = UserSchema.omit({ id: true, email: true });
const emailValidator = UserSchema.pick({ email: true });
const uuidValidator = UserSchema.pick({ id : true });

export {
  createUserValidator,
  emailValidator,
  uuidValidator,
  UserSchema,
};
