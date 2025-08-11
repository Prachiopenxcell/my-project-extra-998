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
  Heart,
  Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Types
interface ForumPost {
  id: string;
  title: string;
  content: string;
  type: 'query' | 'reference';
  author: { id: string; name: string; isAnonymous: boolean; };
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  categories: string[];
  status: 'open' | 'resolved' | 'closed';
  replies: Reply[];
  upvotes: number;
  downvotes: number;
  bookmarks: number;
  attachments?: Attachment[];
  isBookmarked: boolean;
  userVote?: 'up' | 'down';
  isFollowing?: boolean;
}

interface Reply {
  id: string;
  content: string;
  author: { id: string; name: string; isAnonymous: boolean; };
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  attachments?: Attachment[];
  userVote?: 'up' | 'down';
  professionalCategory?: string;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface UserContributions {
  postsAsked: ForumPost[];
  repliesProvided: Reply[];
  bookmarkedThreads: ForumPost[];
  upvotesReceived: number;
}

const GuidanceAndReference = () => {
  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6 max-w-7xl">
        <GuidanceAndReferenceModule />
      </div>
    </DashboardLayout>
  );
};

const GuidanceAndReferenceModule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("forum");
  const [showAskDialog, setShowAskDialog] = useState(false);
  const [askTabType, setAskTabType] = useState<'query' | 'reference'>('query');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showPostDetails, setShowPostDetails] = useState(false);
  
  // Forum state
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Create post state
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postCategories, setPostCategories] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  
  // User contributions
  const [userContributions, setUserContributions] = useState<UserContributions>({
    postsAsked: [],
    repliesProvided: [],
    bookmarkedThreads: [],
    upvotesReceived: 0
  });

  // Professional categories for filtering
  const professionalCategories = [
    "Insolvency", "Legal", "Compliance", "Financial Audit", "Tax", "Corporate Law", 
    "Banking", "Real Estate", "Intellectual Property", "Labor Law", "Environmental Law"
  ];

  // Mock data with complete structure
  const mockPosts: ForumPost[] = [
    {
      id: "1",
      title: "Need guidance on NCLT proceedings for corporate insolvency",
      content: "I'm handling a corporate insolvency case and need clarification on the timeline for NCLT proceedings. What are the key milestones and deadlines I should be aware of?",
      type: "query",
      author: { id: "user1", name: "Anonymous User", isAnonymous: true },
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-15T10:30:00"),
      tags: ["NCLT", "Corporate Insolvency", "Legal"],
      categories: ["Insolvency", "Legal"],
      status: "open",
      replies: [{
        id: "r1",
        content: "The NCLT proceedings typically follow a structured timeline. Key milestones include admission (within 14 days), moratorium period, and resolution plan submission (within 180 days extendable to 270 days).",
        author: { id: "user2", name: "CA Sharma", isAnonymous: false },
        createdAt: new Date("2024-01-15T14:20:00"),
        upvotes: 12,
        downvotes: 1,
        userVote: 'up',
        professionalCategory: "Insolvency"
      }],
      upvotes: 8,
      downvotes: 0,
      bookmarks: 5,
      isBookmarked: true,
      userVote: 'up',
      isFollowing: true
    },
    {
      id: "2",
      title: "Looking for experienced forensic auditor for fraud investigation",
      content: "We need a forensic auditor with experience in financial fraud investigations for a complex case involving multiple entities. Please reach out if you have relevant experience.",
      type: "reference",
      author: { id: "user3", name: "Legal Associates LLP", isAnonymous: false },
      createdAt: new Date("2024-01-14T16:45:00"),
      updatedAt: new Date("2024-01-14T16:45:00"),
      tags: ["Forensic Audit", "Fraud Investigation", "Reference"],
      categories: ["Financial Audit", "Legal"],
      status: "open",
      replies: [],
      upvotes: 3,
      downvotes: 0,
      bookmarks: 2,
      isBookmarked: false,
      isFollowing: false
    }
  ];

  // Initialize data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setUserContributions({
        postsAsked: mockPosts.filter(p => p.author.id === "current_user"),
        repliesProvided: [],
        bookmarkedThreads: mockPosts.filter(p => p.isBookmarked),
        upvotesReceived: 24
      });
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || post.type === filterType;
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    
    // Date range filter
    const matchesDateRange = filterDateRange === "all" || (() => {
      const now = new Date();
      const postDate = new Date(post.createdAt);
      const daysDiff = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (filterDateRange) {
        case "today": return daysDiff === 0;
        case "week": return daysDiff <= 7;
        case "month": return daysDiff <= 30;
        case "year": return daysDiff <= 365;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  }).sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "most_upvoted":
        return b.upvotes - a.upvotes;
      case "most_replies":
        return b.replies.length - a.replies.length;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handle post creation
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
      author: { id: "current_user", name: "Current User", isAnonymous: false },
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: postTags,
      categories: postCategories,
      status: "open",
      replies: [],
      upvotes: 0,
      downvotes: 0,
      bookmarks: 0,
      isBookmarked: false,
      isFollowing: false,
      attachments: []
    };

    setPosts([newPost, ...posts]);
    setShowAskDialog(false);
    setPostTitle("");
    setPostContent("");
    setPostTags([]);
    setPostCategories([]);
    setAttachments([]);

    toast({
      title: "Success",
      description: `${askTabType === 'query' ? 'Query' : 'Reference request'} posted successfully!`
    });
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'query' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800';
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

  // View post details
  const viewPostDetails = (post: ForumPost) => {
    setSelectedPost(post);
    setShowPostDetails(true);
  };

  return (
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

            <div>
              <label className="block text-sm font-medium mb-2">
                {createPostType === 'query' ? 'Query Title' : 'Reference Request Title'}
              </label>
              <Input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder={createPostType === 'query' ? 'Brief, clear subject line summarizing your question' : 'Brief description of the reference you need'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={createPostType === 'query' ? 'Provide detailed information about your question...' : 'Describe the type of professional reference you need...'}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add professional category tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {postTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, XLS files up to 10MB</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>Cancel</Button>
              <Button onClick={handleCreatePost}>
                <Send className="h-4 w-4 mr-2" />
                Post {createPostType === 'query' ? 'Query' : 'Reference Request'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forum">Forum View</TabsTrigger>
          <TabsTrigger value="contributions">My Contributions</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search posts, tags, or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="query">Queries</SelectItem>
                      <SelectItem value="reference">References</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No posts found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTypeColor(post.type)}>
                            {post.type === 'query' ? 'Query' : 'Reference'}
                          </Badge>
                          <Badge className={getStatusColor(post.status)}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(post.createdAt, 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Reply className="h-4 w-4" />
                            {post.replies.length} replies
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Replies Preview */}
                    {post.replies.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Recent Reply:</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.replies[0].content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">by {post.replies[0].author.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <ThumbsUp className="h-3 w-3" />
                              {post.replies[0].upvotes}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <ThumbsDown className="h-3 w-3" />
                              {post.replies[0].downvotes}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, 'up')}
                          className={`flex items-center gap-1 ${post.userVote === 'up' ? 'text-blue-600' : ''}`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {post.upvotes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, 'down')}
                          className={`flex items-center gap-1 ${post.userVote === 'down' ? 'text-red-600' : ''}`}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          {post.downvotes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmark(post.id)}
                          className={`flex items-center gap-1 ${post.isBookmarked ? 'text-yellow-600' : ''}`}
                        >
                          {post.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                          {post.bookmarks}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/guidance-and-reference/post/${post.id}`)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          // Open reply modal or navigate to post details
                          navigate(`/guidance-and-reference/post/${post.id}#reply`);
                        }}>
                          <Reply className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1} className="cursor-pointer">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(2)} isActive={currentPage === 2} className="cursor-pointer">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Posts Asked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Reply className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Replies Provided</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Bookmark className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Bookmarked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">45</p>
                <p className="text-sm text-gray-600">Upvotes Received</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="asked">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="asked">Posts I've Asked</TabsTrigger>
                  <TabsTrigger value="replied">Replies I've Provided</TabsTrigger>
                  <TabsTrigger value="bookmarked">Bookmarked Threads</TabsTrigger>
                </TabsList>
                <TabsContent value="asked" className="mt-4">
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No posts asked yet</p>
                    <Button className="mt-4" onClick={() => setShowCreatePost(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ask Your First Question
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="replied" className="mt-4">
                  <div className="text-center py-8">
                    <Reply className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No replies provided yet</p>
                  </div>
                </TabsContent>
                <TabsContent value="bookmarked" className="mt-4">
                  <div className="space-y-4">
                    {posts.filter(p => p.isBookmarked).map((post) => (
                      <Card key={post.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{post.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{post.content.substring(0, 100)}...</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleBookmark(post.id)}>
                              <BookmarkCheck className="h-4 w-4 text-yellow-600" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GuidanceAndReference;
