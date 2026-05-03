import { Link } from 'react-router-dom';
import { FiCheckCircle, FiLayout, FiUsers, FiCheckSquare, FiLock, FiTrendingUp } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <FiLayout className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskHub</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="text-sm font-semibold bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gray-900">
            Get more done with <span className="text-primary">TaskHub</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
            The modern task management platform that helps teams organize, track, and complete work efficiently.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a href="#features" className="text-base font-semibold bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              See Features
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-gray-400 w-4 h-4" /> No credit card required
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-gray-400 w-4 h-4" /> Free plan available
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-gray-400 w-4 h-4" /> Cancel anytime
            </div>
          </div>
        </div>

        {/* Right Content / Image Mockup */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1569674696698-55826970039a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="TaskHub Dashboard Preview" 
            className="rounded-2xl shadow-2xl border border-gray-100 object-cover w-full h-auto"
          />
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 text-center space-y-6">
          <span className="inline-block py-1.5 px-4 rounded-full bg-gray-200/60 text-gray-700 text-sm font-semibold tracking-wide border border-gray-300/50">
            Our Features
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-16">
            Everything you need to manage tasks effectively
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-6">
                <FiCheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Task Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Create, assign, and track tasks with detailed progress notes. Ensure everyone knows exactly what needs to be done.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <FiUsers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize work into projects and collaborate seamlessly. Share updates in real-time without the friction.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <FiLock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Admin Roles</h3>
              <p className="text-gray-600 leading-relaxed">
                Protect your workspace with strict role-based access control. Only authorized members can update task statuses.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Gain insights into team velocity and project bottlenecks with transparent status reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1 rounded-md">
              <FiLayout className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">TaskHub</span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TaskHub Inc. All rights reserved.
          </div>
          <div className="flex flex-col md:items-end gap-2 text-sm font-medium text-gray-500">
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            </div>
            <div className="text-gray-400 mt-2 md:text-right">
              <p>Contact: <a href="mailto:vishusharma9520@gmail.com" className="hover:text-primary transition-colors">vishusharma9520@gmail.com</a></p>
              <p>Phone: +91-6396753751</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
