import * as React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Film, Settings, Bell, Search, Menu } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { logoutUser } from "../store/userReducer";
import { setQuery } from "../store/searchReducer";

export default function Header() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const HandleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(setQuery(searchQuery.trim()));
      navigate("/movies");
      // setSearchQuery(''); // Clear local search input
      // dispatch(clearQuery());
    }
  };

  const navItems = [
    { to: "/movies", label: "Movies" },
    { to: "/add-movie", label: "Add Movie" },
    { to: "/movieTable", label: "Movie Table" },
  ];

  return (
    <header className="pl-5 pr-5 sticky top-0 z-50 w-full border-b border-purple-900 bg-[#0a0a0c] backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0c]">
      <div className="container flex h-16 items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-purple-100 hover:bg-purple-950/50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 bg-purple-950/95 border-purple-800 backdrop-blur-xl"
          >
            <SheetHeader>
              <SheetTitle className="text-purple-100">
                Dashboard Content
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-4 py-2 text-lg font-medium text-purple-100 rounded-md transition-colors",
                    pathname.pathname === item.to
                      ? "bg-purple-900/50"
                      : "hover:bg-purple-900/30"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-purple-100"
        >
          <Film className="h-6 w-6 text-purple-500" />
          <span className="hidden sm:inline-block">MovieDB</span>
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/movies">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-purple-100 hover:bg-purple-950/50",
                    pathname.pathname === "/movies" && "bg-purple-950/70"
                  )}
                >
                  Movies
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/add-movie">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-purple-100 hover:bg-purple-950/50",
                    pathname.pathname === "/add" && "bg-purple-950/70"
                  )}
                >
                  Add Movie
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/movieTable">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-purple-100 hover:bg-purple-950/50",
                    pathname.pathname === "/movieTable" && "bg-purple-950/70"
                  )}
                >
                  Movie Table
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {pathname.pathname === "/" && (
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-400" />
              <form onSubmit={handleSubmit}>
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="pl-8 bg-purple-950/30 border-purple-900 text-purple-100 placeholder:text-purple-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-purple-100 hover:bg-purple-950/50"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 text-[10px] bg-purple-600">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-purple-950 border-purple-800"
            >
              <DropdownMenuLabel className="text-purple-100">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-purple-800" />
              <DropdownMenuItem className="text-purple-200 focus:bg-purple-900 focus:text-purple-100">
                New movie "Inception" has been added
              </DropdownMenuItem>
              <DropdownMenuItem className="text-purple-200 focus:bg-purple-900 focus:text-purple-100">
                "The Dark Knight" has been updated
              </DropdownMenuItem>
              <DropdownMenuItem className="text-purple-200 focus:bg-purple-900 focus:text-purple-100">
                3 movies need review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-purple-100 hover:bg-purple-950/50"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-purple-950 border-purple-800"
            >
              <DropdownMenuLabel className="text-purple-100">
                Settings
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-purple-800" />
              <DropdownMenuItem className="text-purple-200 focus:bg-purple-900 focus:text-purple-100">
                Language: English
              </DropdownMenuItem>
              {/* <DropdownMenuItem className="text-purple-200 focus:bg-purple-900 focus:text-purple-100">
                Theme Settings
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-purple-800">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-purple-950 text-purple-200">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-purple-950 border-purple-800"
            >
              <DropdownMenuLabel className="text-purple-100">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-purple-800" />

              <DropdownMenuItem
                className="text-purple-200 focus:bg-purple-900 focus:text-purple-100"
                onClick={HandleLogout}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
