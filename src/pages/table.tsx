import React from "react";
import { useQuery } from "@tanstack/react-query";
import { moviesApi } from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Movie } from "../types/movie";
import Loading from "../components/loading";

type SortConfig = {
  key: keyof Movie;
  direction: "asc" | "desc";
};

export default function MovieTable() {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: "title",
    direction: "asc",
  });

  const { data: movies = [], isLoading } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: moviesApi.getAllMovies,
  });

  const sortedMovies = React.useMemo(() => {
    const sorted = [...movies];
    sorted.sort((a, b) => {
      if (sortConfig.key === "title" || sortConfig.key === "ageRating") {
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (sortConfig.key === "rating" || sortConfig.key === "releaseYear") {
        return sortConfig.direction === "asc"
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      if (sortConfig.key === "duration") {
        // Convert duration (e.g., "2h 30min") to minutes for comparison
        const getDurationInMinutes = (duration: string) => {
          const [hours, minutes] = duration.split(" ");
          const h = parseInt(hours);
          const m = parseInt(minutes);
          return h * 60 + m;
        };
        const aDuration = getDurationInMinutes(a.duration);
        const bDuration = getDurationInMinutes(b.duration);
        return sortConfig.direction === "asc"
          ? aDuration - bDuration
          : bDuration - aDuration;
      }
      return 0;
    });
    return sorted;
  }, [movies, sortConfig]);

  const handleSort = (key: keyof Movie) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Movie }) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="ml-1 h-4 w-4 text-purple-300" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4 text-purple-300" />
      );
    }
    // Show a dimmed double arrow when column is not sorted
    return <ChevronDown className="ml-1 h-4 w-4 text-purple-500/40" />;
  };

  // Show loading indicator while fetching movies
  if (isLoading) {
    return <Loading size="lg" text="Loading movies..." fullScreen />;
  }

  return (
    <div className="p-3">
      <div className="rounded-md border border-purple-800 bg-purple-950/30">
        <div className="max-h-[calc(100vh-8rem)] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-purple-950/80 z-10">
              <TableRow className="hover:bg-purple-900/30 border-purple-800">
                <TableHead
                  className="text-purple-100 cursor-pointer hover:bg-purple-900/20"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Title
                    <SortIcon columnKey="title" />
                  </div>
                </TableHead>
                <TableHead className="text-purple-100">Poster</TableHead>
                <TableHead
                  className="text-purple-100 cursor-pointer hover:bg-purple-900/20"
                  onClick={() => handleSort("ageRating")}
                >
                  <div className="flex items-center">
                    Age Rating
                    <SortIcon columnKey="ageRating" />
                  </div>
                </TableHead>
                <TableHead className="text-purple-100">Actors</TableHead>
                <TableHead
                  className="text-purple-100 cursor-pointer hover:bg-purple-900/20"
                  onClick={() => handleSort("rating")}
                >
                  <div className="flex items-center">
                    Rating
                    <SortIcon columnKey="rating" />
                  </div>
                </TableHead>
                <TableHead
                  className="text-purple-100 cursor-pointer hover:bg-purple-900/20"
                  onClick={() => handleSort("duration")}
                >
                  <div className="flex items-center">
                    Duration
                    <SortIcon columnKey="duration" />
                  </div>
                </TableHead>
                <TableHead
                  className="text-purple-100 cursor-pointer hover:bg-purple-900/20"
                  onClick={() => handleSort("releaseYear")}
                >
                  <div className="flex items-center">
                    Release Year
                    <SortIcon columnKey="releaseYear" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMovies.map((movie) => (
                <TableRow
                  key={movie.id}
                  className="hover:bg-purple-900/30 border-purple-800"
                >
                  <TableCell className="font-medium text-purple-100">
                    {movie.title}
                  </TableCell>
                  <TableCell>
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-purple-800/50 text-purple-100">
                      {movie.ageRating}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {movie.actors.map((actor, index) => (
                        <span key={index} className="text-purple-100">
                          {actor.name}
                          {index < movie.actors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-purple-100">
                    {movie.rating}/10
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-purple-900/30 text-white"
                    >
                      {movie.duration}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-purple-100">
                    {movie.releaseYear}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
