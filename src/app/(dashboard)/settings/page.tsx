'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@/components/ui/tabs';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { getLoggedInUser } from '@/lib/api';
  import type { User } from '@/lib/types';
  import React, { useState, useEffect } from 'react';
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
  } from '@/components/ui/alert-dialog';
  import { useToast } from '@/hooks/use-toast';
  
  const widgetScript = `
  <script>
    window.omniChatConfig = {
      widgetId: "YOUR_WIDGET_ID"
    };
  </script>
  <script src="https://your-domain.com/widget.js" async defer></script>
  `.trim();
  
  export default function SettingsPage() {
      const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
      const { toast } = useToast();
  
      useEffect(() => {
          const fetchUser = async () => {
          const user = await getLoggedInUser();
          setLoggedInUser(user);
          };
          fetchUser();
      }, []);

      const handleCopyScript = () => {
        navigator.clipboard.writeText(widgetScript).then(() => {
          toast({ description: "Script copied to clipboard." });
        });
      };
  
      if (!loggedInUser) {
          return <div>Loading...</div>; 
      }
  
    return (
      <div className="space-y-6">
         <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and workspace settings.
            </p>
          </div>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="widget">Website Widget</TabsTrigger>
          </TabsList>
  
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  This is how others will see you on the site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                          <AvatarImage src={loggedInUser.avatar} />
                          <AvatarFallback>{loggedInUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" onClick={() => toast({ description: "This feature is not yet implemented." }) }>Change Photo</Button>
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={loggedInUser.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={loggedInUser.email} />
                </div>
                <Button onClick={() => toast({ description: "Profile saved successfully." })}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
  
          <TabsContent value="workspace" className="mt-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Workspace</CardTitle>
                    <CardDescription>
                        Manage your workspace settings and team members.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="workspace-name">Workspace Name</Label>
                        <Input id="workspace-name" defaultValue="OmniChat Demo" />
                    </div>
                    <Button onClick={() => toast({ description: "Workspace settings saved." })}>Save</Button>
                    </CardContent>
                </Card>
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle>Delete Workspace</CardTitle>
                        <CardDescription>
                            Permanently delete this workspace, including all its data. This action cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Workspace</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your workspace and remove your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toast({ title: 'Workspace Deleted', description: 'Your workspace has been successfully deleted.', variant: 'destructive' })}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>
  
          <TabsContent value="widget" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Widget</CardTitle>
                <CardDescription>
                  Embed the OmniChat widget on your website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="widget-script">Embed Script</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Copy and paste this script into the &lt;head&gt; section of your website.
                  </p>
                  <pre className="overflow-x-auto rounded-md bg-muted p-4 font-code text-sm text-muted-foreground">
                    <code>{widgetScript}</code>
                  </pre>
                </div>
                <Button variant="outline" onClick={handleCopyScript}>Copy Script</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
