import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLayout } from 'react-icons/fi';

const Terms = () => {
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
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using TaskHub, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access the website or use any services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account and password. TaskHub cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Acceptable Use</h2>
            <p>You agree not to use TaskHub for any unlawful purposes or to conduct any unlawful activity, including, but not limited to, fraud, embezzlement, money laundering or identity theft.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Modifications to Service</h2>
            <p>TaskHub reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Information</h2>
            <p>Questions about the Terms of Service should be sent to us at:</p>
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

export default Terms;
