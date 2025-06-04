export type Card = {
    id: number;
    name: string;
    shortname: string;
  };

export type BoardItem = {
    id: number;
    name: string;
    items: any[]; // refine as needed
  };