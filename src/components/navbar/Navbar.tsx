"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Map, MessageSquare, User } from "lucide-react";
import Button from "../common/buttons/button/Button";
import SignOutButton from "../common/buttons/button/SignOutButton";
import { useUser } from "@/hooks/useUser";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/map", label: "Map", icon: Map },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/account", label: "Account", icon: User },
  ];

  const { user } = useUser();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full
                  ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
          {user ? (
            <>
              <SignOutButton />
            </>
          ) : (
            <>
              <Button onClick={() => router.push("/auth/register")}>
                Register
              </Button>
              <Button onClick={() => router.push("/auth/signin")}>
                Sign in
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
