import { Brain, Github, Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  Platform: ["About", "Courses", "Pricing", "Dashboard"],
  Support: ["Help Center", "Contact", "FAQ", "Community"],
  Legal: ["Privacy Policy", "Terms of Service", "Refund Policy"],
};

const Footer = () => (
  <footer className="bg-foreground text-background/80 py-16">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4">
          <a href="#" className="flex items-center gap-2 text-xl font-bold text-background">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            LearnBoard
          </a>
          <p className="text-sm text-background/60">AI-powered learning platform designed for the next generation of developers.</p>
          <div className="flex gap-3">
            {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-semibold text-background mb-4">{title}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-background transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-background/10 pt-8 text-center text-sm text-background/50">
        © 2026 LearnBoard. All rights reserved. Built with ❤️ for students.
      </div>
    </div>
  </footer>
);

export default Footer;
