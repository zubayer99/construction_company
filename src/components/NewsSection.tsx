import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, User, Tag, Eye } from 'lucide-react'; // Added Tag and Eye icons
import { blogService, BlogPost } from '../services/businessService';

const NewsSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await blogService.getPublished();
        setBlogPosts(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setBlogPosts([
          {
            id: '1',
            title: "Al Fatah Enterprise Wins Excellence Award for Industrial Innovation",
            slug: "excellence-award-industrial-innovation",
            excerpt: "We are honored to receive the UAE Industrial Excellence Award 2024 for our innovative solutions in heavy machinery and industrial equipment supply.",
            content: "",
            imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
            authorId: "user1",
            author: { name: "Corporate Communications", email: "communications@alfatahenterprise.com" },
            status: "PUBLISHED",
            publishedAt: "2024-01-15T00:00:00Z",
            isActive: true,
            isFeatured: true,
            viewCount: 1250,
            tags: ["Award", "Innovation", "Industry"],
            createdAt: "2024-01-15T00:00:00Z",
            updatedAt: "2024-01-15T00:00:00Z"
          },
          {
            id: '2',
            title: "Strategic Partnership with Leading European Manufacturers",
            slug: "strategic-partnership-european-manufacturers",
            excerpt: "Al Fatah Enterprise announces exclusive partnerships with top European machinery manufacturers to enhance our product portfolio and service capabilities.",
            content: "",
            imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
            authorId: "user2",
            author: { name: "Business Development", email: "business@alfatahenterprise.com" },
            status: "PUBLISHED",
            publishedAt: "2023-12-22T00:00:00Z",
            isActive: true,
            isFeatured: false,
            viewCount: 980,
            tags: ["Partnership", "Manufacturing", "Supply Chain"],
            createdAt: "2023-12-22T00:00:00Z",
            updatedAt: "2023-12-22T00:00:00Z"
          },
          {
            id: '3',
            title: "Expansion of Dubai Warehouse Facility - 50% Capacity Increase",
            slug: "dubai-warehouse-expansion",
            excerpt: "Our state-of-the-art warehouse facility in Dubai Industrial City has been expanded to better serve our growing customer base across the GCC region.",
            content: "",
            imageUrl: "https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e?auto=format&fit=crop&w=800&q=80",
            authorId: "user3",
            author: { name: "Operations Team", email: "operations@alfatahenterprise.com" },
            status: "PUBLISHED",
            publishedAt: "2023-11-10T00:00:00Z",
            isActive: true,
            isFeatured: true,
            viewCount: 750,
            tags: ["Expansion", "Logistics", "Warehouse"],
            createdAt: "2023-11-10T00:00:00Z",
            updatedAt: "2023-11-10T00:00:00Z"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Latest News & <span className="text-blue-600">Updates</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mb-8"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Latest News & <span className="text-blue-600">Updates</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Stay informed with the latest news, industry insights, and company updates from Al Fatah Enterprise. 
            Discover our achievements, partnerships, and innovations in industrial solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div 
              key={post.id || `post-${index}`}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={post.imageUrl || post.featuredImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {post.isFeatured && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                )}
              </div>
              <div className="p-8">
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium flex items-center">
                        <Tag className="h-3 w-3 mr-1" /> {tag} {/* Corrected: Used Tag icon */}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="text-xl font-bold text-blue-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  <a href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">{post.author?.name || 'Admin'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                    <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-blue-600" /> {/* Corrected: Used Eye icon */}
                        <span className="font-medium">{post.viewCount || post.views || 0} views</span>
                    </div>
                    <a 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group/link transition-colors duration-300"
                    >
                    Read Full Article 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a 
            href="/news"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            View All News & Updates
            <ArrowRight className="ml-3 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;