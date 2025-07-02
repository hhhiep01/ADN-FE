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

      {/* Footer */}
      <footer className="bg-[#f5f6fa] border-t mt-16 pt-10 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
          <div>
            <div className="font-bold mb-2">Công ty Cổ phần ADN Testing</div>
            <div className="text-sm mb-1">
              Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu
              Giấy, Hà Nội
            </div>
            <div className="text-sm mb-1">
              ĐKKD số. 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015
            </div>
            <div className="text-sm mb-1">024-7301-2468 (7h - 18h)</div>
            <div className="text-sm mb-1">support@adntesting.vn (7h - 18h)</div>
            <div className="text-sm mb-1">
              Văn phòng tại TP Hồ Chí Minh: Tòa nhà H3, 384 Hoàng Diệu, Phường
              6, Quận 4, TP.HCM
            </div>
            <div className="flex gap-2 mt-2">
              <img src="/logodk.png" alt="Đã đăng ký" className="h-7" />
              <img src="/logodk.png" alt="Đã thông báo" className="h-7" />
            </div>
          </div>
          <div>
            <div className="font-bold mb-2 text-[#00b6f3] flex items-center gap-2">
              <img
                src="https://bookingcare.vn/assets/icon/bookingcare.svg"
                alt="logo"
                className="w-7 h-7"
              />{" "}
              ADN Testing
            </div>
            <ul className="text-sm space-y-1">
              <li>Liên hệ hợp tác</li>
              <li>Chính sách bảo mật</li>
              <li>Quy chế hoạt động</li>
              <li>Tuyển dụng</li>
              <li>Điều khoản sử dụng</li>
              <li>Câu hỏi thường gặp</li>
              <li className="text-[#00b6f3] mt-2">/ ADN</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">Đối tác bảo trợ nội dung</div>
            <ul className="text-sm space-y-4">
              <li className="flex items-center gap-4">
                <img
                  src="/hellodoctor.png"
                  alt="Hello Doctor"
                  className="w-20 h-14 object-contain"
                />
                <div>
                  <span className="font-semibold text-lg">Hello Doctor</span>
                  <br />
                  <span>Bảo trợ chuyên mục nội dung "sức khỏe tinh thần"</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <img
                  src="/Bernard.png"
                  alt="Bernard Healthcare"
                  className="w-20 h-14 object-contain"
                />
                <div>
                  <span className="font-semibold text-lg">
                    Hệ thống y khoa chuyên sâu quốc tế Bernard
                  </span>
                  <br />
                  <span>Bảo trợ chuyên mục nội dung "y khoa chuyên sâu"</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <img
                  src="/doctorcheck.png"
                  alt="Doctor Check"
                  className="w-20 h-14 object-contain"
                />
                <div>
                  <span className="font-semibold text-lg">
                    Doctor Check - Tầm Soát Bệnh Để Sống Thọ Hơn
                  </span>
                  <br />
                  <span>Bảo trợ chuyên mục nội dung "sức khỏe tổng quát"</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;