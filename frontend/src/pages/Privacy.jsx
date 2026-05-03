import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLayout } from 'react-icons/fi';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="flex items-center justify-between px-8 py-6 max-w-4xl mx-auto border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
          <FiArrowLeft /> Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1 rounded-md">
            <FiLayout className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight">TaskHub</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-8 py-16 prose prose-gray">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when creating an account, such as your name, email address, and role. We also store the tasks, projects, and process notes you create within TaskHub.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services. Your data is used to authenticate your access, display your assigned tasks, and facilitate team collaboration.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the security of your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Email: <a href="mailto:vishusharma9520@gmail.com" className="text-primary hover:underline">vishusharma9520@gmail.com</a></li>
              <li>Phone: +91-6396753751</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
