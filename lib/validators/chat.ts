import { z } from "zod";

export const chatSchema = z.object({
  content: z.string().min(1),
});

export type chatData = z.infer<typeof chatSchema>;
