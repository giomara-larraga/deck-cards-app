import { z } from "zod";

export const cardSchema = z.object({
    id: z.number(),
    name: z.string(),
    shortname: z.string(),
    description: z.string().optional(),
});

export type CardType = z.infer<typeof cardSchema>;


export const rankSchema = z.object({
    id: z.number(),
    rank: z.number(),
    items: z.array(z.number()).optional() // refine as needed
});

export type rankType = z.infer<typeof rankSchema>;

export const boardSchema = z.object({
    id: z.number(),
    ranks: z.array(rankSchema),
});

export type boardType = z.infer<typeof boardSchema>;


