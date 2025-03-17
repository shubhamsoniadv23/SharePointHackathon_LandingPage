// import { z } from "zod";
// import { notifyError } from "../helperFunctions/notification";

// export async function validateData<T>(
//   data: T,
//   schema: z.ZodSchema<T>
// ): Promise<boolean> {
//   try {
//     const result = await schema.safeParseAsync(data);

//     if (!result.success) {
//       throw new Error(result.error.message);
//     }
//     return true;
//   } catch (error) {
//     console.error("Validation error", error);
//     notifyError("Invalid data");
//     return false;
//   }
// }
