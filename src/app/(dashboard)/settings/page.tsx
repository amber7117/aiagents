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
import { loggedInUser } from '@/lib/data';

const widgetScript = `
<script>
  window.omniChatConfig = {
    widgetId: "YOUR_WIDGET_ID"
  };
</script>
<script src="https://your-domain.com/widget.js" async defer></script>
`.trim();

export default function SettingsPage() {
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
                    <Button variant="outline">Change Photo</Button>
                </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={loggedInUser.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={loggedInUser.email} />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspace" className="mt-6">
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
              <Button>Save</Button>
            </CardContent>
          </Card>
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
              <Button variant="outline">Copy Script</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
