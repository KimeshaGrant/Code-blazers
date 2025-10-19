import React, { useState } from 'react';
import { Eye, EyeOff, Heart, Lock, User, ArrowRight } from 'lucide-react';

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSuccessMessage('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Login successful! Redirecting...');
        
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setErrors({ general: data.message || 'Invalid username or password' });
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

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm">Sign in to continue your journey</p>
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
                Username
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
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-purple-600 font-medium hover:text-purple-700 hover:underline"
              >
                Sign Up
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

export default LoginPage;

// import React, { useState } from "react";

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loginMethod, setLoginMethod] = useState<string | null>(null);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email && password) {
//     //   alert(Welcome back, ${email}! 💚);
//       setIsLoggedIn(true);
//       setLoginMethod("email");
//     }
//   };

//   const handleGoogleLogin = () => {
//     alert("Google Sign-In clicked (connect backend here).");
//     setIsLoggedIn(true);
//     setLoginMethod("google");
//   };

//   const handleSignOut = () => {
//     alert("You’ve signed out successfully. 🌿");
//     setIsLoggedIn(false);
//     setEmail("");
//     setPassword("");
//     setLoginMethod(null);
//   };

//   return (
//     <div style={styles.body}>
//       <div style={styles.container}>
//         <h1 style={styles.title}>MindfulSpace 🌿</h1>
//         <p style={styles.tagline}>
//           “Take a deep breath. Your mental health matters.”
//         </p>

//         {!isLoggedIn ? (
//           <>
//             <form onSubmit={handleLogin} style={styles.form}>
//               <div style={styles.inputGroup}>
//                 <label htmlFor="email" style={styles.label}>
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   required
//                   style={styles.input}
//                 />
//               </div>

//               <div style={styles.inputGroup}>
//                 <label htmlFor="password" style={styles.label}>
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter password"
//                   required
//                   style={styles.input}
//                 />
//               </div>

//               <button type="submit" style={styles.loginBtn}>
//                 Login
//               </button>
//             </form>

//             <div style={styles.dividerContainer}>
//               <div style={styles.dividerLine}></div>
//               <span style={styles.dividerText}>or</span>
//               <div style={styles.dividerLine}></div>
//             </div>

//             <button onClick={handleGoogleLogin} style={styles.googleBtn}>
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_%22G%22_Logo.svg"
//                 alt="Google logo"
//                 style={{ width: 20, height: 20 }}
//               />
//               Sign in with Google
//             </button>
//           </>
//         ) : (
//           <div>
//             <h3 style={{ marginTop: "1rem", color: "#388e3c" }}>
//               You’re logged in with{" "}
//               <strong>{loginMethod === "google" ? "Google" : "Email"}</strong>
//             </h3>
//             <button onClick={handleSignOut} style={styles.signoutBtn}>
//               Sign Out
//             </button>
//           </div>
//         )}

//         <footer style={styles.footer}>
//           💚 Together, let’s break the stigma around mental health.
//         </footer>
//       </div>
//     </div>
//   );
// };

// // 🌿 Inline CSS Styles
// const styles: { [key: string]: React.CSSProperties } = {
//   body: {
//     background: "linear-gradient(135deg, #a8edea, #fed6e3)",
//     height: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   container: {
//     background: "#fff",
//     width: "400px",
//     padding: "2.5rem",
//     borderRadius: "20px",
//     boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
//     textAlign: "center",
//   },
//   title: {
//     color: "#2e7d32",
//     fontSize: "1.8rem",
//     marginBottom: "0.5rem",
//   },
//   tagline: {
//     color: "#555",
//     fontSize: "0.95rem",
//     marginBottom: "1.5rem",
//   },
//   form: {
//     textAlign: "left",
//   },
//   inputGroup: {
//     marginBottom: "1rem",
//   },
//   label: {
//     display: "block",
//     fontWeight: 500,
//     color: "#333",
//     marginBottom: "0.4rem",
//   },
//   input: {
//     width: "100%",
//     padding: "0.75rem",
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     outline: "none",
//     fontSize: "0.95rem",
//   },
//   loginBtn: {
//     width: "100%",
//     padding: "0.9rem",
//     border: "none",
//     borderRadius: "10px",
//     background: "#66bb6a",
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: "1rem",
//     cursor: "pointer",
//     transition: "background 0.3s",
//     marginTop: "0.5rem",
//   },
//   googleBtn: {
//     width: "100%",
//     padding: "0.9rem",
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     background: "#fff",
//     color: "#444",
//     fontWeight: "bold",
//     fontSize: "1rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "10px",
//     marginTop: "1rem",
//   },
//   dividerContainer: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     margin: "1rem 0",
//     color: "#777",
//   },
//   dividerLine: {
//     flex: 1,
//     height: "1px",
//     background: "#ccc",
//   },
//   dividerText: {
//     margin: "0 10px",
//     fontSize: "0.9rem",
//   },
//   signoutBtn: {
//     width: "100%",
//     padding: "0.9rem",
//     border: "none",
//     borderRadius: "10px",
//     background: "#ef5350",
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: "1rem",
//     cursor: "pointer",
//     marginTop: "1.5rem",
//   },
//   footer: {
//     marginTop: "1.5rem",
//     fontSize: "0.85rem",
//     color: "#666",
//   },
// };

// export default LoginPage;