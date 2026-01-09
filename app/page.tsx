import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-white">FORGE</span>
          </div>
          <div className="flex space-x-6">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#docs" className="text-gray-300 hover:text-white transition-colors">Docs</Link>
            <Link href="#github" className="text-gray-300 hover:text-white transition-colors">GitHub</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            Build Solana Programs
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> with AI</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            FORGE is your complete development platform for creating, testing, and deploying Solana programs.
            From smart contracts to dApps, build faster with AI-powered assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              Get Started
            </button>
            <button className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200">
              View Docs
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Contract Factory</h3>
            <p className="text-gray-400">Generate Anchor programs from natural language descriptions using Claude AI.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">CLI Tool</h3>
            <p className="text-gray-400">Command-line interface for project management, testing, and deployment workflows.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Payment Integration</h3>
            <p className="text-gray-400">Built-in x402 payment handling for monetizing your Solana applications.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/10">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 FORGE. Building the future of Solana development.</p>
        </div>
      </footer>
    </div>
  );
}
