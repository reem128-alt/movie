import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { moviesApi } from "../services/api";
import { useQuery } from "@tanstack/react-query";
import Loading from "./loading";
import { Movie2 } from "../types/movie";

const MoviesStatistic: React.FC = () => {
  const {
    data: movies = [],
    isLoading,
    error,
  } = useQuery<Movie2[]>({
    queryKey: ["movies"],
    queryFn: moviesApi.getAllMovies,
  });

  if (isLoading) {
    return <Loading size="lg" text="Loading charts..." fullScreen />;
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading movies: {error.message}</div>
    );
  }
  console.log(movies);
  const ratingData = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .map((movie) => ({
      name: movie.title,
      rating: movie.rating,
      year: movie.releaseYear,
    }));

  const viewsData = [...movies]
    .sort((a, b) => b.views - a.views)
    .map((movie) => ({
      name: movie.title,
      views: movie.views / 1000000,
      year: movie.releaseYear,
    }));

  const moviesByYear = movies.reduce((acc, movie) => {
    const year = movie.releaseYear;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const yearData = Object.entries(moviesByYear)
    .map(([year, count]) => ({
      year: Number.parseInt(year),
      count,
      movies: movies
        .filter((m) => m.releaseYear === Number.parseInt(year))
        .map((m) => m.title)
        .join(", "),
    }))
    .sort((a, b) => a.year - b.year);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="col-span-full xl:col-span-2 border-purple-900 bg-gradient-to-br from-purple-950/50 to-black">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-100">
            Top Rated Movies
          </CardTitle>
          <CardDescription className="text-purple-200/70">
            Movie ratings out of 10
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              rating: {
                label: "Rating",
                color: "hsl(267, 100%, 70%)",
              },
            }}
            className="h-[300px]"
          >
            <BarChart
              data={ratingData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 100,
              }}
            >
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fill: "#e9d5ff", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "#e9d5ff" }}
                label={{
                  value: "Rating",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#e9d5ff",
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="bg-purple-950/90 border-purple-700">
                    {(props: { payload: any; }) => {
                      const { payload } = props;
                      return payload && payload[0] ? (
                        <div className="text-purple-100">
                          <p className="font-bold">{payload[0].payload.name}</p>
                          <p>Rating: {payload[0].payload.rating}</p>
                          <p>Year: {payload[0].payload.year}</p>
                        </div>
                      ) : null;
                    }}
                  </ChartTooltipContent>
                }
              />
              <Bar
                dataKey="rating"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-purple-500 hover:fill-purple-400 transition-colors"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full xl:col-span-2 border-purple-900 bg-gradient-to-br from-purple-950/50 to-black">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-100">
            Most Viewed
          </CardTitle>
          <CardDescription className="text-purple-200/70">
            Views in millions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              views: {
                label: "Views (M)",
                color: "hsl(267, 100%, 60%)",
              },
            }}
            className="h-[300px]"
          >
            <BarChart
              data={viewsData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <XAxis
                type="number"
                tick={{ fill: "#e9d5ff" }}
                label={{
                  value: "Views (Millions)",
                  position: "bottom",
                  fill: "#e9d5ff",
                }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                tick={{ fill: "#e9d5ff", fontSize: 12 }}
                interval={0}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="bg-purple-950/90 border-purple-700">
                    {(props: any) => {
                      const { payload } = props;
                      return payload && payload[0] ? (
                        <div className="text-purple-100">
                          <p className="font-bold">{payload[0].payload.name}</p>
                          <p>Views: {payload[0].payload.views}M</p>
                          <p>Year: {payload[0].payload.year}</p>
                        </div>
                      ) : null;
                    }}
                  </ChartTooltipContent>
                }
              />
              <Bar
                dataKey="views"
                fill="currentColor"
                radius={[0, 4, 4, 0]}
                className="fill-purple-500 hover:fill-purple-400 transition-colors"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full border-purple-900 bg-gradient-to-br from-purple-950/50 to-black">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-100">
            Movies by Year
          </CardTitle>
          <CardDescription className="text-purple-200/70">
            Number of movies released per year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Number of Movies",
                color: "hsl(267, 100%, 50%)",
              },
            }}
            className="h-[300px]"
          >
            <LineChart
              data={yearData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <XAxis
                dataKey="year"
                tick={{ fill: "#e9d5ff" }}
                label={{
                  value: "Year",
                  position: "bottom",
                  fill: "#e9d5ff",
                }}
              />
              <YAxis
                tick={{ fill: "#e9d5ff" }}
                label={{
                  value: "Number of Movies",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#e9d5ff",
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="bg-purple-950/90 border-purple-700">
                    {(props: any) => {
                      const { payload } = props;
                      return payload && payload[0] ? (
                        <div className="text-purple-100">
                          <p className="font-bold">
                            Year: {payload[0].payload.year}
                          </p>
                          <p>Movies: {payload[0].payload.count}</p>
                          <p className="text-sm text-purple-300">
                            Titles: {payload[0].payload.movies}
                          </p>
                        </div>
                      ) : null;
                    }}
                  </ChartTooltipContent>
                }
              />
              <Line
                type="monotone"
                dataKey="count"
                strokeWidth={3}
                className="stroke-purple-500"
                dot={{
                  stroke: "hsl(267, 100%, 50%)",
                  strokeWidth: 2,
                  fill: "#000",
                  r: 4,
                }}
                activeDot={{
                  stroke: "hsl(267, 100%, 70%)",
                  strokeWidth: 2,
                  fill: "hsl(267, 100%, 50%)",
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoviesStatistic;
