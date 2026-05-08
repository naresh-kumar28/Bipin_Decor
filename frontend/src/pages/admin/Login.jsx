import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative justify-center items-center transition-colors duration-300">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://uxmagic.blob.core.windows.net/public/agent-images/login-bg-1777707050765-01ng1419joyh.png" 
          alt="Interior Background" 
          className="w-full h-full object-cover opacity-30 dark:opacity-10"
        />
      </div>
      
      <div className="z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-4 overflow-hidden p-2">
            {settings?.logo ? (
              <img src={settings.logo} alt={settings.website_name} className="w-full h-full object-contain" />
            ) : (
              <iconify-icon icon="lucide:sofa" class="text-3xl text-primary-foreground"></iconify-icon>
            )}
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground text-center">
            {settings?.website_name || 'Bipin Decor'}
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide uppercase mt-1">Admin Portal</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-6 text-center">Sign in to your account</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-2">
              <iconify-icon icon="lucide:alert-circle"></iconify-icon>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <iconify-icon icon="lucide:user" class="text-muted-foreground"></iconify-icon>
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  placeholder="admin"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-foreground">Password</label>
                <a href="#" className="text-xs text-primary hover:text-secondary transition-colors font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <iconify-icon icon="lucide:lock" class="text-muted-foreground"></iconify-icon>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-offset-background"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">Remember me for 30 days</label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-primary hover:bg-secondary text-primary-foreground font-medium rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <iconify-icon icon="lucide:loader-2" class="animate-spin"></iconify-icon>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <iconify-icon icon="lucide:arrow-right" class="text-sm"></iconify-icon>
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} {settings?.website_name || 'Bipin Decor'} Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
