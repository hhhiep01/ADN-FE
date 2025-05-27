import { useAuth } from '../hooks/useAuth';

const UserProfile = () => {
  const { user, isAuthenticated, isLoading, logout, isAdmin } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div>Bạn chưa đăng nhập</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Thông tin người dùng</h2>
      
      <div className="space-y-2">
        <p><strong>ID:</strong> {user.userId}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Họ tên:</strong> {user.fullName}</p>
        <p><strong>Vai trò:</strong> {user.role}</p>
        {isAdmin && (
          <p className="text-blue-600"><strong>Quyền:</strong> Quản trị viên</p>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default UserProfile; 