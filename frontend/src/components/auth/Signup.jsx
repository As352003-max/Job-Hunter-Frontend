import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
        file: null // Initialize file as null
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handler for text and radio input changes
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // Handler for file input changes
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    // Handler for form submission
    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Create FormData object to handle file upload
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('password', input.password);
        formData.append('role', input.role);
        if (input.file) { // Only append file if it exists
            formData.append('file', input.file);
        }

        try {
            dispatch(setLoading(true)); // Set loading state to true
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, // Important for file uploads
                withCredentials: true,
            });

            if (res.data.success) {
                navigate('/login'); // Redirect to login on successful signup
                toast.success(res.data.message); // Show success toast
            }
        } catch (error) {
            console.error("Signup error:", error); // Log the full error for debugging
            // Display error message from API response, or a generic one
            toast.error(error.response?.data?.message || 'An error occurred during signup.');
        } finally {
            dispatch(setLoading(false)); // Always set loading state to false
        }
    };

    // Effect to redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]); // Add user and navigate to dependency array

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center min-h-[calc(100vh-64px)]'> {/* Adjusted for better vertical centering */}
                <form onSubmit={submitHandler} className='w-full max-w-md border border-gray-200 rounded-lg p-6 shadow-lg bg-white'> {/* Increased padding, added shadow, background */}
                    <h1 className='text-3xl font-extrabold text-center mb-6 text-gray-800'>Create Your Account</h1> {/* Larger, bolder, centered title */}
                    
                    <div className='mb-4'>
                        <Label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</Label>
                        <Input
                            id="fullname"
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Amitanshu Kumar" // Updated placeholder
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='mb-4'>
                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="amitanshu@example.com" // Updated placeholder
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='mb-4'>
                        <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="e.g., 9876543210"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='mb-6'>
                        <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Choose a strong password" // More generic placeholder
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className='flex flex-col sm:flex-row items-center justify-between mb-6 gap-4'> {/* Flex-col for small screens, gap */}
                        <RadioGroup className="flex items-center gap-6"> {/* Increased gap */}
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <Label htmlFor="r1" className="text-gray-700">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <Label htmlFor="r2" className="text-gray-700">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2 mt-4 sm:mt-0'> {/* Margin-top for small screens */}
                            <Label htmlFor="profile-file" className="text-sm font-medium text-gray-700">Profile Picture</Label>
                            <Input
                                id="profile-file"
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer text-gray-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" // Styled file input
                            />
                        </div>
                    </div>
                    
                    {
                        loading ? (
                            <Button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center opacity-90 cursor-not-allowed" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out">
                                Sign Up
                            </Button>
                        )
                    }
                    <p className='text-sm text-center mt-4 text-gray-600'>
                        Already have an account? <Link to="/login" className='text-blue-600 hover:underline font-medium'>Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;