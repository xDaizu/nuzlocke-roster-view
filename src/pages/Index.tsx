
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-slate-800/90 border-purple-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
            Nuzlocke Tracker
          </CardTitle>
          <CardDescription className="text-slate-300">
            Manage your Pokemon team for Twitch streaming
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/public" className="block">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Public View (Stream Overlay)
            </Button>
          </Link>
          <Link to="/admin" className="block">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              Admin Panel
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
