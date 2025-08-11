import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { useToast } from '../components/ui/use-toast';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  Reply, 
  Eye,
  Calendar,
  User,
  Tag,
  Upload,
  Send,
  X,
  ChevronDown,
  Star,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Bell,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';

// Types
interface ForumPost {
  id: string;
  title: string;
  content: string;
  type: 'query' | 'reference';
  author: string;
  authorRole: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  replies: number;
  views: number;
  bookmarks: number;
  tags: string[];
  category: string;
  status: 'open' | 'answered' | 'closed';
  isBookmarked: boolean;
  isFollowing: boolean;
  userVote?: 'up' | 'down';
  attachments?: Attachment[];
}

interface Reply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorRole: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  isAccepted?: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface UserContributions {
  askedPosts: ForumPost[];
  replies: Reply[];
  bookmarks: ForumPost[];
  upvotes: ForumPost[];
}

const GuidanceAndReferenceModule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState("forum");
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAskDialog, setShowAskDialog] = useState(false);
  const [askTabType, setAskTabType] = useState<'query' | 'reference'>('query');
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showPostDetails, setShowPostDetails] = useState(false);

  // Professional categories
  const professionalCategories = [
    "Legal & Compliance",
    "Financial Services", 
    "Tax & Accounting",
    "Corporate Governance",
    "Regulatory Affairs",
    "Risk Management",
    "Audit & Assurance",
    "Business Strategy",
    "Technology & IT",
    "Human Resources"
  ];

  // Mock data
  const mockPosts: ForumPost[] = [
    {
      id: "1",
      title: "Need guidance on NCLT proceedings for corporate insolvency",
      content: "I'm handling a corporate insolvency case and need expert guidance on NCLT proceedings. What are the key documentation requirements and timelines?",
      type: "query",
      author: "Rajesh Kumar",
      authorRole: "Corporate Lawyer",
      createdAt: new Date(2024, 0, 15),
      updatedAt: new Date(2024, 0, 15),
      upvotes: 12,
      downvotes: 1,
      replies: 8,
      views: 156,
      bookmarks: 5,
      tags: ["NCLT", "Corporate Insolvency", "Legal Proceedings"],
      category: "Legal & Compliance",
      status: "answered",
      isBookmarked: false,
      isFollowing: true,
      userVote: "up"
    },
    {
      id: "2", 
      title: "Looking for experienced GST consultant in Mumbai",
      content: "Need a reliable GST consultant for a mid-size manufacturing company. Must have experience with complex input tax credit scenarios.",
      type: "reference",
      author: "Priya Sharma",
      authorRole: "Finance Manager",
      createdAt: new Date(2024, 0, 12),
      updatedAt: new Date(2024, 0, 14),
      upvotes: 8,
      downvotes: 0,
      replies: 12,
      views: 89,
      bookmarks: 3,
      tags: ["GST", "Tax Consultant", "Mumbai"],
      category: "Tax & Accounting",
      status: "open",
      isBookmarked: true,
      isFollowing: false
    }
  ];

  // Initialize posts
  useEffect(() => {
    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
  }, []);

  // Filter and search posts
  useEffect(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === "all" || post.type === filterType;
      const matchesStatus = filterStatus === "all" || post.status === filterStatus;
      const matchesCategory = filterCategory === "all" || post.category === filterCategory;
      
      return matchesSearch && matchesType && matchesStatus && matchesCategory;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "popular":
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        case "replies":
          return b.replies - a.replies;
        case "views":
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [posts, searchTerm, filterType, filterStatus, filterCategory, sortBy]);

  // Handle voting
  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote;
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        let newUserVote: 'up' | 'down' | undefined = voteType;

        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;

        if (currentVote === voteType) {
          newUserVote = undefined;
        } else {
          if (voteType === 'up') newUpvotes++;
          if (voteType === 'down') newDownvotes++;
        }

        return { ...post, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
      }
      return post;
    }));
  };

  // Handle bookmark
  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked,
          bookmarks: post.isBookmarked ? post.bookmarks - 1 : post.bookmarks + 1
        };
      }
      return post;
    }));
  };

  // Handle follow
  const handleFollow = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isFollowing: !post.isFollowing
        };
      }
      return post;
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !postTags.includes(newTag.trim())) {
      setPostTags([...postTags, newTag.trim()]);
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setPostTags(postTags.filter(tag => tag !== tagToRemove));
  };

  // Create post
  const handleCreatePost = () => {
    if (!postTitle.trim() || !postContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newPost: ForumPost = {
      id: Date.now().toString(),
      title: postTitle,
      content: postContent,
      type: askTabType,
      author: "Current User",
      authorRole: "Service Provider",
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      replies: 0,
      views: 0,
      bookmarks: 0,
      tags: postTags,
      category: "General",
      status: "open",
      isBookmarked: false,
      isFollowing: true
    };

    setPosts([newPost, ...posts]);
    setPostTitle("");
    setPostContent("");
    setPostTags([]);
    setShowAskDialog(false);
    
    toast({
      title: "Success",
      description: `${askTabType === 'query' ? 'Query' : 'Reference request'} posted successfully`
    });
  };

  // View post details
  const viewPostDetails = (post: ForumPost) => {
    setSelectedPost(post);
    setShowPostDetails(true);
  };

  // Get pagination data
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Guidance and Reference</h1>
              <p className="text-gray-600 mt-1">Ask questions, share knowledge, and find professional references</p>
            </div>
            
            <Dialog open={showAskDialog} onOpenChange={setShowAskDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ask & Refer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ask & Refer</DialogTitle>
                </DialogHeader>
                
                <Tabs value={askTabType} onValueChange={(value) => setAskTabType(value as 'query' | 'reference')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="query">Ask a Query</TabsTrigger>
                    <TabsTrigger value="reference">Request a Reference</TabsTrigger>
                  </TabsList>

                  <TabsContent value="query" className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Query Title *
                      </label>
                      <Input
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="What do you need help with?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <Textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Provide details about your question..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="reference" className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Request Title *
                      </label>
                      <Input
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="What type of professional are you looking for?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <Textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Describe the professional services you need..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Tags */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {postTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAskDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreatePost}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post {askTabType === 'query' ? 'Query' : 'Reference Request'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="forum">Forum View</TabsTrigger>
              <TabsTrigger value="contributions">My Contributions</TabsTrigger>
            </TabsList>

            <TabsContent value="forum" className="space-y-6">
              {/* Filters and Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <Input
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="query">Queries</SelectItem>
                        <SelectItem value="reference">References</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="answered">Answered</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {professionalCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="replies">Most Replies</SelectItem>
                        <SelectItem value="views">Most Views</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Posts List */}
              <div className="space-y-4">
                {paginatedPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={post.type === 'query' ? 'default' : 'secondary'}>
                              {post.type === 'query' ? 'Query' : 'Reference'}
                            </Badge>
                            <Badge variant="outline">{post.status}</Badge>
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                          <h3 
                            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                            onClick={() => viewPostDetails(post)}
                          >
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(post.createdAt, 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Reply className="h-4 w-4" />
                            {post.replies}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(post.id, 'up')}
                            className={post.userVote === 'up' ? 'text-green-600' : ''}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="ml-1">{post.upvotes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(post.id, 'down')}
                            className={post.userVote === 'down' ? 'text-red-600' : ''}
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span className="ml-1">{post.downvotes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBookmark(post.id)}
                            className={post.isBookmarked ? 'text-yellow-600' : ''}
                          >
                            <Bookmark className="h-4 w-4" />
                            <span className="ml-1">{post.bookmarks}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFollow(post.id)}
                            className={post.isFollowing ? 'text-blue-600' : ''}
                          >
                            <Bell className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationNext
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contributions">
              <Card>
                <CardHeader>
                  <CardTitle>My Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your contributions will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GuidanceAndReferenceModule;
