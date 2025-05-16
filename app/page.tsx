"use client"; // Make this a client component

import { Suspense, useState, useEffect } from "react"; // Added useState, useEffect
// Link is not directly used for modal triggers anymore from here, but PostForm might use it.
import { getPosts, type Post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input"; // Added Input
import {
  Plus,
  MoreVertical, // Removed MoreHorizontal
  ChevronsUpDown,
  ArrowDownUp, // Added for sort icon
  X,
  Search,
  Pencil, // Added for close icon in drawer
  // Search, // Optionally add Search icon if needed later
} from "lucide-react"; // Removed PlusCircle
import DeleteButton from "@/components/delete-button";
import CreatePostModal from "@/components/modals/CreatePostModal";
import EditPostModal from "@/components/modals/EditPostModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

// export const dynamic = "force-dynamic"; // Not applicable for client components directly
// export const revalidate = 0; // Not applicable for client components directly

interface PostCardActionsProps {
  post: Post;
  onEdit: () => void;
  onDeleteSuccess: () => void;
}

function PostCardActions({
  post,
  onEdit,
  onDeleteSuccess,
}: PostCardActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="!size-6" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="!size-4" />
          Edit
        </DropdownMenuItem>
        {/* DeleteButton is now a self-contained menu item with its own modal logic */}
        <DeleteButton
          id={post.id.toString()}
          postTitle={post.title}
          isMenuItem
          onDeleteSuccess={onDeleteSuccess}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface PostsListProps {
  initialPosts: Post[];
  onEditPost: (post: Post) => void;
  onPostDeleted: () => void; // To trigger re-fetch or update list
}

function PostsListClient({
  initialPosts,
  onEditPost,
  onPostDeleted,
}: PostsListProps) {
  // This component receives posts and handlers from its parent (Home)
  // It's a client component because it maps and uses client-side actions (onEditPost)
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">No posts found</h2>
        <p className="mb-4">Get started by creating your first post.</p>
        {/* Create button is in the Home component's header */}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {posts.map((post) => (
        <Card key={post.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="justify-between flex items-center">
              <span>{post.title}</span>
              <PostCardActions
                post={post}
                onEdit={() => onEditPost(post)}
                onDeleteSuccess={onPostDeleted}
              />
            </CardTitle>{" "}
            <CardDescription className="text-[16px] leading-4">
              <span className="text-[#6B7280]">
                {" "}
                {new Date(post.createdAt).toLocaleDateString("no-NB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}{" "}
                (
                {new Date(post.createdAt).toLocaleTimeString("no-NB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                ){" "}
              </span>
              <span className="text-[#4F46E5]">
                Edited:{" "}
                {new Date(post.updatedAt).toLocaleDateString("no-NB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}{" "}
                (
                {new Date(post.updatedAt).toLocaleTimeString("no-NB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                )
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <p className="whitespace-pre-line text-sm">{post.content}</p>
          </CardContent>
          <CardFooter className="flex text-sm">
            <span>
              By{" "}
              <span className="text-[#4F46E5] font-semibold">
                {post.author}
              </span>
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function PostsListSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="grow min-h-[60px]">
            <Skeleton className="h-12 w-full" />
          </CardContent>
          <CardFooter className="flex justify-end items-center pt-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// This is the main default export for the page, now a client component.
export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("date-desc");
  const [searchTerm, setSearchTerm] = useState<string>(""); // Added searchTerm state

  const isMobile = useIsMobile();

  const fetchAndSetPosts = async () => {
    setIsLoadingPosts(true);
    try {
      let fetchedPosts = await getPosts();

      // Apply search filtering
      if (searchTerm && fetchedPosts) {
        fetchedPosts = fetchedPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      if (fetchedPosts) {
        fetchedPosts = fetchedPosts.sort((a, b) => {
          switch (sortOrder) {
            case "date-asc":
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            case "title-asc":
              return a.title.localeCompare(b.title);
            case "title-desc":
              return b.title.localeCompare(a.title);
            case "date-desc":
            default:
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
          }
        });
      }
      setPosts(fetchedPosts || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]); // Set to empty array on error
    }
    setIsLoadingPosts(false);
  };

  useEffect(() => {
    fetchAndSetPosts();
  }, [searchTerm, sortOrder]); // Re-fetch when searchTerm or sortOrder changes

  const handleSortChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder);
    if (isMobile) {
      setIsFilterDrawerOpen(false); // Close drawer after selection
    }
    // fetchAndSetPosts will be called by the useEffect due to sortOrder change
  };

  const handleModalClose = () => {
    fetchAndSetPosts(); // Refetch with current sort order
    // Also ensure PostForm calls a similar refresh or its onFormSubmitSuccess callback
  };

  const filterOptions = [
    { label: "Date", value: "date-desc" },
    { label: "Title (A-Z)", value: "title-asc" },
  ];

  const renderFilterControls = () => {
    return filterOptions.map((option) => (
      <Button
        key={option.value}
        variant={sortOrder === option.value ? "default" : "ghost"}
        onClick={() => handleSortChange(option.value)}
        className="w-full justify-start"
      >
        {option.label}
      </Button>
    ));
  };

  return (
    <main className="container py-8 px-4 max-w-lg gap-4 flex flex-col">
      {/* Header: Title, Create Button (Desktop), Search (Desktop), Sort/Filter (Desktop), Mobile Controls */}
      <h1 className="text-3xl font-bold hidden md:block">Messages</h1>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold md:hidden">Messages</h1>{" "}
        {/* Adjusted mb for mobile search */}
        {/* Left Group: Title and Desktop Create Button */}
        <div className="flex items-center gap-4">
          {!isMobile && (
            <Button
              variant={"outline"}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 pr-3.5 pl-3 py-1.5 h-10 rounded-full"
            >
              <Plus className="!size-5" /> {/* Removed font- typo */}
              <span className="text-sm leading-4">New message</span>
            </Button>
          )}
        </div>
        {/* Right Group: Desktop Search & Sort / Mobile Filter & Create */}
        {!isMobile ? (
          // Desktop: Search and Sort controls
          <div className="flex items-center gap-2">
            <div className="relative flex items-center ml-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 rounded-full pl-12 bg-border" // Added pl-10 for icon spacing
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="p-0 flex items-center gap-1 h-9 px-3" // Made height consistent with search
                  variant={"ghost"}
                >
                  <span className="text-sm leading-4 font-medium">
                    {
                      filterOptions.find((option) => option.value === sortOrder)
                        ?.label
                    }
                  </span>
                  <ChevronsUpDown className="!size-5" />{" "}
                  {/* Adjusted icon size */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={sortOrder === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // Mobile: Filter and Create buttons
          <div className="flex gap-2 items-center">
            <Drawer
              open={isFilterDrawerOpen}
              onOpenChange={setIsFilterDrawerOpen}
            >
              <DrawerTrigger asChild>
                <Button className="p-0" variant={"ghost"}>
                  <ChevronsUpDown className="!size-7" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="flex justify-between items-center">
                  <DrawerTitle>Sort & Filter</DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <DrawerDescription className="px-4 pb-2">
                  Choose how to sort the posts.
                </DrawerDescription>
                <div className="p-4 border-t">
                  <div className="flex flex-col gap-2">
                    {renderFilterControls()}
                  </div>
                </div>
                <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Button
              className="p-0"
              variant={"ghost"}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="!size-8" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Search Input */}
      {isMobile && (
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-full pl-12 bg-border" // Added pl-10 for icon spacing, corrected rounded-full
          />
        </div>
      )}

      {isLoadingPosts ? (
        <PostsListSkeleton />
      ) : (
        <PostsListClient
          initialPosts={posts}
          onEditPost={setEditingPost}
          onPostDeleted={() => fetchAndSetPosts()} // Re-fetch posts on delete with current sort
        />
      )}

      {isCreateModalOpen && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onOpenChange={(isOpen) => {
            setIsCreateModalOpen(isOpen);
            if (!isOpen) handleModalClose(); // Refresh if modal is closed
          }}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          isOpen={!!editingPost}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditingPost(null);
              handleModalClose(); // Refresh if modal is closed
            }
          }}
        />
      )}
    </main>
  );
}

