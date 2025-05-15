// Update this URL with your deployed Nest.js API URL
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://nestjs-posts-git-main-klofnes-projects.vercel.app";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  author: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  author?: string;
}

// Server-side function to get all posts
export async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Server-side function to get a single post
export async function getPost(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
}

// Client-side function to create a post
export async function createPost(data: CreatePostData): Promise<Post> {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.status}`);
  }

  return response.json();
}

// Client-side function to update a post
export async function updatePost(
  id: string,
  data: UpdatePostData
): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update post: ${response.status}`);
  }

  return response.json();
}

// Client-side function to delete a post
export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete post: ${response.status}`);
  }
}

