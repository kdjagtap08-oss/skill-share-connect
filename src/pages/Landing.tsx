import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Users, MessageCircle, Search, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Exchange skills, grow together</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn anything.<br />
              <span className="gradient-text">Teach everything.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with people who want to learn what you know, and find teachers for the skills you want to master.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" className="gradient-primary" asChild>
                  <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="gradient-primary" asChild>
                    <Link to="/auth?tab=signup">Get Started Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/auth">Log In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Create Your Profile', desc: 'List skills you know and skills you want to learn' },
              { icon: Search, title: 'Find Matches', desc: 'Search for people who can teach what you want to learn' },
              { icon: MessageCircle, title: 'Start Learning', desc: 'Connect and chat directly on the platform' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-card border shadow-sm">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
