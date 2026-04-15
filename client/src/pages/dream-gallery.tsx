import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { useDreams } from "@/hooks/use-dream";
import { useState } from "react";

// Remove hardcoded sample dreams since we're using the API

export default function DreamGallery() {
  const { data: dreams, isLoading, error } = useDreams();
  const [selectedDream, setSelectedDream] = useState<string | null>(null);

  console.log('Dream Gallery data:', { 
    dreams, 
    loading: isLoading, 
    error: error?.message,
    count: dreams?.length 
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Draft": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Abandoned": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCoreTypeColor = (coreType: string) => {
    switch (coreType) {
      case "Vision": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Tool": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Movement": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Story": return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Dream Gallery</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore innovative dreams from our community. Each dream represents a unique vision, tool, movement, or story that could reshape the world.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="ml-2 text-gray-400">Loading dreams...</span>
        </div>
      )}

      {error && !dreams && !isLoading && (
        <div className="text-center py-12">
          <p className="text-red-400">Failed to load dreams. Please try again later.</p>
        </div>
      )}

      {dreams && dreams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreams.map((dream) => (
          <Card key={dream.id} className="bg-gray-900/50 border-gray-700 hover:border-cyan-500/50 transition-colors duration-300">
            <CardHeader className="pb-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                <img 
                  src={dream.image} 
                  alt={dream.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-white text-lg leading-tight">
                  {dream.name}
                </CardTitle>
                <div className="flex flex-col gap-1">
                  <Badge className={getStatusColor(dream.status || "Draft")}>
                    {dream.status || "Draft"}
                  </Badge>
                  <Badge className={getCoreTypeColor(dream.coreType || "Vision")}>
                    {dream.coreType || "Vision"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm line-clamp-3">
                {dream.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {dream.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Score: <span className="text-cyan-400 font-semibold">{dream.score}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {dream.evolved && <span className="text-green-400">Evolved</span>}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Creator: {dream.creator.slice(0, 6)}...{dream.creator.slice(-4)}
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-gray-600 hover:border-cyan-500"
                  onClick={() => setSelectedDream(dream.id)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 hover:border-red-500">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 hover:border-blue-500">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 hover:border-green-500">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {dreams && dreams.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-400">No dreams found.</p>
        </div>
      )}
      
      <div className="text-center">
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          Load More Dreams
        </Button>
      </div>
    </div>
  );
}