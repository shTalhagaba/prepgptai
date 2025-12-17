import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="PrepGPT Logo" width={58} height={48} />
          <h2 className="text-gradient-red font-black text-2xl">PrepGPT</h2>
        </Link>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
