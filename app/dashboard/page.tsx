import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserLinks } from "@/data/links";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }
  
  const userLinks = await getUserLinks(userId);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your shortened links
        </p>
      </div>
      
      {userLinks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No links yet</CardTitle>
            <CardDescription>
              Create your first shortened link to get started
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Links</h2>
          <div className="grid gap-4">
            {userLinks.map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium break-all">
                    {link.shortCode}
                  </CardTitle>
                  <CardDescription className="break-all">
                    {link.url}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div>
                      Short Code: <span className="font-mono">/{link.shortCode}</span>
                    </div>
                    <div>
                      Created: {new Date(link.createdAt).toLocaleDateString()} at {new Date(link.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
