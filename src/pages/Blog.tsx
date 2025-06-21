import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlog } from '../Services/BlogService/getAllBlog';
import type { BlogItem } from '../Services/BlogService/getAllBlog';

const Blog = () => {
  const [posts, setPosts] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const response = await getAllBlog({ pageIndex: 1, pageSize: 100 });
        if (response.isSuccess) {
          setPosts(response.result || []);
        } else {
          setError(response.errorMessage || 'Không thể tải bài viết');
        }
      } catch (err) {
        setError('Lỗi khi tải bài viết');
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Đang tải bài viết...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Cập nhật thông tin mới nhất về xét nghiệm ADN và các vấn đề liên quan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{post.createdDate ? new Date(post.createdDate).toLocaleDateString() : ''}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {post.content?.slice(0, 100) || ''}
              </p>
              <Link to={`/blog-detail/${post.id}`} className="readmore-btn">
                Đọc thêm →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chủ đề phổ biến</h2>
        <div className="flex flex-wrap gap-2">
          {['Xét nghiệm ADN', 'Huyết thống', 'Pháp lý', 'Sức khỏe', 'Khoa học'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;