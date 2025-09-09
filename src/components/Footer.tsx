import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "Exercises", path: "/exercises" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "About", path: "/about" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-background border-t border-border/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Copyright © SpeechSense 2025
            </p>
          </div>

          {/* Social Media */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;