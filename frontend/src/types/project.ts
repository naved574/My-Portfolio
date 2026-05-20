export type Project = {
  id: string;
  title: string;
  slug: string;
  bio: string;
  overview: string;
  purpose: string;
  work: string;
  description: string;
  features: string[];
  challenges: string[];
  stack: string[];
  image: string;
  gallery: string[];
  live?: string;
  code?: string;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectPayload = Omit<Project, "id" | "createdAt" | "updatedAt">;

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

