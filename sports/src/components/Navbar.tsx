import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-strong fixed top-0 left-0 right-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            Sports Vision Trainer
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-primary-blue transition-colors duration-300">
                  Dashboard
                </Link>
                <Link to="/training" className="text-white hover:text-primary-blue transition-colors duration-300">
                  Training
                </Link>
                <Link to="/analytics" className="text-white hover:text-primary-blue transition-colors duration-300">
                  Analytics
                </Link>
                <Link to="/leaderboard" className="text-white hover:text-primary-blue transition-colors duration-300">
                  Leaderboard
                </Link>
                <Link to="/profile" className="text-white hover:text-primary-blue transition-colors duration-300">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-primary-blue transition-colors duration-300">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg gradient-button text-white font-semibold"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
