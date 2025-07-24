import { useEffect, useState } from 'react';
import { FaCamera, FaEdit, FaTimes } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { SaveIcon } from 'lucide-react';
import type { RootState } from '../../apps/store';
import Swal from 'sweetalert2';

import { useUpdateUserProfileMutation, useUpdateUserProfileImageMutation } from '../../features/api/userApi';


interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  contactNo: string;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      address: user?.address || '',
      contactNo: user?.contactNo || '',
    }
  });

  const profilePicture = user?.profileUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || 'User')}+${encodeURIComponent(user?.lastName || 'Profile')}&background=A78BFA&color=fff&size=128`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Correctly destructure `isLoading` from the RTK Query hooks
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [updateProfileImage, { isLoading: isUploadingImage }] = useUpdateUserProfileImageMutation();


  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen && user) {
     
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address || '',
        contactNo: user.contactNo || '',
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (role === 'user') {
      navigate('/userDashboard/my-profile');

    //  } else if (role !== 'admin') {
    //   navigate('/dashboard/my-profile');
    }
  }, [isAuthenticated, role, navigate]);


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      
      const userId = user?.userId;
      if (!userId) {
        Swal.fire('Error!', 'User ID not found. Cannot update profile.', 'error');
        return;
      }

      await updateProfile({ userId: userId, ...data }).unwrap();
      Swal.fire('Success!', 'Profile updated successfully!', 'success');
      handleModalToggle(); 
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      Swal.fire('Error!', error?.data?.message || 'Failed to update profile. Please try again.', 'error');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Swal.fire({
        title: 'Uploading Image...',
        text: 'Please wait, your profile picture is being uploaded.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const userId = user?.userId;
        if (!userId) {
          Swal.fire('Error!', 'User ID not found for image upload.', 'error');
          return;
        }

        // --- Important: This section requires backend implementation for file upload ---
        // Your `updateUserProfileImage` mutation expects `{ userId: number; profileUrl: string }`.
        // This implies your backend either expects the URL directly, or
        // you have a separate endpoint for file uploads that returns a URL.
        // If your backend expects a direct file upload, you'd do something like this:

        // const formData = new FormData();
        // formData.append('profileImage', file); // 'profileImage' should match your backend's expected field name

        // // Assuming you have an API endpoint specifically for image upload that returns a URL
        // const uploadResponse = await fetch('http://localhost:8000/api/upload-profile-image', {
        //   method: 'POST',
        //   body: formData,
        //   // Add headers if needed, e.g., for authentication
        //   // headers: {
        //   //   'Authorization': `Bearer ${token}` // If you have a token
        //   // }
        // });
        // if (!uploadResponse.ok) {
        //   throw new Error('Image upload failed');
        // }
        // const uploadData = await uploadResponse.json();
        // const newProfileUrl = uploadData.url; // Get the URL from your backend's response

        // If your `updateUserProfileImage` directly takes a file to convert it to URL on backend,
        // you might need a different mutation structure or a pre-signed URL approach.
        // Given your current `updateUserProfileImage` signature `{ userId: number; profileUrl: string }`,
        // it means you need to provide the `profileUrl` to the mutation.
        // For simplicity, let's assume `URL.createObjectURL` as a placeholder for visual update
        // and that your backend is robust enough to handle the `profileUrl` field.
        // In a real scenario, you would upload the file first to get the `profileUrl`.

        const temporaryProfileUrl = URL.createObjectURL(file); // For immediate visual feedback

        // Call the mutation to update the user's profile URL in the database
       
        await updateProfileImage({ userId: userId, profileUrl: temporaryProfileUrl }).unwrap();

        Swal.fire('Success!', 'Profile image updated successfully!', 'success');
        // IMPORTANT: After a successful image upload and profile update,
        // you should dispatch an action to update the user's profile URL in your Redux store
        // so the UI (e.g., the image itself) reflects the change immediately.
        // Example (you'd need to define `setCredentials` in your auth slice):
        // dispatch(setCredentials({ ...user, profileUrl: newProfileUrl })); // Or use the temporary URL
        // For production, ensure `newProfileUrl` comes from your backend after successful permanent storage.

      } catch (error: any) {
        console.error('Failed to update profile image:', error);
        Swal.fire('Error!', error?.data?.message || 'Failed to upload image. Please try again.', 'error');
      }
    }
  };


  return (
    <div className="min-h-screen text-gray-800 py-10 px-5 bg-gradient-to-br from-white to-purple-50">
      <div className="max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden bg-white border border-gray-200">

        {/* Profile Header Section */}
        <div className="bg-purple-700 text-white p-6 flex flex-col md:flex-row items-center justify-between shadow-md">
          <div className="relative flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={user?.profileUrl || profilePicture}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-orange-400 object-cover shadow-lg"
            />
            <label
              htmlFor="profile-picture-upload"
              className="absolute bottom-0 right-0 md:right-auto md:left-20 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors duration-200 shadow-md"
              title="Change Profile Picture"
            >
              <FaCamera className="text-white text-lg" />
              <input
                type="file"
                id="profile-picture-upload"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
                disabled={isUploadingImage} // Disable input during upload
              />
            </label>
            <div>
              <h2 className="text-4xl font-extrabold mb-1">
                {user?.firstName || 'User'} {user?.lastName || 'Profile'}
              </h2>
              <p className="text-purple-200 text-lg">{user?.email}</p>
              {user?.role && (
                <span className="badge badge-lg bg-purple-200 text-purple-800 font-semibold mt-2">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              )}
            </div>
          </div>
          <button
            className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
            onClick={handleModalToggle}
            disabled={isUpdatingProfile || isUploadingImage} // Disable button if any update is in progress
          >
            <FaEdit className="text-lg" /> Edit Profile
          </button>
        </div>

        {/* Profile Details Sections */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-purple-700 border-b pb-2 border-purple-200">Personal Information</h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-semibold text-purple-600">First Name:</span> {user?.firstName || 'N/A'}
              </p>
              <p>
                <span className="font-semibold text-purple-600">Last Name:</span> {user?.lastName || 'N/A'}
              </p>
              <p>
                <span className="font-semibold text-purple-600">Email:</span> {user?.email || 'N/A'}
              </p>
              <p>
                <span className="font-semibold text-purple-600">Contact No:</span> {user?.contactNo || 'N/A'}
              </p>
              <p>
                <span className="font-semibold text-purple-600">Address:</span> {user?.address || 'N/A'}
              </p>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-purple-700 border-b pb-2 border-purple-200">Security Settings</h3>
            <p className="mb-4 text-gray-700">
              <span className="font-semibold text-purple-600">Password:</span> ********
            </p>
            <button
              className="btn bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              disabled={isUpdatingProfile || isUploadingImage} // Disable button if any update is in progress
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="modal modal-open flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="modal-box bg-white p-8 rounded-lg shadow-xl relative max-w-lg w-full text-gray-800">
            <button
              className="btn btn-sm btn-circle absolute right-4 top-4 bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={handleModalToggle}
              disabled={isUpdatingProfile} // Disable close button while saving
            >
              ✕
            </button>
            <div className="flex justify-center items-center mb-6">
              <h2 className="text-3xl font-bold text-purple-700 ">Edit Your Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="input input-bordered w-full text-gray-800"
                  {...register('firstName', { required: 'First Name is required' })}
                  disabled={isUpdatingProfile} // Disable input fields during submission
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="input input-bordered w-full text-gray-800"
                  {...register('lastName', { required: 'Last Name is required' })}
                  disabled={isUpdatingProfile}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  readOnly
                  className="input input-bordered w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                  {...register('email')}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                <input
                  type="text"
                  id="contactNo"
                  className="input input-bordered w-full text-gray-800"
                  {...register('contactNo')}
                  disabled={isUpdatingProfile}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  id="address"
                  className="textarea textarea-bordered w-full text-gray-800"
                  rows={3}
                  {...register('address')}
                  disabled={isUpdatingProfile}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="btn bg-red-500 hover:bg-red-600 text-white font-bold shadow-md transition-colors duration-200 flex items-center gap-2"
                  disabled={isUpdatingProfile}
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md transition-colors duration-200 flex items-center gap-2"
                  disabled={isUpdatingProfile}
                >
                  <SaveIcon className="w-4 h-4" /> {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;