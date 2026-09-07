export interface IndexData {
  id: number;
  hero_banner: string | null;
  hero_image: string | null;
  greeting_title: string;
  greeting_description: string;
  about_me_title: string;
  about_me_description: string;
  about_prokope_title: string;
  about_prokope_description: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  author: string;
  created_on: string;
  updated_on: string;
  status: number;
  thumb: string | null;
  tag: string[];
  content: string;
}

export interface PostDetail extends Omit<Post, 'tag'> {
  content: string;
  tag: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  country: string;
}

export interface CityPhoto {
  id: number;
  title: string;
  slug: string;
  image: string;
  view_count: number;
  date_added: string;
  date_taken: string;
  caption: string;
  get_display_url: string;
  get_thumbnail_url: string;
  city: number | null;
  country: number | null;
}

export interface CityGallery {
  id: number;
  title: string;
  slug: string;
  city: City;
  city_photos: CityPhoto[];
  date_added: string;
  is_public: boolean;
}

export interface CountryAlbum {
  id: number;
  title: string;
  slug: string;
  country: Country;
  city_galleries: CityGallery[];
  tags: string[];
}

export interface CountryAlbumList {
  id: number;
  title: string;
  slug: string;
  country: string;
  city_galleries: CityGallery[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SearchBlogItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  tag: string[];
}

export interface SearchResults {
  about_me: IndexData[];
  about_prokope: IndexData[];
  blog: SearchBlogItem[];
  gallery: CountryAlbumList[];
  query?: string;
  error?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}