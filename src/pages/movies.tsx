import * as React from "react";
import { Star, Clock, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { moviesApi } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { setQuery } from "../store/searchReducer";
import Loading from "../components/loading";
import { Movie } from "../types/movie";

function MovieList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = useAppSelector((state) => state.search.query);
  const [localSearch, setLocalSearch] = React.useState(query || "");

  const {
    data: movies = [],
    isLoading,
    error,
    
  } = useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: moviesApi.getAllMovies,
    staleTime: 10000,
    refetchInterval: 30000,
  });

  // Update local search when query from Redux changes
  React.useEffect(() => {
    if (query) {
      setLocalSearch(query);
    }
  }, [query]);

  const filteredMovies = React.useMemo(() => {
    const searchTerm = localSearch.toLowerCase();
    return movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.producer.toLowerCase().includes(searchTerm) ||
        movie.actors.some((actor) =>
          actor.name.toLowerCase().includes(searchTerm)
        )
    );
  }, [localSearch, movies]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    dispatch(setQuery(value));
  };

  if (isLoading) {
    return <Loading size="lg" text="Loading movies..." fullScreen />;
  }

  if (error) {
    return <div className="text-red-500">Error loading movies</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-purple-100">Movies</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-400" />
          <Input
            type="search"
            placeholder="Search by title, producer, or actor..."
            className="pl-8 bg-purple-950/30 border-purple-900 text-purple-100 placeholder:text-purple-400"
            value={localSearch}
            onChange={handleSearch}
          />
        </div>
        <div className="text-sm text-purple-300">
          {filteredMovies.length} movies found
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMovies.map((movie) => (
          <Card
            key={movie.id}
            className="overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-900/20 border-purple-900 bg-gradient-to-br from-purple-950/50 to-black"
            onClick={() => navigate(`/moviesDetail/${movie.id}`)}
          >
            <CardHeader className="p-0">
              <div className="aspect-[3/4] h-[500px] relative">
                <img
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-purple-950/50 to-transparent" />
                {/* <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                  {movie?.genre?.map((g) => (
                    <Badge key={g} variant="secondary" className="bg-purple-950/80 hover:bg-purple-900 text-purple-100">
                      {g}
                    </Badge>
                  ))}
                </div>  */}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold truncate text-purple-100">
                  {movie.title}
                </h3>
                <Badge
                  variant="outline"
                  className="border-purple-700 text-purple-200"
                >
                  {movie.ageRating}
                </Badge>
              </div>
              <div className="flex -space-x-2 mb-2">
                {movie.actors.slice(0, 3).map((actor,index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="border-2 border-purple-900 ring-2 ring-black">
                          <AvatarImage src={actor.image} alt={actor.name} />
                          <AvatarFallback className="bg-purple-950 text-purple-200">
                            {actor.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent className="bg-purple-950 border-purple-700">
                        <p>{actor.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <p className="text-sm text-purple-300">
                Producer: {movie.producer}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between text-sm text-purple-400">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-purple-500" />
                {movie.rating}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {movie.duration}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {localSearch && filteredMovies.length === 0 && (
        <div className="text-purple-100 text-center py-8">
          No movies found matching "{localSearch}"
        </div>
      )}
    </div>
  );
}

export default MovieList;
