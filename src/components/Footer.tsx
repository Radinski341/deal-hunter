import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Send, TrendingDown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "You'll now receive the best deals directly in your inbox!",
      });
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingDown className="w-6 h-6 mr-2 text-yellow-400" />
              Deal<span className="text-yellow-400">Hunter</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Your ultimate destination for the best discount deals across all categories. 
              We hunt down the biggest savings so you don't have to!
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400 p-2">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400 p-2">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400 p-2">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-orange-400" />
              Deal Categories
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/?category=electronics" className="hover:text-yellow-400 transition-colors">Electronics & Gadgets</Link></li>
              <li><Link href="/?category=computers" className="hover:text-yellow-400 transition-colors">Computers & Gaming</Link></li>
              <li><Link href="/?category=kitchen" className="hover:text-yellow-400 transition-colors">Kitchen & Home</Link></li>
              <li><Link href="/?category=streaming" className="hover:text-yellow-400 transition-colors">Creator Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Today's Hottest Deals</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Deal Alerts</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Price Drop Notifications</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Coupon Codes</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Never Miss a Deal!</h4>
            <p className="text-gray-300 mb-4">
              Get instant notifications for the best deals and limited-time offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <Input
                type="email"
                placeholder="Your email for deals"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-r-none text-gray-900 border-orange-400"
                required
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-l-none"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-2">
              Join 50,000+ deal hunters getting exclusive offers
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p className="mb-4 text-sm">
            🔥 Deals updated every hour • ⚡ Price drops tracked in real-time • 💰 Maximum savings guaranteed
          </p>
          <p className="text-xs">
            &copy; 2024 DealHunter. All rights reserved. | 
            <a href="#" className="hover:text-yellow-400 ml-1 transition-colors">Privacy Policy</a> | 
            <a href="#" className="hover:text-yellow-400 ml-1 transition-colors">Terms of Service</a> |
            <a href="#" className="hover:text-yellow-400 ml-1 transition-colors">Affiliate Disclosure</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
