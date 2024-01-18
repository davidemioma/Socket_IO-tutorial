import { z } from "zod";

export const fileChatSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
});

export type fileChatData = z.infer<typeof fileChatSchema>;
