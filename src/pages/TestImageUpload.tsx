// pages/TestImageUpload.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageUploadPage from './ImageUploadPage';

const TestImageUpload: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/admindashboard/allvehicles"
                                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Back to Vehicles
                            </Link>
                            <div className="h-6 w-px bg-gray-300" />
                            <h1 className="text-2xl font-bold text-gray-900">Test Vehicle Image Upload</h1>
                        </div>
                        <div className="text-sm text-gray-600">
                            Demo Vehicle ID: test-vehicle-123
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="py-8">
                <ImageUploadPage />
            </div>
        </div>
    );
};

export default TestImageUpload;
