import React from 'react';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: 'Xét nghiệm ADN là gì và khi nào cần thực hiện?',
      excerpt: 'Tìm hiểu về xét nghiệm ADN, các trường hợp cần thực hiện và quy trình thực hiện xét nghiệm.',
      date: '20/02/2024',
      category: 'Kiến thức',
      image: 'https://images.unsplash.com/photo-1581093458791-9d15482442f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Độ chính xác của xét nghiệm ADN huyết thống',
      excerpt: 'Phân tích về độ chính xác của các phương pháp xét nghiệm ADN huyết thống hiện nay.',
      date: '18/02/2024',
      category: 'Khoa học',
      image: 'https://images.unsplash.com/photo-1581093458791-9d15482442f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Quy trình thu mẫu ADN tại nhà',
      excerpt: 'Hướng dẫn chi tiết về quy trình thu mẫu ADN tại nhà và những lưu ý quan trọng.',
      date: '15/02/2024',
      category: 'Hướng dẫn',
      image: 'https://images.unsplash.com/photo-1581093458791-9d15482442f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

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
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span className="text-blue-600">{post.category}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Đọc thêm →
              </button>
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