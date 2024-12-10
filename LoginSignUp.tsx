import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';

const auth = getAuth(app);

const LoginSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Handle successful login or signup (e.g., redirect or show a success message)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-white mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
          />
        </div>
        <button type="submit" className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 w-full text-blue-500 hover:underline"
        >
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default LoginSignUp;
