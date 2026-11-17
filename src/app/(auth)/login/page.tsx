import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - VetApp Marketplace',
  description: 'Login to your VetApp account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">VetApp</h1>
        <p className="text-gray-600">Connecting veterinarians and pet owners</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}
