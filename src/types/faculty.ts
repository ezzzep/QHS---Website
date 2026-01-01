export interface Faculty {
  id: string;
  name: string;
  position: string;
  image_url: string | null;
  order_index: number;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  image: string;
  content: string[];
}
