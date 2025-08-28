import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  Download,
  Edit,
  CheckCircle,
  AlertCircle,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Award,
  Target,
  Activity,
  MessageSquare as MessageSquareIcon,
  Reply as ReplyIcon,
  ThumbsUp as ThumbsUpIcon
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

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
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

interface UserContributions {
  askedPosts: ForumPost[];
  repliesProvided: Reply[];
  bookmarkedThreads: ForumPost[];
  upvotesReceived: number;
  totalRating: number;
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

const GuidanceAndReferenceModule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = "Current User";
  
  // State
  const [activeTab, setActiveTab] = useState("forum");
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAskDialog, setShowAskDialog] = useState(false);
  const [askTabType, setAskTabType] = useState<'query' | 'reference'>('query');
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);
  // Inline reply state per post
  const [inlineReplyOpen, setInlineReplyOpen] = useState<Record<string, boolean>>({});
  const [inlineReplyContent, setInlineReplyContent] = useState<Record<string, string>>({});
  const [userContributions, setUserContributions] = useState<UserContributions>({
    askedPosts: [],
    repliesProvided: [],
    bookmarkedThreads: [],
    upvotesReceived: 0,
    totalRating: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

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

  // Mock data using useMemo to prevent recreation on every render
  const mockPosts = React.useMemo<ForumPost[]>(() => [
    {
      id: "1",
      title: "Need guidance on NCLT proceedings for corporate insolvency",
      content: "I'm handling a corporate insolvency case and need expert guidance on NCLT proceedings. What are the key documentation requirements and timelines? The case involves a manufacturing company with assets worth ₹50 crores and multiple creditors. I need specific guidance on: 1) Timeline for filing application 2) Required documentation 3) Fee structure 4) Expected duration of proceedings. Any insights from experienced practitioners would be highly appreciated.",
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
      userVote: "up",
      attachments: [
        {
          id: "att1",
          name: "NCLT_Application_Draft.pdf",
          size: 2048576,
          type: "application/pdf",
          url: "/attachments/nclt_draft.pdf",
          uploadedAt: new Date(2024, 0, 15)
        }
      ]
    },
    {
      id: "2", 
      title: "Looking for experienced GST consultant in Mumbai",
      content: "Need a reliable GST consultant for a mid-size manufacturing company. Must have experience with complex input tax credit scenarios. Company details: Annual turnover ₹25 crores, 150+ employees, multiple state operations. Looking for someone who can handle: 1) Monthly GST compliance 2) Input tax credit optimization 3) GST audit support 4) Dispute resolution. Please share recommendations with contact details and fee structure.",
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
    },
    {
      id: "3",
      title: "Best practices for ESG compliance reporting",
      content: "Our organization is implementing ESG compliance framework. Need guidance on best practices for ESG reporting, key metrics to track, and regulatory requirements. Any templates or frameworks would be helpful.",
      type: "query",
      author: "Amit Patel",
      authorRole: "Compliance Officer",
      createdAt: new Date(2024, 0, 10),
      updatedAt: new Date(2024, 0, 10),
      upvotes: 15,
      downvotes: 0,
      replies: 6,
      views: 234,
      bookmarks: 8,
      tags: ["ESG", "Compliance", "Reporting"],
      category: "Regulatory Affairs",
      status: "open",
      isBookmarked: false,
      isFollowing: false
    },
    {
      id: "4",
      title: "How to structure vendor contracts for milestone-based payments?",
      content: "Looking for best practices and sample clauses for structuring milestone-based payments in vendor contracts. Need guidance on risk mitigation and acceptance criteria definitions.",
      type: "query",
      author: "Current User",
      authorRole: "Service Provider",
      createdAt: new Date(2024, 0, 18),
      updatedAt: new Date(2024, 0, 18),
      upvotes: 2,
      downvotes: 0,
      replies: 1,
      views: 42,
      bookmarks: 0,
      tags: ["Contracts", "Vendors", "Payments"],
      category: "Legal & Compliance",
      status: "open",
      isBookmarked: false,
      isFollowing: true
    },
    {
      id: "5",
      title: "Reference: Reliable payroll outsourcing partner in Pune",
      content: "Seeking recommendations for a dependable payroll outsourcing firm in Pune that supports 200+ headcount, with compliance coverage for PF/ESIC/PT and timely reporting.",
      type: "reference",
      author: "Current User",
      authorRole: "Service Provider",
      createdAt: new Date(2024, 0, 8),
      updatedAt: new Date(2024, 0, 12),
      upvotes: 5,
      downvotes: 1,
      replies: 3,
      views: 77,
      bookmarks: 2,
      tags: ["Payroll", "Outsourcing", "Pune"],
      category: "Human Resources",
      status: "answered",
      isBookmarked: true,
      isFollowing: false
    },
    {
      id: "6",
      title: "Closure checklist for dormant LLP",
      content: "Need a step-by-step checklist and indicative timelines for closing a dormant LLP with no liabilities. Also any common pitfalls to avoid.",
      type: "query",
      author: "Current User",
      authorRole: "Service Provider",
      createdAt: new Date(2023, 11, 28),
      updatedAt: new Date(2024, 0, 5),
      upvotes: 1,
      downvotes: 0,
      replies: 0,
      views: 21,
      bookmarks: 0,
      tags: ["LLP", "Closure", "Checklist"],
      category: "Corporate Governance",
      status: "closed",
      isBookmarked: false,
      isFollowing: false
    }
  ], []);

  const mockReplies = React.useMemo<Reply[]>(() => [
    {
      id: "r1",
      postId: "1",
      content: "Based on my experience with NCLT proceedings, here are the key points: 1) Timeline: Application should be filed within 14 days of default. 2) Documentation: Board resolution, financial statements, list of creditors, default evidence. 3) Fee: ₹25,000 for application + advocate fees. 4) Duration: Typically 6-12 months depending on complexity. I've attached a checklist that might help.",
      author: "Suresh Menon",
      authorRole: "Insolvency Professional",
      createdAt: new Date(2024, 0, 16),
      upvotes: 8,
      downvotes: 0,
      isAccepted: true,
      attachments: [
        {
          id: "ratt1",
          name: "NCLT_Checklist.pdf",
          size: 1024000,
          type: "application/pdf",
          url: "/attachments/nclt_checklist.pdf",
          uploadedAt: new Date(2024, 0, 16)
        }
      ]
    },
    {
      id: "r2",
      postId: "1",
      content: "Additionally, make sure to check the latest NCLT rules as they were updated recently. The fee structure has changed and some documentation requirements are now more stringent.",
      author: "Kavita Singh",
      authorRole: "Corporate Lawyer",
      createdAt: new Date(2024, 0, 17),
      upvotes: 3,
      downvotes: 0
    },
    {
      id: "r3",
      postId: "2",
      content: "I can recommend CA Ramesh Gupta from Mumbai. He has 15+ years of GST experience and has handled similar manufacturing cases. His firm specializes in input tax credit optimization. Contact: +91-9876543210, ramesh@taxconsult.com. Fee: ₹15,000-25,000 per month depending on complexity.",
      author: "Deepak Joshi",
      authorRole: "Tax Consultant",
      createdAt: new Date(2024, 0, 13),
      upvotes: 5,
      downvotes: 0
    },
    {
      id: "r4",
      postId: "4",
      content: "For milestone-based payments, I recommend including these key elements in your contracts: 1) Clear definition of each milestone with specific deliverables 2) Payment terms and conditions for each milestone 3) Acceptance criteria and sign-off process 4) Remedies for non-performance 5) Change order process. I've attached a sample clause that has worked well for my clients.",
      author: "Current User",
      authorRole: "Service Provider",
      createdAt: new Date(2024, 0, 19),
      upvotes: 7,
      downvotes: 0,
      isAccepted: true,
      attachments: [
        {
          id: "ratt2",
          name: "Milestone_Payment_Clause.docx",
          size: 512000,
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          url: "/attachments/milestone_clause.docx",
          uploadedAt: new Date(2024, 0, 19)
        }
      ]
    },
    {
      id: "r5",
      postId: "5",
      content: "I've had good experience with PayrollPro Solutions in Pune. They handle our 250+ employee payroll with PF/ESIC/PT compliance. Their reporting is excellent and they're very responsive. Contact: Priya at +91-9876543211. Their fee is around ₹100 per employee per month.",
      author: "Current User",
      authorRole: "Service Provider",
      createdAt: new Date(2024, 0, 10),
      upvotes: 12,
      downvotes: 1,
      isAccepted: true
    }
  ], []);

  // Initialize data
  useEffect(() => {
    const initializePosts = () => {
      // Add some delay to simulate API call
      const timer = setTimeout(() => {
        // Set posts and replies
        setPosts(mockPosts);
        setReplies(mockReplies);
        
        // Filter posts based on current user's contributions
        const userPosts = mockPosts.filter(post => post.author === currentUser);
        const userReplies = mockReplies.filter(reply => reply.author === currentUser);
        const bookmarked = mockPosts.filter(post => post.isBookmarked);
        const totalUpvotes = userReplies.reduce((sum, reply) => sum + reply.upvotes, 0);
        
        // Set user contributions
        setUserContributions({
          askedPosts: userPosts,
          repliesProvided: userReplies,
          bookmarkedThreads: bookmarked,
          upvotesReceived: totalUpvotes,
          totalRating: Math.min(5, Math.max(1, (totalUpvotes / 5) * 0.8)) // Rating between 1-5
        });

        // Set filtered posts (all posts by default)
        setFilteredPosts(mockPosts);
      }, 500);

      return () => clearTimeout(timer);
    };

    initializePosts();
  }, [currentUser, mockPosts, mockReplies]);

  // Inline reply handlers (for forum cards)
  const toggleInlineReply = (postId: string) => {
    setInlineReplyOpen((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleInlineReplyChange = (postId: string, value: string) => {
    setInlineReplyContent((prev) => ({ ...prev, [postId]: value }));
  };

  const handleInlineReplySubmit = (postId: string) => {
    const content = (inlineReplyContent[postId] || '').trim();
    if (!content) {
      toast({ title: 'Error', description: 'Please enter reply content', variant: 'destructive' });
      return;
    }
    const newReply: Reply = {
      id: `r_${Date.now()}`,
      postId,
      content,
      author: currentUser,
      authorRole: 'Service Provider',
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
    };
    setReplies((prev) => [...prev, newReply]);
    setPosts((prev) => prev.map(p => p.id === postId ? { ...p, replies: p.replies + 1 } : p));
    setInlineReplyContent((prev) => ({ ...prev, [postId]: '' }));
    setInlineReplyOpen((prev) => ({ ...prev, [postId]: false }));
    toast({ title: 'Success', description: 'Reply posted successfully' });
  };

  // OP status update handler
  const handleUpdateStatus = (postId: string, newStatus: 'open' | 'answered' | 'closed') => {
    setPosts((prev) => prev.map(p => p.id === postId ? { ...p, status: newStatus, updatedAt: new Date() } : p));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({ ...selectedPost, status: newStatus, updatedAt: new Date() });
    }
    toast({ title: 'Status updated', description: `Post marked as ${newStatus}` });
  };


  // Filter and search posts
  useEffect(() => {
    const filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === "all" || post.type === filterType;
      const matchesStatus = filterStatus === "all" || post.status === filterStatus;
      const matchesCategory = filterCategory === "all" || post.category === filterCategory;
      
      // Date range filter
      const matchesDateRange = !dateRange.from || !dateRange.to || 
        (post.createdAt >= dateRange.from && post.createdAt <= dateRange.to);
      
      return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesDateRange;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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
  }, [posts, searchTerm, filterType, filterStatus, filterCategory, dateRange, sortBy]);

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

  // File upload handlers
  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(prev => [...prev, ...fileArray]);
    }
  };

  const handleReplyFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setReplyAttachments(prev => [...prev, ...fileArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeReplyAttachment = (index: number) => {
    setReplyAttachments(prev => prev.filter((_, i) => i !== index));
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

    const mockAttachments: Attachment[] = attachments.map((file, index) => ({
      id: `att_${Date.now()}_${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/attachments/${file.name}`,
      uploadedAt: new Date()
    }));

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
      category: postCategory || "General",
      status: "open",
      isBookmarked: false,
      isFollowing: true,
      attachments: mockAttachments.length > 0 ? mockAttachments : undefined
    };

    setPosts([newPost, ...posts]);
    setPostTitle("");
    setPostContent("");
    setPostCategory("");
    setPostTags([]);
    setAttachments([]);
    setShowAskDialog(false);
    
    toast({
      title: "Success",
      description: `${askTabType === 'query' ? 'Query' : 'Reference request'} posted successfully`
    });
  };

  // View post details
  const viewPostDetails = (post: ForumPost) => {
    // Increment view count
    setPosts(posts.map(p => p.id === post.id ? { ...p, views: p.views + 1 } : p));
    setSelectedPost({ ...post, views: post.views + 1 });
    setShowPostDetails(true);
  };

  // Handle reply submission
  const handleReplySubmit = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter reply content",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPost) return;

    const mockReplyAttachments: Attachment[] = replyAttachments.map((file, index) => ({
      id: `ratt_${Date.now()}_${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/attachments/${file.name}`,
      uploadedAt: new Date()
    }));

    const newReply: Reply = {
      id: `r_${Date.now()}`,
      postId: selectedPost.id,
      content: replyContent,
      author: "Current User",
      authorRole: "Service Provider",
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      attachments: mockReplyAttachments.length > 0 ? mockReplyAttachments : undefined
    };

    setReplies([...replies, newReply]);
    setPosts(posts.map(post => 
      post.id === selectedPost.id 
        ? { ...post, replies: post.replies + 1 }
        : post
    ));
    
    setReplyContent("");
    setReplyAttachments([]);
    
    toast({
      title: "Success",
      description: "Reply posted successfully"
    });
  };

  // Handle reply voting
  const handleReplyVote = (replyId: string, voteType: 'up' | 'down') => {
    setReplies(replies.map(reply => {
      if (reply.id === replyId) {
        const currentVote = reply.userVote;
        let newUpvotes = reply.upvotes;
        let newDownvotes = reply.downvotes;
        let newUserVote: 'up' | 'down' | undefined = voteType;

        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;

        if (currentVote === voteType) {
          newUserVote = undefined;
        } else {
          if (voteType === 'up') newUpvotes++;
          if (voteType === 'down') newDownvotes++;
        }

        return { ...reply, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
      }
      return reply;
    }));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Jump to page functions
  const jumpToFirstPage = () => setCurrentPage(1);
  const jumpToLastPage = () => setCurrentPage(totalPages);

  // Get pagination data
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);
  
  // Get replies for selected post
  const postReplies = selectedPost ? replies.filter(reply => reply.postId === selectedPost.id) : [];

  return (
    <DashboardLayout userType="service_provider">
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
                        Professional Category
                      </label>
                      <Select value={postCategory} onValueChange={setPostCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionalCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        Professional Category
                      </label>
                      <Select value={postCategory} onValueChange={setPostCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionalCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

                {/* File Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </label>
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Files
                    </Button>
                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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
                        <SelectItem value="recent">Latest Request at Top</SelectItem>
                        <SelectItem value="oldest">Oldest Request at Top</SelectItem>
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
                            {post.author === currentUser && (
                              <div className="ml-2 flex items-center gap-2">
                                {post.status !== 'answered' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(post.id, 'answered')}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Mark Answered
                                  </Button>
                                )}
                                {post.status !== 'closed' ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(post.id, 'closed')}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Close
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(post.id, 'open')}
                                  >
                                    <ArrowLeft className="h-3 w-3 mr-1" />
                                    Reopen
                                  </Button>
                                )}
                              </div>
                            )}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleInlineReply(post.id)}
                          >
                            Quick Reply
                          </Button>
                        </div>
                      </div>

                      {inlineReplyOpen[post.id] && (
                        <div className="mt-4 border-t pt-4">
                          <Textarea
                            value={inlineReplyContent[post.id] || ''}
                            onChange={(e) => handleInlineReplyChange(post.id, e.target.value)}
                            placeholder="Write a quick reply..."
                            rows={3}
                          />
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleInlineReplySubmit(post.id)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Submit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleInlineReply(post.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={jumpToFirstPage}
                            disabled={currentPage === 1}
                          >
                            <SkipBack className="h-4 w-4" />
                            First
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={jumpToLastPage}
                            disabled={currentPage === totalPages}
                          >
                            Last
                            <SkipForward className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Items per page:</span>
                        <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contributions" className="space-y-6">
              {/* Contributions Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{userContributions.askedPosts.length}</p>
                        <p className="text-sm text-gray-600">Posts I've Asked</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Reply className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{userContributions.repliesProvided.length}</p>
                        <p className="text-sm text-gray-600">Replies I've Provided</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Bookmark className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{userContributions.bookmarkedThreads.length}</p>
                        <p className="text-sm text-gray-600">Bookmarked Threads</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{userContributions.upvotesReceived}</p>
                        <p className="text-sm text-gray-600">Upvotes Received</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contributions Tabs */}
              <Tabs defaultValue="asked" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="asked">Posts I've Asked</TabsTrigger>
                  <TabsTrigger value="replies">Replies I've Provided</TabsTrigger>
                  <TabsTrigger value="bookmarks">Bookmarked Threads</TabsTrigger>
                  <TabsTrigger value="tracker">Status Tracker</TabsTrigger>
                </TabsList>

                <TabsContent value="asked" className="space-y-4">
                  {userContributions.askedPosts.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">You haven't asked any questions yet</p>
                        <Button 
                          className="mt-4" 
                          onClick={() => setShowAskDialog(true)}
                        >
                          Ask Your First Question
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {userContributions.askedPosts.map((post) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={post.type === 'query' ? 'default' : 'secondary'}>
                                    {post.type === 'query' ? 'Query' : 'Reference'}
                                  </Badge>
                                  <Badge variant="outline">{post.status}</Badge>
                                  <div className="ml-2 flex items-center gap-2">
                                    {post.status !== 'answered' && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateStatus(post.id, 'answered')}
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Mark Answered
                                      </Button>
                                    )}
                                    {post.status !== 'closed' ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateStatus(post.id, 'closed')}
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Close
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateStatus(post.id, 'open')}
                                      >
                                        <ArrowLeft className="h-3 w-3 mr-1" />
                                        Reopen
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {format(post.createdAt, 'MMM dd, yyyy')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Reply className="h-4 w-4" />
                                    {post.replies} replies
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {post.views} views
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewPostDetails(post)}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="replies" className="space-y-4">
                  {userContributions.repliesProvided.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Reply className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">You haven't provided any replies yet</p>
                        <p className="text-sm text-gray-500 mt-2">Start helping others by answering their questions</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {userContributions.repliesProvided.map((reply) => {
                        const originalPost = posts.find(p => p.id === reply.postId);
                        return (
                          <Card key={reply.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900">
                                    Reply to: {originalPost?.title || 'Unknown Post'}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {format(reply.createdAt, 'MMM dd, yyyy')}
                                    </Badge>
                                    {reply.isAccepted && (
                                      <Badge variant="default" className="text-xs bg-green-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Accepted
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm">{reply.content}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <ThumbsUp className="h-4 w-4" />
                                    {reply.upvotes} upvotes
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ThumbsDown className="h-4 w-4" />
                                    {reply.downvotes} downvotes
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="bookmarks" className="space-y-4">
                  {userContributions.bookmarkedThreads.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">No bookmarked threads yet</p>
                        <p className="text-sm text-gray-500 mt-2">Bookmark interesting posts to save them for later</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {userContributions.bookmarkedThreads.map((post) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={post.type === 'query' ? 'default' : 'secondary'}>
                                    {post.type === 'query' ? 'Query' : 'Reference'}
                                  </Badge>
                                  <Badge variant="outline">{post.status}</Badge>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {post.author}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {format(post.createdAt, 'MMM dd, yyyy')}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewPostDetails(post)}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tracker" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Status Tracker
                      </CardTitle>
                      <p className="text-sm text-gray-500">Track your engagement and contributions to the community</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                              <MessageSquareIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                              {userContributions.askedPosts.length}
                            </p>
                            <p className="text-sm text-gray-600">Questions Asked</p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                              <ReplyIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                              {userContributions.repliesProvided.length}
                            </p>
                            <p className="text-sm text-gray-600">Replies Provided</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                              <ThumbsUpIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                              {userContributions.upvotesReceived}
                            </p>
                            <p className="text-sm text-gray-600">Upvotes Received</p>
                          </div>
                          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Award className="h-6 w-6 text-amber-600" />
                            </div>
                            <p className="text-2xl font-bold text-amber-600">
                              {userContributions.totalRating.toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-600">Community Rating</p>
                          </div>
                        </div>

                        {/* Status Distribution */}
                        <div className="bg-white p-4 rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-4">Questions by Status</h4>
                          <div className="flex items-center justify-between gap-4">
                            {[
                              { status: 'open', label: 'Open', color: 'bg-blue-500', count: posts.filter(p => p.author === "Current User" && p.status === "open").length },
                              { status: 'answered', label: 'Answered', color: 'bg-green-500', count: posts.filter(p => p.author === "Current User" && p.status === "answered").length },
                              { status: 'closed', label: 'Closed', color: 'bg-gray-500', count: posts.filter(p => p.author === "Current User" && p.status === "closed").length }
                            ].map((item) => (
                              <div key={item.status} className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                  <span className="text-sm font-bold">{item.count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${item.color}`} 
                                    style={{ width: `${(item.count / Math.max(1, userContributions.askedPosts.length)) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Recent Activity */}
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-900">Recent Activity</h4>
                            <Button variant="outline" size="sm" className="text-sm">
                              View All
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {[...userContributions.askedPosts, ...userContributions.repliesProvided.map(r => ({
                              ...r,
                              type: 'reply',
                              title: `Replied to: ${posts.find(p => p.id === r.postId)?.title || 'Post'}`,
                              createdAt: r.createdAt,
                              status: 'reply'
                            }))]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 5)
                            .map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    item.status === 'open' ? 'bg-blue-500' :
                                    item.status === 'answered' ? 'bg-green-500' :
                                    item.status === 'closed' ? 'bg-gray-500' : 'bg-purple-500'
                                  }`} />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {item.type === 'reply' ? item.title : item.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>{format(item.createdAt, 'MMM dd, yyyy')}</span>
                                      <span>•</span>
                                      <span className="capitalize">
                                        {item.type === 'reply' ? 'Reply' : item.status}
                                      </span>
                                      {item.type === 'reply' && (
                                        <>
                                          <span>•</span>
                                          <span className="text-purple-600 font-medium">
                                            +{item.upvotes} upvotes
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => item.type === 'reply' 
                                    ? viewPostDetails(posts.find(p => p.id === item.postId) || selectedPost!)
                                    : viewPostDetails(item as ForumPost)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {userContributions.askedPosts.length === 0 && userContributions.repliesProvided.length === 0 && (
                              <div className="text-center py-8">
                                <MessageSquare className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                <p className="text-gray-500">No activity yet. Start by asking a question or replying to a post.</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Category Distribution */}
                        {userContributions.askedPosts.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium text-gray-900 mb-4">Your Questions by Category</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Array.from(new Set(userContributions.askedPosts.map(p => p.category)))
                                .map(category => ({
                                  category,
                                  count: userContributions.askedPosts.filter(p => p.category === category).length
                                }))
                                .sort((a, b) => b.count - a.count)
                                .map((item) => (
                                  <div key={item.category} className="bg-white p-3 rounded-lg border">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-sm">{item.category}</span>
                                      <span className="text-sm font-bold">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="h-2 rounded-full bg-blue-500" 
                                        style={{ width: `${(item.count / userContributions.askedPosts.length) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Post Details Dialog */}
      <Dialog open={showPostDetails} onOpenChange={setShowPostDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedPost.type === 'query' ? 'default' : 'secondary'}>
                      {selectedPost.type === 'query' ? 'Query' : 'Reference'}
                    </Badge>
                    <Badge variant="outline">{selectedPost.status}</Badge>
                    <Badge variant="outline">{selectedPost.category}</Badge>
                    {selectedPost.author === currentUser && (
                      <div className="ml-2 flex items-center gap-2">
                        {selectedPost.status !== 'answered' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedPost.id, 'answered')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Answered
                          </Button>
                        )}
                        {selectedPost.status !== 'closed' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedPost.id, 'closed')}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Close
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedPost.id, 'open')}
                          >
                            <ArrowLeft className="h-3 w-3 mr-1" />
                            Reopen
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPostDetails(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DialogTitle className="text-xl font-bold mt-2">
                  {selectedPost.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Post Meta Information */}
                <div className="flex items-center gap-6 text-sm text-gray-500 border-b pb-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedPost.author} ({selectedPost.authorRole})
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(selectedPost.createdAt, 'MMM dd, yyyy HH:mm')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {selectedPost.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Reply className="h-4 w-4" />
                    {selectedPost.replies} replies
                  </span>
                </div>

                {/* Full Query Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>
                </div>

                {/* Tags */}
                {selectedPost.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Documents */}
                {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Attached Documents</h3>
                    <div className="space-y-2">
                      {selectedPost.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-sm">{attachment.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(attachment.size)} • {format(attachment.uploadedAt, 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-4 py-4 border-y">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(selectedPost.id, 'up')}
                    className={selectedPost.userVote === 'up' ? 'text-green-600' : ''}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {selectedPost.upvotes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(selectedPost.id, 'down')}
                    className={selectedPost.userVote === 'down' ? 'text-red-600' : ''}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {selectedPost.downvotes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmark(selectedPost.id)}
                    className={selectedPost.isBookmarked ? 'text-yellow-600' : ''}
                  >
                    <Bookmark className="h-4 w-4 mr-1" />
                    Bookmark
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFollow(selectedPost.id)}
                    className={selectedPost.isFollowing ? 'text-blue-600' : ''}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    {selectedPost.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>

                {/* Reply Thread */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Replies ({postReplies.length})
                  </h3>
                  
                  {/* Add Reply Form */}
                  <Card className="mb-6">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Add a Reply</h4>
                      <div className="space-y-4">
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Share your knowledge and help others..."
                          rows={4}
                        />
                        
                        {/* Reply File Upload */}
                        <div>
                          <input
                            ref={replyFileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleReplyFileUpload(e.target.files)}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => replyFileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Attach Files
                          </Button>
                          
                          {replyAttachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {replyAttachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{file.name}</span>
                                    <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeReplyAttachment(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleReplySubmit} className="bg-blue-600 hover:bg-blue-700">
                            <Send className="h-4 w-4 mr-2" />
                            Submit Reply
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Existing Replies */}
                  <div className="space-y-4">
                    {postReplies.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Reply className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No replies yet. Be the first to help!</p>
                      </div>
                    ) : (
                      postReplies.map((reply) => (
                        <Card key={reply.id} className={`${reply.isAccepted ? 'border-green-200 bg-green-50' : ''}`}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-sm">{reply.author}</span>
                                    <span className="text-xs text-gray-500">({reply.authorRole})</span>
                                  </div>
                                  {reply.isAccepted && (
                                    <Badge variant="default" className="text-xs bg-green-600">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Accepted Answer
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {format(reply.createdAt, 'MMM dd, yyyy HH:mm')}
                                </span>
                              </div>
                              
                              <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                              </div>
                              
                              {/* Reply Attachments */}
                              {reply.attachments && reply.attachments.length > 0 && (
                                <div className="space-y-2">
                                  <h5 className="font-medium text-sm text-gray-900">Attachments:</h5>
                                  {reply.attachments.map((attachment) => (
                                    <div key={attachment.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{attachment.name}</span>
                                        <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                                      </div>
                                      <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-4 pt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReplyVote(reply.id, 'up')}
                                  className={reply.userVote === 'up' ? 'text-green-600' : ''}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {reply.upvotes}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReplyVote(reply.id, 'down')}
                                  className={reply.userVote === 'down' ? 'text-red-600' : ''}
                                >
                                  <ThumbsDown className="h-4 w-4 mr-1" />
                                  {reply.downvotes}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default GuidanceAndReferenceModule;
