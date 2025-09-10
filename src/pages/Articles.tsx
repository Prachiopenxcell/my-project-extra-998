import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageWithPlaceholder } from '@/components/ui/image-placeholder';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  Search, 
  Calendar,
  User,
  Clock,
  Eye,
  BookOpen,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Download,
  Play,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Building2,
  Video,
  Vote,
  Scale,
  FolderOpen,
  UserCheck,
  Settings
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Articles', count: 48 },
  { id: 'legal-updates', name: 'Legal Updates', count: 12 },
  { id: 'platform-news', name: 'Platform News', count: 8 },
  { id: 'insolvency', name: 'Insolvency', count: 10 },
  { id: 'compliance', name: 'Compliance', count: 9 },
  { id: 'product-tips', name: 'Product Tips', count: 6 },
  { id: 'case-studies', name: 'Case Studies', count: 3 }
];

const tags = [
  'Regulatory Changes', 'Best Practices', 'Tutorial', 'Industry News', 
  'Feature Update', 'Compliance Guide', 'Legal Framework', 'Process Automation',
  'Digital Transformation', 'Risk Management', 'Audit Trail', 'Data Security'
];

type MediaType = 'article' | 'video' | 'infographic';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  image: string;
  tags: string[];
  featured: boolean;
  mediaType: MediaType;
  downloadable?: boolean;
}

const featuredArticles: Article[] = [
  {
    id: 1,
    title: 'New Regulatory Framework for Digital Compliance Management',
    excerpt: 'Understanding the latest regulatory changes and how they impact your organization\'s compliance strategy in 2024.',
    category: 'Legal Updates',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    views: 1250,
    image: '/api/placeholder/600/300',
    tags: ['Regulatory Changes', 'Compliance Guide', 'Legal Framework'],
    featured: true,
    mediaType: 'article'
  },
  {
    id: 2,
    title: 'Platform Update: Enhanced AI-Powered Claims Processing',
    excerpt: 'Discover how our latest AI enhancements are revolutionizing claims management with 40% faster processing times.',
    category: 'Platform News',
    author: 'Michael Chen',
    date: '2024-01-12',
    readTime: '5 min read',
    views: 890,
    image: '/api/placeholder/600/300',
    tags: ['Feature Update', 'Process Automation', 'AI Technology'],
    featured: true,
    mediaType: 'video'
  }
];

const platformFeatures = [
  {
    icon: Building2,
    title: 'Entity Management',
    description: 'Comprehensive entity lifecycle management with automated compliance tracking and regulatory oversight.'
  },
  {
    icon: Video,
    title: 'Meeting Management',
    description: 'Streamlined meeting coordination with integrated voting, documentation, and participant management.'
  },
  {
    icon: Vote,
    title: 'E-Voting System',
    description: 'Secure digital voting platform with real-time results and comprehensive audit trails.'
  },
  {
    icon: FileText,
    title: 'Claims Management',
    description: 'End-to-end claims processing with AI-powered verification and automated workflows.'
  },
  {
    icon: UserCheck,
    title: 'Resolution System',
    description: 'Comprehensive resolution planning and execution with stakeholder coordination.'
  },
  {
    icon: Scale,
    title: 'Litigation Support',
    description: 'Complete litigation lifecycle management with document handling and case tracking.'
  },
  {
    icon: FolderOpen,
    title: 'Virtual Data Room',
    description: 'Secure document sharing and collaboration platform with granular access controls.'
  },
  {
    icon: UserCheck,
    title: 'AR & Facilitators',
    description: 'Administrator and facilitator selection with transparent evaluation processes.'
  },
  {
    icon: Clock,
    title: 'Timeline Management',
    description: 'Comprehensive timeline tracking and milestone management for all processes.'
  },
  {
    icon: BookOpen,
    title: 'Regulatory Compliance',
    description: 'Complete regulatory compliance management with automated monitoring and reporting.'
  },
 
];

const articles: Article[] = [
  {
    id: 3,
    title: 'Best Practices for Entity Management in Multi-Jurisdictional Operations',
    excerpt: 'A comprehensive guide to managing entities across multiple jurisdictions while maintaining compliance.',
    category: 'Compliance',
    author: 'David Wilson',
    date: '2024-01-10',
    readTime: '12 min read',
    views: 654,
    image: 'https://via.placeholder.com/400x250/e2e8f0/64748b?text=Entity+Management',
    tags: ['Best Practices', 'Multi-Jurisdiction', 'Entity Management'],
    featured: false,
    mediaType: 'article'
  },
  {
    id: 4,
    title: 'Digital Transformation in Professional Services: A Case Study',
    excerpt: 'How XYZ Legal transformed their practice using the 998-P Platform, achieving 60% efficiency gains.',
    category: 'Case Studies',
    author: 'Emily Rodriguez',
    date: '2024-01-08',
    readTime: '10 min read',
    views: 432,
    image: 'https://via.placeholder.com/400x250/e2e8f0/64748b?text=Entity+Management',
    tags: ['Digital Transformation', 'Case Study', 'Efficiency'],
    featured: false,
    mediaType: 'article',
    downloadable: true
  },
  {
    id: 5,
    title: 'Understanding Insolvency Procedures: A Step-by-Step Guide',
    excerpt: 'Navigate complex insolvency procedures with confidence using our comprehensive step-by-step guide.',
    category: 'Insolvency',
    author: 'Robert Taylor',
    date: '2024-01-05',
    readTime: '15 min read',
    views: 789,
    image: 'https://via.placeholder.com/400x250/e2e8f0/64748b?text=Entity+Management',
    tags: ['Insolvency', 'Legal Framework', 'Tutorial'],
    featured: false,
    mediaType: 'article'
  },
  {
    id: 6,
    title: 'Security Best Practices for Virtual Data Rooms',
    excerpt: 'Essential security measures to protect sensitive documents in virtual data room environments.',
    category: 'Product Tips',
    author: 'Lisa Anderson',
    date: '2024-01-03',
    readTime: '7 min read',
    views: 567,
    image: 'https://via.placeholder.com/400x250/e2e8f0/64748b?text=Entity+Management',
    tags: ['Data Security', 'Best Practices', 'VDR'],
    featured: false,
    mediaType: 'infographic'
  }
];

const allArticles: Article[] = [...featuredArticles, ...articles];

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  // Browsing mode: pagination or load more
  const [browseMode, setBrowseMode] = useState<'pagination' | 'loadMore'>('loadMore');
  const articlesPerPage = 3;

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category.toLowerCase().replace(' ', '-') === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => article.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'popular':
        return b.views - a.views;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = browseMode === 'pagination'
    ? sortedArticles.slice(startIndex, startIndex + articlesPerPage)
    : sortedArticles.slice(0, currentPage * articlesPerPage);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const shareArticle = (article: typeof featuredArticles[0], platform: string) => {
    const url = `${window.location.origin}/articles/${article.id}`;
    const text = `Check out this article: ${article.title}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`);
        break;
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'infographic':
        return <ImageIcon className="h-4 w-4" />;
      case 'article':
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRelatedArticles = (currentArticle: typeof allArticles[number]) => {
    return allArticles
      .filter(article => 
        article.id !== currentArticle.id && 
        (article.category === currentArticle.category || 
         article.tags.some(tag => currentArticle.tags.includes(tag)))
      )
      .slice(0, 3);
  };

  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={FileText}
      heroSubtitle="Knowledge Hub"
      heroTitle="Articles & Blog"
      heroDescription="Stay updated with the latest insights, trends, and best practices in professional services."
      heroGradient="from-slate-600 to-gray-700"
    >
      <div className="space-y-8">
       {/* Featured Articles */}
 <section>
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {featuredArticles.map(article => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <ImageWithPlaceholder 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-slate-700 text-white">
                      {getMediaIcon(article.mediaType)}
                      <span className="ml-1 capitalize">{article.mediaType}</span>
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      Featured
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <span>•</span>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <CardTitle className="text-xl hover:text-slate-700 cursor-pointer">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'linkedin')} aria-label="Share on LinkedIn">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'twitter')} aria-label="Share on Twitter">
                        <Twitter className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'facebook')} aria-label="Share on Facebook">
                        <Facebook className="h-4 w-4 text-blue-800" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'email')} aria-label="Share via Email">
                        <Mail className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {article.tags.slice(0, 3).map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                        className="text-xs cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 'bg-slate-700 hover:bg-slate-800' : ''}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>

              {/* Tag Filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className={`cursor-pointer ${selectedTags.includes(tag) ? 'bg-slate-700 hover:bg-slate-800' : 'hover:bg-gray-100'}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sort Options and Browse Mode */}
              <div className="flex items-center flex-wrap gap-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="title">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
                {/* <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-600">Browse:</span>
                  <Button
                    variant={browseMode === 'pagination' ? 'default' : 'outline'}
                    size="sm"
                    className={browseMode === 'pagination' ? 'bg-slate-700 hover:bg-slate-800' : ''}
                    onClick={() => {
                      setBrowseMode('pagination');
                      setCurrentPage(1);
                    }}
                  >
                    Pagination
                  </Button>
                  <Button
                    variant={browseMode === 'loadMore' ? 'default' : 'outline'}
                    size="sm"
                    className={browseMode === 'loadMore' ? 'bg-slate-700 hover:bg-slate-800' : ''}
                    onClick={() => {
                      setBrowseMode('loadMore');
                      setCurrentPage(1);
                    }}
                  >
                    Load More
                  </Button>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              All Articles ({filteredArticles.length})
            </h2>
            {selectedTags.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTags([])}
              >
                Clear Tags
              </Button>
            )}
          </div>

          {paginatedArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedArticles.map(article => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithPlaceholder 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-white/90 text-gray-700">
                          {getMediaIcon(article.mediaType)}
                          <span className="ml-1 capitalize">{article.mediaType}</span>
                        </Badge>
                      </div>
                      {article.downloadable && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        <Badge variant="outline" className="text-xs">{article.category}</Badge>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                      </div>
                      <CardTitle className="text-lg hover:text-slate-700 cursor-pointer line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{article.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 2).map(tag => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                            className="text-xs cursor-pointer"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{article.tags.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Button size="sm" className="bg-slate-700 hover:bg-slate-800">
                          Read More
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'linkedin')} aria-label="Share on LinkedIn">
                            <Linkedin className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'twitter')} aria-label="Share on Twitter">
                            <Twitter className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'facebook')} aria-label="Share on Facebook">
                            <Facebook className="h-4 w-4 text-blue-800" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'email')} aria-label="Share via Email">
                            <Mail className="h-4 w-4 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination or Load More */}
              {browseMode === 'pagination' ? (
                totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? 'bg-slate-700 hover:bg-slate-800' : ''}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={paginatedArticles.length >= sortedArticles.length}
                  >
                    {paginatedArticles.length >= sortedArticles.length
                      ? 'All articles loaded'
                      : 'Load More Articles'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any articles matching your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedTags([]);
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Suggested Reads (Related Articles) */}
        {sortedArticles.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-6 w-6 text-slate-600" />
              <h2 className="text-2xl font-bold text-gray-900">Suggested Reads</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getRelatedArticles(sortedArticles[0]).map(article => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <ImageWithPlaceholder 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-32 object-cover"
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                      <Badge variant="outline" className="text-xs">{article.category}</Badge>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'linkedin')} aria-label="Share on LinkedIn">
                          <Linkedin className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'twitter')} aria-label="Share on Twitter">
                          <Twitter className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'facebook')} aria-label="Share on Facebook">
                          <Facebook className="h-4 w-4 text-blue-800" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => shareArticle(article, 'email')} aria-label="Share via Email">
                          <Mail className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
 
        {/* Newsletter Signup */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter to receive the latest articles, platform updates, and industry insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Input placeholder="Enter your email address" className="flex-1" />
              <Button className="bg-slate-700 hover:bg-slate-800">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
