export type Card = {
    id: number;
    name: string;
    shortname: string;
    min: number;
    max:number;
    average: number;
    median: number;
  };

export type BoardItem = {
    id: number;
    rank: number;
    value: number;
    isBlank: boolean;
    items: any[]; // refine as needed
  };