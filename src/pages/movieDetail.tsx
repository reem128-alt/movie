import React from "react";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import { moviesApi } from "../services/api";
import { useNavigate, useParams } from "react-router";
import { Clock, Star, Edit, Trash2, ArrowLeft, Eye } from "lucide-react";
import { motion } from "framer-motion";
import type { Movie2 } from "../types/movie";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { toast } from "react-toastify";
import Loading from "../components/loading";

export default function MovieDetail() {
  const queryClient = new QueryClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = React.useState<Movie2 | undefined>(undefined);

  const deleteMutation = useMutation({
    mutationFn: () => moviesApi.deleteMovie(Number(id)),
    onSuccess() {
      toast.success("movie deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError(error) {
      toast.error("failind delete movie");
      console.log(error);
    },
  });

  const {
    data: movies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: moviesApi.getAllMovies,
  });

  React.useEffect(() => {
    if (movies && id) {
      const foundMovie = movies.find((m: { id: any }) => String(m.id) === id);
      setMovie(foundMovie);
    }
  }, [movies, id]);

  if (isLoading) {
    
      return <Loading size="lg"  fullScreen />;
    
  }

  if (error) {
    return <div>Error loading movie</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }
  console.log(movie);

  const handleDelete = (id:any) => {
    deleteMutation.mutate(id);
    console.log("Deleting movie:", movie);
    navigate("/movies");
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="ghost"
          className="mb-6 text-purple-300 hover:text-purple-200"
          onClick={() => navigate("/movies")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movies
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-[3fr,3fr] gap-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="aspect-[3/4] relative rounded-lg overflow-hidden border-2 border-purple-800"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img
              src={movie.poster || "/placeholder.svg"}
              alt={movie.title}
              className="object-cover w-full h-full"
            />
          </motion.div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              className="w-full mr-2 border-purple-700 text-purple-100 hover:bg-purple-900/50"
              onClick={() => navigate(`/EditMovie/${movie.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Movie
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-900 hover:bg-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-purple-950 border-purple-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-purple-100">
                    Delete Movie
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-purple-200">
                    Are you sure you want to delete "{movie.title}"? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-purple-800 text-purple-100">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={ handleDelete}
                    className="bg-red-900 hover:bg-red-800"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-purple-100 mb-2">
              {movie.title}
            </h1>

            <div className="flex items-center gap-6 text-purple-200">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.1 }}
              >
                <Star className="mr-1 h-5 w-5 text-purple-500" />
                <span className="font-semibold">{movie.rating}</span>
              </motion.div>
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.1 }}
              >
                <Clock className="mr-1 h-5 w-5" />
                {movie.duration}
              </motion.div>
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.1 }}
              >
                <Eye className="mr-1 h-5 w-5" />
                {(movie?.views / 1000000).toFixed(1)}M views
              </motion.div>
              <Badge
                variant="outline"
                className="border-purple-700 text-purple-200"
              >
                {movie.ageRating}
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-purple-950/50 p-4 rounded-lg border border-purple-800"
          >
            <h2 className="text-xl font-semibold text-purple-100 mb-2">
              Story
            </h2>
            <p className="text-purple-200 leading-relaxed">{movie.story}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-purple-100 mb-3">Cast</h2>
            <div className="grid gap-4">
              {movie.actors.map((actor, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <Avatar className="h-12 w-12 border-2 border-purple-900">
                    <AvatarImage src={actor.image} alt={actor.name} />
                    <AvatarFallback className="bg-purple-950 text-purple-200">
                      {actor.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-purple-100">{actor.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-semibold text-purple-100 mb-2">
              Details
            </h2>
            <dl className="grid gap-2 text-purple-200">
              <motion.div
                className="grid grid-cols-[120px,1fr]"
                whileHover={{ x: 10 }}
              >
                <dt className="font-medium">Producer:</dt>
                <dd>{movie.producer}</dd>
              </motion.div>
              <motion.div
                className="grid grid-cols-[120px,1fr]"
                whileHover={{ x: 10 }}
              >
                <dt className="font-medium">Release Year:</dt>
                <dd>{movie.releaseYear}</dd>
              </motion.div>
            </dl>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* <div className="flex flex-wrap gap-2 mb-4">
{movie.genre.map((g, index) => (
  <motion.div
    key={g}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5 + index * 0.1 }}
  >
    <Badge variant="secondary" className="bg-purple-950/80 hover:bg-purple-900 text-purple-100">
      {g}
    </Badge>
  </motion.div>
))}
</div> */
