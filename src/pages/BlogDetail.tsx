import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getBlog, type GetBlogResponse } from "../Services/BlogService/GetBlog";
import { getAllBlog } from "../Services/BlogService/getAllBlog";
import { getCommentsByBlogId, postComment, deleteComment, updateComment } from "../Services/CommentService/CommentService";
import { useAuth } from "../hooks/useAuth";

const BlogDetail = () => {
  const [activeTab, setActiveTab] = useState<
    "disclaimer" | "references" | "feedback"
  >("disclaimer");
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Blog data state
  const [blog, setBlog] = useState<GetBlogResponse["result"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  const [relatedBlogs, setRelatedBlogs] = useState<GetBlogResponse["result"][]>([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const { isAuthenticated, isCustomer, isLoading: authLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        // You can get id from params or hardcode for demo
        const blogId = id ? parseInt(id) : 7;
        const res = await getBlog(blogId);
        setBlog(res.result);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Lấy danh sách blog liên quan
  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const res = await getAllBlog();
        // Loại trừ bài hiện tại, lấy 6 bài đầu tiên
        const filtered = res.result.filter((item: any) => item.id !== blog?.id).slice(0, 6);
        setRelatedBlogs(filtered);
      } catch (err) {
        // Xử lý lỗi nếu cần
      }
    };
    if (blog) fetchRelatedBlogs();
  }, [blog]);

  // Lấy comment từ API
  useEffect(() => {
    const fetchComments = async () => {
      if (!blog) return;
      setCommentLoading(true);
      setCommentError(null);
      try {
        const res = await getCommentsByBlogId(blog.id);
        setComments(res.data.result || []);
      } catch (err: any) {
        setCommentError(err.message || "Lỗi khi tải bình luận");
      } finally {
        setCommentLoading(false);
      }
    };
    if (blog) fetchComments();
  }, [blog]);

  // Dummy send feedback function (replace with real API call if needed)
  const handleSendFeedback = () => {
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
    setFeedback("");
    // TODO: Gửi feedback cho admin ở đây
  };

  // Gửi comment thực tế
  const handleSendComment = async () => {
    if (!comment.trim() || !blog) return;
    try {
      setCommentLoading(true);
      await postComment(comment, blog.id, user?.fullName);
      setComment("");
      // Reload comment list
      const res = await getCommentsByBlogId(blog.id);
      setComments(res.data.result || []);
    } catch (err: any) {
      setCommentError(err.message || "Lỗi khi gửi bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  // Xóa comment
  const handleDeleteComment = async (commentId: number) => {
    if (!blog) return;
    try {
      setCommentLoading(true);
      await deleteComment(commentId);
      // Reload comment list
      const res = await getCommentsByBlogId(blog.id);
      setComments(res.data.result || []);
    } catch (err: any) {
      setCommentError(err.message || "Lỗi khi xóa bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  // Bắt đầu chỉnh sửa comment
  const handleStartEdit = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async (comment: any) => {
    if (!blog) return;
    try {
      setCommentLoading(true);
      await updateComment(comment.id, editingContent, blog.id);
      setEditingCommentId(null);
      setEditingContent("");
      // Reload comment list
      const res = await getCommentsByBlogId(blog.id);
      setComments(res.data.result || []);
    } catch (err: any) {
      setCommentError(err.message || "Lỗi khi cập nhật bình luận");
    } finally {
      setCommentLoading(false);
    }
  };

  function highlightQuestions(html: string): string {
    return html.replace(/([^.!?]*\?)(<br\/>|$)/g, (match: string, p1: string, p2: string) => {
      if (p1.trim().endsWith('?')) {
        return `<span class=\"font-semibold text-[#1976d2]\">${p1}</span>${p2}`;
      }
      return match;
    });
  }

  if (loading)
    return (
      <div className="text-center py-12 text-gray-600">
        Đang tải bài viết...
      </div>
    );
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!blog)
    return (
      <div className="text-center py-12 text-gray-600">
        Không tìm thấy bài viết
      </div>
    );

  return (
    <div className="bg-[#f5f8fc] min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <img
                src="https://bookingcare.vn/assets/icon/bookingcare.svg"
                alt="logo"
                className="w-10 h-10"
              />
              <span className="text-[#1976d2] font-bold text-2xl">ADN Testing</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1976d2] mb-2 leading-tight">
              {blog.title}
            </h1>
          </div>
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-[#e3f2fd] shadow">
            <img
              src={blog.image}
              alt={blog.title}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        {/* Author & Date */}
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-[#1976d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z"/></svg>
            {blog.authorName}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-[#1976d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            {new Date(blog.createdDate).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-[#1976d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            Cập nhật: {blog.modifiedDate ? new Date(blog.modifiedDate).toLocaleDateString() : "-"}
          </span>
        </div>
        {/* Nội dung */}
        <div className="prose max-w-none prose-blue prose-lg">
          <div
            dangerouslySetInnerHTML={{
              __html: highlightQuestions(blog.content.replace(/\n/g, "<br/>")),
            }}
          />
        </div>
      </div>
      {/* Related articles */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Bài viết liên quan
        </h2>
        <div className="relative">
          <button
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({
                  left: -350,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-12 h-12 flex items-center justify-center text-2xl text-gray-500 hover:bg-gray-100"
            aria-label="Trước"
          >
            &lt;
          </button>
          <div
            ref={carouselRef}
            className="overflow-x-auto flex gap-6 pb-4 scroll-smooth no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {relatedBlogs.map((item) => (
              <div key={item.id} className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
                <img
                  src={item.image || "/default.jpg"}
                  alt={item.title}
                  className="w-full h-36 object-cover rounded mb-3"
                />
                <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {item.title}
                </div>
                <div className="text-gray-500 text-sm">
                  Xuất bản {new Date(item.createdDate).toLocaleDateString()} | Cập nhật lần cuối {item.modifiedDate ? new Date(item.modifiedDate).toLocaleDateString() : "-"}
                </div>
                <div className="text-gray-700 text-base mb-2">
                  {(item.content ? item.content.slice(0, 80) + "..." : "")}
                </div>
                <Link to={`/blog-detail/${item.id}`} className="readmore-btn">
                  Đọc thêm →
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({ left: 350, behavior: "smooth" });
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-12 h-12 flex items-center justify-center text-2xl text-gray-500 hover:bg-gray-100"
            aria-label="Sau"
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Comment Section */}
      <div className="max-w-4xl mx-auto mt-12 mb-16 bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-[#1976d2]">Bình luận</h3>
        {authLoading ? (
          <div>Đang kiểm tra đăng nhập...</div>
        ) : isAuthenticated && isCustomer ? (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Nhập bình luận của bạn..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSendComment(); }}
              disabled={commentLoading}
            />
            <button
              className="bg-[#1976d2] text-white px-4 py-2 rounded font-semibold"
              onClick={handleSendComment}
              disabled={commentLoading || !comment.trim()}
            >
              {commentLoading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        ) : (
          <div className="mb-4 text-gray-500">
            Bạn cần <Link to={`/customer/login?redirect=${encodeURIComponent(location.pathname)}`} className="text-blue-600 underline">đăng nhập</Link> bằng tài khoản khách hàng để bình luận.
          </div>
        )}
        {commentError && <div className="text-red-500 mb-2">{commentError}</div>}
        <div>
          {commentLoading && comments.length === 0 ? (
            <div>Đang tải bình luận...</div>
          ) : comments.length === 0 ? (
            <div className="text-gray-500">Chưa có bình luận nào.</div>
          ) : (
            <ul className="space-y-2">
              {comments.map((c: any, idx: number) => {
                const isMyComment = user && c.authorName && user.fullName && c.authorName === user.fullName;
                return (
                  <li key={c.id || idx} className="bg-[#f5f8fc] rounded px-3 py-2">
                    <div className="font-semibold text-[#1976d2]">{c.authorName || "Ẩn danh"}</div>
                    {editingCommentId === c.id ? (
                      <>
                        <textarea
                          className="w-full border rounded px-2 py-1 mb-2"
                          value={editingContent}
                          onChange={e => setEditingContent(e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2 mb-1">
                          <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => handleSaveEdit(c)} disabled={commentLoading}>Lưu</button>
                          <button className="px-3 py-1 bg-gray-300 rounded" onClick={handleCancelEdit} disabled={commentLoading}>Hủy</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>{c.content}</div>
                        <div className="text-xs text-gray-400">{c.createdDate ? new Date(c.createdDate).toLocaleString() : ""}</div>
                        {isMyComment && (
                          <div className="flex gap-2 mt-1">
                            <button className="px-2 py-0.5 bg-yellow-400 text-xs rounded" onClick={() => handleStartEdit(c)} disabled={commentLoading}>Sửa</button>
                            <button className="px-2 py-0.5 bg-red-400 text-xs text-white rounded" onClick={() => handleDeleteComment(c.id)} disabled={commentLoading}>Xóa</button>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
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
              <img src="\logodk.png" alt="Đã đăng ký" className="h-7" />
              <img src="\logodk.png" alt="Đã thông báo" className="h-7" />
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
            {/* Nếu bạn muốn giữ lại phần menu, hãy thêm lại ul/li ở đây */}
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
                  src="\Bernard.png"
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

export default BlogDetail;
