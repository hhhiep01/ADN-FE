import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlog, type GetBlogResponse } from "../Services/BlogService/GetBlog";

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

  // Dummy send feedback function (replace with real API call if needed)
  const handleSendFeedback = () => {
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
    setFeedback("");
    // TODO: Gửi feedback cho admin ở đây
  };

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
    <div className="bg-[#f5f6fa] min-h-screen py-8 px-2 md:px-0">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-8">
          {/* Banner section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="https://bookingcare.vn/assets/icon/bookingcare.svg"
                  alt="logo"
                  className="w-8 h-8"
                />
                <span className="text-[#00b6f3] font-bold text-xl">
                  ADN Testing
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#ffb800] mb-2 uppercase leading-tight">
                {blog.title}
              </h1>
              <div className="text-2xl md:text-3xl font-bold text-[#00b6f3] leading-tight mb-2">
                {/* You can split or highlight title if needed */}
              </div>
            </div>
            <div className="w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden bg-[#e6f7fd] flex items-center justify-center">
              <img
                src={blog.image}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          {/* Breadcrumb */}
          <div className="text-center text-gray-600 mb-6 text-base md:text-lg">
            {blog.title}
          </div>
          {/* Title & author */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {blog.title}
          </h2>
          <div className="text-gray-500 text-sm mb-4">
            Tác giả:{" "}
            <span className="text-blue-700 font-medium">{blog.authorName}</span>{" "}
            - Xuất bản: {new Date(blog.createdDate).toLocaleDateString()} -{" "}
            <span className="font-medium">
              Cập nhật lần cuối:{" "}
              {blog.modifiedDate
                ? new Date(blog.modifiedDate).toLocaleDateString()
                : "-"}
            </span>
          </div>
          {/* Article content */}
          <div className="text-gray-800 text-lg leading-relaxed space-y-6">
            {/* Render content as HTML if trusted, else use plain text */}
            <div
              dangerouslySetInnerHTML={{
                __html: blog.content.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
          {/* Disclaimer section */}
          <div className="mt-12">
            <div className="border-2 border-[#00b6f3] rounded-lg">
              <div className="border-b border-[#00b6f3]">
                <div className="flex flex-wrap items-center gap-4 px-4 py-2 bg-white rounded-t-lg">
                  <button
                    type="button"
                    className={`text-[#00b6f3] font-semibold focus:outline-none ${
                      activeTab === "disclaimer" ? "underline" : ""
                    }`}
                    onClick={() => setActiveTab("disclaimer")}
                  >
                    Miễn trừ trách nhiệm
                  </button>
                  <span className="text-gray-500">&#9654;</span>
                  <button
                    type="button"
                    className={`text-[#00b6f3] font-semibold focus:outline-none ${
                      activeTab === "references" ? "underline" : ""
                    }`}
                    onClick={() => setActiveTab("references")}
                  >
                    Tài liệu tham khảo
                  </button>
                  <span className="text-gray-500">&#9654;</span>
                  <button
                    type="button"
                    className={`text-[#00b6f3] font-semibold focus:outline-none ${
                      activeTab === "feedback" ? "underline" : ""
                    }`}
                    onClick={() => setActiveTab("feedback")}
                  >
                    Góp ý về bài viết
                  </button>
                </div>
              </div>
              <div className="bg-yellow-50 p-6">
                {activeTab === "disclaimer" && (
                  <div className="text-gray-700 text-base">
                    Nội dung bài viết chỉ mang tính chất tham khảo, không thay
                    thế cho việc chẩn đoán và điều trị y khoa.
                  </div>
                )}
                {activeTab === "references" && (
                  <div className="mt-0 border border-[#00b6f3] bg-white rounded p-4 text-gray-800 text-base">
                    <div className="mb-2 border-b border-[#00b6f3] pb-2">
                      Tài liệu tham khảo
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <a
                          href="https://www.cdc.gov/genomics/gtesting/genetic_testing.htm"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-700"
                        >
                          https://www.cdc.gov/genomics/gtesting/genetic_testing.htm
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://medlineplus.gov/genetictesting.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-700"
                        >
                          https://medlineplus.gov/genetictesting.html
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://medlatec.vn/tin-tuc/quy-trinh-xet-nghiem-adn-tai-nha-va-dia-chi-xet-nghiem-uy-tin-s58-n29624"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-blue-700"
                        >
                          https://medlatec.vn/tin-tuc/quy-trinh-xet-nghiem-adn-tai-nha-va-dia-chi-xet-nghiem-uy-tin-s58-n29624
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
                {activeTab === "feedback" && (
                  <div className="mt-0 border border-[#00b6f3] bg-white rounded p-4 text-gray-800 text-base">
                    <div className="mb-2 border-b border-[#00b6f3] pb-2 font-semibold">
                      Góp ý về bài viết
                    </div>
                    {feedbackSent ? (
                      <div className="text-green-600 font-medium">
                        Cảm ơn bạn đã gửi góp ý!
                      </div>
                    ) : (
                      <>
                        <textarea
                          className="w-full border border-gray-300 rounded p-2 mb-2 focus:outline-none focus:border-[#00b6f3]"
                          rows={3}
                          placeholder="Nhập góp ý của bạn..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <button
                          className="bg-[#00b6f3] text-white px-4 py-2 rounded hover:bg-[#009ed6] font-semibold"
                          onClick={handleSendFeedback}
                          disabled={!feedback.trim()}
                        >
                          Gửi góp ý
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg text-gray-900 border-b-2 border-[#ffb800] pb-2 mb-2">
              Nội dung chính
            </h3>
            <ul className="space-y-2 text-gray-700 text-base">
              <li className="hover:text-[#00b6f3] cursor-pointer">
                Xét nghiệm ADN là gì?
              </li>
              <li className="hover:text-[#00b6f3] cursor-pointer">
                Khi nào cần thiết xét nghiệm ADN?
              </li>
              <li className="hover:text-[#00b6f3] cursor-pointer">
                Các loại mẫu xét nghiệm ADN thường dùng?
              </li>
              <li className="hover:text-[#00b6f3] cursor-pointer">
                Một số lưu ý về xét nghiệm ADN
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
              <span role="img" aria-label="robot">
                🤖
              </span>{" "}
              Khám phá thêm
            </h3>
            <div className="text-gray-700 text-base mb-2">
              Hỏi - đáp thông tin y tế về Bệnh viện top đầu cùng
              <br />
              Trợ lý AI của ADN Testing
            </div>
            <button className="bg-[#00b6f3] text-white font-semibold px-4 py-2 rounded hover:bg-[#009ed6] transition">
              Bắt đầu
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Đặt câu hỏi với Trợ lý AI"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
            <button className="bg-[#ffb800] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#e6a700] transition">
              <span className="text-xl">➔</span>
            </button>
          </div>
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
            {/* Card 1 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img
                src="/swp1.jpg"
                alt="ADN thai nhi"
                className="w-full h-36 object-cover rounded mb-3"
              />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                Xét nghiệm ADN thai nhi? Các loại xét nghiệm ADN thai nhi
              </div>
              <div className="text-gray-500 text-sm">
                Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023
              </div>
              <div className="text-gray-700 text-base mb-2">
                Tìm hiểu về xét nghiệm ADN thai nhi, lợi ích và các lưu ý khi
                thực hiện.
              </div>
              <Link to="/example2" className="readmore-btn">
                Đọc thêm →
              </Link>
            </div>
            {/* Card 2 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img
                src="/swp2.jpg"
                alt="ADN cha con"
                className="w-full h-36 object-cover rounded mb-3"
              />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                Xét nghiệm ADN cha con là gì? Quy trình thế nào?
              </div>
              <div className="text-gray-500 text-sm">
                Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023
              </div>
              <div className="text-gray-700 text-base mb-2">
                Giải đáp thắc mắc về xét nghiệm ADN cha con, bao gồm quy trình
                và chi phí.
              </div>
              <Link to="/example" className="readmore-btn">
                Đọc thêm →
              </Link>
            </div>
            {/* Card 3 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img
                src="/swp3.png"
                alt="Quy trình xét nghiệm"
                className="w-full h-36 object-cover rounded mb-3"
              />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                Tìm hiểu chi tiết quy trình xét nghiệm ADN
              </div>
              <div className="text-gray-500 text-sm">
                Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023
              </div>
              <div className="text-gray-700 text-base mb-2">
                Các bước trong quy trình xét nghiệm ADN và thời gian nhận kết
                quả.
              </div>
              <Link to="/example3" className="readmore-btn">
                Đọc thêm →
              </Link>
            </div>
            {/* Card 4 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img
                src="/docadn.png"
                alt="Kết quả xét nghiệm"
                className="w-full h-36 object-cover rounded mb-3"
              />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                Hướng dẫn cách đọc kết quả xét nghiệm ADN
              </div>
              <div className="text-gray-500 text-sm">
                Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023
              </div>
              <div className="text-gray-700 text-base mb-2">
                Cách đọc và hiểu các thông số trong kết quả xét nghiệm ADN.
              </div>
              <Link to="/example3" className="readmore-btn">
                Đọc thêm →
              </Link>
            </div>
            {/* Card 5 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img
                src="/swp1.jpg"
                alt="Ý nghĩa xét nghiệm ADN"
                className="w-full h-36 object-cover rounded mb-3"
              />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                Đọc ngay: Xét nghiệm ADN có ý nghĩa gì?
              </div>
              <div className="text-gray-500 text-sm">
                Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023
              </div>
              <div className="text-gray-700 text-base mb-2">
                Ý nghĩa của xét nghiệm ADN trong cuộc sống hiện đại.
              </div>
              <Link to="/example2" className="readmore-btn">
                Đọc thêm →
              </Link>
            </div>
            {/* Card 6 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img
                src="/swp2.jpg"
                alt="Lợi ích xét nghiệm ADN"
                className="w-full h-36 object-cover rounded mb-3"
              />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                Lợi ích của xét nghiệm ADN đối với sức khỏe
              </div>
              <div className="text-gray-500 text-sm">
                Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023
              </div>
              <div className="text-gray-700 text-base mb-2">
                Khám phá các lợi ích sức khỏe khi thực hiện xét nghiệm ADN.
              </div>
              <Link to="/example" className="readmore-btn">
                Đọc thêm →
              </Link>
            </div>
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
