import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
// import { useAuth } from "@/context/useAuth";
// import { authService } from "@/services/auth/AuthService";
import { Search } from "lucide-react";
import {
  //useEffect,
   useState } from "react";
export function SearchForm({ ...props }) {
  const [search, setSearch] = useState("");
  // const { setUsers, setLoader } = useAuth();

  // useEffect(() => {
  //   if (!search.trim()) {
  //     setUsers([]);
  //     setLoader(false);
  //     return;
  //   }
  //   setLoader(true);

  //   const timeout = setTimeout(async () => {
  //     try {
  //       const response = await authService.search(search);
  //       if (response?.data?.success) {
  //         setUsers(response?.data?.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoader(false);
  //     }
  //   }, 500);

  //   return () => clearTimeout(timeout);
  // }, [search]);

  // const handleSearch = async (e) => {
  //   try {
  //     e.preventDefault();
  //     const data = e.target.value;
  //     setSearch(data);
  //     const response = await authService.search(data);
  //     if (response?.data?.success) {
  //       setUsers(response?.data?.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoader(false);
  //   }
  // };
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search the docs..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
