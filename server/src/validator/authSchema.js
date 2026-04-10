import { z } from "zod"
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Setup DOMPurify with JSDOM
const window =  new JSDOM("").window;
const purify = DOMPurify(window);

// Helper function to sanitize strings
const clean = (val) => purify.sanitize(val.trim());

export const loginValidations = z.object({
  email: z.string().email("Enter valid Email").transform(value => clean(value)),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
    "Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character"
  ).transform(value => clean(value)),
})

export const signupValidations = loginValidations.extend({
  name: z.string().min(3, "Name Must contain minimun 3 character").max(255).transform(value => clean(value)),
})