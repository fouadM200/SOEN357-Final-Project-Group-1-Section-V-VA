export type Testimonial = {
    name: string;
    text: string;
};

export type Coach = {
    id: string;
    name: string;
    image: any;
    rating: number;
    price: number;
    languages: string[];
    description: string;
    biography: string;
    testimonials: Testimonial[];
};