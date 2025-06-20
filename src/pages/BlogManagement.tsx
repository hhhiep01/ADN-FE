import React, { useEffect, useState } from "react";
import { getAllBlog } from "../Services/BlogService/getAllBlog";
import type { BlogItem } from "../Services/BlogService/getAllBlog";
import { createBlog } from "../Services/BlogService/CreateBlog";
import { updateBlog } from "../Services/BlogService/UpdateBlog";
import { deleteBlog } from "../Services/BlogService/DeleteBlog";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [newBlog, setNewBlog] = useState<
    Omit<
      BlogItem,
      "id" | "userAccountId" | "authorName" | "createdDate" | "modifiedDate"
    >
  >({
    title: "",
    content: "",
    image: "",
  });
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);

  // States for image upload (create)
  const [selectedCreateImage, setSelectedCreateImage] = useState<File | null>(
    null
  );
  const [isCreatingImageUploading, setIsCreatingImageUploading] =
    useState(false);
  const [uploadedCreateImageUrl, setUploadedCreateImageUrl] =
    useState<string>("");

  // States for image upload (edit)
  const [selectedEditImage, setSelectedEditImage] = useState<File | null>(null);
  const [isEditingImageUploading, setIsEditingImageUploading] = useState(false);
  const [uploadedEditImageUrl, setUploadedEditImageUrl] = useState<string>("");

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const CLOUDINARY_CLOUD_NAME = "dku0qdaan";
    const CLOUDINARY_UPLOAD_PRESET = "ADN_SWP";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Cloudinary upload failed");
    }
    const data = await response.json();
    return data.secure_url;
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await getAllBlog({ pageIndex: 1, pageSize: 100 });
      if (response.isSuccess) {
        setBlogs(response.result || []);
        setError(null);
      } else {
        setError(response.errorMessage || "Không thể tải danh sách blog");
      }
    } catch (err) {
      setError("Lỗi khi tải danh sách blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog: BlogItem) => {
    setEditingBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      await deleteBlog(id.toString());
      fetchBlogs();
    }
  };

  const handleCreateBlog = async () => {
    await createBlog({ ...newBlog, id: 0, image: uploadedCreateImageUrl });
    setIsCreateModalOpen(false);
    setNewBlog({ title: "", content: "", image: "" });
    setSelectedCreateImage(null);
    setUploadedCreateImageUrl("");
    fetchBlogs();
  };

  const handleUpdateBlog = async () => {
    if (editingBlog) {
      await updateBlog({
        ...editingBlog,
        image: uploadedEditImageUrl || editingBlog.image,
      });
      setIsEditModalOpen(false);
      setSelectedEditImage(null);
      setUploadedEditImageUrl("");
      fetchBlogs();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingBlog)
      setEditingBlog((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (loading)
    return (
      <div className="text-center py-12 text-gray-600">Đang tải dữ liệu...</div>
    );
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Quản lý Blog</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Thêm bài viết
        </button>
      </div>
      {/* Create Blog Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Thêm bài viết mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  value={newBlog.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung
                </label>
                <textarea
                  name="content"
                  value={newBlog.content}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedCreateImage(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {uploadedCreateImageUrl && (
                  <img
                    src={uploadedCreateImageUrl}
                    alt="Preview"
                    className="mt-2 w-32 h-20 object-cover rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={async () => {
                    if (selectedCreateImage) {
                      setIsCreatingImageUploading(true);
                      try {
                        const url = await uploadImageToCloudinary(
                          selectedCreateImage
                        );
                        setUploadedCreateImageUrl(url);
                        alert("Tải lên ảnh thành công!");
                      } catch (err: any) {
                        alert(`Lỗi tải lên ảnh: ${err.message}`);
                      } finally {
                        setIsCreatingImageUploading(false);
                      }
                    }
                  }}
                  disabled={!selectedCreateImage || isCreatingImageUploading}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isCreatingImageUploading ? "Đang tải..." : "Tải lên ảnh"}
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateBlog}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tạo bài viết
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Blog Modal */}
      {isEditModalOpen && editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Chỉnh sửa bài viết</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingBlog.title}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung
                </label>
                <textarea
                  name="content"
                  value={editingBlog.content}
                  onChange={handleEditInputChange}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedEditImage(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {(uploadedEditImageUrl || editingBlog.image) && (
                  <img
                    src={uploadedEditImageUrl || editingBlog.image}
                    alt="Preview"
                    className="mt-2 w-32 h-20 object-cover rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={async () => {
                    if (selectedEditImage) {
                      setIsEditingImageUploading(true);
                      try {
                        const url = await uploadImageToCloudinary(
                          selectedEditImage
                        );
                        setUploadedEditImageUrl(url);
                        alert("Tải lên ảnh thành công!");
                      } catch (err: any) {
                        alert(`Lỗi tải lên ảnh: ${err.message}`);
                      } finally {
                        setIsEditingImageUploading(false);
                      }
                    }
                  }}
                  disabled={!selectedEditImage || isEditingImageUploading}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isEditingImageUploading ? "Đang tải..." : "Tải lên ảnh"}
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateBlog}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="px-6 py-4 whitespace-nowrap">{blog.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{blog.content}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">Không có ảnh</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(blog)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogManagement;
