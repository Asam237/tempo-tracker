import { ReactNode } from "react";
import Header from "../Header";

interface LayoutProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="absolute top-0 left-0 bg-red-500 z-50 w-full">
        <Header />
      </div>
      <div className="h-[90vh]">{children}</div>
    </>
  );
};

export default Layout;
