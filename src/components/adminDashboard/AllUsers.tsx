import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { userApi } from "../../features/api/userApi";
import type { RootState } from "../../apps/store";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import Swal from "sweetalert2";

interface UserDetail {
  id: number;
  firstName: string;
  lastName: string;
  profileUrl?: string;
  email: string;
  role: 'user' | 'admin' | 'disabled';
  createdAt: string;
}

interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'disabled';
  profileUrl?: string;
}

const getUserRoleBadge = (role: string) => {
  switch (role) {
    case "admin": return "badge-success text-green-800 bg-green-200 border-green-300";
    case "disabled": return "badge-error text-red-800 bg-red-200 border-red-300";
    case "user": return "badge-warning text-yellow-800 bg-yellow-200 border-yellow-300";
    default: return "badge-primary";
  }
}

export const AllUsers = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin' | 'disabled'>("user");
  const [newUser, setNewUser] = useState<NewUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    profileUrl: "",
  });

  const { token } = useSelector((state: RootState) => state.auth);

  const [updateUser] = userApi.useUpdateUserProfileMutation();
  const [deleteUser] = userApi.useDeleteUserProfileMutation();
  const [addUser] = userApi.useRegisterUserMutation();

  const { data: usersData = [], isLoading: userDataIsLoading, error: fetchError, refetch } = 
    userApi.useGetAllUsersProfilesQuery(undefined, { skip: !token });

  const handleEditModalToggle = (user?: UserDetail) => {
    setIsEditModalOpen(!isEditModalOpen);
    if (user) {
      setSelectedUser(user);
      setNewRole(user.role);
    } else {
      setSelectedUser(null);
      setNewRole("user");
    }
  };

  const handleAddModalToggle = () => {
    setIsAddModalOpen(!isAddModalOpen);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "user",
      profileUrl: "",
    });
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && newRole) {
      try {
        await updateUser({ 
          userId: selectedUser.id, 
          role: newRole 
        }).unwrap();
        setIsEditModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "User Updated",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update user role",
        });
      }
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser(newUser).unwrap();
      setIsAddModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "User Added",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add user",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId).unwrap();
        Swal.fire(
          'Deleted!',
          'User has been deleted successfully.',
          'success'
        );
        refetch();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete user",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-center mb-4 text-purple-900">
          Manage All Users
        </h1>
        <button
          onClick={handleAddModalToggle}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add User
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
        {fetchError ? (
          <div className="text-red-600 text-center py-4 text-lg">
            Error fetching user data. Please try again.
          </div>
        ) : userDataIsLoading ? (
          <div className="flex justify-center items-center py-8">
            <PuffLoader color="#8B5CF6" size={60} />
            <span className="ml-4 text-gray-700">Loading users...</span>
          </div>
        ) : usersData.length === 0 ? (
          <div className="text-center text-gray-600 py-8 text-lg">
            No users found.
          </div>
        ) : (
          <table className="table w-full text-left">
            <thead>
              <tr className="bg-purple-100 text-purple-800 text-sm uppercase">
                <th className="p-4 rounded-tl-lg"> # </th>
                <th className="p-4">User</th>
                <th className="p-4">Joined On</th>
                <th className="p-4">Role</th>
                <th className="p-4 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData?.map((user: UserDetail) => (
                <tr key={user.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <th className="p-4 text-gray-700"> {user.id} </th>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12 border-2 border-orange-400">
                          <img
                            src={user.profileUrl || "/default-avatar.png"}
                            alt={`${user.firstName} ${user.lastName} Avatar`}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-700">{user.firstName} {user.lastName}</div>
                        <div className="text-sm opacity-70 text-gray-600">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700"> {new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className={`badge text-xs font-semibold px-3 py-1 rounded-full ${getUserRoleBadge(user.role)} `}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-outline border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-colors duration-200"
                        onClick={() => handleEditModalToggle(user)}
                      >
                        <FiEdit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit User Role Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="modal modal-open flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-box bg-white p-8 rounded-lg shadow-xl relative max-w-lg w-full">
            <button
              className="btn btn-sm btn-circle absolute right-4 top-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() => handleEditModalToggle()}
            >
              ✕
            </button>
            <div className="flex justify-center items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700">Change User Role for {selectedUser.firstName}</h2>
            </div>
            <form onSubmit={handleRoleUpdate}>
              <div className="mb-6">
                <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
                <select
                  id="userRole"
                  className="select select-bordered w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'user' | 'admin' | 'disabled')}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleEditModalToggle()}
                  className="btn bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <SaveIcon className="w-4 h-4"/> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="modal modal-open flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-box bg-white p-8 rounded-lg shadow-xl relative max-w-2xl w-full">
            <button
              className="btn btn-sm btn-circle absolute right-4 top-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={handleAddModalToggle}
            >
              ✕
            </button>
            <div className="flex justify-center items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700">Add New User</h2>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={newUser.firstName}
                    onChange={handleNewUserChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={newUser.lastName}
                    onChange={handleNewUserChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    className="input input-bordered w-full"
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Profile Image URL</span>
                  </label>
                  <input
                    type="text"
                    name="profileUrl"
                    value={newUser.profileUrl || ""}
                    onChange={handleNewUserChange}
                    className="input input-bordered w-full"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role*</span>
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleAddModalToggle}
                  className="btn bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 flex items-center gap-2"
                >
                  <SaveIcon className="w-4 h-4"/> Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};