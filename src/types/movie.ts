export interface Movie {
  id?: string;
  title: string;
  ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
  poster: string;
  producer: string;
  story: string;
  actors: {
    name: string;
    image: string;
  }[];
  duration: string;
  rating: number;
  releaseYear:number,
  
}
export interface Movie2 extends Movie {

  views: number
}
