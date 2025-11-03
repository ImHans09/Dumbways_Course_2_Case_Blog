// Create Post model
export interface Post {
  id: number,
  title: string,
  content: string
}

// Initialize posts dummy data
export const posts: Post[] = [
  {id: 1, title: "Post Pertama", content: "Content 1"},
  {id: 2, title: "Post Kedua", content: "Content 2"},
  {id: 3, title: "Post Ketiga", content: "Content 3"}
];