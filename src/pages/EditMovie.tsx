import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";
import * as z from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "react-toastify";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { moviesApi } from "../services/api";
import React from "react";
import { Movie } from "../types/movie";

const ageRatings = ["G", "PG", "PG-13", "R", "NC-17"] as const;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  ageRating: z.enum(ageRatings, {
    required_error: "Please select an age rating",
  }),
  poster: z.string().url("Please enter a valid URL"),
  producer: z.string().min(1, "Producer is required"),
  story: z
    .string()
    .min(50, "Story must be at least 50 characters")
    .max(500, "Story must not exceed 500 characters"),
  actors: z
    .array(
      z.object({
        name: z.string().min(1, "Actor name is required"),
        image: z.string().url("Please enter a valid URL"),
      })
    )
    .min(1, "At least one actor is required"),
  duration: z
    .string()
    .regex(/^\d+h\s\d+min$/, "Duration must be in format: 2h 30min"),
  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must not exceed 10")
    .step(0.1, "Rating must have at most 1 decimal place"),
  releaseYear: z
    .number()
    .min(1888, "Release year must be after 1888 (first movie ever made)")
    .max(
      new Date().getFullYear() + 5,
      "Release year cannot be too far in the future"
    )
    .int("Release year must be a whole number"),
});

type FormValues = z.infer<typeof formSchema>;

export function EditMovie() {
  const queryClient = new QueryClient();
  const [editMovie, setEditMovie] = React.useState<Movie>();
  const { id } = useParams();
  const navigate = useNavigate();

  console.log(editMovie);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const { data: movies = [] } = useQuery({
    queryKey: ["movies"],
    queryFn: moviesApi.getAllMovies,
  });

  React.useEffect(() => {
    if (movies && id) {
      const foundMovie = movies.find((m: { id: any }) => String(m.id) === id);
      setEditMovie(foundMovie);
      if (foundMovie) {
        form.reset({
          title: foundMovie.title,
          ageRating: foundMovie.ageRating,
          poster: foundMovie.poster,
          producer: foundMovie.producer,
          story: foundMovie.story,
          actors: Array.isArray(foundMovie.actors) ? foundMovie.actors : [],
          duration: foundMovie.duration,
          rating: foundMovie.rating,
          releaseYear: foundMovie.releaseYear,
        });
      }
    }
  }, [movies, id, form]);

  const EditMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Movie> }) =>
      moviesApi.updateMovie(id, updates),
    onSuccess() {
      toast.success("Movie updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      
    },
    onError(error) {
      toast.error("failing update movie");
      console.log(error);
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "actors",
    control: form.control,
  });

  function onSubmit(data: FormValues) {
    if (!id) return;
    const movieData = {
      ...data,
    };

    EditMutation.mutate({
      updates: movieData,
      id: Number(id),
    });
    navigate("/src/pages/movies.tsx ");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-4">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-100">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter movie title"
                    className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ageRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-100">Age Rating</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-purple-950/30 border-purple-800 text-purple-100">
                      <SelectValue placeholder="Select age rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-purple-950 border-purple-800">
                    {ageRatings.map((rating) => (
                      <SelectItem
                        key={rating}
                        value={rating}
                        className="text-purple-100 focus:bg-purple-900 focus:text-purple-50"
                      >
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="poster"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-100">Poster URL</FormLabel>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter poster image URL"
                        className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-purple-300">
                      Enter a valid URL for the movie poster image
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </div>
                  {field.value && (
                    <div className="w-[100px] h-[150px] rounded-md overflow-hidden border border-purple-800">
                      <img
                        src={field.value}
                        alt="Movie poster preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src =
                            "https://placehold.co/100x150/purple/white?text=Invalid+Image";
                        }}
                      />
                    </div>
                  )}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="producer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-100">Producer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter producer name"
                    className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 text-white">
          <FormField
            control={form.control}
            name="story"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-100">Story</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter movie story/plot"
                    className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400 min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-purple-300">
                  Provide a brief summary of the movie plot (50-500 characters)
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="releaseYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Year</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger className="bg-purple-950/30 text-white border-none relative">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    className="bg-purple-900 text-white border-none z-[999] max-h-[200px] overflow-y-auto"
                    position="popper"
                    sideOffset={5}
                  >
                    {Array.from(
                      { length: new Date().getFullYear() - 1888 + 6 },
                      (_, i) => new Date().getFullYear() + 5 - i
                    ).map((year) => (
                      <SelectItem
                        key={year}
                        value={year.toString()}
                        className="hover:bg-purple-700 focus:bg-purple-700 cursor-pointer border-b border-purple-800/50 last:border-b-0"
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the year when this movie was or will be released
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-purple-100">Actors</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-purple-700 text-purple-100 hover:bg-purple-900/50"
              onClick={() => append({ name: "", image: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Actor
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={`actors.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Actor name"
                        className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 items-start">
                <FormField
                  control={form.control}
                  name={`actors.${index}.image`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Actor image URL"
                          className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                {form.watch(`actors.${index}.image`) && (
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-purple-800 flex-shrink-0">
                    <img
                      src={form.watch(`actors.${index}.image`)}
                      alt="Actor preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src =
                          "https://placehold.co/50x50/purple/white?text=Invalid";
                      }}
                    />
                  </div>
                )}
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="bg-red-900 hover:bg-red-800"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {form.formState.errors.actors?.root && (
            <FormMessage className="text-red-400">
              {form.formState.errors.actors.root.message}
            </FormMessage>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-100">Duration</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2h 30min"
                    className="bg-purple-950/30 border-purple-800 text-purple-100 placeholder:text-purple-400"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-purple-300">
                  Format: 2h 30min
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-100">Rating</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    className="bg-purple-950/30 border-purple-800 text-purple-100"
                    {...field}
                    onChange={(event) =>
                      field.onChange(Number.parseFloat(event.target.value))
                    }
                  />
                </FormControl>
                <FormDescription className="text-purple-300">
                  Rate from 0 to 10 (one decimal place)
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/movies")}
            className="text-purple-100 hover:bg-purple-900/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-purple-50"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default EditMovie;
