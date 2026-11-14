import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🐾</div>
          <h1 className="text-3xl font-bold">VetApp</h1>
          <p className="text-gray-600 mt-2">Citas veterinarias, simplificadas</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
