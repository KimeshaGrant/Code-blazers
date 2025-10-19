import React, { useState } from 'react';
import { Eye, EyeOff, Heart, Lock, Mail, User, UserPlus, Shield } from 'lucide-react';

interface SignupFormData {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSuccessMessage('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully! Redirecting...');
        
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        setFormData({ username: '', name: '', email: '', password: '', confirmPassword: '' });
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        setErrors({ general: data.message || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Circle</h1>
          <p className="text-gray-600">A safe space for mental wellness</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Our Community</h2>
            <p className="text-gray-600 text-sm">Create your anonymous account</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-gray-500">(for login only)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-gray-500">(optional - kept private)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your name (private)"
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Strength: <span className="font-medium">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Privacy Protected:</span> Your identity remains anonymous. 
                You'll be assigned a unique display name that protects your privacy in all group interactions.
              </p>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-purple-600 font-medium hover:text-purple-700 hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Need help? Contact support@supportcircle.com</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

// import React, { useState } from 'react';
// import { Eye, EyeOff, Heart, Lock, Mail, User, UserPlus, Shield } from 'lucide-react';

// interface SignupFormData {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// interface FormErrors {
//   username?: string;
//   email?: string;
//   password?: string;
//   confirmPassword?: string;
//   general?: string;
// }

// const SignupPage: React.FC = () => {
//   const [formData, setFormData] = useState<SignupFormData>({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     // Username validation
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
//       newErrors.username = 'Username can only contain letters, numbers, and underscores';
//     }

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must contain uppercase, lowercase, and number';
//     }

//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     setSuccessMessage('');
    
//     if (!validateForm()) return;

//     setIsLoading(true);
    
//     try {
//       const response = await fetch('http://127.0.0.1:8080/api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           email: formData.email,
//           password: formData.password
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage('Account created successfully! Redirecting...');
        
//         if (data.token) {
//           localStorage.setItem('authToken', data.token);
//         }
        
//         setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        
//         setTimeout(() => {
//           window.location.href = '/';
//         }, 1500);
//       } else {
//         setErrors({ general: data.message || 'An error occurred. Please try again.' });
//       }
//     } catch (error) {
//       setErrors({ general: 'Network error. Please check your connection and try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name as keyof FormErrors]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSubmit();
//     }
//   };

//   const getPasswordStrength = () => {
//     const password = formData.password;
//     if (!password) return { strength: 0, label: '', color: '' };
    
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (password.length >= 12) strength++;
//     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
//     if (/\d/.test(password)) strength++;
//     if (/[^a-zA-Z\d]/.test(password)) strength++;

//     const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
//     const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    
//     return { strength, label: labels[strength], color: colors[strength] };
//   };

//   const passwordStrength = getPasswordStrength();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
//             <Heart className="w-8 h-8 text-white" fill="white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Circle</h1>
//           <p className="text-gray-600">A safe space for mental wellness</p>
//         </div>

//         {/* Signup Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Our Community</h2>
//             <p className="text-gray-600 text-sm">Create your anonymous account</p>
//           </div>

//           {/* Success Message */}
//           {successMessage && (
//             <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
//               {successMessage}
//             </div>
//           )}

//           {/* General Error */}
//           {errors.general && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//               {errors.general}
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Username Field */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                 Username <span className="text-gray-500">(for login only)</span>
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   onKeyPress={handleKeyPress}
//                   className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
//                     errors.username ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Choose a username"
//                   autoComplete="username"
//                 />
//               </div>
//               {errors.username && (
//                 <p className="mt-1 text-sm text-red-600">{errors.username}</p>
//               )}
//             </div>

//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   onKeyPress={handleKeyPress}
//                   className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="your.email@example.com"
//                   autoComplete="email"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   onKeyPress={handleKeyPress}
//                   className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
//                     errors.password ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Create a strong password"
//                   autoComplete="new-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
              
//               {/* Password Strength Indicator */}
//               {formData.password && (
//                 <div className="mt-2">
//                   <div className="flex gap-1 mb-1">
//                     {[1, 2, 3, 4, 5].map((level) => (
//                       <div
//                         key={level}
//                         className={`h-1 flex-1 rounded-full transition-colors ${
//                           level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className="text-xs text-gray-600">
//                     Strength: <span className="font-medium">{passwordStrength.label}</span>
//                   </p>
//                 </div>
//               )}
              
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//             {/* Confirm Password Field */}
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   onKeyPress={handleKeyPress}
//                   className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
//                     errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Re-enter your password"
//                   autoComplete="new-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                 >
//                   {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Creating Account...</span>
//                 </>
//               ) : (
//                 <>
//                   <UserPlus className="w-5 h-5" />
//                   <span>Create Account</span>
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Privacy Notice */}
//           <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <div className="flex items-start gap-2">
//               <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//               <p className="text-xs text-gray-700">
//                 <span className="font-semibold">Privacy Protected:</span> Your identity remains anonymous. 
//                 You'll be assigned a unique display name that protects your privacy in all group interactions.
//               </p>
//             </div>
//           </div>

//           {/* Sign In Link */}
//           <div className="mt-6 text-center">
//             <p className="text-gray-600 text-sm">
//               Already have an account?{' '}
//               <a
//                 href="/login"
//                 className="text-purple-600 font-medium hover:text-purple-700 hover:underline"
//               >
//                 Sign In
//               </a>
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-6 text-sm text-gray-600">
//           <p>Need help? Contact support@supportcircle.com</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

// import React, { useEffect, useState } from "react";

// type FormState = {
//   username: string;
//   password: string;
//   name: string;
//   email: string;
// };

// export default function Signup() {
//   const [form, setForm] = useState<FormState>({
//     username: "",
//     password: "",
//     name: "",
//     email: "",
//   });
//   const [csrfToken, setCsrfToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     // Get CSRF token from backend
//     // The backend should return JSON { csrfToken: "..." } and set a cookie if necessary.
//     fetch("/api/csrf-token", {
//       method: "GET",
//       credentials: "include", // important to include cookies
//     })
//       .then(async (res) => {
//         if (!res.ok) throw new Error("Failed to get CSRF token (${res.status})");
//         const data = await res.json();
//         setCsrfToken(data.csrfToken);
//       })
//       .catch((err) => {
//         console.error("csrf token fetch error", err);
//         setError("Unable to get CSRF token. Try reloading the page.");
//       });
//   }, []);

//   function onChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { name, value } = e.target;
//     setForm((s) => ({ ...s, [name]: value }));
//   }

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     // basic client-side validation (expand as needed)
//     if (!form.username || !form.password || !form.email) {
//       setError("Username, password and email are required.");
//       return;
//     }
//     if (!csrfToken) {
//       setError("Missing CSRF token.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         credentials: "include", // ensures cookies are sent/received (JWT cookie will be set by server)
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRF-Token": csrfToken,
//         },
//         body: JSON.stringify(form),
//       });

//       const body = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         // try to read error message from server JSON
//         const serverMsg = body?.message || body?.error || res.statusText;
//         throw new Error(serverMsg || "Registration failed");
//       }

//       // If server sets JWT as httpOnly cookie, there's nothing else to store client-side
//       // If the server returns a token in the response body (not recommended), you can store it in memory.
//       setSuccess(body?.message || "User registered successfully");
//       setForm({ username: "", password: "", name: "", email: "" });
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
//       <h2>Sign up</h2>
//       {error && <div style={{ color: "var(--danger, #a00)", marginBottom: 8 }}>{error}</div>}
//       {success && <div style={{ color: "var(--success, #080)", marginBottom: 8 }}>{success}</div>}
//       <form onSubmit={onSubmit}>
//         <label>
//           Username
//           <input name="username" value={form.username} onChange={onChange} />
//         </label>
//         <br />
//         <label>
//           Full name
//           <input name="name" value={form.name} onChange={onChange} />
//         </label>
//         <br />
//         <label>
//           Email
//           <input name="email" value={form.email} onChange={onChange} type="email" />
//         </label>
//         <br />
//         <label>
//           Password
//           <input name="password" value={form.password} onChange={onChange} type="password" />
//         </label>
//         <br />
//         <button type="submit" disabled={loading}>
//           {loading ? "Signing up..." : "Sign up"}
//         </button>
//       </form>
//     </div>
//   );
// }

// // import React, { useState } from "react";

// // const ProgramSignupPage = () => {
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [dateJoined, setDateJoined] = useState<string>(
// //     new Date().toISOString().split("T")[0]
// //   );

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!name || !email || !password) {
// //       alert("Please fill in all required fields.");
// //       return;
// //     }

// //     // alert(
// //     //   🎉 Welcome to MindfulSpace, ${name}!\nEmail: ${email}\nDate Joined: ${dateJoined}
// //     // );

// //     // You can connect this to your backend or Firebase
// //     setName("");
// //     setEmail("");
// //     setPassword("");
// //     setDateJoined(new Date().toISOString().split("T")[0]);
// //   };

// //   return (
// //     <div style={styles.body}>
// //       <div style={styles.container}>
// //         <h1 style={styles.title}>Join MindfulSpace 🌿</h1>
// //         <p style={styles.tagline}>
// //           “Start your journey toward balance and self-care today.”
// //         </p>

// //         <form onSubmit={handleSubmit} style={styles.form}>
// //           <div style={styles.inputGroup}>
// //             <label htmlFor="name" style={styles.label}>
// //               Full Name
// //             </label>
// //             <input
// //               type="text"
// //               id="name"
// //               value={name}
// //               onChange={(e) => setName(e.target.value)}
// //               placeholder="Enter your full name"
// //               required
// //               style={styles.input}
// //             />
// //           </div>

// //           <div style={styles.inputGroup}>
// //             <label htmlFor="email" style={styles.label}>
// //               Email Address
// //             </label>
// //             <input
// //               type="email"
// //               id="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               placeholder="Enter your email"
// //               required
// //               style={styles.input}
// //             />
// //           </div>

// //           <div style={styles.inputGroup}>
// //             <label htmlFor="password" style={styles.label}>
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               id="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               placeholder="Create a password"
// //               required
// //               style={styles.input}
// //             />
// //           </div>

// //           <div style={styles.inputGroup}>
// //             <label htmlFor="dateJoined" style={styles.label}>
// //               Date Joined
// //             </label>
// //             <input
// //               type="date"
// //               id="dateJoined"
// //               value={dateJoined}
// //               onChange={(e) => setDateJoined(e.target.value)}
// //               style={styles.input}
// //             />
// //           </div>

// //           <button type="submit" style={styles.signupBtn}>
// //             Sign Up
// //           </button>
// //         </form>

// //         <p style={styles.footer}>
// //           💚 Already have an account? <a href="/login">Login here</a>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // // 🌿 Inline CSS styles
// // const styles: { [key: string]: React.CSSProperties } = {
// //   body: {
// //     background: "linear-gradient(135deg, #a8edea, #fed6e3)",
// //     height: "100vh",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   container: {
// //     background: "#fff",
// //     width: "400px",
// //     padding: "2.5rem",
// //     borderRadius: "20px",
// //     boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
// //     textAlign: "center",
// //   },
// //   title: {
// //     color: "#2e7d32",
// //     fontSize: "1.8rem",
// //     marginBottom: "0.5rem",
// //   },
// //   tagline: {
// //     color: "#555",
// //     fontSize: "0.95rem",
// //     marginBottom: "1.5rem",
// //   },
// //   form: {
// //     textAlign: "left",
// //   },
// //   inputGroup: {
// //     marginBottom: "1rem",
// //   },
// //   label: {
// //     display: "block",
// //     fontWeight: 500,
// //     color: "#333",
// //     marginBottom: "0.4rem",
// //   },
// //   input: {
// //     width: "100%",
// //     padding: "0.75rem",
// //     border: "1px solid #ccc",
// //     borderRadius: "10px",
// //     outline: "none",
// //     fontSize: "0.95rem",
// //   },
// //   signupBtn: {
// //     width: "100%",
// //     padding: "0.9rem",
// //     border: "none",
// //     borderRadius: "10px",
// //     background: "#66bb6a",
// //     color: "#fff",
// //     fontWeight: "bold",
// //     fontSize: "1rem",
// //     cursor: "pointer",
// //     transition: "background 0.3s",
// //     marginTop: "0.5rem",
// //   },
// //   footer: {
// //     marginTop: "1.5rem",
// //     fontSize: "0.85rem",
// //     color: "#666",
// //   },
// // };

// // export default ProgramSignupPage;


