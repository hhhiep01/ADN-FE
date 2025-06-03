import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Example = () => {
  const [activeTab, setActiveTab] = useState<'disclaimer' | 'references' | 'feedback'>('disclaimer');
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Dummy send feedback function (replace with real API call if needed)
  const handleSendFeedback = () => {
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
    setFeedback('');
    // TODO: Gửi feedback cho admin ở đây
  };

  return (
    <div className="bg-[#f5f6fa] min-h-screen py-8 px-2 md:px-0">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-8">
          {/* Banner section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <img src="https://bookingcare.vn/assets/icon/bookingcare.svg" alt="logo" className="w-8 h-8" />
                <span className="text-[#00b6f3] font-bold text-xl">ADN Testing</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#ffb800] mb-2 uppercase leading-tight">
                XÉT NGHIỆM ADN:
              </h1>
              <div className="text-2xl md:text-3xl font-bold text-[#00b6f3] leading-tight mb-2">
                LÀ GÌ?<br />CÁC LOẠI XÉT NGHIỆM?<br />LƯU Ý GÌ?
              </div>
            </div>
            <div className="w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden bg-[#e6f7fd] flex items-center justify-center">
              <img src="/swp1.jpg" alt="ADN" className="object-cover w-full h-full" />
            </div>
          </div>
          {/* Breadcrumb */}
          <div className="text-center text-gray-600 mb-6 text-base md:text-lg">
            Xét nghiệm ADN là gì? Các loại xét nghiệm và lưu ý khi xét nghiệm ADN
          </div>
          {/* Title & author */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Xét nghiệm ADN là gì? Các loại xét nghiệm và lưu ý khi xét nghiệm ADN
          </h2>
          <div className="text-gray-500 text-sm mb-4">
            Tác giả: <span className="text-blue-700 font-medium">Thạc sĩ, Bác sĩ Nội trú Hán Minh Thùy</span> - Xuất bản: 30/10/2023 - <span className="font-medium">Cập nhật lần cuối: 30/10/2023</span>
          </div>
          {/* Article content */}
          <div className="text-gray-800 text-lg leading-relaxed space-y-6">
            <section>
              <h3 className="text-xl font-bold text-[#00b6f3] mb-2">1. Xét nghiệm ADN là gì?</h3>
              <p>
                Xét nghiệm ADN (DNA test) là một kỹ thuật phân tích thông tin di truyền có trong các tế bào của cơ thể người, chủ yếu từ chuỗi ADN (axit deoxyribonucleic). Đây là "bản đồ sinh học" giúp xác định các đặc điểm di truyền riêng biệt của từng cá nhân. Mỗi người có ADN gần như là duy nhất (ngoại trừ các cặp sinh đôi cùng trứng), nên việc phân tích ADN được coi như dấu vân tay sinh học không thể làm giả.
              </p>
              <p>
                Phân tích ADN có thể thực hiện bằng cách lấy mẫu từ nhiều nguồn khác nhau như: niêm mạc miệng (lấy bằng tăm bông), máu, tóc có chân, móng tay, cuống rốn, hoặc các mẫu sinh học khác. Công nghệ hiện đại ngày nay cho phép thực hiện xét nghiệm với độ chính xác cao lên tới 99,99% trong các trường hợp xác định quan hệ huyết thống.
              </p>
            </section>
            <section>
              <h3 className="text-xl font-bold text-[#00b6f3] mb-2">2. Khi nào cần thiết xét nghiệm ADN?</h3>
              <div className="ml-4 space-y-2">
                <div>
                  <h4 className="font-semibold text-blue-700">2.1. Về pháp lý – xác minh nhân thân:</h4>
                  <ul className="list-disc ml-6">
                    <li>Xác định quan hệ huyết thống (cha/mẹ - con): Trường hợp phổ biến nhất là khi có nghi vấn hoặc tranh chấp quyền nuôi con, nhận con ruột, hoặc cần làm giấy khai sinh, hộ khẩu.</li>
                    <li>Giải quyết tranh chấp thừa kế, tài sản: Xác định mối quan hệ huyết thống để phân chia tài sản theo pháp luật.</li>
                    <li>Tìm người thân thất lạc, trẻ bị bắt cóc hoặc nhận con nuôi: ADN giúp kết nối lại các thành viên trong gia đình bị thất lạc.</li>
                    <li>Thủ tục định cư, nhập tịch ở nước ngoài: Một số quốc gia yêu cầu xét nghiệm ADN để chứng minh mối quan hệ gia đình giữa người bảo lãnh và người được bảo lãnh.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700">2.2. Về y học – sức khỏe cá nhân và cộng đồng:</h4>
                  <ul className="list-disc ml-6">
                    <li>Tầm soát bệnh di truyền: Phát hiện sớm nguy cơ mắc các bệnh di truyền như ung thư vú (BRCA1/2), rối loạn chuyển hóa, bệnh máu khó đông, bệnh Huntington...</li>
                    <li>Xét nghiệm tiền hôn nhân – tiền sản: Giúp các cặp đôi phát hiện và phòng ngừa rủi ro di truyền cho con cái. Đặc biệt quan trọng với các cặp vợ chồng cùng mang gen bệnh lặn.</li>
                    <li>Chẩn đoán bệnh lý phức tạp: Khi có biểu hiện bệnh nghi ngờ do di truyền, xét nghiệm ADN hỗ trợ bác sĩ chẩn đoán chính xác và điều trị hiệu quả hơn.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700">2.3. Về điều tra hình sự – pháp y:</h4>
                  <ul className="list-disc ml-6">
                    <li>Xác định danh tính thủ phạm hoặc nạn nhân: ADN lấy từ hiện trường vụ án (như tóc, máu, tinh dịch...) giúp nhận dạng thủ phạm, hỗ trợ điều tra và truy tố.</li>
                    <li>Nhận dạng nạn nhân mất tích hoặc tử vong không xác định danh tính: So sánh mẫu ADN với người thân để xác minh danh tính thi thể.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700">2.4. Về nghiên cứu – phả hệ – tổ tiên:</h4>
                  <ul className="list-disc ml-6">
                    <li>Xét nghiệm nguồn gốc tổ tiên (DNA ancestry): Cung cấp thông tin về dòng dõi, chủng tộc, khu vực địa lý tổ tiên.</li>
                    <li>Khám phá cây phả hệ di truyền: Nhiều người sử dụng dịch vụ này để xây dựng cây gia đình và kết nối với họ hàng xa.</li>
                    <li>Nghiên cứu đặc điểm cá nhân: Bao gồm tính cách, phản ứng với thuốc, khả năng thể thao, nguy cơ dị ứng...</li>
                  </ul>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-xl font-bold text-[#00b6f3] mb-2">3. Các loại mẫu xét nghiệm ADN thường dùng:</h3>
              <ul className="list-disc ml-6">
                <li>Niêm mạc miệng (tăm bông): Không xâm lấn, dễ thu thập và phù hợp với trẻ nhỏ.</li>
                <li>Máu: Cho kết quả chính xác cao, thường dùng trong các xét nghiệm y học.</li>
                <li>Tóc có chân tóc: Phù hợp với các trường hợp điều tra pháp y hoặc khi người cần xét nghiệm đã mất.</li>
                <li>Móng tay, cuống rốn, mô sinh thiết: Dùng trong các trường hợp đặc biệt.</li>
                <li>Xương hoặc răng: Với những cá nhân đã qua đời và không còn mẫu mô mềm.</li>
              </ul>
            </section>
            <section>
              <h3 className="text-xl font-bold text-[#00b6f3] mb-2">4. Lưu ý khi xét nghiệm ADN:</h3>
              <ul className="list-disc ml-6">
                <li>Độ chính xác cao: Hầu hết các xét nghiệm ADN hiện nay có độ chính xác từ 99,9% trở lên.</li>
                <li>Thời gian trả kết quả: Thường từ 1 – 7 ngày làm việc, tùy dịch vụ.</li>
                <li>Yếu tố pháp lý: Nếu cần sử dụng trong tòa án hoặc thủ tục pháp lý, bạn cần thực hiện xét nghiệm tại trung tâm được cấp phép pháp y.</li>
                <li>Bảo mật thông tin: Các trung tâm uy tín cam kết bảo mật danh tính và kết quả khách hàng.</li>
              </ul>
            </section>
          </div>
          {/* Disclaimer section */}
          <div className="mt-12">
            <div className="border-2 border-[#00b6f3] rounded-lg">
              <div className="border-b border-[#00b6f3]">
                <div className="flex flex-wrap items-center gap-4 px-4 py-2 bg-white rounded-t-lg">
                  <button
                    type="button"
                    className={`text-[#00b6f3] font-semibold focus:outline-none ${activeTab === 'disclaimer' ? 'underline' : ''}`}
                    onClick={() => setActiveTab('disclaimer')}
                  >
                    Miễn trừ trách nhiệm
                  </button>
                  <span className="text-gray-500">&#9654;</span>
                  <button
                    type="button"
                    className={`text-[#00b6f3] font-semibold focus:outline-none ${activeTab === 'references' ? 'underline' : ''}`}
                    onClick={() => setActiveTab('references')}
                  >
                    Tài liệu tham khảo
                  </button>
                  <span className="text-gray-500">&#9654;</span>
                  <button
                    type="button"
                    className={`text-[#00b6f3] font-semibold focus:outline-none ${activeTab === 'feedback' ? 'underline' : ''}`}
                    onClick={() => setActiveTab('feedback')}
                  >
                    Góp ý về bài viết
                  </button>
                </div>
              </div>
              <div className="bg-yellow-50 p-6">
                {activeTab === 'disclaimer' && (
                  <div className="text-gray-700 text-base">
                    Nội dung bài viết chỉ mang tính chất tham khảo, không thay thế cho việc chẩn đoán và điều trị y khoa.
                  </div>
                )}
                {activeTab === 'references' && (
                  <div className="mt-0 border border-[#00b6f3] bg-white rounded p-4 text-gray-800 text-base">
                    <div className="mb-2 border-b border-[#00b6f3] pb-2">Tài liệu tham khảo</div>
                    <ul className="space-y-1">
                      <li>
                        <a href="https://www.cdc.gov/genomics/gtesting/genetic_testing.htm" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700">
                          https://www.cdc.gov/genomics/gtesting/genetic_testing.htm
                        </a>
                      </li>
                      <li>
                        <a href="https://medlineplus.gov/genetictesting.html" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700">
                          https://medlineplus.gov/genetictesting.html
                        </a>
                      </li>
                      <li>
                        <a href="https://medlatec.vn/tin-tuc/quy-trinh-xet-nghiem-adn-tai-nha-va-dia-chi-xet-nghiem-uy-tin-s58-n29624" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700">
                          https://medlatec.vn/tin-tuc/quy-trinh-xet-nghiem-adn-tai-nha-va-dia-chi-xet-nghiem-uy-tin-s58-n29624
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
                {activeTab === 'feedback' && (
                  <div className="mt-0 border border-[#00b6f3] bg-white rounded p-4 text-gray-800 text-base">
                    <div className="mb-2 border-b border-[#00b6f3] pb-2 font-semibold">Góp ý về bài viết</div>
                    {feedbackSent ? (
                      <div className="text-green-600 font-medium">Cảm ơn bạn đã gửi góp ý!</div>
                    ) : (
                      <>
                        <textarea
                          className="w-full border border-gray-300 rounded p-2 mb-2 focus:outline-none focus:border-[#00b6f3]"
                          rows={3}
                          placeholder="Nhập góp ý của bạn..."
                          value={feedback}
                          onChange={e => setFeedback(e.target.value)}
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
            <h3 className="font-bold text-lg text-gray-900 border-b-2 border-[#ffb800] pb-2 mb-2">Nội dung chính</h3>
            <ul className="space-y-2 text-gray-700 text-base">
              <li className="hover:text-[#00b6f3] cursor-pointer">Xét nghiệm ADN là gì?</li>
              <li className="hover:text-[#00b6f3] cursor-pointer">Khi nào cần thiết xét nghiệm ADN?</li>
              <li className="hover:text-[#00b6f3] cursor-pointer">Các loại mẫu xét nghiệm ADN thường dùng?</li>
              <li className="hover:text-[#00b6f3] cursor-pointer">Một số lưu ý về xét nghiệm ADN</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
              <span role="img" aria-label="robot">🤖</span> Khám phá thêm
            </h3>
            <div className="text-gray-700 text-base mb-2">
              Hỏi - đáp thông tin y tế về Bệnh viện top đầu cùng<br />Trợ lý AI của ADN Testing
            </div>
            <button className="bg-[#00b6f3] text-white font-semibold px-4 py-2 rounded hover:bg-[#009ed6] transition">Bắt đầu</button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex items-center gap-2">
            <input type="text" placeholder="Đặt câu hỏi với Trợ lý AI" className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none" />
            <button className="bg-[#ffb800] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#e6a700] transition">
              <span className="text-xl">➔</span>
            </button>
          </div>
        </div>
      </div>
      {/* Related articles */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
        <div className="relative">
          <button
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
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
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Card 1 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img src="/swp1.jpg" alt="ADN thai nhi" className="w-full h-36 object-cover rounded mb-3" />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">Xét nghiệm ADN thai nhi? Các loại xét nghiệm ADN thai nhi</div>
              <div className="text-gray-500 text-sm">Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023</div>
              <div className="text-gray-700 text-base mb-2">Tìm hiểu về xét nghiệm ADN thai nhi, lợi ích và các lưu ý khi thực hiện.</div>
              <Link to="/example2" className="readmore-btn">Đọc thêm →</Link>
            </div>
            {/* Card 2 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img src="/swp2.jpg" alt="ADN cha con" className="w-full h-36 object-cover rounded mb-3" />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">Xét nghiệm ADN cha con là gì? Quy trình thế nào?</div>
              <div className="text-gray-500 text-sm">Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023</div>
              <div className="text-gray-700 text-base mb-2">Giải đáp thắc mắc về xét nghiệm ADN cha con, bao gồm quy trình và chi phí.</div>
              <Link to="/example" className="readmore-btn">Đọc thêm →</Link>
            </div>
            {/* Card 3 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img src="/swp3.png" alt="Quy trình xét nghiệm" className="w-full h-36 object-cover rounded mb-3" />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">Tìm hiểu chi tiết quy trình xét nghiệm ADN</div>
              <div className="text-gray-500 text-sm">Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023</div>
              <div className="text-gray-700 text-base mb-2">Các bước trong quy trình xét nghiệm ADN và thời gian nhận kết quả.</div>
              <Link to="/example3" className="readmore-btn">Đọc thêm →</Link>
            </div>
            {/* Card 4 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img src="/docadn.png" alt="Kết quả xét nghiệm" className="w-full h-36 object-cover rounded mb-3" />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">Hướng dẫn cách đọc kết quả xét nghiệm ADN</div>
              <div className="text-gray-500 text-sm">Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023</div>
              <div className="text-gray-700 text-base mb-2">Cách đọc và hiểu các thông số trong kết quả xét nghiệm ADN.</div>
              <Link to="/example3" className="readmore-btn">Đọc thêm →</Link>
            </div>
            {/* Card 5 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img src="/swp1.jpg" alt="Ý nghĩa xét nghiệm ADN" className="w-full h-36 object-cover rounded mb-3" />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">Đọc ngay: Xét nghiệm ADN có ý nghĩa gì?</div>
              <div className="text-gray-500 text-sm">Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023</div>
              <div className="text-gray-700 text-base mb-2">Ý nghĩa của xét nghiệm ADN trong cuộc sống hiện đại.</div>
              <Link to="/example2" className="readmore-btn">Đọc thêm →</Link>
            </div>
            {/* Card 6 */}
            <div className="min-w-[320px] bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-xl transition">
              <img src="/swp2.jpg" alt="Lợi ích xét nghiệm ADN" className="w-full h-36 object-cover rounded mb-3" />
              <div className="font-semibold text-gray-900 mb-1 line-clamp-2">Lợi ích của xét nghiệm ADN đối với sức khỏe</div>
              <div className="text-gray-500 text-sm">Xuất bản 23/10/2023 | Cập nhật lần cuối 23/10/2023</div>
              <div className="text-gray-700 text-base mb-2">Khám phá các lợi ích sức khỏe khi thực hiện xét nghiệm ADN.</div>
              <Link to="/example" className="readmore-btn">Đọc thêm →</Link>
            </div>
          </div>
          <button
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
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
            <div className="text-sm mb-1">Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội</div>
            <div className="text-sm mb-1">ĐKKD số. 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015</div>
            <div className="text-sm mb-1">024-7301-2468 (7h - 18h)</div>
            <div className="text-sm mb-1">support@adntesting.vn (7h - 18h)</div>
            <div className="text-sm mb-1">Văn phòng tại TP Hồ Chí Minh: Tòa nhà H3, 384 Hoàng Diệu, Phường 6, Quận 4, TP.HCM</div>
            <div className="flex gap-2 mt-2">
              <img src="\logodk.png" alt="Đã đăng ký" className="h-7" />
              <img src="\logodk.png" alt="Đã thông báo" className="h-7" />
            </div>
          </div>
          <div>
            <div className="font-bold mb-2 text-[#00b6f3] flex items-center gap-2">
              <img src="https://bookingcare.vn/assets/icon/bookingcare.svg" alt="logo" className="w-7 h-7" /> ADN Testing
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
                <img src="/hellodoctor.png" alt="Hello Doctor" className="w-20 h-14 object-contain" />
                <div>
                  <span className="font-semibold text-lg">Hello Doctor</span><br />
                  <span>Bảo trợ chuyên mục nội dung "sức khỏe tinh thần"</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <img src="\Bernard.png" alt="Bernard Healthcare" className="w-20 h-14 object-contain" />
                <div>
                  <span className="font-semibold text-lg">Hệ thống y khoa chuyên sâu quốc tế Bernard</span><br />
                  <span>Bảo trợ chuyên mục nội dung "y khoa chuyên sâu"</span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <img src="/doctorcheck.png" alt="Doctor Check" className="w-20 h-14 object-contain" />
                <div>
                  <span className="font-semibold text-lg">Doctor Check - Tầm Soát Bệnh Để Sống Thọ Hơn</span><br />
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

export default Example;
